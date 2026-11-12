import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseFrontmatter } from './content.mjs';

let count = 0;
async function check(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await check(path);
    else if (/\.mdx?$/.test(path)) {
      const { data } = parseFrontmatter(await readFile(path, 'utf8'), path);
      if (path.includes('/blog/') && !data.pubDate) throw new Error(`${path}: missing pubDate`);
      count++;
    }
  }
}
await check('src/content');
console.log(`Validated frontmatter for ${count} content files.`);
