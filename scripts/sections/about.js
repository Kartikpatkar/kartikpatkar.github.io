(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;

const renderAbout = (about) => {
  const grid = document.getElementById("about-grid");
  if (!grid || !about) return;

  grid.innerHTML = "";

  const summaryCard = createEl("div", "card reveal");
  summaryCard.append(
    createEl("h3", "card__title", about.summaryTitle),
    createEl("p", "card__text", about.summary),
  );

  const snapshotCard = createEl("div", "card reveal");
  const snapshotTitle = createEl("h3", "card__title", about.snapshotTitle);
  const snapshotList = createEl("ul", "list");
  (about.snapshot || []).forEach((item) => {
    const listItem = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${item.label}: `;
    listItem.append(strong, document.createTextNode(item.value));
    snapshotList.append(listItem);
  });
  snapshotCard.append(snapshotTitle, snapshotList);

  const expertiseCard = createEl("div", "card reveal");
  const expertiseTitle = createEl("h3", "card__title", about.expertiseTitle);
  const chips = createEl("div", "chips");
  chips.setAttribute("aria-label", "Key expertise areas");
  (about.expertise || []).forEach((item) => {
    chips.append(createEl("span", "chip", item));
  });
  expertiseCard.append(expertiseTitle, chips);

  grid.append(summaryCard, snapshotCard, expertiseCard);
};

window.PortfolioApp.sections.renderAbout = renderAbout;
})();