import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

async function loadI18n() {
  const source = await read('i18n.js');
  const context = vm.createContext({});
  context.globalThis = context;
  vm.runInContext(source, context, { filename: 'i18n.js' });
  return context.PortfolioI18n;
}

function readFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  let parameterDepth = 0;
  let bodyStart = -1;
  for (let index = source.indexOf('(', start); index < source.length; index += 1) {
    if (source[index] === '(') parameterDepth += 1;
    if (source[index] === ')') parameterDepth -= 1;
    if (parameterDepth === 0) {
      bodyStart = source.indexOf('{', index);
      break;
    }
  }
  assert.notEqual(bodyStart, -1, `${name} must have a function body`);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  assert.fail(`${name} must have a complete function body`);
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

test('classic i18n API normalizes and resolves locales without a DOM', async () => {
  const api = await loadI18n();

  assert.ok(api, 'classic script must publish globalThis.PortfolioI18n');
  assert.equal(api.STORAGE_KEY, 'jason-chen.portfolio.locale');
  assert.deepEqual([...api.SUPPORTED_LOCALES], ['en', 'zh-CN']);
  for (const [input, expected] of [
    ['en', 'en'],
    ['EN_us', 'en'],
    ['en-GB', 'en'],
    ['zh', 'zh-CN'],
    ['zh-cn', 'zh-CN'],
    ['zh-Hans-CN', 'zh-CN'],
    ['zh-TW', 'zh-CN'],
    ['fr-FR', null],
    ['', null],
    [null, null],
  ]) assert.equal(api.normalizeLocale(input), expected, `normalizeLocale(${String(input)})`);

  assert.equal(api.resolveLocale({ savedLocale: 'zh-CN', navigatorLanguages: ['en-US'] }), 'zh-CN');
  assert.equal(api.resolveLocale({ savedLocale: 'invalid', navigatorLanguages: ['fr-FR', 'zh-Hans'] }), 'zh-CN');
  assert.equal(api.resolveLocale({ navigatorLanguages: ['fr-FR', 'en-GB'], navigatorLanguage: 'zh-CN' }), 'en');
  assert.equal(api.resolveLocale({ navigatorLanguages: [], navigatorLanguage: 'zh-TW' }), 'zh-CN');
  assert.equal(api.resolveLocale({ navigatorLanguages: ['fr-FR'], navigatorLanguage: 'de-DE' }), 'en');
  assert.equal(api.resolveLocale(), 'en');
});

