import { useEffect, useRef, useState } from 'react';
import { APP_RATING, SITE } from '../consts';
import { WEB_CHECKOUT_URL, trackFunnel } from '../lib/funnel.js';

type Answers = Record<string, string>;

interface Question {
  id: string;
  prompt: string;
  options: [key: string, label: string][];
  when?: (answers: Answers) => boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 'peak',
    prompt: 'When do you usually feel most wound up?',
    options: [
      ['morning', 'Mornings. I wake up already "on"'],
      ['afternoon', 'Mid-afternoon'],
      ['evening', 'Evenings and bedtime'],
      ['allday', 'Pretty much all day'],
      ['rarely', 'Honestly, rarely'],
    ],
  },
  {
    id: 'sleep',
    prompt: 'How do your nights usually go?',
    options: [
      ['good', 'I fall asleep fine and wake up rested'],
      ['falling', 'It takes a while to fall asleep'],
      ['waking', 'I wake up in the middle of the night'],
      ['tired', 'I sleep, but wake up tired'],
    ],
  },
  {
    id: 'energy',
    prompt: 'How is your energy around 2–4pm?',
    options: [
      ['steady', 'Steady'],
      ['dip', 'A noticeable dip'],
      ['crash', 'I crash and reach for caffeine'],
    ],
  },
  {
    id: 'coffee',
    prompt: 'When is your first coffee?',
    options: [
      ['early', 'Within 30 minutes of waking'],
      ['later', 'An hour or two after waking'],
      ['twice', 'Morning and again in the afternoon'],
      ['none', "I don't drink coffee"],
    ],
  },
  {
    id: 'load',
    prompt: 'How does a typical week feel?',
    options: [
      ['ok', 'Manageable'],
      ['busy', "Busy, but I'm on top of it"],
      ['stretched', 'Stretched thin'],
      ['empty', 'Running on empty'],
    ],
  },
  {
    id: 'focus',
    prompt: 'What would you most like to understand?',
    options: [
      ['night', "Why I can't switch off at night"],
      ['sleep', 'How my sleep shapes the next day'],
      ['training', 'Whether workouts help me or drain me'],
      ['hrv', 'What my HRV actually means'],
      ['pace', 'When I should slow down'],
    ],
  },
  {
    id: 'device',
    prompt: 'What do you use?',
    options: [
      ['watch', 'iPhone + Apple Watch'],
      ['iphone', 'iPhone, no Apple Watch'],
      ['android', 'Android phone'],
    ],
  },
  {
    id: 'overnight',
    prompt: 'Do you wear your Apple Watch to bed?',
    options: [
      ['always', 'Most nights'],
      ['sometimes', 'Sometimes'],
      ['never', 'Never'],
    ],
    when: (a) => a.device === 'watch',
  },
];

// Where the curve peaks (0 = 6am, 1 = midnight). Self-reported, not measured.
const PROFILES: Record<string, { title: string; peak: number | null; flat: 'high' | 'low' | null; body: string }> = {
  morning: {
    title: 'The Morning Rush',
    peak: 0.12, flat: null,
    body: 'You said mornings are when you feel most on edge. Cortisol+ lets you compare each day with your own baseline as it builds, and check whether the night before explains it.',
  },
  afternoon: {
    title: 'The Afternoon Dip',
    peak: 0.5, flat: null,
    body: "You said things build up in the mid-afternoon. Cortisol+ shows your score through the day, with its average, high and low, so you can see whether afternoons really stand out for you.",
  },
  evening: {
    title: 'The Late-Night Wire',
    peak: 0.85, flat: null,
    body: "You said evenings and bedtime are the hardest. Cortisol+ puts your day next to when you fell asleep and what affected last night's sleep score.",
  },
  allday: {
    title: 'The Always-On',
    peak: null, flat: 'high',
    body: "You said it rarely lets up. Cortisol+ shows when your score rises and settles across the day, so you can find the windows that are calmer than they feel.",
  },
  rarely: {
    title: 'The Steady One',
    peak: null, flat: 'low',
    body: "You said you rarely feel wound up. Cortisol+ shows whether your HRV, resting heart rate and sleep agree, so you can spot the days that drift from your usual pattern.",
  },
};

