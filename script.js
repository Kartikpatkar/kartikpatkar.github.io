/*
  Portfolio interactions:
  - Sticky navbar active link highlight (IntersectionObserver)
  - Mobile menu toggle
  - Reveal-on-scroll animations
  - Contact form -> mailto
*/

(() => {
  const NAV_HEIGHT_CSS_VAR = "--nav-height";
  const portfolioConfig = window.PORTFOLIO_CONFIG || {};
  const portfolioContent = window.PORTFOLIO_CONTENT || {};
  const portfolioData = {
    ...portfolioContent,
    ui: portfolioConfig.ui || {},
  };

  const createEl = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  };

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && typeof value === "string") element.textContent = value;
  };

  const setLink = (selector, href, text) => {
    const element = document.querySelector(selector);
    if (!element) return;
    if (href) element.setAttribute("href", href);
    if (typeof text === "string") element.textContent = text;
  };

  const setVisibility = (selector, isVisible) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.hidden = !isVisible;
  };

  const renderSocialLinks = (selector, socials) => {
    const container = document.querySelector(selector);
    if (!container || !Array.isArray(socials)) return;

    container.innerHTML = "";
    socials.forEach((social) => {
      const link = createEl("a", "social__link");
      link.href = social.url;
      if (/^https?:/i.test(social.url)) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }

      const icon = createEl("span", "social__icon", social.icon || social.label.slice(0, 2));
      icon.setAttribute("aria-hidden", "true");

      const text = createEl("span", "social__text", social.label);

      link.append(icon, text);
      container.append(link);
    });
  };

  const renderHeroHighlights = (hero, uiHero) => {
    const container = document.getElementById("hero-highlights");
    if (!container) return;

    const isVisible = Boolean(uiHero?.showHighlights && Array.isArray(hero?.highlights) && hero.highlights.length);
    container.hidden = !isVisible;
    if (!isVisible) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = "";
    hero.highlights.forEach((highlight) => {
      container.append(createEl("span", "hero__highlight", highlight));
    });
  };

  const renderHeroFloatingCards = (hero, uiHero) => {
    const container = document.getElementById("hero-floating-cards");
    if (!container) return;

    const isVisible = Boolean(uiHero?.showFloatingCards && Array.isArray(hero?.floatingCards) && hero.floatingCards.length);
    container.hidden = !isVisible;
    if (!isVisible) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = "";
    hero.floatingCards.forEach((item) => {
      const card = createEl("div", `hero__floatingCard hero__floatingCard--${item.tone || "default"}`);
      card.append(
        createEl("p", "hero__floatingCardTitle", item.title),
        createEl("p", "hero__floatingCardValue", item.value),
      );
      container.append(card);
    });
  };

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

  const renderSkills = (skills) => {
    const grid = document.getElementById("skills-grid");
    if (!grid || !skills) return;

    grid.innerHTML = "";
    (skills.items || []).forEach((item) => {
      const card = createEl("article", "skill-pill reveal");
      card.title = item.text || item.title;
      card.append(createEl("h3", "skill-pill__title", item.title));
      grid.append(card);
    });
  };

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

  const renderProjects = (projects, uiProjects) => {
    const grid = document.getElementById("projects-grid");
    if (!grid || !projects) return;

    grid.innerHTML = "";
    (projects.items || []).forEach((project) => {
      const card = createEl("article", "project-card reveal");
      const head = createEl("header", "project-card__head");

      const top = createEl("div", "project-card__top");
      if (uiProjects?.showIcons) {
        const icon = createEl("span", "project-card__icon", project.icon || project.title.slice(0, 2).toUpperCase());
        icon.setAttribute("aria-hidden", "true");
        top.append(icon);
      }
      if (uiProjects?.showCategoryBadge && project.badge) {
        top.append(createEl("span", "project-card__badge", project.badge));
      }

      head.append(
        top,
        createEl("h3", "project-card__title", project.title),
        createEl("p", "project-card__desc", project.description),
      );

      const meta = createEl("div", "project-card__meta");
      const tags = createEl("div", "tags");
      tags.setAttribute("aria-label", "Technologies");
      (project.technologies || []).forEach((technology) => {
        tags.append(createEl("span", "tag", technology));
      });
      meta.append(tags);

      const footer = createEl("footer", "project-card__footer");
      (project.links || []).forEach((linkItem) => {
        const kind = linkItem.kind || "";
        const isChromeStore = kind === "chromeStore" || /chrome/i.test(linkItem.label);
        const isGitHub = kind === "github" || /github/i.test(linkItem.label);
        if (isChromeStore && uiProjects?.showChromeStoreButton === false) return;
        if (isGitHub && uiProjects?.showGithubButton === false) return;
        const buttonClass = isChromeStore
          ? "btn btn--sm btn--store"
          : isGitHub
            ? "btn btn--sm btn--repo"
            : "btn btn--sm btn--ghost";
        const label = isChromeStore
          ? (uiProjects?.chromeStoreLabel || linkItem.label)
          : isGitHub
            ? (uiProjects?.githubLabel || linkItem.label)
            : linkItem.label;
        const link = createEl("a", buttonClass, label);
        link.href = linkItem.url;
        if (/^https?:/i.test(linkItem.url)) {
          link.target = "_blank";
          link.rel = "noreferrer";
        }
        footer.append(link);
      });

      card.append(head, meta, footer);
      grid.append(card);
    });
  };

  const renderExperience = (experience) => {
    const timeline = document.getElementById("experience-timeline");
    const extras = document.getElementById("experience-extras");
    if (!timeline || !experience) return;

    timeline.innerHTML = "";
    (experience.items || []).forEach((item) => {
      const article = createEl("article", "timeline__item reveal");
      article.append(createEl("div", "timeline__marker"));
      article.firstChild.setAttribute("aria-hidden", "true");

      const content = createEl("div", "timeline__content card");
      const top = createEl("div", "timeline__top");
      const titleWrap = createEl("div", "timeline__titleWrap");
      titleWrap.append(
        createEl("h3", "card__title", item.role),
        createEl("p", "timeline__org", item.company),
      );

      const metaWrap = createEl("div", "timeline__metaWrap");
      if (item.duration) metaWrap.append(createEl("p", "timeline__meta", item.duration));
      if (item.location) metaWrap.append(createEl("p", "timeline__meta", item.location));

      top.append(titleWrap, metaWrap);

      const list = createEl("ul", "list");
      (item.responsibilities || []).forEach((responsibility) => {
        list.append(createEl("li", "", responsibility));
      });

      content.append(top, list);
      article.append(content);
      timeline.append(article);
    });

    if (!extras) return;
    extras.innerHTML = "";

    const hasEducation = Array.isArray(experience.educationItems) && experience.educationItems.length;
    const hasAwards = Array.isArray(experience.awardsItems) && experience.awardsItems.length;
    extras.hidden = !(hasEducation || hasAwards);
    if (!(hasEducation || hasAwards)) return;

    if (hasEducation) {
      const educationCard = createEl("article", "card reveal experience__extraCard");
      educationCard.append(createEl("h3", "card__title", experience.educationTitle || "Education"));
      const educationList = createEl("div", "experience__educationList");
      experience.educationItems.forEach((item) => {
        const row = createEl("div", "experience__educationItem");
        row.append(
          createEl("h4", "experience__educationInstitution", item.institution),
          createEl("p", "experience__educationQualification", item.qualification),
          createEl("p", "experience__educationPeriod", item.period),
        );
        educationList.append(row);
      });
      educationCard.append(educationList);
      extras.append(educationCard);
    }

    if (hasAwards) {
      const awardsCard = createEl("article", "card reveal experience__extraCard");
      awardsCard.append(createEl("h3", "card__title", experience.awardsTitle || "Awards & Recognition"));
      const awardsList = createEl("ul", "list");
      experience.awardsItems.forEach((item) => {
        awardsList.append(createEl("li", "", item));
      });
      awardsCard.append(awardsList);
      extras.append(awardsCard);
    }
  };

  const renderDirectLinks = (site) => {
    const list = document.getElementById("direct-links");
    const footerLinks = document.getElementById("footer-links");
    if (!list || !footerLinks || !site) return;

    list.innerHTML = "";
    footerLinks.innerHTML = "";

    const directItems = [
      { label: "Email", text: site.email, href: `mailto:${site.email}` },
      { label: "GitHub", text: site.githubLabel, href: site.github },
      { label: "LinkedIn", text: site.linkedinLabel, href: site.linkedin },
      ...(site.trailhead ? [{ label: "Trailhead", text: site.trailheadLabel || site.trailhead, href: site.trailhead }] : []),
    ];

    directItems.forEach((item) => {
      const listItem = document.createElement("li");
      const strong = document.createElement("strong");
      strong.textContent = `${item.label}: `;
      const link = createEl("a", "link", item.text);
      link.href = item.href;
      if (/^https?:/i.test(item.href)) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      listItem.append(strong, link);
      list.append(listItem);
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

  const renderPortfolioData = () => {
    if (!portfolioData) return;

    const { ui = {}, site, hero, about, skills, certifications, projects, experience, contact } = portfolioData;
    const heroUi = ui.hero || {};
    const projectUi = ui.projects || {};

    document.title = `${site.name} | ${site.role}`;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.setAttribute("content", site.description);

    setText("#brand-mark", site.shortName);
    setText("#brand-text", site.name);
    setText("#hero-eyebrow", hero.eyebrow);
    setText("#hero-title", site.name);
    setText("#hero-role", site.role);
    setText("#hero-subtitle", hero.subtitle);
    const availabilityBadgeText = hero.availabilityBadgeText || site.availability || "";
    setText("#hero-badge-text", availabilityBadgeText);
    setText("#about-subtitle", about.subtitle);
    setText("#skills-subtitle", skills.subtitle);
    setText("#certifications-subtitle", certifications?.subtitle || "");
    setText("#projects-subtitle", projects.subtitle);
    setText("#experience-subtitle", experience.subtitle);
    setText("#contact-subtitle", contact.subtitle);
    setText("#contact-intro", contact.intro);
    setText("#footer-name", site.name);

    setLink("#resume-link", site.resumePath, hero.primaryCtaLabel);
    setLink("#secondary-cta", hero.secondaryCtaHref, hero.secondaryCtaLabel);
    setVisibility("#hero-social", heroUi.showSocialLinks !== false);
    setVisibility(
      "#hero-availability-badge",
      heroUi.showAvailabilityBadge !== false && Boolean(availabilityBadgeText),
    );

    const avatar = document.getElementById("hero-avatar");
    if (avatar) {
      avatar.src = site.profileImage;
      avatar.alt = site.profileImageAlt;
    }

    renderSocialLinks("#hero-social", hero.socials);
    renderHeroHighlights(hero, heroUi);
    renderHeroFloatingCards(hero, heroUi);
    renderAbout(about);
    renderSkills(skills);
    renderCertifications(certifications);
    renderProjects(projects, projectUi);
    renderExperience(experience);
    renderDirectLinks(site);
  };

  renderPortfolioData();

  const body = document.body;
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector("#primary-navigation");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  const setMenuOpen = (open) => {
    body.classList.toggle("menu-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
    if (navToggle) navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
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
    // Close the menu if we exit mobile layout.
    if (window.matchMedia("(min-width: 761px)").matches) {
      setMenuOpen(false);
    }

    setupSectionObserver();
  });

  // Active section highlight
  const setActiveLink = (sectionId) => {
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const isActive = href === `#${sectionId}`;
      a.classList.toggle("nav__link--active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
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
  function setupSectionObserver() {
    if (!sections.length) return;

    sectionObserver?.disconnect();
    sectionObserver = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section.
        const visible = entries
          .filter((e) => e.isIntersecting)
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
  }

  setupSectionObserver();

  // Reveal animations
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // Contact form -> mailto
  const form = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const errName = document.getElementById("error-name");
  const errEmail = document.getElementById("error-email");
  const errMessage = document.getElementById("error-message");

  const setError = (el, msg) => {
    if (!el) return;
    el.textContent = msg;
  };

  const isEmail = (value) => {
    // Pragmatic email validation (client-side only)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  };

  if (form && nameInput && emailInput && messageInput) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = String(nameInput.value || "").trim();
      const email = String(emailInput.value || "").trim();
      const message = String(messageInput.value || "").trim();

      let ok = true;

      setError(errName, "");
      setError(errEmail, "");
      setError(errMessage, "");

      if (name.length < 2) {
        ok = false;
        setError(errName, "Please enter your name.");
      }

      if (!isEmail(email)) {
        ok = false;
        setError(errEmail, "Please enter a valid email address.");
      }

      if (message.length < 10) {
        ok = false;
        setError(errMessage, "Please enter a message (at least 10 characters).");
      }

      if (!ok) return;

      const to = "kartikkp.assets@gmail.com";
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  // Close menu on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (body.classList.contains("menu-open")) setMenuOpen(false);
  });

  // Close menu when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (!body.classList.contains("menu-open")) return;
    const target = e.target;
    if (!(target instanceof Element)) return;

    const clickedInsideMenu = navMenu?.contains(target) || navToggle?.contains(target);
    if (!clickedInsideMenu) setMenuOpen(false);
  });
})();