test('catalogs have identical complete keys and match every English HTML fallback', async () => {
  const [api, html] = await Promise.all([loadI18n(), read('index.html')]);
  const enKeys = Object.keys(api.COPY.en).sort();
  const zhKeys = Object.keys(api.COPY['zh-CN']).sort();
  assert.deepEqual(zhKeys, enKeys, 'en and zh-CN catalogs must have identical key sets');
  assert.ok(enKeys.length >= 90, 'the catalog must cover the complete portfolio, not only navigation');
  for (const locale of api.SUPPORTED_LOCALES) {
    for (const key of enKeys) {
      assert.equal(typeof api.COPY[locale][key], 'string', `${locale}.${key} must be text`);
      assert.ok(api.COPY[locale][key].trim(), `${locale}.${key} must not be empty`);
      assert.equal(api.COPY[locale][key].includes('\u00a0'), false, `${locale}.${key} must not contain NBSP`);
    }
  }
  for (const dynamicKey of ['nav.open', 'nav.close']) assert.ok(enKeys.includes(dynamicKey));

  const allMarkers = [...html.matchAll(/\bdata-i18n(?:-(?:aria-label|alt|content|title))?="([^"]+)"/g)]
    .map((match) => match[1]);
  assert.ok(allMarkers.length >= 90, 'HTML must expose a complete translation surface');
  for (const key of new Set(allMarkers)) {
    assert.ok(api.COPY.en[key]?.trim(), `English copy missing for ${key}`);
    assert.ok(api.COPY['zh-CN'][key]?.trim(), `Chinese copy missing for ${key}`);
  }

  const textMarkers = [...html.matchAll(/<([a-z][\w-]*)\b([^>]*\bdata-i18n="([^"]+)"[^>]*)>([^<]*)<\/\1>/gi)];
  const markedTextKeys = [...html.matchAll(/\bdata-i18n="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(
    textMarkers.map((match) => match[3]).sort(),
    markedTextKeys.sort(),
    'data-i18n belongs on leaf text nodes so icons and structure survive switching',
  );
  textMarkers.forEach((match) => {
    assert.equal(decodeHtml(match[4].trim()), api.COPY.en[match[3]], `${match[3]} fallback must equal English copy`);
  });

  const attributeMarkers = [...html.matchAll(/<[^>]*\bdata-i18n-(aria-label|alt|content|title)="([^"]+)"[^>]*>/g)];
  attributeMarkers.forEach((match) => {
    const attribute = match[1];
    const key = match[2];
    const fallback = match[0].match(new RegExp(`(?:^|\\s)${attribute}="([^"]*)"`))?.[1];
    assert.notEqual(fallback, undefined, `${key} must retain a static ${attribute} fallback`);
    assert.equal(decodeHtml(fallback), api.COPY.en[key], `${key} ${attribute} fallback must equal English copy`);
  });
});

test('static HTML leaves no unmarked prose and loads i18n before the runtime', async () => {
  const html = await read('index.html');
  const i18nIndex = html.indexOf('<script defer src="./i18n.js"></script>');
  const runtimeIndex = html.indexOf('<script defer src="./script.js"></script>');
  assert.ok(i18nIndex >= 0 && runtimeIndex > i18nIndex, 'i18n.js must load with defer before script.js');
  assert.match(html, /<html lang="en"[^>]+data-locale="en"/);

  for (const attribute of ['aria-label', 'alt', 'title']) {
    const tags = [...html.matchAll(new RegExp(`<[^>]+\\s${attribute}="(?!true|false)([^"]+)"[^>]*>`, 'g'))];
    tags.forEach((match) => {
      assert.match(match[0], new RegExp(`data-i18n-${attribute}="[^"]+"`), `${attribute}=${match[1]} must be localized`);
    });
  }
  assert.match(html, /<meta[^>]+name="description"[^>]+data-i18n-content="meta\.description"/s);

  const stack = [];
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  for (const token of html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? []) {
    if (token.startsWith('<!--') || /^<!doctype/i.test(token)) continue;
    if (token.startsWith('</')) {
      const tag = token.match(/^<\/\s*([\w-]+)/)?.[1]?.toLowerCase();
      while (stack.length && stack.pop().tag !== tag) {}
      continue;
    }
    if (token.startsWith('<')) {
      const tag = token.match(/^<\s*([\w-]+)/)?.[1]?.toLowerCase();
      if (!tag || token.startsWith('<?')) continue;
      const entry = {
        tag,
        translated: /\bdata-i18n="[^"]+"/.test(token),
        invariant: /\blang="en"/.test(token) || (tag === 'span' && /\blang="zh-CN"/.test(token)),
        hidden: /\baria-hidden="true"/.test(token),
      };
      if (!voidTags.has(tag) && !/\/\s*>$/.test(token)) stack.push(entry);
      continue;
    }

    const text = token.replace(/\s+/g, ' ').trim();
    if (!text || stack.some((entry) => ['script', 'style'].includes(entry.tag))) continue;
    const covered = stack.some((entry) => entry.translated || entry.invariant || entry.hidden);
    assert.ok(covered || /^[\d\s./—·©]+$/u.test(text), `unmarked static prose: ${text}`);
  }

  assert.deepEqual([...html.matchAll(/[\p{Script=Han}]+/gu)].map((match) => match[0]).sort(), ['中', '陈']);
});

test('runtime applies locale without resetting navigation state and rebuilds split text safely', async () => {
  const [script, css] = await Promise.all([read('script.js'), read('styles.css')]);
  const applyLocale = readFunction(script, 'applyLocale');

  assert.match(script, /globalThis\.PortfolioI18n/);
  assert.match(script, /localStorage\.getItem\(STORAGE_KEY\)/);
  assert.match(script, /resolveLocale\(\{[\s\S]*savedLocale[\s\S]*navigatorLanguages:\s*navigator\.languages[\s\S]*navigatorLanguage:\s*navigator\.language/);
  assert.match(applyLocale, /root\.lang = locale/);
  assert.match(applyLocale, /root\.dataset\.locale = locale/);
  assert.match(applyLocale, /querySelectorAll\('\[data-i18n\]'\)/);
  for (const attribute of ['aria-label', 'alt', 'content', 'title']) {
    assert.match(applyLocale, new RegExp(`data-i18n-${attribute}`));
  }
  assert.match(applyLocale, /setAttribute\('aria-pressed', String\(/);
  assert.match(applyLocale, /localStorage\.setItem\(STORAGE_KEY, locale\)/);
  assert.match(applyLocale, /requestAnimationFrame\(\(\) => \{[\s\S]*dispatchEvent\(new Event\('resize'\)\)/);
  for (const forbidden of [/closeMenu\(/, /scrollTo\(/, /location\./, /activeChapter\s*=/, /classList\.(?:add|remove|toggle)\('is-open'/]) {
    assert.doesNotMatch(applyLocale, forbidden, 'locale switching must preserve scroll, chapter, and menu state');
  }

  assert.match(script, /new Intl\.Segmenter\(locale, \{ granularity: 'word' \}\)/);
  assert.match(script, /\\p\{Script=Han\}/);
  assert.doesNotMatch(script, /\u00a0|\\u00a0|\\xA0/i);
  assert.match(script, /element\.classList\.remove\('split-ready'\)/);
  assert.match(script, /element\.replaceChildren\(\)/);
  assert.match(applyLocale, /querySelectorAll\('\[data-split\]'\)\.forEach/);
  assert.match(script, /const focusable = \[\.\.\.siteNav\.querySelectorAll\('a'\), \.\.\.localeButtons, menuToggle\]/);
  assert.match(script, /translate\(willOpen \? 'nav\.close' : 'nav\.open'\)/);

  assert.match(css, /html\[lang=['"]zh-CN['"]\]\s+body\s*\{[^}]*font-family:/s);
  assert.match(css, /html\[lang=['"]zh-CN['"]\][^{]*\.(?:chapter-heading|project-copy|contact)[^{]*\{[^}]*line-height:/s);
  assert.match(css, /html\[lang=['"]zh-CN['"]\]\s+\.word-mask \+ \.word-mask::before\s*\{\s*content:\s*['"]['"];\s*\}/s);
  assert.match(css, /html\[lang=['"]en['"]\]\s+\.vertical-title\s*\{[^}]*font-size:/s);
  assert.doesNotMatch(css, /font-size:\s*[^;}]*(?:vw|vh|vmin|vmax)/i);
});
