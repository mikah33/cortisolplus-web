# Remaining work and prepared briefs

## Medical backlog: editorial review before publication

All eleven drafts received individual editorial revisions on September 9, 2026. Unsupported mechanisms, diagnosis by symptom, dosing schedules and app outcome promises were removed; current source links were added and tool CTAs disabled. See `medical-editorial-review-2026-09-09.json` for the article-by-article record. They remain drafts; a qualified clinical review has not occurred. Do not invent a reviewer or medical-review schema.

| Draft slug | Required review focus |
|---|---|
| cortisol-blood-pressure | Distinguish everyday stress, hypertension and endocrine causes; no diagnosis from a watch score |
| cortisol-hot-flashes | Multiple causes and menopause context; avoid presenting cortisol as an established single cause |
| cortisol-immune-suppression | Separate glucocorticoid treatment, endocrine disease and observational stress research |
| cortisol-jaw-clenching | Bruxism has multiple causes; no unsupported hormone mechanism or treatment promise |
| cortisol-libido-drop | Multifactorial symptom, medication context and appropriate evaluation |
| cortisol-night-sweats | Differential causes and when clinical assessment is appropriate; no hormone inference from sleep tracking |
| cortisol-puffy-face-morning | Ordinary swelling versus clinical signs; avoid social-media diagnosis |
| cortisol-skin-thinning | Medication/endocrine context and nonspecific symptoms; no reversal timeline |
| cortisol-stretch-marks | Common causes versus signs warranting assessment; no image/self-quiz diagnosis |
| high-cortisol-symptoms-men | Remove unsupported sex-specific generalizations and invented thresholds |
| high-cortisol-symptoms-women | Source endocrine and reproductive claims; avoid nonspecific symptom checklists as diagnosis |

For each: record source URLs and which claims they support, reconcile app limitations, correct headline/description/body together, confirm useful unique content, set a real revision date, run `npm test` and `npm run build`, then publish intentionally by removing `draft: true`. Do not add medical-review schema for an editorial-only source check.

The already-published levels, exercise, ashwagandha, methodology, HRV, sleep, breathing and comparison pages have received source/code-based revisions. An authentic clinical/scientific review is still outstanding.

## Live systems

