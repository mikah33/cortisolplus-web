# GSC baseline snapshot — 2026-06-06

Captured at start of Phase 4 — Distribution. Used as the comparison
point for KPI tracking.

**Property:** `sc-domain:cortisolplus.com`
**Window:** 28 days (2026-05-09 → 2026-06-06)

---

## Totals (28-day window)

| Metric | Value |
|---|---|
| Clicks | 4 |
| Impressions | 112 |
| CTR | 3.57% |
| Avg position | 12.3 |

## Top queries

| Query | Impressions | Position | Notes |
|---|---|---|---|
| welltory | 2 | 4.5 | Brand-adjacent — we're surfacing on competitor queries. Good. |
| cortisol plus | 2 | 7.0 | Brand query — should be position 1 eventually |
| cortisol app | 2 | 21.5 | Category head term — long climb but the target |
| cortisol curve | 2 | 83.5 | Page exists but ranking deep |
| cortisol levels chart | 2 | 90.0 | Same |
| cortisol phase | 1 | 91.0 | — |
| cortisol/dhea ratio calculator | 1 | 60.0 | Niche, likely the calculator page |

## Top pages by impressions

| Page | Impressions | Clicks | Position |
|---|---|---|---|
| `/download/` | 35 | 2 | 8.1 |
| `/` | 42 | 1 | 7.5 |
| `/tools/` | 21 | 1 | 8.5 |
| `/cortisol/` | 14 | 0 | 33.6 |
| `/how-it-works/` | 14 | 0 | 8.0 |
| `/features/hrv-stress-monitoring/` | 10 | 0 | 7.1 |
| `/blog/` | 10 | 0 | 12.3 |
| `/blog/ashwagandha-vs-rhodiola-cortisol/` | 4 | 0 | 6.5 |

## What this tells us

- **8 pages indexed and receiving impressions.** The site is alive but quiet.
- **Long tail not yet indexed.** Most of the 6 seed blog posts and the auto-generated posts aren't showing up. They're either (a) indexed but not yet ranking for anything tracked, or (b) not yet indexed. Worth a `gsc inspect_url` pass on the top 10 most recent posts to confirm.
- **CTR (3.57%) is OK for the position.** No obvious title/description optimization win here yet.
- **The hub page (`/cortisol/`) is at position 33.6.** Whole point of the hub strategy was to rank for the head term — this is the page to push internal links toward.
- **The new "What is cortisol?" post we just shipped (2026-06-06) isn't here yet.** Expected — GSC has indexing lag of 3-7 days for new content.

## What GSC does NOT tell us

- **Referring domain count.** GSC's Links report exists in the UI but isn't exposed via the API we're using. Need an Ahrefs / SEMrush / Moz pull to get the real number.
- **Brand mentions without a link.** Need a tool like Mention or BrandMentions for this.
- **AI citation surface.** GSC doesn't track when ChatGPT / Perplexity / AI Overviews quote the site. Manual spot-check or a tool like Profound is the only way today.

## Next-snapshot date

**2026-07-06** — 30 days from now. End-of-month-1 of Phase 4.

The realistic deltas to expect by then (if we ship the directories batch, get one Reddit + one IH post live, and start Featured.com daily):

| Metric | Today | 30-day target |
|---|---|---|
| Clicks (28d) | 4 | 50–150 |
| Impressions (28d) | 112 | 1,500–3,000 |
| Indexed pages with impressions | 8 | 25–40 |
| Avg position | 12.3 | 11–13 (won't move much in 30d; impressions volume is the leading indicator) |
| Referring domains (Ahrefs) | unknown — need first pull | +10–15 |
