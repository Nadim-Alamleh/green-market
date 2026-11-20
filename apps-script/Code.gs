/**
 * Green Market — استقبال الرسائل والتقييمات
 * بيحفظ كل رسالة/تقييم بـ Google Sheet وببعت إيميل لضياء (واختيارياً تيليجرام).
 *
 * الخطوات:
 * 1) اعمل Google Sheet جديد  ←  Extensions  ←  Apps Script  ←  الصق هالكود.
 * 2) عدّل DIAA_EMAIL (واختيارياً TELEGRAM_*).
 * 3) Deploy ← New deployment ← Web app
 *      Execute as: Me   |   Who has access: Anyone
 * 4) انسخ رابط /exec وحطه بـ config.js  ← appsScriptUrl  واجعل mode: "apps_script"
 */
const DIAA_EMAIL = 'diaa@example.com';
const TELEGRAM_BOT_TOKEN = '';   // اختياري: من @BotFather
const TELEGRAM_CHAT_ID   = '';   // اختياري: chat id تبع ضياء

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (d.website) return out({ ok: true }); // honeypot
    const type = d.type === 'rating' ? 'rating' : 'idea';
    const clean = s => String(s || '').slice(0, 1000);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(type) || ss.insertSheet(type);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(type === 'rating' ? ['الوقت', 'النجوم', 'التعليق'] : ['الوقت', 'الاسم', 'الرسالة']);
    }
    const now = new Date();
    let text;
    if (type === 'rating') {
      const r = Math.max(1, Math.min(5, parseInt(d.rating, 10) || 0));
      sheet.appendRow([now, r, clean(d.comment)]);
      text = '⭐ تقييم جديد: ' + '★'.repeat(r) + '☆'.repeat(5 - r) + ' (' + r + '/5)\n' + (clean(d.comment) || '—');
    } else {
      sheet.appendRow([now, clean(d.name), clean(d.message)]);
      text = '💡 رسالة جديدة من صفحة جرين ماركت\nالاسم: ' + (clean(d.name) || '—') + '\n\n' + clean(d.message);
    }

    if (DIAA_EMAIL) MailApp.sendEmail(DIAA_EMAIL, 'Green Market — ' + (type === 'rating' ? 'تقييم جديد' : 'رسالة جديدة'), text);
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method: 'post', contentType: 'application/json',
        payload: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
      });
    }
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
