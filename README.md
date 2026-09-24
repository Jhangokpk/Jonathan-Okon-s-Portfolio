# Jonathan Okon — Portfolio

A single-page portfolio site. Plain HTML/CSS/JS, no build step, no dependencies.

```
portfolio/
├── index.html
├── robots.txt
├── sitemap.xml
├── css/style.css
├── js/script.js
├── assets/
│   ├── jonathan-okon.jpg          (headshot)
│   ├── Jonathan-Okon-Resume.pdf
│   ├── Recommendation-Letter.pdf
│   ├── og-image.jpg               (link-preview image for social shares)
│   └── certificates/              (33 real certificate PDFs)
├── netlify.toml
└── README.md
```

Clicking an experience entry or a credential tile opens an in-page dialog (no navigation away from the site). The Contact section lists email, WhatsApp, and phone directly, and includes a message form.

### Viewing documents (certificates, résumé, recommendation letter)

Every certificate, the résumé, and the recommendation letter open in an in-page preview dialog (embedded PDF in an `<iframe>`) with a **Download PDF** button inside — nothing downloads immediately on click. This is wired generically: any element with `data-pdf-src="path/to/file.pdf"`, `data-pdf-title="..."`, and `data-pdf-kicker="..."` will open the shared viewer (`#pdf-modal` in `index.html`) when clicked — see `js/script.js`.

One thing worth knowing: some browsers (mainly older mobile Safari) render inline PDFs inconsistently. The Download button is the fallback for that.

### How contact works

- **Email** — a `mailto:` link. Opens the visitor's own mail app, addressed to Jonathan.
- **WhatsApp** — a `wa.me` link with a pre-filled message ("Hello Jonathan, my name is ____..."). It opens WhatsApp with that text already in the box — WhatsApp itself never allows a link to send automatically, so the visitor still taps Send.
- **Call** — a `tel:` link, dials on mobile / opens the desktop calling app.
- **Message form** — wired to **Netlify Forms**, with Netlify's built-in reCAPTCHA (no Google account needed — Netlify provides the keys automatically once it detects `data-netlify-recaptcha="true"` in the deployed HTML). It submits as a normal form POST (not AJAX) — Netlify's reCAPTCHA verification is unreliable over fetch/AJAX, so this deliberately lets the browser do a real submit. It redirects back to `/?sent=true#contact` — the homepage itself, not a separate success page — and a small script on load detects `sent=true`, shows "Thanks — your message is on its way" in place of the form, and cleans the URL back up. (An earlier version pointed at a dedicated `thanks.html`, but that 404'd on the live deploy, so this version depends on nothing but the homepage, which is guaranteed to exist.) It only works once the site is deployed on Netlify (not on `file://`, not on GitHub Pages). One-time setup after your first deploy:
  1. Netlify dashboard → your site → **Forms**. You should see a form named `contact` appear after the first deploy. If it's not there, trigger a fresh deploy (**Deploys → Trigger deploy → Clear cache and deploy site**) — Netlify only scans the HTML for forms at deploy time.
  2. **Settings → Forms → Form notifications → Add notification → Email notification**.
  3. Set the "to" address to `jonathaneyookon@gmail.com` and save.
  4. From then on, every submission emails you automatically. This one step has to happen in the Netlify dashboard — there's no way to wire it up from the code itself, since it's tied to your Netlify account.

### Credentials

Each item in the Credentials dialogs now links to the real certificate PDF (in `assets/certificates/`) — clicking downloads it directly, no "email me" needed.

Two items from the earlier draft aren't included, since they couldn't be verified against a file in what you uploaded:
- **Professional Etiquette** — listed on your résumé, but no certificate file was in the upload. Add it back into the Foundational list in `index.html` (and drop the file into `assets/certificates/`) if you have it elsewhere.
- **GSA XVII Certificate** (Green Switch Academy / Plogging Nigeria) — a sustainability-program certificate of participation, not HR/admin-related, so it didn't fit this site's focus. It's still in your original upload if you want it for a different context.

### This round's other fixes

- **SEO / structured data** — added a JSON-LD `Person` block (name, role, location, alumni), plus `robots.txt` and `sitemap.xml`, so search engines have something concrete to index instead of guessing.
- **Image loading** — the hero portrait now has explicit `width`/`height` so the browser reserves space for it before it loads (prevents a small layout jump), and it's preloaded in `<head>` since it's the first thing visitors see.
- **Security headers** — `netlify.toml` now also sets a `Content-Security-Policy`, `Referrer-Policy`, and `Permissions-Policy`. Worth knowing: the CSP is scoped to exactly what this site uses (Google Fonts, Netlify's reCAPTCHA, same-origin PDF previews) — if you add another external script or embed later, you'll need to add its domain to the relevant CSP directive or it'll get silently blocked.
- **Active nav highlight** — the top nav now highlights whichever section is currently in view as you scroll.
- **Favicon** — replaced the plain "J" with a small dark/gold "JO" monogram matching the nav mark.
- **Print stylesheet** — printing the page (Ctrl+P) now gives a clean black-on-white layout instead of the dark theme as-is. One limitation: since certificates and experience details only exist inside JS-driven dialogs, they won't appear on the printed page — only what's visible on the page itself prints.
- Netlify Analytics or a privacy-friendly tool like Plausible would tell you whether anyone's actually visiting, but that's an opt-in dashboard/account decision, not something to wire into the code by default.

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
- [ ] Update `<meta name="description">` in `index.html` if your focus changes
- [ ] If the deployed URL ever changes from `jonathan-okon-portfolio.netlify.app`, update the `og:url` / `og:image` / `twitter:image` meta tags in `index.html` to match, or link previews will point at the old URL

Note on icons: the mail, WhatsApp, and phone icons in the Contact section are simple line/glyph icons Claude drew to represent each channel — not the official trademarked WhatsApp logo. Swap in official brand assets yourself if you'd prefer exact logos.

## Editing content

Everything is in `index.html` — experience entries and credential lists are plain HTML inside `<div class="modal">` blocks near the bottom of the file, matched to their trigger by `data-open-modal` / `id`. Colours and type live in `css/style.css` under `:root`.
