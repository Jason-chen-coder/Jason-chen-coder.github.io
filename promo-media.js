(function initializeProjectFilms(global) {
  "use strict";

  function initProjectFilms(scope) {
    const videos = [...scope.querySelectorAll("[data-promo-video]")];
    if (!videos.length) return;

    const pauseAll = (except) => {
      for (const video of videos) {
        if (video !== except && !video.paused) video.pause();
      }
    };
    for (const video of videos) {
      const disclosure = video.closest("[data-project-film]");
      video.addEventListener("play", () => {
        if (scope.hidden || (disclosure && !disclosure.open)) {
          video.pause();
          return;
        }
        pauseAll(video);
      });
      disclosure?.addEventListener("toggle", () => {
        if (!disclosure.open) video.pause();
      });
      const error = video.closest(".film-player")?.querySelector("[data-film-error]");
      video.addEventListener("error", () => {
        if (error) error.hidden = false;
      });
      video.addEventListener("loadeddata", () => {
        if (error) error.hidden = true;
      });
    }
    scope.addEventListener("visibilitychange", () => {
      if (scope.hidden) pauseAll();
    });
    global.addEventListener?.("pagehide", () => pauseAll());
    if (global.IntersectionObserver) {
      const observer = new global.IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) entry.target.pause();
        }
      }, { threshold: 0 });
      videos.forEach((video) => observer.observe(video));
    }
  }

  global.PortfolioFilms = Object.freeze({ initProjectFilms });
  if (global.document) initProjectFilms(global.document);
})(globalThis);
