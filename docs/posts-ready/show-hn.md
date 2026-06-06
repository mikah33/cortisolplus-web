# Show HN — locked draft

**Status:** Locked. Awaiting 100+ karma on the posting account.

**Post on:** Tuesday or Wednesday, 9:00–10:00 AM Eastern.

**Where:** https://news.ycombinator.com/submit

---

## Title (80 char max)

```
Show HN: I built a cortisol estimator from Apple Watch HRV + sleep
```

(63 chars. Under limit. Don't overthink. Tested format: `Show HN: I built X from Y`.)

## URL

```
https://cortisolplus.com
```

## Body (paste as text — HN renders Markdown-lite)

```
Hey HN — Cortisol+ is an iOS + Apple Watch app I built to estimate
cortisol levels from biometric signals. It runs entirely on-device.

The math:
- Personal baseline learned from 7 days of HRV (SDNN), resting HR,
  respiratory rate, blood oxygen, wrist temperature, and sleep stages
- 10 factors weighted by published HRV/cortisol correlation studies
  (citations on /how-it-works)
- Output: a 0-100 score that maps to Low / Normal / Elevated / High
- HealthKit integration; no health data leaves the device

Calculator is free + public: cortisolplus.com/tools/cortisol-calculator
App: free to download, premium gates the daily Insights tab.

The interesting bits for HN folks:
- Built a public Astro site with n8n + Claude generating ~3 SEO posts
  a week into the repo (one-shot setup, 207-topic queue).
- Apple Watch tracks HRV recovery during walks in real time;
  before/after cortisol delta is the "did the walk help" signal.
- Universal Links + a custom URL scheme for in-app event deep
  linking when Apple features us.

Open questions I'd love HN input on:
1. Better citations for stress-cortisol correlations beyond the
   Kirschbaum / Hellhammer canon?
2. Is wrist temperature meaningful for daily cortisol on top of
   HRV, or am I overfitting?

Will be in the thread all day.
```

---

## Rules

- Post from a 100+ karma account. Lower-karma Show HN posts are auto-buried.
- Reply to **every** comment within 30 min for the first 4 hours.
- Don't argue. Clarify. Ask follow-ups.
- If someone calls out a real flaw, say "you're right, working on it" — defensive replies sink posts faster than the flaw itself.
- After 24 hrs, stop replying. Move on.

## Pre-flight checklist

- [ ] Account has 100+ karma
- [ ] Tuesday or Wednesday
- [ ] 9:00–10:00 AM Eastern (HN's frontpage refresh window)
- [ ] You've cleared 4 hours after posting for comment replies
- [ ] `/how-it-works` page is up and citations are linked (verify before posting — HN audience will click)
- [ ] Free calculator at `/tools/cortisol-calculator` works without signup (verify mobile + desktop)
- [ ] Server can handle a frontpage spike (Netlify will, no action needed)

## Log when posted

In `docs/DISTRIBUTION-LOG.md`:

```
| 2026-XX-XX | Show HN | Posted | https://news.ycombinator.com/item?id=XXXX | live | 91 (HN) | 0 |
```
