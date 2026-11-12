import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const legacyHtml = html.replace(/(\.\/assets\/macos\/desktop\.(?:js|css))\?v=[^"']+/g, '$1?v=source-20261110');
const requests = [], errors = [];
let phase = 'legacy';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  requests.push({ phase, url: request.url });
  try {
    const path = resolve(root, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`);
    if (!path.startsWith(root + sep)) throw new Error('Invalid path');
    const extension = path.slice(path.lastIndexOf('.'));
    response.setHeader('Content-Type', mime[extension] || 'application/octet-stream');
    response.setHeader('Cache-Control', extension === '.html' ? 'no-store' : 'public, max-age=31536000, immutable');
    if (url.pathname === '/' || url.pathname === '/index.html') response.end(phase === 'legacy' ? legacyHtml : html);
    else if (phase === 'legacy' && url.pathname === '/assets/macos/desktop.js') response.end('window.__cachedDesktopBuild = "old";');
    else if (phase === 'legacy' && url.pathname === '/assets/macos/desktop.css') response.end('html { --cached-desktop-build: old; }');
    else response.end(await readFile(path));
  } catch { response.statusCode = 404; response.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 892, height: 954 } });
page.on('pageerror', error => errors.push(error.message));
const check = (value, message) => { assert.ok(value, message); console.log(`PASS ${message}`); };
try {
  // Use the browser's real HTTP cache; routing requests would disable it.
  await page.goto(base, { waitUntil: 'networkidle' });
  check(await page.evaluate(() => window.__cachedDesktopBuild === 'old'), 'legacy script has executed and populated the browser cache');
  const legacyCount = requests.filter(request => request.url.includes('/assets/macos/desktop.')).length;
  phase = 'current';
  const cached = await page.evaluate(async () => Promise.all(['js', 'css'].map(async extension => {
    const response = await fetch(`./assets/macos/desktop.${extension}?v=source-20261110`, { cache: 'force-cache' });
    return response.text();
  })));
  check(cached[0].includes('__cachedDesktopBuild') && cached[1].includes('--cached-desktop-build') && requests.filter(request => request.url.includes('/assets/macos/desktop.')).length === legacyCount, 'both old resource keys are still served from a warm HTTP cache without network requests');
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.mac-desktop').waitFor({ state: 'visible' });
  for (const extension of ['js', 'css']) {
    const reference = html.match(new RegExp(`\\./assets/macos/desktop\\.${extension}\\?v=([a-f0-9]{12})`));
    check(reference && requests.some(request => request.phase === 'current' && request.url === `/assets/macos/desktop.${extension}?v=${reference[1]}`), `${extension} is fetched from its new content key despite the cached legacy key`);
  }
  check(await page.locator('[data-dock="speech"]').isVisible() && await page.evaluate(() => typeof window.__cachedDesktopBuild === 'undefined'), 'the newly fetched runtime mounts the actual desktop instead of executing the cached old script');
  check(errors.length === 0, `cache update causes no browser errors (${errors.join('; ')})`);
} finally {
  const output = process.env.DESKTOP_EVIDENCE || '/tmp/jason-desktop-evidence';
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/desktop-cache-requests.json`, JSON.stringify(requests, null, 2));
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
