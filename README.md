# Jonathan Okon — Portfolio

A single-page portfolio site. Plain HTML/CSS/JS, no build step, no dependencies.

```
portfolio/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── jonathan-okon.jpg      (headshot)
│   └── Jonathan-Okon-Resume.pdf
├── netlify.toml
└── README.md
```

Clicking an experience entry or a credential tile opens an in-page dialog (no navigation away from the site). "Get in touch" opens a contact dialog with email, WhatsApp, and phone.

## Push to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy on Netlify

**Option A — connect the repo (recommended, auto-deploys on every push):**
1. netlify.com → **Add new site → Import an existing project**
2. Pick the GitHub repo you just pushed
3. Build command: leave blank · Publish directory: `.` (already set in `netlify.toml`)
4. Deploy

**Option B — drag and drop (no GitHub needed):**
1. netlify.com → **Add new site → Deploy manually**
2. Drag the whole `portfolio` folder onto the page

## Before you go live

- [ ] Swap in a custom domain, or set a nicer Netlify subdomain under **Site settings → Domain management**
- [ ] Double-check `mailto:` and `wa.me` links in `index.html` if your email or number ever changes
- [ ] Swap in real certificate files or a shared-drive link once you have somewhere to host the actual PDFs (the credential dialogs currently list titles only, grouped by issuer)
- [ ] Update `<meta name="description">` in `index.html` if your focus changes

## Editing content

Everything is in `index.html` — experience entries and credential lists are plain HTML inside `<div class="modal">` blocks near the bottom of the file, matched to their trigger by `data-open-modal` / `id`. Colours and type live in `css/style.css` under `:root`.
