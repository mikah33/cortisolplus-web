import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { serializeDraft, parseFrontmatter } from './content.mjs';

const workflow = JSON.parse(await readFile(new URL('../automation/workflow.json', import.meta.url)));
const queue = JSON.parse(await readFile(new URL('../automation/editorial-queue.json', import.meta.url)));
const code = workflow.nodes.find(n => n.name === 'Claude + validate').parameters.jsCode;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const generate = new AsyncFunction('$getWorkflowStaticData', code);
const article = {
  title: 'Apple Watch data: an editorial draft', description: 'A useful draft with a colon: safe YAML serialization.',
  tags: ['hrv', 'wearables'], body: 'This is a controlled test of the editorial publishing contract. '.repeat(8),
};

function run({ topics = queue, files = [], refs = [], state = {}, response = article, apiError } = {}) {
  const calls = [];
  const context = { helpers: { httpRequest: async request => {
    calls.push(request);
    if (request.url.includes('/editorial-queue.json')) return topics;
    if (request.url.includes('/contents/src/content/blog')) return files;
    if (request.url.includes('/git/matching-refs/')) return refs;
    if (request.url === 'https://api.anthropic.com/v1/messages') {
      if (apiError) throw apiError;
      return { content: [{ type: 'text', text: JSON.stringify(response) }] };
    }
    throw new Error('Unexpected destination');
  } } };
  return { result: generate.call(context, () => state), calls, state };
}

test('n8n output becomes a non-executable draft through the GitHub serializer', async () => {
  const { result, state } = run();
  const [item] = await result;
  const parsed = parseFrontmatter(serializeDraft(item.json));
  assert.equal(parsed.data.draft, true);
  assert.equal(parsed.data.title, article.title);
  assert.deepEqual(state.usedSlugs, [queue[0].slug]);
  assert.equal(item.json.base64Mdx, undefined);
  const publisher = workflow.nodes.find(n => n.name === 'Request GitHub draft').parameters;
  assert.equal(publisher.method, 'POST');
  assert.equal(publisher.url, 'https://api.github.com/repos/mikah33/cortisolplus-web/dispatches');
  assert.match(publisher.jsonBody, /event_type: 'content-draft'/);
});

test('existing files, draft branches and prior topics prevent duplicate generation', async () => {
  const { result, calls } = run({
    files: [{ name: `${queue[0].slug}.mdx` }],
    refs: [{ ref: `refs/heads/content/${queue[1].slug}` }],
    state: { usedSlugs: queue.slice(2).map(t => t.slug) },
  });
  assert.deepEqual(await result, []);
  assert.ok(calls.every(call => call.method === 'GET'));
});

test('unsafe model output releases the topic and never leaves the generator', async () => {
  const { result, state } = run({ response: { ...article, body: `${article.body}\n<script>alert(1)</script>` } });
  await assert.rejects(result, /no article was dispatched/);
  assert.deepEqual(state.usedSlugs, []);
});

test('API failure releases the topic without exposing request credentials', async () => {
  const { result, state } = run({ apiError: new Error('private-credential-from-request') });
  await assert.rejects(result, error => !error.message.includes('private-credential') && /no article was dispatched/.test(error.message));
  assert.deepEqual(state.usedSlugs, []);
});
