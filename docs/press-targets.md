# Press / blogger target list — research framework

10 outlets × custom pitches. Most failures come from generic pitches —
**personalize the first sentence with something they actually wrote in
the last 30 days.** Generic = trash bin.

**Outreach cadence:** Send Tue-Thu, 8-10am their timezone. One follow-up
at day 7. Then drop it.

**Email template** lives in `BACKLINK-PLAYBOOK.md` section 6. Don't
re-invent it — adapt the first paragraph per writer.

---

## How to find each writer's email (in priority order)

1. **Their website / author bio page** — many have it listed
2. **Twitter/X DM** — often easier than email for wellness writers
3. **`firstname@outlet.com`** — works for Wired, The Verge, Bustle, Refinery29
4. **`firstname.lastname@outlet.com`** — works for Vogue, Fortune, Healthline
5. **Hunter.io / Apollo.io free tier** — last resort
6. **LinkedIn InMail** — often the only path for senior writers

---

## Target list

Fill the "Last article" column with the most recent thing they wrote
on cortisol / stress / wearables / HRV (search `site:outlet.com author-name cortisol` or similar). The personalization sentence references this article.

| # | Outlet | DR (est.) | Writer (start here) | Beat | Last cortisol/stress article | Email guess | Status |
|---|---|---|---|---|---|---|---|
| 1 | Fortune Well | 90 | (search bylines on fortune.com/well) | Stress / wellness tech | TBD | first.last@fortune.com | not contacted |
| 2 | Well+Good | 80 | (author pages on wellandgood.com) | Wellness apps / biohacking | TBD | first@wellandgood.com | not contacted |
| 3 | Vogue (Wellness) | 92 | (vogue.com search) | Stress / longevity | TBD | first.last@condenast.com | not contacted |
| 4 | Bustle Health | 78 | (bustle.com/health) | Apps / women's health | TBD | first@bustle.com | not contacted |
| 5 | Healthline | 91 | (healthline.com authors) | HRV / cortisol | TBD | first.last@healthline.com | not contacted |
| 6 | Refinery29 Health | 77 | (refinery29.com) | Stress / millennial health | TBD | first@refinery29.com | not contacted |
| 7 | Wired (Gear) | 93 | (wired.com/tag/apple-watch) | Apple Watch reviews | TBD | first@wired.com | not contacted |
| 8 | The Verge (Health) | 94 | (theverge.com/health) | Wearables | TBD | first@theverge.com | not contacted |
| 9 | Outside Online | 80 | (outsideonline.com) | Wearables / HRV | TBD | first@outsideonline.com | not contacted |
| 10 | Men's Health | 81 | (menshealth.com/health) | HRV / recovery | TBD | first@menshealth.com | not contacted |

**Realistic hit rate:** 1 in 20 generic pitches, 1 in 8 personalized.
Personalize.

---

## Pitch template (reused from BACKLINK-PLAYBOOK.md)

```
Subject: 200 people use my app to estimate cortisol from their
Apple Watch — happy to share the data?

Hi [first name],

Saw your recent piece on [SPECIFIC ARTICLE TITLE] — really liked the
angle on [SPECIFIC DETAIL YOU ACTUALLY READ]. I'm Mikah, the founder
of Cortisol+, an iOS app that estimates a daily cortisol score from
Apple Watch signals (HRV, sleep, RHR, wrist temp). 200 users, 4.9★,
and I've got 60 days of anonymized data on what actually moves
cortisol in normal people — the patterns are wild (sleep architecture
beats workouts; lunch timing beats coffee timing; wrist temp predicts
the next morning's score by 60%).

Would something here be useful for a story? I can share the full
dataset (no PII), the methodology with citations, or sit for a
quick interview. Free public calculator if you want to poke at the
math first: cortisolplus.com/tools/cortisol-calculator.

Cheers,
Mikah
```

---

## Stronger angles by outlet type

**Fortune Well / Wired / The Verge** — lead with the data and methodology.
These outlets want a story their readers haven't seen.

> "60 days of HRV + cortisol data from 200 users shows sleep architecture
> moves the signal more than workouts. Happy to share the dataset."

**Vogue / Well+Good / Bustle / Refinery29** — lead with a relatable
specific insight.

> "Wrist temperature predicts the next morning's stress score with 60%
> accuracy. Most of the women I've interviewed have never heard this."

**Healthline / Men's Health** — lead with the explainer they'd publish
anyway and your data backing it.

> "I built an app that estimates cortisol from Apple Watch signals.
> 200 users in. Happy to be the founder source for an explainer on how
> cortisol shows up in wearable data — with citations and a dataset."

**Outside Online** — lead with HRV-recovery angle.

> "Athletes recover by HRV but most don't realize cortisol is the
> upstream driver. I built a tool that shows the link. Happy to talk
> through what we've seen in the trail-runner segment."

---

## Blogger outreach (lower bar, higher hit rate)

Same template. Find 20 DR 30–60 wellness/biohacking bloggers via:

- `Google "best HRV apps 2026"` → click results, source authors
- Ahrefs site explorer competitor `ouraring.com` → Backlinks filter:
  Type = Article. Every blogger who covered Oura is a target.
- Twitter search `HRV + blog`
- Substack search: `cortisol`, `biohacking`, `HRV`

For bloggers, swap the final paragraph for:

```
I noticed your post on [their specific cortisol / HRV / wearable
article] — happy to send you the calculator widget you can embed
on your site (no app required, takes 30 seconds), or write a
guest post on the methodology. Either works. Just want the math
in front of the right people.
```

---

## Tracking

Every outreach goes in `docs/DISTRIBUTION-LOG.md`:

```
| 2026-XX-XX | Press | Pitch sent to Fortune Well — [writer name] | mailto:... | submitted | TBD | 0 |
```

When something publishes:

```
| 2026-XX-XX | Press | Fortune Well piece live | https://fortune.com/well/... | live | 90 | 0 |
```
