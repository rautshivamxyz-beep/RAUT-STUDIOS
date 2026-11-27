# Setup — 10 minutes, ₹0

You need two things: a place to host the files (Cloudflare Pages), and a
GitHub repository so the admin panel has somewhere to save.

## 1. Put the files on GitHub

1. Go to github.com/new → name it `raut-studio-site` → **Public** → Create.
2. On the empty repo, click **Add file → Upload files**.
3. Unzip this folder and drag **all the files and folders** in (not the zip).
4. Click **Commit changes**.

## 2. Host it on Cloudflare Pages

1. Go to dash.cloudflare.com → sign up (no card needed).
2. **Workers & Pages → Create → Pages → Upload assets**.
3. Project name: `raut-studio`. Drag the same folder in. Deploy.
4. Your site is live at `https://raut-studio.pages.dev`.

## 3a. The quickest panel: admin-editor.html (no accounts)

Open `admin-editor.html` by double-clicking it. It runs on your own computer.

- **Apps** tab and **Downloads** tab, each with a form per item
- Add, edit or remove anything
- Press **Download apps.json** and **Download files.json**
- Replace the two files in the `content` folder with the downloaded ones
- Re-upload the site folder to your host

No login, no account, no GitHub, nothing to configure. It is not a login screen
because there is no server to log in to — it edits files locally and hands them
back to you.

## 3b. The hosted panel: Pages CMS (optional)

1. Go to **app.pagescms.org** and sign in with GitHub.
2. Install its GitHub App on your `raut-studio-site` repository.
3. Open that repository inside Pages CMS.
4. You now have two editors: **Apps** and **Downloads**.

Editing works because `.pages.yml` in this folder tells Pages CMS which fields
exist. Saving commits to GitHub. Nothing to pay for and no server to run.

## Editing without the panel

Open `content/apps.json` or `content/files.json` on GitHub, click the pencil,
edit, commit. Netlify or Cloudflare republishes within a minute.

## Adding a file to the downloads table

Add an entry to `content/files.json`:

```json
{
  "name": "my-file.pdf",
  "app": "NOVA",
  "desc": "User guide",
  "kind": "Document",
  "size": "2.4 MB",
  "url": "https://github.com/.../my-file.pdf"
}
```

`kind` can be: App, Checksum, Patch, Document, Archive, Other.

## Notes

- Files over 25 MiB cannot be uploaded to Cloudflare Pages. Put those on GitHub
  Releases and link them, which is what the current entries already do.
- `_headers` sets the security headers on Cloudflare. `netlify.toml` does the
  same job if you ever host on Netlify instead.
