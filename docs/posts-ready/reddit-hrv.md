# Reddit r/HRV — first post locked draft

**Status:** Locked. Awaiting ~50 karma in r/HRV (Day 7-10 of warm-up).

**Post on:** Tuesday or Wednesday, 8:00–10:00 AM Eastern.

**Where:** https://www.reddit.com/r/HRV/submit

---

## Title (300 char max, aim for under 100)

**Recommended (less marketing-coded):**
```
Spent 3 months trying to estimate cortisol from HRV. Here's what landed.
```

**Alternative (more methodology-coded):**
```
I built a cortisol estimator from HRV + sleep + RHR — here's the methodology
```

Use the first. The "I built" prefix triggers mods' marketing sniff test in /r/HRV.

## Body

```
Been measuring my HRV obsessively for the last 18 months. Got
curious whether the signal lines up with what cortisol actually
does. Spent 3 months building a model that estimates a daily
cortisol "score" (0-100) from HRV (SDNN), resting HR, sleep stages,
respiratory rate, and wrist temperature.

Methodology in short:
- Personal baseline learned over 7 days (everyone's HRV range is different)
- 10 factors weighted by published HRV/cortisol correlations
- Sleep architecture penalty (poor REM/deep is a big signal)
- Time-of-day adjustment (cortisol awakening response is real)

Built a public calculator that doesn't need an app:
cortisolplus.com/tools/cortisol-calculator

Two things I can't resolve and would love this sub's take on:

1. Does wrist temperature add real signal on top of HRV, or am I
   overfitting? My data suggests temp predicts next-morning HRV by
   ~60% but I can't tell if that's circular.
2. Is the cortisol awakening response actually stable enough day-to-day
   to anchor a daily score? Has anyone seen good intra-subject CAR
   variability data?

App is free to download (premium gates the daily Insights tab). 4.9★
from ~16 ratings so far.

Curious what holes you'd poke in this. Methodology critiques very
welcome — that's why I'm here.
```

---

## CRITICAL rules

- **NO App Store link in the body.** Reddit auto-flags self-promo posts. The "cortisolplus.com" link is fine (it goes to a free calculator, not a paywall).
- **Reply to every comment for 24h.** Drops in karma if you ghost.
- **If a mod asks: yes, you're the founder.** Don't hide it. Hiding it gets you banned. Disclosure pre-emptively is even better — first comment from yourself: "Full disclosure: I built this. Happy to answer anything skeptically."
- **No cross-posting to r/AppleWatch the same day.** Wait 1+ week between sub posts or you get marked spammer.

## Warm-up requirement before posting

You need:
- ✅ Account ≥30 days old
- ✅ ≥50 comment karma total
- ✅ ≥10 karma earned specifically from comments in r/HRV
- ✅ At least 5 genuine comments in r/HRV in the 7 days prior

(See the BACKLINK-PLAYBOOK.md Reddit section for the warm-up routine.)

## Pre-flight checklist

- [ ] u/cortisolplus account meets the requirements above
- [ ] Tuesday or Wednesday
- [ ] 8:00–10:00 AM Eastern
- [ ] You've cleared 4 hrs after posting for comments
- [ ] `cortisolplus.com/tools/cortisol-calculator` works on mobile (most reddit traffic is mobile)
- [ ] Founder disclosure comment is queued (post it within 5 min of the main post going live)

## Founder disclosure comment (post 5 min after the main post)

```
Quick disclosure for the sub: I built the app linked in the body. Not
trying to hide it — happy to answer anything skeptically about the
methodology. Especially curious where this sub thinks the model is
oversimplified.
```

## Log when posted

In `docs/DISTRIBUTION-LOG.md`:

```
| 2026-XX-XX | Reddit r/HRV | First post live | https://reddit.com/r/HRV/comments/XXXX | live | — | 0 |
```
