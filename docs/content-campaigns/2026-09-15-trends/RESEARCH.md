# Google Trends research and implementation — September 15, 2026

## Outcome

Improve three existing canonical pages and add one sourced alcohol/HRV article. Prepare four Shorts scripts and eight ad variants. No claim that the four exact long-tail phrases are rising, low-competition, or guaranteed to rank. No search-volume estimates were obtained. Broad topic families were checked, not exact-match volume for every proposed headline.

## Live Google Trends observations

All observations below were read in Google Trends in the signed-in browser on September 15, 2026. US geography. Indices are relative search interest, not searches or potential installs. Breakout is Google's label, not a large absolute audience guarantee. Results may change with sampling and time. Latest partial week is not a completed reporting period.

| Settings/source | What was displayed | Decision |
|---|---|---|
| [Empty term, Health, past 12 months, Web](https://trends.google.com/trends/explore?cat=45&geo=US) | First five rising queries included cyclospora, cyclosporiasis, World Cup and product recalls | Skip: poor product fit |
| [HRV, all categories, past 12 months, Web](https://trends.google.com/trends/explore?geo=US&date=today%2012-m&q=HRV) | Honda searches mixed with “hrv training” +350% | Do not use ambiguous HRV aggregate as health demand |
| [HRV, Health, past 12 months, Web](https://trends.google.com/trends/explore?geo=US&cat=45&date=today%2012-m&q=HRV) | Automotive results persisted; “hrv resonance breathing” +850% | Future topic candidate only; not included in this four-topic release |
| [heart rate variability, past 12 months, Web](https://trends.google.com/trends/explore?geo=US&date=today%2012-m&q=heart%20rate%20variability) | “heart rate variability training” +190%; unrelated rising results also present | Require relevance checks; do not blindly publish every rising query |
| [cortisol, past 12 months, Web](https://trends.google.com/trends/explore?geo=US&date=today%2012-m&q=cortisol) | low cortisol meme Breakout; high cortisol meme +3,450%; low cortisol song +2,750% | Existing meme coverage can satisfy this; no new duplicate page |
| [cortisol, past 12 months, YouTube](https://trends.google.com/trends/explore?geo=US&date=today%2012-m&gprop=youtube&q=cortisol) | Song, meme and dance queries marked Breakout; chart peaked at 100 week of April 5 and showed 21 week of September 6 | Broad entertainment spike is not current app-buying intent |
| [Four families, past 12 months, Web](https://trends.google.com/trends/explore?geo=US&date=today%2012-m&q=Apple%20Watch%20HRV,HRV%20alcohol,Welltory,Apple%20Watch%20cortisol) | Displayed average indices 60, 16, 30, 10 respectively. Welltory related query “welltory reviews” +160%. Alcohol related query panel was Top, not Rising | Supports exploring product-related content, not growth claims for all four |
| [Watch HRV / HRV alcohol / Welltory, past 5 years, Web](https://trends.google.com/trends/explore?geo=US&date=today%205-y&q=Apple%20Watch%20HRV,HRV%20alcohol,Welltory) | Data still present near right edge; latest complete week indices 61, 7, 23. Sparse zeros in alcohol series | Durable product categories with low-volume uncertainty; no exact search counts |
| [Four families, past 12 months, YouTube](https://trends.google.com/trends/explore?geo=US&date=today%2012-m&gprop=youtube&q=Apple%20Watch%20HRV,HRV%20alcohol,Welltory,Apple%20Watch%20cortisol) | Sparse chart, several insufficient-data panels; Welltory app review appears as Top | Insufficient data for a confident YouTube ranking forecast; scripts are experiments |

## Search-result and content decisions

- **Overnight HRV:** Existing `/blog/hrv-during-sleep/` contained unsupported cortisol claims. Rewrite at that URL; supply a practical timestamp/source/baseline checklist. No duplicate “low overnight HRV” page.
- **Apple Watch cortisol:** Existing `/stress/apple-watch/` already appears in retrieved search results. Add buyer questions and contextual internal links; retain the recently updated meta description.
- **Alcohol/HRV:** Add `/blog/alcohol-hrv-sleep/` using the 2026 PLOS paper and earlier JMIR research. Discuss observational limitations and WHOOP involvement. No fabricated personal test, fixed predicted drop, or cortisol inference.
- **Welltory alternative:** Search results include AlternativeTo, Therma and Vitara alternatives pages. Their existence is competition, not proof this keyword is easy. Expand our existing documented Welltory comparison with an alternative-selection checklist. No untested accuracy winner or invented price comparison.

## Sources checked

- https://help.welltory.com/en/articles/4241383-taking-measurements-with-your-apple-watch
- https://www.apple.com/health/pdf/Heart_Rate_Calorimetry_Activity_on_Apple_Watch_November_2024.pdf
- https://support.apple.com/en-us/120277
- https://medlineplus.gov/lab-tests/cortisol-test/
- https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0001284
- https://mental.jmir.org/2018/1/e23
- https://www.niaaa.nih.gov/alcohols-effects-health/alcohols-effects-body

## Baseline and measurement

`GSC-BASELINE.json` is an extract of the repository's saved Search Console report, pulled September 14 for September 5–11, final data. This is not a new live API pull. The Watch guide had 96 impressions, 1 click and average position 8.875. The exact query “can apple watch measure cortisol” had 4 impressions, 0 clicks and average position 8. Missing rows for other pages mean not present in this export, not confirmed zero traffic.

Use the existing weekly GSC report to compare subsequent complete windows. Track page/query impressions, clicks and CTR; position is an average, not a guaranteed rank. Record website-to-App-Store clicks separately from installs. Attribution must be validated before attaching revenue claims.

`SHORTS-AND-ADS.md` contains ready-to-record scripts, edit instructions, descriptions and ad copy. `MEASUREMENT.csv` is the reporting template. Videos have not been rendered or posted; ad variants have not been launched. No new paid service or budget was enabled.

## Repeatable weekly research procedure

Use this same category → specific term → five-year context → search-results → existing-page check. Keep source URL, geography, date range, search type and displayed value. Prefer improving existing pages. Skip irrelevant spikes. Review factual sources and product claims before publication. Track performance in complete reporting windows. Existing weekly SEO reporting is already present; no duplicate automation was created.