const FOCUS: Record<string, { title: string; body: string; img: string; alt: string }> = {
  night: {
    title: 'Sleep, explained',
    body: "See when you fell asleep, your sleep stages and what affected last night's score.",
    img: '/screenshots/sleep-quality.webp', alt: 'Cortisol+ sleep screen with sleep stages and score factors',
  },
  sleep: {
    title: 'Sleep and recovery side by side',
    body: 'Insights puts sleep duration and quality next to HRV, resting heart rate and VO₂ max for the same day.',
    img: '/screenshots/wearable-insights.webp', alt: 'Cortisol+ Insights screen with sleep and recovery cards',
  },
  training: {
    title: 'Readiness before you train',
    body: 'Weekly readiness, cardio load and your workouts, next to your recovery numbers.',
    img: '/screenshots/wearable-insights.webp', alt: 'Cortisol+ Insights screen with recovery numbers',
  },
  hrv: {
    title: 'Your HRV against your own normal',
    body: 'As your history builds, Cortisol+ compares HRV and resting heart rate with your personal baseline instead of a population average.',
    img: '/start/score-cards.webp', alt: 'Cortisol+ score gauge with HRV and resting heart rate',
  },
  pace: {
    title: 'Your level on your wrist',
    body: 'Watch faces and complications that change with your level, plus one-tap breathing when you need it.',
    img: '/start/score-cards.webp', alt: 'Cortisol+ score gauge with daily average, high and low',
  },
};

const ZEN = {
  title: 'Ask Zen',
  body: "Ask what's driving your score and get an answer from your own numbers, then take a short guided breathing session.",
  img: '/screenshots/zen-ai-assistant.webp', alt: 'Zen answering what is driving the score today',
};

const TOLD_US: Record<string, Record<string, string>> = {
  sleep: { falling: 'Slow to fall asleep', waking: 'Wakes in the night', tired: 'Wakes up tired', good: 'Sleeps well' },
  energy: { dip: 'Afternoon dip', crash: 'Afternoon crash', steady: 'Steady afternoons' },
  coffee: { early: 'Coffee right after waking', twice: 'Two coffee rounds', later: 'Coffee after an hour or two', none: 'No coffee' },
  load: { stretched: 'Stretched thin', empty: 'Running on empty', busy: 'Busy week', ok: 'Manageable week' },
};

function DayCurve({ peak, flat }: { peak: number | null; flat: 'high' | 'low' | null }) {
  const W = 320, H = 120, top = 18, bottom = 92;
  const points = Array.from({ length: 49 }, (_, i) => {
    const x = i / 48;
    let level: number;
    if (flat === 'high') level = 0.72 + 0.06 * Math.sin(x * 11);
    else if (flat === 'low') level = 0.22 + 0.04 * Math.sin(x * 9);
    else level = 0.22 + 0.62 * Math.exp(-((x - (peak ?? 0.5)) ** 2) / 0.012);
    return [x * W, bottom - level * (bottom - top)];
  });
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const marker = peak !== null ? points[Math.round(peak * 48)] : null;
  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Your day as you described it">
        <defs>
          <linearGradient id="curve" x1="0" x2="1">
            <stop offset="0" stopColor="var(--color-teal)" />
            <stop offset="1" stopColor="var(--color-coral)" />
          </linearGradient>
        </defs>
        <line x1="0" x2={W} y1={bottom} y2={bottom} stroke="var(--color-border)" strokeWidth="1" />
        <path d={d} fill="none" stroke="url(#curve)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {marker && <circle cx={marker[0]} cy={marker[1]} r="7" fill="var(--color-coral)" stroke="white" strokeWidth="3" />}
        {['6am', 'Noon', '6pm', 'Midnight'].map((t, i) => (
          <text key={t} x={(i / 3) * W} y={H - 6} fontSize="11" fill="var(--color-ink-muted)" textAnchor={i === 0 ? 'start' : i === 3 ? 'end' : 'middle'}>{t}</text>
        ))}
      </svg>
      <figcaption className="text-xs text-[color:var(--color-ink-muted)] mt-1">As you described it. Not a measurement.</figcaption>
    </figure>
  );
}

const primaryButton = 'w-full inline-flex justify-center items-center px-6 py-4 rounded-full bg-gradient-to-br from-[color:var(--color-teal-dark)] to-[#005a50] text-white font-semibold text-lg shadow-sm hover:brightness-110 transition';

