#!/usr/bin/env node
/**
 * Generates a WordPress WXR XML export of all blog posts —
 * the format Substack accepts via Settings → Import →
 * "Import from WordPress."
 *
 * Output: exports/cortisolplus-substack.xml
 *
 * Usage:  node scripts/generate-substack-import.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const OUT_DIR = path.join(ROOT, 'exports');
const OUT_FILE = path.join(OUT_DIR, 'cortisolplus-substack.xml');

const SITE_URL = 'https://cortisolplus.com';
const SITE_TITLE = 'Cortisol+ Blog';
const SITE_DESCRIPTION = 'Cortisol, stress, sleep, HRV, and wearable health science — explained.';
const AUTHOR_NAME = 'Mikah Albertson';
const AUTHOR_EMAIL = 'admin@cortisolplus.com';
const AUTHOR_LOGIN = 'mikah';

// Configure marked for GFM
marked.setOptions({
  gfm: true,
  breaks: false,
});

function xmlEscape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rfc2822(date) {
  return new Date(date).toUTCString();
}

function ymd(date) {
  return new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = (await fs.readdir(BLOG_DIR)).filter((f) => /\.(mdx?|markdown)$/i.test(f));

  const items = [];
  let postId = 100;

  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(fullPath, 'utf-8');
    const { data: fm, content: body } = matter(raw);

    if (fm.draft) {
      console.log(`Skipping draft: ${file}`);
      continue;
    }

    const slug = path.basename(file, path.extname(file));
    const link = `${SITE_URL}/blog/${slug}/`;
    const pubDate = fm.pubDate ?? new Date().toISOString();
    const html = marked.parse(body);
    const tags = Array.isArray(fm.tags) ? fm.tags : [];

    const categoriesXml = tags
      .map((t) => `      <category domain="post_tag" nicename="${xmlEscape(slugify(t))}"><![CDATA[${t}]]></category>`)
      .join('\n');

    items.push(`    <item>
      <title>${xmlEscape(fm.title)}</title>
      <link>${link}</link>
      <pubDate>${rfc2822(pubDate)}</pubDate>
      <dc:creator><![CDATA[${AUTHOR_LOGIN}]]></dc:creator>
      <guid isPermaLink="false">${link}</guid>
      <description><![CDATA[${fm.description ?? ''}]]></description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
      <excerpt:encoded><![CDATA[${fm.description ?? ''}]]></excerpt:encoded>
      <wp:post_id>${postId++}</wp:post_id>
      <wp:post_date><![CDATA[${ymd(pubDate)}]]></wp:post_date>
      <wp:post_date_gmt><![CDATA[${ymd(pubDate)}]]></wp:post_date_gmt>
      <wp:comment_status><![CDATA[closed]]></wp:comment_status>
      <wp:ping_status><![CDATA[closed]]></wp:ping_status>
      <wp:post_name><![CDATA[${slug}]]></wp:post_name>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type><![CDATA[post]]></wp:post_type>
      <wp:post_password><![CDATA[]]></wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
${categoriesXml}
    </item>`);

    console.log(`✓ ${slug}`);
  }

  const wxr = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
    xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:wp="http://wordpress.org/export/1.2/">
  <channel>
    <title>${xmlEscape(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <pubDate>${rfc2822(new Date())}</pubDate>
    <language>en-US</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>${SITE_URL}</wp:base_site_url>
    <wp:base_blog_url>${SITE_URL}</wp:base_blog_url>

    <wp:author>
      <wp:author_id>1</wp:author_id>
      <wp:author_login><![CDATA[${AUTHOR_LOGIN}]]></wp:author_login>
      <wp:author_email><![CDATA[${AUTHOR_EMAIL}]]></wp:author_email>
      <wp:author_display_name><![CDATA[${AUTHOR_NAME}]]></wp:author_display_name>
      <wp:author_first_name><![CDATA[${AUTHOR_NAME.split(' ')[0]}]]></wp:author_first_name>
      <wp:author_last_name><![CDATA[${AUTHOR_NAME.split(' ').slice(1).join(' ')}]]></wp:author_last_name>
    </wp:author>

${items.join('\n')}
  </channel>
</rss>
`;

  await fs.writeFile(OUT_FILE, wxr, 'utf-8');
  console.log(`\n✅ Wrote ${items.length} posts to: ${OUT_FILE}`);
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
