import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE, PUBLISHER } from '../consts';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Cortisol+ blog',
    description: 'Evidence-first writing on cortisol, stress, sleep, HRV, and wearable health science — from the team behind Cortisol+.',
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      author: `${PUBLISHER.email} (${PUBLISHER.name})`,
    })),
    customData: `
      <language>en-us</language>
      <copyright>© ${new Date().getFullYear()} ${PUBLISHER.name}</copyright>
      <managingEditor>${PUBLISHER.email} (${PUBLISHER.name})</managingEditor>
    `,
    stylesheet: undefined,
  });
}
