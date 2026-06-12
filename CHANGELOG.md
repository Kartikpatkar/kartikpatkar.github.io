# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-06-12

### Added
- **Structured Data (JSON-LD)**: Added Schema.org Person metadata structure to `index.html` to improve search engine display and rich result rendering.
- **Robots Sitemap Pointer**: Referenced `sitemap.xml` directly in `robots.txt` for efficient crawling access by search engine spiders.
- **Experience Year Auto-Calculation**: Dynamically calculates years and months of experience at runtime based on the start date of the oldest job in the portfolio data (October 2020), resolving stale values in the Hero badge and About snapshot.
- **Copy Email Fallback**: Added a compound row layout for the Email contact card containing a clipboard copy button, supporting users who do not have a configured local mail client.
- **Visual Contact Hint**: Added descriptive text below the Contact Form button clarifying that submission launches the default email application.
- **LCP Image Preload**: Added a preload tag in the `<head>` of `index.html` for the profile picture (`kartik-patkar.jpg`) to trigger immediate browser retrieval and improve Largest Contentful Paint (LCP) speeds.
- **color-scheme Support**: Configured CSS `color-scheme` property dynamically (light/dark) on the document root to match native browser elements (scrollbars, input focuses) to the current theme.
- **Theme Toggle Smoothness**: Added 300ms transitions on color, background, and shadow shifts across core selectors to smooth out light/dark theme switching.

### Fixed
- **Missing Project Images**: Restored missing Chrome Web Store hosted `iconImage` properties for *SF Security Auditor* and *SF Vault+* in the projects database.
- **Missing Chrome Store URL**: Added active Chrome Web Store link for the *SF Vault+* project card.
- **Accessibility Roles**: Refactored the dropdown menu in `resume-menu.js` to remove redundant/confusing ARIA `role="menuitem"` and `aria-haspopup="true"` markers, transitioning to a clean disclosure list pattern.
