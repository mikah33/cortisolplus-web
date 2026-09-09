# Issues observed in the development app during the website walkthrough

Tested source: `mikah33/cortisolplus` app code at `99f7036`, with a two-line Simulator compilation-guard correction. Built version: **5.0.2 (12)**; iPhone 17 Pro Max Simulator, iOS 26.5. Recording date: September 9, 2026. These observations do not establish that the current App Store build has identical wording.

| Observed wording or behavior | Why it needs correction | Proposed behavior |
|---|---|---|
| Setup says it will scan cortisol levels | Wearable inputs do not measure cortisol concentration | Explain that it reads available health signals to calculate a wellness score |
| Score detail states that the body is relaxed and recovered | A score does not establish a person's subjective or physiological state | Describe the score and available inputs; ask readers to consider how they feel |
| Sleep insight says excellent sleep significantly lowered cortisol | No hormone change was measured | Explain how the sleep input affected the software score |
| Tour promises full confidence after 14 days | Baseline coverage is not clinical accuracy or certainty | State the history available and missing-data limits without a certainty guarantee |
| Zen descriptions associate low cortisol with stronger immunity and optimal training | Unsupported inference from a software score | Give contextual wellness guidance without claiming a hormone state or readiness for hard training |
| Dashboard example sleep is 7h47m; Sleep tab example is 7h30m | Different development fixtures appear in the same navigation flow | Reuse one consistent fixture before recording a current-release walkthrough |

The published website walkthrough explicitly labels all readings as sample data, identifies this older development version and explains that software labels do not establish facts about hormones or recovery. It is a UI demonstration, not clinical validation, a real Watch measurement test or competitor testing. Re-record after the app copy and demo fixtures have been aligned.

The compilation correction closes the non-Simulator conditional after `formattedTrialTime` and reopens it before `trialCountdownBanner` in `DashboardView.swift`. Previously it also excluded shared dashboard views, causing six missing-symbol errors in Simulator. The corrected Debug build succeeded; no App Store binary was submitted or released for this website work.
