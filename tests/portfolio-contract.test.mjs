import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const attributes = (source, name) => [...source.matchAll(new RegExp(`\\b${name}="([^"]*)"`, 'g'))].map((match) => match[1]);

const selectedProjects = [
  ['Mxgraph-EasyFlowEditor', 213, 48],
  ['D3-EasyFlowRender', 43, 6],
  ['Flutter-EasySpeechRecognition', 34, 9],
  ['Monaco-EasyCodeEditor', 27, 11],
];

const professionalLinks = [
  'https://www.mgi-tech.com/lab-management-system/209.html',
  'https://mp.weixin.qq.com/s/jXKv9ZQzOUUefsgutNwPng',
  'https://www.mgi-tech.com/827/258.html',
  'https://www.mgi-tech.com/671/157.html',
];

test('homepage has a Chinese semantic document and a complete navigable journey', async () => {
  const html = await read('index.html');
  assert.match(html, /<html\b[^>]*lang="zh-CN"/);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /<main\b[^>]*id="main-content"/);
  assert.match(html, /<a\b[^>]*href="#main-content"[^>]*>/);
  assert.match(html, /<header\b/);
  assert.match(html, /<nav\b/);
  assert.match(html, /<footer\b/);
  const ids = attributes(html, 'id');
  assert.equal(new Set(ids).size, ids.length, 'document IDs must be unique, including inline SVG definitions');
  for (const id of ['top', 'opensource', 'work', 'craft', 'about', 'experience', 'contact']) {
    assert.ok(ids.includes(id), `existing or new public hash #${id} must resolve`);
  }
  for (const href of attributes(html, 'href').filter((value) => value.startsWith('#'))) {
    assert.ok(ids.includes(href.slice(1)), `internal link ${href} must resolve to real content`);
  }
  for (const label of attributes(html, 'aria-labelledby')) {
    for (const id of label.split(/\s+/)) assert.ok(ids.includes(id), `accessible label ${id} must resolve`);
  }
});

test('four featured repositories retain verified popularity order and dated counts', async () => {
  const html = await read('index.html');
  const articles = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map((match) => match[0]);
  let previousIndex = -1;
  for (const [name, stars, forks] of selectedProjects) {
    const href = `https://github.com/Jason-chen-coder/${name}`;
    const index = html.indexOf(`href="${href}"`);
    assert.ok(index > previousIndex, `${name} must follow popularity order`);
    previousIndex = index;
    const article = articles.find((source) => source.includes(`href="${href}"`));
    assert.ok(article, `${name} must have its own semantic project article`);
    assert.match(article, new RegExp(`>\\s*${stars}\\s*<`), `${name} must display its verified star count`);
    assert.match(article, new RegExp(`\\b${forks} forks\\b`), `${name} must display its verified fork count`);
    assert.match(article, /<h3\b/);
  }
  assert.match(html, /2026[-./]10[-./]31/);
  for (const name of ['JsPlumb-EasyFlowEditor', 'Webpack5Mfp-Node-Nacos', 'dev-skills']) {
    assert.ok(html.includes(`href="https://github.com/Jason-chen-coder/${name}"`), `${name} remains discoverable`);
  }
});

test('professional work preserves all four product destinations and conservative contribution copy', async () => {
  const html = await read('index.html');
  for (const href of professionalLinks) assert.ok(html.includes(`href="${href}"`), `${href} must remain linked`);
  for (const name of ['αLab Studio', 'PrimeGen', 'Oxygen Future', 'Cloud Imaging']) assert.ok(html.includes(name));
  assert.match(html, /前端架构|协议工具/);
  assert.match(html, /多窗口架构|媒体集成/);
  assert.doesNotMatch(html, /(?:提升|提高|降低)[^<]{0,15}\d+%/u, 'do not invent performance or business outcomes');
});

test('all page and stylesheet resources are local, present, and safe under a GitHub Pages subpath', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('styles.css')]);
  const runtimeSources = [...attributes(html, 'src'), ...attributes(html, 'poster')];
  for (const tag of html.match(/<link\b[^>]*>/g) ?? []) {
    const href = tag.match(/\bhref="([^"]+)"/)?.[1];
    if (href) runtimeSources.push(href);
  }
  for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]*))\s*\)/g)) runtimeSources.push(match[1] ?? match[2] ?? match[3]);
  assert.ok(runtimeSources.length >= 8, 'exercise real scripts, stylesheet, illustrations, fonts and project media');
  for (const source of new Set(runtimeSources)) {
    assert.doesNotMatch(source, /^(?:https?:|\/\/|\/)/, `${source} must not depend on another host or site root`);
    if (source.startsWith('data:') || source.startsWith('#')) continue;
    await access(new URL(source.split(/[?#]/)[0], root));
  }
  assert.doesNotMatch(html, /<script[^>]*src="[^\"]*(?:scene|lab-world|media-gallery)\.js/);
  assert.doesNotMatch(html, /<canvas\b/);
});

test('external links, résumé and contact actions remain usable and safe', async () => {
  const html = await read('index.html');
  for (const tag of html.match(/<a\b[^>]*>/g) ?? []) {
    if (!/\btarget="_blank"/.test(tag)) continue;
    const rel = tag.match(/\brel="([^"]+)"/)?.[1]?.split(/\s+/) ?? [];
    assert.ok(rel.includes('noreferrer'), `external destination must not expose an opener: ${tag}`);
  }
  assert.match(html, /href="\.\/resume\.pdf"/);
  await access(new URL('resume.pdf', root));
  assert.match(html, /href="mailto:hongxin\.jasonchen@gmail\.com"/);
  assert.match(html, /<button\b[^>]*data-copy-email/);
  assert.match(html, /aria-live="polite"[^>]*role="status"|role="status"[^>]*aria-live="polite"/);
  assert.match(html, /href="https:\/\/github\.com\/Jason-chen-coder"/);
  assert.match(html, /href="https:\/\/zhu\.eitech\.edu\.cn\/zh\/"/);
});

test('navigation, language controls and workflow tabs expose accessible states', async () => {
  const html = await read('index.html');
  const menu = (html.match(/<button\b[^>]*class="[^"]*menu-toggle[^"]*"[^>]*>/) ?? [])[0];
  assert.ok(menu);
  assert.match(menu, /aria-expanded="false"/);
  assert.match(menu, /aria-controls="site-nav"/);
  for (const locale of ['zh-CN', 'en']) {
    const button = (html.match(new RegExp(`<button\\b[^>]*data-locale="${locale}"[^>]*>`)) ?? [])[0];
    assert.ok(button, `${locale} remains available on the page`);
    assert.match(button, /aria-pressed="(?:true|false)"/);
  }
  assert.match(html, /role="tablist"/);
  const tabs = html.match(/<button\b[^>]*role="tab"[^>]*>/g) ?? [];
  assert.equal(tabs.length, 4);
  assert.equal(tabs.filter((tag) => /aria-selected="true"/.test(tag)).length, 1);
  for (const tab of tabs) assert.match(tab, /aria-controls="method-panel"/);
  assert.match(html, /role="tabpanel"/);
});

test('presentation includes reduced-motion and keyboard-focus support without hiding static content', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('styles.css')]);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media/);
  assert.doesNotMatch(html, /<[^>]*\b(?:class="[^"]*reveal[^"]*"|data-i18n="[^"]+")[^>]*\bhidden\b/);
  assert.match(html, /把复杂系统/);
  assert.match(html, /高级前端工程师/);
  assert.match(html, /深圳/);
});
