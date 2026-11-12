import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { versionDesktopAssets } from '../desktop-app/scripts/version-desktop-assets.mjs';

const root = new URL('../', import.meta.url);
const digest = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 12);

test('published desktop URLs match the emitted JS and CSS bytes', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  for (const name of ['desktop.js', 'desktop.css']) {
    const expected = digest(await readFile(new URL(`assets/macos/${name}`, root)));
    assert.ok(html.includes(`./assets/macos/${name}?v=${expected}"`), name);
  }
});

test('versioning changes only emitted asset URLs and changes each key only with its bytes', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'desktop-version-'));
  try {
    await mkdir(join(fixture, 'assets/macos'), { recursive: true });
    const html = '<!-- unrelated user edit -->\n<link href="./assets/macos/desktop.css?v=old"><script src="./assets/macos/desktop.js?v=old"></script>\n<main data-dirty="preserve">个人作品</main>\n';
    await writeFile(join(fixture, 'index.html'), html);
    await writeFile(join(fixture, 'assets/macos/desktop.js'), 'first runtime');
    await writeFile(join(fixture, 'assets/macos/desktop.css'), 'first styles');
    const first = await versionDesktopAssets(fixture);
    const initial = await readFile(join(fixture, 'index.html'), 'utf8');
    assert.equal(initial, html.replace('desktop.css?v=old', `desktop.css?v=${digest('first styles')}`).replace('desktop.js?v=old', `desktop.js?v=${digest('first runtime')}`));
    assert.deepEqual(await versionDesktopAssets(fixture), first);
    assert.equal(await readFile(join(fixture, 'index.html'), 'utf8'), initial);
    await writeFile(join(fixture, 'assets/macos/desktop.js'), 'updated runtime');
    const second = await versionDesktopAssets(fixture);
    assert.notEqual(second['desktop.js'], first['desktop.js']);
    assert.equal(second['desktop.css'], first['desktop.css']);
    assert.equal(await readFile(join(fixture, 'index.html'), 'utf8'), initial.replace(first['desktop.js'], digest('updated runtime')));
  } finally { await rm(fixture, { recursive: true, force: true }); }
});
