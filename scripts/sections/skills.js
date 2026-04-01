(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;

const renderSkills = (skills) => {
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
    return;
  }

  (skills.items || []).forEach((item) => {
    const chip = createEl("span", "chip reveal", item.title);
    chip.title = item.text || item.title;
    grid.append(chip);
  });
};

window.PortfolioApp.sections.renderSkills = renderSkills;
})();