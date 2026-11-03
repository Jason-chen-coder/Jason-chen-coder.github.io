const galleryControllers = new WeakMap();
const activeGalleries = new Set();
const WHEEL_THRESHOLD = 240;
const READING_BAND_RATIO = 0.06;

export function resolveGalleryIndex(currentIndex, itemCount, key) {
  if (itemCount <= 0) return 0;
  const lastIndex = itemCount - 1;
  const current = Math.min(Math.max(currentIndex, 0), lastIndex);
  if (key === 'ArrowLeft') return Math.max(current - 1, 0);
  if (key === 'ArrowRight') return Math.min(current + 1, lastIndex);
  if (key === 'Home') return 0;
  if (key === 'End') return lastIndex;
  return current;
}

export function resolveGalleryWheel(currentIndex, itemCount, deltaY) {
  if (!Number.isFinite(deltaY) || deltaY === 0 || itemCount <= 0) {
    return { index: Math.max(currentIndex, 0), consumed: false };
  }
  const key = deltaY > 0 ? 'ArrowRight' : 'ArrowLeft';
  const index = resolveGalleryIndex(currentIndex, itemCount, key);
  return { index, consumed: index !== currentIndex };
}

export function resolveGalleryWheelDelta(accumulated, deltaY, threshold = WHEEL_THRESHOLD) {
  if (!Number.isFinite(deltaY) || deltaY === 0) {
    return { accumulated: Number.isFinite(accumulated) ? accumulated : 0, crossed: false };
  }
  const previous = Number.isFinite(accumulated) && Math.sign(accumulated) === Math.sign(deltaY)
    ? accumulated
    : 0;
  const next = previous + deltaY;
  if (Math.abs(next) < threshold) return { accumulated: next, crossed: false };
  return { accumulated: 0, crossed: true };
}

export function isGalleryReadingAligned(rect, viewportHeight) {
  if (!rect || !Number.isFinite(viewportHeight) || viewportHeight <= 0) return false;
  const center = (rect.top + rect.bottom) / 2;
  return Math.abs(center - viewportHeight / 2) <= viewportHeight * READING_BAND_RATIO;
}

function findActiveGallery(viewportHeight = globalThis.innerHeight || 900) {
  let active = null;
  let closestDistance = Infinity;
  const readingLine = viewportHeight * 0.5;
  activeGalleries.forEach((controller) => {
    const rect = controller.copy.getBoundingClientRect?.();
    if (!controller.isWheelLocked() && !isGalleryReadingAligned(rect, viewportHeight)) return;
    const distance = Math.abs((rect.top + rect.bottom) / 2 - readingLine);
    if (distance < closestDistance) {
      closestDistance = distance;
      active = controller;
    }
  });
  return active;
}

function onGlobalWheel(event) {
  const controller = findActiveGallery();
  if (!controller || !controller.consumeWheel(event.deltaY)) return;
  event.preventDefault();
}

function ensureGlobalWheelListener() {
  if (activeGalleries.size === 1) globalThis.addEventListener('wheel', onGlobalWheel, { passive: false });
}

export function initMediaGallery(gallery) {
  const existingController = galleryControllers.get(gallery);
  if (existingController) return existingController;

  const items = [...gallery.querySelectorAll('[data-media-item]')];
  const previous = gallery.querySelector('[data-gallery-action="previous"]');
  const next = gallery.querySelector('[data-gallery-action="next"]');
  const currentOutput = gallery.querySelector('[data-gallery-current]');
  const totalOutput = gallery.querySelector('[data-gallery-total]');
  const captionOutput = gallery.querySelector('[data-gallery-caption]');
  const copy = gallery.closest?.('.project-spread')?.querySelector?.('.project-copy');
  let currentIndex = 0;
  let destroyed = false;
  let wheelAccumulated = 0;
  let wheelLocked = false;

  if (!items.length || !previous || !next) return null;

  const render = () => {
    items.forEach((item, index) => {
      item.hidden = index !== currentIndex;
      item.setAttribute('aria-hidden', String(index !== currentIndex));
    });
    previous.setAttribute('aria-disabled', String(currentIndex === 0));
    next.setAttribute('aria-disabled', String(currentIndex === items.length - 1));
    if (currentOutput) currentOutput.textContent = String(currentIndex + 1);
    if (totalOutput) totalOutput.textContent = String(items.length);
    const label = items[currentIndex].querySelector('[data-gallery-label]')?.textContent?.trim();
    if (captionOutput && label) captionOutput.textContent = label;
    gallery.dataset.activeMediaId = items[currentIndex].dataset.mediaId;
    gallery.dataset.activeMediaIndex = String(currentIndex);
    const activeSubstop = items[currentIndex].dataset.mediaSubstop;
    if (activeSubstop) gallery.dataset.activeSubstop = activeSubstop;
    else delete gallery.dataset.activeSubstop;
  };

  const move = (key) => {
    const nextIndex = resolveGalleryIndex(currentIndex, items.length, key);
    if (nextIndex === currentIndex) return;
    currentIndex = nextIndex;
    render();
  };

  const onPrevious = () => move('ArrowLeft');
  const onNext = () => move('ArrowRight');
  const onKeydown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    move(event.key);
  };
  const onLocaleChange = () => render();
  const controller = {
    gallery,
    copy,
    get currentIndex() { return currentIndex; },
    isWheelLocked() {
      return wheelLocked;
    },
    consumeWheel(deltaY) {
      const result = resolveGalleryWheel(currentIndex, items.length, deltaY);
      if (!result.consumed) {
        wheelAccumulated = 0;
        wheelLocked = false;
        return false;
      }
      wheelLocked = true;
      const resolved = resolveGalleryWheelDelta(wheelAccumulated, deltaY);
      wheelAccumulated = resolved.accumulated;
      if (resolved.crossed) {
        currentIndex = result.index;
        render();
      }
      return true;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      previous.removeEventListener('click', onPrevious);
      next.removeEventListener('click', onNext);
      gallery.removeEventListener('keydown', onKeydown);
      globalThis.removeEventListener('portfolio:localechange', onLocaleChange);
      activeGalleries.delete(controller);
      if (!activeGalleries.size) globalThis.removeEventListener('wheel', onGlobalWheel);
      items.forEach((item) => {
        item.hidden = false;
        item.removeAttribute('aria-hidden');
      });
      previous.removeAttribute('aria-disabled');
      next.removeAttribute('aria-disabled');
      gallery.classList.remove('is-enhanced');
      delete gallery.dataset.activeMediaId;
      delete gallery.dataset.activeMediaIndex;
      delete gallery.dataset.activeSubstop;
      galleryControllers.delete(gallery);
    },
  };

  previous.addEventListener('click', onPrevious);
  next.addEventListener('click', onNext);
  gallery.addEventListener('keydown', onKeydown);
  globalThis.addEventListener('portfolio:localechange', onLocaleChange);

  galleryControllers.set(gallery, controller);
  activeGalleries.add(controller);
  ensureGlobalWheelListener();
  gallery.classList.add('is-enhanced');
  render();
  return controller;
}

export function initMediaGalleries(scope = document) {
  return [...scope.querySelectorAll('[data-media-gallery]')].map(initMediaGallery).filter(Boolean);
}

if (typeof document !== 'undefined') initMediaGalleries();
