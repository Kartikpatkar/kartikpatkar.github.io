(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;
const { createIcon } = window.PortfolioApp.core;
let activeFilterKey = "all";
const flippableCards = new Set();
let hasScrollFlipReset = false;

const prefersHoverPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const resetFlippedCards = () => {
  flippableCards.forEach((card) => {
    card.classList.remove("is-flipped");
  });
};

const createFlipButton = (label, onClick) => {
  const button = createEl("button", "project-card__toggle");
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.append(createIcon("flip", "project-card__toggleIcon"));
  button.addEventListener("click", onClick);
  return button;
};

const createProjectIcon = (project) => {
  const fallbackLabel = project.icon || project.title.slice(0, 2).toUpperCase();
  const icon = createEl("span", "project-card__icon");

  if (!project.iconImage) {
    icon.textContent = fallbackLabel;
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  icon.classList.add("project-card__icon--image");

  const image = createEl("img", "project-card__icon-image");
  image.src = project.iconImage;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    icon.classList.remove("project-card__icon--image");
    icon.textContent = fallbackLabel;
    icon.setAttribute("aria-hidden", "true");
  }, { once: true });

  icon.append(image);
  icon.setAttribute("aria-hidden", "true");
  return icon;
};

const createProjectCard = (project, uiProjects) => {
  const card = createEl("article", "project-card reveal");
  const flipShell = createEl("div", "project-card__flip");
  const front = createEl("div", "project-card__face project-card__face--front");
  const back = createEl("div", "project-card__face project-card__face--back");
  const head = createEl("header", "project-card__head");
  const identity = createEl("div", "project-card__identity");
  const summary = createEl("div", "project-card__summary");
  const heading = createEl("div", "project-card__heading");
  const hasDetails = Boolean(project.problemSolved || project.impact);

  const toggleFlip = () => {
    card.classList.toggle("is-flipped");
  };

  if (hasDetails) {
    flippableCards.add(card);
    card.addEventListener("mouseleave", () => {
      if (!prefersHoverPointer()) return;
      card.classList.remove("is-flipped");
    });
    front.append(createFlipButton(`Show details for ${project.title}`, toggleFlip));
  }

  if (uiProjects?.showIcons) {
    identity.append(createProjectIcon(project));
  }

  heading.append(createEl("h3", "project-card__title", project.title));
  if (uiProjects?.showCategoryBadge && project.badge) {
    heading.append(createEl("span", "project-card__badge", project.badge));
  }

  const tags = createEl("div", "tags");
  tags.setAttribute("aria-label", "Technologies");
  (project.technologies || []).forEach((technology) => {
    tags.append(createEl("span", "tag", technology));
  });

  summary.append(heading);
  identity.append(summary);
  head.append(identity, createEl("p", "project-card__desc", project.description));

  const details = createEl("div", "project-card__details");
  if (project.problemSolved) {
    const row = createEl("div", "project-card__detail");
    row.append(
      createEl("span", "project-card__detailLabel", "Problem"),
      createEl("p", "project-card__detailText", project.problemSolved),
    );
    details.append(row);
  }
  if (project.impact) {
    const row = createEl("div", "project-card__detail");
    row.append(
      createEl("span", "project-card__detailLabel", "Impact"),
      createEl("p", "project-card__detailText", project.impact),
    );
    details.append(row);
  }

  const footer = createEl("footer", "project-card__footer");
  (project.links || []).forEach((linkItem) => {
    const kind = linkItem.kind || "";
    const isChromeStore = kind === "chromeStore" || /chrome/i.test(linkItem.label);
    const isGitHub = kind === "github" || /github/i.test(linkItem.label);
    if (isChromeStore && uiProjects?.showChromeStoreButton === false) return;
    if (isGitHub && uiProjects?.showGithubButton === false) return;
    const label = isChromeStore
      ? (uiProjects?.chromeStoreLabel || linkItem.label)
      : isGitHub
        ? (uiProjects?.githubLabel || linkItem.label)
        : linkItem.label;
    const linkClass = isChromeStore
      ? "project-card__action project-card__action--chrome"
      : isGitHub
        ? "project-card__action project-card__action--github"
        : "project-card__action";
    const iconName = isChromeStore ? "chrome" : isGitHub ? "github" : "trailhead";
    const link = createEl("a", linkClass);
    link.href = linkItem.url;
    link.setAttribute("aria-label", label);
    link.dataset.tooltip = label;
    if (/^https?:/i.test(linkItem.url)) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    const iconWrap = createEl("span", "project-card__actionIcon");
    iconWrap.append(createIcon(iconName, "project-card__actionSvg"));
    link.append(iconWrap);
    footer.append(link);
  });

  const meta = createEl("div", "project-card__meta");
  meta.append(tags, footer);

  front.append(head, meta);

  if (hasDetails) {
    back.append(createFlipButton(`Show summary for ${project.title}`, toggleFlip));
    const backHeader = createEl("div", "project-card__backHeader");
    backHeader.append(
      createEl("span", "project-card__backEyebrow", "Behind the build"),
      createEl("h4", "project-card__backTitle", project.title),
    );
    const backDetails = createEl("div", "project-card__backDetails");
    if (project.problemSolved) {
      const row = createEl("div", "project-card__detail project-card__detail--problem");
      row.append(
        createEl("span", "project-card__detailLabel", "Problem"),
        createEl("p", "project-card__detailText", project.problemSolved),
      );
      backDetails.append(row);
    }
    if (project.impact) {
      const row = createEl("div", "project-card__detail project-card__detail--impact");
      row.append(
        createEl("span", "project-card__detailLabel", "Impact"),
        createEl("p", "project-card__detailText", project.impact),
      );
      backDetails.append(row);
    }
    back.append(backHeader, backDetails);
  }

  flipShell.append(front);
  if (hasDetails) flipShell.append(back);
  card.append(flipShell);
  return card;
};

