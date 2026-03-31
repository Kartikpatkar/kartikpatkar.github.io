# Kartik Patkar — Personal Developer Portfolio

Single-page, modern, responsive portfolio website built with **HTML5 + CSS3 + Vanilla JS** and designed to deploy cleanly on **GitHub Pages**.

## Sections

- Navbar (sticky + active section highlight + mobile hamburger)
- Hero
- About
- Skills
- Projects
- Experience
- Contact (mailto-based, no backend)
- Footer

## Run locally

Option 1 (VS Code): install **Live Server** and open `index.html`.

Option 2 (Python):

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173

## Deploy (GitHub Pages)

This repo is compatible with **GitHub Pages** using:

- Branch: `main`
- Folder: `/ (root)`

After pushing to GitHub:

1. Go to **Settings → Pages**
2. Set **Source** to `Deploy from a branch`
3. Choose `main` + `/ (root)`

## Customize

### Update portfolio content
Edit:

- `data/portfolio-content.js`

This file contains the editable portfolio content for:

- Name, role, email, LinkedIn, GitHub, resume path
- Hero text and social links
- About summary, snapshot, expertise chips
- Skills
- Projects
- Experience
- Contact text

### Update UI/configuration
Edit:

- `data/portfolio-config.js`

This file contains UI switches and labels for things like:

- Showing or hiding hero UI elements
- Showing or hiding project badges/icons/buttons
- Button label text

You should not need to edit `index.html` for normal content updates.

### Replace the profile photo
Replace:

- `assets/images/profile-placeholder.svg`

with your image (keep the same filename), or update the `<img src="...">` in `index.html`.

You can also change the image path in `data/portfolio-content.js`.

### Replace the resume
Replace:

- `assets/Kartik-Patkar-Resume.pdf`

with your real PDF resume (keeping the same filename keeps the download button working).

You can also change the resume path in `data/portfolio-content.js`.

## Notes

- The contact form uses `mailto:` to stay backend-free and GitHub Pages friendly.
- Scroll reveal animations are implemented with `IntersectionObserver` and automatically disabled when the user has **Reduce Motion** enabled.
