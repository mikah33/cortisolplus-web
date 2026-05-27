# Cortisol+ Backlink Playbook

Where we are in the backlink process and what to do next. Drop the
"Resume Prompt" block into a fresh Claude session whenever you want
to pick this up — it carries enough context to start work cold.

---

## 📋 Resume Prompt (paste this into Claude)

> I'm running backlink / distribution work for cortisolplus.com (iOS
> app: Cortisol+, stress-from-biometrics tracker, 200 users, 4.9★).
> The marketing site is at `/Users/mikahalbertson/cortisolplus-web`
> (Astro + Tailwind, Netlify). The plan lives at
> `docs/BACKLINK-PLAYBOOK.md`. I'm in **Phase 4 — Distribution** of
> the SEO roadmap. Foundation, hub pages, and the blog auto-publish
> pipeline are all shipped (Substack, n8n→GitHub, 207-topic queue,
> Search Console, Bing). Product Hunt + LinkedIn + AlternativeTo
> copy was drafted in prior sessions but never confirmed posted.
> Nothing else in this playbook has been started.
>
> Today I want to work on **[channel: Reddit / IH / BetaList / HN /
> directories / press / bloggers / HARO]**. Open
> `docs/BACKLINK-PLAYBOOK.md`, find that section, walk me through
> the next concrete action with paste-ready copy. Track what we
> ship in `docs/DISTRIBUTION-LOG.md` (create it if missing). Don't
> re-do anything already logged there.

---

## Where you are

| Phase | Status |
|---|---|
| 1 — Foundation | ✅ Done — Astro + Tailwind + Search Console + Bing + Substack + Migadu mail |
| 2 — Hub Pages | ✅ Done — core pages + calculator + 6 seed blog posts |
| 3 — Velocity | 🟡 In motion — n8n auto-blog running (~3 posts/wk, 207-topic queue) |
| **4 — Distribution** | **🟡 In progress** — most channels untouched |

You're effectively at the **start of Phase 4**. M3 KPI target was 25
referring domains — you likely have <10 right now (just the auto-
discovered links from Search Console + whatever Substack/PH pulls in).

---

## Channel-by-channel plan

Each channel below has: **goal**, **time cost**, **next action**,
**paste-ready copy**.

### 1. Reddit  — highest-leverage organic channel

**Goal:** 5 quality posts across 5 subs in 4 weeks. ~500 referring
clicks. 1-3 referring domains via Reddit's outbound links.

**Time cost:** 2 weeks of warm-up (10 min/day to comment / karma)
then 1 post/week.

**Next action:** Log into `u/cortisolplus` and spend 7 days
commenting in r/AppleWatch, r/Biohackers, r/Stress, r/HRV. No
self-promo — just genuine answers. Build karma to ~50 across those
subs before posting.

**Target subs (in order):**
1. **r/AppleWatch** (3.6M) — angle: "I built a cortisol tracker
   that uses HRV + sleep + RHR. Watch hits 4.9★ for stress tracking."
2. **r/HRV** (12K, highly targeted) — angle: "Sharing the model I
   built that turns HRV + RHR + sleep into a cortisol estimate."
3. **r/Biohackers** (140K) — angle: "Tracked cortisol biomarkers
   for 60 days. Here's the data + the (free) calculator."
4. **r/Stress** (50K) — angle: "What actually moves cortisol in
   normal people — 90 days of HRV data."
5. **r/QuantifiedSelf** (160K) — angle: "Project: estimating
   cortisol from Apple Watch signals. Methodology + open calculator."

**Post template (r/HRV — adapt for others):**

```
Title: I built a cortisol estimator from HRV + sleep + RHR — here's
the methodology

Body:
Been measuring my HRV obsessively for the last 18 months. Got
curious whether the signal lines up with what cortisol does. Spent
3 months building Cortisol+, an Apple Watch app that estimates a
cortisol "score" 0-100 from HRV (SDNN), resting HR, sleep stages,
respiratory rate, and wrist temp.

Methodology in short:
- Personal baseline learned over 7 days (everyone's different)
- 10 factors weighted by published HRV/cortisol correlations
- Sleep architecture penalty (poor REM/deep is a big signal)
- Time-of-day adjustment (cortisol awakening response is real)

Built a public calculator that doesn't need the app:
cortisolplus.com/calculator

App is free to download (the deeper insights are paid). 4.9★ from
~200 users so far.

Curious what holes you'd poke in this. The biggest open question:
how much does VO2max swing the daily signal independent of acute
stress? Findings appreciated.

[no app store link in the body — Reddit kills self-promo posts
with links. Put it in your u/ profile.]
```

