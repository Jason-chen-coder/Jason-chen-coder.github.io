import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.DESKTOP_URL || 'http://127.0.0.1:4177/';
const output = process.env.DESKTOP_EVIDENCE || '/tmp/jason-desktop-evidence';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 954 }, deviceScaleFactor: 2 });
const errors = [], samples = [];
page.on('pageerror', error => errors.push(error.message));
const check = (value, message) => { assert.ok(value, message); console.log(`PASS ${message}`); };
const settled = id => page.waitForFunction(id => !document.getElementById(`mac-window-${id}`).dataset.windowMotion, id);
const click = selector => page.locator(selector).evaluate(node => node.click());
const open = async id => { await click(`[data-dock="${id}"]`); await settled(id); };
const freeze = async (id, phase) => {
  await page.waitForFunction(({ id, phase }) => document.getElementById(`mac-window-${id}`).dataset.windowMotion === phase, { id, phase });
  await page.evaluate(id => {
    const root = document.querySelector(`[data-genie-for="${id}"]`) || document.querySelector(`#mac-window-${id} .mac-window-visual`);
    [root, ...root.querySelectorAll('.mac-genie-slice')].flatMap(node => node.getAnimations()).forEach(animation => { animation.pause(); animation.currentTime = Number(animation.effect.getTiming().duration) / 3; });
  }, id);
};
const play = id => page.evaluate(id => {
  const root = document.querySelector(`[data-genie-for="${id}"]`) || document.querySelector(`#mac-window-${id} .mac-window-visual`);
  [root, ...root.querySelectorAll('.mac-genie-slice')].flatMap(node => node.getAnimations()).forEach(animation => animation.play());
}, id);
// Native hit testing respects the projected strip quadrilateral and actual paint
// order. Enable every current presentation for this synchronous observation so
// simultaneous animations can actually appear together in the hit-test result.
// Restore all state before any interaction; production copies stay click-through.
const paintOrder = async (id, genie = true) => page.evaluate(({ id, genie }) => {
  const root = document.querySelector(genie ? `[data-genie-for="${id}"]` : `#mac-window-${id}`);
  const overlays = [...document.querySelectorAll('.mac-genie-overlay')];
  const presentations = [...new Set([...overlays, root])].map(node => ({ node, inert: node.inert }));
  const enabledSlices = overlays.flatMap(node => [...node.querySelectorAll('.mac-genie-slice')]).map(node => ({ node, pointer: node.style.pointerEvents }));
  const slices = genie ? [...root.querySelectorAll('.mac-genie-slice')] : [root];
  presentations.forEach(({ node }) => node.inert = false);
  enabledSlices.forEach(({ node }) => node.style.pointerEvents = 'auto');
  try {
  const points = [];
  for (const slice of slices.slice(0, 8)) {
    const box = slice.getBoundingClientRect();
    for (const fraction of [.3, .5, .7]) {
      const x = box.x + box.width * fraction, y = box.y + box.height / 2;
      const owners = [...new Set(document.elementsFromPoint(x, y).map(node => node.closest('[data-genie-for],.mac-window')).filter(Boolean))];
      if (owners.includes(root) && owners.some(node => node !== root)) points.push({ x, y, first: owners[0].dataset.genieFor || owners[0].id, order: owners.map(node => node.dataset.genieFor || node.id) });
    }
  }
  const dock = document.querySelector('[data-dock="speech"] .mac-dock-icon').getBoundingClientRect();
  const dockAbove = !!document.elementFromPoint(dock.x + dock.width / 2, dock.y + dock.height / 2)?.closest('[data-dock]');
  return { id, genie, points, dockAbove };
  } finally {
    enabledSlices.forEach(({ node, pointer }) => node.style.pointerEvents = pointer);
    presentations.forEach(({ node, inert }) => node.inert = inert);
  }
}, { id, genie });
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  for (const id of ['mxgraph', 'easyui', 'speech']) await open(id);
  await click('#mac-window-speech [data-window-action="minimize"]'); await freeze('speech', 'minimizing');
  await page.waitForFunction(() => document.activeElement?.closest('.mac-window')?.id === 'mac-window-easyui');
  check(await page.evaluate(() => location.hash === '#easyui'), 'minimize transfers keyboard focus and route immediately');
  const first = await paintOrder('speech'); samples.push(first);
  await page.screenshot({ path: `${output}/multiwindow-stack-minimizing.png` });
  check(first.points.length > 3 && first.points.every(point => point.first === 'speech'), 'the minimizing funnel paints above overlapping windows after focus handoff');
  check(first.dockAbove, 'the presentation remains below the Dock');
  await click('#mac-window-easyui [data-window-action="minimize"]'); await freeze('easyui', 'minimizing');
  const second = await paintOrder('easyui'); samples.push(second);
  const simultaneousPoints = second.points.filter(point => point.order.includes('speech'));
  check(simultaneousPoints.length > 3 && second.points.every(point => point.first === 'easyui'), 'a second simultaneous minimize paints above the older presentation and remaining windows');
  // Before minimize completes this is an opening operation carrying the
  // interrupted Genie frame, rather than an already-minimized restore.
  await click('[data-dock="speech"]'); await freeze('speech', 'opening');
  const reverse = await paintOrder('speech'); samples.push(reverse);
  const reversePoints = reverse.points.filter(point => point.order.includes('easyui'));
  check(reversePoints.length > 3 && reverse.points.every(point => point.first === 'speech'), 'rapid restore owns the newest presentation order');
  await play('easyui'); await play('speech'); await settled('easyui'); await settled('speech');
  check(await page.evaluate(() => !document.querySelector('.mac-genie-overlay') && !document.querySelector('.mac-window[data-window-motion]') && [...document.querySelectorAll('.mac-window')].every(node => !node.style.getPropertyValue('--window-motion-z-index')) && location.hash === '#project-2' && document.activeElement?.closest('.mac-window')?.id === 'mac-window-speech'), 'completed concurrent motions clear presentation ordering without stealing restored focus');
  await click('#mac-window-speech [data-window-action="close"]'); await freeze('speech', 'closing');
  await page.waitForFunction(() => document.activeElement?.closest('.mac-window')?.id === 'mac-window-mxgraph');
  const closing = await paintOrder('speech', false); samples.push(closing);
  check(closing.points.length > 0 && closing.points.every(point => point.first === 'mac-window-speech'), 'ordinary close fades above overlapping windows after the same focus handoff');
  await play('speech'); await settled('speech');
  for (const id of ['easyui', 'speech']) await open(id);
  await click('#mac-window-speech [data-window-action="minimize"]'); await freeze('speech', 'minimizing');
  await click('#mac-window-easyui [data-window-action="minimize"]'); await freeze('easyui', 'minimizing');
  await click('[data-desktop-home]');
  check(await page.evaluate(() => !document.querySelector('.mac-genie-overlay') && !document.querySelector('.mac-window[data-window-motion]') && [...document.querySelectorAll('.mac-window')].every(node => node.hidden && !node.style.getPropertyValue('--window-motion-z-index'))), 'show desktop interrupts concurrent motions and clears every presentation level');
  check(errors.length === 0, `stacking transitions cause no browser errors (${errors.join('; ')})`);
} finally { await writeFile(`${output}/multiwindow-stack-samples.json`, JSON.stringify(samples, null, 2)); await browser.close(); }
