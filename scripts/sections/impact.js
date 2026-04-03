(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;

const renderImpact = (impact) => {
  const section = document.getElementById("impact");
  const eyebrow = document.getElementById("impact-eyebrow");
  const title = document.getElementById("impact-title");
  const subtitle = document.getElementById("impact-subtitle");
  const grid = document.getElementById("impact-grid");
  const summary = document.getElementById("impact-summary");

  if (!section || !grid || !summary || !impact) return;

  section.hidden = false;
  if (eyebrow) eyebrow.textContent = impact.eyebrow || "Current Role Impact";
  if (title) title.textContent = impact.title || "Client Delivery Metrics";
  if (subtitle) subtitle.textContent = impact.subtitle || "";

  grid.innerHTML = "";
  summary.innerHTML = "";

  (impact.metrics || []).forEach((item) => {
    const card = createEl("article", "impact-card reveal");
    card.append(
      createEl("strong", "impact-card__value", item.value || ""),
      createEl("p", "impact-card__label", item.label || ""),
    );
    grid.append(card);
  });

  const summaryCard = createEl("article", "impact-summaryCard reveal");
  const sectorBlock = createEl("div", "impact-summaryCard__block");
  const sectorChips = createEl("div", "impact-summaryCard__chips");
  (impact.sectors || []).forEach((sector) => {
    sectorChips.append(createEl("span", "impact-summaryCard__chip", sector));
  });
  sectorBlock.append(
    createEl("p", "impact-summaryCard__eyebrow", impact.sectorsTitle || "Industry Coverage"),
    sectorChips,
  );

  const deliveryBlock = createEl("div", "impact-summaryCard__block");
  const deliveryList = createEl("ul", "impact-summaryCard__list");
  (impact.deliveryPoints || []).forEach((point) => {
    deliveryList.append(createEl("li", "impact-summaryCard__listItem", point));
  });
  deliveryBlock.append(
    createEl("p", "impact-summaryCard__eyebrow", impact.deliveryTitle || "Delivery Scope"),
    deliveryList,
  );

  summaryCard.append(sectorBlock, deliveryBlock);
  summary.append(summaryCard);
};

window.PortfolioApp.sections.renderImpact = renderImpact;
})();