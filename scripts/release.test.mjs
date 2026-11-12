import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, serializeDraft } from './content.mjs';
import { fingerprint, verifyRelease } from './release.mjs';

test('serializer round-trips colon, quotes, newline and Unicode in titles', () => {
  const title = 'Cortisol: "stress" + sleep\nA second line — explained';
  const source = serializeDraft({ slug: 'stress-and-sleep', title, description: 'A draft', body: 'Useful source-linked prose. '.repeat(12) });
  assert.equal(parseFrontmatter(source).data.title, title);
  assert.equal(parseFrontmatter(source).data.draft, true);
});
test('malformed or duplicate frontmatter fails before build', () => {
  assert.throws(() => parseFrontmatter('---\ntitle: Cortisol: stress\ndescription: Test\n---\nBody'));
  assert.throws(() => parseFrontmatter('---\ntitle: First\ntitle: Second\ndescription: Test\n---\nBody'));
});
test('automated drafts reject traversal and executable MDX', () => {
  assert.throws(() => serializeDraft({ slug: '../index', body: 'x'.repeat(250) }));
  assert.throws(() => serializeDraft({ slug: 'test', body: 'import secret from "somewhere"\n' + 'x'.repeat(250) }));
});
const html = '<title>Expected article</title><link rel="canonical" href="https://cortisolplus.com/blog/new/"/><main><h1>Expected article</h1><p>' + 'Substantive published text. '.repeat(20) + '</p></main>';
const expected = { commit: 'new-commit', routes: [{ path: '/blog/new/', ...fingerprint(html) }] };
function mock({ commit = 'new-commit', sitemap = '<loc>https://cortisolplus.com/blog/new/</loc>', page = html } = {}) {
  return async url => new Response(url.pathname === '/release.json' ? JSON.stringify({ commit }) : url.pathname === '/sitemap.xml' ? sitemap : page);
}
test('current release and substantive expected content pass', async () => {
  await assert.doesNotReject(verifyRelease(expected, undefined, mock()));
});
test('HTTP 200 on an old release fails', async () => {
  await assert.rejects(verifyRelease(expected, undefined, mock({ commit: 'old-commit' })), /Stale release/);
});
test('HTTP 200 on a stale sitemap missing the new article fails', async () => {
  await assert.rejects(verifyRelease(expected, undefined, mock({ sitemap: '<loc>https://cortisolplus.com/</loc>' })), /missing from live sitemap/);
});
test('soft 404 and stale article body fail despite HTTP 200', async () => {
  await assert.rejects(verifyRelease(expected, undefined, mock({ page: html.replaceAll('Substantive published text.', 'This is a page not found.') })), /soft 404/);
});
test('alternate link cannot substitute for canonical', async () => {
  await assert.rejects(verifyRelease(expected, undefined, mock({ page: html.replace('rel="canonical"', 'rel="alternate"') })), /canonical/);
});
test('new noindex or robots header blocks verification', async () => {
  await assert.rejects(verifyRelease(expected, undefined, mock({ page: '<meta name="robots" content="noindex">' + html })), /Noindex/);
  const fetcher = async url => {
    const response = await mock()(url);
    response.headers.set('X-Robots-Tag', 'googlebot: noindex');
    return response;
  };
  await assert.rejects(verifyRelease(expected, undefined, fetcher), /Noindex/);
});
