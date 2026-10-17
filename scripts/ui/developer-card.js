(() => {
  "use strict";

  window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

  const initDeveloperCard = () => {
    const modal = document.getElementById("dev-card-modal");
    const lanyard = document.getElementById("lanyard-assembly");
    const card = document.getElementById("dev-card");
    const continueBtn = document.getElementById("dev-badge-continue");
    const flipFrontBtn = document.getElementById("dev-card-flip-btn");
    const flipAltBtn = document.getElementById("dev-badge-flip-alt");
    const flipBackBtn = document.getElementById("dev-card-flip-back-btn");
    const heroTrigger = document.getElementById("dev-card-trigger");

    if (!modal || !card) return;

    let isFlipped = false;
    let isModalOpen = true;

    // Dynamic Experience Auto-Calculation (Matched with Portfolio stats)
    const expEl = document.getElementById("dev-card-exp");
    if (expEl) {
      const content = window.PORTFOLIO_CONTENT || {};
      let startDate = new Date(2020, 9, 1);
      if (content.experience && Array.isArray(content.experience.items) && content.experience.items.length > 0) {
        const oldest = content.experience.items[content.experience.items.length - 1];
        if (oldest?.duration) {
          const startPart = oldest.duration.split("-")[0].trim();
          const parsed = new Date(startPart);
          if (!isNaN(parsed.getTime())) startDate = parsed;
        }
      }
      const now = new Date();
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }
      const half = months >= 6 ? ".5" : "";
      expEl.textContent = `${years}${half}+ Years (Consulting)`;
    }

    // Settle lanyard animation after entrance drop
    if (lanyard) {
      setTimeout(() => {
        lanyard.classList.add("is-settled");
      }, 1200);
    }

    // ------------------------------------------------------------------------
    // Card Flip
    // ------------------------------------------------------------------------
    const toggleFlip = (forceState) => {
      isFlipped = typeof forceState === "boolean" ? forceState : !isFlipped;
      card.classList.toggle("is-flipped", isFlipped);
      card.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
      card.setAttribute(
        "aria-label",
        isFlipped
          ? "Developer ID Badge, reverse side. Click to flip back."
          : "Developer ID Badge, front side. Click to flip."
      );
    };

    if (flipAltBtn) {
      flipAltBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFlip();
      });
    }

    if (flipBackBtn) {
      flipBackBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFlip(false);
      });
    }

    card.addEventListener("click", (e) => {
      if (e.target.closest("button, a")) return;
      toggleFlip();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!e.target.closest("button, a")) {
          e.preventDefault();
          toggleFlip();
        }
      }
    });

    // ------------------------------------------------------------------------
    // Close / Continue to Portfolio (Smooth Exit)
    // ------------------------------------------------------------------------
    const continueToSite = () => {
      if (!isModalOpen) return;
      isModalOpen = false;

      modal.classList.add("is-exiting");

      setTimeout(() => {
        modal.classList.remove("is-active", "is-exiting");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Reset flip state for next open
        setTimeout(() => {
          toggleFlip(false);
        }, 200);
      }, 550);
    };

    if (continueBtn) {
      continueBtn.addEventListener("click", (e) => {
        e.preventDefault();
        continueToSite();
      });
    }

    // Backdrop click outside assembly
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        continueToSite();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isModalOpen) {
        continueToSite();
      }
    });

    // Prevent background scrolling while modal is active on initial load
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    }

    // ------------------------------------------------------------------------
    // Re-open from Hero Button
    // ------------------------------------------------------------------------
    const openBadge = () => {
      isModalOpen = true;
      modal.classList.remove("is-exiting");
      modal.classList.add("is-active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      if (lanyard) {
        lanyard.classList.remove("is-settled");
        // Re-trigger animation
        lanyard.style.animation = "none";
        void lanyard.offsetWidth;
        lanyard.style.animation = "";
        setTimeout(() => {
          lanyard.classList.add("is-settled");
        }, 1200);
      }

      card.focus();
    };

    document.addEventListener("click", (e) => {
      if (e.target.closest("#dev-card-trigger, .btn--dev-card-launcher")) {
        e.preventDefault();
        openBadge();
      }
    });
  };

  window.PortfolioApp.ui.developerCard = { init: initDeveloperCard };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDeveloperCard);
  } else {
    initDeveloperCard();
  }
})();
