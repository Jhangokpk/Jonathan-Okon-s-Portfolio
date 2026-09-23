# Jonathan Okon — Portfolio

A single-page portfolio site. Plain HTML/CSS/JS, no build step, no dependencies.

```
portfolio/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── jonathan-okon.jpg          (headshot)
│   ├── Jonathan-Okon-Resume.pdf
│   ├── Recommendation-Letter.pdf
│   └── og-image.jpg               (link-preview image for social shares)
├── netlify.toml
└── README.md
```

Clicking an experience entry or a credential tile opens an in-page dialog (no navigation away from the site). The Contact section lists email, WhatsApp, and phone directly, and includes a message form.

### How contact works

- **Email** — a `mailto:` link. Opens the visitor's own mail app, addressed to Jonathan.
- **WhatsApp** — a `wa.me` link with a pre-filled message ("Hello Jonathan, my name is ____..."). It opens WhatsApp with that text already in the box — WhatsApp itself never allows a link to send automatically, so the visitor still taps Send.
- **Call** — a `tel:` link, dials on mobile / opens the desktop calling app.
- **Message form** — wired to **Netlify Forms**, with Netlify's built-in reCAPTCHA (no Google account needed — Netlify provides the keys automatically once it detects `data-netlify-recaptcha="true"` in the deployed HTML). No backend code needed, but it only works once the site is deployed on Netlify (not on `file://`, not on GitHub Pages). One-time setup after your first deploy:
  1. Netlify dashboard → your site → **Forms**. You should see a form named `contact` appear after the first deploy.
  2. **Settings → Forms → Form notifications → Add notification → Email notification**.
  3. Set the "to" address to `jonathaneyookon@gmail.com` and save.
  4. From then on, every submission emails you automatically.

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
- [ ] Double-check `mailto:`, `wa.me`, and `tel:` links in `index.html` if your email or number ever changes
- [ ] Turn on the email notification for the contact form (see above) — it's off by default until you set it
- [ ] Swap in real certificate files or a shared-drive link once you have somewhere to host the actual PDFs (the credential dialogs currently list titles only, grouped by issuer)
- [ ] Update `<meta name="description">` in `index.html` if your focus changes
- [ ] If the deployed URL ever changes from `jonathan-okon-portfolio.netlify.app`, update the `og:url` / `og:image` / `twitter:image` meta tags in `index.html` to match, or link previews will point at the old URL

Note on icons: the mail, WhatsApp, and phone icons in the Contact section are simple line/glyph icons Claude drew to represent each channel — not the official trademarked WhatsApp logo. Swap in official brand assets yourself if you'd prefer exact logos.

## Editing content

Everything is in `index.html` — experience entries and credential lists are plain HTML inside `<div class="modal">` blocks near the bottom of the file, matched to their trigger by `data-open-modal` / `id`. Colours and type live in `css/style.css` under `:root`.
