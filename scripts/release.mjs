import { createHash } from 'node:crypto';

export const SITE = 'https://cortisolplus.com';
export const hash = text => createHash('sha256').update(text).digest('hex');
export const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));

export function validateIndexability(html, canonical, robotsHeader = '') {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || html;
  const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m => [m[1].toLowerCase(), (m[2] ?? m[3] ?? m[4]).replaceAll('&amp;', '&')]));
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map(m => attributes(m[0]));
  const canonicals = links.filter(link => link.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  if (canonicals.length !== 1 || canonicals[0].href !== canonical) throw new Error('Expected exactly one correct canonical link');
  const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map(m => attributes(m[0]));
  const robots = [robotsHeader, ...meta.filter(m => /^(robots|googlebot|bingbot)$/i.test(m.name || '')).map(m => m.content || '')];
  if (robots.some(value => /(?:^|[\s,:])(noindex|none)(?:$|[\s,;])/i.test(value))) throw new Error('Noindex directive on expected indexed page');
}

export function fingerprint(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  if (!main || !title || (main.match(/<h1\b/g) || []).length !== 1) throw new Error('Expected title, main content and exactly one H1');
  const text = main.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length < 100) throw new Error('Main content is unexpectedly empty');
  return { title, sha256: hash(`${title}\n${text}`) };
}

export async function verifyRelease(expected, base = SITE, fetcher = fetch) {
  const get = async path => {
    const response = await fetcher(new URL(path, base), { signal: AbortSignal.timeout(30000), cache: 'no-store' });
    if (response.status !== 200) throw new Error(`${path}: HTTP ${response.status}`);
    const html = await response.text();
    if (expected.routes.some(route => route.path === path)) validateIndexability(html, `${SITE}${path}`, response.headers.get('x-robots-tag') || '');
    return html;
  };
  const actual = JSON.parse(await get('/release.json'));
  if (!expected.commit || actual.commit !== expected.commit) throw new Error(`Stale release: expected ${expected.commit}, live ${actual.commit}`);
  const sitemap = new Set(locations(await get('/sitemap.xml')));
  const errors = [];
  // Bounded batches keep verification gentle on production.
  for (let start = 0; start < expected.routes.length; start += 5) {
    await Promise.all(expected.routes.slice(start, start + 5).map(async route => {
      try {
        if (!sitemap.has(`${SITE}${route.path}`)) throw new Error('missing from live sitemap');
        const html = await get(route.path);
        if (fingerprint(html).sha256 !== route.sha256) throw new Error('content differs from approved build (or soft 404)');
      } catch (error) { errors.push(`${route.path}: ${error.message}`); }
    }));
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return `${expected.routes.length} expected routes verified at ${expected.commit}`;
}
