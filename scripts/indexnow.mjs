import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { SITE } from './release.mjs';

export function changedUrls(previous, next) {
  const validate = manifest => {
    if (!Array.isArray(manifest.routes)) throw new Error('Invalid release manifest');
    return new Map(manifest.routes.map(route => {
      const url = new URL(route.path, SITE);
      if (url.origin !== SITE || url.pathname !== route.path || !route.path.endsWith('/') || !route.sha256) throw new Error('Invalid manifest route');
      return [route.path, route.sha256];
    }));
  };
  const before = validate(previous), after = validate(next);
  return [...new Set([...before.keys(), ...after.keys()])]
    .filter(path => before.get(path) !== after.get(path)).map(path => SITE + path);
}
async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000), cache: 'no-store' });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res;
}
async function main(mode) {
  const next = JSON.parse(await readFile('dist/release.json', 'utf8'));
  if (mode === 'plan') {
    // Fail on network errors rather than mistaking them for a first deployment.
    const previous = await (await get(`${SITE}/release.json`)).json();
    const urls = changedUrls(previous, next);
    await writeFile('dist/indexnow-plan.json', JSON.stringify({commit: next.commit, urls}));
    console.log(`IndexNow: ${urls.length} changed URLs planned`);
    return;
  }
  if (mode !== 'submit') throw new Error('Use plan or submit');
  const plan = JSON.parse(await readFile('dist/indexnow-plan.json', 'utf8'));
  const live = await (await get(`${SITE}/release.json`)).json();
  if (live.commit !== next.commit || plan.commit !== next.commit) throw new Error('Deployment does not match IndexNow plan');
  for (const url of plan.urls) {
    const parsed = new URL(url);
    if (parsed.origin !== SITE || parsed.search || parsed.hash) throw new Error('Unexpected IndexNow URL');
    // Removed routes are allowed, but only on this site.
  }
  if (!plan.urls.length) { console.log('IndexNow: no content changes; nothing submitted'); return; }
  const {key} = JSON.parse(await readFile('scripts/indexnow-config.json', 'utf8'));
  const keyLocation = `${SITE}/${key}.txt`;
  if ((await (await get(keyLocation)).text()).trim() !== key) throw new Error('Live IndexNow key mismatch');
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', headers: {'Content-Type': 'application/json; charset=utf-8'},
    body: JSON.stringify({host: new URL(SITE).hostname, key, keyLocation, urlList: plan.urls}),
    signal: AbortSignal.timeout(30000),
  });
  if (![200,202].includes(res.status)) throw new Error(`IndexNow HTTP ${res.status}: ${await res.text()}`);
  console.log(`IndexNow HTTP ${res.status}: ${plan.urls.length} URLs received${res.status === 202 ? '; key validation pending' : ''}. This is not confirmation of indexing.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv[2]);
