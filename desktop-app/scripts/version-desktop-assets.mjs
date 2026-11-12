import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

// Read emitted bytes, rather than source files or a manually maintained date.
// Only these two attribute values are replaced; the portfolio HTML stays intact.
export async function versionDesktopAssets(root = projectRoot) {
  const names = ['desktop.js', 'desktop.css'];
  const [html, ...assets] = await Promise.all([
    readFile(resolve(root, 'index.html'), 'utf8'),
    ...names.map(name => readFile(resolve(root, 'assets/macos', name))),
  ]);
  const versions = Object.fromEntries(names.map((name, index) => [
    name, createHash('sha256').update(assets[index]).digest('hex').slice(0, 12),
  ]));
  let next = html;
  for (const name of names) {
    const escaped = name.replace('.', '\\.');
    const attribute = new RegExp(`(\\b(?:src|href)=["'])(\\./assets/macos/${escaped})(?:\\?[^"']*)?(["'])`, 'g');
    let count = 0;
    next = next.replace(attribute, (_, before, path, quote) => {
      count++;
      return `${before}${path}?v=${versions[name]}${quote}`;
    });
    if (count !== 1) throw new Error(`Expected one index.html reference to ${name}; found ${count}`);
  }
  if (next !== html) await writeFile(resolve(root, 'index.html'), next);
  return versions;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const versions = await versionDesktopAssets();
  console.log(`Desktop asset versions: ${Object.entries(versions).map(([name, hash]) => `${name}=${hash}`).join(', ')}`);
}
