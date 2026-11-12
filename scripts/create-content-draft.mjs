import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { serializeDraft } from './content.mjs';

const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH || process.argv[2], 'utf8'));
const input = event.client_payload;
const source = serializeDraft(input);
await writeFile(`src/content/blog/${input.slug}.mdx`, source, { flag: 'wx' });
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `slug=${input.slug}\n`);
console.log(`Created draft ${input.slug}; editorial review is required to publish.`);
