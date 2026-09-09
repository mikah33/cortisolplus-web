# September 9 implementation release record

## Deployment

- First implementation: `fa6d8a353a45c5a7e9a69ac83af252a2f9844302`, [successful deployment](https://github.com/mikah33/cortisolplus-web/actions/runs/34387252900).
- Follow-up: `9aafb45346bb44a62c5c40d09ab057c44b50f6ff`, [successful deployment](https://github.com/mikah33/cortisolplus-web/actions/runs/34387731276). Corrected remaining showcase captions and made blog dates use UTC so local/CI HTML agree.
- Both workflows verified the intended commit, sitemap, canonical/robots and substantive content for all 84 routes after Firebase deployment.
- All 79 previously live canonical routes are retained. Five new canonical routes are published. Eleven unreviewed medical backlog articles remain drafts.
- Cache/header release: `5baf29b10e5890d0173490dad81cebf9c8089d83`, [successful deployment](https://github.com/mikah33/cortisolplus-web/actions/runs/34389451995).
- HTML cache control now requests revalidation, while hashed assets retain immutable caching. This avoids returning an earlier page from a fresh browser-cache entry after a content correction.

## Search discovery: actual outcomes

Google account/property: existing authorized owner, `https://cortisolplus.com/` URL-prefix property.

| Action | Observed outcome |
|---|---|
| Submit `/sitemap.xml` | “Sitemap submitted successfully”; record dated September 9, status Success, 84 discovered pages |
| Inspect `/stress/apple-watch/` | Already on Google; revised page added to priority crawl queue after request |
| Inspect `/resources/stress-sleep-journal/` | Discovered through the new sitemap, not yet indexed; indexing request accepted and added to priority crawl queue |
| Submit canonical sitemap to Bing | Record dated September 9, status Processing; previous URL count remains until Bing processes it |

Discovery and indexing-request acceptance do not establish that Google/Bing has indexed or ranked the new version. No repeated submission was used to imply extra priority.

## Performance and measurement

Lighthouse 13.4.1, default simulated mobile profile, same Chrome family/machine as audit: homepage performance **68 → 98**, accessibility **95 → 100**, LCP **4.4s → 1.3s**, TBT **650ms → 0ms**, CLS **0 → 0**. The after-run had no run warnings. After-run measured the first implementation release before the small showcase/date follow-up. It represents the default, no-opt-in visit; optional analytics adds work after consent. These are lab observations, not field CWV or a causal SEO-growth result.

The new website GA4 tag loads only after consent; localhost opt-in remains inert. A real production page-view collection request returned **HTTP 204** in Chrome DevTools. The source harness verified one queued App Store event per click even after ten client navigations, no events under necessary-only, and no quiz/journal answers or raw queries in that payload. Normal App Store navigation was exercised on production using the `website-qa` / `website-qa-final` campaign labels.

**Subsequent ingestion acceptance, September 9:** after a consented production visit labeled `website-qa-followup` and an actual App Store CTA click, GA4 Realtime visibly showed the download page view and `app_store_click` under Key events with count 1. This completes the ingestion check left open during the first release. No install/subscription conversion has yet been observed from that QA click.

The dated Google weekly pull and reproducible 28-day report succeeded using final Web data. The comparison reproduced the audit baseline: August 10–September 6 versus July 13–August 9. Private detailed audit/export evidence stays local.

## Open items

See `NEXT-ACTIONS.md`. Current dependencies: authentic clinical review, hands-on competitor testing, authorized independent-review outreach, subsequent AI measurements separated by engine and Google feature, the next scheduled publisher/report execution, and the next App Store release exposing the saved marketing URL. The walkthrough, campaign mapping, GA4 click ingestion and cloud reporting patch deployment are completed in the follow-ups below. No outreach messages were sent and no independent media coverage is claimed.

## Live publisher replacement — September 9 follow-up

The live n8n workflow is now **Cortisol+ editorial drafts**, published version `ce797e8e-7482-459c-8638-d5ec463dd6cb`. Execution 4376 succeeded and triggered [GitHub run 34394381074](https://github.com/mikah33/cortisolplus-web/actions/runs/34394381074), which passed 17 tests and the complete proposed-page build before opening [draft PR #21](https://github.com/mikah33/cortisolplus-web/pull/21). It was unpublished at this automation verification stage; the editorial follow-up is below. Schedule and credentials were retained; only the four focused editorial briefs feed the generator. The first controlled runs failed before dispatch; enforced output schema and Markdown validation fixes produced the successful run. The next scheduled execution has not yet been observed. Full evidence and repository permission details are in `automation/README.md`.

## HRV troubleshooting article — publication edit

[PR #21](https://github.com/mikah33/cortisolplus-web/pull/21) publishes `/blog/apple-watch-hrv-not-updating/` after Mikah requested publication on September 9. The article now separates missing Apple Health data from stale third-party app data, cites current Apple documentation beside device instructions, and links to the scoring methodology and Watch guide. A contextual inbound link from the Watch guide helps readers discover the article. Troubleshooting posts can opt out of the otherwise unchanged quiz card.

Editorial scope: opened Apple's [iOS 26 Health data guide](https://support.apple.com/guide/iphone/view-your-health-data-iphe3d379c32/26/ios/26), [Health data management](https://support.apple.com/en-us/108779), [watch fit](https://support.apple.com/en-us/118234), [Low Power Mode](https://support.apple.com/en-us/108320) and [heart-rate monitoring](https://support.apple.com/en-us/120277) documentation. Removed the unsupported 24-hour threshold, finger-width fitting rule, fixed sampling assumptions, blanket on-demand claim and conclusion that absent readings have only one cause. The article identifies its iOS documentation version. This was a source-based editorial check, not a hands-on device test or clinical review; no reviewer credentials or medical-review schema were added.

Local validation passed all 17 tests and the complete production build. The release adds one canonical article route, for 85 total, while retaining the previous 84. Rendered HTML checks confirmed the article canonical, indexability, internal destinations, source links and absence of the unrelated quiz CTA. Publication is confirmed only when the PR is merged and its **Deploy to Firebase Hosting** run passes the live commit, sitemap and content verification. The linked PR and Actions record carry the final merge/deployment outcome.

## Follow-up content release — verified live

[PR #22](https://github.com/mikah33/cortisolplus-web/pull/22) was merged as `4bd44bd907462bbdf36f1e4781b1c7ab1235a8b0`. [Firebase deployment 34406304825](https://github.com/mikah33/cortisolplus-web/actions/runs/34406304825) succeeded. A separate local build at that exact merge commit and `npm run verify:live` also verified all 85 canonical production routes.

The release corrects wearable hormone claims, strengthens existing app/setup pages and replaces unsupported supplement/device comparisons with explicitly sourced descriptions. All eleven medical backlog drafts received individual editorial rewrites and remain unpublished; no qualified clinical reviewer has been represented. The detailed scope is in `FOLLOWUP-IMPLEMENTATION-2026-09-09.md`.

Google accepted an indexing request for `/blog/apple-watch-hrv-not-updating/`; the URL was not indexed when inspected. Version 5.2 App Store marketing URLs were saved for all 39 localizations and verified with a zero-change dry run. Version 5.2 is still in preparation, so the public App Store website link has not yet changed.

## App Store campaign and walkthrough release

[PR #23](https://github.com/mikah33/cortisolplus-web/pull/23) was merged as `fad174eaeae413e1407d59409c93b7b36841d76e`. [Firebase deployment 34411965710](https://github.com/mikah33/cortisolplus-web/actions/runs/34411965710) passed its production checks. All 20 tests pass, including execution of the actual website script through consent, repeated page events, one attributed CTA click and withdrawal.

The App Store Connect Campaigns UI generated provider token `128296964` for Cortisol+. In a real production browser check, the download link was initially untagged, became `pt=128296964&ct=website-qa&mt=8` after analytics consent, and opened the correct Cortisol+ App Store listing. Returning to the site and withdrawing consent restored the plain App Store link. GA4's earlier ingested click is recorded above; no installation or purchase is inferred from the new QA navigation.

The Watch guide now contains a 70-second real app walkthrough with a persistent sample-data/development-version label, English captions and transcript. Its MP4, poster and VTT all returned HTTP 200 from production with the proper content types and hashes identical to the local artifacts. The MP4 is 741,114 bytes. The follow-up limits the player's height to 75% of the viewport so its controls fit on short screens; fullscreen remains available.

The Simulator compilation fix used to create the recording is merged in [app PR #2](https://github.com/mikah33/cortisolplus/pull/2). The separate weekly report correction is merged in [app PR #1](https://github.com/mikah33/cortisolplus/pull/1), but deployment remains blocked on the admin Firebase account refresh. Reauthentication of the personal account succeeded but that account lists no Firebase projects. No manual Discord report was sent.

## Final walkthrough check and cloud report deployment

[PR #24](https://github.com/mikah33/cortisolplus-web/pull/24) merged as `e4da5e9fd9c7ccf5f55a8707b60f2cdd33cbd8b6`. [Firebase deployment 34413366286](https://github.com/mikah33/cortisolplus-web/actions/runs/34413366286) passed all 20 tests, build and production verification. A separate build at that exact commit verified all 85 live canonical routes. In the production browser, the player measured 440.25 pixels high in a 587-pixel viewport; actual playback and visible English captions were confirmed.

**Cloud login blocker resolved later on September 9.** The refreshed admin account successfully listed the Cortisol Plus project. The scoped deployment command updated only `functions:weeklySeoReport` in project `cortisol-plus`, region `us-central1`; Firebase reported a successful update and deployment completion. A subsequent live function listing confirmed `weeklySeoReport` is **ACTIVE**, generation 2, Node.js 22, under the intended service account. The two report tests and JavaScript syntax checks passed before deployment. The source worktree retained the existing production exports; no unrelated functions were deployed. This supersedes the expired-login status above. No manual report or Discord message was triggered, and the next scheduled report remains unobserved.

The user's later Google screenshot is recorded separately in `AI-BASELINE-2026-09-09.md`: Cortisol+ is absent from the visible **AI Overview** portion. Earlier positive **AI Mode** observations do not establish AI Overview inclusion. The screenshot does not show the exact query field or complete answer, so it is partial evidence, not a full-query ranking score.
