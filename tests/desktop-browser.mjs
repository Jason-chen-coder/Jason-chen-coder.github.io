import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.DESKTOP_URL || 'http://127.0.0.1:4177/';
const output = process.env.DESKTOP_EVIDENCE || '/tmp/jason-desktop-evidence';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => {
  if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`${response.status()} ${response.url()}`);
});
const check = (condition, message) => { assert.ok(condition, message); console.log(`PASS ${message}`); };
const open = async id => {
  const dock = page.locator(`[data-dock="${id}"]`);
  if (await dock.count()) await dock.click();
  else { await page.evaluate(id => { location.hash = document.querySelector(`[data-app-open="${id}"]`) ? ({ d3: 'project-1', monaco: 'project-3' }[id] || id) : id; }, id); }
  await settled(id);
};
const windowFor = id => page.locator(`#mac-window-${id}`);
const hidden = async (id, target = page) => target.waitForFunction(id => document.getElementById(`mac-window-${id}`).hidden, id);
const settled = async (id, target = page) => target.waitForFunction(id => !document.getElementById(`mac-window-${id}`).dataset.windowMotion, id);
const sampleMotion = async (target, id, hold = false) => {
  await target.waitForFunction(id => document.querySelector(`[data-genie-for="${id}"] .mac-genie-slice`) || document.querySelector(`#mac-window-${id} .mac-window-visual`).getAnimations().length > 0, id);
  return target.evaluate(({id, hold}) => {
    const outer = document.getElementById(`mac-window-${id}`);
    const visual = outer.querySelector('.mac-window-visual');
    const overlay = document.querySelector(`[data-genie-for="${id}"]`);
    const slices = overlay ? [...overlay.querySelectorAll('.mac-genie-slice')] : [visual];
    const animations = slices.flatMap(slice => slice.getAnimations()); animations.forEach(animation => animation.pause());
    const duration = Number(animations[0].effect.getTiming().duration);
    const snapshot = time => {
      animations.forEach(animation => { animation.currentTime = time; });
      const rects = slices.map(slice => slice.getBoundingClientRect());
      const x = Math.min(...rects.map(rect => rect.x)), y = Math.min(...rects.map(rect => rect.y));
      const last = slices.at(-1), matrix = new DOMMatrix(getComputedStyle(last).transform);
      const point = px => { const p = new DOMPoint(px, parseFloat(last.style.height) || last.clientHeight).matrixTransform(matrix); return {x:p.x/p.w,y:p.y/p.w}; };
      const leftTip = point(0), rightTip = point(last.clientWidth);
      return { tip: {width:Math.hypot(rightTip.x-leftTip.x,rightTip.y-leftTip.y),x:(leftTip.x+rightTip.x)/2,y:(leftTip.y+rightTip.y)/2}, x, y, width: Math.max(...rects.map(rect => rect.right)) - x, height: Math.max(...rects.map(rect => rect.bottom)) - y, opacity: Number(getComputedStyle(slices[0]).opacity), bands: rects.map(rect => ({x:rect.x,y:rect.y,width:rect.width,height:rect.height})) };
    };
    const start = snapshot(0), early = snapshot(duration / 3), middle = snapshot(duration / 2), late = snapshot(duration * .96), end = snapshot(duration);
    animations.forEach(animation => { animation.currentTime = duration / 2; if (!hold) animation.play(); });
    return { start, early, middle, late, end, duration, outer: outer.getBoundingClientRect().toJSON(), phase: outer.dataset.windowMotion, slices: slices.length };
  }, {id, hold});
};
try {
  const mediaRequests = [];
  page.on('request', request => { if (/\.mp4(?:\?|$)/.test(request.url())) mediaRequests.push(request.url()); });
  await page.goto(base, { waitUntil: 'networkidle' });
  check(await page.locator('.mac-desktop').isVisible(), 'desktop opens immediately');
  check(await page.evaluate(() => typeof window.gsap === 'undefined' && ![...document.scripts].some(script => /gsap/i.test(script.src))), 'desktop runs without GSAP');
  check(await page.locator('[data-dock="projects"], [data-dock="ai"]').count() === 0, 'Dock shows individual projects instead of collection icons');
  const projectFilms = { mxgraph: 'mxgraph', d3: 'd3', speech: 'speech', monaco: 'monaco', devskills: 'dev-skills', yourdream: 'yourdream' };
  for (const id of ['yourdream', 'labware', 'easyui', 'mxgraph', 'speech', 'devskills']) {
    check(await page.locator(`[data-dock="${id}"]`).count() === 1, `${id} has one direct Dock entry`);
  }
  check(await page.locator('.mac-window:visible').count() === 0, 'initial desktop has no open windows');
  check(await page.evaluate(() => document.documentElement.scrollHeight === innerHeight), 'initial page fits one viewport');
  check(mediaRequests.length === 0, 'project films are not downloaded on initial desktop');
  check(await page.locator('video[data-promo-video]').count() === 6, 'all six original project films remain');
  await page.locator('[data-desktop-locale="en"]').click();
  check(await page.locator('html').getAttribute('lang') === 'en', 'language changes before any window has been opened');
  await page.locator('[data-desktop-locale="zh-CN"]').click();
  check(await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(node => node.id); return ids.length === new Set(ids).size; }), 'content nodes retain unique IDs');
  await page.screenshot({ path: `${output}/desktop-1440.png` });

  // Observe the actual native animation rather than asserting a configured duration.
  await page.locator('[data-dock="mxgraph"]').click();
  const opening = await sampleMotion(page, 'mxgraph');
  check(opening.phase === 'opening' && opening.duration === 360 && opening.start.width < 90 && opening.middle.width > opening.start.width && opening.middle.width < opening.end.width, 'window actually expands from its Dock icon through an intermediate size');
  check(opening.start.opacity < opening.middle.opacity && opening.middle.opacity < opening.end.opacity, 'opening animates opacity together with scale and translation');
  const dockIcon = await page.locator('[data-dock="mxgraph"]').boundingBox();
  check(Math.abs(opening.start.x + opening.start.width / 2 - dockIcon.x - dockIcon.width / 2) < 80, 'opening begins near the corresponding Dock icon');
  await settled('mxgraph');
  await page.evaluate(() => { const win = document.querySelector('#mac-window-mxgraph'); window.__motionVideo = win.querySelector('video'); window.__motionBody = win.querySelector('.mac-window-body'); window.__motionBody.scrollTop = 75; });
  await windowFor('mxgraph').locator('[data-window-action="minimize"]').click();
  const minimizing = await sampleMotion(page, 'mxgraph', true);
  check(minimizing.phase === 'minimizing' && minimizing.duration === 520 && minimizing.middle.width < minimizing.start.width && minimizing.end.width < minimizing.middle.width, 'minimizing visibly shrinks the window back toward the Dock');
  check(minimizing.end.width <= 3 && minimizing.end.height <= 3 && minimizing.end.opacity === 0, 'Genie finishes at a transparent pinpoint of at most 3 CSS pixels');
  const iconCenter = await page.locator('[data-dock="mxgraph"]').evaluate(button => {const box=button.getBoundingClientRect();return{x:box.x+box.width/2,y:box.bottom-button.querySelector('.mac-dock-dot').offsetHeight-(parseFloat(getComputedStyle(button.querySelector('.mac-dock-dot')).marginTop)||0)-button.querySelector('.mac-dock-icon').offsetHeight/2};});
  check(Math.abs(minimizing.end.x+minimizing.end.width/2-iconCenter.x)<1 && Math.abs(minimizing.end.y+minimizing.end.height/2-iconCenter.y)<1, 'pinpoint aligns with the icon center excluding its running dot');
  await writeFile(`${output}/genie-geometry.json`, JSON.stringify({minimizing,iconCenter}, null, 2));
  check(minimizing.early.tip.width > minimizing.start.width*.025 && minimizing.early.tip.width < minimizing.start.width*.065 && Math.abs(minimizing.early.tip.y-minimizing.early.tip.width/2-iconCenter.y)<2 && minimizing.early.bands[0].width > minimizing.start.width*.98, 'forming phase keeps the far window edge broad and anchors a slim neck over the Dock');
  const neckBands = minimizing.early.bands.filter(band=>band.width<minimizing.start.width*.15);
  const neckLength = Math.max(...neckBands.map(band=>band.y+band.height))-Math.min(...neckBands.map(band=>band.y));
  check(neckBands.length>=1 && neckLength>0 && neckLength<minimizing.start.height*.4, 'reference keeps a compact Dock mouth while preserving a broad window body');
  const bandAt = fraction => { const y=minimizing.early.y+minimizing.early.height*fraction; return minimizing.early.bands.find(band=>band.y<=y&&band.y+band.height>=y); };
  check(bandAt(.5).width>minimizing.start.width*.4 && bandAt(.5).width<minimizing.start.width*.7 && bandAt(.75).width<bandAt(.5).width*.65, 'reference retains a broad middle while tapering progressively into the Dock mouth');
  check(Math.abs(minimizing.middle.tip.width-minimizing.early.tip.width)<1 && minimizing.middle.bands[0].width<minimizing.early.bands[0].width && minimizing.middle.bands[0].y>minimizing.early.bands[0].y, 'absorption slides content along the established curve while its neck stays slim');
  check(minimizing.late.width < 10 && minimizing.late.opacity < .2 && minimizing.late.opacity > minimizing.end.opacity, 'last frames smoothly disappear at the tiny anchor instead of leaving a thumbnail');
  check(minimizing.slices >= 16 && minimizing.middle.bands[0].width > minimizing.middle.bands.at(-1).width * 2, 'Genie actually warps window content into a wide shoulder and narrow neck');
  check(Math.abs(minimizing.middle.bands[0].x + minimizing.middle.bands[0].width / 2 - minimizing.middle.bands.at(-1).x - minimizing.middle.bands.at(-1).width / 2) > 30, 'Genie bands follow a curved path toward the corresponding Dock item');
  check(await page.locator('.mac-genie-overlay').evaluate(node => node.inert && node.getAttribute('aria-hidden') === 'true' && !node.querySelector('video,audio,source,iframe') && ![...node.querySelectorAll('[id]')].some(child => !child.id.startsWith('genie-'))), 'temporary funnel contains inert static media and no original content IDs');
  check(await page.locator('.mac-genie-overlay .mac-window-visual').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).backdropFilter === 'none')), 'all temporary slices disable backdrop blur in the compiled browser styles');
  check(await windowFor('mxgraph').evaluate(node => !node.hidden && node.inert), 'minimizing window remains painted but cannot receive focus before hiding');
  check(await page.locator('[data-genie-for="mxgraph"] .mac-window-body').evaluateAll(nodes => nodes.every(node => node.scrollTop === 75)), 'every funnel slice preserves the current scrolled viewport');
  await page.screenshot({ path: `${output}/genie-minimizing-midpoint.png` });
  await page.locator('[data-genie-for="mxgraph"] .mac-genie-slice').evaluateAll(nodes => nodes.forEach(node => node.getAnimations().forEach(animation => animation.play())));
  await hidden('mxgraph');
  await page.locator('[data-dock="mxgraph"]').click();
  const restoring = await sampleMotion(page, 'mxgraph');
  check(restoring.phase === 'restoring' && restoring.slices >= 16 && restoring.middle.bands[0].width > restoring.middle.bands.at(-1).width * 2, 'restoring reverses the same real Genie content deformation');
  await settled('mxgraph');
  check(await page.locator('.mac-genie-overlay').count() === 0 && await windowFor('mxgraph').locator('[data-window-action="close"]').evaluate(node => document.activeElement === node), 'restoring removes all visual copies and retains keyboard focus');
  check(await page.evaluate(() => window.__motionVideo === document.querySelector('#mac-window-mxgraph video') && window.__motionBody.scrollTop === 75), 'minimize and restore retain the original video node and reading position');

  // Freeze a real intermediate funnel, then reverse and compare its actual geometry.
  await windowFor('mxgraph').locator('[data-window-action="minimize"]').click();
  const beforeReverse = await sampleMotion(page, 'mxgraph', true);
  await page.locator('[data-dock="mxgraph"]').click();
  const afterReverse = await sampleMotion(page, 'mxgraph');
  check(afterReverse.start.bands.every((band,index) => Math.abs(band.x-beforeReverse.middle.bands[index].x)<1 && Math.abs(band.y-beforeReverse.middle.bands[index].y)<1 && Math.abs(band.width-beforeReverse.middle.bands[index].width)<1), 'rapid reversal starts from the same curved content geometry without jumping');
  await settled('mxgraph');
  await page.waitForTimeout(400);
  check(await windowFor('mxgraph').evaluate(node => !node.hidden && !node.inert && getComputedStyle(node.querySelector('.mac-window-visual')).transform === 'none'), 'rapid minimize then reopen settles visibly without stale animation effects');
  await windowFor('mxgraph').locator('[data-window-action="minimize"]').click();
  await page.waitForFunction(() => !!document.querySelector('[data-genie-for="mxgraph"]'));
  await page.setViewportSize({width:1200,height:800}); await hidden('mxgraph');
  check(await page.locator('.mac-genie-overlay').count() === 0 && await windowFor('mxgraph').locator('.mac-window-visual').evaluate(node => node.style.opacity === '' && node.style.pointerEvents === ''), 'resizing settles the funnel and restores the live surface styles');
  await page.setViewportSize({width:1440,height:900}); await open('mxgraph');
  await windowFor('mxgraph').locator('[data-window-action="minimize"]').click();
  await page.locator('[data-dock="about"]').click();
  await settled('about'); await hidden('mxgraph');
  check(await page.locator('.mac-window.is-focused').getAttribute('id') === 'mac-window-about' && await page.evaluate(() => location.hash === '#about'), 'old minimize completion does not steal another window focus or route');
  await page.locator('[data-desktop-home]').click();

  await open('craft');
  await windowFor('craft').locator('[data-window-action="minimize"]').click();
  await sampleMotion(page, 'craft');
  check(await page.locator('[data-genie-for="craft"]').evaluate(overlay => {
    const references = [...overlay.querySelectorAll('*')].flatMap(node => [...node.attributes].flatMap(attribute => [...attribute.value.matchAll(/url\(["']?#([^)'" ]+)/g)].map(match => match[1])));
    return references.length > 0 && references.every(id => overlay.querySelector(`[id="${id}"]`));
  }), 'Genie preserves craft SVG gradients with unique per-slice references');
  await page.locator('[data-desktop-home]').click();
  check(await page.locator('.mac-genie-overlay').count() === 0, 'show desktop cancels the funnel and removes all temporary slices');

  const restingIconWidth = (await page.locator('[data-dock="mxgraph"] .mac-dock-icon').boundingBox()).width;
  await page.locator('[data-dock="mxgraph"]').hover();
  await page.waitForTimeout(800);
  check((await page.locator('[data-dock="mxgraph"] .mac-dock-icon').boundingBox()).width > restingIconWidth * 1.1, 'upstream spring magnifies Dock icon on hover');
  for (const id of ['about', 'yourdream', 'labware', 'easyui', 'mxgraph', 'speech', 'devskills', 'craft', 'contact']) {
    await open(id);
    check(await windowFor(id).isVisible(), `${id} opens real content in a window`);
    if (projectFilms[id]) {
      check(await windowFor(id).locator('video').count() === 1, `${id} window contains only its own film`);
      check((await windowFor(id).locator('video').getAttribute('src')).includes(`/${projectFilms[id]}.mp4`), `${id} opens the matching project film`);
    }
  }
  await windowFor('about').locator('[data-window-action="close"]').focus();
  check(await windowFor('about').evaluate(node => node.classList.contains('is-focused')), 'keyboard focus raises its own window');
  await page.keyboard.press('Escape');
  await hidden('about');
  check(!await windowFor('about').isVisible() && await windowFor('contact').isVisible(), 'Escape closes the keyboard-focused window');
  await open('contact');
  await page.locator('[data-dock="mxgraph"]').hover();
  await page.waitForTimeout(250);
  check(await page.locator('[data-dock="mxgraph"]').evaluate(node => {
    const box = node.getBoundingClientRect();
    return node.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 4));
  }), 'magnified Dock remains clickable above windows');
  await page.mouse.move(400, 300);
  const contact = windowFor('contact');
  await contact.locator('[data-window-action="maximize"]').click();
  check(await contact.evaluate(node => node.classList.contains('is-maximized')), 'green control maximizes the window');
  const maxBeforeMinimize = await contact.boundingBox();
  await contact.locator('[data-window-action="minimize"]').click();
  check((await sampleMotion(page, 'contact')).middle.width < maxBeforeMinimize.width, 'maximized window animates its inner surface without overriding outer geometry');
  await hidden('contact'); await page.locator('[data-dock="contact"]').click(); await settled('contact');
  check(await contact.evaluate(node => node.classList.contains('is-maximized')), 'restore preserves maximized state');
  const maxBox = await contact.boundingBox();
  check(maxBox.x >= 0 && maxBox.y >= 32 && maxBox.x + maxBox.width <= 1441 && maxBox.y + maxBox.height <= 900, 'maximized window fits the actual viewport');
  await contact.locator('[data-window-action="maximize"]').click();
  const titlebar = contact.locator('.mac-titlebar');
  const before = await contact.boundingBox();
  const title = await titlebar.boundingBox();
  await page.mouse.move(title.x + title.width / 2, title.y + title.height / 2);
  await page.mouse.down(); await page.mouse.move(title.x + title.width / 2 - 65, title.y + title.height / 2 + 12, { steps: 8 }); await page.mouse.up();
  const after = await contact.boundingBox();
  check(Math.abs(before.x - after.x) > 20, 'titlebar supports pointer dragging');
  await contact.locator('[data-window-action="minimize"]').click();
  await hidden('contact');
  check(!await contact.isVisible(), 'yellow control minimizes the window');
  check(await page.locator('[data-dock="contact"] .mac-dock-dot').evaluate(node => Number(getComputedStyle(node).opacity) > 0.5), 'minimized app keeps its Dock running indicator');
  await open('contact');
  check(await contact.isVisible(), 'Dock restores the minimized window');
  await page.keyboard.press('Escape');
  await hidden('contact');
  check(!await contact.isVisible(), 'Escape closes the active window');
  await page.locator('[data-desktop-home]').click();
  check(await page.locator('.mac-window:visible').count() === 0, 'home control returns to the desktop');

  await open('mxgraph');
  const projects = windowFor('mxgraph');
  const player = projects.locator('.film-player').first();
  await player.locator('[data-film-cover]').click();
  await page.waitForFunction(() => {
    const video=document.querySelector('#mac-window-mxgraph video');
    if(video.paused||video.readyState<2||video.currentTime<=0)return false;
    if(!video.hasAttribute('data-film-canvas'))return true;
    const canvas=video.nextElementSibling;
    return canvas instanceof HTMLCanvasElement && canvas.width>0 && canvas.height>0 && getComputedStyle(canvas).display!=='none';
  }, null, { timeout: 15000 });
  check(await player.locator('video').evaluate(node => node.currentTime > 0 && !node.paused), 'original project video decodes and plays inside the window');
  await projects.locator('[data-window-action="minimize"]').click();
  check(await player.locator('video').evaluate(node => node.paused), 'minimizing pauses the hidden film');
  await sampleMotion(page, 'mxgraph', true);
  check(await page.locator('[data-genie-for="mxgraph"]').evaluate(node => !node.querySelector('video,source') && [...node.querySelectorAll('img')].some(image => image.src.startsWith('data:image/png'))), 'playing video is frozen into a shared current-frame image inside the funnel');
  await page.locator('[data-genie-for="mxgraph"] .mac-genie-slice').evaluateAll(nodes => nodes.forEach(node => node.getAnimations().forEach(animation => animation.play())));
  await open('mxgraph');
  await page.mouse.move(100, 50);
  await page.screenshot({ path: `${output}/projects-1440.png` });

  await page.locator('[data-desktop-locale="en"]').click();
  check(await page.locator('html').getAttribute('lang') === 'en', 'desktop language control updates the whole document');
  check((await projects.locator('[data-i18n="project.0.body"]').textContent()).includes('Vue'), 'project content remains available after changing language');
  assert.doesNotMatch(await projects.locator('[data-i18n="project.0.body"]').textContent(), /[\u4e00-\u9fff]/u);
  await page.reload({ waitUntil: 'networkidle' });
  check(await page.locator('html').getAttribute('lang') === 'en', 'language persists across reload');
  check(await projects.isVisible(), 'deep link reopens the corresponding window');
  await page.locator('[data-desktop-locale="zh-CN"]').click();
  await page.locator('[data-desktop-home]').click();
  await open('about'); await open('mxgraph');
  await page.goBack();
  check(await page.locator('.mac-window.is-focused').getAttribute('id') === 'mac-window-about', 'browser Back restores the previous window');
  await page.goBack();
  check(await page.locator('.mac-window:visible').count() === 0, 'browser Back restores the desktop');
  for (const [hash, id] of [['project-0', 'mxgraph'], ['project-1', 'd3'], ['project-2', 'speech'], ['project-3', 'monaco'], ['dev-skills', 'devskills'], ['yourdream', 'yourdream']]) {
    await page.goto(`${base}#${hash}`);
    await page.waitForTimeout(400);
    check(await windowFor(id).isVisible(), `legacy #${hash} opens its individual project window`);
  }
  await page.goto(`${base}#opensource`);
  await page.waitForTimeout(400);
  check(await windowFor('projects').isVisible(), 'legacy collection link still opens a useful project directory');
  await page.locator('[data-desktop-home]').click();
  await page.locator('.mac-menu-link').first().click(); await settled('projects');
  await windowFor('projects').locator('[data-window-action="minimize"]').click();
  const directoryMinimize = await sampleMotion(page, 'projects');
  const directoryBands=directoryMinimize.middle.bands;
  check(directoryBands.every((band,index)=>Number.isFinite(band.x)&&Number.isFinite(band.y)&&band.width>0&&band.height>0&&(!index||band.y>=directoryBands[index-1].y)) && directoryBands[0].width<directoryBands.at(-1).width*.3 && directoryMinimize.end.width<=3, 'directory window uses a monotone upward funnel toward its menu trigger');
  await hidden('projects');

  for (const width of [720, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await open('mxgraph');
    const filmBox = await projects.locator('video').first().boundingBox();
    check(filmBox.width >= Math.min(250, width - 80), `${width}px layout gives project video usable width`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px layout has no horizontal page overflow`);
    const winBox = await projects.boundingBox();
    check(winBox.x >= 0 && winBox.x + winBox.width <= width + 1, `${width}px window stays inside viewport`);
    await open('yourdream');
    check(await windowFor('yourdream').isVisible(), `${width}px Dock can reach projects beyond the initial visible items`);
    await windowFor('yourdream').locator('[data-window-action="minimize"]').click();
    const mobileMinimize = await sampleMotion(page, 'yourdream');
    check(mobileMinimize.middle.width < mobileMinimize.outer.width, `${width}px mobile window animates independently of its fixed outer transform`);
    await hidden('yourdream');

    await open('mxgraph');
    await page.screenshot({ path: `${output}/projects-${width}.png` });
    await page.locator('[data-desktop-home]').click();
    await page.screenshot({ path: `${output}/desktop-${width}.png` });
  }
  for (const [width, height] of [[320, 568], [390, 640], [844, 390]]) {
    await page.setViewportSize({ width, height });
    await page.locator('[data-desktop-home]').click();
    const cta = await page.locator('.mac-explore').boundingBox();
    const dock = await page.locator('.mac-dock').boundingBox();
    const shortcuts = await page.locator('.mac-shortcuts').boundingBox();
    const overlap = (a, b) => a && b && a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    check(!overlap(cta, dock) && !overlap(cta, shortcuts), `${width}x${height} desktop actions do not overlap`);
    const intro = await page.locator('.mac-desktop-intro').boundingBox();
    check(intro.y >= 32 && cta.y + cta.height < dock.y, `${width}x${height} desktop content fits between menu and Dock`);
    await page.screenshot({ path: `${output}/desktop-${width}x${height}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('[data-desktop-home]').click();
  await page.locator('[data-dock="mxgraph"]').click();
  await page.waitForFunction(() => document.querySelector('#mac-window-mxgraph').dataset.windowMotion === 'restoring');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await settled('mxgraph');
  check(await windowFor('mxgraph').isVisible() && await windowFor('mxgraph').locator('.mac-window-visual').evaluate(node => node.getAnimations().length === 0), 'enabling reduced motion during opening immediately settles its surface');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await windowFor('mxgraph').locator('[data-window-action="minimize"]').click();
  await page.emulateMedia({ reducedMotion: 'reduce' }); await hidden('mxgraph');
  await page.locator('[data-dock="mxgraph"]').click(); await settled('mxgraph');
  check(await windowFor('mxgraph').locator('.mac-window-visual').evaluate(node => node.getAnimations().length === 0), 'reduced-motion restore creates no native animation');
  check(await page.locator('.mac-genie-overlay').count() === 0, 'reduced motion leaves no temporary Genie slices');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const reduced = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rp = await reduced.newPage();
  await rp.goto(base); await rp.locator('[data-dock="yourdream"]').click();
  check(await rp.locator('#mac-window-yourdream #yourdream').isVisible(), 'reduced-motion mode opens AI content');
  await reduced.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const np = await nojs.newPage(); await np.goto(base);
  check(await np.locator('#hero-title').isVisible() && await np.locator('#opensource').isVisible(), 'without JavaScript the full original portfolio is readable');
  await nojs.close();
  const config = await readFile(new URL('../_config.yml', import.meta.url), 'utf8');
  check(!/^  - assets\/macos\s*$/m.test(config), 'Pages publishes the compiled macOS runtime');
  check(errors.length === 0, `no page or local resource errors (${errors.join('; ')})`);
} finally {
  await browser.close();
}
