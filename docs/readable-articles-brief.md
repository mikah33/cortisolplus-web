# Readable articles brief (Nov 12, 2026)

Goal: every article on cortisolplus.com should be easy on the eyes and easy to understand, with Zen throughout, and lead readers toward the `/start/` onboarding (which ends at the plan and checkout).

**Reference implementation — read these first:**
- `src/content/blog/compare-stress-scores-between-apps.mdx` (the approved template article)
- `src/components/article/InShort.astro`, `ZenTip.astro`, `ZenPicture.astro`
- `src/layouts/ArticleLayout.astro` (already adds the medical disclaimer, related guides, closing `/start/` box and newsletter — don't duplicate those)

## Writing rules

- **Plain English**, roughly a 12-year-old's reading level. Short sentences. Everyday words; explain any technical term the first time ("heart rate variability (HRV)").
- **Paragraphs of 1–3 short sentences.** Break up walls of text. Use lists where there are steps or several items.
- **Question-style or plain headings** ("Why don't my apps agree?"). Open each main section with the short answer, bold if it's the key point.
- **Keep every fact, number, caveat and source.** Rewording is fine; changing meaning is not. Do not add new health or medical claims, studies, statistics or numbers. Do not remove limitations such as "Cortisol+ does not measure cortisol", "not a diagnosis", "talk to a doctor". If a sentence is unclear or seems wrong, keep its meaning and list it in your report rather than guessing.
- Keep existing outbound source links and internal links (you may move them). Internal links stay relative (`/hrv/apple-watch/`).
- Keep any element `id` attributes and anchors other pages link to (e.g. `#walkthrough`, `#track`).

## Page structure

1. **`<InShort points={[...]}/>`** right after the frontmatter/imports: exactly 3 short takeaways (≤ 15 words each, may use `<strong>`). Optional `image` prop.
2. Body sections in plain English.
3. **2–3 Zen moments** spread through the article (not back to back): `<ZenTip image="...">one practical tip</ZenTip>` and/or `<ZenPicture src="..." caption="one short line" />`. Tips must be practical and must not add medical claims.
4. **One onboarding card** roughly two-thirds of the way down (and replace the article's own main App Store / "download" call-to-action with it). Copy exactly:

```html
<a href="/start/" data-start-cta class="not-prose my-8 flex items-center gap-4 rounded-2xl bg-[color:var(--color-ink)] p-5 text-white no-underline shadow-sm transition hover:brightness-110">
  <img src="/apple-touch-icon.png" alt="" width="48" height="48" class="h-12 w-12 shrink-0 rounded-[13px]" />
  <span class="min-w-0 flex-1 leading-snug">
    <span class="block font-extrabold">Get your personal stress plan</span>
    <span class="block text-sm text-white/75">A one-minute check-in with Zen, then your plan in Cortisol+</span>
  </span>
  <span class="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[color:var(--color-ink)]">Start ›</span>
</a>
```

   Plain factual mentions of the App Store (e.g. "available on the App Store") can stay as text.
5. Keep existing comparison cards/tables, but simplify their wording; wide tables should become stacked cards like the template if easy.

## Components and imports

- MDX (blog posts), after the frontmatter:
  ```
  import InShort from '../../components/article/InShort.astro';
  import ZenTip from '../../components/article/ZenTip.astro';
  import ZenPicture from '../../components/article/ZenPicture.astro';
  ```
- `.astro` pages: import with the correct relative depth from the page file (e.g. `src/pages/stress/apple-watch.astro` → `'../../components/article/InShort.astro'`; `src/pages/cortisol/lower/exercise.astro` → `'../../../components/article/InShort.astro'`). In `.astro`, use `<InShort points={[...]} />` the same way.
- `.astro` pages with **FAQ schema / `faqs` arrays / JSON-LD**: keep them, and keep their questions and answers consistent with the visible text (shorten both if you shorten one).
- **Do not change** frontmatter `title`, `description`, `pubDate`, `tags`, `draft`, or a page's `title`/`description` props (they were tuned for search). **Do** set or update `updatedDate: 2026-11-12` (MDX) / the `updated` prop (astro) if the page has one.

## Zen images available (in `public/`)

Full body (good for InShort and ZenPicture):
- `/app-ui/start/zen_explain.webp` — standing, finger up, explaining
- `/app-ui/start/zen_presenting.webp` — standing, presenting with open hand
- `/app-ui/start/zen_watch.webp` — standing, checking a wrist watch
- `/app-ui/zen_celebrate.webp` — jumping with arms up, happy
- `/app-ui/zen_companions.webp` — Zen with the three companions (wide)

Close-up / waist-up (good for ZenTip, which crops to a circle, and ZenPicture):
- `/app-ui/zen_greet.webp` — presenting with open hand
- `/app-ui/zen_presenting_new.webp` — presenting, smiling
- `/app-ui/zen_new_tour_zen.webp` — waving
- `/app-ui/zen_new_breathe.webp` — eyes closed, hand on chest, breathing calmly
- `/app-ui/zen_new_low.webp` — sitting cross-legged, calm
- `/app-ui/zen_new_normal.webp` — stretching arms up next to a plant
- `/app-ui/zen_new_tour_bioage.webp` — holding a small potted plant
- `/app-ui/zen_new_tour_connect.webp` — hugging a big heart
- `/app-ui/zen_new_tour_fitness.webp` — headphones, moving to music
- `/app-ui/zen_new_tour_now.webp` — holding a card with a profile
- `/app-ui/zen_new_tour_sleep.webp` — dozing in an armchair under a blanket

Match the image to the section (sleep → `zen_new_tour_sleep`, breathing → `zen_new_breathe`, watch data → `zen_watch`). Vary images within an article. New topic-specific Zen images are being made separately and will be swapped in later; don't wait for them.

## Verify before committing

- `npm run build` and `npm test` must pass.
- Visually check at least 3 of your pages at phone width with headless Chrome (minimum width 500):
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir=/tmp/rb-chrome-$RANDOM --window-size=500,6000 --virtual-time-budget=4000 --screenshot=/tmp/<name>.png "file://$(pwd)/dist/<path>/index.html"`
  (or run `npx astro preview --port <unique port>` and screenshot the http URL; stop the server after). Open the PNG with the Read tool and check nothing is broken, overlapping or unreadable.
- `git grep` your files for leftover `apps.apple.com` call-to-action links that should now be the onboarding card.