1. **n8n:** the live workflow is replaced and published; execution 4376 and GitHub run 34394381074 succeeded and produced draft PR #21. Its separate PR check also passed after approval of that individual run. The HRV article's publication edit includes checked Apple documentation and removes unsupported sampling claims; see the release record and PR #21 for publication status. Inspect the next scheduled execution. Future bot-created PR checks may require owner approval. See `automation/README.md` for the exact live version and evidence. The active queue now has four focused briefs; the legacy 216-topic backlog is not consumed.
2. **Cloud Google report:** the patch is merged in [app PR #1](https://github.com/mikah33/cortisolplus/pull/1), with two passing tests. It uses the verified URL-prefix property, final web data and a three-day lag, and throws on failures instead of returning success. After the admin account refresh, scoped deployment of `weeklySeoReport` to `cortisol-plus` / `us-central1` succeeded on September 9. The next scheduled execution has not yet been observed. The existing Sunday 8 PM America/New_York schedule owns any Discord posting; no manual report was invoked.
3. **Search discovery:** Google accepted the indexing request for `/blog/apple-watch-hrv-not-updating/` on September 9 and added it to its priority crawl queue. It was not indexed at inspection time. Existing sitemap/home/Watch/methodology/journal submissions are recorded in the original audit. Record accepted/rejected/quota outcomes. Requests are not inclusion guarantees.
4. **GA4:** actual consented website click ingestion verified September 9: the Realtime report showed the download page view and `app_store_click` key event (count 1) after a labeled QA click. Create useful landing/source comparisons after real data exists. `app_store_click` is already registered as a key event with no monetary default. Keep synthetic QA traffic identified by `website-qa`.
5. **App Store entity:** saved `https://cortisolplus.com/` as the marketing URL in all 39 version 5.2 localizations. Validation passed; a subsequent dry run reported zero changes. Version 5.2 remains PREPARE_FOR_SUBMISSION; support/privacy URLs and release state were preserved. The public listing still uses the old URL until Apple publishes the version.
6. **Campaign attribution:** generated a real link in Cortisol+'s App Store Connect Campaigns screen on September 9: provider `128296964`, campaign `website-organic`, media type `8`. Website attribution now uses fixed broad-source labels only after analytics consent; ordinary links remain untagged without consent. Apple reporting thresholds still apply; no install or purchase from the QA click is claimed.

## Hands-on comparison test sheet

For Cortisol+, Welltory, StressWatch and Bevel, record test date, app version, iPhone/Watch model, OS, region, permission choices, plan and offer shown. Use each actual app to test onboarding, readings without a new sample, missing data, history, breathing/recovery guidance, privacy controls and subscription limits. Save your own screenshots where permitted.

Record observations separately from vendor documentation. Do not compare absolute HRV numbers across different statistics or measurement conditions. Do not claim hormone accuracy from UI impressions. Update the existing Welltory article and broad Watch-app page with specific fit/tradeoffs once this work exists; retain their URLs.

## Original walkthrough recording brief

**Prepared deliverable:** a 70-second actual app walkthrough, with English captions and transcript in the Watch guide. It shows the dashboard, input history and sleep view in development version 5.0.2 (12), iOS Simulator 26.5. A persistent label identifies sample data and the recording date. This is an older development build, not a current App Store hands-on test. The visible low-score demo flow did not expose the conditional breathing recommendation, so the video does not claim to demonstrate breathing. `APP-COPY-REVIEW-2026-09-09.md` records remaining app wording and fixture issues found during recording.

1. Open the actual app through its normal navigation, show the reading timestamp and explain which Watch data is available.
2. Open the input breakdown. Explain one HRV and sleep example without inferring hormone concentration.
3. Show a history view and how a user compares routines over a week.
4. Open the breathing feature; describe the exercise without promising a hormone outcome.
5. End with the methodology link and clear statement that the wellness score does not measure cortisol.

Use explicitly labeled sample data or the owner's authorized data. No fake app screens, invented personal results or reconstructed “customer” stories. Publish only after checking that the transcript matches the recorded app version.

## Prepared outreach draft — not sent

Three recipient-specific pitches and verified routes are now in `OUTREACH-READY-2026-09-09.md`. Explicit send authorization and sender choice have been requested; none has been sent. The template below remains a reference.

Subject: Cortisol+ Apple Watch stress tracking — methodology and review materials

Hi [name],

I build Cortisol+, an app for exploring wearable stress and recovery signals. We have published a detailed explanation of its scoring inputs and limits, alongside an Apple Watch guide and a free observation journal.

The app does not measure cortisol, and we have not established clinical accuracy against laboratory testing. If it fits your coverage of wearable apps, the product facts, screenshots and contact details are at https://cortisolplus.com/press/. I can provide an actual app walkthrough and answer implementation questions.

I am affiliated with the product; any review should reflect your independent experience.

Mikah

Choose a small set of relevant wearable-app reviewers/newsletters based on actual recent coverage. Record why each fits, a verified contact route, date, disclosure, response and resulting referral/citation. Do not send this draft without Mikah's explicit authorization to contact recipients.

## Baseline and later review

Run the fixed questions in `ai-prompt-panel.csv` in actual ChatGPT Search, Google AI Mode/Overviews, Perplexity and Copilot. Save engine/model/search mode, exact prompt, locale/account context, answer, sources, brand mention and recommendation separately. Use three independent new-conversation runs per platform; log missing search/Overview triggers separately from brand omission. A general web search tool result is not an actual test of those consumer AI answers.

Keep **Google AI Overview on regular Search** and **Google AI Mode** in separate result groups. The user's September 9 screenshot shows a visible AI Overview recommendation gap despite positive AI Mode observations. Its query field/full answer were outside the crop, so record it as partial evidence and capture those fields in the next controlled run. Never report a positive AI Mode result as proof of AI Overview inclusion.

Review Google page/query data, Bing AI exports and qualified App Store clicks after a complete 28-day window. Then revise the next content batch. Do not interpret a handful of clicks as an A/B test or claim that concurrent content changes caused growth.
