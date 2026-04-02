# Kartik Patkar Portfolio

Simple personal portfolio site built with HTML, CSS, and vanilla JavaScript. It is designed to run as a static site and deploy directly to GitHub Pages.

## Project structure

- `index.html` - page shell
- `data/portfolio-content.js` - main portfolio content
- `data/portfolio-config.js` - UI settings and labels
- `scripts/` - app logic and section rendering
- `styles/` - layout, components, and section styles
- `assets/` - icons, images, and resume

## Run locally

Use any static server. For example:

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## Edit content

Most updates can be done in `data/portfolio-content.js`.

Use this file to change:

- name, role, and contact details
- hero text
- skills
- projects
- experience
- certifications
- resume path

Use `data/portfolio-config.js` for simple UI toggles and labels.

## Deploy

This repo works with GitHub Pages from the repository root.

1. Push the repo to GitHub.
2. Open repository Settings.
3. Go to Pages.
4. Set the source to `main` and `/ (root)`.

## Notes

- No build step is required.
- The contact form uses `mailto:`.
- The main preview image is `assets/images/portfolio-preview.png`.
- The resume file is `assets/Kartik-Patkar-Resume.pdf`.
