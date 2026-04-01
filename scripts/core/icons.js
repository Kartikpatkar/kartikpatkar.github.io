(() => {
window.PortfolioApp = window.PortfolioApp || { core: {}, sections: {}, ui: {} };

const createIcon = (name, className = "") => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  if (className) svg.setAttribute("class", className);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const pathSets = {
    linkedin: [
      ["path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" }],
      ["rect", { x: "2", y: "9", width: "4", height: "12" }],
      ["circle", { cx: "4", cy: "4", r: "2" }],
    ],
    github: [
      ["path", { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.5c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" }],
    ],
    trailhead: [["path", { d: "M6 18a4 4 0 0 1 .2-8A6 6 0 0 1 18 9a3.5 3.5 0 1 1 .5 7H6z" }]],
    email: [
      ["rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }],
      ["path", { d: "m3 7 9 6 9-6" }],
    ],
  };

  (pathSets[name] || pathSets.trailhead).forEach(([tagName, attrs]) => {
    const child = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    Object.entries(attrs).forEach(([key, value]) => child.setAttribute(key, value));
    svg.append(child);
  });

  return svg;
};

window.PortfolioApp.core.createIcon = createIcon;
})();