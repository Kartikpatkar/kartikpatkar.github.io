(() => {
  "use strict";

  window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

  // Multi-step dialogue trees per section
  const SECTION_STORIES = {
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
          text: "10x Certified Salesforce Consultant & Senior Dev crafting enterprise scale! ☁️",
          button: "Tell me more 💡",
          animation: "proud",
          nextStep: 1
        },
        {
          text: "Over 5.5+ years building high-throughput Apex, LWCs & complex integrations.",
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
          text: "Yes! Over 9+ custom developer tools, test suites & automated workflows.",
          button: "Show me the proof 📈",
          animation: "thinking",
          nextStep: 2
        },
        {
          text: "Let's inspect the real business metrics and operational outcomes!",
          button: "Fly to Impact 📈",
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
          text: "Here's the workshop! Live extensions, productivity kits & Apex libraries. 🧩",
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
          text: "5.5+ years of enterprise consulting, delivery & senior development! 💼",
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
          text: "Kartik passed 10 Salesforce certification exams on his very first attempt! 🎓",
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

  const EASTER_EGGS = [
    { text: "Bloop! Did you just poke me? 🤖", anim: "surprised" },
    { text: "10x Certified Trailblazer right here! ☁️", anim: "proud" },
    { text: "Tip: Download the ATS or Modern resume in the hero menu! 📄", anim: "happy" },
    { text: "I'm rendering with pure SVG vector math — lightweight & fast! 💨", anim: "excited" },
    { text: "Kartik loves building tools that save teams hundreds of hours! ⚡", anim: "celebrate" },
    { text: "Need custom Salesforce integrations? Kartik's your engineer! 🚀", anim: "working" }
  ];
  let easterEggIdx = 0;

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

    const renderStep = (sectionId, stepIdx) => {
      const sectionData = SECTION_STORIES[sectionId];
      if (!sectionData) return;

      activeSectionId = sectionId;
      stepIndex = stepIdx;
      const currentStep = sectionData.steps[stepIndex] || sectionData.steps[0];

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

    // Clicking avatar character
    if (characterBtn) {
      const onCharacterClick = () => {
        if (bubble && bubble.hidden) {
          isBubbleClosed = false;
          bubble.hidden = false;
          renderStep(activeSectionId, stepIndex);
        } else {
          // Easter egg response
          const egg = EASTER_EGGS[easterEggIdx % EASTER_EGGS.length];
          easterEggIdx++;
          if (bubbleText) {
            bubbleText.textContent = egg.text;
          }
          playAnim(egg.anim, 2800);
        }
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
    const sections = document.querySelectorAll("main section[id], #skills");
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

    // Start tour on load
    setTimeout(() => {
      renderStep("home", 0);
    }, 700);

    return avatar;
  };

  window.PortfolioApp.ui.initAvatarCompanion = initAvatarCompanion;
})();
