(function initializeIllustrationMotion() {
  "use strict";
  const figures = [...document.querySelectorAll("[data-illustration-motion]")];
  if (!figures.length) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const states = new Map();
  let pageAway = false;
  const translate = (key) => globalThis.PortfolioI18n.translate(key, document.documentElement.lang);

  function update(figure) {
    const state = states.get(figure);
    const allowed = !state.paused && !reducedMotion.matches;
    figure.dataset.motionRunning = String(allowed && state.visible && !document.hidden && !pageAway);
    state.button.disabled = reducedMotion.matches;
    state.button.setAttribute("aria-pressed", String(allowed));
    const key = reducedMotion.matches
      ? "illustration.static"
      : state.paused ? "illustration.play" : "illustration.pause";
    state.label.dataset.i18n = key;
    state.label.textContent = translate(key);
    state.button.title = translate(reducedMotion.matches ? "illustration.reduced" : key);
  }
  function updateAll() {
    for (const figure of figures) update(figure);
  }

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const state = states.get(entry.target);
        state.visible = entry.isIntersecting && entry.intersectionRatio >= .25;
        update(entry.target);
      }
    }, { threshold: [0, .25] })
    : null;

  for (const figure of figures) {
    const button = figure.querySelector("[data-illustration-toggle]");
    const label = button.querySelector("[data-i18n]");
    states.set(figure, { button, label, paused: false, visible: false });
    figure.dataset.motionEnhanced = "true";
    button.hidden = false;
    button.addEventListener("click", () => {
      const state = states.get(figure);
      state.paused = !state.paused;
      update(figure);
    });
    if (observer) observer.observe(figure);
    update(figure);
  }

  if (!observer) {
    const updateFallbackVisibility = () => {
      for (const figure of figures) {
        const rect = figure.getBoundingClientRect();
        const width = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0));
        const height = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
        const visible = rect.width > 0 && rect.height > 0 && width * height / (rect.width * rect.height) >= .25;
        const state = states.get(figure);
        if (state.visible !== visible) {
          state.visible = visible;
          update(figure);
        }
      }
    };
    window.addEventListener("scroll", updateFallbackVisibility, { passive: true });
    window.addEventListener("resize", updateFallbackVisibility, { passive: true });
    updateFallbackVisibility();
  }

  document.addEventListener("visibilitychange", updateAll);
  document.addEventListener("portfolio:localechange", updateAll);
  reducedMotion.addEventListener("change", updateAll);
  window.addEventListener("pagehide", () => { pageAway = true; updateAll(); });
  window.addEventListener("pageshow", () => { pageAway = false; updateAll(); });
})();
