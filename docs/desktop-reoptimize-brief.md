# Desktop re-optimisation brief (Nov 13, 2026)

The site was redesigned mobile-first (Oct 27 – Nov 4) and mobile is approved as-is. On desktop many pages are still a single phone-width column (e.g. the homepage is capped at `max-w-[30rem]`), leaving large empty areas. Goal: make desktop use the space well **without changing anything below 1024px**.

## Hard rule: mobile and tablet must not change

- Only add styles that apply at **`lg:` (≥1024px) and up** (`lg:`, `xl:`, `2xl:` Tailwind prefixes, or `@media (min-width: 1024px)` in CSS). Never edit or remove an existing unprefixed, `sm:` or `md:` class; add `lg:` overrides instead.
- If you need different markup on desktop, render it alongside and toggle with `hidden lg:block` / `lg:hidden` — don't restructure the mobile markup.
- Prove it: run `scripts/mobile-diff.sh` (below) before you finish. It must report **0 changed pages** at 390px and 768px. If a page differs, find out why and fix it; only an unavoidable animation/time difference is acceptable, and you must explain it.

## Design direction (desktop)

- Keep the existing look: sky backgrounds (`app-sky`), app-style white cards (`app-card`), the ink/teal/mint tokens in `src/styles/global.css`, rounded-3xl, Zen illustrations (`public/app-ui/`, `public/app-ui/zen/`). Don't introduce new colours or fonts.
- Use a content width of about `lg:max-w-6xl` (1152px) for marketing pages, with two-column heroes (text + CTA on one side, illustration on the other) and 2–3-column grids for card lists. Text columns should stay readable (~65–75 characters).
- Calls to action: primary actions lead to `/start/` (the onboarding with the plan and checkout), as on mobile. Keep existing `data-start-cta` / `data-event` attributes.
- The sticky bottom "Get your stress plan · Start" bar (`src/components/StickyCTA.astro`) is fine on desktop; don't remove it. Coordinate if your sidebar adds another Start card (the bar already hides while any `[data-start-cta]` is on screen).

## Verify

1. `npm test` and `npm run build` pass.
2. `scripts/mobile-diff.sh <your page paths…>` reports 0 changed pages (it builds `origin/main` and your branch and compares 390px and 768px screenshots pixel by pixel).
3. Desktop screenshots at 1440 and 1280 wide, opened with the Read tool, look right: nothing stretched, cut off or awkwardly empty.
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir=/tmp/d-$RANDOM --window-size=1440,2400 --virtual-time-budget=5000 --screenshot=/tmp/<name>.png "http://127.0.0.1:<port>/<path>/"` against `npx astro preview --port <unique> --host 127.0.0.1` (stop it after).

The shell is zsh on macOS; use `git grep`, not `grep --include`.
