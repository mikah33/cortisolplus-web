import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { SITE, locations, fingerprint, validateIndexability } from './release.mjs';

const urls = locations(await readFile('dist/sitemap.xml', 'utf8'));
const protectedRoutes = JSON.parse(await readFile('scripts/protected-routes.json', 'utf8'));
for (const route of protectedRoutes) {
  if (!urls.includes(`${SITE}${route}`)) throw new Error(`Protected existing URL removed: ${route}`);
}
const routes = [];
for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.origin !== SITE || !parsed.pathname.endsWith('/')) throw new Error(`Unexpected sitemap URL ${url}`);
  const html = await readFile(`dist${parsed.pathname}index.html`, 'utf8');
  validateIndexability(html, url);
  routes.push({ path: parsed.pathname, ...fingerprint(html) });
}
const commit = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
await writeFile('dist/release.json', JSON.stringify({ version: 1, commit, routes }, null, 2) + '\n');
console.log(`Release manifest: ${routes.length} canonical routes, ${commit}`);
