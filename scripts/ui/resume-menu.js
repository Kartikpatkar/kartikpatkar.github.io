(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;

const initResumeMenu = ({
  menuSelector,
  triggerSelector,
  triggerLabelSelector,
  panelSelector,
  buttonLabel,
  versions,
  fallbackPath,
}) => {
  const menu = document.querySelector(menuSelector);
  const trigger = document.querySelector(triggerSelector);
  const triggerLabel = document.querySelector(triggerLabelSelector);
  const panel = document.querySelector(panelSelector);
  if (!menu || !trigger || !panel) return;

  const items = Array.isArray(versions) ? versions.filter((item) => item?.path && item?.label) : [];
  if (triggerLabel && typeof buttonLabel === "string") {
    triggerLabel.textContent = buttonLabel;
  }

  const setOpen = (open) => {
    menu.classList.toggle("resume-menu--open", open);
    panel.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  };

  panel.innerHTML = "";

  if (!items.length) {
    trigger.classList.add("resume-menu__trigger--single");
    trigger.addEventListener("click", () => {
      if (!fallbackPath) return;
      const link = document.createElement("a");
      link.href = fallbackPath;
      link.target = "_blank";
      link.rel = "noreferrer";
      document.body.append(link);
      link.click();
      link.remove();
    });
    return;
  }

  items.forEach((item) => {
    const link = createEl("a", "resume-menu__option", item.label);
    link.href = item.path;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("role", "menuitem");
    link.addEventListener("click", () => {
      setOpen(false);
    });
    panel.append(link);
  });

  trigger.addEventListener("click", () => {
    setOpen(!menu.classList.contains("resume-menu--open"));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!menu.contains(target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
};

window.PortfolioApp.ui.initResumeMenu = initResumeMenu;
})();