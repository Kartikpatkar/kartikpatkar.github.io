(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const showBootstrapError = (message) => {
  hideAppSkeleton();
  const errorEl = document.getElementById("app-error");
  if (!errorEl) return;
  errorEl.hidden = false;
  errorEl.textContent = message;
};

const hideAppSkeleton = () => {
  document.body.classList.remove("app-loading");

  const skeletonEl = document.getElementById("app-skeleton");
  if (!skeletonEl) return;

  skeletonEl.classList.add("app-skeleton--hidden");
  window.setTimeout(() => {
    skeletonEl.hidden = true;
  }, 220);
};

const { getPortfolioData } = window.PortfolioApp.core;
const { setLink, setText, setVisibility } = window.PortfolioApp.core;
const {
  renderAbout,
  renderCertifications,
  renderDirectLinks,
  renderExperience,
  renderImpact,
  renderHeroFloatingCards,
  renderHeroHighlights,
  renderHeroSpecialties,
  renderProjects,
  renderSkills,
  renderSocialLinks,
} = window.PortfolioApp.sections;
const { initBackToTop, initContactForm, initNavigation, initReveal } = window.PortfolioApp.ui;

if (!getPortfolioData) {
  showBootstrapError("Portfolio bootstrap failed: core config script did not load.");
  throw new Error("Portfolio bootstrap failed: getPortfolioData is unavailable.");
}

const portfolioData = getPortfolioData(window.PORTFOLIO_CONTENT || {}, window.PORTFOLIO_CONFIG || {});

const renderPortfolioData = () => {
  if (!portfolioData) return;

  const { ui = {}, site, hero, about, impact, skills, certifications, projects, experience, contact } = portfolioData;
  const heroUi = ui.hero || {};
  const projectUi = ui.projects || {};
  const siteRole = site.role || hero.subtitle || "";
  const siteDescription = site.description || "Salesforce Consultant and Senior Developer focused on Apex, LWC, integrations, automation, and developer tools.";

  document.title = siteRole ? `${site.name} | ${siteRole}` : site.name;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute("content", siteDescription);

  setText("#brand-mark", site.shortName);
  setText("#brand-text", site.name);
  setText("#hero-eyebrow", hero.eyebrow);
  setText("#hero-title", site.name);
  setText("#hero-role", siteRole);
  setText("#hero-subtitle", hero.subtitle);
  setText("#hero-value", hero.valueStatement || "");
  const availabilityBadgeText = hero.availabilityBadgeText || site.availability || "";
  setText("#hero-badge-text", availabilityBadgeText);
  setText("#about-subtitle", about.subtitle);
  setText("#skills-subtitle", skills.subtitle);
  setText("#certifications-subtitle", certifications?.subtitle || "");
  setText("#projects-subtitle", projects.subtitle);
  setText("#experience-subtitle", experience.subtitle);
  setText("#contact-subtitle", contact.subtitle);
  setText("#contact-intro", contact.intro);
  setText("#contact-direct-intro", contact.directLinksIntro || "Prefer a direct route? Reach out on the platforms below.");
  setText("#footer-name", site.name);

  setLink("#resume-link", site.resumePath, hero.primaryCtaLabel);
  setLink("#secondary-cta", hero.secondaryCtaHref, hero.secondaryCtaLabel);
  setVisibility("#hero-social", Boolean(heroUi.showSocialLinks));
  setVisibility(
    "#hero-availability-badge",
    Boolean(heroUi.showAvailabilityBadge) && Boolean(availabilityBadgeText),
  );

  const avatar = document.getElementById("hero-avatar");
  if (avatar instanceof HTMLImageElement) {
    avatar.src = site.profileImage;
    avatar.alt = site.profileImageAlt;
  }

  renderSocialLinks("#hero-social", hero.socials);
  renderHeroSpecialties(hero);
  renderHeroHighlights(hero, heroUi);
  renderHeroFloatingCards(hero, heroUi);
  renderAbout(about);
  renderImpact(impact);
  renderSkills(skills, site);
  renderCertifications(certifications);
  renderProjects(projects, projectUi);
  renderExperience(experience);
  renderDirectLinks(site);
};

const initFooterYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
};

try {
  if (!portfolioData.site || !portfolioData.hero) {
    throw new Error("Portfolio data is missing or did not load.");
  }

  renderPortfolioData();
  initFooterYear();
  initNavigation();
  initBackToTop({ buttonSelector: "#back-to-top", thresholdSelector: "#home" });
  initReveal();
  initContactForm({
    formSelector: "#contact-form",
    nameSelector: "#name",
    emailSelector: "#email",
    messageSelector: "#message",
    recipient: portfolioData.site?.email || "kartikkp.assets@gmail.com",
  });
  window.requestAnimationFrame(() => {
    hideAppSkeleton();
  });
} catch (error) {
  showBootstrapError(`Portfolio bootstrap failed: ${error.message}`);
  throw error;
}
})();