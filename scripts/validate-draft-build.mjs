import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { parseFrontmatter } from './content.mjs';
import { stringify } from 'yaml';

const slug = process.argv[2];
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid slug');
const file = `src/content/blog/${slug}.mdx`;
const original = await readFile(file, 'utf8');
const { data, body } = parseFrontmatter(original);
try {
  // Render the proposed page in an isolated CI build, then restore draft status.
  await writeFile(file, `---\n${stringify({ ...data, draft: false })}---\n${body}`);
  const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' });
  process.exitCode = result.status ?? 1;
} finally {
  await writeFile(file, original);
}
