(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const NAV_HEIGHT_CSS_VAR = "--nav-height";

const defaultUiConfig = {
  hero: {
    showAvailabilityBadge: true,
    showSocialLinks: true,
    showHighlights: true,
    showFloatingCards: true,
  },
  projects: {
    showIcons: true,
    showCategoryBadge: true,
    showChromeStoreButton: true,
    showGithubButton: true,
    chromeStoreLabel: "Chrome Store",
    githubLabel: "GitHub",
  },
};

const mergeUiConfig = (defaults, overrides) => ({
  ...defaults,
  ...(overrides || {}),
  hero: {
    ...defaults.hero,
    ...(overrides?.hero || {}),
  },
  projects: {
    ...defaults.projects,
    ...(overrides?.projects || {}),
  },
});

const getPortfolioData = (portfolioContent = {}, portfolioConfig = {}) => {
  const content = JSON.parse(JSON.stringify(portfolioContent));

  if (content.experience && Array.isArray(content.experience.items) && content.experience.items.length > 0) {
    const oldestItem = content.experience.items[content.experience.items.length - 1];
    if (oldestItem && oldestItem.duration) {
      const startPart = oldestItem.duration.split("-")[0].trim();
      const startDate = new Date(startPart);
      if (!isNaN(startDate.getTime())) {
        const currentDate = new Date();
        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();
        if (months < 0) {
          years--;
          months += 12;
        }

        if (content.about && Array.isArray(content.about.snapshot)) {
          const expSnapshot = content.about.snapshot.find((item) => item.label === "Experience");
          if (expSnapshot) {
            const monthsStr = months > 0 ? ` ${months} month${months > 1 ? "s" : ""}` : "";
            expSnapshot.value = `${years} year${years > 1 ? "s" : ""}${monthsStr}`;
          }
        }

        if (content.hero && Array.isArray(content.hero.floatingCards)) {
          const expCard = content.hero.floatingCards.find((item) => item.value === "Experience");
          if (expCard) {
            const halfYear = months >= 6 ? ".5" : "";
            expCard.title = `${years}${halfYear}+ Years`;
          }
        }
      }
    }
  }

  // Auto-sync cert count in hero floating cards
  if (content.certifications && Array.isArray(content.certifications.items) && content.hero && Array.isArray(content.hero.floatingCards)) {
    const certCard = content.hero.floatingCards.find((item) => item.value === "Salesforce" || item.title?.includes("Certified"));
    if (certCard) {
      certCard.title = `${content.certifications.items.length}x Certified`;
    }
  }

  // Auto-sync project count in hero floating cards
  if (content.projects && Array.isArray(content.projects.items) && content.hero && Array.isArray(content.hero.floatingCards)) {
    const projCard = content.hero.floatingCards.find((item) => item.value === "Open Source" || item.title?.includes("Projects"));
    if (projCard) {
      projCard.title = `${content.projects.items.length}+ Projects`;
    }
  }

  return {
    ...content,
    ui: mergeUiConfig(defaultUiConfig, portfolioConfig.ui),
  };
};

window.PortfolioApp.core.NAV_HEIGHT_CSS_VAR = NAV_HEIGHT_CSS_VAR;
window.PortfolioApp.core.defaultUiConfig = defaultUiConfig;
window.PortfolioApp.core.mergeUiConfig = mergeUiConfig;
window.PortfolioApp.core.getPortfolioData = getPortfolioData;
})();