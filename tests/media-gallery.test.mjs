import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

async function loadGalleryModule() {
  const source = await read('media-gallery.js');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

test('gallery key resolver supports adjacent, first and last navigation without wrapping', async () => {
  const { resolveGalleryIndex } = await loadGalleryModule();

  assert.equal(resolveGalleryIndex(2, 5, 'ArrowLeft'), 1);
  assert.equal(resolveGalleryIndex(2, 5, 'ArrowRight'), 3);
  assert.equal(resolveGalleryIndex(0, 5, 'ArrowLeft'), 0);
  assert.equal(resolveGalleryIndex(4, 5, 'ArrowRight'), 4);
  assert.equal(resolveGalleryIndex(2, 5, 'Home'), 0);
  assert.equal(resolveGalleryIndex(2, 5, 'End'), 4);
  assert.equal(resolveGalleryIndex(2, 5, 'Enter'), 2);
  assert.equal(resolveGalleryIndex(10, 0, 'Home'), 0);
});

test('gallery wheel resolver consumes interior scroll and releases only at image edges', async () => {
  const source = await read('media-gallery.js');
  assert.match(source, /export function resolveGalleryWheel/);
  const module = await loadGalleryModule();

  assert.deepEqual(module.resolveGalleryWheel(1, 4, 120), { index: 2, consumed: true });
  assert.deepEqual(module.resolveGalleryWheel(1, 4, -120), { index: 0, consumed: true });
  assert.deepEqual(module.resolveGalleryWheel(3, 4, 120), { index: 3, consumed: false });
  assert.deepEqual(module.resolveGalleryWheel(0, 4, -120), { index: 0, consumed: false });
  assert.deepEqual(module.resolveGalleryWheel(1, 4, 0), { index: 1, consumed: false });
});

test('gallery wheel accumulator waits for a larger gesture and resets on direction changes', async () => {
  const { resolveGalleryWheelDelta } = await loadGalleryModule();

  assert.deepEqual(resolveGalleryWheelDelta(0, 80, 240), { accumulated: 80, crossed: false });
  assert.deepEqual(resolveGalleryWheelDelta(80, 120, 240), { accumulated: 200, crossed: false });
  assert.deepEqual(resolveGalleryWheelDelta(200, 80, 240), { accumulated: 0, crossed: true });
  assert.deepEqual(resolveGalleryWheelDelta(200, -40, 240), { accumulated: -40, crossed: false });
});

test('gallery lock follows the project copy center instead of the media box', async () => {
  const { isGalleryReadingAligned } = await loadGalleryModule();

  assert.equal(isGalleryReadingAligned({ top: 280, bottom: 620 }, 900), true);
  assert.equal(isGalleryReadingAligned({ top: 80, bottom: 260 }, 900), false);
  assert.equal(isGalleryReadingAligned({ top: 650, bottom: 820 }, 900), false);
  assert.equal(isGalleryReadingAligned({ top: 260, bottom: 640 }, 900), true);
  assert.equal(isGalleryReadingAligned({ top: 200, bottom: 560 }, 900), false);
});

test('preserved gallery controller is manual, progressive, localized and keyboard accessible', async () => {
  const moduleSource = await read('media-gallery.js');

  for (const forbidden of ['setInterval(', 'setTimeout(', 'requestAnimationFrame(', 'autoplay']) {
    assert.equal(moduleSource.includes(forbidden), false, `gallery must not use ${forbidden}`);
  }
  assert.match(moduleSource, /addEventListener\('click'/);
  assert.match(moduleSource, /addEventListener\('keydown'/);
  assert.match(moduleSource, /addEventListener\('wheel'/);
  assert.match(moduleSource, /passive:\s*false/);
  assert.match(moduleSource, /getBoundingClientRect/);
  for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) assert.match(moduleSource, new RegExp(`'${key}'`));
  assert.match(moduleSource, /classList\.add\('is-enhanced'\)/);
  assert.match(moduleSource, /item\.hidden = index !== currentIndex/);
  assert.match(moduleSource, /portfolio:localechange/);
  assert.match(moduleSource, /querySelector\('\[data-gallery-label\]'\)\?\.textContent/);
  assert.match(moduleSource, /removeEventListener/);
  assert.match(moduleSource, /destroy/);
});

test('gallery controller is idempotent, publishes active state and restores progressive markup on destroy', async () => {
  const { initMediaGallery } = await loadGalleryModule();
  const makeNode = ({ dataset = {}, label = null } = {}) => {
    const listeners = new Map();
    return {
      attributes: new Map(),
      dataset: { ...dataset },
      textContent: '',
      hidden: false,
      setAttribute(name, value) { this.attributes.set(name, value); },
      removeAttribute(name) { this.attributes.delete(name); },
      querySelector(selector) { return selector === '[data-gallery-label]' ? label : null; },
      addEventListener(type, listener) {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type).add(listener);
      },
      removeEventListener(type, listener) { listeners.get(type)?.delete(listener); },
      emit(type, event = {}) { listeners.get(type)?.forEach((listener) => listener(event)); },
      listenerCount(type) { return listeners.get(type)?.size ?? 0; },
    };
  };
  const labels = ['Remote equipment', 'Consultation UI', 'Handheld app'].map((textContent) => ({ textContent }));
  const items = [
    makeNode({ dataset: { mediaId: 'cloud-remote-ultrasound-system', mediaSubstop: 'cloud-remote' }, label: labels[0] }),
    makeNode({ dataset: { mediaId: 'cloud-remote-consultation-ui', mediaSubstop: 'cloud-remote' }, label: labels[1] }),
    makeNode({ dataset: { mediaId: 'cloud-handheld-app', mediaSubstop: 'cloud-handheld' }, label: labels[2] }),
  ];
  const previous = makeNode();
  const next = makeNode();
  const current = makeNode();
  const total = makeNode();
  const caption = makeNode();
  const controls = new Map([
    ['[data-gallery-action="previous"]', previous],
    ['[data-gallery-action="next"]', next],
    ['[data-gallery-current]', current],
    ['[data-gallery-total]', total],
    ['[data-gallery-caption]', caption],
  ]);
  const classes = new Set();
  const galleryEvents = makeNode();
  const gallery = {
    dataset: {},
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
    },
    querySelectorAll(selector) { return selector === '[data-media-item]' ? items : []; },
    querySelector(selector) { return controls.get(selector) ?? null; },
    closest() { return { querySelector() { return { getBoundingClientRect() { return { top: 280, bottom: 620 }; } }; } }; },
    addEventListener: galleryEvents.addEventListener,
    removeEventListener: galleryEvents.removeEventListener,
  };
  const globalEvents = makeNode();
  const originalAddEventListener = globalThis.addEventListener;
  const originalRemoveEventListener = globalThis.removeEventListener;
  globalThis.addEventListener = globalEvents.addEventListener;
  globalThis.removeEventListener = globalEvents.removeEventListener;

  try {
    const controller = initMediaGallery(gallery);
    const duplicateController = initMediaGallery(gallery);

    assert.equal(duplicateController, controller);
    assert.equal(classes.has('is-enhanced'), true);
    assert.equal(previous.listenerCount('click'), 1);
    assert.equal(next.listenerCount('click'), 1);
    assert.equal(galleryEvents.listenerCount('keydown'), 1);
    assert.equal(globalEvents.listenerCount('portfolio:localechange'), 1);
    assert.deepEqual(items.map(({ hidden }) => hidden), [false, true, true]);
    assert.deepEqual([current.textContent, total.textContent, caption.textContent], ['1', '3', 'Remote equipment']);
    assert.equal(gallery.dataset.activeMediaId, 'cloud-remote-ultrasound-system');
    assert.equal(gallery.dataset.activeSubstop, 'cloud-remote');

    next.emit('click');
    assert.deepEqual(items.map(({ hidden }) => hidden), [true, false, true]);
    assert.deepEqual([current.textContent, caption.textContent], ['2', 'Consultation UI']);
    assert.equal(gallery.dataset.activeSubstop, 'cloud-remote');

    let prevented = false;
    galleryEvents.emit('keydown', { key: 'End', preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.deepEqual([current.textContent, caption.textContent], ['3', 'Handheld app']);
    assert.equal(gallery.dataset.activeMediaId, 'cloud-handheld-app');
    assert.equal(gallery.dataset.activeSubstop, 'cloud-handheld');

    labels[2].textContent = '手持超声软件';
    globalEvents.emit('portfolio:localechange');
    assert.equal(caption.textContent, '手持超声软件');

    controller.destroy();
    assert.equal(classes.has('is-enhanced'), false);
    assert.deepEqual(items.map(({ hidden }) => hidden), [false, false, false]);
    assert.deepEqual(items.map(({ attributes }) => attributes.has('aria-hidden')), [false, false, false]);
    assert.equal(gallery.dataset.activeMediaId, undefined);
    assert.equal(gallery.dataset.activeSubstop, undefined);
    assert.equal(previous.listenerCount('click'), 0);
    assert.equal(next.listenerCount('click'), 0);
    assert.equal(galleryEvents.listenerCount('keydown'), 0);
    assert.equal(globalEvents.listenerCount('portfolio:localechange'), 0);
  } finally {
    if (originalAddEventListener) globalThis.addEventListener = originalAddEventListener;
    else delete globalThis.addEventListener;
    if (originalRemoveEventListener) globalThis.removeEventListener = originalRemoveEventListener;
    else delete globalThis.removeEventListener;
  }
});
