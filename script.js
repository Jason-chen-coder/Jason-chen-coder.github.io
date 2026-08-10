document.documentElement.classList.add('js');

const {
  COPY,
  STORAGE_KEY,
  normalizeLocale,
  resolveLocale,
} = globalThis.PortfolioI18n;
const root = document.documentElement;
const READING_LINE_RATIO = 0.46;
const PROJECT_DETAIL_STAGGER_MS = 140;
const EXPERIENCE_TIMELINE_STAGGER_MS = 100;
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const wordmark = document.querySelector('.wordmark');
const localeButtons = [...document.querySelectorAll('.locale-switch [data-locale]')];
const chapterSections = [...document.querySelectorAll('[data-chapter-section]')];
const chapterLinks = [...document.querySelectorAll('.site-nav a[href^="#"], .chapter-rail a[href^="#"]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileNavQuery = window.matchMedia('(max-width: 720px)');
const menuInertTargets = [
  document.querySelector('main'),
  document.querySelector('.chapter-rail'),
  document.querySelector('.manifesto-footer'),
].filter(Boolean);
let currentLocale = 'en';

function translate(key, locale = currentLocale) {
  return COPY[locale]?.[key] ?? COPY.en[key] ?? key;
}

function readSavedLocale() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function applyLocale(locale, { persist = false } = {}) {
  locale = normalizeLocale(locale) ?? 'en';
  currentLocale = locale;
  root.lang = locale;
  root.dataset.locale = locale;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n, locale);
  });
  const localizedAttributes = {
    'aria-label': 'data-i18n-aria-label',
    alt: 'data-i18n-alt',
    content: 'data-i18n-content',
    title: 'data-i18n-title',
  };
  Object.entries(localizedAttributes).forEach(([attribute, dataAttribute]) => {
    document.querySelectorAll(`[${dataAttribute}]`).forEach((element) => {
      element.setAttribute(attribute, translate(element.getAttribute(dataAttribute), locale));
    });
  });

  const menuKey = siteNav?.classList.contains('is-open') ? 'nav.close' : 'nav.open';
  menuToggle?.setAttribute('aria-label', translate(menuKey, locale));
  localeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.locale === locale));
  });
  document.querySelectorAll('[data-split]').forEach((element) => splitWords(element, locale));

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // The active locale still applies when storage is unavailable.
    }
  }
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

function setBackgroundInert(isInert) {
  menuInertTargets.forEach((element) => { element.inert = isInert; });
}

function closeMenu({ restoreFocus = false } = {}) {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', translate('nav.open'));
  root.classList.remove('menu-open');
  setBackgroundInert(false);
  if (restoreFocus) menuToggle.focus();
}

menuToggle?.addEventListener('click', () => {
  const willOpen = !siteNav?.classList.contains('is-open');
  siteNav?.classList.toggle('is-open', willOpen);
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  menuToggle.setAttribute('aria-label', translate(willOpen ? 'nav.close' : 'nav.open'));
  root.classList.toggle('menu-open', willOpen);
  setBackgroundInert(willOpen);
  if (willOpen) siteNav?.querySelector('a')?.focus();
});

siteNav?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu({ restoreFocus: siteNav.classList.contains('is-open') });
});

wordmark?.addEventListener('click', () => closeMenu());