const getProjectFilters = (projects) => {
  const filters = Array.isArray(projects?.filters) ? projects.filters : [];
  if (filters.some((filter) => filter.key === "all")) return filters;
  return [{ key: "all", label: "All" }, ...filters];
};

const renderProjectFilters = (projects, uiProjects, grid) => {
  const filtersEl = document.getElementById("projects-filters");
  if (!filtersEl) return;

  const filters = getProjectFilters(projects);
  const items = Array.isArray(projects?.items) ? projects.items : [];
  if (!items.length || filters.length <= 1) {
    filtersEl.innerHTML = "";
    filtersEl.hidden = true;
    return;
  }

  filtersEl.hidden = false;
  filtersEl.innerHTML = "";

  filters.forEach((filter) => {
    const button = createEl("button", "projects__filter", filter.label);
    button.type = "button";
    button.dataset.filter = filter.key;
    const isActive = filter.key === activeFilterKey;
    button.setAttribute("aria-pressed", String(isActive));
    if (isActive) button.classList.add("projects__filter--active");
    button.addEventListener("click", () => {
      activeFilterKey = filter.key;
      renderProjects(projects, uiProjects);
      if (grid) {
        grid.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
    filtersEl.append(button);
  });
};

const renderProjects = (projects, uiProjects) => {
  const grid = document.getElementById("projects-grid");
  if (!grid || !projects) return;

  flippableCards.clear();
  if (!hasScrollFlipReset) {
    window.addEventListener("scroll", resetFlippedCards, { passive: true });
    hasScrollFlipReset = true;
  }

  renderProjectFilters(projects, uiProjects, grid);
  grid.innerHTML = "";
  const items = (projects.items || []).filter((project) => activeFilterKey === "all" || project.category === activeFilterKey);
  items.forEach((project) => {
    grid.append(createProjectCard(project, uiProjects));
  });
};

window.PortfolioApp.sections.renderProjects = renderProjects;
})();