(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl, createIcon } = window.PortfolioApp.core;

const renderTrailheadSummary = (skills, site) => {
  const container = document.getElementById("skills-trailhead");
  if (!container) return;

  const trailhead = skills?.trailhead;
  if (!trailhead || !Array.isArray(trailhead.stats) || !trailhead.stats.length) {
    container.innerHTML = "";
    container.hidden = true;
    return;
  }

  container.hidden = false;
  container.innerHTML = "";

  const card = createEl("article", "trailhead-card reveal");
  card.setAttribute("aria-label", trailhead.title || "Trailhead Snapshot");

  const header = createEl("div", "trailhead-card__header");
  const brand = createEl("div", "trailhead-card__brand");
  const artwork = createEl("div", "trailhead-card__artwork");
  const copy = createEl("div", "trailhead-card__copy");
  const logoImage = trailhead.logoImage ? document.createElement("img") : null;
  const rankImage = trailhead.rankImage ? document.createElement("img") : null;

  if (logoImage) {
    logoImage.className = "trailhead-card__logoImage";
    logoImage.src = trailhead.logoImage;
    logoImage.alt = trailhead.logoImageAlt || "Trailhead";
    artwork.append(logoImage);
  } else {
    artwork.append(createIcon("trailhead", "trailhead-card__icon"));
  }

  if (rankImage) {
    rankImage.className = "trailhead-card__rankImage";
    rankImage.src = trailhead.rankImage;
    rankImage.alt = trailhead.rankImageAlt || "Trailhead rank badge";
    artwork.append(rankImage);
  }

  copy.append(
    createEl("p", "trailhead-card__eyebrow", trailhead.eyebrow || "Trailhead"),
    createEl("h3", "trailhead-card__title", trailhead.title || "Trailhead Snapshot"),
  );
  const meta = createEl("div", "trailhead-card__meta");
  if (trailhead.caption) {
    meta.append(createEl("p", "trailhead-card__caption", trailhead.caption));
  }

  const headerText = createEl("div", "trailhead-card__headerText");
  headerText.append(copy, meta);
  brand.append(artwork, headerText);
  header.append(brand);

  const statsGrid = createEl("div", "trailhead-card__stats");
  trailhead.stats.forEach((item) => {
    const stat = createEl("div", "trailhead-card__stat");
    stat.append(
      createEl("span", "trailhead-card__statValue", item.value || ""),
      createEl("span", "trailhead-card__statLabel", item.label || ""),
    );
    statsGrid.append(stat);
  });

  const profileUrl = trailhead.profileUrl || site?.trailhead;
  if (profileUrl) {
    const actions = createEl("div", "trailhead-card__actions");
    const link = createEl("a", "trailhead-card__link", trailhead.linkLabel || "View Trailhead Profile");
    link.href = profileUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    actions.append(link);
    header.append(actions);
  }

  card.append(header, statsGrid);

  container.append(card);
};

const renderSkills = (skills, site) => {
  const grid = document.getElementById("skills-grid");
  if (!grid || !skills) return;

  grid.innerHTML = "";
  if (Array.isArray(skills.groups) && skills.groups.length) {
    const card = createEl("article", "skills-card reveal");

    skills.groups.forEach((group) => {
      const block = createEl("section", `skill-group skill-group--${group.tone || "salesforce"}`);
      block.append(createEl("h3", "skill-group__title", group.title));

      const items = createEl("div", "skill-group__items");
      (group.items || []).forEach((item) => {
        items.append(createEl("span", "skill-pill", item));
      });

      block.append(items);
      card.append(block);
    });

    grid.append(card);
    renderTrailheadSummary(skills, site);
    return;
  }

  renderTrailheadSummary(skills, site);
  (skills.items || []).forEach((item) => {
    const chip = createEl("span", "chip reveal", item.title);
    chip.title = item.text || item.title;
    grid.append(chip);
  });
};

window.PortfolioApp.sections.renderSkills = renderSkills;
})();