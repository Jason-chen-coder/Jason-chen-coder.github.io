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

class Control extends EventTarget {
  hidden = true;
  disabled = false;
  dataset = {};
  attributes = new Map();
  properties = new Map();
  style = { setProperty: (key, value) => this.properties.set(key, value) };
  icon = { innerHTML: '' };
  value = '0';
  setAttribute(key, value) { this.attributes.set(key, String(value)); }
  querySelector(selector) { return selector === 'svg' ? this.icon : null; }
}
function enhancedPlayer({ broken = false } = {}) {
  const controls = Object.fromEntries(['controls', 'cover', 'toggle', 'seek', 'time', 'mute', 'fullscreen', 'meta', 'cover-label', 'duration-label'].map(key => [key, new Control()]));
  const stage = new Control();
  const figure = new Control();
  const error = { hidden: true };
  figure.querySelector = selector => selector === '.film-stage' ? stage : selector === '[data-film-error]' ? error : controls[selector.slice(11, -1)] ?? null;
  if (broken) delete controls.toggle;
  const video = new Control();
  Object.assign(video, {controls:true, paused:true, ended:false, currentTime:0, duration:NaN, volume:1, muted:false, dataset:{filmDuration:'37.366667'}});
  video.closest = selector => selector === '.film-player' ? figure : null;
  video.pause = () => {video.paused = true;video.dispatchEvent(new Event('pause'));};
  video.play = async () => {
    if(video.rejectPlay) throw new Error('Playback denied');
    video.paused = false;
    video.dispatchEvent(new Event('play'));
    video.dispatchEvent(new Event('playing'));
  };
  const scope = new EventTarget();
  scope.documentElement = {lang:'zh-CN'};
  scope.querySelectorAll = () => [video];
  const context = vm.createContext({PortfolioI18n:{translate:(key, locale) => `${locale}:${key}`}});
  vm.runInContext(source, context);
  context.PortfolioFilms.initProjectFilms(scope);
  return {video, controls, figure, stage, error, scope};
}

test('custom playback waits for user intent, preserves metadata-free load, and synchronizes translated controls', async () => {
  const {video, controls, figure, scope} = enhancedPlayer();
  assert.equal(figure.dataset.filmEnhanced, 'true');
  assert.equal(video.controls, false);
  assert.equal(video.paused, true);
  assert.equal(controls.seek.disabled, true);
  assert.equal(controls['duration-label'].textContent, '00:37');
  assert.equal(controls.fullscreen.hidden, true, 'unsupported fullscreen is hidden');
  controls.cover.dispatchEvent(new Event('click'));
  await Promise.resolve();
  assert.equal(video.paused, false);
  assert.equal(controls.cover.hidden, true);
  assert.equal(controls.toggle.attributes.get('aria-label'), 'zh-CN:film.pause');
  scope.documentElement.lang = 'en';
  scope.dispatchEvent(new Event('portfolio:localechange'));
  assert.equal(controls.toggle.attributes.get('aria-label'), 'en:film.pause');
  controls.toggle.dispatchEvent(new Event('click'));
  assert.equal(video.paused, true);
  assert.equal(controls.cover.hidden, false);
  controls.mute.dispatchEvent(new Event('click'));
  assert.equal(video.muted, true);
  assert.equal(controls.mute.attributes.get('aria-label'), 'en:film.unmute');
});

test('progress scrubbing is not overwritten by playback updates and commits the chosen time', () => {
  const {video, controls} = enhancedPlayer();
  video.duration = 37.366667;
  video.dispatchEvent(new Event('loadedmetadata'));
  assert.equal(controls.seek.disabled, false);
  controls.seek.dispatchEvent(new Event('pointerdown'));
  controls.seek.value = '18';
  controls.seek.dispatchEvent(new Event('input'));
  video.currentTime = 4;
  video.dispatchEvent(new Event('timeupdate'));
  assert.equal(controls.seek.value, '18');
  assert.match(controls.time.innerHTML, /00:18/);
  controls.seek.dispatchEvent(new Event('change'));
  assert.equal(video.currentTime, 18);
  video.currentTime = 19;
  video.dispatchEvent(new Event('timeupdate'));
  assert.equal(controls.seek.value, '19');
});

test('media errors and denied playback restore native controls with usable fallback', async () => {
  const media = enhancedPlayer();
  media.video.dispatchEvent(new Event('error'));
  assert.equal(media.video.controls, true);
  assert.equal(media.controls.controls.hidden, true);
  assert.equal(media.controls.cover.hidden, true);
  assert.equal(media.error.hidden, false);
  const blocked = enhancedPlayer();
  blocked.video.rejectPlay = true;
  blocked.controls.cover.dispatchEvent(new Event('click'));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(blocked.video.controls, true);
  assert.equal(blocked.error.hidden, false);
  const partial = enhancedPlayer({broken:true});
  assert.equal(partial.video.controls, true, 'incomplete enhancement keeps native controls');
});

test('a native retry restores custom controls when play precedes loadeddata after a media failure', () => {
  const {video, controls, figure, error} = enhancedPlayer();
  video.dispatchEvent(new Event('error'));
  assert.equal(video.controls, true);
  assert.equal(controls.controls.hidden, true);
  video.dispatchEvent(new Event('loadstart'));
  video.paused = false;
  video.dispatchEvent(new Event('play'));
  assert.equal(video.controls, true, 'keep fallback until the retry has usable media');
  assert.equal(controls.cover.hidden, true, 'do not overlay a second playback surface on native controls');
  video.duration = 37.366667;
  video.dispatchEvent(new Event('loadedmetadata'));
  video.dispatchEvent(new Event('loadeddata'));
  video.dispatchEvent(new Event('playing'));
  assert.equal(video.controls, false);
  assert.equal(controls.controls.hidden, false);
  assert.equal(error.hidden, true);
  assert.equal(figure.dataset.filmState, 'playing');
  assert.equal(controls.cover.hidden, true);
});
