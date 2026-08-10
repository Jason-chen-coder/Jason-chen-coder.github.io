import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('portfolio exposes the complete chapter journey as semantic HTML', async () => {
  const html = await read('index.html');

  assert.match(html, /<a[^>]+class="[^"]*skip-link[^"]*"[^>]+href="#main-content"/);
  assert.match(html, /<header\b/);
  assert.match(html, /<nav\b[^>]+aria-label="Primary navigation"/);
  assert.match(html, /<main\b[^>]+id="main-content"/);
  assert.match(html, /<h1[^>]*>\s*Jason Chen\s*<\/h1>/);
  for (const id of ['about', 'work', 'craft', 'experience', 'contact']) {
    assert.match(html, new RegExp(`<section\\b[^>]+id="${id}"`));
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.match(html, /<footer\b/);
  assert.match(html, /Built for complex work\./);
});

test('every selected project links to the matching resume project page', async () => {
  const html = await read('index.html');
  const projects = [
    ['project-alab', 'https://www.mgi-tech.com/lab-management-system/209.html', 'work.alab.link', 'αLab Studio'],
    ['project-primegen', 'https://mp.weixin.qq.com/s/jXKv9ZQzOUUefsgutNwPng', 'work.primegen.link', 'PrimeGen'],
    ['project-oxygen', 'https://www.mgi-tech.com/827/258.html', 'work.oxygen.link', 'Oxygen Future'],
    ['project-imaging', 'https://www.mgi-tech.com/671/157.html', 'work.imaging.link', 'Cloud Imaging'],
  ];

  for (const [projectClass, href, i18nKey, fallbackLabel] of projects) {
    const article = html.match(new RegExp(`<article class="project-spread ${projectClass}"[\\s\\S]*?<\\/article>`))?.[0] ?? '';
    assert.ok(article, `${projectClass} article must exist`);

    const links = [...article.matchAll(/<a class="command-link project-link reveal"([^>]*)>([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, 1, `${projectClass} must expose one clear project link`);
    assert.equal(links[0][1].match(/\bhref="([^"]+)"/)?.[1], href);
    assert.match(links[0][1], /target="_blank"/);
    assert.match(links[0][1], /rel="noreferrer"/);
    assert.match(links[0][2], new RegExp(`data-i18n="${i18nKey.replaceAll('.', '\\.')}"`));
    assert.match(links[0][2], new RegExp(fallbackLabel));
  }
});

test('static English identity labels map one-to-one to semantic chapters in order', async () => {
  const html = await read('index.html');
  const wordmark = [...html.matchAll(/<span class="wordmark-mark" aria-hidden="true">([^<]+)<\/span>/g)]
    .map((match) => match[1].trim());
  const chapters = [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)]
    .filter((match) => /\bdata-chapter-section=/.test(match[1]))
    .map((match) => {
      const id = match[1].match(/\bid="([^"]+)"/)?.[1];
      const titles = [...match[2].matchAll(/<div class="vertical-title"[^>]*>([^<]+)<\/div>/g)]
        .map((titleMatch) => titleMatch[1].trim());
      assert.equal(titles.length, 1, `${id} must expose exactly one vertical title`);
      return [id, titles[0]];
    });
  const expected = {
    wordmark: ['陈'],
    chapters: [
      ['top', 'Home'],
      ['about', 'About'],
      ['work', 'Work'],
      ['craft', 'Craft'],
      ['experience', 'Experience'],
      ['contact', 'Contact'],
    ],
  };

  assert.deepEqual({ wordmark, chapters }, expected);
  assert.equal(html.split('陈').length - 1, 1, 'the brand seal must remain the sole static Chinese identity mark');
  for (const retired of ['影', '影に入る', '境界', '镜界', '静かな庭', '手仕事', '灯りの道', '残光']) {
    assert.equal(html.includes(retired), false, `${retired} must be retired`);
  }
});

test('visible portfolio labels describe each section without temple metaphors', async () => {
  const html = await read('index.html');
  const edition = html.match(/<p class="edition-label"[^>]*>([^<]+)<\/p>/)?.[1].trim();
  const primaryNavMarkup = html.match(/<nav id="site-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const primaryNav = [...primaryNavMarkup.matchAll(/<a[^>]+href="#([^"]+)"[^>]*>([^<]+)<\/a>/g)]
    .map((match) => [match[1], match[2].trim()]);
  const railMarkup = html.match(/<nav class="chapter-rail"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const rail = [...railMarkup.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((match) => {
    const id = match[1].match(/\bdata-rail="([^"]+)"/)?.[1];
    const spans = [...match[2].matchAll(/<span[^>]*>([^<]+)<\/span>/g)].map((spanMatch) => spanMatch[1].trim());
    assert.equal(spans.length, 2, `${id} rail item must retain its number and label`);
    return [id, spans[1]];
  });
  const chapterLabels = [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)]
    .filter((match) => /\bdata-chapter-section=/.test(match[1]))
    .map((match) => {
      const id = match[1].match(/\bid="([^"]+)"/)?.[1];
      const labels = [...match[2].matchAll(/<p class="chapter-label reveal"[^>]*>([^<]+)<\/p>/g)]
        .map((labelMatch) => labelMatch[1].trim());
      assert.equal(labels.length, 1, `${id} must expose exactly one chapter label`);
      return [id, labels[0]];
    });
  const scrollCue = html.match(/<a class="scroll-cue"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/)?.[1].trim();
  const marginNote = html.match(/<p class="margin-note reveal"[^>]*>([^<]+)<\/p>/)?.[1].trim();

  assert.deepEqual({ edition, primaryNav, rail, chapterLabels, scrollCue, marginNote }, {
    edition: 'Jason Chen / Portfolio 2026',
    primaryNav: [
      ['about', 'About'],
      ['work', 'Work'],
      ['craft', 'Capabilities'],
      ['experience', 'Experience'],
      ['contact', 'Contact'],
    ],
    rail: [
      ['top', 'Home'],
      ['about', 'About'],
      ['work', 'Work'],
      ['craft', 'Capabilities'],
      ['experience', 'Experience'],
      ['contact', 'Contact'],
    ],
    chapterLabels: [
      ['top', 'Introduction / Portfolio'],
      ['about', 'Chapter 01 / About'],
      ['work', 'Chapter 02 / Selected work'],
      ['craft', 'Chapter 03 / Capabilities'],
      ['experience', 'Chapter 04 / Experience'],
      ['contact', 'Chapter 05 / Contact'],
    ],
    scrollCue: 'About me',
    marginNote: 'Clear interfaces connect user intent, system state, and device behavior.',
  });
  for (const retired of [
    'Kage',
    'Prologue',
    'Threshold',
    'Gardens',
    'Still gardens',
    'Sacred craft',
    'Lantern path',
    'Afterlight',
    'Begin the ascent',
    'The threshold is the contract: between intent and action, state and consequence.',
  ]) {
    assert.equal(html.includes(retired), false, `${retired} must be retired from visible copy`);
  }
});

test('portfolio uses local subpath-safe runtime resources and restrained claims', async () => {
  const [html, css, script] = await Promise.all([read('index.html'), read('styles.css'), read('script.js')]);

  assert.match(html, /href="\.\/styles\.css"/);
  for (const [label, source] of [['HTML', html], ['CSS', css], ['runtime script', script]]) {
    assert.doesNotMatch(source, /resume(?:\.pdf)?/i, `${label} must not retain resume runtime references`);
    assert.doesNotMatch(source, /command-link-muted/i, `${label} must not retain the retired resume-only modifier`);
  }
  await access(new URL('resume.pdf', root));
  assert.match(html, /<script[^>]+type="module"[^>]+src="\.\/scene\.js"/);
  assert.match(html, /<script[^>]+defer[^>]+src="\.\/i18n\.js"/);
  assert.match(html, /<script[^>]+defer[^>]+src="\.\/script\.js"/);
  assert.ok(html.indexOf('src="./i18n.js"') < html.indexOf('src="./script.js"'));
  assert.doesNotMatch(html, /https?:\/\/(?:fonts\.|cdn\.|unpkg|jsdelivr)/i);
  assert.doesNotMatch(html, /\bdecade\b|available for|currently leading|accuracy\s*[↑↓]|\d+%/i);
  assert.doesNotMatch(html, /(?:href|src)="\/(?!\/)/);
});

test('masthead keeps a two-segment locale switch accessible across desktop and mobile', async () => {
  const [html, css, script] = await Promise.all([read('index.html'), read('styles.css'), read('script.js')]);
  const masthead = html.match(/<header class="masthead">([\s\S]*?)<\/header>/)?.[1] ?? '';
  const actions = masthead.match(/<div class="masthead-actions">([\s\S]*)<\/div>/)?.[1] ?? '';
  assert.ok(actions.indexOf('id="site-nav"') < actions.indexOf('class="locale-switch"'));
  assert.ok(actions.indexOf('class="locale-switch"') < actions.indexOf('class="menu-toggle"'));
  assert.match(actions, /class="locale-switch"[^>]+role="group"[^>]+aria-label="Language"[^>]+data-i18n-aria-label="locale\.group"/);

  const localeButtons = [...actions.matchAll(/<button\b([^>]*\bdata-locale="(zh-CN|en)"[^>]*)>([\s\S]*?)<\/button>/g)];
  assert.equal(localeButtons.length, 2);
  assert.deepEqual(localeButtons.map((match) => match[2]), ['zh-CN', 'en']);
  localeButtons.forEach((match) => {
    const visibleLabel = match[2] === 'zh-CN' ? '中' : 'EN';
    assert.doesNotMatch(match[1], /\blang=/, 'button must inherit the active interface language');
    assert.equal(match[3].trim(), `<span lang="${match[2]}">${visibleLabel}</span>`);
    assert.match(match[1], /aria-pressed="(?:true|false)"/);
    assert.match(match[1], /data-i18n-aria-label="locale\.(?:zh|en)Aria"/);
    assert.match(match[1], /data-i18n-title="locale\.(?:zh|en)Title"/);
    assert.match(match[1], /title="(?:Chinese|English)"/);
  });

  assert.match(css, /\.masthead-actions\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /\.locale-switch::before\s*\{[^}]*width:\s*1px/s);
  assert.match(css, /\.locale-switch button\s*\{[^}]*min-width:\s*44px[^}]*height:\s*44px/s);
  const localeStyles = css.slice(css.indexOf('.locale-switch'), css.indexOf('.menu-toggle'));
  assert.doesNotMatch(localeStyles, /border-radius:/, 'locale switch must not become a pill');
  assert.doesNotMatch(css, /\.locale-switch[^\{]*\{[^}]*display:\s*none/s, 'locale switch must remain visible on mobile');
  assert.match(css, /@media\s*\(max-width:\s*360px\)[\s\S]*\.wordmark-name\s*\{[^}]*display:\s*none/s);
  assert.match(script, /const localeButtons = \[\.\.\.document\.querySelectorAll\('\.locale-switch \[data-locale\]'\)\]/);
});

test('canvas, fallback, chapter rail, menu and cursor remain accessible', async () => {
  const [html, script, scene] = await Promise.all([read('index.html'), read('script.js'), read('scene.js')]);

  assert.match(html, /<canvas[^>]+id="scene-canvas"[^>]+aria-hidden="true"/);
  assert.match(html, /id="scene-fallback"/);
  assert.match(html, /class="[^"]*chapter-rail[^"]*"[^>]+aria-label="Chapter navigation"/);
  assert.match(html, /class="[^"]*menu-toggle[^"]*"[^>]+aria-expanded="false"/);
  assert.match(script, /aria-current/);
  assert.match(script, /Escape/);
  assert.match(script, /event\.key === 'Tab'/);
  assert.match(script, /\.inert\s*=/);
  assert.match(script, /wordmark\?\.addEventListener\('click',\s*\(\)\s*=>\s*closeMenu\(\)\)/);
  assert.match(script, /matchMedia\(['"]\(pointer: fine\)['"]\)/);
  assert.match(scene, /pageshow/);
  assert.match(scene, /event\.persisted/);
  assert.ok(scene.indexOf('let chapterOffsets') < scene.indexOf('let targetProgress'));
});

test('styles provide progressive enhancement, mobile recomposition and reduced motion', async () => {
  const css = await read('styles.css');

  assert.match(css, /#scene-canvas\s*\{[^}]*position:\s*fixed/s);
  assert.match(css, /\.js\s+\.reveal[^\{]*\{[^}]*opacity:\s*0/s);
  assert.match(css, /@media\s*\([^)]*max-width:\s*720px[^)]*\)/);
  assert.match(css, /\.js\s+\.site-nav\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
  assert.match(css, /@media\s*\([^)]*pointer:\s*fine[^)]*\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
});

test('foreground cutouts are absent from runtime while their source assets remain reversible', async () => {
  const [html, css, script] = await Promise.all([read('index.html'), read('styles.css'), read('script.js')]);

  for (const [label, source] of [['HTML', html], ['CSS', css], ['runtime script', script]]) {
    assert.doesNotMatch(source, /foreground/i, `${label} must not retain foreground runtime references`);
  }

  await Promise.all(['hero', 'about', 'work', 'craft', 'experience', 'contact'].map((name) => (
    access(new URL(`assets/images/foreground-${name}.webp`, root))
  )));
});

test('scroll choreography shares one reading line and avoids stacked motion lag', async () => {
  const [script, scene, css] = await Promise.all([read('script.js'), read('scene.js'), read('styles.css')]);

  assert.match(script, /const READING_LINE_RATIO = 0\.46;/);
  assert.match(script, /const readingLine = window\.innerHeight \* READING_LINE_RATIO;/);
  assert.match(script, /atPageStart\s*&&\s*initialChapter\?\.contains\(element\)/);
  assert.match(script, /element\.getBoundingClientRect\(\)\.top <= readingLine/);
  assert.match(script, /const pendingRevealElements = new Set\(revealElements\)/);
  assert.match(script, /const readyToReveal = \[\]/);
  assert.match(script, /root\.style\.setProperty\('--chapter-progress', localProgress\.toFixed\(4\)\)/);
  assert.match(script, /root\.dataset\.chapter = activeChapter/);
  assert.match(script, /new CustomEvent\('kage:chapterchange'/);
  assert.doesNotMatch(script, /new IntersectionObserver/);
  assert.match(scene, /alignChapterOffsets\(offsets, window\.innerHeight\)/);
  assert.match(scene, /normalizeChapterScroll\(window\.scrollY, chapterOffsets\)/);
  assert.match(scene, /snapCameraProgress\(progress, CAMERA_POSES\.length\)/);
  assert.doesNotMatch(scene, /Math\.round\(progress/);
  assert.doesNotMatch(scene, /window\.scrollY \+ window\.innerHeight \* READING_LINE_RATIO/);
  assert.match(scene, /Math\.exp\(-delta \* [4-9](?:\.\d+)?\)/);

  assert.match(css, /\.js\s+\.reveal:not\(\.split-ready\)\s*\{/);
  assert.doesNotMatch(css, /\.js\s+\.reveal\s*\{/);
});

test('project details cascade from the title without waiting for more scroll', async () => {
  const [script, css] = await Promise.all([read('script.js'), read('styles.css')]);

  assert.match(script, /const PROJECT_DETAIL_STAGGER_MS = 140;/);
  assert.match(script, /const projectDetailSequences = new Map\(/);
  assert.match(script, /siblings\.slice\(titleIndex \+ 1\)/);
  assert.match(script, /element\.classList\.contains\('reveal'\)/);
  assert.match(script, /const revealSequences = new Map\(projectDetailSequences\)/);
  assert.match(script, /if \(sequencedRevealElements\.has\(element\)\) return;/);
  assert.match(script, /detail\.style\.setProperty\('--reveal-delay', `\$\{\(index \+ 1\) \* staggerMs\}ms`\)/);
  assert.match(script, /revealSequences\.get\(element\)\?\.forEach/);
  assert.match(css, /\.js \.project-copy \.reveal:not\(\.split-ready\)[^{]*\{[^}]*transition-delay:\s*var\(--reveal-delay, 0ms\)/s);
});

test('experience timeline follows its title without waiting for more scroll', async () => {
  const [script, css] = await Promise.all([read('script.js'), read('styles.css')]);

  assert.match(script, /const EXPERIENCE_TIMELINE_STAGGER_MS = 100;/);
  assert.match(script, /const experienceTitle = document\.querySelector\('#experience-title'\);/);
  assert.match(script, /const experienceTimelineItems = \[\.\.\.document\.querySelectorAll\('\.timeline > li\.reveal'\)\];/);
  assert.match(script, /revealSequences\.set\(experienceTitle, experienceTimelineItems\)/);
  assert.match(script, /const sequencedRevealElements = new Set\(\[\.\.\.revealSequences\.values\(\)\]\.flat\(\)\)/);
  assert.match(script, /if \(sequencedRevealElements\.has\(element\)\) return;/);
  assert.match(script, /const staggerMs = element === experienceTitle\s*\? EXPERIENCE_TIMELINE_STAGGER_MS\s*:\s*PROJECT_DETAIL_STAGGER_MS;/s);
  assert.match(css, /\.js \.timeline > \.reveal:not\(\.split-ready\)[^{]*\{[^}]*transition-delay:\s*var\(--reveal-delay, 0ms\)/s);
});
