# Indie Hackers milestone post — locked draft

**Status:** Locked. Post any time — no warm-up required for IH.

**Where:** https://www.indiehackers.com/post

---

## Title

```
200 users + 4.9★ on a side-project iOS app — what worked in the first 60 days
```

## Body (Markdown supported on IH)

```
Hey IH — I run Cortisol+, an iOS + Apple Watch app that estimates
cortisol from biometric signals. We're 60 days in: 200 active users,
4.9★ from 16 ratings, ~50 weekly retained.

**What worked** (so others don't have to guess):

1. **Free public calculator on the marketing site.** About 30% of
   App Store installs come from people who used the calculator at
   cortisolplus.com/tools/cortisol-calculator once and wanted the
   daily version. Zero-friction lead magnet that doesn't feel like
   one because the calculator is genuinely useful on its own.

2. **n8n + Claude auto-publishing ~3 SEO posts/week into the repo.**
   Indexed about 8 pages in 6 weeks (small, but the curve is up and
   the auto-blog is unattended). Took ~5 hours to set up the pipeline.
   Topic queue is 207 items deep, generated from a competitor gap
   analysis.

3. **Apple Watch complication on day 1.** Users who added the
   complication retained at roughly 4x the rate of those who didn't.
   Made it the second-screen of onboarding.

4. **A single, opinionated number.** 0-100 cortisol score on the
   home tab. Everything else is one tap away. The "1 number per
   day" framing beat every dashboard variant we A/B'd.

**What didn't:**

- **TikTok organic.** Made 8 videos in the first month. Combined
  views: under 5K. Skipped the channel entirely.
- **Reddit before building karma.** Two early posts got auto-flagged
  by spam filters. Now doing a 2-week karma warm-up before the next
  attempt.
- **Long-form onboarding.** Initial flow had 6 screens. Cutting to
  3 lifted activation 22%.

**Stack:**
- iOS app: SwiftUI + HealthKit
- Marketing site: Astro + Tailwind, deployed on Netlify
- Auto-blog: n8n → Claude API → GitHub commit
- Email: Migadu + Substack newsletter (The Cortisol Brief)
- Analytics: GSC, Plausible, App Store Connect

Site: cortisolplus.com
Substack: cortisolplus.substack.com

Happy to dig into any of these in the comments — especially the
n8n auto-blog pipeline, which a few people have asked me about.
Will hang here for the rest of the day.
```

---

## Tags

```
ios, healthtech, side-project, seo, marketing, milestone
```

## Where to post

- **Group:** Building in Public
- **Type:** Milestone

## Rules

- IH is comment-first. Reply to every comment within 2 hours of posting.
- Don't soft-pitch in replies. People will ask "how do I get the app" — answer with the App Store link.
- Drop the `n8n + Claude` thread teaser if comments slow down — that detail consistently re-spikes engagement.

## Pre-flight checklist

- [ ] Account is set up with a real-photo avatar and bio mentioning Cortisol+
- [ ] You've cleared 2 hrs after posting for comments
- [ ] The `/tools/cortisol-calculator` page works (people will click)
- [ ] Substack subscribe link works

## Log when posted

In `docs/DISTRIBUTION-LOG.md`:

```
| 2026-XX-XX | Indie Hackers | Milestone post live | https://www.indiehackers.com/post/XXXX | live | 78 | 0 |
```
