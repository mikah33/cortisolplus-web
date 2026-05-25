import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** URL of the most-relevant tool/quiz to drive conversion (auto-renders ToolCTA at bottom). */
    targetTool: z.string().default('/tools/cortisol-calculator'),
  }),
});

const faqItem = z.object({ q: z.string(), a: z.string() });

const symptoms = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/symptoms' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    symptom: z.string(),
    relatedSymptoms: z.array(z.string()).default([]),
    updatedDate: z.coerce.date().optional(),
    faqs: z.array(faqItem).default([]),
  }),
});

const foods = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/foods' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    food: z.string(),
    effect: z.enum(['lowers', 'raises', 'neutral']),
    evidenceLevel: z.enum(['strong', 'moderate', 'limited']),
    updatedDate: z.coerce.date().optional(),
    faqs: z.array(faqItem).default([]),
  }),
});

export const collections = { blog, symptoms, foods };
