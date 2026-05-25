<!-- Cortisol+ blog automation — operator handbook -->

# Cortisol+ blog automation

Automated AI blog publishing pipeline for cortisolplus.com. Generates and publishes
~3 cortisol-focused blog posts per week (Mon/Wed/Fri 9 AM) from a curated topic
queue, using Anthropic Claude for content generation and GitHub for the commit
that triggers Netlify to rebuild and ship.

---

## What's in this folder

| File | Purpose |
|---|---|
| **`topic-queue.json`** | The full queue of cortisol topics to write. 207 entries across 13 categories. |
| **`workflow.json`** | n8n workflow template (placeholder API keys — replace after import). |
| **`check-progress.mjs`** | Local script to see what's been published vs what's still queued. |
| **`n8n-substack-only.json`** | Optional: RSS → email-self-for-Substack-paste workflow. |
| **`n8n-multi-platform-syndication.json`** | Optional: RSS → Medium / LinkedIn auto-syndication. |

---

## How it works (the auto-publish pipeline)

```
[ Mon/Wed/Fri @ 9 AM ]
        │
        ▼
[ Fetch automation/topic-queue.json from GitHub ]
        │
        ▼
[ Pick the next un-published topic (tracked in n8n static data) ]
        │
        ▼
[ Call Claude with a strict cortisol-brand-voice prompt ]
        │
        ▼
[ Validate output: frontmatter present, ≥3000 chars, keyword present,
  medical disclaimer present, structure intact ]
        │
        ▼
[ PUT src/content/blog/{slug}.mdx → GitHub API ]
        │
        ▼
[ Netlify auto-rebuild → post live in ~60 sec ]
```

No email approval. No human in the loop. Posts go live immediately with
`draft: false` in the frontmatter.

---

## Setup (one-time, ~5 min)

1. Open `~/Downloads/cortisolplus-ai-blog-pipeline.json` (keys already embedded)
2. n8n → **Workflows → Import from File** → select that JSON
3. Toggle the workflow to **Active**

That's it. First post fires on the next Mon/Wed/Fri at 9 AM local.

---

## Monitor progress

Run from the repo root:

```sh
node automation/check-progress.mjs
```

Output:
- Total topics in queue
- How many have been published
- Per-category breakdown with a progress bar
- The next 6 topics queued up
- Estimated date when the queue runs dry (at 3 posts/week)

Re-run anytime to see where you are.

---

## Topic categories

| Category | Topics | Coverage |
|---|---|---|
| `trending` | Viral TikTok terms (cortisol face, mocktail, detox, spike) |
| `symptom` | Symptoms by body part / system (hair, skin, gut, mood, sleep) |
| `demographic` | Age, gender, occupation cohorts (women 30s, athletes, shift workers) |
| `condition` | Medical conditions (Cushing's, PCOS, burnout, PTSD) |
| `supplement` | Per-supplement dose / form / comparison content |
| `food` | Foods + drinks (coffee, alcohol, dark chocolate, salt) |
| `practice` | Breathing, exercise, cold/sauna, meditation, social |
| `circadian` | Time-of-day patterns (morning spike, evening, weekend) |
| `test` | Saliva, blood, urine, hair cortisol testing |
| `wearable` | Apple Watch, Oura, Whoop, Garmin, Fitbit |
| `hardware` | Cortisol monitors, biosensors, test kits, lab services |
| `hrv` | HRV + biomarker explainers |
| `long-tail` | High-intent question queries |

---

## Adding more topics

Just edit `topic-queue.json`. The workflow pulls fresh from the GitHub raw URL
on every run.

Topic shape:

```json
{
  "category": "supplement",
  "slug": "ashwagandha-and-coffee",
  "title": "Can you take ashwagandha and coffee together?",
  "primaryKeyword": "ashwagandha and coffee",
  "angle": "Common question",
  "internalLinks": ["/cortisol/foods/ashwagandha", "/cortisol/lower/foods"]
}
```

Required fields:
- `slug` — URL slug (becomes `src/content/blog/{slug}.mdx`)
- `title` — Used in title + first paragraph
- `primaryKeyword` — Must appear in title and first 100 words
- `angle` — One-line creative direction for Claude
- `internalLinks` — 2–3 site URLs Claude should weave in

Optional:
- `category` — For organization (no functional impact)

---

## Monitoring quality (recommended weekly)

Even with auto-publish, spot-check the live site every 5–7 days:

1. Open https://cortisolplus.com/blog
2. Skim the new posts
3. Watch for:
   - Hallucinated study citations (any "Smith et al. 2024" you don't recognize)
   - Wrong dosage numbers
   - Off-brand tone
   - Generic AI-spam structure
   - Citations to studies that don't match the claim

Delete any bad ones via GitHub:
1. Open `src/content/blog/{slug}.mdx` on GitHub
2. Click trash icon → delete
3. Commit
4. Netlify rebuilds, post disappears

The workflow already advanced past that slug so it won't retry it.

---

## Cost & rate

- **Cadence**: 3 posts/week = ~156 posts/year
- **Anthropic cost**: ~$0.05 per post → ~$0.60/month total
- **Queue lifespan**: ~14 months at this rate

If posts start ranking, increase to 5/week by editing the cron:
`0 9 * * 1,2,3,4,5` (weekdays only). Don't go above 1/day — Google's algorithms
flag suspicious publishing velocity for health (YMYL) sites.

---

## Safety net — kill switch

If anything looks bad, deactivate the workflow in n8n:

1. n8n → Workflows → Cortisol+ AI auto-publish
2. Toggle to **Inactive** (top right)
3. Existing posts stay; no new ones generate

Re-activate anytime when you're comfortable.

---

## Risks (re-iterated)

- **YMYL Google penalty risk**: Google's Helpful Content Update targets AI-spam
  health content. Spot-check weekly. Delete garbage immediately.
- **Hallucinated citations**: Claude is told NOT to invent studies but may
  occasionally do so. Treat any specific author+year citation as suspect until
  verified.
- **Brand voice drift**: Over 100+ posts, the model's interpretation of "evidence-
  first, no fluff" may shift. Re-read prompts every 3 months.
- **One leaked key = full repo write**: The GitHub PAT in the workflow has
  Contents read+write on this repo. If compromised, attacker could push anything.
  Rotate the PAT every 90 days.

---

## Related automations (optional, in this folder)

- **`n8n-substack-only.json`** — Emails you when a new post drops with a
  formatted HTML blob ready to paste into Substack (Substack has no public API).
- **`n8n-multi-platform-syndication.json`** — Auto-creates Medium drafts and
  LinkedIn link shares whenever new content publishes. Needs Medium + LinkedIn
  API tokens.

Each is a separate n8n workflow import. Mix and match.
