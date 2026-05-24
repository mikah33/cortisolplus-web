# Cortisol+ — SEO Strategy

> Plan generated 2026-05-23. Living document — update as data comes in from Search Console.

## Strategic Bet

Own the **"cortisol"** keyword universe (medical + trending + symptom searches). 90% of these queries have ZERO good answer pages today. We're the only iOS app actually estimating cortisol from biometrics — defensible content moat.

**Funnel**: Trending cortisol search → educational page with embedded interactive widget → soft CTA ("see your own cortisol pattern in 5s on Apple Watch") → App Store.

Do not compete head-on with Oura/Whoop on "best HRV app" — they win on DA. Compete on "cortisol" where they have no real coverage.

## Domain

Target: `cortisolplus.com` (fallback `cortisolplus.com`). `.app` requires HTTPS by default — good for SEO and trust.

## Site Architecture (built)

```
/                                    Home
/download                            App Store CTA page
/how-it-works                        Methodology + E-E-A-T
/about                               Founder + credentials
/privacy + /terms
/cortisol                            Pillar hub
  /symptoms                          Symptom index
    /[slug]                          Programmatic symptom pages (content collection)
  /lower                             How to lower cortisol hub
    /foods, /supplements, /breathing-exercises, /exercise, /sleep
  /foods/[slug]                      Programmatic food pages (content collection)
  /levels                            Reference (planned)
  /test                              Testing guide (planned)
/tools/cortisol-calculator           Interactive React quiz
/blog                                Editorial (content collection)
/compare/[slug]                      Comparison pages (planned)
```

## Topic Clusters & Keyword Targets

| Cluster | Hero KW | Targets | Pages | Difficulty |
|---|---|---|---|---|
| Cortisol Symptoms | "signs of high cortisol" | cortisol face, belly, weight gain | ~25 | MED |
| Lowering Cortisol | "how to lower cortisol" | foods, supplements, exercises, breathing, sleep | ~15 | MED-HIGH |
| Foods DB | "foods that lower cortisol" | [food]+cortisol × 100 | ~100 | LOW (untapped) |
| Testing | "cortisol test at home" | saliva, blood, kits | ~10 | MED |
| TikTok Trends | "cortisol mocktail" | detox, cortisol face/belly debunkers | ~15 | LOW |
| Apple Watch + Stress | "apple watch stress" | HRV apps, watchOS stress | ~10 | LOW-MED |
| Cortisol Levels | "cortisol levels by age" | by gender, time of day | ~10 | MED |
| Comparisons | "Welltory alternative" | vs Oura, vs Bevel | ~5 | LOW |

Mature target: ~190 pages.

## Programmatic Plays

1. **Food × Cortisol DB** — `/cortisol/foods/[food]`. Template + USDA + AI body = 100 pages day one.
2. **Symptom pages** — `/cortisol/symptoms/[symptom]`. Riding TikTok cortisol-face/belly trend.
3. **Cortisol Risk Calculator** (built) — backlink magnet + lead capture.
4. **HRV-by-Age chart** — embeddable widget, link bait.
5. **Cortisol mocktail debunker** — viral angle.

## Technical Stack (built)

- **Astro 6** + Tailwind v4 + React (islands) + MDX + Sitemap on Netlify
- Site URL set in `astro.config.mjs`
- Auto-generated sitemap-index.xml
- `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- `llms.txt` for AI search
- Schema markup per page type (Organization, MobileApplication, Article, FAQPage, WebApplication)
- Security headers via `netlify.toml`

## Schema Plan

| Page | Schema |
|---|---|
| Home | Organization + MobileApplication + WebSite (✅) |
| How it works | Article (via ArticleLayout) |
| Symptom pages | Article + FAQPage (extend in template) |
| Food pages | Article + FAQPage (✅) |
| Blog | Article (✅) |
| Calculator | WebApplication (✅) |
| Compare pages | FAQPage + Product (planned) |
| Download | MobileApplication + AggregateRating (planned, needs reviews) |

## 90-Day Roadmap

### Weeks 1–2: Foundation (THIS PHASE — mostly done)
- [x] Astro scaffold + Tailwind + React + MDX + Sitemap
- [x] Core pages stubbed (Home, How-It-Works, About, Privacy, Terms, Download)
- [x] SEO baseline (meta, OG, schema, sitemap, robots, llms.txt)
- [x] Calculator built
- [x] First symptom + food + blog seed content
- [ ] Buy `cortisolplus.com` domain
- [ ] Connect Netlify deploy
- [ ] Set up Plausible analytics
- [ ] Submit to Search Console + Bing Webmaster

### Weeks 3–5: Hub Pages + Templates
- [ ] Write full content for /how-it-works (citations, study links)
- [ ] /cortisol/lower full content
- [ ] /cortisol/levels + /cortisol/test
- [ ] Seed 50 food MDX files (USDA-sourced + AI body)
- [ ] Seed 10 symptom MDX files
- [ ] Promote calculator launch

### Weeks 6–8: Velocity + Comparisons
- [ ] 100 food pages
- [ ] 25 symptom pages
- [ ] /compare/welltory, /compare/oura, /compare/stress-monitor
- [ ] HRV-by-age interactive widget
- [ ] Ship 5 blog posts on trending topics
- [ ] Image optimization audit (Astro's `<Image>` component)

### Weeks 9–12: Distribution
- [ ] Product Hunt launch
- [ ] BetaList, AlternativeTo, Indie Hackers
- [ ] Press pitches: Fortune Well, Vogue Wellness, Well+Good
- [ ] 20 blogger outreach offering calculator data
- [ ] 2 blog posts/week
- [ ] Iterate on Search Console findings

## KPI Targets

| Metric | M1 | M3 | M6 | M12 |
|---|---|---|---|---|
| Indexed pages | 20 | 150 | 250 | 400+ |
| Organic traffic/mo | 0–500 | 2K–5K | 15K–30K | 60K–150K |
| Top-10 keywords | 5 | 30 | 120 | 400+ |
| DR (Ahrefs) | 0 | 5 | 15 | 30 |
| App Store clicks/mo | <100 | 500–1K | 3K–8K | 15K–40K |
| Referring domains | 5 | 25 | 100 | 350 |
| Core Web Vitals | All green | All green | All green | All green |

Conservative install conversion: 8–15% of App Store clicks → ~400–1200 installs/mo at M6.

## Risks

- **Medical disclaimer & YMYL**: Cortisol content is health content. Google's E-E-A-T scrutiny is high. Mitigation: founder credentials on every page, cited studies, "not medical advice" footer, real author bios.
- **App Store dependency**: If Apple changes rules on cortisol claims, marketing language must adapt.
- **TikTok trend decay**: Capture the trend traffic NOW, build evergreen pages, don't rely on trends long-term.

## Next Decisions Needed From You

1. Confirm domain choice and purchase
2. Provide bio/credentials for E-E-A-T on /about
3. Confirm App Store URL for `SITE.appStoreUrl` in `src/consts.ts`
4. Real OG image at `/og-default.png` (1200×630)
5. Real favicon
