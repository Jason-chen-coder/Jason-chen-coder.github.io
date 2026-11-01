import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../promo-media.js', import.meta.url), 'utf8');
class Disclosure extends EventTarget { open = true; }
class Video extends EventTarget {
  paused = true;
  pauses = 0;
  errorNote = { hidden: true };
  constructor(disclosure) { super(); this.disclosure = disclosure; }
  closest(selector) {
    if (selector === '[data-project-film]') return this.disclosure;
    return { querySelector: () => this.errorNote };
  }
  pause() { this.paused = true; this.pauses += 1; }
  start() { this.paused = false; this.dispatchEvent(new Event('play')); }
}
function initialize({ observers = true } = {}) {
  const disclosure = new Disclosure();
  const videos = [new Video(disclosure), new Video(null), new Video(new Disclosure())];
  const scope = new EventTarget();
  scope.hidden = false;
  scope.querySelectorAll = () => videos;
  const browser = new EventTarget();
  const observed = [];
  let deliverIntersection;
  const globals = { addEventListener: browser.addEventListener.bind(browser) };
  if (observers) globals.IntersectionObserver = class {
    constructor(callback) { deliverIntersection = callback; }
    observe(video) { observed.push(video); }
  };
  const context = vm.createContext(globals);
  vm.runInContext(source, context);
  context.PortfolioFilms.initProjectFilms(scope);
  return { scope, videos, disclosure, browser, observed, deliverIntersection };
}

test('starting a project film pauses the previous film, without auto-starting at initialization', () => {
  const { videos } = initialize();
  assert.ok(videos.every(v => v.paused && v.pauses === 0));
  videos[0].start();
  assert.equal(videos[0].paused, false);
  videos[1].start();
  assert.equal(videos[0].paused, true);
  assert.equal(videos[0].pauses, 1);
  assert.equal(videos[1].paused, false);
});

test('collapsing a film pauses it and a closed disclosure cannot keep playing', () => {
  const { videos, disclosure } = initialize();
  videos[0].start();
  disclosure.open = false;
  disclosure.dispatchEvent(new Event('toggle'));
  assert.equal(videos[0].paused, true);
  videos[0].start();
  assert.equal(videos[0].paused, true);
});

test('leaving the viewport pauses the matching player without resuming it on return', () => {
  const { videos, observed, deliverIntersection } = initialize();
  assert.equal(observed.length, 3);
  videos[1].start();
  deliverIntersection([{ target: videos[1], isIntersecting: false }]);
  assert.equal(videos[1].paused, true);
  deliverIntersection([{ target: videos[1], isIntersecting: true }]);
  assert.equal(videos[1].paused, true);
});

test('backgrounding or leaving the page pauses playback, including browsers without IntersectionObserver', () => {
  const { videos, scope, browser } = initialize({ observers: false });
  videos[0].start();
  scope.hidden = true;
  scope.dispatchEvent(new Event('visibilitychange'));
  assert.equal(videos[0].paused, true);
  videos[1].start();
  assert.equal(videos[1].paused, true);
  scope.hidden = false;
  videos[1].start();
  browser.dispatchEvent(new Event('pagehide'));
  assert.equal(videos[1].paused, true);
});

test('playback errors reveal fallback guidance and successful media loading clears stale errors', () => {
  const { videos } = initialize();
  videos[0].dispatchEvent(new Event('error'));
  assert.equal(videos[0].errorNote.hidden, false);
  videos[0].dispatchEvent(new Event('loadeddata'));
  assert.equal(videos[0].errorNote.hidden, true);
});
