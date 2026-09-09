# September 9 implementation release record

## Deployment

- First implementation: `fa6d8a353a45c5a7e9a69ac83af252a2f9844302`, [successful deployment](https://github.com/mikah33/cortisolplus-web/actions/runs/34387252900).
- Follow-up: `9aafb45346bb44a62c5c40d09ab057c44b50f6ff`, [successful deployment](https://github.com/mikah33/cortisolplus-web/actions/runs/34387731276). Corrected remaining showcase captions and made blog dates use UTC so local/CI HTML agree.
- Both workflows verified the intended commit, sitemap, canonical/robots and substantive content for all 84 routes after Firebase deployment.
- All 79 previously live canonical routes are retained. Five new canonical routes are published. Eleven unreviewed medical backlog articles remain drafts.
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

**Remaining measurement acceptance:** dashboard arrival and the delivered App Store click payload were not confirmed during this release. Do not treat the handler harness or a page-view HTTP 204 as proof that an App Store click was ingested. `app_store_click` key-event configuration and real conversion baselines remain open until that check passes. No install/subscription attribution is claimed.

The dated Google weekly pull and reproducible 28-day report succeeded using final Web data. The comparison reproduced the audit baseline: August 10–September 6 versus July 13–August 9. Private detailed audit/export evidence stays local.

## Open items

See `NEXT-ACTIONS.md`. Main dependencies: live n8n workspace URL and published workflow replacement, authentic clinical review, hands-on competitor testing, app walkthrough recording, App Store metadata/campaign mapping, separate cloud reporting patch deployment, and subsequent per-engine AI measurements. No outreach messages were sent and no independent media coverage is claimed.
