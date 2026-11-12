# Accuracy pass (Nov 12, 2026)

The readable rewrite kept every original claim. This pass fixes the ones flagged as unsupported, outdated or contradicted by the site's own pages. Keep the new readable style (InShort, Zen moments, onboarding card) intact.

## Rules

1. **Unsupported number or claim with no source** → remove it, or soften to what is well established and already supported on the page ("may", "for some people", "studies are mixed"). Do not add new statistics. Only keep a number if one of the article's existing cited sources supports it (you may open that source with WebFetch to check).
2. **Contradicts a basic, well-established fact** → correct it. E.g. cortisol normally **peaks in the morning shortly after waking** and is **lowest around the middle of the night**; it doesn't "drop overnight after good sleep".
3. **Overclaims about Cortisol+** → Cortisol+ gives a **0–100 wellness score from wearable signals (HRV, sleep, resting heart rate and more); it does not measure or estimate cortisol levels or a cortisol pattern**. See `/how-it-works/`.
4. **Overclaims about quizzes/check-ins** → they help you reflect on habits; they don't estimate cortisol, risk or results.
5. **Testing advice** → don't tell readers to get a specific test (e.g. a "four-point saliva test"). Say a doctor can decide whether testing makes sense and which test, and link `/cortisol/test/`.
6. **"Adrenal fatigue" framing** (staged depletion, "low cortisol response" stages) → remove the staging. Adrenal fatigue is not a recognised medical diagnosis (Endocrine Society); keep it neutral.
7. **Outdated product facts** — use only these sourced facts:
   - **Apple Watch Readiness score** (watchOS 27, Apple Watch Series 12 and Ultra 4 only): 0–10, from activity, Sleep Score and overnight vitals; higher = more ready; Apple doesn't call it a stress score. Source: https://www.iclarified.com/102426/apple-watch-readiness-score-how-it-works-and-which-models-support-it
   - **Fitbit / Google Health:** the Fitbit app was renamed the Google Health app in 2026 and the Stress Management Score became **Resilience** (see `/fitbit/` and `/fitbit/stress-management-score/` in this repo for the exact wording and categories; match those pages).
   - Where a page says Apple Watch has no stress score, keep that true but add one line that Readiness exists on the newest models and isn't a stress score.
8. **Mechanism claims stated as fact** ("cortisol shrinks the hippocampus", "lowers serotonin", "stored as visceral fat") → soften to what research suggests, or remove if the article doesn't cite support.
9. Keep all caveats, sources, internal links, anchors, FAQ data (update FAQ answers to match any changed visible text). You **may** edit a frontmatter `description` only to remove an inaccurate claim; keep its search phrase. Set `updatedDate`/`updated` to 2026-11-12 if not already.
10. When unsure whether something is accurate, prefer removing it. Never invent a source.

## Flagged items by file

**Body symptoms**
- `cortisol-acne-breakouts.mdx`: "3-to-5-day delay between a stress spike and visible acne" (also in description and a Zen tip "look back 3 to 5 days"); "Cortisol stimulates sebaceous glands to pump out more sebum" (cited review is about CRH, not cortisol); "slow down skin cell turnover"; "increases appetite for sugary... spike insulin and worsen breakouts".
- `cortisol-bloating-gut.mdx`: "may improve slightly after a good night's sleep, when cortisol naturally drops" (wrong); "stomach produces less acid"; "can act like aldosterone" (only at very high levels); leaky-gut loop "signals your adrenal glands to keep producing cortisol, which continues weakening your gut barrier"; "Gas... often come with constipation rather than diarrhea"; "elevated stress hormones are likely playing a role" (overclaim); "Regular sleep schedules lower baseline cortisol".
- `cortisol-hair-loss-women.mdx`: "Decrease blood flow to the scalp"; perimenopause "affect how your body handles cortisol"; "dermatologists routinely ask... 2-4 months"; telogen effluvium presented as cortisol-caused ("Once cortisol levels normalize"); "consider getting your cortisol tested" (rule 5).

**Mind and energy**
- `cortisol-3am-wakeup.mdx`: "During the deepest sleep stages, cortisol production nearly stops"; timing of the low (midnight–4 AM) vs `cortisol-sleep-insomnia` ("midnight to 2 a.m."); make both say cortisol is lowest around the middle of the night and rises toward morning.
- `cortisol-anxiety-link.mdx`: "Even brief positive social interactions can lower cortisol levels" (unsourced); Kim 2018 HRV meta-analysis listed in References but never cited (cite it where HRV and stress are discussed, or remove from References).
- `cortisol-brain-fog.mdx`: "can actually shrink the hippocampus"; "cognitive testing often shows improvement over weeks to months".
- `cortisol-fatigue-tired.mdx`: "Stage 1/2/3... low cortisol response" (rule 6); "Salt and sugar cravings" as a symptom.
- `cortisol-mood-swings.mdx`: "shrinks the hippocampus... reduces serotonin and dopamine" stated as fact; "When researchers give people cortisol in studies, they become more reactive".
- `cortisol-sugar-cravings.mdx`: cortisol-driven insulin surge drops blood sugar too low; "Even one night of bad sleep increases cravings".
- `cortisol-weight-gain-midsection.mdx`: "researchers can often guess someone's stress hormone levels just by looking at where they carry weight"; alcohol "preferentially stored as visceral fat"; "fat distribution often shifts on its own".
- `cortisol-sleep-insomnia.mdx`: "Blue light... disrupt the cortisol-melatonin balance" (soften: light at night can delay sleep).

