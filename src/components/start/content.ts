// Copy and options for the web onboarding at /start/. Mirrors the iOS 5.7
// native onboarding (Flow B, NewOnboardingView.swift) minus the steps that need
// the phone: notifications, Apple Health / Health Connect and device pairing.
// Those happen in the app after the user signs in.

export type Platform = 'ios' | 'android' | 'other';

export interface Choice {
  id: string;
  label: string;
  image?: string;
}

const img = (name: string) => `/app-ui/start/${name}.webp`;

export const SYMPTOMS: Choice[] = [
  { id: 'stressed', label: 'Often feel stressed', image: img('symptom_stressed') },
  { id: 'fatigued', label: 'Easily feel fatigued', image: img('symptom_fatigued') },
  { id: 'unrested', label: 'Wake up feeling unrested', image: img('symptom_unrested') },
  { id: 'irregular', label: 'Irregular diet & sleep habits', image: img('symptom_irregular') },
  { id: 'stimulants', label: 'Frequently consume stimulants', image: img('symptom_stimulants') },
];

export const GOALS: Choice[] = [
  { id: 'lower', label: 'Lower my cortisol & stress', image: img('goal_lower') },
  { id: 'track', label: 'Track my health metrics', image: img('goal_track') },
  { id: 'sleep', label: 'Improve my sleep', image: img('goal_sleep') },
  { id: 'habits', label: 'Build healthier habits', image: img('goal_habits') },
  { id: 'explore', label: 'Not sure — just exploring', image: img('goal_explore') },
];

export const GENDERS: Choice[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unspecified', label: 'Prefer not to say' },
];

export const SLEEP: Choice[] = [
  { id: 'lt6', label: 'Less than 6' },
  { id: '6-7', label: '6-7 hours' },
  { id: '7-8', label: '7-8 hours' },
  { id: '8plus', label: '8+ hours' },
];

export const EXERCISE: Choice[] = [
  { id: 'rarely', label: 'Rarely' },
  { id: '1-2', label: '1-2x / week' },
  { id: '3-4', label: '3-4x / week' },
  { id: 'daily', label: 'Daily' },
];

// Replaces the app's "Connect Your Device" step. On the web we only ask; the
// actual connection happens in the app's first session.
export function devices(platform: Platform): Choice[] {
  const rings = [
    { id: 'oura', label: 'Oura Ring' },
    { id: 'fitbit', label: 'Fitbit' },
    { id: 'garmin', label: 'Garmin' },
  ];
  if (platform === 'android') {
    return [
      { id: 'galaxy-watch', label: 'Galaxy Watch' },
      { id: 'pixel-watch', label: 'Pixel Watch' },
      { id: 'wear-os', label: 'Another Wear OS watch' },
      ...rings,
      { id: 'none', label: "I don't wear one yet" },
    ];
  }
  return [
    { id: 'apple-watch', label: 'Apple Watch' },
    ...rings,
    { id: 'other', label: 'Something else' },
    { id: 'none', label: "I don't wear one yet" },
  ];
}

export const WATCH_DEVICES = new Set(['apple-watch', 'galaxy-watch', 'pixel-watch', 'wear-os']);

export const BUILDING_STEPS = [
  'Analyzing your answers…',
  'Calibrating your baseline…',
  'Personalizing your habits…',
  'Setting up your watch companion…',
  'Finalizing your plan…',
];

export interface Habit {
  title: string;
  body: string;
  image: string;
  watchOnly?: boolean;
}

export const HABITS: Habit[] = [
  { title: 'Stress on your wrist', body: 'Your companion shows it live on your watch.', image: img('zen_watch'), watchOnly: true },
  { title: 'Track your sleep', body: "Your body's #1 cortisol reset.", image: img('metric_sleep') },
  { title: 'Daily cortisol check-ins', body: 'Catch stress before it builds.', image: img('metric_hrv') },
  { title: 'Calm sessions with Zen', body: 'Breathe your cortisol down, fast.', image: img('habit_calm') },
  { title: 'Move every day', body: 'Burn off stress hormones.', image: img('habit_move') },
  { title: 'Eat healthier', body: 'Cut stimulants, lower cortisol.', image: img('goal_habits') },
];

export const PERKS = [
  { label: 'Your daily cortisol score', image: img('perk_score') },
  { label: 'Stress companion on your watch', image: img('zen_watch') },
  { label: 'Sleep, HRV & recovery insights', image: img('perk_sleep') },
  { label: 'Calm sessions with Zen', image: img('perk_calm') },
];

// Web prices (set October 27, 2026). Swap for the RevenueCat Web Billing
// offering once web products exist.
export const PLANS = {
  weekly: { id: 'weekly', price: 14.99 },
  yearly: { id: 'yearly', price: 83.99 },
  // One-time exit offer, shown the first time someone backs out of the paywall.
  yearlyExit: { id: 'yearlyExit', price: 59.99 },
} as const;
export type PlanId = keyof typeof PLANS;

// Real checkout through RevenueCat Web Billing (see checkout.ts). Set false to
// fall back to the labeled sample screen.
export const CHECKOUT_ENABLED = true;

export const IMG = img;
