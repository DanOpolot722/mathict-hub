# Mr. Opolot Dan — Mathematics & ICT Learning Hub

A static, responsive educational website for Mr. Opolot Dan, a qualified Secondary School Teacher of Mathematics and ICT in Uganda. Built with plain HTML5, CSS3 and JavaScript — no build step, no framework, ready to host on GitHub Pages.

## Folder structure

```
mathict-hub/
├── index.html            Home page
├── about.html             About page
├── resources.html        Learning Resources (Mathematics + ICT, tabs + search + Google Drive)
├── support.html            Student Support (forms that open WhatsApp)
├── announcements.html    Announcements
├── admin.html               Admin panel (passcode-protected, browser-only)
├── css/
│   └── style.css              All styling, theme tokens, dark mode
├── js/
│   ├── config.js               ⭐ Edit this file to update contact info & Drive folders
│   ├── main.js                Navigation, dark mode, WhatsApp popup, counters
│   ├── drive.js                 Google Drive folder embedding
│   ├── search.js               Resource search + tab switching
│   ├── forms.js                 Support-page forms → WhatsApp
│   ├── announcements.js  Renders admin-posted announcements
│   └── admin.js                 Admin panel logic (localStorage demo)
└── README.md
```

## 1. Update your contact details

Open **`js/config.js`**. This is the only file you normally need to touch:

```js
const SITE_CONFIG = {
  teacherName: "Mr. Opolot Dan",
  whatsappNumber: "256763060114",     // digits only, no + or spaces
  driveEmail: "trdanopolot@gmail.com",
  driveFolders: {
    mathematics:   "GOOGLE_DRIVE_MATH_FOLDER_ID",
    ict:           "GOOGLE_DRIVE_ICT_FOLDER_ID",
    pastPapers:    "GOOGLE_DRIVE_PAST_PAPERS_FOLDER_ID",
    assignments:   "GOOGLE_DRIVE_ASSIGNMENTS_FOLDER_ID",
    markingGuides: "GOOGLE_DRIVE_MARKING_GUIDES_FOLDER_ID"
  }
};
```

## Premium resources & ordering via WhatsApp

Resources on `resources.html` are marked **Premium**. The "Order via WhatsApp" button on each resource card doesn't download a file — it opens a WhatsApp chat pre-filled with the resource's name, so the student and teacher can arrange payment/delivery directly. This is handled in `js/main.js` (see `initResourceCounter`, which listens for `[data-order-resource]` clicks) and needs no server.

If you upload real files to the Google Drive folders in step 2, treat those Drive folders as **free preview material only** — the "live from Google Drive" sections are separate from the premium, order-only resource cards above them. If you don't want any freely browsable files, you can remove the `data-drive-folder` embeds from `resources.html`, or leave the folder IDs blank.

## 2. Connect your Google Drive folders

1. In Google Drive (signed in as `trdanopolot@gmail.com`), create five folders: **Mathematics**, **ICT**, **Past Papers**, **Assignments**, **Marking Guides**.
2. For each folder: right-click → **Share** → set access to **"Anyone with the link" → Viewer**.
3. Open the folder and copy the ID from its URL:
   `https://drive.google.com/drive/folders/`**`1AbCдEfGhIjKlMnOpQrStUvWxYz`** ← this part
4. Paste each ID into the matching field in `js/config.js`.
5. The Resources page will automatically show a live, embedded file list for each folder (no API key needed) — no code changes required beyond step 4.

> The individual resource cards on the Resources page (e.g. "Senior 1 Mathematics Notes") are example placeholders with `#` links — replace each `href="#"` with a direct Google Drive file link once you've uploaded the real files, or leave the live folder embeds at the bottom of each section as the primary source.

## 3. Update the WhatsApp number

Change `whatsappNumber` in `js/config.js`. Use the full international number, digits only (no `+`, spaces or leading `0`). Example for `+256 763 060 114`: `"256763060114"`.

Every WhatsApp button and the floating chat popup across all six pages read from this one value.

## 4. Announcements & the admin panel

- Visit `admin.html` and sign in with the passcode set in `js/admin.js` (`ADMIN_PASSCODE`, default `opolot2026` — **change this before sharing the link**).
- Posts you add are saved in the browser's local storage and appear on `announcements.html` **in that same browser**. This keeps the site free to host with no backend, but it means announcements won't automatically sync across different visitors' devices.
- For announcements visible to *all* visitors from any device, either:
  - manually edit the static example entries inside `announcements.html`, or
  - connect a small backend (Google Sheets + Apps Script, Firebase, or similar) — the render functions in `js/admin.js` and `js/announcements.js` are the only places you'd need to point at a real API.

## 5. Local preview

No build tools are required. From this folder, run any static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## 6. Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `mathict-hub`).
2. Push this folder's contents to the repository's `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/mathict-hub.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch **main**, folder **/ (root)**, then **Save**.
6. After a minute, your site will be live at:
   `https://<your-username>.github.io/mathict-hub/`

## Features included

- Responsive, mobile-friendly layout with a collapsible nav menu
- Dark mode toggle (saved per browser)
- Floating WhatsApp button + pre-filled chat popup on every page
- Resource search and Mathematics/ICT tabs on the Resources page
- Live Google Drive folder embeds (no API key required)
- Student Support forms that compile straight into a WhatsApp message
- Announcements page with categorised badges + admin posting
- Visitor and download counters (browser-local demo counters)
- Breadcrumb navigation, back-to-top button, file-type icons
- SEO meta tags targeting Mathematics/ICT-teacher-Uganda search terms

## Notes on the "counters" and "admin" features

This is a static site with no server, so the visitor counter, download counter, and admin panel are all **browser-local** (stored via `localStorage`) rather than shared across every visitor globally. This keeps hosting free and simple. If you later want true site-wide counters or a multi-device admin panel, the cleanest upgrade path is a lightweight backend such as Firebase, Supabase, or a Cloudflare Worker — the JavaScript files are structured so only `js/admin.js`, `js/announcements.js`, and the counter functions in `js/main.js` would need to change.
