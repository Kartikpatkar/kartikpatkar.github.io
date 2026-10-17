#!/usr/bin/env python3
"""
Bundle modular CSS files into styles/main.css to eliminate CSS @import waterfalls.
Source list maintained in order below.
"""
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STYLES_DIR = os.path.join(BASE_DIR, "styles")

ORDER = [
    "base/tokens.css",
    "base/reset.css",
    "base/animations.css",
    "layout/page.css",
    "components/nav.css",
    "components/social.css",
    "components/buttons.css",
    "components/cards.css",
    "components/forms.css",
    "components/footer.css",
    "components/back-to-top.css",
    "components/avatar-companion.css",
    "components/loading.css",
    "sections/hero.css",
    "sections/about.css",
    "sections/impact.css",
    "sections/skills.css",
    "sections/certifications.css",
    "sections/projects.css",
    "sections/experience.css",
    "sections/contact.css",
    "layout/responsive.css",
]

def bundle():
    parts = ["/* Auto-bundled CSS for production performance. Edit modular files in styles/ */"]
    for rel in ORDER:
        file_path = os.path.join(STYLES_DIR, rel)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Missing CSS file: {file_path}")
        with open(file_path, "r", encoding="utf-8") as f:
            parts.append(f"/* === {rel} === */\n" + f.read().strip())
    
    out_path = os.path.join(STYLES_DIR, "main.css")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n\n".join(parts) + "\n")
    print(f"Bundled {len(ORDER)} CSS files into {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    bundle()
