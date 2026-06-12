(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl, createIcon } = window.PortfolioApp.core;

const renderDirectLinks = (site) => {
  const list = document.getElementById("direct-links");
  const footerLinks = document.getElementById("footer-links");
  if (!list || !footerLinks || !site) return;

  list.innerHTML = "";
  footerLinks.innerHTML = "";

  const directItems = [
    { label: "Email", text: site.email, href: `mailto:${site.email}`, icon: "email", tone: "email" },
    { label: "LinkedIn", text: site.linkedinLabel, href: site.linkedin, icon: "linkedin", tone: "linkedin" },
    { label: "GitHub", text: site.githubLabel, href: site.github, icon: "github", tone: "github" },
    ...(site.trailhead
      ? [{ label: "Trailhead", text: site.trailheadLabel || site.trailhead, href: site.trailhead, icon: "trailhead", tone: "trailhead" }]
      : []),
  ];

  directItems.forEach((item) => {
    if (item.tone === "email") {
      const container = createEl("div", "contact-link contact-link--email contact-link--compound");

      const link = createEl("a", "contact-link__main");
      link.href = item.href;

      const iconWrap = createEl("span", "contact-link__iconWrap");
      iconWrap.append(createIcon(item.icon, "contact-link__icon"));

      const copy = createEl("span", "contact-link__copy");
      copy.append(
        createEl("p", "contact-link__label", item.label),
        createEl("p", "contact-link__value", item.text),
      );

      link.append(iconWrap, copy);

      const copyBtn = createEl("button", "contact-link__actionBtn", "Copy");
      copyBtn.type = "button";
      copyBtn.setAttribute("aria-label", "Copy email to clipboard");
      copyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(item.text).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = "Copied!";
          copyBtn.classList.add("contact-link__actionBtn--success");
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove("contact-link__actionBtn--success");
          }, 2000);
        });
      });

      container.append(link, copyBtn);
      list.append(container);
    } else {
      const link = createEl("a", `contact-link contact-link--${item.tone}`);
      link.href = item.href;
      if (/^https?:/i.test(item.href)) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }

      const iconWrap = createEl("span", "contact-link__iconWrap");
      iconWrap.append(createIcon(item.icon, "contact-link__icon"));

      const copy = createEl("span", "contact-link__copy");
      copy.append(
        createEl("p", "contact-link__label", item.label),
        createEl("p", "contact-link__value", item.text),
      );

      link.append(iconWrap, copy);
      list.append(link);
    }
  });

  directItems.forEach((item) => {
    const link = createEl("a", "link", item.label);
    link.href = item.href;
    if (/^https?:/i.test(item.href)) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    footerLinks.append(link);
  });
};

window.PortfolioApp.sections.renderDirectLinks = renderDirectLinks;
})();