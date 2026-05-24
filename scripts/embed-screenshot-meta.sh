#!/usr/bin/env bash
# Embed SEO metadata into Cortisol+ App Store screenshots.
# Requires: exiftool (brew install exiftool).
# Run from repo root:  bash scripts/embed-screenshot-meta.sh
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/screenshots"
YEAR="$(date +%Y)"
AUTHOR="Mikah Albertson"
COPYRIGHT="© ${YEAR} Cortisol+. All rights reserved."
SITE="https://cortisolplus.com"

# Common keywords across every screenshot
BASE_KEYWORDS=("Cortisol+" "cortisol tracking app" "Apple Watch cortisol" "stress tracking iOS" "HRV stress" "biometric stress" "cortisol app screenshot")

set_meta() {
  local file="$1" title="$2" desc="$3" subject="$4"
  shift 4
  local kws=("${BASE_KEYWORDS[@]}" "$@")
  local kw_args=()
  for k in "${kws[@]}"; do kw_args+=("-XMP-dc:Subject+=$k" "-IPTC:Keywords+=$k"); done

  exiftool -overwrite_original -q \
    -XMP-dc:Title="$title" \
    -XMP-dc:Description="$desc" \
    -XMP-dc:Creator="$AUTHOR" \
    -XMP-dc:Rights="$COPYRIGHT" \
    -XMP-dc:Publisher="Cortisol+" \
    -XMP-dc:Source="$SITE" \
    -XMP-dc:Subject="$subject" \
    -IPTC:ObjectName="$title" \
    -IPTC:Caption-Abstract="$desc" \
    -IPTC:By-line="$AUTHOR" \
    -IPTC:CopyrightNotice="$COPYRIGHT" \
    -IPTC:Source="$SITE" \
    -PNG:Title="$title" \
    -PNG:Description="$desc" \
    -PNG:Author="$AUTHOR" \
    -PNG:Copyright="$COPYRIGHT" \
    "${kw_args[@]}" \
    "$file"
}

set_meta "$DIR/track-cortisol-levels.png" \
  "Cortisol+ — Track cortisol levels on Apple Watch" \
  "Apple Watch Ultra displaying the Cortisol+ real-time cortisol score of 12 with an Excellent rating. Trusted by 5,000+ users." \
  "Apple Watch cortisol score" \
  "Apple Watch Ultra" "real-time cortisol" "HRV" "stress score"

set_meta "$DIR/health-breakdown.png" \
  "Cortisol+ — Health Breakdown of every biometric factor" \
  "Cortisol+ Health Breakdown screen showing HRV, resting heart rate, blood oxygen, breathing rate, skin temperature, VO2 max and 10 of 13 biometric factors driving cortisol." \
  "Health Breakdown biometric factors" \
  "HRV" "resting heart rate" "blood oxygen" "VO2 max" "breathing rate"

set_meta "$DIR/daily-insights.png" \
  "Cortisol+ — Daily Insights dashboard" \
  "Cortisol+ Daily Insights dashboard with cortisol score 12 Excellent, heart rate 68 bpm Optimal, sleep duration 8h 30m Restful, plus 7-day biometric trend chart." \
  "Daily Insights dashboard" \
  "daily insights" "biometric trends" "sleep quality" "cortisol overview"

set_meta "$DIR/ai-coach.png" \
  "Cortisol+ — AI-powered wellness coach" \
  "Cortisol+ AI Coach showing Wellness Score 81 Excellent, 30-day low-stress streak, 483 total scans, weekly stress trend, and personalized Zen tips." \
  "AI wellness coach" \
  "AI coach" "wellness score" "stress streak" "Zen mode" "meditation"

set_meta "$DIR/sleep-analysis.png" \
  "Cortisol+ — Sleep Analysis & sleep stage tracking" \
  "Cortisol+ Sleep Analysis showing 8 nights tracked, 7.1h average sleep, 91/100 quality score, 92% efficiency, nightly duration chart, and cortisol-sleep insights." \
  "Sleep Analysis sleep stages" \
  "sleep analysis" "sleep stages" "sleep quality score" "REM" "deep sleep"

set_meta "$DIR/track-metrics.png" \
  "Cortisol+ — Track Metrics monthly health trends" \
  "Cortisol+ Insights screen with 28.5 cortisol average, fitness HRV 54 ms, resting heart rate 71 bpm, 8,317 steps, sleep 7.6 hours, Zen wellness score 75/100." \
  "Track Metrics monthly trends" \
  "track metrics" "monthly trends" "HRV trend" "activity" "fitness"

set_meta "$DIR/connect-with-friends.png" \
  "Cortisol+ — Connect with friends on your wellness journey" \
  "Cortisol+ Connect feed with friends sharing wellness milestones — Calm Heart, Heart Harmony, Stress Streaks — plus invite friends, badges, and unlock companions. Available in 171 countries." \
  "Connect with friends wellness community" \
  "wellness community" "friends" "badges" "social wellness" "stress streak"

echo "✓ Embedded metadata into 7 screenshots"
ls -la "$DIR"
