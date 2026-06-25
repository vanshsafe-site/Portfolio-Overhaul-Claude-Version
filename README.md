# Portfolio Overhaul

A modern portfolio platform built by Vansh Garg. This repo converts a static portfolio into a database-driven site with Supabase-backed content, an admin panel, and a polished responsive UI.

## 🚀 What it is

- A personal portfolio website with projects, ventures, and achievements
- Admin pages for creating, editing, and deleting content
- Supabase database and storage integration for dynamic content and image uploads
- Lightweight frontend using plain HTML, CSS, and vanilla JavaScript
- Responsive design with theme switching and image fullscreen support

## ✨ Features

- Portfolio landing page and detail pages for:
  - Projects
  - Ventures
  - Achievements
- Admin panel pages at `admin/` for managing content
- Supabase storage for certificate and project images
- Live achievement certificate preview and fullscreen image view
- Search/filter support in admin lists
- Theme toggle with persisted user preference

## 🧭 Repository structure

- `index.html` — Homepage
- `projects.html`, `project.html` — Projects list and detail pages
- `ventures.html`, `venture.html` — Ventures list and detail pages
- `achievements.html`, `achievement.html` — Achievements list and detail pages
- `contact.html`, `about.html` — Static site pages
- `admin/` — Admin panel UI
  - `admin/dashboard.html`
  - `admin/projects.html`
  - `admin/ventures.html`
  - `admin/achievements.html`
  - `admin/login.html`
- `js/app.js` — Main site and admin app logic
- `js/admin.js` — Admin page UI enhancements
- `css/style.css` — Main styling
- `css/admin.css` — Admin panel styling
- `docs/` — Project documentation and context

## 🛠️ Tech stack

- HTML, CSS, JavaScript
- Supabase (database + storage)
- No build tools required

## ▶️ Local setup

This project can run from any static file server. Example options:

### Option 1: Open directly

- Open `index.html` or any page in your browser
- Recommended: use a local server for correct routing and file loading

### Option 2: Use Python’s simple HTTP server

```bash
cd "g:\Portfolio Overhaul 2026 - Copy"
python -m http.server 8000
```

Then visit: `http://localhost:8000`

### Option 3: Use VS Code Live Server

- Install the Live Server extension
- Open the workspace root
- Start Live Server

## 🔐 Supabase

The application uses Supabase for content and image storage.

- `js/app.js` contains the Supabase URL and anon key
- `portfolio-images` storage bucket holds uploaded certificate/project images
- Admin image uploads write the public image URL into record fields

> Note: If you reuse this code for a different project, replace the Supabase URL and anon key with your own credentials.

## 📌 Notes

- Achievement detail pages now render the certificate image below the description
- Clicking the certificate toggles fullscreen mode
- Uploaded certificate URLs are visible in the admin achievement form

## 💡 Suggested improvements

- Add environment-based Supabase config instead of hardcoded keys
- Add validation and feedback for all admin forms
- Enhance mobile accessibility for fullscreen image exit

## 📄 Documentation

See the `docs/` folder for project context and planning notes.

---

Built by Vansh Garg.
