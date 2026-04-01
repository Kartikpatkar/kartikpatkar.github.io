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

const getPortfolioData = (portfolioContent = {}, portfolioConfig = {}) => ({
  ...portfolioContent,
  ui: mergeUiConfig(defaultUiConfig, portfolioConfig.ui),
});

window.PortfolioApp.core.NAV_HEIGHT_CSS_VAR = NAV_HEIGHT_CSS_VAR;
window.PortfolioApp.core.defaultUiConfig = defaultUiConfig;
window.PortfolioApp.core.mergeUiConfig = mergeUiConfig;
window.PortfolioApp.core.getPortfolioData = getPortfolioData;
})();