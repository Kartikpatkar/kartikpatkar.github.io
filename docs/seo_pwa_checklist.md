# PWA & SPA Pre-Launch Checklist (SEO, Perf, A11y)

Pass this checklist to future AI agents when starting or finalizing a new web project to ensure perfect Lighthouse scores and zero Google Search Console errors.

## 1. Technical SEO & Indexing
- [ ] **robots.txt**: Must exist at the root, allowing user-agents to crawl the site.
- [ ] **sitemap.xml**: Must exist at the root, containing the exact absolute URLs of the deployed site. Submit the exact URL path to Google Search Console (e.g. `https://domain.com/sitemap.xml`).
- [ ] **Google Site Verification**: Add the `<meta name="google-site-verification" content="...">` tag inside the `<head>` of `index.html` to verify domain ownership instantly.
- [ ] **Canonical Tags**: Ensure `<link rel="canonical" href="...">` exists in the head to prevent duplicate content indexing.

## 2. Performance (LCP, TTI)
- [ ] **Lazy-load Heavy JS**: Do not put massive libraries (like Chart.js, JSZip, PDF.js) in the `index.html` head. Dynamically inject the `<script>` tags via JS only when the user visits the specific page that needs them. This saves hundreds of KBs of "Unused JS" on initial load.
- [ ] **Prevent Layout Thrashing**: Never read the DOM (e.g. `offsetWidth`, `scrollTop`) immediately after writing to it. Wrap synchronous layout updates and animations in `requestAnimationFrame()`.
- [ ] **Network Deduplication**: If manually pinging files (like `manifest.json`) to check online status, append a cache-busting query string (`?ping=1`) so Lighthouse doesn't flag it as a duplicate render-blocking fetch.

## 3. Accessibility (WCAG AAA)
- [ ] **Contrast Ratios**: Check all `text-secondary`, `text-tertiary`, and button colors against their backgrounds. Ensure a contrast ratio of at least 4.5:1 (AA) for large text, and ideally **7:1 (AAA)** for all standard text. Darken light-mode colors and lighten dark-mode colors as needed.
- [ ] **Semantic Landmarks**: Use native HTML5 tags (`<main>`, `<nav>`, `<aside>`, `<footer>`). Do not add redundant ARIA roles (e.g., do not put `role="navigation"` on an `<aside>` or `<nav>`, as this causes scanner errors).
- [ ] **Explicit Inline Contrast**: If styling elements inline via JS (like Google login buttons), explicitly include `color: white;` (or black) alongside the background color. Scanners cannot safely assume the inherited CSS text color.

## 4. Hosting & Security
- [ ] **.nojekyll**: If deploying to GitHub Pages, always include a blank `.nojekyll` file in the root. Otherwise, GitHub drops folders starting with a dot (like `.well-known`).
- [ ] **Security Headers**: Include a `vercel.json` or `_headers` file defining `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), and `X-Content-Type-Options`. Note: GitHub Pages often strips custom headers, requiring meta-tag fallbacks for CSP in `index.html`.
- [ ] **Legal Routing**: Ensure static `privacy.html` and `terms.html` files exist at the root and are globally linked in the app's `<footer>`.
- [ ] **Security.txt**: Provide a `.well-known/security.txt` file for automated responsible disclosure routing.
