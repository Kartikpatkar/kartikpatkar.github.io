(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;

const renderSkills = (skills) => {
  const grid = document.getElementById("skills-grid");
  if (!grid || !skills) return;

  grid.innerHTML = "";
  if (Array.isArray(skills.groups) && skills.groups.length) {
    skills.groups.forEach((group) => {
      const card = createEl("article", `skill-group skill-group--${group.tone || "salesforce"} reveal`);
      const head = createEl("div", "skill-group__head");
      head.append(
        createEl("span", "skill-group__icon", group.icon || "SK"),
        createEl("h3", "skill-group__title", group.title),
      );

      const items = createEl("div", "skill-group__items");
      (group.items || []).forEach((item) => {
        items.append(createEl("span", "skill-pill", item));
      });

      card.append(head, items);
      grid.append(card);
    });
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