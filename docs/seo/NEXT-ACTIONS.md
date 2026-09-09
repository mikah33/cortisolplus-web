# Remaining work and prepared briefs

## Medical backlog: editorial review before publication

These eleven files are valid drafts. They have never been restored to production in this release. Review each article against current primary medical sources; remove unsupported mechanisms, diagnosis-by-symptom, dosing and promised app outcomes. Record the actual reviewer and scope only after review occurs.

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

The already-published levels, exercise, ashwagandha and methodology pages have received source/code-based revisions. An authentic clinical/scientific review is still outstanding.

## Live systems

1. **n8n:** locate the current blog workflow URL; replace direct-to-main publishing with the repaired structured-draft flow; publish the revised workflow; run one controlled editorial draft and confirm branch/PR result. The local template alone cannot change the running schedule.
2. **Cloud Google report:** apply `cloud-weekly-report.patch` to the app/functions repository in an isolated checkout; test its queries and error handling; deploy only `weeklySeoReport` after verifying the export name and target project. Do not redeploy unrelated app functions. The existing weekly schedule owns any Discord posting; no manual message is authorized by this document.
3. **Search discovery:** submit the current canonical sitemap to Google and Bing after deployment; request indexing for home, Watch guide, methodology and journal where appropriate. Record accepted/rejected/quota outcomes. Requests are not inclusion guarantees.
4. **GA4:** verify actual consented App Store click ingestion and create useful landing/source comparisons after real data exists. `app_store_click` is already registered as a key event with no monetary default. Keep synthetic QA traffic identified by `website-qa`.
5. **App Store entity:** correct the current developer/marketing URL pointing at the old Elevated Agency terms page to `https://cortisolplus.com/` in the appropriate editable App Store version. Preserve the separately required privacy/support destinations. Verify the public listing after Apple's publication process.
6. **Campaign attribution:** establish an actual App Store Connect campaign link/token before claiming click-to-install or subscription attribution; confirm eligible app analytics and territory breakdowns.

## Hands-on comparison test sheet

For Cortisol+, Welltory, StressWatch and Bevel, record test date, app version, iPhone/Watch model, OS, region, permission choices, plan and offer shown. Use each actual app to test onboarding, readings without a new sample, missing data, history, breathing/recovery guidance, privacy controls and subscription limits. Save your own screenshots where permitted.

Record observations separately from vendor documentation. Do not compare absolute HRV numbers across different statistics or measurement conditions. Do not claim hormone accuracy from UI impressions. Update the existing Welltory article and broad Watch-app page with specific fit/tradeoffs once this work exists; retain their URLs.

## Original walkthrough recording brief

**Deliverable:** a 60–90 second actual app walkthrough, captioned, with transcript beside the Watch guide.

1. Open the actual app through its normal navigation, show the reading timestamp and explain which Watch data is available.
2. Open the input breakdown. Explain one HRV and sleep example without inferring hormone concentration.
3. Show a history view and how a user compares routines over a week.
4. Open the breathing feature; describe the exercise without promising a hormone outcome.
5. End with the methodology link and clear statement that the wellness score does not measure cortisol.

Use explicitly labeled sample data or the owner's authorized data. No fake app screens, invented personal results or reconstructed “customer” stories. Publish only after checking that the transcript matches the recorded app version.

## Prepared outreach draft — not sent

Subject: Cortisol+ Apple Watch stress tracking — methodology and review materials

Hi [name],

I build Cortisol+, an app for exploring wearable stress and recovery signals. We have published a detailed explanation of its scoring inputs and limits, alongside an Apple Watch guide and a free observation journal.

The app does not measure cortisol, and we have not established clinical accuracy against laboratory testing. If it fits your coverage of wearable apps, the product facts, screenshots and contact details are at https://cortisolplus.com/press/. I can provide an actual app walkthrough and answer implementation questions.

I am affiliated with the product; any review should reflect your independent experience.

Mikah

Choose a small set of relevant wearable-app reviewers/newsletters based on actual recent coverage. Record why each fits, a verified contact route, date, disclosure, response and resulting referral/citation. Do not send this draft without Mikah's explicit authorization to contact recipients.

## Baseline and later review

Run the fixed questions in `ai-prompt-panel.csv` in actual ChatGPT Search, Google AI Mode/Overviews, Perplexity and Copilot. Save engine/model/search mode, exact prompt, locale/account context, answer, sources, brand mention and recommendation separately. Use three independent new-conversation runs per platform; log missing search/Overview triggers separately from brand omission. A general web search tool result is not an actual test of those consumer AI answers.

Review Google page/query data, Bing AI exports and qualified App Store clicks after a complete 28-day window. Then revise the next content batch. Do not interpret a handful of clicks as an A/B test or claim that concurrent content changes caused growth.