**Rules:**
- Post Tuesday/Wednesday 8-10am Eastern (highest engagement)
- Include real methodology — sub-mods will smell marketing
- Reply to every comment for 24h after post
- Never link the App Store in the body. Only `cortisolplus.com/...`

---

### 2. Indie Hackers — micro-influencer leverage

**Goal:** 1 milestone post → 50-100 site clicks + soft credibility.

**Time cost:** 1 hour to write.

**Next action:** Post a "$X MRR" or "200 users in 60 days" milestone
on indiehackers.com/post.

**Template:**

```
Title: 200 users + 4.9★ on a side-project app — what worked in the
first 60 days

Body:
Hey IH — I run Cortisol+, an iOS app that estimates cortisol from
Apple Watch signals. We're 60 days in: 200 active users, 4.9★
average, 50 of those are weekly retained.

What worked (so others don't have to guess):

1. Free public calculator on the marketing site — 30% of installs
   come from people who used it once and wanted the daily version.
2. n8n + Claude auto-publishing 3 SEO blog posts/week. Indexed 40
   posts in 6 weeks. Took 5 hours to set up the pipeline.
3. Apple Watch complication on day 1. People who add the
   complication retain 4x.

What didn't:
- TikTok organic. Made 8 videos. 4 views combined. Skipping.
- Reddit organic before building karma. Got auto-flagged twice.

Site: cortisolplus.com
Substack: cortisolplus.substack.com

Happy to dive into any of these — especially the n8n pipeline. Will
hang in the comments for the day.
```

Tag with: ios, healthtech, side-project, seo, marketing.

---

### 3. BetaList — directory submission

**Goal:** 1 directory backlink + ~30-50 sign-ups in the launch week.

**Time cost:** 20 min to fill the form.

**Next action:** Submit at betalist.com/submit. Use this copy:

| Field | Copy |
|---|---|
| Startup name | Cortisol+ |
| Tagline (80 char) | The cortisol tracker your Apple Watch was missing |
| Description (500) | Cortisol+ estimates your stress hormone in real time from Apple Watch signals — HRV, sleep stages, resting heart rate, respiratory rate, wrist temperature, and more. No subscription required to see your score. Includes a free public calculator, breathing exercises, and the new Cortisol+ Walks feature that surfaces calming walking routes when your score trends elevated. |
| Website | https://cortisolplus.com |
| Founder Twitter | [your handle] |
| Image | Use the OG image at /og-default.png |
| Category | Health & Fitness |

**Timing:** Submit ~10 days before you want the feature to drop —
BetaList queues submissions.

---

### 4. Hacker News — Show HN

**Goal:** Top 30 on the homepage = 5,000+ visits + 5-15 referring
domains as people blog about it. Miss the front page = ~100 visits.

**Time cost:** 1 hour write, 1 day responding in comments.

**Next action:** Pick a Tuesday or Wednesday. Post 9-10am Eastern
from a 100+ karma account. Title is critical.

**Title (Show HN format, max 80 chars):**

```
Show HN: I built a cortisol estimator from Apple Watch HRV + sleep
```

**Body:**

```
Hey HN — Cortisol+ is an iOS + Apple Watch app I built to estimate
cortisol levels from biometric signals. It runs entirely on-device.

The math:
- Personal baseline learned from 7 days of HRV (SDNN), resting HR,
  respiratory rate, blood oxygen, wrist temp, and sleep stages
- 10 factors weighted by published HRV/cortisol correlation studies
  (citations on /how-it-works)
- Output: a 0-100 score that maps to Low / Normal / Elevated / High
- HealthKit integration; no health data leaves the device

Calculator is free + public: cortisolplus.com/calculator
App: free to download, premium gates the daily Insights tab.

The interesting bits for HN folks:
- Built a public Astro site with n8n + Claude generating 3 SEO
  posts/week into the repo (one-shot setup, 207-topic queue).
- Apple Watch tracks HRV recovery during walks in real-time;
  before/after cortisol delta is the "did the walk help" signal.
- Universal Links + a custom URL scheme for in-app event deep
  linking when Apple features us.

Open questions I'd love HN's input on:
1. Better citations for stress-cortisol correlations beyond the
   Kirschbaum / Hellhammer canon?
2. Is wrist temperature meaningful for daily cortisol on top of
   HRV, or am I overfitting?

Will be in the thread all day.
```

