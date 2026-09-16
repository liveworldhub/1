import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'official');
const html = await readFile(path.join(source, 'index.html'), 'utf8');
// Both existing public URLs use the same source; no duplicated business logic or runtime redirect.
const rootHtml = html.replace(
  /((?:href|src)=["'])(assets\/|styles\.css|script\.js|shipping\.html|refund\.html|privacy\.html|terms\.html)/g,
  '$1official/$2'
);
await writeFile(path.join(root, 'index.html'), rootHtml);
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, path.join(output, 'official'), { recursive: true });
await writeFile(path.join(output, 'index.html'), rootHtml);
await writeFile(path.join(output, '.nojekyll'), '');
console.log('Built root and /official/ storefronts into dist/.');
