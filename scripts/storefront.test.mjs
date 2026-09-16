import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './build-storefront.mjs';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
for (const route of [
  'index.html',
  'official/index.html',
  'official/privacy.html',
  'official/refund.html',
  'official/shipping.html',
  'official/terms.html',
]) {
  test(`${route}: local assets, page links and fragment targets resolve`, async () => {
    const html = await readFile(path.join(root, route), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML ids');
    for (const [, url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
      if (url.startsWith('#')) {
        assert.ok(ids.includes(url.slice(1)), `Missing target ${url}`);
        continue;
      }
      const resource = path.resolve(root, path.dirname(route), url.split(/[?#]/)[0]);
      await access(resource);
    }
    assert.match(html, /name="viewport"/);
  });
}
test('the public root is generated from the canonical storefront', async () => {
  const canonical = await readFile(path.join(root, 'official/index.html'), 'utf8');
  const homepage = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.equal(
    homepage,
    canonical.replace(
      /((?:href|src)=["'])(assets\/|styles\.css|script\.js|shipping\.html|refund\.html|privacy\.html|terms\.html)/g,
      '$1official/$2'
    )
  );
});
test('all storefront product imagery is local and has alternative text', async () => {
  const html = await readFile(path.join(root, 'official/index.html'), 'utf8');
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(img, /alt="[^"]+"/);
    assert.match(img, /src="assets\//);
    assert.match(img, /width="\d+"/);
    assert.match(img, /height="\d+"/);
  }
});
