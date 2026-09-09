# Cortisol+ editorial publishing

The website deploys from **main through GitHub Actions to Firebase Hosting** (`cortisol-plus`). The website is not hosted on Netlify.

## Draft workflow

`workflow.json` is the n8n template. It requests structured JSON from the content generator, then sends a `content-draft` repository dispatch. GitHub serializes the frontmatter with the YAML library, forces `draft: true`, rejects executable MDX from automation, validates the full rendered production build and opens a draft pull request. No generated article should be written directly to main.

The GitHub token used by n8n needs access to repository dispatch. GitHub Actions must be allowed to create pull requests. Existing n8n credentials remain in n8n; never commit keys to this template. Importing or editing this file does not update an existing live n8n workflow: update and publish that workflow separately, then verify its execution.

Use [the editorial review checklist](EDITORIAL-REVIEW.md) before changing `draft: false`. Validate every clinical source and claim. Do not manufacture a reviewer or date. New automated articles are drafts, and citation counts alone are not evidence checks.

## Local checks

```sh
npm ci
npm test
npm run build
npm run verify:live
```

`verify:live` compares production to the local build's commit, canonical routes, sitemap membership and substantive HTML. Run it against a build from the deployed commit. A 200 homepage cannot hide an older release. The daily tripwire rebuilds the current repository and runs the same check.

## Monitoring

Review GitHub Actions failures. The deployment and daily tripwire fail on build errors, missing protected routes, stale commits, missing sitemap URLs or unexpected page content. Owner email delivery depends on their GitHub notification settings. `release.json` identifies the deployed commit. The existing citation-bearing URLs are protected in `scripts/protected-routes.json`.

The topic queue is research input, not a publishing quota. Prioritize existing useful pages and verified product questions over mass symptom or supplement templates. Source checks, review availability and reader usefulness determine publication cadence.
