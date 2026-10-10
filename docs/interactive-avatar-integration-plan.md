# Interactive Avatar Integration Plan

Integration plan for adding a procedural interactive avatar from [Bible Strong Avatar Lab](https://github.com/smontlouis/bible-strong-avatar-lab) to the portfolio site.

---

## 1. Overview & Architecture

* **Source Engine:** `smontlouis/bible-strong-avatar-lab`
* **Target Site:** `kartikpatkar.github.io` (Static Vanilla HTML5 / CSS3 / ES Modules)
* **License Note:** GNU AGPL v3.0. Keep avatar runtime modular in `scripts/vendor/`.
* **Renderer:** `@bible-strong/avatar-web` (DOM/SVG procedural renderer, zero React runtime required).
* **Target Mounting Point:** Hero section `#hero-avatar` inside `.hero__portraitFrame` (with graceful fallback to `site.profileImage`).

---

## 2. Technical Constraints & CSP Compatibility

1. **Content Security Policy (CSP):**
   * Site enforces `connect-src 'self'` and `script-src 'self' 'unsafe-inline'`.
   * Avatar engine bundle and `.avatar.json` definition must be hosted locally on GitHub Pages. No external CDN URLs allowed.
2. **Zero Bundler at Root:**
   * Build-free static architecture (`.nojekyll`).
   * Bundled dependencies must be committed as ready-to-execute ES modules or UMD scripts.
3. **Accessibility & Performance:**
   * Must respect `prefers-reduced-motion` media query.
   * Pause animation loop via `IntersectionObserver` when hero is off-screen.

---

## 3. Step-by-Step Implementation

### Phase 1: Avatar Character Design & Export
1. Launch [bible-strong-avatar-lab.vercel.app](https://bible-strong-avatar-lab.vercel.app).
2. Configure character parameters using the calibrated reference below:

#### Avatar Lab Studio Preset (`Kartik-Avatar`)

| Section | Parameter | Recommended Value | Notes |
| :--- | :--- | :--- | :--- |
| **Identity** | Avatar Name | `Kartik-Avatar` | Identifier in JSON |
| **Body Shape** | Primary Shape | `Capsule` (or `Sphere`) | Carries eyes |
| **Dimensions** | Scale | `240 u` | Base size |
| | Width | `240 u` | Horizontal span |
| | Height | `260 u` | Elongates head if Capsule |
| | Depth | `240 u` | Z-axis |
| **Color** | Body Color | `#1A73E8` | Salesforce Blue (Portfolio `--accent`) |
| | *(Alt Color)* | `#F4F8FD` | Clean Cloud White option |
| **Eyes** | Eye Color | `#0B1528` | Deep Navy / Charcoal contrast |
| | Width | `24 u` | Left & Right |
| | Height | `42 u` | Left & Right |
| | Proportional Size | `45 u` | Left & Right |
| **Eye Placement**| Spacing | `48 u` | Distance between eyes |
| | Left Eye Horiz / Vert | `0 u` / `-6 u` | Lower-third placement |
| | Right Eye Horiz / Vert| `0 u` / `-6 u` | Balanced alignment |
| | Rotation | `0°` / `0°` | Neutral baseline |

#### Optional Primitives (Detail Shapes)
* **Visor / Glasses:** `Cube` (`Width: 150 u, Height: 18 u, Depth: 12 u`, Pos `Y: -6 u, Z: 122 u`, Color `#00A1E0`)
* **Headphones (Left):** `Cylinder` (Pos `X: -125 u`, Color `#16324F`)
* **Headphones (Right):** `Cylinder` (Pos `X: 125 u`, Color `#16324F`)

3. Export avatar definition:
   * File destination: `assets/avatar/kartik-avatar.json` (or `data/avatar-definition.js` as an export object).
4. Verify exported animation clips: `idle`, `wave`, `happy`, `talk`, `look`.

### Phase 2: Runtime Packaging
1. Build/vendor `@bible-strong/avatar-web` into standalone ESM file:
   * File destination: `scripts/vendor/avatar-web.esm.js`.
2. Ensure runtime exports `createAvatar(targetSelector, options)`.

### Phase 3: Integration & Controller
1. Create `scripts/ui/avatar-controller.js`.
2. Lifecycle flow:
   ```javascript
   import { createAvatar } from '../vendor/avatar-web.esm.js';

   export const initHeroAvatar = async () => {
     const container = document.getElementById('hero-avatar');
     if (!container) return;

     // Reduced motion check
     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

     const response = await fetch('assets/avatar/kartik-avatar.json');
     const definition = await response.json();

     const avatar = createAvatar(container, {
       definition,
       defaultAnimation: prefersReducedMotion ? null : 'idle'
     });

     return avatar;
   };
   ```
3. Update `scripts/main.js` to call `initHeroAvatar()` with fallback to `site.profileImage`.

### Phase 4: Interactive Behaviors & Polish
1. **Mouse / Gaze Tracking:**
   * Calculate normalized pointer offset `(x, y)` relative to `#hero-avatar` center.
   * Direct avatar eye/head gaze towards cursor across the hero boundary.
2. **Contextual Action Triggers:**
   * **Page Load:** Play `wave` animation once, smoothly transition to `idle`.
   * **Resume Button Hover (`#resume-trigger`):** Play `happy` animation.
   * **Contact Form Input (`#contact-name`, `#contact-message`):** Play `talk` animation.
3. **Theme Synchronization:**
   * Listen to `theme-toggle` events.
   * Switch avatar palette accents between light mode and dark mode tokens.
4. **Visibility Optimization:**
   * Use `IntersectionObserver` on `.hero` to stop RAF/playback when scrolled past hero, minimizing CPU/battery usage.

---

## 4. File Checklist

| File Path | Description | Status |
| :--- | :--- | :--- |
| `assets/avatar/kartik-avatar.json` | Procedural vector avatar definition | Complete |
| `data/avatar-definition.js` | Synchronous offline/CORS-safe avatar definition | Complete |
| `scripts/vendor/avatar-web.esm.js` | Standalone ESM DOM avatar engine | Complete |
| `scripts/vendor/avatar-web.iife.js` | Standalone IIFE DOM avatar engine | Complete |
| `scripts/ui/avatar-controller.js` | Event wiring, pointer tracking, state management | Complete |
| `styles/sections/hero.css` | Frame sizing, responsive aspect ratio, fallback rules | Complete |
| `scripts/main.js` | App bootstrap & initialization call | Complete |
| `index.html` | Script tags inclusion in load chain | Complete |

---

## 5. Verification & Testing

- [x] Avatar renders cleanly at 1x, 2x, and mobile viewport sizes without layout shift.
- [x] No CSP violation errors (all assets hosted under `'self'`).
- [x] Cursor tracking works smoothly with throttle/requestAnimationFrame.
- [x] `prefers-reduced-motion: reduce` freezes avatar to static portrait.
- [x] CPU usage drops to 0% when scrolled to lower sections via IntersectionObserver.
- [x] Offline / local file protocol loads avatar via bundled definition.
