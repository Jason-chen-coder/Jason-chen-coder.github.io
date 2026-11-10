import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');
test('personal homepage omits company sections in both languages and keeps valid local anchors', () => {
  const html = read('index.html');
  assert.doesNotMatch(html + read('i18n.js'), /华大|长亮|PrepALL|Pathology|PrimeGen|Oxygen Future|Cloud Imaging|laboratory automation/i);
  assert.doesNotMatch(html, /id="(?:work|experience|remote-checkup)"/);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(anchor), anchor);
});
test('Pages runs Jekyll and excludes company media and legacy source surfaces', () => {
  assert.equal(existsSync(new URL('.nojekyll', root)), false);
  const excluded = new Set([...read('_config.yml').matchAll(/^  - (.+)$/gm)].map(m => m[1]));
  for (const file of ['assets/videos/health-applet-promo.mp4', 'assets/videos/oxygen-future.mp4', 'assets/images/alab-protocol-orchestration.webp', 'assets/images/primegen-camera-composite-poster.webp', 'assets/images/cloud-remote-ultrasound-system.webp', 'assets/videos/manifest.json', 'NOTES.md', 'TEARDOWN.md', 'scene.js', 'lab-world.js', 'tests', 'resume.pdf']) assert.ok(excluded.has(file), file);
});