**Rules:** Reply to every comment within 30 min for the first 4 hours.
Don't argue — clarify and ask questions.

---

### 5. Software directories — submit-and-forget batch

**Goal:** 6-10 directory backlinks. Mostly nofollow but contribute
to referring-domain count.

**Time cost:** 2 hours total for the batch.

**Submission list (do all in one sitting):**

| Site | URL | Notes |
|---|---|---|
| AlternativeTo | alternativeto.net/software/new | Position as "free alternative to Welltory / Oura subscription" |
| Capterra | capterra.com/vendors/sign-up | Health-tech category |
| G2 | g2.com/sellers/new | Slow approval (~2 wks) |
| GetApp | getapp.com/vendors/sign-up | Cousin of Capterra, same data |
| SaaSHub | saashub.com/submit-a-product | Fast approval, decent traffic |
| AppGrooves | appgrooves.com/contact | iOS-specific |
| Slant | slant.co/topics/new | Niche but DR 70+ |
| Toolify | toolify.ai/submit-tool | AI-adjacent, free signup |
| StartupBase | startupbase.io/submit | Free for indie launches |
| Awesome iOS Apps lists on GitHub | search GH for "awesome-ios-apps" | Submit PRs to add Cortisol+ |

Use the same description as BetaList. Vary the lead sentence to
avoid duplicate-content flags.

---

### 6. Press pitches — Fortune Well / Vogue Wellness / Well+Good / etc.

**Goal:** 1 press hit = DR 80+ backlink = transformational. Realistic
hit rate: 1 in 20 pitches.

**Time cost:** 4-6 hours to research contacts + draft pitches.

**Next action:** Build a target list of 20 wellness writers. Each
gets a custom 4-sentence pitch.

**Target writer list (start here, expand on Twitter):**

| Outlet | Beat | Where to find |
|---|---|---|
| Fortune Well | Stress / wellness tech | bylines on fortune.com/well |
| Well+Good | Wellness apps / biohacking | wellandgood.com author pages |
| Vogue (Wellness) | Stress / longevity | vogue.com/article search |
| Bustle Health | Apps / women's health | bustle.com/health |
| Healthline | HRV / cortisol | healthline.com authors |
| Refinery29 Health | Stress / millennial health | refinery29.com |
| Wired (Gear) | Apple Watch reviews | wired.com/tag/apple-watch |
| The Verge (Health) | Wearables | theverge.com/health |
| Outside Online | Wearables / HRV | outsideonline.com |
| Men's Health | HRV / recovery | menshealth.com/health |

**Pitch template (4 sentences, NO attachments):**

```
Subject: 200 people use my app to estimate cortisol from their
Apple Watch — happy to share the data?

Hi [first name],

Saw your recent piece on [specific article] — really liked the
angle on [specific detail you actually read]. I'm Mikah, the
founder of Cortisol+, an iOS app that estimates a daily cortisol
score from Apple Watch signals (HRV, sleep, RHR, wrist temp). 200
users, 4.9★, and I've got 60 days of anonymized data on what
actually moves cortisol in normal people — the patterns are wild
(sleep architecture beats workouts; lunch timing beats coffee
timing; wrist temp predicts the next morning's score by 60%).

Would something here be useful for a story? I can share the full
dataset (no PII), the methodology with citations, or sit for a
quick interview. Free public calculator if you want to poke at the
math first: cortisolplus.com/calculator.

Cheers,
Mikah
```

**Rules:**
- Personalize the first sentence with something they actually wrote
  in the last 30 days. Generic = trash bin.
- One follow-up at day 7. Then drop it.
- Send Tue-Thu, 8-10am their timezone.
- Track in `docs/DISTRIBUTION-LOG.md` to avoid re-pitching.

---

### 7. Blogger outreach — 20 sites offering calculator data

