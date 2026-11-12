export const ui = $state({ locale: document.documentElement.lang, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, compact: innerWidth <= 720, scrollable: false });
