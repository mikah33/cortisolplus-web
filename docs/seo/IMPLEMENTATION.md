# SEO and AI visibility implementation — September 9, 2026

The approved 90-day plan is underway. This release repairs delivery and measurement, improves product discovery, and corrects priority claims. Search rankings and recommendations require subsequent observation; they are not release acceptance tests.

## Implemented in this release

| Area | Change | Verification |
|---|---|---|
| Publishing | Valid YAML, serializer for generated drafts, complete build before a draft is accepted, PR validation | Regression tests cover colons, quotes, duplicate keys, executable MDX and unsafe slugs; all 47 source documents parse |
| Release verification | Commit ID and substantive page fingerprints in `/release.json`; compare expected sitemap/HTML/canonical/robots with production | Tests reject stale releases, missing articles, soft 404s, incorrect canonical links and noindex; all 79 preexisting live paths protected |
| Commercial relevance | Homepage, download page, Apple Watch guide and HRV feature page rewritten around actual product use | Initial HTML contains category, limitations, pricing distinction and useful internal links |
| Methodology | Ten base weights, personal-baseline behavior, missing inputs, timing, model assumptions and validation limits | Checked against app source at `99f7036`; implementation evidence is not clinical validation |
| Existing citation leaders | Levels, exercise and ashwagandha pages revised in place with primary sources and more specific limitations | Existing URLs retained; no fabricated clinical reviewer or build-date review stamp |
| Comparisons | Existing Welltory URL refreshed; `/compare/apple-watch-stress-apps/` added | Explicit documentation-based comparison, dated sources and publisher disclosure; no invented hands-on tests |
| Original resource | Seven-day printable stress/sleep observation journal and blank CSV | Real editable print page, no answer submission, labeled fictional example |
| Official facts | About/editorial standards and press page | Publisher/contact, official download, actual screenshot assets and method link |
| Mobile/UI | Working mobile menu, darker text/link colors, fewer mobile animations, unique radio IDs | Browser keyboard navigation, equal-weight answer changes, result focus and retake checked |
| Quiz claims/schema | Non-diagnostic reflection summaries replace arbitrary risk bands; unrelated app-rating schema removed | No quiz carries the mobile app's aggregate rating; visible rating attributed to dated US App Store data |
| Analytics | New website GA4 stream, opt-in loading, `app_store_click`, limited source/landing context, product-page-only Meta events | Handler harness checks one event per click across client navigation, no answers/results/raw queries; preview collection disabled |
| Google reporting | Working URL-prefix property, dated weekly success/error output, final-data lag, reproducible 28-day comparison | Scoped local pull succeeded; daily tripwire now fails on stale or failed weekly data |

The release contains **84 canonical sitemap routes**: 79 preserved routes plus resource index, journal, press page, comparison index and Watch-app comparison. Eleven previously stranded medical articles remain drafts pending the review described in `NEXT-ACTIONS.md`.

## Release checks

```sh
npm ci
npm test
npx astro check
npm run build
npm run verify:live
node scripts/check-seo-freshness.mjs
```

Before deployment, local preview verification uses `VERIFY_BASE_URL=http://127.0.0.1:4321 npm run verify:live`. Production verification must use the manifest from the exact intended commit. A successful HTTP response alone is insufficient. The daily job builds main and compares it with live, then checks reporting freshness.

The September 9 local check passed 12 tests, compiled the site, reported no Astro errors, verified all 84 expected routes, and found no missing internal linked pages/assets. Browser and deployment observations are recorded in the local audit evidence and release record; do not infer network collection or indexing from a source-code test.

## Measurement configuration

- GA4 account `398973533`, property `542916632`; website stream `15748706466`, measurement ID `G-MMJRJGZDE3`. This is separate from the existing app streams and older unused dashboard stream.
- Enhanced measurement is disabled. Only explicit page views and App Store clicks are configured by this site.
- Google scripts load after analytics consent on the canonical production hostname. Preview/localhost and necessary-only visits do not start collection.
- App Store event context: `landing_path`, broad `acquisition_source`, optional allowlisted `campaign_name`, sanitized page location and destination domain. No quiz/journal values, search strings, raw referrers, hormone estimates or health result payloads.
- Meta is optional and limited to product pages. Reducing consent reloads the page to remove already-running optional SDKs.
- Website clicks are not installs or subscriptions. An App Store campaign-token mapping has not been established. Do not invent conversion rates or attribute every direct visit to AI.
- Consent loss and missing referrers mean measured traffic is a subset. Annotate this September 9 change before comparing against older unconditional tracking.

## Reproduce the Google comparison

Use the existing local Google account token; the report command does not open an authorization flow, send messages or commit data:

```sh
uv run scripts/gsc-report.py --end 2026-09-06 --output /absolute/private/gsc-28-day.json
```

Omit `--end` for a rolling final-data window ending three days ago. The report includes current/prior 28-day totals, query and page tables, absolute changes, dates and explicit failure status. Query sums can differ from property totals because Google withholds anonymized queries.

The shared Mac weekly job has been corrected. The separate Firebase Discord-report source still needs its isolated patch deployed; see `cloud-weekly-report.patch`. That cloud job was not manually invoked, and no Discord messages were sent in this implementation.

## Automation boundary

The live n8n workflow was located and replaced on September 9: **Cortisol+ editorial drafts**, workflow `gBppEAKFyY7m6IGB`, published version `ce797e8e-7482-459c-8638-d5ec463dd6cb`. Existing credentials and schedule were retained. The active generator uses four editorial briefs, skips committed articles/content branches and sends schema-constrained JSON to GitHub. The legacy direct-to-main publisher is replaced. See `automation/README.md` for exact links.

GitHub Actions' create/approve-PR setting was enabled for the draft handoff; default workflow permissions remain read. The workflow creates a draft PR and does not approve or merge it. n8n execution 4376 succeeded; GitHub run 34394381074 passed 17 tests and the complete rendered draft build, then opened draft PR #21 with `draft: true`. Initial controlled tests exposed format/validation failures, resolved with enforced JSON schema and valid Markdown separator handling. Content review and observation of the next scheduled run remain distinct follow-up work.

## Next decisions

Use `NEXT-ACTIONS.md` for clinical review, actual product tests, the live automation handoff, store metadata and original video/distribution. Use `ai-prompt-panel.csv` to establish a real per-engine baseline. No future AI answer runs, independent media placements, 30-day growth or 90-day outcome is claimed here.
