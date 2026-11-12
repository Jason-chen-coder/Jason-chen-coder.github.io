// Apply the preference before styles load, then keep system and other tabs in sync.
(() => {
  const key = 'portfolio-theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = value => ['light', 'dark', 'system'].includes(value);
  let preference = 'system';
  try { const saved = localStorage.getItem(key); if (valid(saved)) preference = saved; } catch {}
  const resolve = () => preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
  let transition;
  let revision = 0;
  function apply() {
    const resolved = resolve();
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolved;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#18202c' : '#f6f4ef');
    document.dispatchEvent(new CustomEvent('portfolio:themechange'));
  }
  function update(origin) {
    const request = ++revision;
    transition?.skipTransition();
    transition = undefined;
    if (!origin || resolve() === document.documentElement.dataset.theme ||
        matchMedia('(prefers-reduced-motion: reduce)').matches || !document.startViewTransition) {
      apply();
      return;
    }
    try {
      // Read the latest preference in every callback, including a skipped transition.
      const current = document.startViewTransition(apply);
      transition = current;
      current.ready.then(() => {
        if (request !== revision) return;
        const x = Math.max(0, Math.min(innerWidth, origin.x));
        const y = Math.max(0, Math.min(innerHeight, origin.y));
        const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        return document.documentElement.animate({
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
        }, {
          duration: 650, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'both',
          pseudoElement: '::view-transition-new(root)'
        }).finished;
      }).catch(() => { current.skipTransition(); });
      current.finished.catch(() => {}).finally(() => { if (transition === current) transition = undefined; });
    } catch { apply(); }
  }
  window.PortfolioTheme = {
    get preference() { return preference; },
    set(value, origin) {
      if (!valid(value)) return;
      preference = value;
      try { localStorage.setItem(key, value); } catch {}
      update(origin);
    }
  };
  media.addEventListener('change', () => { if (preference === 'system') update(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) { preference = valid(event.newValue) ? event.newValue : 'system'; update(); }
  });
  apply();
})();
