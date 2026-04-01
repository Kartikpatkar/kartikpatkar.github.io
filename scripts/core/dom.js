(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const createEl = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (typeof text === "string") element.textContent = text;
  return element;
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") element.textContent = value;
};

const setLink = (selector, href, text) => {
  const element = document.querySelector(selector);
  if (!element) return;
  if (href) element.setAttribute("href", href);
  if (typeof text === "string") element.textContent = text;
};

const setVisibility = (selector, isVisible) => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.hidden = !isVisible;
  element.setAttribute("aria-hidden", String(!isVisible));
};

window.PortfolioApp.core.createEl = createEl;
window.PortfolioApp.core.setText = setText;
window.PortfolioApp.core.setLink = setLink;
window.PortfolioApp.core.setVisibility = setVisibility;
})();