(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const { createEl } = window.PortfolioApp.core;

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
    const titleRow = createEl("div", "timeline__titleRow");
    titleRow.append(createEl("h3", "card__title", item.role));
    if (/present/i.test(item.duration || "")) {
      titleRow.append(createEl("span", "timeline__status", "Current"));
    }

    titleWrap.append(titleRow, createEl("p", "timeline__org", item.company));

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
    const educationCard = createEl("article", "card reveal experience__extraCard experience__extraCard--education");
    const educationHeader = createEl("div", "experience__extraHeader");
    educationHeader.append(
      createEl("span", "experience__extraIcon experience__extraIcon--education", "EDU"),
      createEl("h3", "card__title", experience.educationTitle || "Education"),
    );
    educationCard.append(educationHeader);
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
    const awardsCard = createEl("article", "card reveal experience__extraCard experience__extraCard--awards");
    const awardsHeader = createEl("div", "experience__extraHeader");
    awardsHeader.append(
      createEl("span", "experience__extraIcon experience__extraIcon--awards", "AWD"),
      createEl("h3", "card__title", experience.awardsTitle || "Awards & Recognition"),
    );
    awardsCard.append(awardsHeader);
    const awardsList = createEl("div", "experience__awardsList");
    experience.awardsItems.forEach((item, index) => {
      awardsList.append(createEl("div", `experience__awardItem experience__awardItem--${index % 3}`, item));
    });
    awardsCard.append(awardsList);
    extras.append(awardsCard);
  }
};

window.PortfolioApp.sections.renderExperience = renderExperience;
})();