**Goal:** 5 blog mentions out of 20 outreach = 5 referring domains.

**Time cost:** 4 hours research + 2 hours pitching.

**Next action:** Build a list of 20 wellness/biohacking blogs with
DR 30-60 (smaller blogs reply more reliably than big press).

**Where to find them:**
- Google "best HRV apps 2026" → click results to source authors
- ahrefs.com/site-explorer competitor "ouraring.com" → backlinks
  filter: Type = Article — gives you every blogger covering Oura
- Search Twitter for "HRV" + "blog" — biohacker personalities
- Newsletter writers (Substack search "cortisol", "biohacking")

**Pitch template (use the same one as press, modify last paragraph):**

Same email body as Section 6 above but the final paragraph becomes:

```
I noticed your post on [their specific cortisol / HRV / wearable
article] — happy to send you the calculator widget you can embed
on your site (no app required, takes 30 seconds), or write a
guest post on the methodology. Either works. Just want the math
in front of the right people.
```

Track in `docs/DISTRIBUTION-LOG.md`.

---

### 8. HARO / Featured.com — passive backlinks at scale

**Goal:** 2-4 quote placements/month = 2-4 high-DR backlinks for ~5
min of writing per response.

**Time cost:** 15 min/day for ~15 days = first placement.

**Next action:**

1. **Sign up at featured.com** (formerly HARO acquired by Featured).
   Free tier. Add Cortisol+, set expertise to "stress, cortisol,
   HRV, Apple Watch, biohacking, sleep."
2. **Also sign up at qwoted.com** — same model, fewer respondents
   per query.
3. **Daily routine:** open the email every morning, scan for queries
   matching your beats, respond to 1-2 with a 150-word quote signed
   "Mikah Albertson, Founder of Cortisol+, cortisolplus.com".

**Response template (paste, adapt the answer):**

```
Hi [reporter],

Mikah Albertson here, founder of Cortisol+ — an iOS app that
estimates cortisol from Apple Watch biometrics (HRV, sleep, RHR,
wrist temp). 200 users, 4.9★. Quote attached for your piece on
[topic]:

"[150 words of actual answer — specific, data-backed, no marketing
language. Use a number if you have one.]"

Happy to expand or to share the underlying dataset (60 days of
anonymized HRV-cortisol correlation data from 200 users) if it's
useful.

Site: cortisolplus.com
Bio: [1 sentence — Apple Watch dev, built Cortisol+ to estimate
stress hormone from wearables]
Photo: [link to your headshot]

— Mikah
```

**Rules:**
- Respond within 4 hours — reporters pick the first decent quote.
- Always include a number or a specific data point.
- Never include "we offer" or "our product" — instant disqualifier.
- Reporters MUST link your site for the quote to count. Ask
  directly: "Please credit as 'Mikah Albertson, Founder, Cortisol+
  (cortisolplus.com)'."

---

## Tracking — `docs/DISTRIBUTION-LOG.md`

I'll create this file the next time we ship something so we stop
losing track. Columns:

```
| Date | Channel | What | URL | Status | Referring DR | Clicks |
```

Update on every submit/post/reply.

---

## Realistic 30-day plan if you started today

| Week | Focus | Expected referring domains |
|---|---|---|
| Week 1 | Reddit karma warm-up + Section 5 directories batch (one sitting) | +4 (directories) |
| Week 2 | First Reddit post (r/HRV → highest signal) + IH milestone post + BetaList submit | +2 |
| Week 3 | Show HN attempt + 10 press pitches sent + Featured.com daily routine | +1-3 (HN if it lands) |
| Week 4 | 2nd Reddit post (r/AppleWatch) + 10 blogger pitches + press follow-ups | +2-4 |

**Realistic end-of-month referring domains:** 10-15 new. That puts you at the M3 KPI target of 25 if you started near 10.

---

## What I'd ship next if I were you (priority order)

1. **Sign up for Featured.com today** — 5 min, returns dividends for months
2. **Submit the directories batch** (Section 5) — 2 hours, 6-10 backlinks
3. **Start Reddit karma warm-up** — 10 min/day, compounds
4. **Submit BetaList** — 20 min, schedule it now
5. **Then move to press pitches** — highest variance, save for when the above is humming
