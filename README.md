# Kartik Patkar Portfolio

Simple personal portfolio site built with HTML, CSS, and vanilla JavaScript. It is designed to run as a static site and deploy directly to GitHub Pages.

## Project structure

- `index.html` - page shell and semantic layout
- `data/portfolio-content.js` - main portfolio content (certifications, projects, experience, skills)
- `data/portfolio-config.js` - UI settings and labels
- `data/avatar-definition.js` - bundled avatar companion definition
- `scripts/` - app logic, section rendering, and interactive components
  - `scripts/bundle-css.py` - zero-dependency production CSS bundler (`styles/main.css`)
  - `scripts/ui/developer-card.js` - realistic lanyard badge controller (spring physics entrance, 3D flip, dynamic experience, a11y)
  - `scripts/ui/avatar-controller.js` - companion dialogue engine, section docking, and site interactions
- `styles/` - modular CSS tokens, layout, components, and animations
  - `styles/components/developer-card.css` - physical lanyard ID badge with woven strap, chrome hardware, Salesforce curves, and 3D transforms
  - `styles/main.css` - production bundled stylesheet
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

- No build step is required for development.
- Pure vanilla HTML, CSS, and JS (zero external runtime dependencies).
- When editing modular CSS files under `styles/`, run `python3 scripts/bundle-css.py` to compile into `styles/main.css`.
- Interactive Lanyard Developer Pass: Realistic hanging badge with spring physics, 3D flip card, live portfolio QR code, social links, and auto-calculated experience. Re-triggerable anytime via the hero launcher.
- Experience years automatically calculate dynamically from October 2020.
- Interactive vector avatar companion with real-time cursor gaze tracking, 5-beat interaction sequence, and developer mode easter egg.
- 100% client-side with zero external API calls or token dependencies.
- The contact form uses `mailto:`.
- The main preview image is `assets/images/portfolio-preview.png`.
- The resume files are `assets/Kartik-Patkar-ATS-Resume.pdf` and `assets/Kartik-Patkar-Resume.pdf`.
