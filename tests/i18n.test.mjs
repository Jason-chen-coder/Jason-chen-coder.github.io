import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

async function loadI18n(globals = {}) {
  const context = vm.createContext({ ...globals });
  context.globalThis = context;
  vm.runInContext(await read('i18n.js'), context, { filename: 'i18n.js' });
  return context.PortfolioI18n;
}

function decodeHtml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"').replaceAll('&#39;', "'");
}

function makeElement(dataset, textContent = '') {
  return {
    dataset, textContent,
    attributes: new Map(),
    setAttribute(name, value) { this.attributes.set(name, String(value)); },
  };
}

function makeDomHarness({ blockedStorage = false } = {}) {
  const title = makeElement({ i18n: 'meta.title' });
  const body = makeElement({ i18n: 'hero.body' });
  const method = makeElement({ i18n: 'method.3.title' });
  const description = makeElement({ i18nContent: 'meta.description' });
  const navigation = makeElement({ i18nAriaLabel: 'a11y.nav' });
  const localeButtons = [makeElement({ locale: 'zh-CN' }), makeElement({ locale: 'en' })];
  const events = [];
  const writes = [];
  const rootElement = { lang: 'zh-CN', dataset: { locale: 'zh-CN' } };
  const document = {
    documentElement: rootElement,
    querySelectorAll(selector) {
      return ({
        '[data-i18n]': [title, body, method],
        '[data-i18n-content]': [description],
        '[data-i18n-aria-label]': [navigation],
        'button[data-locale]': localeButtons,
      })[selector] ?? [];
    },
    dispatchEvent(event) { events.push(event); },
  };
  class CustomEvent {
    constructor(type, { detail } = {}) { this.type = type; this.detail = detail; }
  }
  const localStorage = {
    setItem(key, value) {
      if (blockedStorage) throw new Error('storage denied');
      writes.push([key, value]);
    },
  };
  return { document, CustomEvent, localStorage, title, body, method, description, navigation, localeButtons, rootElement, events, writes };
}

test('locales normalize consistently and a first visit defaults to Chinese', async () => {
  const api = await loadI18n();
  assert.ok(api);
  assert.equal(api.STORAGE_KEY, 'jason-chen.portfolio.locale');
  assert.deepEqual([...api.SUPPORTED_LOCALES], ['zh-CN', 'en']);
  for (const [input, expected] of [
    ['en', 'en'], ['EN_us', 'en'], ['en-GB', 'en'],
    ['zh', 'zh-CN'], ['zh-cn', 'zh-CN'], ['zh-Hans-CN', 'zh-CN'], ['zh-TW', 'zh-CN'],
    ['fr-FR', null], ['', null], [null, null],
  ]) assert.equal(api.normalizeLocale(input), expected);
  assert.equal(api.resolveLocale(), 'zh-CN');
  assert.equal(api.resolveLocale({ savedLocale: 'invalid', navigatorLanguages: ['en-US'] }), 'zh-CN');
  assert.equal(api.resolveLocale({ savedLocale: 'en-GB' }), 'en');
  assert.equal(api.resolveLocale({ savedLocale: 'zh' }), 'zh-CN');
  assert.equal(api.translate('hero.line1', 'en'), api.COPY.en['hero.line1']);
  assert.equal(api.translate('hero.line1', 'unsupported'), api.COPY['zh-CN']['hero.line1']);
  assert.equal(api.translate('unknown.key', 'en'), 'unknown.key');
  assert.equal(api.applyLocale('en'), 'en', 'catalog can be loaded without a DOM for maintenance and tests');
});

