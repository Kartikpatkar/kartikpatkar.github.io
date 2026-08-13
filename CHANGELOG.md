# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-08-13

### Added
- **Legal Policy Pages**: Added standalone static pages [privacy.html](file:///Users/apple/Desktop/Desktop%20Backup/New%20folder/Project/Portfolio/kartikpatkar.github.io/privacy.html) and [terms.html](file:///Users/apple/Desktop/Desktop%20Backup/New%20folder/Project/Portfolio/kartikpatkar.github.io/terms.html) matching the main site's layout and dark mode theme.
- **Footer Routing links**: Appended links to the Privacy Policy and Terms of Service dynamically in the footer.
- **GitHub Pages .nojekyll**: Added `.nojekyll` to the repository root to allow serving files inside dot-prefixed directories.
- **Security Disclosures (security.txt)**: Configured RFC 9116 security text mapping at `.well-known/security.txt`.
- **Google Site Verification**: Added verification tag placeholder to `index.html`.
- **Content Security Policy (CSP)**: Added meta tag configuration for safe content delivery restriction. Consolidated duplicate CSP tags and extended CSP/security headers (X-Frame-Options, X-Content-Type-Options) to legal policy pages.

### Optimized
- **Layout Thrashing Fix**: Cached `offsetTop` and `offsetHeight` values in `back-to-top.js` instead of checking layout parameters synchronously on every scroll event frame.
- **A11y Text Contrast**: Darkened light mode variables (`--muted` and `--faint`) and lightened dark mode variables (`--muted`, `--faint`, `--accent`) to meet WCAG AA/AAA standards (7:1 target).

## [Released] - 2026-06-12

### Added
- **Structured Data (JSON-LD)**: Added Schema.org Person metadata structure to `index.html` to improve search engine display and rich result rendering.
- **Robots Sitemap Pointer**: Referenced `sitemap.xml` directly in `robots.txt` for efficient crawling access by search engine spiders.
- **Experience Year Auto-Calculation**: Dynamically calculates years and months of experience at runtime based on the start date of the oldest job in the portfolio data (October 2020), resolving stale values in the Hero badge and About snapshot.
- **Copy Email Fallback**: Added a compound row layout for the Email contact card containing a clipboard copy button, supporting users who do not have a configured local mail client.
- **Visual Contact Hint**: Added descriptive text below the Contact Form button clarifying that submission launches the default email application.
- **LCP Image Preload**: Added a preload tag in the `<head>` of `index.html` for the profile picture (`kartik-patkar.png`) to trigger immediate browser retrieval and improve Largest Contentful Paint (LCP) speeds.
- **color-scheme Support**: Configured CSS `color-scheme` property dynamically (light/dark) on the document root to match native browser elements (scrollbars, input focuses) to the current theme.
- **Theme Toggle Smoothness**: Added 300ms transitions on color, background, and shadow shifts across core selectors to smooth out light/dark theme switching.

### Fixed
- **Missing Project Images**: Restored missing Chrome Web Store hosted `iconImage` properties for *SF Security Auditor* and *SF Vault+* in the projects database.
- **Missing Chrome Store URL**: Added active Chrome Web Store link for the *SF Vault+* project card.
- **Accessibility Roles**: Refactored the dropdown menu in `resume-menu.js` to remove redundant/confusing ARIA `role="menuitem"` and `aria-haspopup="true"` markers, transitioning to a clean disclosure list pattern.
