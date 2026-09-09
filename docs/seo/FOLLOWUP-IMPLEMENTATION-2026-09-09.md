# SEO follow-up implementation — September 9, 2026

## Completed source changes

- Preserved all 85 canonical URLs while rewriting the HRV/Watch, sleep, breathing and stress feature explanations.
- Corrected the feature hub and four audience FAQs; removed hormone measurement, overtraining prediction and recovery-timeline promises.
- Strengthened the existing download page for cortisol tracker app intent and connected it to setup, comparison, methodology and journal resources. No duplicate keyword landing pages were added.
- Corrected misleading app/quiz promotional paragraphs across older articles. This is a product-claim correction pass, not a claim that every historical medical statement has been clinically reviewed.
- Rebuilt the Oura/WHOOP comparison around official documentation and corrected the claim that WHOOP lacks a stress monitor. Removed stale prices, battery specifications and unsupported accuracy rankings.
- Reworked three supplement comparisons and the supplement overview; removed dosing stacks and claims that app trends prove efficacy.
- Rewrote eleven medical drafts individually and disabled symptom-tool CTAs. See the separate JSON editorial record. All remain unpublished; no qualified clinical reviewer is named because no such review occurred.

## Product verification

App code inspected at `mikah33/cortisolplus` commit `99f7036`: `Cortisol+ iOS/Views/Breathing/BreathingExerciseView_iOS.swift` and `Shared/Components/BreathingPhase.swift` show eight inhale/hold/exhale cycles, four seconds per phase (about 96 seconds). No selectable set of four protocols or before/after cortisol test exists in that implementation. The website now describes this accurately.

## Live account actions

- App Store Connect: version 5.2, all 39 marketing URLs changed to the canonical homepage; validation and zero-diff post-save verification passed. Release state unchanged. Public URL change awaits Apple's version publication.
- GA4: actual consented download-page visit and App Store click observed in Realtime; `app_store_click` appears as a key event. QA used `website-qa-followup`; this is verification traffic, not growth evidence.
- Google Search Console: HRV troubleshooting article indexing request accepted. Inspection initially reported URL unknown/not indexed; queue acceptance does not guarantee inclusion.
- Weekly report: narrow function fix and failure tests completed. Deployment awaits Google account verification after CLI credentials expired. No manual Discord report was sent.
- App Store campaign: the authenticated Campaigns UI generated provider token `128296964` with `website-organic`. Fixed broad-source campaign labels and matching GA4 event metadata are implemented behind analytics consent. No install or subscription attribution result has yet been observed.

## Verification

All 17 initial website tests passed; the attribution follow-up adds three tests, for 20 passing tests. Production build includes 85 canonical routes and excludes the 11 medical drafts. Tests cover acquisition privacy, content serialization, automation validation and exact-release verification. The new checks cover private-parameter removal, preserving links to unrelated apps/hosts, and execution of the actual website script through opt-in, ten client page events, one CTA click and consent withdrawal. Both GA4 campaign names and Apple campaign labels use fixed allowed values; QA suffixes are normalized. The cloud report has two additional passing tests for final-data requests and failure without side effects or response-body exposure.

## Outside evidence

Three tailored pitches are prepared in `OUTREACH-READY-2026-09-09.md`. They are not sent or earned coverage. The actual app walkthrough is captioned and labeled with its development version/sample-data provenance. Actual AI-engine observations are in `AI-BASELINE-2026-09-09.md`; the full repeated panel remains incomplete. Do not count vendor documentation as hands-on testing or a general search result as an AI-engine answer.
