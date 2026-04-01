(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl, createIcon } = window.PortfolioApp.core;

const renderSocialLinks = (selector, socials) => {
  const container = document.querySelector(selector);
  if (!container || !Array.isArray(socials)) return;

  container.innerHTML = "";
  socials.forEach((social) => {
    const tone = social.icon || social.type || social.label.toLowerCase();
    const link = createEl("a", `social__link social__link--${tone}`);
    link.href = social.url;
    link.setAttribute("aria-label", social.label);
    if (/^https?:/i.test(social.url)) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }

    const icon = createEl("span", "social__icon");
    icon.setAttribute("aria-hidden", "true");
    icon.append(createIcon(tone, "social__iconSvg"));

    const text = createEl("span", "sr-only", social.label);

    link.append(icon, text);
    container.append(link);
  });
};

const renderHeroHighlights = (hero, uiHero) => {
  const container = document.getElementById("hero-highlights");
  if (!container) return;

  const isVisible = Boolean(uiHero?.showHighlights && Array.isArray(hero?.highlights) && hero.highlights.length);
  container.hidden = !isVisible;
  if (!isVisible) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";
  hero.highlights.forEach((highlight) => {
    container.append(createEl("span", "hero__highlight", highlight));
  });
};

const renderHeroFloatingCards = (hero, uiHero) => {
  const container = document.getElementById("hero-floating-cards");
  if (!container) return;

  const isVisible = Boolean(uiHero?.showFloatingCards && Array.isArray(hero?.floatingCards) && hero.floatingCards.length);
  container.hidden = !isVisible;
  if (!isVisible) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";
  hero.floatingCards.forEach((item) => {
    const card = createEl("div", `hero__floatingCard hero__floatingCard--${item.tone || "default"}`);
    const top = createEl("div", "hero__floatingCardTop");
    if (item.icon) {
      top.append(createEl("span", "hero__floatingCardIcon", item.icon));
    }
    const copy = createEl("div", "hero__floatingCardCopy");
    copy.append(
      createEl("p", "hero__floatingCardTitle", item.title),
      createEl("p", "hero__floatingCardValue", item.value),
    );
    top.append(copy);
    card.append(top);
    container.append(card);
  });
};

window.PortfolioApp.sections.renderSocialLinks = renderSocialLinks;
window.PortfolioApp.sections.renderHeroHighlights = renderHeroHighlights;
window.PortfolioApp.sections.renderHeroFloatingCards = renderHeroFloatingCards;
})();