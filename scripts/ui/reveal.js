(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const initReveal = () => {
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (!revealEls.length) return;

  revealEls.forEach((element) => {
    element.classList.add("is-pending");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-pending");
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  revealEls.forEach((element) => revealObserver.observe(element));
};

window.PortfolioApp.ui.initReveal = initReveal;
})();