(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;

const renderProjects = (projects, uiProjects) => {
  const grid = document.getElementById("projects-grid");
  if (!grid || !projects) return;

  grid.innerHTML = "";
  (projects.items || []).forEach((project) => {
    const card = createEl("article", "project-card reveal");
    const head = createEl("header", "project-card__head");

    const top = createEl("div", "project-card__top");
    if (uiProjects?.showIcons) {
      const icon = createEl("span", "project-card__icon", project.icon || project.title.slice(0, 2).toUpperCase());
      icon.setAttribute("aria-hidden", "true");
      top.append(icon);
    }
    if (uiProjects?.showCategoryBadge && project.badge) {
      top.append(createEl("span", "project-card__badge", project.badge));
    }

    head.append(
      top,
      createEl("h3", "project-card__title", project.title),
      createEl("p", "project-card__desc", project.description),
    );

    const meta = createEl("div", "project-card__meta");
    const tags = createEl("div", "tags");
    tags.setAttribute("aria-label", "Technologies");
    (project.technologies || []).forEach((technology) => {
      tags.append(createEl("span", "tag", technology));
    });
    meta.append(tags);

    const footer = createEl("footer", "project-card__footer");
    (project.links || []).forEach((linkItem) => {
      const kind = linkItem.kind || "";
      const isChromeStore = kind === "chromeStore" || /chrome/i.test(linkItem.label);
      const isGitHub = kind === "github" || /github/i.test(linkItem.label);
      if (isChromeStore && uiProjects?.showChromeStoreButton === false) return;
      if (isGitHub && uiProjects?.showGithubButton === false) return;
      const buttonClass = isChromeStore
        ? "btn btn--sm btn--store"
        : isGitHub
          ? "btn btn--sm btn--repo"
          : "btn btn--sm btn--ghost";
      const label = isChromeStore
        ? (uiProjects?.chromeStoreLabel || linkItem.label)
        : isGitHub
          ? (uiProjects?.githubLabel || linkItem.label)
          : linkItem.label;
      const link = createEl("a", buttonClass, label);
      link.href = linkItem.url;
      if (/^https?:/i.test(linkItem.url)) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      footer.append(link);
    });

    card.append(head, meta, footer);
    grid.append(card);
  });
};

window.PortfolioApp.sections.renderProjects = renderProjects;
})();