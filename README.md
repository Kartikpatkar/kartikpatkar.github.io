# Kartik Patkar Portfolio

Simple personal portfolio site built with HTML, CSS, and vanilla JavaScript. It is designed to run as a static site and deploy directly to GitHub Pages.

## Project structure

- `index.html` - page shell
- `data/portfolio-content.js` - main portfolio content (certifications, projects, experience, skills)
- `data/portfolio-config.js` - UI settings and labels
- `data/avatar-definition.js` - bundled avatar companion definition
- `scripts/` - app logic, section rendering, and interactive avatar companion
  - `scripts/ui/avatar-controller.js` - companion dialogue engine, section docking, and site interactions
- `styles/` - layout, components, section styles, and companion animations
- `assets/` - icons, images, resumes, and procedural avatar assets (`assets/avatar/kartik-avatar.json`)

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
- projects (project count in hero & avatar dialogue auto-updates)
- experience (years of experience auto-calculates from job start date)
- certifications (cert count in hero & avatar dialogue auto-updates)
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
- Pure vanilla HTML, CSS, and JS.
- Experience years automatically calculate from October 2020.
- Interactive AI avatar companion guides visitors with contextual dialogue per section.
- The contact form uses `mailto:`.
- The main preview image is `assets/images/portfolio-preview.png`.
- The resume files are `assets/Kartik-Patkar-ATS-Resume.pdf` and `assets/Kartik-Patkar-Resume.pdf`.
