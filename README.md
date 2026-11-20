# Green Market — جرين ماركت 🌿

A link card / landing page for Green Market: Facebook, Instagram, WhatsApp, Google Maps,
a "احكيلنا اللي في بالك" message box, and a 5-star rating.

## Structure
```
index.html          # the page
config.js           # all links + the feedback channel live here
assets/cover.jpg    # cover image
assets/logo.jpg     # logo (avatar)
apps-script/Code.gs # optional backend (Google Sheet + email/Telegram to Diaa)
```

## Deploy on GitHub Pages
1. Push this folder to a repo (e.g. `green-market`).
2. Settings → Pages → Source: `Deploy from a branch` → `main` / root.
3. Live at `https://<user>.github.io/green-market/` (a custom domain can be added in the same screen).

## Feedback channel (`config.js → feedback.mode`)
| mode | how it reaches Diaa | setup |
|---|---|---|
| `whatsapp` | opens WhatsApp with the message pre-filled to Diaa's number; the visitor taps send | none — works now |
| `apps_script` | saved to a Google Sheet + email to Diaa (+ optional Telegram) | ~5 min, see `apps-script/Code.gs` |
| `web3forms` (**active**) | email to deyaaaboubead@gmail.com | enter that email at web3forms.com, copy the key from the inbox into `config.js → web3formsKey` |

---
Developed by [NADIM ALAMLEH](https://nadimalamleh.com/)
