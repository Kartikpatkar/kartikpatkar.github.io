(() => {
  "use strict";

  window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

  const THEMES = ["obsidian", "aurora", "minimal"];
  const STORAGE_KEY = "kp_dev_card_theme";

  /**
   * Developer ID Card Controller
   */
  const initDeveloperCard = () => {
    const modal = document.getElementById("dev-card-modal");
    const cardWrapper = document.getElementById("dev-card-wrapper");
    const card = document.getElementById("dev-card");
    const openBtn = document.getElementById("dev-card-trigger");
    const closeBtn = document.getElementById("dev-card-close");
    const flipFrontBtn = document.getElementById("dev-card-flip-btn");
    const flipBackBtn = document.getElementById("dev-card-flip-back-btn");
    const themeButtons = document.querySelectorAll(".dev-card-theme-btn");

    if (!modal || !card || !openBtn) {
      return;
    }

    let isFlipped = false;
    let lastActiveElement = null;

    // ------------------------------------------------------------------------
    // Dynamic Content Population from PORTFOLIO_CONTENT
    // ------------------------------------------------------------------------
    const populateCardData = () => {
      const content = window.PORTFOLIO_CONTENT || {};
      const site = content.site || {};
      const hero = content.hero || {};
      const certifications = content.certifications?.items || [];

      // Name & Title
      const nameEl = document.getElementById("dev-card-name");
      const titleEl = document.getElementById("dev-card-title");
      if (nameEl && site.name) nameEl.textContent = site.name;
      if (titleEl && hero.subtitle) titleEl.textContent = hero.subtitle;

      // Social Links
      const githubLink = document.getElementById("dev-card-github");
      const linkedinLink = document.getElementById("dev-card-linkedin");
      const trailheadLink = document.getElementById("dev-card-trailhead");

      if (githubLink && site.github) githubLink.href = site.github;
      if (linkedinLink && site.linkedin) linkedinLink.href = site.linkedin;
      if (trailheadLink && site.trailhead) trailheadLink.href = site.trailhead;

      // Populate Backside Top Certifications if present
      const certListContainer = document.getElementById("dev-card-cert-list");
      if (certListContainer && certifications.length > 0) {
        // Pick top 4 standout credentials (Architect & Specialist)
        const topCerts = certifications.slice(0, 4);
        certListContainer.innerHTML = topCerts
          .map((cert) => {
            const shortCode = cert.shortLabel || "SFDC";
            const cleanTitle = cert.title.replace("Salesforce Certified ", "");
            return `
              <div class="dev-card__cert-item">
                <span class="dev-card__cert-name">${cleanTitle}</span>
                <span class="dev-card__cert-tag">${shortCode}</span>
              </div>
            `;
          })
          .join("");
      }
    };

    // ------------------------------------------------------------------------
    // Theme Management (Obsidian, Aurora, Minimal)
    // ------------------------------------------------------------------------
    const applyTheme = (themeName) => {
      if (!THEMES.includes(themeName)) themeName = "obsidian";
      cardWrapper.setAttribute("data-card-theme", themeName);
      try {
        localStorage.setItem(STORAGE_KEY, themeName);
      } catch {}

      themeButtons.forEach((btn) => {
        const btnTheme = btn.getAttribute("data-theme-val");
        const isActive = btnTheme === themeName;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    };

    const savedTheme = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();

    applyTheme(savedTheme || "obsidian");

    themeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const theme = btn.getAttribute("data-theme-val");
        applyTheme(theme);
      });
    });

    // ------------------------------------------------------------------------
    // Card Flip Interaction
    // ------------------------------------------------------------------------
    const toggleFlip = (forceState) => {
      isFlipped = typeof forceState === "boolean" ? forceState : !isFlipped;
      card.classList.toggle("is-flipped", isFlipped);
      card.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
      card.setAttribute(
        "aria-label",
        isFlipped
          ? "Developer ID Card, reverse side showing credentials. Click to flip back."
          : "Developer ID Card, front side showing identity. Click to flip."
      );
    };

    // Flip triggers
    card.addEventListener("click", (e) => {
      // Don't flip if user clicked an anchor or a button inside the card face
      if (e.target.closest("a, .dev-card-theme-btn, .dev-card-close-btn")) {
        return;
      }
      toggleFlip();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!e.target.closest("a, button")) {
          e.preventDefault();
          toggleFlip();
        }
      }
    });

    if (flipFrontBtn) {
      flipFrontBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFlip(true);
      });
    }

    if (flipBackBtn) {
      flipBackBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFlip(false);
      });
    }

    // ------------------------------------------------------------------------
    // 3D Parallax Tilt Effect (Gaming & Hybrid Detail)
    // ------------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

    if (!prefersReducedMotion && !isTouch) {
      let tiltRaf = null;

      const handlePointerMove = (e) => {
        if (tiltRaf) return;
        tiltRaf = requestAnimationFrame(() => {
          tiltRaf = null;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Normalize -1 to +1
          const normX = (x / rect.width - 0.5) * 2;
          const normY = (y / rect.height - 0.5) * 2;

          // Maximum 12deg tilt
          const rotX = isFlipped ? normY * 10 : -normY * 10;
          const rotY = isFlipped ? -180 + normX * 12 : normX * 12;

          card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        });
      };

      const resetTilt = () => {
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        tiltRaf = null;
        card.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
      };

      card.addEventListener("pointermove", handlePointerMove);
      card.addEventListener("pointerleave", resetTilt);
    }

    // ------------------------------------------------------------------------
    // Modal Open & Close Lifecycle
    // ------------------------------------------------------------------------
    const openModal = () => {
      lastActiveElement = document.activeElement;
      populateCardData();
      modal.classList.add("is-active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Focus card
      setTimeout(() => {
        card.focus();
      }, 100);
    };

    const closeModal = () => {
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      // Reset to front side on close
      setTimeout(() => {
        toggleFlip(false);
      }, 350);

      if (lastActiveElement && typeof lastActiveElement.focus === "function") {
        lastActiveElement.focus();
      }
    };

    openBtn.addEventListener("click", openModal);
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("#dev-card-trigger, .btn--dev-card-launcher");
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    });
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    // Click backdrop to close
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Escape key listener
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-active")) {
        closeModal();
      }
    });

    // Quick jump to portfolio sections from back button
    const jumpLinks = modal.querySelectorAll(".dev-card__btn-view-site");
    jumpLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeModal();
      });
    });
  };

  // Expose and boot on DOMContentLoaded
  window.PortfolioApp.ui.developerCard = { init: initDeveloperCard };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDeveloperCard);
  } else {
    initDeveloperCard();
  }
})();
