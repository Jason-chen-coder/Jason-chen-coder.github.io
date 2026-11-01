(function initializePortfolio() {
  "use strict";
  const root = document.documentElement;
  const i18n = globalThis.PortfolioI18n;
  const masthead = document.querySelector(".masthead");
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-nav");
  const methodButtons = [...document.querySelectorAll("[data-method]")];
  const email = "hongxin.jasonchen@gmail.com";
  let activeMethod = 0;
  let copyStatusTimer;
  let savedLocale;
  try {
    savedLocale = localStorage.getItem(i18n.STORAGE_KEY);
  } catch {}
  i18n.applyLocale(i18n.resolveLocale({ savedLocale }), { persist: false });

  function closeMenu({ restoreFocus = false } = {}) {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.dataset.i18nAriaLabel = "nav.open";
    menuButton.setAttribute(
      "aria-label",
      i18n.translate("nav.open", root.lang),
    );
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.dataset.i18nAriaLabel = open ? "nav.close" : "nav.open";
    menuButton.setAttribute(
      "aria-label",
      i18n.translate(open ? "nav.close" : "nav.open", root.lang),
    );
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    )
      closeMenu({ restoreFocus: true });
  });
  document.addEventListener("click", (event) => {
    if (!masthead.contains(event.target)) closeMenu();
  });
  for (const link of menu.querySelectorAll("a"))
    link.addEventListener("click", () => closeMenu());
  const mobileViewport = matchMedia("(max-width: 720px)");
  mobileViewport.addEventListener("change", () => closeMenu());

  for (const button of document.querySelectorAll("button[data-locale]")) {
    button.addEventListener("click", () =>
      i18n.applyLocale(button.dataset.locale),
    );
  }
  function setMethod(index, { focus = false } = {}) {
    activeMethod =
      ((index % methodButtons.length) + methodButtons.length) %
      methodButtons.length;
    for (const [buttonIndex, button] of methodButtons.entries()) {
      const selected = buttonIndex === activeMethod;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    const title = document.getElementById("method-title");
    const body = document.getElementById("method-body");
    title.dataset.i18n = `method.${activeMethod}.title`;
    body.dataset.i18n = `method.${activeMethod}.body`;
    title.textContent = i18n.translate(title.dataset.i18n, root.lang);
    body.textContent = i18n.translate(body.dataset.i18n, root.lang);
    document
      .getElementById("method-panel")
      .setAttribute("aria-labelledby", `method-tab-${activeMethod}`);
    document.querySelector(".loop-illustration").dataset.methodState =
      String(activeMethod);
    for (const node of document.querySelectorAll("[data-loop-node]"))
      node.classList.toggle(
        "is-current",
        Number(node.dataset.loopNode) === activeMethod,
      );
    if (focus) methodButtons[activeMethod].focus();
  }
  for (const [index, button] of methodButtons.entries()) {
    button.addEventListener("click", () => setMethod(index));
    button.addEventListener("keydown", (event) => {
      const actions = {
        ArrowRight: index + 1,
        ArrowLeft: index - 1,
        Home: 0,
        End: methodButtons.length - 1,
      };
      if (Object.hasOwn(actions, event.key)) {
        event.preventDefault();
        setMethod(actions[event.key], { focus: true });
      }
    });
  }
  document.addEventListener("portfolio:localechange", () => {
    setMethod(activeMethod);
    const status = document.querySelector(".copy-status");
    if (status.dataset.i18n)
      status.textContent = i18n.translate(status.dataset.i18n, root.lang);
  });

  function updateScrollState() {
    masthead.classList.toggle("is-compact", window.scrollY > 50);
  }
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
  const navLinks = [...masthead.querySelectorAll("[data-nav]")];
  function setActiveNavigation(id) {
    const navId =
      id === "craft"
        ? "top"
        : id === "experience"
          ? "about"
          : id === "ai-workflows"
            ? "work"
            : id;
    for (const link of navLinks) {
      if (link.dataset.nav === navId)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  const sections = [...document.querySelectorAll("main > section")];
  let navigationFrame = 0;
  function updateActiveNavigation() {
    navigationFrame = 0;
    const readingLine = 160;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= readingLine) current = section;
      else break;
    }
    if (window.scrollY + window.innerHeight >= root.scrollHeight - 2)
      current = sections.at(-1);
    if (current) setActiveNavigation(current.id);
  }
  function queueNavigationUpdate() {
    if (!navigationFrame)
      navigationFrame = requestAnimationFrame(updateActiveNavigation);
  }
  window.addEventListener("scroll", queueNavigationUpdate, { passive: true });
  window.addEventListener("resize", queueNavigationUpdate, { passive: true });
  window.addEventListener("load", queueNavigationUpdate, { once: true });
  document.addEventListener("portfolio:localechange", queueNavigationUpdate);
  document.fonts?.ready.then(queueNavigationUpdate);
  function revealHashTarget() {
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    for (const element of target.querySelectorAll(".is-pending"))
      element.classList.remove("is-pending");
    target.closest(".reveal")?.classList.remove("is-pending");
    setActiveNavigation(id);
  }
  setActiveNavigation(location.hash.slice(1) || "top");
  window.addEventListener("hashchange", revealHashTarget);

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove("is-pending");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );
    for (const element of document.querySelectorAll(".reveal")) {
      if (element.getBoundingClientRect().top > window.innerHeight)
        element.classList.add("is-pending");
      observer.observe(element);
    }
    reducedMotion.addEventListener("change", (event) => {
      if (event.matches)
        for (const element of document.querySelectorAll(".is-pending"))
          element.classList.remove("is-pending");
    });
  }
  root.classList.add("js");
  revealHashTarget();
  queueNavigationUpdate();

  document
    .querySelector("[data-copy-email]")
    .addEventListener("click", async () => {
      const status = document.querySelector(".copy-status");
      clearTimeout(copyStatusTimer);
      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(email);
          copied = true;
        } else {
          const input = document.createElement("textarea");
          input.value = email;
          input.setAttribute("readonly", "");
          input.style.cssText = "position:fixed;left:-9999px;top:0;";
          document.body.append(input);
          input.select();
          copied = document.execCommand("copy");
          input.remove();
        }
      } catch {}
      status.dataset.i18n = copied ? "contact.copied" : "contact.copyFailed";
      status.textContent = i18n.translate(status.dataset.i18n, root.lang);
      copyStatusTimer = setTimeout(() => {
        status.textContent = "";
        delete status.dataset.i18n;
      }, 5000);
    });
})();
