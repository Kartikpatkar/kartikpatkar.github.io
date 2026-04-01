(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;

const renderCertifications = (certifications) => {
  const grid = document.getElementById("certifications-grid");
  const title = document.getElementById("certifications-title");
  if (!grid || !certifications) return;

  grid.innerHTML = "";
  const items = certifications.items || [];
  if (title) title.textContent = certifications.title || "Certifications";
  items.forEach((item) => {
    const card = createEl("article", `cert-card cert-card--${item.theme || "salesforce"} reveal`);
    const metaParts = [item.title, item.issuer];
    if (item.issued) metaParts.push(`Issued ${item.issued}`);
    if (item.credentialId) metaParts.push(`Credential ID ${item.credentialId}`);
    const metaLabel = metaParts.join(" • ");
    card.setAttribute("aria-label", metaLabel);
    card.title = metaLabel;

    const badge = createEl("div", "cert-card__badge");
    badge.setAttribute("aria-hidden", "true");
    if (item.badgeImage) {
      const badgeImage = document.createElement("img");
      badgeImage.className = "cert-card__badgeImage";
      badgeImage.src = item.badgeImage;
      badgeImage.alt = item.badgeImageAlt || `${item.title} badge`;
      badgeImage.loading = "lazy";
      badge.append(badgeImage);
    } else {
      const placeholder = createEl("div", "cert-card__badgePlaceholder");
      placeholder.append(
        createEl("span", "cert-card__badgeLabel", item.shortLabel || "BADGE"),
        createEl(
          "span",
          "cert-card__badgeHint",
          item.badgePlaceholder || certifications.badgePlaceholder || "Add official badge URL or file",
        ),
      );
      badge.append(placeholder);
    }

    const srText = createEl("span", "sr-only", metaLabel);
    card.append(badge, srText);
    grid.append(card);
  });
};

window.PortfolioApp.sections.renderCertifications = renderCertifications;
})();