import test from 'node:test';
import assert from 'node:assert/strict';
import {changedUrls} from './indexnow.mjs';
const manifest = routes => ({routes: Object.entries(routes).map(([path,sha256])=>({path,sha256}))});
test('IndexNow submits added, changed and removed routes, not unchanged content', () => {
  assert.deepEqual(changedUrls(manifest({'/':'a','/old/':'b','/updated/':'c'}),manifest({'/':'a','/new/':'d','/updated/':'e'})), ['https://cortisolplus.com/old/','https://cortisolplus.com/updated/','https://cortisolplus.com/new/']);
  assert.deepEqual(changedUrls(manifest({'/':'a'}),manifest({'/':'a'})),[]);
});
test('IndexNow rejects off-site and malformed routes', () => {
  for (const path of ['//evil.test/', '/foo/?private=yes', 'https://evil.test/', '/foo/../']) assert.throws(()=>changedUrls(manifest({}),manifest({[path]:'a'})));
});