document.addEventListener('keydown', (event) => {
  const menuIsOpen = siteNav?.classList.contains('is-open');
  if (event.key === 'Escape' && menuIsOpen) {
    closeMenu({ restoreFocus: true });
    return;
  }

  if (event.key === 'Tab' && menuIsOpen) {
    const focusable = [...siteNav.querySelectorAll('a'), ...localeButtons, menuToggle];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

mobileNavQuery.addEventListener?.('change', (event) => {
  if (!event.matches) closeMenu();
});

function segmentLabel(label, locale) {
  if (locale === 'zh-CN' && typeof Intl.Segmenter === 'function') {
    return [...new Intl.Segmenter(locale, { granularity: 'word' }).segment(label)]
      .map(({ segment }) => segment.trim())
      .filter(Boolean);
  }
  if (locale === 'zh-CN') {
    return label.match(/[\p{Script=Han}]|[A-Za-z0-9]+(?:[./+-][A-Za-z0-9]+)*|[^\s]/gu) ?? [];
  }
  return label.split(/\s+/);
}

function splitWords(element, locale = currentLocale) {
  const label = element.textContent.trim();
  if (!label) return;

  element.classList.remove('split-ready');
  element.setAttribute('aria-label', label);
  element.replaceChildren();
  segmentLabel(label, locale).forEach((word, index) => {
    const mask = document.createElement('span');
    const inner = document.createElement('span');
    mask.className = 'word-mask';
    mask.setAttribute('aria-hidden', 'true');
    inner.className = 'word-inner';
    inner.style.setProperty('--word-index', index);
    inner.textContent = word;
    mask.append(inner);
    element.append(mask);
  });
  element.classList.add('split-ready');
}

const initialLocale = resolveLocale({
  savedLocale: readSavedLocale(),
  navigatorLanguages: navigator.languages,
  navigatorLanguage: navigator.language,
});
applyLocale(initialLocale);
localeButtons.forEach((button) => {
  button.addEventListener('click', () => applyLocale(button.dataset.locale, { persist: true }));
});

const revealElements = [...document.querySelectorAll('.reveal')];
const projectDetailSequences = new Map(
  [...document.querySelectorAll('.project-copy h3.reveal')].map((title) => {
    const siblings = [...title.parentElement.children];
    const titleIndex = siblings.indexOf(title);
    const details = siblings.slice(titleIndex + 1)
      .filter((element) => element.classList.contains('reveal'));
    return [title, details];
  }),
);
const experienceTitle = document.querySelector('#experience-title');
const experienceTimelineItems = [...document.querySelectorAll('.timeline > li.reveal')];
const revealSequences = new Map(projectDetailSequences);
if (experienceTitle) revealSequences.set(experienceTitle, experienceTimelineItems);
const sequencedRevealElements = new Set([...revealSequences.values()].flat());
const pendingRevealElements = new Set(revealElements);

function revealEverything() {
  revealElements.forEach((element) => element.classList.add('is-visible'));
  pendingRevealElements.clear();
}

function revealElement(element) {
  element.classList.add('is-visible');
  pendingRevealElements.delete(element);
  const staggerMs = element === experienceTitle
    ? EXPERIENCE_TIMELINE_STAGGER_MS
    : PROJECT_DETAIL_STAGGER_MS;
  revealSequences.get(element)?.forEach((detail, index) => {
    detail.style.setProperty('--reveal-delay', `${(index + 1) * staggerMs}ms`);
    detail.classList.add('is-visible');
    pendingRevealElements.delete(detail);
  });
}

function revealAtReadingLine(readingLine) {
  const initialChapter = chapterSections[0];
  const atPageStart = window.scrollY <= 1;
  const readyToReveal = [];

  pendingRevealElements.forEach((element) => {
    if (sequencedRevealElements.has(element)) return;
    const isInitialContent = atPageStart && initialChapter?.contains(element);
    if (isInitialContent || element.getBoundingClientRect().top <= readingLine) {
      readyToReveal.push(element);
    }
  });

  readyToReveal.forEach(revealElement);
}

if (reducedMotion.matches) revealEverything();

reducedMotion.addEventListener?.('change', (event) => {
  if (event.matches) revealEverything();
});

let activeChapter = '';
let chapterFrame = 0;

function updateActiveChapter() {
  chapterFrame = 0;
  const readingLine = window.innerHeight * READING_LINE_RATIO;
  if (!reducedMotion.matches) revealAtReadingLine(readingLine);

  if (!chapterSections.length) return;
  let nearest = chapterSections[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const section of chapterSections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= readingLine && rect.bottom > readingLine) {
      nearest = section;
      break;
    }
    const distance = Math.min(Math.abs(rect.top - readingLine), Math.abs(rect.bottom - readingLine));
    if (distance < nearestDistance) {
      nearest = section;
      nearestDistance = distance;
    }
  }

  const nextChapter = nearest.dataset.chapterSection;
  const rect = nearest.getBoundingClientRect();
  const localProgress = Math.min(1, Math.max(0, (readingLine - rect.top) / Math.max(rect.height, 1)));
  root.style.setProperty('--chapter-progress', localProgress.toFixed(4));

  if (nextChapter === activeChapter) return;
  activeChapter = nextChapter;
  root.dataset.chapter = activeChapter;

  chapterLinks.forEach((link) => {
    const isCurrent = link.getAttribute('href') === `#${activeChapter}`;
    if (isCurrent) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });

  window.dispatchEvent(new CustomEvent('kage:chapterchange', {
    detail: { id: activeChapter, index: chapterSections.indexOf(nearest) },
  }));
}

function requestChapterUpdate() {
  if (!chapterFrame) chapterFrame = requestAnimationFrame(updateActiveChapter);
}

window.addEventListener('scroll', requestChapterUpdate, { passive: true });
window.addEventListener('resize', requestChapterUpdate, { passive: true });
window.addEventListener('hashchange', requestChapterUpdate);
updateActiveChapter();

const finePointer = window.matchMedia('(pointer: fine)');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (finePointer.matches && cursorDot && cursorRing && !reducedMotion.matches) {
  root.classList.add('cursor-enabled');
  let pointerX = -100;
  let pointerY = -100;
  let ringX = -100;
  let ringY = -100;
  let cursorFrame = 0;

  const moveRing = () => {
    ringX += (pointerX - ringX) * 0.18;
    ringY += (pointerY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    cursorFrame = requestAnimationFrame(moveRing);
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
  }, { passive: true });

  document.addEventListener('pointerover', (event) => {
    cursorRing.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, .project-media')));
  });

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && !cursorFrame) cursorFrame = requestAnimationFrame(moveRing);
  });
  cursorFrame = requestAnimationFrame(moveRing);
}

window.addEventListener('kage:webgl-fallback', () => {
  root.dataset.webgl = 'fallback';
});
