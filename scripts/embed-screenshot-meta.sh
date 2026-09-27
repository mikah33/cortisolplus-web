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

set_meta "$DIR/live-stress-levels.png" \
  "Cortisol+ — Live stress levels" \
  "Cortisol+ Now screen with an arc dial showing an example wellness score of 26 (Low), HRV 58 ms, resting heart rate 58 bpm, and the day's average, high and low. Example values; not a hormone measurement." \
  "Now dial wellness score" \
  "stress score" "HRV" "resting heart rate" "Now dial"

set_meta "$DIR/wearable-insights.png" \
  "Cortisol+ — Insights from your wearable" \
  "Cortisol+ Insights tab with a daily suggestion and cortisol, sleep and recovery cards built from Apple Health readings: HRV, resting heart rate, VO2 max, sleep duration and quality." \
  "Insights from Apple Health" \
  "Apple Health" "insights" "recovery" "VO2 max" "sleep quality"

set_meta "$DIR/sleep-quality.png" \
  "Cortisol+ — Sleep quality" \
  "Cortisol+ Sleep tab with an example night scored 93 Excellent, 7h 47m asleep, 96% efficiency and awake, REM, light and deep sleep stages." \
  "Sleep quality and sleep stages" \
  "sleep analysis" "sleep stages" "sleep quality score" "REM" "deep sleep"

set_meta "$DIR/activities.png" \
  "Cortisol+ — Activities and readiness" \
  "Cortisol+ Fitness view with weekly readiness, cardio load, steps, VO2 max, and run, bike, swim, strength and yoga workouts." \
  "Readiness and activities" \
  "readiness" "cardio load" "workouts" "steps" "VO2 max"

set_meta "$DIR/bio-age.png" \
  "Cortisol+ — Bio Age and Pace of Aging" \
  "Cortisol+ Bio Age screen with an example Bio Age of 26 and a Pace of Aging of 0.88x estimated from recovery data. An estimate, not a medical test." \
  "Bio Age and Pace of Aging" \
  "bio age" "pace of aging" "HRV" "resting heart rate" "recovery"

set_meta "$DIR/zen-ai-assistant.png" \
  "Cortisol+ — Ask Zen" \
  "Cortisol+ Zen chat explaining what is driving an example score of 26 using sleep, HRV and resting heart rate." \
  "Ask Zen AI assistant" \
  "AI assistant" "Zen" "wellness coach" "breathwork" "meditation"

echo "✓ Embedded metadata into 6 screenshots"
ls -la "$DIR"
