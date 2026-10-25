# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-10-25

### Added
- **New Projects in Portfolio Showcase**:
  - **ShowDeck**: Privacy-first, offline-first Progressive Web App for tracking TV shows and movies without accounts or cloud storage (IndexedDB, TMDB API, Live Demo + GitHub).
  - **WealthDeck**: Modern, offline-first personal finance tracking PWA with local storage and full data privacy (PWA, Live Demo + GitHub).
  - **Resource Hub**: Curated directory of essential developer tools, libraries, and design resources.
- **Live Demo Action Buttons**:
  - Added SVG globe `web` icon and `.project-card__action--web` button styles in `scripts/core/icons.js`, `scripts/sections/projects.js`, and `styles/sections/projects.css`.
  - Updated open-source project counter to **12+ Projects** in `data/portfolio-content.js`.

### Fixed & Hardened (GUI Audit)
- **Active Filter Pill Contrast in Dark Mode (BUG-1)**: Fixed unreadable text color on active filter buttons by explicitly setting `color: #0b1528; font-weight: 800;` on `[data-theme="dark"] .projects__filter--active` in `styles/base/tokens.css`.
- **Developer Card Modal Click Interception (BUG-2)**: Prevented closed modal from blocking footer clicks by setting `pointer-events: none !important;` on all children when inactive and `modal.style.display = "none"` upon exit animation completion.
- **Short Viewport Sizing @ 720p (BUG-3)**: Added `@media (max-height: 820px)` and `@media (max-height: 740px)` media queries in `styles/components/developer-card.css` to clamp `.lanyard-strap` and scale perspective, keeping "Continue" and "Click Card" buttons above the fold.
- **Escape Key Accessibility (BUG-4)**: Attached global `window` keyboard handler for `Escape` to cleanly dismiss the modal regardless of focus state.
- **Navigation Active Link Synchronization**: Added throttled `scroll` listener and bottom boundary check (<= 50px) to cleanly activate `#contact` at the bottom of the page and restore the intersection observer's section when scrolling back up.


### Added
- **Realistic Lanyard Developer ID Badge**:
  - Fluid physics entrance drop (`lanyardDrop`) with realistic spring settle and continuous subtle idle sway (`styles/components/developer-card.css`, `scripts/ui/developer-card.js`).
  - Hanging fabric strap with seamless infinite top extension preventing visible cut-offs during motion.
  - Metallic lobster clasp hardware hooking through the badge punch hole.
  - 3D interactive flip transforms (`rotateY(180deg)`) preserving front and back face visibility.
  - **Front Face**: Custom Salesforce curved waves, circular portrait, structured credentials table (`KKP-2020-SFDX`, Consultant / Developer, 10x Certified, 2x Ranger), and clean centered vector QR code linking to the live site.
  - **Back Face**: Competencies bullet breakdown, 2-column Architect certifications, quick-access social profile links (LinkedIn, GitHub, Trailhead, Email), and stylized authorized signature block.
  - **Hero Launcher**: `[ID] Developer Pass` button in the hero section to re-trigger the lanyard badge entrance anytime.

### Optimized & Fixed
- **Mobile Hero Floating Card Placement**:
  - Lowered the mobile projects badge (`11+ Projects / Open Source`) from `top: 50%` to `top: 68%` across `@media (max-width: 768px)` and `@media (max-width: 480px)`. Clears the portrait face and smile with ample breathing room.
- **Dynamic Experience Calculation**:
  - Added real-time calculation in `scripts/ui/developer-card.js` auto-formatting experience duration (`6+ Years (Consulting)`) matching site-wide dynamic stats.
- **Accessibility & Scroll Management**:
  - Locked background body scroll while the ID badge modal is open and restored on dismiss.
  - Full keyboard accessibility with `Escape` to dismiss and `Enter`/`Space` to flip.
- **Production CSS Sync**:
  - Re-compiled all 23 modular CSS files via `scripts/bundle-css.py` into `styles/main.css` and bumped cachebuster queries to `?v=20261018c`.

## [1.3.0] - 2026-10-17

### Added
- **Cursor Eye & Head Gaze Tracking**:
  - Avatar's eyes and 3D head perspective tilt follow cursor coordinates smoothly within a 700px radius (`scripts/ui/avatar-controller.js`, `styles/components/avatar-companion.css`).
  - Smooth reset to idle baseline upon 3s pointer inactivity or window exit.
  - Automatically disabled on touch screens (`pointer: coarse`) and when `prefers-reduced-motion` is enabled, preserving natural blinking and idle breathing.
- **5-Beat Click Progression & Developer Mode Secret**:
  - Interactive progressive click dialogue sequence on the mascot (Wave `happy` -> Smile `excited` -> Wink `playful` -> Curious `curious` -> Secret Unlock `celebrate`).
  - 5th click activates Developer Mode with a pure DOM/CSS confetti particle burst, pulsing matrix green aura (`.avatar-character--dev-mode`), "Dev Mode ⚡" badge, and DevTools console greeting.
- **Contextual Section Poses & Reactions**:
  - Aligned section pose transitions across the portfolio: Hero/About (`happy`), Skills (`thinking`), Certifications (`proud`), Projects (`working`), Experience (`listening`), Contact (`happy`).
  - Smart skill card categorization: Apex/Architecture triggers `working`, LWC/JS triggers `thinking`, Integrations/APIs triggers `curious`.
  - Certifications card hover & viewport entry triggers 3.5s `proud` celebration pose.

### Security & Performance
- **Zero-Token Client-Side Architecture**: Completely eliminates external chatbot API dependencies, keys, tokens, CORS issues, and 403 network failures. 100% private, offline-capable, and self-contained.
- **Zero forced reflows**: Gaze tracking uses GPU-accelerated CSS `transform` on SVG groups and `requestAnimationFrame` debouncing.

## [1.2.0] - 2026-10-10

### Added
- **Interactive Avatar Companion**: Procedural vector companion (`scripts/ui/avatar-controller.js`, `styles/components/avatar-companion.css`) that tours the portfolio alongside visitors.
  - Multi-step conversational dialogue trees across all sections with smooth section navigation triggers.
  - Smart section dock positioning (`top-right`, `bottom-right`, `top-left`, `bottom-left`) preventing content obstruction.
  - Wake-up intro sequence on initial load (`sleeping` -> `waking` -> `excited`).
  - Night owl mode (10 PM – 5 AM local time) with late-night dialogue and custom badge.
  - Interactive site triggers: Theme toggle reactions, resume menu, cert card trivia, skills grid insights, projects showcase hover, contact form focus, email copy celebration, social links hover, back-to-top button, and 10-click poke streak easter egg.
  - Fully accessible with `prefers-reduced-motion` fallbacks and dismissible speech bubble.
- **Dynamic Stats & Auto-Calculated Experience**:
  - Runtime calculation for experience years based on career start date (`October 2020`), auto-formatting `${years}.5+` / `${years}+`.
  - Dynamic count interpolation for certifications and projects directly from live data/DOM across avatar dialogues, badges, and trivia.
  - Auto-synchronized `hero.floatingCards` and About snapshot in `scripts/core/config.js`.

### Fixed
- **Cleaned Obsolete Meta Headers**: Removed `<meta http-equiv="X-Frame-Options">` tags from `privacy.html` and `terms.html` to eliminate browser console warnings.
- **Cleaned Search Console Placeholder**: Commented placeholder `google-site-verification` in `index.html`.

## [1.1.0] - 2026-08-13

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