test('catalogs cover all static translation markers and match the Chinese no-JavaScript fallback', async () => {
  const [api, html] = await Promise.all([loadI18n(), read('index.html')]);
  const keys = Object.keys(api.COPY['zh-CN']).sort();
  assert.deepEqual(Object.keys(api.COPY.en).sort(), keys);
  assert.ok(keys.length >= 100, 'both complete experiences must be translated');
  for (const locale of api.SUPPORTED_LOCALES) {
    for (const key of keys) assert.ok(typeof api.COPY[locale][key] === 'string' && api.COPY[locale][key].trim(), `${locale}.${key} has copy`);
  }
  const markers = [...html.matchAll(/\bdata-i18n(?:-(?:aria-label|alt|content|title))?="([^"]+)"/g)].map((match) => match[1]);
  for (const key of new Set(markers)) {
    assert.ok(api.COPY.en[key], `English copy missing for ${key}`);
    assert.ok(api.COPY['zh-CN'][key], `Chinese copy missing for ${key}`);
  }
  const leaves = [...html.matchAll(/<([a-z][\w-]*)\b([^>]*\bdata-i18n="([^"]+)"[^>]*)>([^<]*)<\/\1\s*>/gi)];
  const textKeys = [...html.matchAll(/\bdata-i18n="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(leaves.map((match) => match[3]).sort(), textKeys.sort(), 'translations belong on text leaves to retain icons and structure');
  for (const match of leaves) {
    const text = (value) => value.replace(/\s+/g, ' ').trim();
    assert.equal(text(decodeHtml(match[4])), text(api.COPY['zh-CN'][match[3]]), `${match[3]} retains a Chinese static fallback`);
  }
  for (const match of html.matchAll(/<[^>]*\bdata-i18n-(aria-label|content)="([^"]+)"[^>]*>/g)) {
    const fallback = match[0].match(new RegExp(`(?:^|\\s)${match[1]}="([^"]*)"`))?.[1];
    assert.notEqual(fallback, undefined);
    assert.equal(decodeHtml(fallback), api.COPY['zh-CN'][match[2]], `${match[2]} retains a static attribute`);
  }
  const scriptSources = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1].split(/[?#]/)[0]);
  const i18nIndex = scriptSources.indexOf('./i18n.js');
  const mainIndex = scriptSources.indexOf('./script.js');
  assert.ok(i18nIndex >= 0, 'localization script must be present');
  assert.ok(mainIndex >= 0, 'main script must be present');
  assert.ok(i18nIndex < mainIndex, 'localization must load before the main script');
});

test('speech project copy accurately describes the verified on-device Sherpa-ONNX application', async () => {
  const api = await loadI18n();
  for (const locale of api.SUPPORTED_LOCALES) {
    const copy = `${api.COPY[locale]['project.2.title']} ${api.COPY[locale]['project.2.body']}`;
    assert.match(copy, /Sherpa-ONNX/i, `${locale} must identify the verified inference technology`);
    assert.doesNotMatch(copy, /\bplugin\b|插件|原生语音能力/i, `${locale} must not misrepresent the application as a native speech plugin`);
  }
  assert.match(api.COPY['zh-CN']['project.2.body'], /端侧|本地/);
  assert.match(api.COPY.en['project.2.body'], /on-device|local/i);
});

test('language switching translates visible content, metadata, accessible labels and state', async () => {
  const dom = makeDomHarness();
  const api = await loadI18n({ document: dom.document, localStorage: dom.localStorage, CustomEvent: dom.CustomEvent });
  assert.equal(api.applyLocale('en'), 'en');
  assert.equal(dom.rootElement.lang, 'en');
  assert.equal(dom.rootElement.dataset.locale, 'en');
  assert.equal(dom.title.textContent, api.COPY.en['meta.title']);
  assert.equal(dom.body.textContent, api.COPY.en['hero.body']);
  assert.equal(dom.method.textContent, api.COPY.en['method.3.title'], 'selected workflow copy uses its current key');
  assert.equal(dom.description.attributes.get('content'), api.COPY.en['meta.description']);
  assert.equal(dom.navigation.attributes.get('aria-label'), api.COPY.en['a11y.nav']);
  assert.deepEqual(dom.localeButtons.map((button) => button.attributes.get('aria-pressed')), ['false', 'true']);
  assert.deepEqual(dom.writes, [[api.STORAGE_KEY, 'en']]);
  assert.equal(dom.events.at(-1).type, 'portfolio:localechange');
  assert.equal(dom.events.at(-1).detail.locale, 'en');
  api.applyLocale('zh-CN');
  assert.equal(dom.body.textContent, api.COPY['zh-CN']['hero.body']);
  assert.deepEqual(dom.localeButtons.map((button) => button.attributes.get('aria-pressed')), ['true', 'false']);
});

test('localization remains usable when browser storage is denied and initialization avoids persistence', async () => {
  const blocked = makeDomHarness({ blockedStorage: true });
  const api = await loadI18n({ document: blocked.document, localStorage: blocked.localStorage, CustomEvent: blocked.CustomEvent });
  assert.doesNotThrow(() => api.applyLocale('en'));
  assert.equal(blocked.rootElement.lang, 'en');
  assert.equal(blocked.events.at(-1).detail.locale, 'en');
  const fresh = makeDomHarness();
  const freshApi = await loadI18n({ document: fresh.document, localStorage: fresh.localStorage, CustomEvent: fresh.CustomEvent });
  freshApi.applyLocale('en', { persist: false });
  assert.deepEqual(fresh.writes, []);
  assert.equal(fresh.rootElement.lang, 'en');
});
