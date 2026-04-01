(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { NAV_HEIGHT_CSS_VAR } = window.PortfolioApp.core;

const initNavigation = () => {
  const body = document.body;
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector("#primary-navigation");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((anchor) => document.querySelector(anchor.getAttribute("href")))
    .filter(Boolean);

  const setMenuOpen = (open) => {
    body.classList.toggle("menu-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
    if (navToggle) navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  const setActiveLink = (sectionId) => {
    navLinks.forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const isActive = href === `#${sectionId}`;
      anchor.classList.toggle("nav__link--active", isActive);
      if (isActive) anchor.setAttribute("aria-current", "page");
      else anchor.removeAttribute("aria-current");
    });
  };

  const getNavHeightPx = () => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(NAV_HEIGHT_CSS_VAR)
      .trim();
    const asNumber = Number.parseFloat(value);
    return Number.isFinite(asNumber) ? asNumber : 72;
  };

  let sectionObserver;
  const setupSectionObserver = () => {
    if (!sections.length) return;

    sectionObserver?.disconnect();
    sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) {
          setActiveLink(visible[0].target.id);
        }
      },
      {
        root: null,
        threshold: [0.25, 0.35, 0.5, 0.65],
        rootMargin: `-${getNavHeightPx()}px 0px -55% 0px`,
      },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.contains("menu-open");
      setMenuOpen(!isOpen);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 761px)").matches) {
      setMenuOpen(false);
    }

    setupSectionObserver();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (body.classList.contains("menu-open")) setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("menu-open")) return;
    const target = event.target;
    if (!(target instanceof Element)) return;

    const clickedInsideMenu = navMenu?.contains(target) || navToggle?.contains(target);
    if (!clickedInsideMenu) setMenuOpen(false);
  });

  setupSectionObserver();
};

window.PortfolioApp.ui.initNavigation = initNavigation;
})();