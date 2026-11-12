import { parse, stringify } from 'yaml';

export function parseFrontmatter(source, name = 'content') {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${name}: missing YAML frontmatter`);
  const data = parse(match[1], { uniqueKeys: true });
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`${name}: frontmatter must be a mapping`);
  for (const key of ['title', 'description']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${name}: ${key} must be text`);
  }
  for (const key of ['pubDate', 'updatedDate']) {
    if (data[key] !== undefined && !Number.isFinite(Date.parse(data[key]))) throw new Error(`${name}: invalid ${key}`);
  }
  if (data.pubDate && data.updatedDate && Date.parse(data.updatedDate) < Date.parse(data.pubDate)) throw new Error(`${name}: updatedDate precedes pubDate`);
  if (data.draft !== undefined && typeof data.draft !== 'boolean') throw new Error(`${name}: draft must be boolean`);
  return { data, body: source.slice(match[0].length) };
}

export function serializeDraft(input) {
  if (!input || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) throw new Error('Invalid slug');
  if (typeof input.body !== 'string' || input.body.length < 200 || input.body.length > 60000) throw new Error('Invalid body');
  // Automation supplies prose only. Executable MDX requires a separate code review.
  if (/^\s*(import|export)\s|[<{}]/m.test(input.body)) throw new Error('Draft must be plain Markdown without executable MDX');
  const data = {
    title: input.title, description: input.description,
    pubDate: new Date().toISOString().slice(0, 10),
    tags: Array.isArray(input.tags) ? input.tags.filter(t => typeof t === 'string') : [],
    draft: true, targetTool: '/tools/cortisol-calculator/',
  };
  const source = `---\n${stringify(data)}---\n\n${input.body.trim()}\n`;
  parseFrontmatter(source);
  return source;
}
