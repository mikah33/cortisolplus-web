# Cortisol+ editorial publishing

The website deploys from **main through GitHub Actions to Firebase Hosting** (`cortisol-plus`). The website is not hosted on Netlify.

## Draft workflow

`workflow.json` is the n8n template. It requests structured JSON from the content generator, then sends a `content-draft` repository dispatch. GitHub serializes the frontmatter with the YAML library, forces `draft: true`, rejects executable MDX from automation, validates the full rendered production build and opens a draft pull request. No generated article should be written directly to main.

The GitHub token used by n8n needs access to repository dispatch. GitHub Actions must be allowed to create pull requests. Existing n8n credentials remain in n8n; never commit keys to this template. Importing or editing this file does not update an existing live n8n workflow: update and publish that workflow separately, then verify its execution.

Use [the editorial review checklist](EDITORIAL-REVIEW.md) before changing `draft: false`. Validate every clinical source and claim. Do not manufacture a reviewer or date. New automated articles are drafts, and citation counts alone are not evidence checks.

## Verified live workflow — September 9, 2026

- [Cortisol+ editorial drafts](https://contractorai.app.n8n.cloud/workflow/gBppEAKFyY7m6IGB) replaces **Cortisol+ AI auto-publish** in the same workspace and workflow ID. The contractor forms workflow is separate.
- Published version: `ce797e8e-7482-459c-8638-d5ec463dd6cb`, **Validated editorial draft handoff — 2026-09-09**. The existing Mon/Wed/Fri schedule and credentials were retained. The two legacy fetch/pick nodes are deactivated; the self-contained generator handles selection. Do not reactivate those obsolete nodes.
- [n8n execution 4376](https://contractorai.app.n8n.cloud/workflow/gBppEAKFyY7m6IGB/executions/4376) succeeded in 32.448 seconds. The execution points to the published version above.
- [GitHub run 34394381074](https://github.com/mikah33/cortisolplus-web/actions/runs/34394381074) passed all 17 tests, serialized the input, rendered the proposed page in a complete build and opened [draft PR #21](https://github.com/mikah33/cortisolplus-web/pull/21). The article remains `draft: true` on its content branch.
- GitHub's repository setting allowing Actions to create/approve pull requests was enabled to support this handoff. Default workflow permissions remain `read`; the draft workflow explicitly requests contents/PR write access and performs no approval or merge.

This is verification of a manually triggered execution of the published code, not observation of the next scheduled run. Content in PR #21 still needs source and device/UI review. Successful automation does not establish that its prose is publication-ready.

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

`editorial-queue.json` is the active queue: four focused briefs about wearable data, permissions, score interpretation and journaling. The generator skips slugs already used, committed articles and existing `content/` branches. A completed queue returns no items without spending another model call. `topic-queue.json` remains a legacy research backlog and is not used by the revised generator. Source checks, review availability and reader usefulness determine publication cadence.

The generator supplies plain Markdown and source URLs for human checking. Its prompt is not a source-retrieval tool, and generated claims still require review. The tests run the actual n8n template against mocked responses, check the serializer contract, duplicate prevention, unsafe Markdown rejection and credential-safe failure handling.

The Anthropic request uses `output_config.format` with a JSON schema for the four article fields. The body pattern excludes HTML openings and MDX expression braces. Normal Markdown blockquotes and `Settings > Health` navigation separators are allowed. Refused or truncated model responses stop without dispatch. See [Anthropic structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) for the API contract; this constrains format, not factual accuracy.
