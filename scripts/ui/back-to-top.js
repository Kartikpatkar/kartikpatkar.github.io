(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { NAV_HEIGHT_CSS_VAR } = window.PortfolioApp.core;

const getNavHeightPx = () => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(NAV_HEIGHT_CSS_VAR)
    .trim();
  const asNumber = Number.parseFloat(value);
  return Number.isFinite(asNumber) ? asNumber : 72;
};

const initBackToTop = ({ buttonSelector, thresholdSelector }) => {
  const backToTopButton = document.querySelector(buttonSelector);
  const thresholdElement = document.querySelector(thresholdSelector);
  if (!backToTopButton || !thresholdElement) return;

  const updateBackToTopVisibility = () => {
    const threshold = thresholdElement.offsetTop + thresholdElement.offsetHeight - getNavHeightPx();
    backToTopButton.hidden = window.scrollY < threshold;
  };

  updateBackToTopVisibility();
  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

window.PortfolioApp.ui.initBackToTop = initBackToTop;
})();