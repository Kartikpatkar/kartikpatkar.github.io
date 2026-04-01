# Modularization Plan

This document captures the exact phase-1 module split for the portfolio before the refactor is applied.

## Scope

- Keep `index.html` as the single page shell.
- Split JavaScript into ES modules under `scripts/`.
- Split CSS into layered files under `styles/`.
- Do not change the data model in `data/`.
- Do not introduce a build step.

## JavaScript Module Map

### From `script.js` to `scripts/core/config.js`

- `NAV_HEIGHT_CSS_VAR`
- `defaultUiConfig`
- `mergeUiConfig(defaults, overrides)`
- `getPortfolioData(portfolioContent, portfolioConfig)`

### From `script.js` to `scripts/core/dom.js`

- `createEl(tagName, className, text)`
- `setText(selector, value)`
- `setLink(selector, href, text)`
- `setVisibility(selector, isVisible)`

### From `script.js` to `scripts/core/icons.js`

- `createIcon(name, className)`

### From `script.js` to `scripts/sections/hero.js`

- `renderSocialLinks(selector, socials)`
- `renderHeroHighlights(hero, uiHero)`
- `renderHeroFloatingCards(hero, uiHero)`

### From `script.js` to `scripts/sections/about.js`

- `renderAbout(about)`

### From `script.js` to `scripts/sections/skills.js`

- `renderSkills(skills)`

### From `script.js` to `scripts/sections/certifications.js`

- `renderCertifications(certifications)`

### From `script.js` to `scripts/sections/projects.js`

- `renderProjects(projects, uiProjects)`

### From `script.js` to `scripts/sections/experience.js`

- `renderExperience(experience)`

### From `script.js` to `scripts/sections/contact.js`

- `renderDirectLinks(site)`

### From `script.js` to `scripts/ui/navigation.js`

- `initNavigation()`
- internal `setMenuOpen(open)`
- internal `setActiveLink(sectionId)`
- internal `getNavHeightPx()`
- internal `setupSectionObserver()`

### From `script.js` to `scripts/ui/reveal.js`

- `initReveal()`

### From `script.js` to `scripts/ui/back-to-top.js`

- `initBackToTop(buttonSelector, thresholdSelector)`
- internal `updateBackToTopVisibility()`

### From `script.js` to `scripts/ui/contact-form.js`

- `initContactForm(options)`
- internal `setError(el, msg)`
- internal `isEmail(value)`

### Kept as orchestration in `scripts/main.js`

- `renderPortfolioData(portfolioData)`
- footer year initialization
- module wiring and bootstrap

## CSS Module Map

### `styles/base/tokens.css`

- CSS custom properties under `:root`

### `styles/base/reset.css`

- global box sizing
- `html`, `body`, `img`, `a`, `section`
- `.sr-only`

### `styles/base/animations.css`

- `.reveal`
- `.reveal.is-visible`
- reduced motion media query

### `styles/layout/page.css`

- `.container`
- `.section`
- `.section--compact`
- `.section__*`
- `.split-section`
- `.split-section__panel`
- `.skip-link`

### `styles/components/nav.css`

- `.nav*`

### `styles/components/social.css`

- `.social*`

### `styles/components/buttons.css`

- `.btn*`

### `styles/components/cards.css`

- `.card*`
- `.list*`
- `.chips`, `.chip`
- `.divider`
- `.link`

### `styles/components/forms.css`

- `.form*`

### `styles/components/footer.css`

- `.footer*`

### `styles/components/back-to-top.css`

- `.back-to-top*`

### `styles/sections/hero.css`

- `.hero*`
- `@keyframes heroFloat`

### `styles/sections/about.css`

- `.about__grid`

### `styles/sections/skills.css`

- `.skills__grid`
- `.skill-group*`
- `.skill-pill`

### `styles/sections/certifications.css`

- `.certifications__grid`
- `.cert-card*`

### `styles/sections/projects.css`

- `.projects__grid`
- `.project-card*`
- `.tags`, `.tag`

### `styles/sections/experience.css`

- `.experience__*`
- `.timeline*`

### `styles/sections/contact.css`

- `.contact__*`
- `.contact-link*`

### `styles/layout/responsive.css`

- responsive media queries for all modules

## Phase-1 Notes

- `index.html` remains the only HTML document.
- `data/portfolio-config.js` and `data/portfolio-content.js` remain global scripts.
- `scripts/main.js` becomes the only application entrypoint and reads from `window.PORTFOLIO_CONFIG` and `window.PORTFOLIO_CONTENT`.
- `styles/main.css` becomes the only stylesheet loaded by the page shell and imports the modular CSS files.