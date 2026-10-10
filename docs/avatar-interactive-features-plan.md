# Interactive Avatar Evolution Plan: "Astro Companion"

Comprehensive implementation roadmap for avatar micro-interactions, developer easter eggs, and Salesforce-themed interactive features on `kartikpatkar.github.io`.

---

## Architecture & Feasibility Matrix

| # | Feature | Complexity | Status | Implementation Hook |
|---|---|---|---|---|
| **1** | **Cursor Eye/Head Tracking** | Low | Retired | Intentionally removed per user design preference for natural vector rendering. |
| **2** | **Wake-Up Intro Sequence** | Low | Complete | Page load sequence: starts `sleeping` (Zzz bubble) -> `waking` -> `excited` -> tour greeting in Hero. |
| **3** | **Scroll-Reactive Mood Mapping** | Low | Complete | `SECTION_STORIES` and `IntersectionObserver` trigger emotions: Skills (`working`), Certs (`proud`), Projects (`excited`), Experience (`listening`), Contact (`happy`). |
| **4** | **"Ask Kartik" Command Palette** | Med | Backlog | Optional future expansion. |
| **5** | **Salesforce Astro Buddy & Cert Hover** | Low-Med | Complete | Certifications badge with `${certCount}x`. Hovering cert card triggers `proud` animation with dynamic exam trivia. |
| **6** | **Apex Hero Terminal** | Med | Backlog | Optional future expansion. |
| **7** | **Bug-Squash Poke Combo & Easter Eggs** | Low | Complete | 10-click poke streak combo on companion character with dynamic developer jokes and zero-defect celebration. |
| **8** | **Project Cards Interactions** | Low-Med | Complete | Hovering project cards triggers developer tools dialogue and demo discovery hint. |
| **9** | **Site Interaction Reactive State** | Low | Complete | Theme toggle reaction, resume download reaction, contact form focus, copy email celebration, social links hover, back-to-top button. |
| **10** | **Night Owl Mode (Visitor Local Time > 10 PM)** | Low | Complete | Detects `new Date().getHours() >= 22 || getHours() < 5`. Displays late-night dialogue and "Night Shift 🦉" badge. |
| **11** | **Dynamic Portfolio Stats** | Low | Complete | Auto-calculates experience years from Oct 2020 (`${years}.5+` / `${years}+`) and live cert/project counts across all dialogues. |

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
