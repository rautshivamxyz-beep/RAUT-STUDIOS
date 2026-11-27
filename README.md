# Raut Studio — website + admin panel

A five-page static site that lists every app **and every file** you publish,
with an admin panel for adding new ones.

No build step, no framework, no database, no server. ₹0 to run.

## What is in the folder

```
index.html            Home: hero, all apps, latest files, how it works
apps.html             Every app, with version and download buttons
files.html            Full download table: apps, checksums, patches, documents
install.html          Android + Windows steps, checksum commands, troubleshooting
about.html            The studio, how releases work, principles
404.html              Shown for a wrong address

assets/site.css       One stylesheet for every page
assets/site.js        Renders app cards and file rows, mobile menu, footer year
assets/icon.svg       Logo

content/apps.json     The app list      ← edited by the admin panel
content/files.json    The download list  ← edited by the admin panel

admin-editor.html     Offline editor: edit content, download updated JSON
.pages.yml            Hosted admin panel config (Pages CMS)
_headers              Security headers for Cloudflare Pages
netlify.toml          Same headers, if you host on Netlify instead

SETUP.md              Step-by-step: GitHub, hosting, admin panel
```

The two JSON files are the single source of truth. The home page, the apps page
and the files page all render from them, so adding an app is a one-file change,
not three.

## Two ways to edit the content

**1. `admin-editor.html` — offline, no accounts, no setup.**
Double-click it, edit the forms, download `apps.json` and `files.json`, replace
the files in `content/`, re-upload. Done.

**2. Pages CMS — hosted panel, works from your browser on any device.**
Sign in with GitHub, edit, and it commits for you. Needs the files in a GitHub
repo. Steps in `SETUP.md`.

## How the admin panel works

There is **no password inside these files** — and that is deliberate. A password
written into static HTML can be read by anyone who opens the page source, so it
is not security, it is decoration.

Instead the panel is **Pages CMS**: a free editor that signs you in with GitHub
and writes directly to your repository. It needs no server, no database and no
paid plan, and it works on any host.

Setup is in `SETUP.md` — three steps, about ten minutes.

**Why the site must be in a GitHub repository:** the panel saves by committing
to a repo. No repo means nowhere to save, which is why a drag-and-drop-only
site cannot have a working panel.

## Test it locally

Double-clicking `index.html` shows the layout but not the app cards — browsers
block `fetch` on `file://`. Run a small server instead:

```bash
cd this-folder
python3 -m http.server 8000
```

Then open http://localhost:8000

## Publishing

**Cloudflare Pages** (recommended: unlimited bandwidth, no badge, no credit
meter): Workers & Pages → Create → Pages → Upload assets → drag this folder in.

**Netlify** (easiest interface, but 300 credits/month and a "Powered by Netlify"
badge on the Free plan): drag this folder onto app.netlify.com/drop.

**GitHub Pages** (no extra account): push to a repo, then Settings → Pages.

## Adding an app or a file

Edit `content/apps.json` or `content/files.json` — with the panel, or by hand on
GitHub. A file entry looks like this:

```json
{
  "name": "my-guide.pdf",
  "app": "NOVA",
  "desc": "User guide",
  "kind": "Document",
  "size": "2.4 MB",
  "url": "https://github.com/.../my-guide.pdf"
}
```

`kind` can be: App, Checksum, Patch, Document, Archive, Other.

In `apps.json`, set `"featured": true` to show an app on the home page.

## Notes

- **Files over 25 MiB cannot be uploaded to Cloudflare Pages.** Put APKs and
  large ZIPs on GitHub Releases and link them — that is what the current
  entries already do, and it keeps downloads free.
- The hero visual is CSS, not a screenshot. Replace the `.shelf` block in
  `index.html` with a real image when you have one.
- `_headers` (Cloudflare) and `netlify.toml` (Netlify) do the same job. Keep
  whichever host you use; delete the other if you like.
