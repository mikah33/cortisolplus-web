# Community Walking Goal — In-App Event Plan

A drop-in spec for the App Store Connect in-app event covering the
Cortisol+ Walks community goal. Designed to ship alongside the Walks
feature without locking you to a launch date.

---

## How to handle the start/end date when you don't know the launch yet

App Store Connect lets you submit an In-App Event in two modes:

**Option A — Bind the event to a specific app version (recommended).**

In ASC → My Apps → Cortisol+ → Events → Create New Event, set
**"Available in"** to the version that ships with Walks (3.5). Apple
holds the event in review and won't surface it until that version is
released to the store.

For dates, set:
- **Event start:** the day you tap "Release this version" on 3.5,
  pick that date.
- **Event end:** start + 30 days.

You can edit both dates up until 24 hours before the event starts,
so this is safe even if you slip your launch.

**Option B — Standalone event with provisional dates.**

If you want the event to be its own thing (not tied to a version),
pick a start date 4 weeks out from submission. ASC will let you push
the date back as your timeline shifts.

**Don't pick "Live" as event purpose** — that requires real-time
content and isn't what a community goal is. Pick **"Challenge"**.

---

## App Store Connect submission copy

### Event name (max 30 chars)

```
Walk Together Challenge
```

### Short description (max 50 chars, used for notification + tile)

```
100,000 walks. One community. Together.
```
(39 chars — under budget. Or alternatives below.)

Alternates if you want to swap:
- `Help us hit 100,000 walks this May` (34 chars)
- `Every walk counts. Drop cortisol together.` (42 chars)
- `Cortisol+ community walk goal — join in` (39 chars)

### Long description (event details page, max 120 chars)

```
Every walk you log counts toward 100,000 community walks — watch cortisol drop on Apple Watch while we go together.
```
(116 chars — under 120.)

### Full description (max 1,000 chars, shown when user expands)

```
Cortisol+ walks aren't just for you. Every walk you log this month
counts toward a shared community goal: 100,000 walks across the
entire Cortisol+ community.

Open the Walks tab to find calming parks, trails, and waterfronts
near you, then tap Start. Apple Watch tracks your HRV recovery in
real time and your walk auto-saves to Places Walked.

The community total updates live in the app. Hit 15 walks yourself
this month and you'll see your personal goal ring close at the same
time — we celebrate twice.

Walking is the single most reliable, no-cost way to drop cortisol.
The science is clear: brisk 10-20 minute walks lower sympathetic
nervous-system activity within minutes. Doing it together makes it
stick.
```

### Event purpose

```
Challenge
```

### Event type

```
Major Update / Special Event
```

### Deep link

```
cortisolplus://walks
```

(Universal-link mirror: `https://cortisolplus.com/walks`. The
DeepLinkRouter wired in v3.5 catches both and opens WalksView.)

### Badge

In-app event badges show up in the event tile. Pick "Challenge".

### Notification (optional)

- **Title:** Walk Together Challenge
- **Body:** Every walk you log counts toward our community goal.
  See where the rest of the Cortisol+ community is at.

---

## Image requirements (reuse existing assets)

App Store Connect needs two images:

1. **Event Card Image** — 1080×1920 (portrait) or up to 2160×3840
   File: `docs/community-walk-goal-event-card.html` →
   render to PNG via ImageMagick or any HTML-to-PNG tool.

2. **Event Details Image** — 1920×1080 (landscape) or 1080×1920
   (portrait), same resolution rules.
   File: `docs/community-walk-goal-event-details.html`.

Both files match the existing Cortisol+ event aesthetic — mesh
gradient orbs, teal/coral palette, large bold typography. They use
community-goal copy and a collective-progress ring instead of the
feature-launch teaser.

To render:

```bash
# requires ImageMagick + Chrome/WebKit headless
chromium --headless --screenshot=card.png --window-size=1080,1920 \
    "file://$(pwd)/docs/community-walk-goal-event-card.html"

chromium --headless --screenshot=details.png --window-size=1920,1080 \
    "file://$(pwd)/docs/community-walk-goal-event-details.html"
```

---

## Submission checklist

- [ ] Event name + short + long descriptions pasted into ASC
- [ ] Event purpose: Challenge
- [ ] Available in: 3.5 (or whichever version ships Walks)
- [ ] Event start: same day as 3.5 release
- [ ] Event end: start + 30 days
- [ ] Deep link: cortisolplus://walks
- [ ] Event card image uploaded (1080×1920)
- [ ] Event details image uploaded (1920×1080)
- [ ] Localizations: en-US (others optional)
- [ ] Submitted for review (allow 1-3 business days)

---

## What you can edit later

ASC lets you change all of the following without re-review, up to
24 hours before the event starts:

- Start date and end date
- Short description
- Notification text
- Deep link

You **cannot** change after submission:
- Event purpose (Challenge)
- Event card image / details image (without re-review)

So if Walks slips a week, just push the start date — no resubmit.
