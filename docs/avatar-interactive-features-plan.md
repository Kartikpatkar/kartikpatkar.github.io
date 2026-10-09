# Interactive Avatar Evolution Plan: "Astro Companion"

Comprehensive implementation roadmap for avatar micro-interactions, developer easter eggs, and Salesforce-themed interactive features on `kartikpatkar.github.io`.

---

## Architecture & Feasibility Matrix

| # | Feature | Complexity | Feasibility | Implementation Hook |
|---|---|---|---|---|
| **1** | **Cursor Eye/Head Tracking & 5s Idle Drift** | Low | 100% | Pointermove listener calculating normalized angle `(-15deg..+15deg)` applied to `.bs-avatar` transform; 5s timeout triggers gentle random animation (`curious`, `thinking`). |
| **2** | **Wake-Up Intro Sequence** | Low | 100% | Page load sequence: start `sleeping` (Zzz bubble) -> `waking` -> `excited` -> tour greeting in Hero. |
| **3** | **Scroll-Reactive Mood Mapping** | Low | 100% | Expand `SECTION_STORIES` and `IntersectionObserver` to trigger specific emotions on entry: Skills (`working`), Certs (`proud`), Projects (`excited`), Experience (`listening`), Contact (`happy`). |
| **4** | **"Ask Kartik" Command Palette (Cmd+K / /)** | Med | 100% | Salesforce Setup Search / Spotlight style modal. Search across projects, certs, skills, resume. Companion switches to `searching` while typing, jumps smoothly to target. |
| **5** | **Salesforce Astro Buddy & Cert Hover** | Low-Med | 100% | Add floating mini cloud badge with "10x". Hovering any certification card triggers `proud` or `celebrate` animation and badge highlight. |
| **6** | **Apex Hero Terminal** | Med | 100% | Lightweight typewriter console in Hero: `System.debug('Hi, I am Kartik');` -> Avatar in `working` mode -> Execution output reveals tagline -> Avatar `celebrate`. |
| **7** | **Bug-Squash 5-Click Combo & Konami Code** | Low | 100% | Track rapid clicks: 5x triggers `angry` + CSS shake + "Stop squashing me!" -> resolves to `laughing`. Konami code (`↑↑↓↓←→←→BA`) temporarily toggles avatar body to `#ba3636` bug-hunter red. |
| **8** | **Project Cards as "Lightning Orgs"** | Med-High | 100% | Project modal with Salesforce Lightning Record layout (Compact layout header, tabs: Details, Architecture, Live Demo). Avatar peeks from record corner in `curious` mode. |
| **9** | **Contact Form Reactions** | Low | 100% | Form inputs: `focus`/`typing` -> `listening`. Form empty validation error -> `confused`. Successful submission -> `celebrate` with celebratory dialogue. |
| **10** | **Night Owl Mode (Visitor Local Time > 10 PM)** | Low | 100% | Detect `new Date().getHours() >= 22 || getHours() < 5`. Auto-suggest dark theme, avatar plays `drowsy`, thought bubble says: *"Still coding? Me too 🌙"*. |

---

## Phased Implementation Roadmap

### Phase 1: High Impact & Quick Wins (Zero layout risk)
1. **Wake-Up Intro**:
   - Initial load starts asleep with quiet `"Zzz..."` cloud.
   - After 600ms, transitions `sleeping` -> `waking` -> `excited`, then displays greeting.
2. **Cursor Parallax Tracking**:
   - Throttle `pointermove`: calculate `(clientX - mascotCenterX)` and `(clientY - mascotCenterY)`.
   - Apply subtle 3D eye/face orientation via CSS transform: `rotateY(...) rotateX(...)`.
   - If mouse idle for 5s, play ambient drift or switch to `curious`/`thinking`.
3. **Enhanced Section Moods**:
   - Skills -> `working` 🛠️
   - Certifications -> `proud` 🎓
   - Projects -> `excited` 🚀
   - Experience -> `listening` 💼
   - Contact -> `happy` 😊
4. **Night Owl Detection**:
   - Check local hours (10 PM to 5 AM).
   - Set expression `drowsy`, special late-night line, optional auto dark theme.

### Phase 2: Live Form & Easter Eggs
5. **Bug Squash & Konami Code**:
   - Rapid click counter on `#avatar-companion-character`.
   - 5 clicks in 2s -> `play("angry")` + shake class -> 2s later `play("laughing")`.
   - Konami listener flips fill `#0176D3` to `#ba3636`.
6. **Contact Form Reactive State**:
   - Input focus / input event -> `playAnim("listening")`.
   - Invalid submit -> `playAnim("confused")` + *"Wait, we need your email first!"*.
   - Success submit -> `playAnim("celebrate")` + confetti.
7. **Certifications Hover Synergy**:
   - Event delegation on `.cert-card`.
   - Mouseenter -> Avatar animates `proud` with speech *"Passed 1st attempt! ☁️"*.

### Phase 3: Developer Tools (Command Palette & Hero Console)
8. **Command Palette (`Cmd+K` or `/`)**:
   - Native dialog `<dialog id="cmd-palette">`.
   - Quick search: "Projects", "Apex Tools", "Certifications", "Resume", "Contact".
   - Companion animates `searching`, guides visitor directly to target.
9. **Apex Console Hero Widget**:
   - Interactive or animated terminal snippet in Hero.
   - Types `System.debug('Hi, I am Kartik');` -> Avatar `working` -> output printed.

---

## Ready for Execution
Which phase or specific features should we build first?
