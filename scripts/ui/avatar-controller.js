(() => {
  "use strict";

  window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

  // Dynamic portfolio stats calculation helper (auto-calculates experience & live counts)
  const getDynamicPortfolioStats = () => {
    const content = window.PORTFOLIO_CONTENT || {};

    // 1. Dynamic Certifications Count (data array length or rendered cards fallback)
    const certCount = Array.isArray(content.certifications?.items) && content.certifications.items.length > 0
      ? content.certifications.items.length
      : (document.querySelectorAll("#certifications-grid .cert-card").length || 10);

    // 2. Dynamic Projects Count (data array length or rendered cards fallback)
    const projectCount = Array.isArray(content.projects?.items) && content.projects.items.length > 0
      ? content.projects.items.length
      : (document.querySelectorAll("#projects-grid .project-card").length || 9);

    // 3. Dynamic Experience Years (Career start date: October 2020)
    let startDate = new Date(2020, 9, 1);
    if (content.experience && Array.isArray(content.experience.items) && content.experience.items.length > 0) {
      const oldest = content.experience.items[content.experience.items.length - 1];
      if (oldest?.duration) {
        const startPart = oldest.duration.split("-")[0].trim();
        const parsed = new Date(startPart);
        if (!isNaN(parsed.getTime())) startDate = parsed;
      }
    }
    const currentDate = new Date();
    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    const expDisplay = months >= 6 ? `${years}.5+` : `${years}+`;

    return {
      certCount,
      projectCount,
      expDisplay
    };
  };

  // Multi-step dynamic dialogue trees per section
  const buildSectionStories = (stats) => {
    const { certCount, projectCount, expDisplay } = stats;

    return {
      home: {
        dock: "bottom-right",
        steps: [
          {
            text: "Hey! I'm Kartik's AI companion. Ready for a quick tour? 🚀",
            button: "Take the tour ⬇️",
            animation: "waking",
            nextStep: 1
          },
          {
            text: "Kartik designs enterprise Salesforce architectures & developer tools. ✨",
            button: "Meet Kartik 💡",
            animation: "curious",
            nextStep: 2
          },
          {
            text: "Fasten your seatbelt! Flying up to Kartik's story...",
            button: "Fly to About 🚀",
            animation: "celebrate",
            targetSection: "about"
          }
        ]
      },
      about: {
        dock: "top-right",
        steps: [
          {
            text: `${certCount}x Certified Salesforce Consultant & Senior Dev crafting enterprise scale! ☁️`,
            button: "Tell me more 💡",
            animation: "proud",
            nextStep: 1
          },
          {
            text: `Over ${expDisplay} years building high-throughput Apex, LWCs & complex integrations.`,
            button: "Inspect Tech Stack ⚡",
            animation: "happy",
            nextStep: 2
          },
          {
            text: "Next up: his complete engineering arsenal & devtools!",
            button: "Jump to Skills ⚡",
            animation: "excited",
            targetSection: "skills"
          }
        ]
      },
      skills: {
        dock: "bottom-left",
        steps: [
          {
            text: "Apex, LWC, REST APIs, and Chrome Extensions built for speed! ⚡",
            button: "Does he build tools? 🛠️",
            animation: "working",
            nextStep: 1
          },
          {
            text: `Yes! Over ${projectCount}+ custom developer tools, test suites & automated workflows.`,
            button: "Show me the proof 📈",
            animation: "thinking",
            nextStep: 2
          },
          {
            text: `Check out his ${certCount}x Salesforce certifications and credentials!`,
            button: "View Certifications 🎓",
            animation: "proud",
            targetSection: "certifications"
          }
        ]
      },
      certifications: {
        dock: "bottom-left",
        steps: [
          {
            text: `${certCount}x Certified! Application Architect, Dev I, Sharing & Visibility Architect. 🎓`,
            button: "Passed on 1st try? ☁️",
            animation: "proud",
            nextStep: 1
          },
          {
            text: `All ${certCount} exams cleared on the first attempt with deep architectural mastery.`,
            button: "Inspect Impact 📈",
            animation: "celebrate",
            targetSection: "impact"
          }
        ]
      },
      impact: {
        dock: "top-left",
        steps: [
          {
            text: "Millions of records synced, operations streamlined, zero downtime! 📈",
            button: "Are there live apps? 🧩",
            animation: "celebrate",
            nextStep: 1
          },
          {
            text: "Check out the projects showcase! From browser extensions to frameworks.",
            button: "See the code & tools 🚀",
            animation: "curious",
            nextStep: 2
          },
          {
            text: "Let's go explore the featured open-source work!",
            button: "Take me to Projects 🧩",
            animation: "excited",
            targetSection: "projects"
          }
        ]
      },
      projects: {
        dock: "bottom-right",
        steps: [
          {
            text: `Here's the workshop! ${projectCount}+ live extensions, productivity kits & Apex libraries. 🧩`,
            button: "Which is the coolest? 🌟",
            animation: "happy",
            nextStep: 1
          },
          {
            text: "The Salesforce developer extensions and utility modules are fan favorites!",
            button: "What about work history? 💼",
            animation: "proud",
            nextStep: 2
          },
          {
            text: "Let's check Kartik's career journey and engineering leadership!",
            button: "Fly to Experience 💼",
            animation: "celebrate",
            targetSection: "experience"
          }
        ]
      },
      experience: {
        dock: "top-right",
        steps: [
          {
            text: `${expDisplay} years of enterprise consulting, delivery & senior development! 💼`,
            button: "Is Kartik available? 🤝",
            animation: "listening",
            nextStep: 1
          },
          {
            text: "Yes! Open to consulting, high-impact roles and partnerships.",
            button: "How do I reach him? ✉️",
            animation: "excited",
            nextStep: 2
          },
          {
            text: "Let's send him a direct message right now!",
            button: "Hop to Contact ✉️",
            animation: "celebrate",
            targetSection: "contact"
          }
        ]
      },
      contact: {
        dock: "bottom-right",
        steps: [
          {
            text: "Here's the direct line! Fill out this form or connect on LinkedIn/GitHub. ✉️",
            button: "Tell me a fun secret 😄",
            animation: "playful",
            nextStep: 1
          },
          {
            text: `Kartik passed all ${certCount} Salesforce certification exams on his very first attempt! 🎓`,
            button: "Ready for another lap? 🔄",
            animation: "laughing",
            nextStep: 2
          },
          {
            text: "Awesome! Let's zoom back to the top of the portfolio!",
            button: "Fly to Home ⬆️",
            animation: "celebrate",
            targetSection: "home"
          }
        ]
      }
    };
  };

  const getAvatarDefinition = async () => {
    if (window.KARTIK_AVATAR_DEFINITION) {
      return window.KARTIK_AVATAR_DEFINITION;
    }
    try {
      const response = await fetch("assets/avatar/kartik-avatar.json");
      if (response.ok) {
        const data = await response.json();
        window.KARTIK_AVATAR_DEFINITION = data;
        return data;
      }
    } catch {
      // Offline fallback
    }
    return null;
  };

  const initAvatarCompanion = async () => {
    const companion = document.getElementById("avatar-companion");
    const stage = document.getElementById("avatar-companion-stage");
    const bubble = document.getElementById("avatar-bubble");
    const bubbleText = document.getElementById("avatar-bubble-text");
    const actionBtn = document.getElementById("avatar-bubble-action");
    const actionLabel = document.getElementById("avatar-action-text");
    const toggleBtn = document.getElementById("avatar-bubble-toggle");
    const characterBtn = document.getElementById("avatar-companion-character");

    if (!companion || !stage || !window.AvatarWeb) return null;

    const definition = await getAvatarDefinition();
    if (!definition) return null;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    stage.innerHTML = "";
    const avatar = window.AvatarWeb.createAvatar(stage, {
      definition,
      defaultAnimation: prefersReducedMotion ? undefined : "idle",
      autoplay: !prefersReducedMotion,
      ariaLabel: "Interactive floating avatar guide",
      size: "100%"
    });

    let activeSectionId = "home";
    let stepIndex = 0;
    let isBubbleClosed = false;
    let animTimer = null;

    const playAnim = (animName, durationMs = 2800) => {
      if (prefersReducedMotion || !avatar) return;
      if (animTimer) {
        clearTimeout(animTimer);
        animTimer = null;
      }
      try { avatar.play(animName); } catch {}
      if (durationMs > 0) {
        animTimer = setTimeout(() => {
          try { avatar.play("idle"); } catch {}
          animTimer = null;
        }, durationMs);
      }
    };

    const ALL_DOCKS = [
      "avatar-companion--dock-bottom-right",
      "avatar-companion--dock-bottom-left",
      "avatar-companion--dock-top-right",
      "avatar-companion--dock-top-left",
      "avatar-companion--dock-right",
      "avatar-companion--dock-left"
    ];

    const updateDockPosition = (dockName) => {
      const targetClass = `avatar-companion--dock-${dockName}`;

      const applyClasses = () => {
        ALL_DOCKS.forEach(cls => companion.classList.remove(cls));
        companion.classList.add(targetClass);
      };

      if (prefersReducedMotion) {
        applyClasses();
        return;
      }

      companion.classList.add("avatar-companion--gliding");
      setTimeout(() => {
        applyClasses();
        setTimeout(() => {
          companion.classList.remove("avatar-companion--gliding");
        }, 340);
      }, 130);
    };

    const stats = getDynamicPortfolioStats();
    const SECTION_STORIES = buildSectionStories(stats);

    const badgeText = document.getElementById("avatar-badge-text");

    // Local hour check for night owl mode (10 PM to 5 AM)
    const currentHour = new Date().getHours();
    const isNightOwl = currentHour >= 22 || currentHour < 5;

    const renderStep = (sectionId, stepIdx) => {
      const sectionData = SECTION_STORIES[sectionId];
      if (!sectionData) return;

      activeSectionId = sectionId;
      stepIndex = stepIdx;
      const currentStep = sectionData.steps[stepIndex] || sectionData.steps[0];

      // Update badge text if present
      if (badgeText) {
        if (isNightOwl) {
          badgeText.textContent = "Night Shift 🦉";
        } else if (sectionId === "certifications") {
          badgeText.textContent = `${stats.certCount}x Certified ☁️`;
        } else {
          badgeText.textContent = "Kartik's Companion";
        }
      }

      // Update position dock
      updateDockPosition(sectionData.dock);

      // Fade text update
      if (bubbleText) {
        bubbleText.style.opacity = "0.2";
        setTimeout(() => {
          bubbleText.textContent = currentStep.text;
          bubbleText.style.opacity = "1";
        }, 120);
      }

      if (actionLabel) {
        actionLabel.textContent = currentStep.button;
      }

      if (!isBubbleClosed && bubble) {
        bubble.hidden = false;
      }

      playAnim(currentStep.animation, 3000);
    };

    // ------------------------------------------------------------------------
    // Contextual Dialogue & Site Interactions System
    // ------------------------------------------------------------------------
    let dialogueResetTimer = null;

    const sayDialogue = (text, anim = "happy", durationMs = 5200) => {
      if (dialogueResetTimer) {
        clearTimeout(dialogueResetTimer);
        dialogueResetTimer = null;
      }

      isBubbleClosed = false;
      if (bubble) bubble.hidden = false;

      if (bubbleText) {
        bubbleText.style.opacity = "0.2";
        setTimeout(() => {
          bubbleText.textContent = text;
          bubbleText.style.opacity = "1";
        }, 100);
      }

      playAnim(anim, durationMs > 0 ? durationMs : 3000);

      if (durationMs > 0) {
        dialogueResetTimer = setTimeout(() => {
          dialogueResetTimer = null;
          // Return smoothly to active section's dialogue
          const sectionData = SECTION_STORIES[activeSectionId];
          if (sectionData) {
            const step = sectionData.steps[stepIndex] || sectionData.steps[0];
            if (bubbleText) {
              bubbleText.style.opacity = "0.2";
              setTimeout(() => {
                bubbleText.textContent = step.text;
                bubbleText.style.opacity = "1";
              }, 100);
            }
            if (actionLabel) actionLabel.textContent = step.button;
          }
        }, durationMs);
      }
    };

    // 1. Theme Toggle Reaction
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        if (isDark) {
          sayDialogue("Lights out! Dark mode unlocked for high-throughput coding 🌙", "excited", 4500);
        } else {
          sayDialogue("Sun's up! Back to the Trailhead trail ☀️", "happy", 4500);
        }
      });
    }

    // 2. Resume Menu Reaction
    const resumeTrigger = document.getElementById("resume-trigger");
    if (resumeTrigger) {
      resumeTrigger.addEventListener("click", () => {
        sayDialogue(`Checking Kartik's resume? ${stats.expDisplay} years experience across ATS & Modern PDF formats ready! 📄`, "proud", 4500);
      });
    }

    // 3. Certifications Card Interactions
    const certsContainer = document.getElementById("certifications");
    if (certsContainer) {
      const certTrivia = [
        "Application Architect is one of Salesforce's toughest credentials! ☁️",
        `Fun fact: All ${stats.certCount} exams passed on the very first attempt! 🎓`,
        "Sharing & Visibility Architect: enterprise security with zero data leaks! 🔒",
        "Platform Developer I: deeply fluent in Apex, SOQL, and LWCs ⚡"
      ];
      let certTriviaIdx = 0;
      let lastCertPoke = 0;
      certsContainer.addEventListener("mouseenter", (e) => {
        if (e.target.closest(".cert-card")) {
          const now = Date.now();
          if (now - lastCertPoke > 3500) {
            lastCertPoke = now;
            const line = certTrivia[certTriviaIdx % certTrivia.length];
            certTriviaIdx++;
            sayDialogue(line, "proud", 4500);
          }
        }
      }, true);
    }

    // 4. Trailhead Feature Box Reaction
    const trailheadFeature = document.getElementById("skills-trailhead");
    if (trailheadFeature) {
      trailheadFeature.addEventListener("mouseenter", () => {
        sayDialogue("Double Star Ranger with 450+ badges & Superbadges! 🌲", "celebrate", 4500);
      });
    }

    // 5. Skills Grid Hover Reaction
    const skillsGrid = document.getElementById("skills-grid");
    if (skillsGrid) {
      const skillTrivia = [
        "Governor limits? Kartik builds bulkified, memory-efficient patterns ⚡",
        "Custom LWCs engineered with lightning-fast reactive DOM! 🛠️",
        "REST & Bulk APIs syncing millions of enterprise records 🚀",
        "Automated CI/CD pipelines & developer productivity suites! 📦"
      ];
      let skillTriviaIdx = 0;
      let lastSkillPoke = 0;
      skillsGrid.addEventListener("mouseenter", (e) => {
        if (e.target.closest(".skill-card")) {
          const now = Date.now();
          if (now - lastSkillPoke > 3500) {
            lastSkillPoke = now;
            const line = skillTrivia[skillTriviaIdx % skillTrivia.length];
            skillTriviaIdx++;
            sayDialogue(line, "working", 4200);
          }
        }
      }, true);
    }

    // 6. Projects Showcase Reaction
    const projectsGrid = document.getElementById("projects-grid");
    if (projectsGrid) {
      let lastProjectPoke = 0;
      projectsGrid.addEventListener("mouseenter", (e) => {
        if (e.target.closest(".project-card")) {
          const now = Date.now();
          if (now - lastProjectPoke > 4000) {
            lastProjectPoke = now;
            sayDialogue(`Exploring Kartik's ${stats.projectCount}+ developer tools! Click GitHub or Live Demo to inspect 💻`, "curious", 4200);
          }
        }
      }, true);
    }

    // 7. Contact Form Interaction
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      const inputs = contactForm.querySelectorAll("input, textarea");
      inputs.forEach(input => {
        input.addEventListener("focus", () => {
          sayDialogue("Dropping Kartik a line? He usually responds within 24 hours! ✍️", "listening", 4500);
        }, { once: true });
      });
    }

    // 8. Copy Email Button Reaction
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target && (target.closest(".contact-card__copyBtn") || target.closest("[data-copy]"))) {
        sayDialogue("Email copied! Looking forward to engineering something great together ✉️✨", "celebrate", 5000);
      }
    });

    // 9. Social Links Reactions
    const socialLinks = document.querySelectorAll(".social__link");
    socialLinks.forEach(link => {
      link.addEventListener("mouseenter", () => {
        const label = link.getAttribute("aria-label") || link.textContent || "";
        if (label.toLowerCase().includes("linkedin")) {
          sayDialogue("Connect on LinkedIn for architecture & tech insights! 💼", "happy", 3800);
        } else if (label.toLowerCase().includes("github")) {
          sayDialogue("Explore Kartik's open-source repos & devtools on GitHub! 🌟", "excited", 3800);
        } else if (label.toLowerCase().includes("trailhead")) {
          sayDialogue("Check Kartik's official Salesforce Trailblazer profile! ☁️", "proud", 3800);
        }
      });
    });

    // 10. Back to Top Button Reaction
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        sayDialogue("Weeee! Zooming back to the hero section 🚀", "playful", 3800);
      });
    }

    // Action button clicks progress dialogue or navigate
    if (actionBtn) {
      actionBtn.addEventListener("click", () => {
        const sectionData = SECTION_STORIES[activeSectionId];
        if (!sectionData) return;

        const currentStep = sectionData.steps[stepIndex] || sectionData.steps[0];

        if (currentStep.targetSection) {
          // Final step in section story -> navigate to next section!
          const targetEl = document.getElementById(currentStep.targetSection);
          playAnim("celebrate", 2400);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
          }
        } else if (typeof currentStep.nextStep === "number") {
          // Progress to next conversational beat!
          renderStep(activeSectionId, currentStep.nextStep);
        }
      });
    }

    // Dismiss bubble
    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        isBubbleClosed = true;
        if (bubble) bubble.hidden = true;
      });
    }

    // 11. Multi-Click Poke Combo on Avatar Character
    let pokeStreak = 0;
    let lastPokeTime = 0;

    const POKE_COMBOS = [
      { text: "Hey! I'm Kartik's AI companion. Ready for the tour? 🤖", anim: "happy" },
      { text: "Hehe, that tickles! 😄", anim: "laughing" },
      { text: `Did you know? Kartik built ${stats.projectCount}+ developer productivity tools! 🛠️`, anim: "curious" },
      { text: "Are you testing governor limits on my click handler?! ⚡", anim: "suspicious" },
      { text: "BUG SQUASHED! 🐛 Zero runtime defects in production!", anim: "celebrate" },
      { text: "System.debug('You are awesome!'); 🚀", anim: "celebrate" },
      { text: `${stats.certCount} Salesforce certs, zero retakes needed! 🎓`, anim: "proud" },
      { text: `${stats.expDisplay} years solving enterprise challenges with zero downtime! 💼`, anim: "proud" },
      { text: "SOQL query returned 100% satisfaction! ✨", anim: "happy" },
      { text: "Coffee + Apex = Scalable Enterprise Architecture ☕", anim: "playful" }
    ];

    if (characterBtn) {
      const onCharacterClick = () => {
        const now = Date.now();
        if (now - lastPokeTime > 3200) {
          pokeStreak = 0;
        }
        lastPokeTime = now;

        const combo = POKE_COMBOS[pokeStreak % POKE_COMBOS.length];
        pokeStreak++;
        sayDialogue(combo.text, combo.anim, 4500);
      };

      characterBtn.addEventListener("click", onCharacterClick);
      characterBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCharacterClick();
        }
      });
    }

    // IntersectionObserver watches sections as visitor scrolls
    const sections = document.querySelectorAll("main section[id], #skills, #certifications");
    if ("IntersectionObserver" in window && sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id && id !== activeSectionId && SECTION_STORIES[id]) {
              renderStep(id, 0);
            }
          }
        });
      }, { threshold: 0.35 });

      sections.forEach(s => observer.observe(s));
    }

    // ------------------------------------------------------------------------
    // Feature 2: Wake-Up Intro Sequence (sleeping -> waking -> excited)
    // ------------------------------------------------------------------------
    const startIntroSequence = () => {
      if (prefersReducedMotion) {
        renderStep("home", 0);
        return;
      }

      // Beat 1: Sleeping
      playAnim("sleeping", 0);
      if (bubbleText) bubbleText.textContent = "Zzz... 💤";
      if (actionLabel) actionLabel.textContent = "Wake up ✨";
      if (badgeText) badgeText.textContent = isNightOwl ? "Night Shift 🦉" : "Resting 💤";
      if (bubble) bubble.hidden = false;

      // Beat 2: Yawn & wake up
      setTimeout(() => {
        if (isBubbleClosed) return;
        playAnim("waking", 1400);
        if (bubbleText) {
          bubbleText.textContent = isNightOwl
            ? "Yawn... Still coding late? Me too! 🌙"
            : "Yawn... Oh, hey there! 👋";
        }
        if (badgeText) badgeText.textContent = isNightOwl ? "Night Shift 🦉" : "Waking Up ☕";

        // Beat 3: Excited & ready for tour
        setTimeout(() => {
          if (isBubbleClosed) return;
          playAnim("excited", 2400);
          renderStep("home", 0);
        }, 1200);
      }, 950);
    };

    setTimeout(() => {
      startIntroSequence();
    }, 450);

    return avatar;
  };

  window.PortfolioApp.ui.initAvatarCompanion = initAvatarCompanion;
})();