**Basics and trends**
- `what-is-cortisol.mdx`: "One extra hour of sleep changes cortisol more than any supplement"; "Magnesium glycinate and ashwagandha: the two supplements with the strongest published cortisol evidence" (Boyle 2017 is limited); "slow breathing... lowers cortisol within minutes"; morning sunlight "Ten minutes is enough"; "The morning cortisol pulse is what really wakes you up, not coffee".
- `cortisol-spike-causes.mdx`: caffeine "especially in the afternoon or evening" (Lovallo 2005 doesn't show time of day); chronic pain "higher normal levels"; dehydration "nudge cortisol up".
- `cortisol-spike-meaning.mdx`: "very low-carb diets may raise cortisol more than balanced meals".
- `cortisol-reset-overnight.mdx`: unnamed "One study... Another found..."; week-by-week timeline stated too certainly.
- `cortisol-detox-7-day-plan.mdx`: "measurably shift your stress hormone patterns" in seven days; "Seven days is enough to see early changes"; vitamin C "may support adrenal function"; breathing "proven to work".
- `cortisol-mocktail-recipe.mdx`: magnesium glycinate "a real, peer-reviewed cortisol mechanism" and "Adding 200 to 400 mg is what makes this drink genuinely useful" (overclaim; also don't present a dose as a recommendation); calculator "can help you look at your risk factors and symptoms" (rule 4).
- `adrenal-cocktail-effect.mdx`: Endocrine Society statement uncited (add a citation if you can verify one on endocrine.org, otherwise attribute generally without quoting).
- `low-cortisol-elite-meme.mdx`: Navy SEALs and athlete research claims uncited; "four-point saliva cortisol test" advice and calculator "understand results" (rules 4–5).
- `tiktok-cortisol-myths.mdx`: "how stressed you feel and your measured cortisol often don't line up" (unsourced); "objective tracking matters more than guesswork" (could imply a wearable tracks cortisol; rule 3); coffee "overall effect might even be positive" (speculative).

**Supplements and HRV**
- `good-hrv-for-your-age.mdx`: age ranges (e.g. "55-105 ms" for 20-25) attributed only to "studies of healthy adults" with no citation. The site's `/hrv/normal-range/` has a sourced HRV-by-age table (Voss et al. 2015): either use those values with that citation or remove the uncited ranges and link to `/hrv/normal-range/`. Also: "Getting sick tanks your HRV, even before you feel symptoms"; "Unusually high readings... overtraining or illness"; "drops 20% or more below your baseline for several days" threshold; "Poor sleep crushes HRV".
- `increase-hrv-fast.mdx`: all unsourced effect sizes ("10-30%", "5-20% over 8-12 weeks", "10-15% over 4-8 weeks", "5-10%" meditation, weight loss "5-15%", fish oil "3-8%", sauna "5-10%", "Cool (65-68°F)... boost HRV", "2+ drinks"). Remove the percentages (keep the direction and the ranking only where supported); keep any that an existing cited source on the page supports.
- `what-low-hrv-means.mdx`: "Low HRV... often tracks with elevated cortisol" / "often appears alongside other signs of high cortisol" + symptom list (rule 3/8; HRV can't establish cortisol); "Athletes who ignore low HRV trends often end up injured or burned out"; description mentions "cortisol patterns" (rule 9).

**Wearables, Fitbit and guides**
- `apple-watch-stress-score.mdx`: add Readiness (rule 7); "Blood oxygen (on Series 6 and newer)" (add "where available; availability varies by country"); "Research shows they're close to chest-strap monitors" unsourced.
- `fitbit-vs-apple-watch-stress.mdx`: "A 2017 review found…", "A 2020 study found…" unsourced; "within about 5 to 10%"; "EDA sensor is unique among mainstream wearables"; "Fitbit models usually last 5 to 7 days"; outdated "Stress Management Score (0–100)" → Resilience (rule 7); "No built-in stress score in the Apple Health app" + Readiness.
- `garmin-vs-fitbit-stress.mdx`: Fitbit SMS "1 to 100" as current → Resilience; "a proven marker of heart fitness and stress resilience".
- `fitbit-daily-readiness-explained.mdx`: "shows up each morning on your Fitbit device" (it's in the app); inputs listed as HRV, sleep and activity vs `/fitbit/`'s HRV, resting heart rate and sleep (match `/fitbit/`); "30-day baseline", deep/REM raises score, sleep regularity and Active Zone Minutes as inputs — unsourced, remove.
- `fitbit-sense-cortisol.mdx`: "this score might line up with your cortisol patterns".
- `src/pages/fitbit/cortisol.astro`, `hrv.astro`, `index.astro`: "Cortisol+ … estimates your cortisol pattern", "estimate cortisol trends", "bringing its cortisol-pattern estimation to Fitbit data" (rule 3). `hrv.astro`: "Hydration and consistent meal timing" raise HRV and "~6 breaths per minute raises vagal tone" unsourced. Premium wording differs between `/fitbit/` FAQ and `stress-management-score` page: make them consistent with `/fitbit/`.
- `src/pages/stress/apple-watch.astro`: "Does Apple Watch have a stress score?" answer never says yes/no: answer plainly ("No built-in stress score. The newest models have a Readiness score, which isn't a stress score…"), in both visible text and FAQ. Keep everything else.
- `src/pages/features/hrv-stress-monitoring.astro`: "baseline uses up to 30 days of stored readings": check against `/how-it-works/` (30-day history, blending after 10 readings, fully personal at 28) and make consistent.
- `src/pages/features/breathing-zen-mode.astro`: leave the "4-4-4 box breathing" label note as is (it's an accurate description of the app as reviewed).
- `welltory-vs-cortisol-plus.mdx`: "Cortisol+'s core scoring runs on your device. Optional connected services, account and coaching features handle data separately." Check against `/privacy/` and keep only what the privacy page supports.
