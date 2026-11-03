(function initializeProjectFilms(global) {
  "use strict";

  const ICONS = {
    play: '<path d="m9 5 10 7-10 7Z"/>',
    pause: '<path d="M9 5v14M16 5v14"/>',
    sound: '<path d="m11 5-5 4H3v6h3l5 4V5Z"/><path d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
    muted: '<path d="m11 5-5 4H3v6h3l5 4V5Z"/><path d="m16 9 6 6m0-6-6 6"/>',
  };
  const formatTime = (value) => {
    const seconds = Math.max(0, Math.floor(Number(value) || 0));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };

  // Opt-in presentation bypass for browsers that tile composited video textures.
  // The video remains the playback, audio and seeking authority.
  function canvasPresentation(video, scope) {
    if (!video.hasAttribute?.("data-film-canvas") || !scope.createElement) return null;
    const screen = video.closest(".film-screen");
    if (!screen) return null;
    const canvas = scope.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return null;
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none", display: "none" });
    screen.insertBefore(canvas, video.nextSibling);
    let pending = null;
    let usable = false;
    const useVideoFrames = typeof video.requestVideoFrameCallback === "function";
    const cancel = () => {
      if (pending === null) return;
      if (useVideoFrames) video.cancelVideoFrameCallback?.(pending);
      else global.cancelAnimationFrame?.(pending);
      pending = null;
    };
    const reset = () => {
      usable = false;
      cancel();
      canvas.style.display = "none";
      video.style.opacity = "";
    };
    const draw = () => {
      if (!usable || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
      try {
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.display = "block";
        video.style.opacity = "0";
      } catch { reset(); }
    };
    const schedule = () => {
      if (!usable || video.paused || video.ended || pending !== null) return;
      const callback = () => { pending = null; draw(); schedule(); };
      if (useVideoFrames) pending = video.requestVideoFrameCallback(callback);
      else if (global.requestAnimationFrame) pending = global.requestAnimationFrame(callback);
    };
    video.addEventListener("loadeddata", () => { usable = true; draw(); schedule(); });
    video.addEventListener("playing", () => { draw(); schedule(); });
    for (const event of ["seeked", "pause", "ended"]) video.addEventListener(event, () => { cancel(); draw(); schedule(); });
    for (const event of ["error", "emptied", "loadstart"]) video.addEventListener(event, reset);
    return { reset };
  }

  function enhancePlayer(video, scope, error) {
    const figure = video.closest(".film-player");
    const stage = figure?.querySelector(".film-stage");
    const controls = figure?.querySelector("[data-film-controls]");
    const cover = figure?.querySelector("[data-film-cover]");
    const toggle = figure?.querySelector("[data-film-toggle]");
    const seek = figure?.querySelector("[data-film-seek]");
    const time = figure?.querySelector("[data-film-time]");
    const mute = figure?.querySelector("[data-film-mute]");
    const fullscreen = figure?.querySelector("[data-film-fullscreen]");
    const meta = figure?.querySelector("[data-film-meta]");
    const coverLabel = figure?.querySelector("[data-film-cover-label]");
    const durationLabel = figure?.querySelector("[data-film-duration-label]");
    if (![figure, stage, controls, cover, toggle, seek, time, mute, fullscreen, meta, coverLabel, durationLabel].every(Boolean)
      || typeof toggle.addEventListener !== "function" || typeof video.setAttribute !== "function") return;
    if (figure.dataset.filmEnhanced === "true") return;
    const presentation = canvasPresentation(video, scope);

    let scrubbing = false;
    let started = false;
    let loading = false;
    let failed = false;
    const duration = () => Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Number(video.dataset.filmDuration) || 0;
    const translate = (key) => global.PortfolioI18n?.translate(`film.${key}`, scope.documentElement?.lang || "zh-CN") || key;
    const label = (element, key) => element.setAttribute("aria-label", translate(key));
    const icon = (element, name) => {
      const svg = element.querySelector("svg");
      if (svg) svg.innerHTML = ICONS[name];
    };
    const paintTime = (position) => {
      const total = duration();
      time.innerHTML = `${formatTime(position)} <span aria-hidden="true">/</span> ${formatTime(total)}`;
      seek.style.setProperty("--film-progress", `${total ? Math.min(100, position / total * 100) : 0}%`);
      seek.setAttribute("aria-valuetext", `${formatTime(position)} / ${formatTime(total)}`);
    };
    const refresh = () => {
      const playing = !video.paused && !video.ended;
      const state = failed ? "error" : loading ? "loading" : video.ended ? "ended" : playing ? "playing" : started ? "paused" : "idle";
      figure.dataset.filmState = state;
      figure.setAttribute("aria-busy", String(loading));
      const action = video.ended ? "replay" : playing ? "pause" : "play";
      label(toggle, action);
      label(cover, action);
      label(mute, video.muted || video.volume === 0 ? "unmute" : "mute");
      mute.setAttribute("aria-pressed", String(video.muted || video.volume === 0));
      label(fullscreen, scope.fullscreenElement === stage ? "exitFullscreen" : "fullscreen");
      label(controls, "controls");
      label(seek, "seek");
      icon(toggle, playing ? "pause" : "play");
      icon(mute, video.muted || video.volume === 0 ? "muted" : "sound");
      coverLabel.textContent = translate(loading ? "loading" : action);
      cover.hidden = failed || playing;
      durationLabel.textContent = formatTime(duration());
      if (!scrubbing) {
        seek.value = String(video.currentTime || 0);
        paintTime(video.currentTime || 0);
      } else paintTime(Number(seek.value));
    };
    const restoreNative = () => {
      presentation?.reset();
      failed = true;
      loading = false;
      video.controls = true;
      controls.hidden = true;
      cover.hidden = true;
      if (error) error.hidden = false;
      refresh();
    };
    const togglePlayback = async () => {
      if (!video.paused && !video.ended) {
        video.pause();
        return;
      }
      if (video.ended) video.currentTime = 0;
      try {
        loading = true;
        refresh();
        await video.play();
        loading = false;
        refresh();
      } catch (failure) {
        loading = false;
        // A user can pause or leave while play() is still pending.
        if (failure?.name !== "AbortError") restoreNative();
        else refresh();
      }
    };
    const commitSeek = () => {
      if (!seek.disabled && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(video.duration, Math.max(0, Number(seek.value)));
      }
      scrubbing = false;
      refresh();
    };
    toggle.addEventListener("click", togglePlayback);
    cover.addEventListener("click", togglePlayback);
    video.addEventListener("click", () => { if (!video.controls) togglePlayback(); });
    seek.addEventListener("pointerdown", () => { scrubbing = true; });
    seek.addEventListener("input", () => { scrubbing = true; paintTime(Number(seek.value)); });
    seek.addEventListener("change", commitSeek);
    seek.addEventListener("pointerup", commitSeek);
    seek.addEventListener("blur", () => { if (scrubbing) commitSeek(); });
    seek.addEventListener("pointercancel", () => { scrubbing = false; refresh(); });
    mute.addEventListener("click", () => {
      video.muted = !(video.muted || video.volume === 0);
      if (!video.muted && video.volume === 0) video.volume = 1;
      refresh();
    });
    const canFullscreen = typeof stage.requestFullscreen === "function" || typeof video.webkitEnterFullscreen === "function";
    fullscreen.hidden = !canFullscreen;
    fullscreen.addEventListener("click", async () => {
      try {
        if (scope.fullscreenElement === stage) await scope.exitFullscreen();
        else if (stage.requestFullscreen) await stage.requestFullscreen();
        else video.webkitEnterFullscreen?.();
      } catch { /* Keep inline playback usable when fullscreen is unavailable. */ }
      refresh();
    });
    video.addEventListener("play", () => { started = true; refresh(); });
    video.addEventListener("playing", () => { loading = false; refresh(); });
    video.addEventListener("waiting", () => { if (!video.paused) loading = true; refresh(); });
    video.addEventListener("pause", () => { loading = false; refresh(); });
    video.addEventListener("ended", () => { loading = false; refresh(); });
    video.addEventListener("volumechange", refresh);
    video.addEventListener("timeupdate", refresh);
    video.addEventListener("durationchange", refresh);
    video.addEventListener("loadedmetadata", () => {
      seek.max = String(duration());
      seek.disabled = !Number.isFinite(video.duration) || video.duration <= 0;
      refresh();
    });
    video.addEventListener("error", restoreNative);
    video.addEventListener("loadeddata", () => {
      if (failed) {
        failed = false;
        video.controls = false;
        controls.hidden = false;
      }
      refresh();
    });
    scope.addEventListener("portfolio:localechange", refresh);
    scope.addEventListener("fullscreenchange", refresh);
    seek.max = String(duration());
    seek.disabled = !Number.isFinite(video.duration) || video.duration <= 0;
    refresh();
    // Only replace native controls after every custom action is wired.
    video.controls = false;
    controls.hidden = false;
    meta.hidden = false;
    figure.dataset.filmEnhanced = "true";
  }

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
      try { enhancePlayer(video, scope, error); }
      catch {
        video.controls = true;
        const figure = video.closest(".film-player");
        for (const selector of ["[data-film-cover]", "[data-film-controls]", "[data-film-meta]"]) {
          const element = figure?.querySelector(selector);
          if (element) element.hidden = true;
        }
      }
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