export default function FunnelQuiz() {
  const [step, setStep] = useState<'intro' | 'loading' | 'result' | number>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const visible = QUESTIONS.filter((q) => !q.when || q.when(answers));
  const question = typeof step === 'number' ? visible[step] : null;

  // Move focus to each new screen's heading for screen readers, but not on first load.
  useEffect(() => {
    if (moved.current) heading.current?.focus({ preventScroll: false });
    moved.current = true;
  }, [step]);

  useEffect(() => {
    if (step !== 'loading') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => setStep('result'), reduce ? 300 : 1800);
    return () => window.clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step === 'result') trackFunnel(answers.device === 'watch' ? 'result_watch' : answers.device === 'android' ? 'result_android' : 'result_no_watch');
    else if (typeof step === 'number') trackFunnel(`question_${step + 1}`);
  }, [step]);

  function choose(key: string) {
    if (!question || typeof step !== 'number') return;
    const next = { ...answers, [question.id]: key };
    // Drop answers to questions that no longer apply (e.g. switching away from Apple Watch).
    for (const q of QUESTIONS) if (q.when && !q.when(next)) delete next[q.id];
    setAnswers(next);
    const remaining = QUESTIONS.filter((q) => !q.when || q.when(next));
    window.setTimeout(() => setStep(step + 1 < remaining.length ? step + 1 : 'loading'), 160);
  }

  if (step === 'intro') {
    return (
      <section className="text-center">
        <p className="text-xs uppercase tracking-widest text-[color:var(--color-teal-dark)] font-semibold mb-3">1-minute check-in</p>
        <h1 ref={heading} tabIndex={-1} className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 focus:outline-none">What does your stress rhythm look like?</h1>
        <p className="text-lg text-[color:var(--color-ink-muted)] mb-8">Answer 8 quick questions. Get a picture of your day as you describe it, and see what your Apple Watch can show you about it.</p>
        <div className="mx-auto max-w-sm mb-8 p-5 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-sm">
          <DayCurve peak={0.5} flat={null} />
        </div>
        <button type="button" className={primaryButton} onClick={() => { trackFunnel('start'); setStep(0); }}>Start</button>
        <p className="text-sm text-[color:var(--color-ink-muted)] mt-4">No sign-up. Your answers stay in this browser.</p>
      </section>
    );
  }

  if (question && typeof step === 'number') {
    const progress = (step / visible.length) * 100;
    return (
      <section>
        <div className="flex items-center gap-3 mb-8">
          <button type="button" onClick={() => setStep(step === 0 ? 'intro' : step - 1)} className="p-2 -ml-2 rounded-full text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex-1 h-2 rounded-full bg-[color:var(--color-surface-2)] overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={visible.length} aria-valuenow={step + 1} aria-label={`Question ${step + 1} of ${visible.length}`}>
            <div className="h-full rounded-full bg-[color:var(--color-teal)] transition-all duration-300" style={{ width: `${Math.max(progress, 4)}%` }} />
          </div>
          <span className="text-sm tabular-nums text-[color:var(--color-ink-muted)]">{step + 1}/{visible.length}</span>
        </div>
        <h2 ref={heading} tabIndex={-1} className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 focus:outline-none">{question.prompt}</h2>
        <div className="space-y-3">
          {question.options.map(([key, label]) => {
            const selected = answers[question.id] === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => choose(key)}
                aria-pressed={selected}
                className={`w-full text-left px-5 py-4 rounded-2xl border text-lg transition ${selected ? 'border-[color:var(--color-teal)] bg-[color:var(--color-mint-soft)] font-semibold' : 'border-[color:var(--color-border)] bg-white hover:border-[color:var(--color-teal)]/50'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  if (step === 'loading') {
    return (
      <section className="text-center py-16" aria-live="polite">
        <div className="mx-auto w-14 h-14 rounded-full border-4 border-[color:var(--color-mint)] border-t-[color:var(--color-teal-dark)] animate-spin mb-6" />
        <h2 ref={heading} tabIndex={-1} className="text-2xl font-bold focus:outline-none">Putting your answers together…</h2>
      </section>
    );
  }

  const restart = (
    <button type="button" onClick={() => { setAnswers({}); setStep('intro'); }} className="text-sm text-[color:var(--color-teal-dark)] hover:underline">Start over</button>
  );

  if (answers.device === 'android') {
    return (
      <section className="text-center">
        <h2 ref={heading} tabIndex={-1} className="text-3xl font-bold tracking-tight mb-4 focus:outline-none">Cortisol+ is on Google Play</h2>
        <p className="text-lg text-[color:var(--color-ink-muted)] mb-8">Check the Google Play listing for compatible devices, features and pricing.</p>
        <a href={SITE.googlePlayUrl} className={primaryButton}>View on Google Play</a>
        <div className="mt-6">{restart}</div>
      </section>
    );
  }

  if (answers.device !== 'watch') {
    return (
      <section className="text-center">
        <h2 ref={heading} tabIndex={-1} className="text-3xl font-bold tracking-tight mb-4 focus:outline-none">Cortisol+ on iPhone needs an Apple Watch</h2>
        <p className="text-lg text-[color:var(--color-ink-muted)] mb-8">It reads HRV, resting heart rate and sleep from a paired Apple Watch. Without one, there's nothing for it to score yet.</p>
        <div className="space-y-3 text-left">
          <a href="/resources/stress-sleep-journal/" className="block p-5 rounded-2xl bg-white border border-[color:var(--color-border)] hover:border-[color:var(--color-teal)]/50 transition">
            <div className="font-semibold mb-1">Try the free stress and sleep journal</div>
            <div className="text-[color:var(--color-ink-muted)]">Track your days on paper. No account or subscription needed.</div>
          </a>
          <a href={SITE.substack} target="_blank" rel="noopener" className="block p-5 rounded-2xl bg-white border border-[color:var(--color-border)] hover:border-[color:var(--color-teal)]/50 transition">
            <div className="font-semibold mb-1">Get {SITE.substackName}</div>
            <div className="text-[color:var(--color-ink-muted)]">One short note on stress, sleep or HRV each week. Free.</div>
          </a>
        </div>
        <div className="mt-6">{restart}</div>
      </section>
    );
  }

  const profile = PROFILES[answers.peak] ?? PROFILES.afternoon;
  const focus = FOCUS[answers.focus] ?? FOCUS.sleep;
  const told = Object.entries(TOLD_US).map(([id, labels]) => labels[answers[id]]).filter(Boolean);

  return (
    <section>
      <p className="text-xs uppercase tracking-widest text-[color:var(--color-teal-dark)] font-semibold mb-2">Your rhythm</p>
      <h2 ref={heading} tabIndex={-1} className="text-4xl font-bold tracking-tight mb-4 focus:outline-none">{profile.title}</h2>
      <div className="p-5 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-sm mb-5">
        <DayCurve peak={profile.peak} flat={profile.flat} />
      </div>
      <p className="text-lg leading-relaxed mb-5">{profile.body}</p>
      {told.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-8" aria-label="What you told us">
          {told.map((t) => <li key={t} className="px-3 py-1 rounded-full bg-[color:var(--color-mint-soft)] text-sm text-[color:var(--color-teal-dark)] font-medium">{t}</li>)}
        </ul>
      )}

      <h3 className="text-xl font-bold mb-4">What Cortisol+ can show you</h3>
      <div className="space-y-4 mb-6">
        {[focus, ZEN].map((f) => (
          <div key={f.title} className="flex gap-4 items-center p-4 rounded-2xl bg-white border border-[color:var(--color-border)]">
            <img src={f.img} alt={f.alt} loading="lazy" className={`w-24 h-32 object-cover ${f.img.startsWith('/start/') ? 'object-left-top' : 'object-[center_75%]'} rounded-xl bg-[color:var(--color-surface)] shrink-0`} />
            <div>
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-[color:var(--color-ink-muted)] text-[15px] leading-snug">{f.body}</div>
            </div>
          </div>
        ))}
      </div>

      {answers.overnight !== 'always' && (
        <p className="p-4 rounded-2xl bg-[color:var(--color-coral)]/10 text-[15px] mb-6"><strong>Tip:</strong> wear your Watch overnight. That's where the app gets its most useful data.</p>
      )}

      <div className="sticky bottom-3 z-10 p-4 -mx-4 rounded-3xl bg-white/90 backdrop-blur border border-[color:var(--color-border)] shadow-lg">
        {WEB_CHECKOUT_URL ? (
          <>
            <a href={WEB_CHECKOUT_URL} data-funnel-checkout className={primaryButton}>Start my plan</a>
            <a href={SITE.appStoreUrl} className="block text-center text-sm text-[color:var(--color-teal-dark)] mt-3 hover:underline">or download free on the App Store</a>
          </>
        ) : (
          <>
            <a href={SITE.appStoreUrl} className={primaryButton}>Get Cortisol+ on the App Store</a>
            <p className="text-center text-sm text-[color:var(--color-ink-muted)] mt-2">Free to download. The app shows current pricing and trial eligibility.</p>
          </>
        )}
        <p className="text-center text-xs text-[color:var(--color-ink-muted)] mt-2">★ {APP_RATING.value} on the {APP_RATING.country} App Store ({APP_RATING.count} ratings)</p>
      </div>

      <p className="text-xs text-[color:var(--color-ink-muted)] leading-relaxed mt-6">
        This summary reflects only what you told us. It is not a health assessment. Cortisol+ gives a 0–100 wellness score from a model, not a cortisol measurement. <a href="/how-it-works/" className="underline">How the score works</a>. Your answers stay in this browser.
      </p>
      <div className="mt-4 text-center">{restart}</div>
    </section>
  );
}
