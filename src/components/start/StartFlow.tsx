import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  BUILDING_STEPS,
  CHECKOUT_ENABLED,
  EXERCISE,
  GENDERS,
  GOALS,
  HABITS,
  IMG,
  PERKS,
  PLANS,
  SLEEP,
  SYMPTOMS,
  WATCH_DEVICES,
  devices,
  type Choice,
  type Platform,
  type PlanId,
} from './content';

export interface Review {
  title: string;
  body: string;
  author: string;
  rating: number;
}

interface Props {
  reviews: Review[];
  rating: { value: number; count: number };
  appStoreUrl: string;
  googlePlayUrl: string;
  /** QR code (SVG markup) for cortisolplus.com/download/, shown to desktop visitors. */
  qrSvg: string;
}

interface Answers {
  name: string;
  symptoms: string[];
  goals: string[];
  age: number;
  gender: string;
  heightIn: number;
  weight: number;
  sleep: string;
  exercise: string;
  device: string;
}

const DEFAULT_ANSWERS: Answers = {
  name: '',
  symptoms: [],
  goals: [],
  age: 28,
  gender: '',
  heightIn: 68,
  weight: 160,
  sleep: '',
  exercise: '',
  device: '',
};

const STEPS = [
  'hi', 'name', 'greet', 'symptoms', 'goals', 'explain',
  'edu0', 'edu1', 'edu2', 'edu3', 'edu4', 'edu5', 'edu6', 'edu7',
  'age', 'gender', 'height', 'weight', 'sleep', 'exercise',
  'device', 'social', 'building', 'ready', 'plan', 'paywall', 'exit', 'done',
] as const;
type Step = (typeof STEPS)[number];

const QUESTION_STEPS: Step[] = ['age', 'gender', 'height', 'weight', 'sleep', 'exercise'];
const STORAGE_KEY = 'cp_start_v1';
const PURCHASE_KEY = 'cp_start_purchase_v1';

interface Purchase {
  plan: PlanId;
  email: string | null;
  /** The one-time link that unlocks Pro in the app (rc-9fb3e14b26://…). */
  redeemUrl: string | null;
  /** The same link as an https URL, for a QR code a phone can scan. */
  redeemUrlRedirect?: string | null;
}

function readPurchase(): Purchase | null {
  try {
    const raw = localStorage.getItem(PURCHASE_KEY);
    return raw ? (JSON.parse(raw) as Purchase) : null;
  } catch {
    return null;
  }
}

function writePurchase(purchase: Purchase) {
  try {
    localStorage.setItem(PURCHASE_KEY, JSON.stringify(purchase));
  } catch {
    /* the download screen still shows now; it just won't survive a reload */
  }
}

// ---------------------------------------------------------------- helpers

function readSaved(): { step: Step; answers: Answers } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!STEPS.includes(parsed.step)) return null;
    return { step: parsed.step, answers: { ...DEFAULT_ANSWERS, ...parsed.answers } };
  } catch {
    return null;
  }
}

function save(step: Step, answers: Answers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
  } catch {
    /* private mode or blocked storage: the flow still works, it just won't resume */
  }
}

function detectPlatform(): Platform {
  // ?platform=ios|android previews another phone's version of the flow.
  const forced = new URLSearchParams(location.search).get('platform');
  const value = forced || document.documentElement.dataset.platform;
  return value === 'ios' || value === 'android' ? value : 'other';
}

// Instagram, Facebook and TikTok open links in their own browsers, where
// Apple Pay doesn't work.
function inAppBrowser(): 'instagram' | 'facebook' | 'tiktok' | null {
  const ua = navigator.userAgent;
  if (/Instagram/i.test(ua)) return 'instagram';
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'facebook';
  if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return 'tiktok';
  return null;
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? '';
const money = (n: number) => `$${n.toFixed(2)}`;
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- building blocks

function useTypewriter(text: string, cps = 38, startDelay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now + startDelay;
      const typed = Math.max(0, Math.floor(((now - start) / 1000) * cps));
      setCount(Math.min(text.length, typed));
      if (typed < text.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, cps, startDelay]);
  return { shown: text.slice(0, count), done: count >= text.length };
}

function Typed({ text, cps, delay, className, onDone }: {
  text: string; cps?: number; delay?: number; className?: string; onDone?: () => void;
}) {
  const { shown, done } = useTypewriter(text, cps, delay);
  const fired = useRef(false);
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onDone?.();
    }
  }, [done, onDone]);
  return (
    <p className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      <span aria-hidden="true" className="invisible">{text.slice(shown.length)}</span>
    </p>
  );
}

function PrimaryButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" className="app-btn w-full disabled:opacity-35 disabled:pointer-events-none" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Screen({ children, footer, center }: { children: ReactNode; footer?: ReactNode; center?: boolean }) {
  return (
    <div className={`flex min-h-[calc(100dvh-3.5rem)] flex-col px-5 ${footer ? '' : 'pb-[calc(1.25rem+env(safe-area-inset-bottom))]'}`}>
      <div className={`flex-1 ${center ? 'flex flex-col justify-center' : 'pt-2'}`}>{children}</div>
      {footer && (
        <div className="sticky bottom-0 -mx-5 mt-4 bg-gradient-to-t from-[color:var(--color-sky-bottom)] from-70% to-transparent px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-6">
          {footer}
        </div>
      )}
    </div>
  );
}

function ChoiceList({ options, selected, onToggle, multi }: {
  options: Choice[]; selected: string[]; onToggle: (id: string) => void; multi?: boolean;
}) {
  return (
    <ul className="space-y-2.5" role={multi ? 'group' : 'radiogroup'}>
      {options.map((option) => {
        const on = selected.includes(option.id);
        return (
          <li key={option.id}>
            <button
              type="button"
              role={multi ? 'checkbox' : 'radio'}
              aria-checked={on}
              onClick={() => onToggle(option.id)}
              className={`flex w-full items-center gap-3 rounded-[1.25rem] px-4 text-left font-bold transition active:scale-[0.98] ${
                option.image ? 'min-h-[4.25rem] py-2' : 'min-h-[3.5rem] py-3'
              } ${on ? 'bg-[rgba(18,24,38,0.88)] text-white' : 'app-glass text-[color:var(--color-ink)]'}`}
            >
              {option.image && <img src={option.image} alt="" width="52" height="52" className="h-[3.25rem] w-[3.25rem] shrink-0 object-contain" />}
              <span className="flex-1 text-[1.0625rem] leading-snug">{option.label}</span>
              {multi && (
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-white bg-white text-[color:var(--color-ink)]' : 'border-[rgba(18,24,38,0.25)]'}`} aria-hidden="true">
                  {on && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <h1 className="text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-balance">{children}</h1>;
}

function Slider({ min, max, value, onChange, label, display }: {
  min: number; max: number; value: number; onChange: (v: number) => void; label: string; display: string;
}) {
  return (
    <div className="app-glass mt-10 px-5 py-8 text-center">
      <div className="text-[3.5rem] font-extrabold leading-none tabular-nums tracking-tight">{display}</div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
        className="start-range mt-8 w-full"
      />
      <div className="mt-2 flex justify-between text-sm font-semibold text-[color:var(--color-ink-muted)] tabular-nums">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// A heartbeat line: fast and spiky when stressed, slow and even when calm.
function Ecg({ fast, color }: { fast: boolean; color: string }) {
  const beat = fast ? 18 : 34;
  let d = 'M0,30';
  for (let x = 0; x < 160; x += beat) {
    d += ` L${x + beat * 0.35},30 L${x + beat * 0.45},${fast ? 6 : 12} L${x + beat * 0.55},46 L${x + beat * 0.65},30 L${x + beat},30`;
  }
  return (
    <svg viewBox="0 0 160 52" className="ecg h-12 w-full" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function CompareCard({ tone, label, value, children }: { tone: 'bad' | 'good'; label: string; value: string; children?: ReactNode }) {
  const bad = tone === 'bad';
  return (
    <div className={`app-card flex-1 p-3.5 ${bad ? '' : 'compare-in'}`}>
      <div className={`text-sm font-extrabold ${bad ? 'text-[#e4574c]' : 'text-[#1f9d6b]'}`}>{label}</div>
      <div className={`text-xs font-bold ${bad ? 'text-[#e4574c]' : 'text-[#1f9d6b]'}`}>Cortisol {bad ? '↑' : '↓'}</div>
      <div className="my-2">{children}</div>
      <div className="text-xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}

function SleepStages({ stages, color }: { stages: [string, string, number][]; color: string }) {
  return (
    <div className="space-y-1 text-[10px] font-semibold text-[color:var(--color-ink-muted)]">
      {stages.map(([name, time, pct]) => (
        <div key={name} className="grid grid-cols-[2.6rem_1fr] items-center gap-1">
          <span>{name}</span>
          <span className="relative h-1.5 rounded-full bg-[#eef0f3]">
            <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: color }} title={time} />
          </span>
        </div>
      ))}
    </div>
  );
}

function WatchFace({ platform }: { platform: Platform }) {
  const states = [
    { score: 22, band: 'Low', color: '#34c759', hrv: 54, rhr: 65 },
    { score: 55, band: 'Elevated', color: '#ff9500', hrv: 38, rhr: 76 },
    { score: 72, band: 'High', color: '#ff3b30', hrv: 29, rhr: 81 },
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % states.length), 2000);
    return () => clearInterval(id);
  }, []);
  const s = states[index];
  const round = platform === 'android';
  return (
    <div className={`mx-auto grid h-44 w-40 place-items-center bg-[#0f1419] text-white ring-[6px] ring-[#2a2f35] shadow-xl ${round ? 'rounded-full h-44 w-44' : 'rounded-[2.4rem]'}`}>
      <div className="text-center">
        <div className="text-[10px] font-semibold text-white/60">9:41</div>
        <div className="text-[9px] font-bold tracking-[0.2em] text-white/60">CORTISOL</div>
        <div className="text-5xl font-extrabold leading-none tabular-nums transition-colors" style={{ color: s.color }}>{s.score}</div>
        <div className="text-xs font-extrabold" style={{ color: s.color }}>{s.band}</div>
        <div className="mt-1 text-[10px] font-semibold text-white/70 tabular-nums">HRV {s.hrv} · RHR {s.rhr}</div>
        <div className="text-[9px] text-white/50">Updated just now</div>
      </div>
    </div>
  );
}

// Stars filled to the real rating (4.4 shows four and a half), never rounded up to five.
function Stars({ className = 'h-5 w-5', value = 5 }: { className?: string; value?: number }) {
  const star = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z';
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block">
            <svg viewBox="0 0 24 24" className={`${className} text-[rgba(18,24,38,0.15)]`} fill="currentColor"><path d={star} /></svg>
            <svg viewBox="0 0 24 24" className={`${className} absolute inset-0 text-[#fbbf24]`} fill="currentColor" style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}><path d={star} /></svg>
          </span>
        );
      })}
    </span>
  );
}

function StoreButton({ platform, appStoreUrl, googlePlayUrl }: { platform: Platform; appStoreUrl: string; googlePlayUrl: string }) {
  const apple = (
    <a href={appStoreUrl} className="app-btn w-full" data-event="appstore-click">
      <svg viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5" aria-hidden="true"><path d="M17.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.7 1.3-.1 1.8-.9 3.4-.9 1.6 0 2 .9 3.4.9 1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-3 1.4-3.1-.1 0-2.7-1-2.7-4.1zM15 4.6c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.2 1.1.1 2.3-.6 3-1.4z" /></svg>
      Download on the App Store
    </a>
  );
  const google = (
    <a href={googlePlayUrl} className="app-btn w-full">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M5 3.5v17l15-8.5z" /></svg>
      Get it on Google Play
    </a>
  );
  if (platform === 'ios') return apple;
  if (platform === 'android') return google;
  return <div className="grid gap-2.5">{apple}{google}</div>;
}

// ---------------------------------------------------------------- the flow

export default function StartFlow({ reviews, rating, appStoreUrl, googlePlayUrl, qrSvg }: Props) {
  const [step, setStep] = useState<Step>('hi');
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [platform, setPlatform] = useState<Platform>('other');
  const [webview, setWebview] = useState<ReturnType<typeof inAppBrowser>>(null);
  const [history, setHistory] = useState<Step[]>([]);
  const [ready, setReady] = useState(false); // per-screen "typing finished" gate
  const [plan, setPlan] = useState<PlanId>('yearly');
  const [exitOfferSeen, setExitOfferSeen] = useState(false);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPlatform(detectPlatform());
    setWebview(inAppBrowser());
    const saved = readSaved();
    const bought = readPurchase();
    if (bought) {
      // Someone who already paid always lands back on their download screen.
      setPurchase(bought);
      if (saved) setAnswers(saved.answers);
      setStep('done');
    } else if (saved && saved.step !== 'done') {
      setAnswers(saved.answers);
      setStep(saved.step);
    }
  }, []);

  useEffect(() => {
    save(step, answers);
    setReady(false);
    window.scrollTo({ top: 0 });
  }, [step]);

  useEffect(() => save(step, answers), [answers]);

  // The checkout code is large; start fetching it once the paywall is near.
  useEffect(() => {
    if (step === 'plan' || step === 'paywall') void import('./checkout');
  }, [step]);

  const update = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));
  const go = (next: Step) => {
    setHistory((h) => [...h, step]);
    setStep(next);
  };
  const back = () => {
    // Like the app, the first back-out from the paywall gets the one-time offer.
    if (step === 'paywall' && !exitOfferSeen) {
      setExitOfferSeen(true);
      go('exit');
      return;
    }
    setHistory((h) => {
      const prev = h[h.length - 1];
      if (prev) setStep(prev);
      return h.slice(0, -1);
    });
  };
  const next = () => {
    let i = STEPS.indexOf(step) + 1;
    if (STEPS[i] === 'greet' && !answers.name.trim()) i += 1;
    go(STEPS[i]);
  };

  const name = firstName(answers.name);
  const wearsWatch = WATCH_DEVICES.has(answers.device);
  const markReady = useMemo(() => () => setReady(true), []);
  const progress = (STEPS.indexOf(step) + 1) / STEPS.length;
  const qIndex = QUESTION_STEPS.indexOf(step);

  // ------------------------------------------------------------ checkout
  // Everyone checks out without an account. RevenueCat returns a one-time
  // redemption link (also emailed) that opens the app and unlocks Pro on
  // whatever account the app is using. Sign-in on the web can come later.
  const startCheckout = (chosen: PlanId) => {
    setPlan(chosen);
    setError('');
    if (!CHECKOUT_ENABLED) {
      go('done');
      return;
    }
    void pay(chosen);
  };

  const pay = async (chosen: PlanId) => {
    setBusy(true);
    setError('');
    try {
      const { checkout } = await import('./checkout');
      const result = await checkout(chosen, {
        $displayName: answers.name.trim(),
        web_device: answers.device,
        web_goals: answers.goals.join(','),
        web_symptoms: answers.symptoms.join(','),
        web_platform: platform,
      });
      if (result.status === 'purchased') {
        const bought: Purchase = {
          plan: chosen,
          email: result.email ?? null,
          redeemUrl: result.redeemUrl ?? null,
          redeemUrlRedirect: result.redeemUrlRedirect ?? null,
        };
        writePurchase(bought);
        setPurchase(bought);
        go('done');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // On a computer the unlock link can't open the phone app, so show it as a
  // QR code to scan with the phone once Cortisol+ is installed.
  const [unlockQr, setUnlockQr] = useState('');
  useEffect(() => {
    const target = purchase?.redeemUrlRedirect;
    if (step !== 'done' || platform !== 'other' || !target) return;
    let live = true;
    import('qrcode')
      .then((QR) => QR.toString(target, { type: 'svg', margin: 0, color: { dark: '#121826', light: '#ffffff' } }))
      .then((svg) => live && setUnlockQr(svg))
      .catch(() => undefined);
    return () => { live = false; };
  }, [step, platform, purchase]);

  const toggle = (key: 'symptoms' | 'goals', id: string) =>
    update({ [key]: answers[key].includes(id) ? answers[key].filter((x) => x !== id) : [...answers[key], id] });
  const pickAndAdvance = (key: 'gender' | 'sleep' | 'exercise' | 'device', id: string) => {
    update({ [key]: id });
    setTimeout(next, prefersReducedMotion() ? 0 : 320);
  };

  // ------------------------------------------------------------ top bar
  const showBack = (history.length > 0 || step === 'paywall') && !['building', 'ready', 'plan', 'exit', 'done'].includes(step);
  const topBar = (
    <div className="sticky top-0 z-10 flex h-14 items-center gap-3 px-3">
      <button
        type="button"
        onClick={back}
        aria-label="Back"
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full app-glass ${showBack ? '' : 'invisible'}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      {qIndex >= 0 ? (
        <div className="flex flex-1 gap-1.5" aria-label={`Question ${qIndex + 1} of ${QUESTION_STEPS.length}`}>
          {QUESTION_STEPS.map((s, i) => (
            <span key={s} className={`h-1.5 flex-1 rounded-full ${i <= qIndex ? 'bg-[rgba(18,24,38,0.85)]' : 'bg-white/60'}`} />
          ))}
        </div>
      ) : (
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/50" aria-hidden="true">
          <div className="h-full rounded-full bg-[color:var(--color-teal)] transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
      <span className="w-10 shrink-0" />
    </div>
  );

  // ------------------------------------------------------------ screens
  let screen: ReactNode = null;

  switch (step) {
    case 'hi':
      screen = (
        <Screen
          footer={
            <>
              <PrimaryButton onClick={next} disabled={!ready}>Hi Zen</PrimaryButton>
              <a href={platform === 'android' ? googlePlayUrl : appStoreUrl} className="mt-4 block text-center text-sm font-bold text-[color:var(--color-ink)]/70 underline underline-offset-2">
                I already have an account
              </a>
            </>
          }
        >
          {webview && (
            <div className="app-card mb-4 p-4 text-sm leading-relaxed">
              <strong>Tip:</strong> for Apple Pay and a smoother checkout, open this page in {platform === 'android' ? 'Chrome' : 'Safari'}.
              {webview === 'tiktok' ? ' Tap ••• then “Open in browser”.' : ' Tap ••• at the top right, then “Open in external browser”.'}
            </div>
          )}
          <div className="overflow-hidden rounded-[2rem] bg-[#c7e2dc] shadow-[0_18px_40px_-24px_rgba(40,96,140,0.55)]">
            <video src="/app-ui/start/zen_wave.mp4" autoPlay muted playsInline className="h-[42dvh] w-full object-cover object-top" aria-label="Zen waving hello" />
          </div>
          <Typed text="Hi, I'm Zen" cps={48} className="mt-6 text-[2rem] font-extrabold tracking-tight" />
          <Typed
            text="Your personal cortisol coach — I turn your daily scans into calmer, lower-stress days."
            cps={60}
            delay={500}
            className="mt-2 text-lg font-semibold leading-snug text-[color:var(--color-ink)]/75"
            onDone={markReady}
          />
        </Screen>
      );
      break;

    case 'name':
      screen = (
        <Screen
          footer={
            answers.name.trim()
              ? <PrimaryButton onClick={next}>Continue</PrimaryButton>
              : <button type="button" onClick={() => go('symptoms')} className="block w-full py-3 text-center font-bold text-[color:var(--color-ink)]/70">Skip</button>
          }
        >
          <img src="/app-ui/zen_greet.webp" alt="" width="306" height="480" className="mx-auto mt-4 h-40 w-auto" />
          <Typed text="...and who are you?" className="mt-6 text-[1.75rem] font-extrabold tracking-tight" />
          <p className="mt-1 text-[color:var(--color-ink-muted)]">Enter the name you would like to go by.</p>
          <form onSubmit={(event) => { event.preventDefault(); if (answers.name.trim()) next(); }}>
            <input
              type="text"
              autoComplete="given-name"
              placeholder="Name"
              value={answers.name}
              onChange={(event) => update({ name: event.target.value.slice(0, 40) })}
              className="app-glass mt-6 h-14 w-full px-5 text-lg font-bold outline-none placeholder:text-[color:var(--color-ink)]/35 focus:ring-2 focus:ring-[color:var(--color-teal)]"
            />
          </form>
        </Screen>
      );
      break;

    case 'greet':
      screen = (
        <Screen center footer={<PrimaryButton onClick={next} disabled={!ready}>Let's go</PrimaryButton>}>
          <div className="overflow-hidden rounded-[2rem] bg-[#c7e2dc]">
            <video src="/app-ui/start/zen_wave.mp4" autoPlay muted playsInline className="h-[48dvh] w-full object-cover object-top" aria-hidden="true" />
          </div>
          <Typed text={`Let's get to know each other, ${name}!`} className="mt-6 text-[1.75rem] font-extrabold leading-tight tracking-tight" onDone={markReady} />
        </Screen>
      );
      break;

    case 'symptoms':
      screen = (
        <Screen
          footer={
            <>
              <PrimaryButton onClick={next} disabled={answers.symptoms.length === 0}>Continue</PrimaryButton>
              <button type="button" onClick={() => { update({ symptoms: [] }); next(); }} className="mt-2 block w-full py-2 text-center text-sm font-bold text-[color:var(--color-ink)]/70">None of these</button>
            </>
          }
        >
          <Title>First — which of these sound like you?</Title>
          <div className="mt-6"><ChoiceList multi options={SYMPTOMS} selected={answers.symptoms} onToggle={(id) => toggle('symptoms', id)} /></div>
        </Screen>
      );
      break;

    case 'goals':
      screen = (
        <Screen footer={<PrimaryButton onClick={next} disabled={answers.goals.length === 0}>Done</PrimaryButton>}>
          <Title>What's your main goal?</Title>
          <div className="mt-6"><ChoiceList multi options={GOALS} selected={answers.goals} onToggle={(id) => toggle('goals', id)} /></div>
        </Screen>
      );
      break;

    case 'explain':
      screen = (
        <Screen center footer={<PrimaryButton onClick={next} disabled={!ready}>Sounds Great!</PrimaryButton>}>
          <img src={IMG('zen_explain')} alt="" width="480" height="480" className="mx-auto h-64 w-auto" />
          <Typed text="Great! Now that I have a little insight, let me explain what I do." className="mt-6 text-center text-[1.5rem] font-extrabold leading-snug tracking-tight" onDone={markReady} />
        </Screen>
      );
      break;

    case 'edu0':
    case 'edu1':
    case 'edu2':
    case 'edu3':
    case 'edu4':
    case 'edu5':
    case 'edu6':
    case 'edu7': {
      const slide = Number(step.slice(3));
      const watchLine = platform === 'android'
        ? 'I track all three from your Wear OS watch or Health Connect — and your companion shows your stress right on your wrist.'
        : 'I track all three from your Apple Watch — and your companion shows your stress right on your wrist.';
      const slides: { text: string; second?: string; button: string; visual: ReactNode }[] = [
        {
          text: "This is cortisol — your body's main stress hormone.",
          button: 'What does it do?',
          visual: <img src={IMG('cortisol_scene')} alt="Zen explaining cortisol at a chalkboard" width="480" height="480" className="mx-auto h-64 w-auto" />,
        },
        {
          text: 'High cortisol leads to weight gain and faster aging.',
          second: "But don't worry — we help you keep it low.",
          button: 'Show Me How',
          visual: (
            <div className="flex items-end justify-center gap-3">
              <img src={IMG('effect_fat')} alt="" width="240" height="240" className="-mb-0 h-44 w-auto -translate-y-4" />
              <img src={IMG('effect_old')} alt="" width="240" height="240" className="h-44 w-auto" />
            </div>
          ),
        },
        {
          text: 'There are 3 signals I watch most to keep it in check:',
          button: "Let's see",
          visual: (
            <div>
              <img src={IMG('zen_presenting')} alt="" width="480" height="480" className="mx-auto h-52 w-auto" />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[['Resting HR', 'metric_rhr'], ['Sleep', 'metric_sleep'], ['Recovery (HRV)', 'metric_hrv']].map(([label, icon]) => (
                  <span key={label} className="app-glass inline-flex items-center gap-1.5 !rounded-full py-1.5 pl-1.5 pr-3.5 text-sm font-extrabold">
                    <img src={IMG(icon)} alt="" width="28" height="28" className="h-7 w-7 object-contain" />{label}
                  </span>
                ))}
              </div>
            </div>
          ),
        },
        {
          text: 'A high resting heart rate keeps you in stress mode, driving cortisol high.',
          second: 'A healthy resting heart rate sits between 50 and 70 bpm.',
          button: 'Next',
          visual: (
            <div className="flex gap-3">
              <CompareCard tone="bad" label="Elevated" value="84 bpm"><Ecg fast color="#e4574c" /></CompareCard>
              <CompareCard tone="good" label="Healthy" value="58 bpm"><Ecg fast={false} color="#1f9d6b" /></CompareCard>
            </div>
          ),
        },
        {
          text: '6 or less hours of sleep spikes cortisol — your body never fully resets.',
          second: "Aim for 7 to 9 hours a night — that's the sweet spot.",
          button: 'Next',
          visual: (
            <div className="flex gap-3">
              <CompareCard tone="bad" label="Deprived" value="5 hrs">
                <div className="mb-1.5 text-lg font-extrabold">54 <span className="text-xs text-[#e4574c]">Poor</span></div>
                <SleepStages color="#e4574c" stages={[['Awake', '48m', 16], ['Deep', '19m', 7], ['REM', '1h 02m', 21], ['Light', '3h 22m', 67]]} />
              </CompareCard>
              <CompareCard tone="good" label="Rested" value="8 hrs">
                <div className="mb-1.5 text-lg font-extrabold">97 <span className="text-xs text-[#1f9d6b]">Excellent</span></div>
                <SleepStages color="#1f9d6b" stages={[['Awake', '11m', 4], ['Deep', '1h 42m', 21], ['REM', '2h 09m', 27], ['Light', '4h 06m', 51]]} />
              </CompareCard>
            </div>
          ),
        },
        {
          text: 'Low HRV means poor recovery, increasing cortisol.',
          second: 'Higher HRV means better recovery — a healthy range is about 40 to 80 ms.',
          button: 'Next',
          visual: (
            <div className="flex gap-3">
              <CompareCard tone="bad" label="Low" value="24 ms">
                <Ecg fast color="#e4574c" />
                <div className="flex justify-between text-[9px] font-bold text-[color:var(--color-ink-muted)] tabular-nums"><span>768</span><span>793</span><span>769</span><span>745</span></div>
              </CompareCard>
              <CompareCard tone="good" label="Strong" value="62 ms">
                <Ecg fast={false} color="#1f9d6b" />
                <div className="flex justify-between text-[9px] font-bold text-[color:var(--color-ink-muted)] tabular-nums"><span>808</span><span>872</span><span>812</span><span>750</span></div>
              </CompareCard>
            </div>
          ),
        },
        {
          text: watchLine,
          button: 'Love it',
          visual: <WatchFace platform={platform} />,
        },
        {
          text: "Now you know what drives cortisol the most — let's work towards improving it. We can start by building your profile.",
          button: "Let's go",
          visual: (
            <div className="overflow-hidden rounded-[2rem] bg-[#c7e2dc]">
              <video src="/app-ui/start/zen_wave.mp4" autoPlay muted playsInline className="aspect-[828/1108] max-h-[40dvh] w-full object-cover object-top" aria-hidden="true" />
            </div>
          ),
        },
      ];
      const s = slides[slide];
      screen = (
        <Screen
          key={step}
          footer={
            <>
              <div className="mb-4 flex justify-center gap-1.5" aria-label={`Slide ${slide + 1} of ${slides.length}`}>
                {slides.map((_, i) => (
                  <span key={i} className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-[rgba(18,24,38,0.85)]' : 'w-2 bg-white/70'}`} />
                ))}
              </div>
              <PrimaryButton onClick={next} disabled={!ready}>{s.button}</PrimaryButton>
            </>
          }
        >
          <div className="flex min-h-[46dvh] flex-col justify-center">{s.visual}</div>
          <Typed text={s.text} className="mt-6 text-[1.375rem] font-extrabold leading-snug tracking-tight" onDone={s.second ? undefined : markReady} />
          {s.second && (
            <Typed text={s.second} delay={s.text.length / 0.038 + 800} className="mt-3 text-[1.125rem] font-bold leading-snug text-[color:var(--color-ink)]/70" onDone={markReady} />
          )}
        </Screen>
      );
      break;
    }

    case 'age':
      screen = (
        <Screen footer={<PrimaryButton onClick={next}>Continue</PrimaryButton>}>
          <Title>How old are you?</Title>
          <Slider min={13} max={100} value={answers.age} onChange={(age) => update({ age })} label="Age" display={String(answers.age)} />
        </Screen>
      );
      break;

    case 'gender':
      screen = (
        <Screen>
          <Title>What's your gender?</Title>
          <div className="mt-6"><ChoiceList options={GENDERS} selected={[answers.gender]} onToggle={(id) => pickAndAdvance('gender', id)} /></div>
        </Screen>
      );
      break;

    case 'height':
      screen = (
        <Screen footer={<PrimaryButton onClick={next}>Continue</PrimaryButton>}>
          <Title>What's your height?</Title>
          <Slider
            min={48}
            max={95}
            value={answers.heightIn}
            onChange={(heightIn) => update({ heightIn })}
            label="Height in inches"
            display={`${Math.floor(answers.heightIn / 12)}′ ${answers.heightIn % 12}″`}
          />
        </Screen>
      );
      break;

    case 'weight':
      screen = (
        <Screen footer={<PrimaryButton onClick={next}>Continue</PrimaryButton>}>
          <Title>What's your weight range?</Title>
          <Slider min={80} max={400} value={answers.weight} onChange={(weight) => update({ weight })} label="Weight in pounds" display={`${answers.weight} lbs`} />
        </Screen>
      );
      break;

    case 'sleep':
      screen = (
        <Screen>
          <Title>How many hours do you typically sleep?</Title>
          <div className="mt-6"><ChoiceList options={SLEEP} selected={[answers.sleep]} onToggle={(id) => pickAndAdvance('sleep', id)} /></div>
        </Screen>
      );
      break;

    case 'exercise':
      screen = (
        <Screen>
          <Title>How often do you exercise?</Title>
          <div className="mt-6"><ChoiceList options={EXERCISE} selected={[answers.exercise]} onToggle={(id) => pickAndAdvance('exercise', id)} /></div>
        </Screen>
      );
      break;

    case 'device': {
      // The app's "Connect Your Device" screen. Picking happens here; the
      // actual connection happens in the app after sign-in.
      const options = devices(platform);
      const selected = answers.device && answers.device !== 'none' ? answers.device : options[0].id;
      const healthApp = platform === 'android' ? 'Health Connect' : 'Apple Health';
      const isWatch = WATCH_DEVICES.has(selected);
      const checklist = isWatch
        ? ['Device paired & worn recently', 'Heart rate data available', `${healthApp} access permission`, 'Stress companion on your watch']
        : [`Device syncs to ${healthApp}`, 'Heart rate data available', `${healthApp} access permission`];
      screen = (
        <Screen footer={
          <>
            <PrimaryButton onClick={() => { update({ device: selected }); next(); }}>Continue</PrimaryButton>
            <button type="button" onClick={() => { update({ device: 'none' }); next(); }} className="mt-2 block w-full py-2 text-center text-sm font-bold text-[color:var(--color-ink)]/70">Continue without device</button>
          </>
        }>
          <img src={IMG('zen_watch')} alt="" width="480" height="480" className="mx-auto h-40 w-auto" />
          <div className="text-center">
            <Title>Which device will you use with Cortisol+?</Title>
            <p className="mt-1 font-semibold text-[color:var(--color-ink)]/70">Pick the watch or ring you'll connect in the app, so I can set up your plan around it.</p>
          </div>
          <label className="app-glass mt-5 flex h-14 items-center gap-2 !rounded-full px-5">
            <span className="sr-only">Your device</span>
            <select
              value={selected}
              onChange={(event) => update({ device: event.target.value })}
              className="h-full flex-1 appearance-none bg-transparent text-lg font-extrabold outline-none"
            >
              {options.filter((o) => o.id !== 'none').map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </label>
          <ul className="app-card mt-4 space-y-3 p-4">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-3 font-bold">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[color:var(--color-teal)] text-white" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-xs font-semibold text-[color:var(--color-ink)]/60">You'll connect it in the app in a couple of taps. We only read the data you allow.</p>
        </Screen>
      );
      break;
    }

    case 'social':
      screen = <SocialProof reviews={reviews} rating={rating} platform={platform} onContinue={next} />;
      break;

    case 'building':
      screen = <Building onDone={() => go('ready')} />;
      break;

    case 'ready':
      screen = (
        <Screen center footer={<PrimaryButton onClick={next}>See my plan</PrimaryButton>}>
          <div className="text-center">
            <img src="/app-ui/zen_celebrate.webp" alt="" width="495" height="480" className="confetti-pop mx-auto h-52 w-auto" />
            <span className="mt-4 inline-block rounded-full bg-[color:var(--color-teal)]/20 px-3 py-1 text-xs font-extrabold tracking-wider text-[color:var(--color-teal-dark)]">PLAN READY</span>
            <Title>You're all set!</Title>
            <p className="mt-2 text-lg font-semibold text-[color:var(--color-ink)]/70">Your personal plan to bring your cortisol down is ready.</p>
          </div>
        </Screen>
      );
      break;

    case 'plan':
      screen = <PlanReveal name={name} wearsWatch={wearsWatch} onCommit={next} />;
      break;

    case 'paywall':
      screen = <Paywall plan={plan === 'yearlyExit' ? 'yearly' : plan} setPlan={setPlan} rating={rating} onBuy={() => startCheckout(plan === 'yearlyExit' ? 'yearly' : plan)} busy={busy} error={error} webview={webview} platform={platform} />;
      break;

    case 'exit': {
      const regular = PLANS.yearly.price;
      const offer = PLANS.yearlyExit.price;
      const pct = Math.round((1 - offer / regular) * 100);
      screen = (
        <Screen center footer={
          <>
            <PrimaryButton onClick={() => startCheckout('yearlyExit')} disabled={busy}>{busy ? 'Opening checkout…' : 'Claim My Offer'}</PrimaryButton>
            {error && <p className="mt-2 text-center text-sm font-bold text-[#c0392b]" role="alert">{error}</p>}
            <button type="button" onClick={() => { setHistory((h) => h.slice(0, -1)); setStep('paywall'); }} className="mt-2 block w-full py-2 text-center text-sm font-bold text-[color:var(--color-ink)]/60">No thanks</button>
            <p className="mt-1 text-center text-xs text-[color:var(--color-ink-muted)]">You'll be charged {money(offer)} today and every year until you cancel.</p>
          </>
        }>
          <div className="text-center">
            <span className="inline-block rounded-full bg-[rgba(18,24,38,0.9)] px-3 py-1 text-[11px] font-extrabold tracking-wider text-white">EXCLUSIVE — ONE-TIME OFFER</span>
            <img src="/app-ui/zen_new_normal.webp" alt="" width="342" height="480" className="confetti-pop mx-auto mt-4 h-40 w-auto" />
            <Title>Wait! Is price your hold-up?</Title>
            <p className="mt-2 font-semibold text-[color:var(--color-ink)]/70">
              An exclusive discount, just for you. <strong className="text-[color:var(--color-ink)]">This is the only time you'll see this offer.</strong>
            </p>
          </div>
          <div className="relative mt-6 rounded-[1.5rem] border-[2.5px] border-[rgba(18,24,38,0.9)] bg-white/95 p-5">
            <span className="absolute -top-3 right-4 rounded-full bg-[color:var(--color-teal)] px-2.5 py-0.5 text-xs font-extrabold text-[color:var(--color-ink)]">SAVE {pct}%</span>
            <div className="text-sm font-extrabold">Yearly</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-[color:var(--color-ink-muted)] line-through tabular-nums">{money(regular)}</span>
              <span className="text-3xl font-extrabold tabular-nums">{money(offer)}</span>
              <span className="text-sm font-bold text-[color:var(--color-ink-muted)]">per year</span>
            </div>
          </div>
        </Screen>
      );
      break;
    }

    case 'done': {
      const store = platform === 'android' ? 'Google Play' : 'the App Store';
      const unlockUrl = purchase?.redeemUrl ?? null;
      const steps = [
        { title: 'Download Cortisol+', body: platform === 'other' ? 'Free on the App Store and Google Play.' : `Free on ${store}.` },
        platform === 'other'
          ? { title: 'Scan the unlock code with that phone', body: 'It opens Cortisol+ and turns on your subscription. We emailed you the same link.' }
          : { title: 'Tap "Unlock Pro" on this phone', body: 'It opens Cortisol+ and turns on your subscription. We emailed you the same link.' },
        {
          title: wearsWatch ? 'Connect your watch' : platform === 'android' ? 'Connect Health Connect' : platform === 'ios' ? 'Connect Apple Health' : 'Connect your health data',
          body: `Allow ${platform === 'android' ? 'Health Connect' : platform === 'ios' ? 'Apple Health' : 'Apple Health or Health Connect'} so Zen can read heart rate, HRV and sleep.`,
        },
      ];
      screen = (
        <Screen
          footer={
            platform === 'other' ? undefined : (
              <>
                <StoreButton platform={platform} appStoreUrl={appStoreUrl} googlePlayUrl={googlePlayUrl} />
                {unlockUrl ? (
                  <a href={unlockUrl} className="app-btn app-btn--light mt-2.5 w-full">Unlock Pro in the app</a>
                ) : (
                  <a href={platform === 'android' ? appStoreUrl : googlePlayUrl} className="mt-3 block text-center text-sm font-bold text-[color:var(--color-ink)]/60 underline underline-offset-2">
                    {platform === 'android' ? 'On iPhone? Get it on the App Store' : 'On Android? Get it on Google Play'}
                  </a>
                )}
              </>
            )
          }
        >
          {!purchase && (
            <p className="mx-auto mb-3 w-fit rounded-full bg-[#fff4e0] px-3 py-1 text-xs font-extrabold text-[#8a4b00]">
              Sample screen · nothing was charged
            </p>
          )}
          <div className="text-center">
            <img src="/app-ui/zen_celebrate.webp" alt="" width="495" height="480" className="confetti-pop mx-auto h-32 w-auto" />
            <span className="mt-2 inline-block rounded-full bg-[color:var(--color-teal)]/20 px-3 py-1 text-xs font-extrabold tracking-wider text-[color:var(--color-teal-dark)]">PRO UNLOCKED</span>
            <Title>{name ? `You're in, ${name}!` : "You're in!"}</Title>
            <p className="mt-1 font-semibold text-[color:var(--color-ink)]/70">Get the app to start tracking your stress.</p>
          </div>

          {platform === 'other' && (
            <div className="app-card mt-5 flex items-center gap-4 p-4">
              <div className="h-28 w-28 shrink-0 rounded-xl bg-white p-2" aria-label="QR code to download Cortisol+" role="img" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <div>
                <div className="font-extrabold">1. Get the app</div>
                <p className="text-sm leading-snug text-[color:var(--color-ink-muted)]">Point your phone's camera here to download Cortisol+ on your iPhone or Android.</p>
              </div>
            </div>
          )}
          {platform === 'other' && unlockQr && (
            <div className="app-card mt-3 flex items-center gap-4 p-4">
              <div className="h-28 w-28 shrink-0 rounded-xl bg-white p-2" aria-label="QR code that unlocks Pro in the app" role="img" dangerouslySetInnerHTML={{ __html: unlockQr }} />
              <div>
                <div className="font-extrabold">2. Then scan to unlock Pro</div>
                <p className="text-sm leading-snug text-[color:var(--color-ink-muted)]">Once Cortisol+ is installed, scan this with the same phone. The link works once and expires in an hour; your email has a fresh one.</p>
              </div>
            </div>
          )}

          <ol className="mt-5 space-y-3">
            {steps.map((item, i) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${i === 0 ? 'bg-[rgba(18,24,38,0.88)] text-white' : 'bg-white/80 text-[color:var(--color-ink)]'}`}>{i + 1}</span>
                <div className="pt-0.5">
                  <div className="font-extrabold leading-tight">{item.title}</div>
                  <p className="text-sm leading-snug text-[color:var(--color-ink-muted)]">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {purchase && (
            <div className="app-glass mt-5 p-4 text-sm leading-relaxed">
              <div className="font-extrabold">Not brought right in?</div>
              <p className="text-[color:var(--color-ink)]/75">
                {platform === 'other' ? 'Scan the unlock code again' : <>Tap <strong>Unlock Pro in the app</strong> again</>}, or use the link in your email. Once Pro is unlocked, you can always get it back with <strong>Restore Purchases</strong> in the app.
              </p>
            </div>
          )}

          {platform === 'other' && (
            <div className="mt-6 grid gap-2.5">
              <StoreButton platform={platform} appStoreUrl={appStoreUrl} googlePlayUrl={googlePlayUrl} />
            </div>
          )}
        </Screen>
      );
      break;
    }
  }

  return (
    <div className="start-flow">
      {topBar}
      <div key={step} className="start-screen">{screen}</div>
    </div>
  );
}

// ---------------------------------------------------------------- larger screens

function SocialProof({ reviews, rating, platform, onContinue }: { reviews: Review[]; rating: Props['rating']; platform: Platform; onContinue: () => void }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion() || reviews.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 3500);
    return () => clearInterval(id);
  }, [reviews.length]);
  const review = reviews[index];
  const badges = [
    ['Private', 'On-Device', 'trust_lock'],
    [platform === 'android' ? 'Wear OS' : 'Apple', 'Watch', 'trust_watch'],
    ['AI', 'Powered', 'trust_ai'],
  ];
  return (
    <Screen footer={<PrimaryButton onClick={onContinue}>Continue</PrimaryButton>}>
      <div className="text-center">
        <Title>People Love Cortisol+</Title>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Stars className="h-7 w-7" value={rating.value} />
          <span className="text-3xl font-extrabold tabular-nums">{rating.value}</span>
        </div>
        <p className="mt-1 text-sm font-semibold text-[color:var(--color-ink-muted)]">{rating.count} ratings on the US App Store</p>
      </div>
      {review && (
        <figure key={index} className="app-card start-screen mt-6 p-5">
          <Stars className="h-4 w-4" value={review.rating} />
          <div className="mt-2 font-extrabold">{review.title}</div>
          <blockquote className="mt-1 line-clamp-5 leading-relaxed text-[color:var(--color-ink-muted)]">“{review.body}”</blockquote>
          <figcaption className="mt-3 text-sm font-bold">{review.author} <span className="font-semibold text-[color:var(--color-ink-muted)]">· App Store review</span></figcaption>
        </figure>
      )}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {badges.map(([top, bottom, icon]) => (
          <div key={icon} className="app-glass flex flex-col items-center gap-1 px-2 py-3 text-center">
            <img src={IMG(icon)} alt="" width="36" height="36" className="h-9 w-9 object-contain" />
            <span className="text-xs font-extrabold leading-tight">{top}<br />{bottom}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function Building({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const duration = prefersReducedMotion() ? 600 : 4000;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setPct(p);
      if (p < 1) frame = requestAnimationFrame(tick);
      else setTimeout(onDone, 400);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);
  const label = BUILDING_STEPS[Math.min(BUILDING_STEPS.length - 1, Math.floor(pct * BUILDING_STEPS.length))];
  return (
    <Screen center>
      <div className="overflow-hidden rounded-[2rem] shadow-[0_18px_40px_-24px_rgba(40,96,140,0.55)]">
        <video src="/app-ui/start/zen_plan.mp4" autoPlay muted loop playsInline className="aspect-[1104/832] w-full object-cover" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-center text-[1.625rem] font-extrabold tracking-tight">Optimizing your personal plan</h1>
      <p className="text-center font-semibold text-[color:var(--color-ink-muted)]">Dedicated for you</p>
      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/70" role="progressbar" aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[color:var(--color-teal)]" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-sm font-bold">
        <span aria-live="polite">{label}</span>
        <span className="tabular-nums">{Math.round(pct * 100)}%</span>
      </div>
    </Screen>
  );
}

function PlanReveal({ name, wearsWatch, onCommit }: { name: string; wearsWatch: boolean; onCommit: () => void }) {
  const habits = HABITS.filter((h) => !h.watchOnly || wearsWatch);
  // The app's fixed "projected path" curve: high on the left, low on the right.
  const pts = [[5, 16], [34, 34], [64, 60], [95, 82]].map(([x, y]) => [x * 3, y * 1.4]);
  const line = `M${pts[0][0]},${pts[0][1]} C${pts[0][0] + 40},${pts[0][1] + 6} ${pts[1][0] - 30},${pts[1][1] - 8} ${pts[1][0]},${pts[1][1]} S${pts[2][0] - 30},${pts[2][1] - 8} ${pts[2][0]},${pts[2][1]} S${pts[3][0] - 30},${pts[3][1] - 4} ${pts[3][0]},${pts[3][1]}`;
  return (
    <Screen footer={
      <>
        <p className="mb-3 flex items-center justify-center gap-1.5 text-sm font-bold text-[color:var(--color-teal-dark)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 2.1 3.2-.3.9 3.1 2.8 1.6-1 3 1 3-2.8 1.6-.9 3.1-3.2-.3L12 22l-2.4-2.1-3.2.3-.9-3.1-2.8-1.6 1-3-1-3 2.8-1.6.9-3.1 3.2.3z" /></svg>
          Personalized from your answers
        </p>
        <PrimaryButton onClick={onCommit}>Commit to my plan</PrimaryButton>
      </>
    }>
      <Title>{name ? `${name}, your plan is ready` : 'Your plan is ready'}</Title>
      <p className="mt-1 font-semibold text-[color:var(--color-ink)]/70">Stick to it daily and watch your cortisol come down.</p>

      <div className="app-card mt-5 p-4">
        <div className="text-xs font-extrabold tracking-wider text-[color:var(--color-teal-dark)]">YOUR PROJECTED PATH</div>
        <svg viewBox="0 0 300 140" className="mt-2 w-full" aria-hidden="true">
          <defs>
            <linearGradient id="path-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4ac29e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4ac29e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${pts[3][0]},140 L${pts[0][0]},140 Z`} fill="url(#path-fill)" />
          <path d={line} fill="none" stroke="#4ac29e" strokeWidth="4" strokeLinecap="round" className="draw-line" />
          <circle cx={pts[0][0]} cy={pts[0][1]} r="7" fill="#e4574c" stroke="white" strokeWidth="3" />
          <circle cx={pts[3][0]} cy={pts[3][1]} r="10" fill="#4ac29e" stroke="white" strokeWidth="3" />
          <path d={`M${pts[3][0] - 4},${pts[3][1]} l3,3 l5,-6`} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex justify-between text-xs font-bold text-[color:var(--color-ink-muted)]"><span>Now</span><span>In 3 weeks</span></div>
        <p className="mt-1 text-[11px] text-[color:var(--color-ink-muted)]">An illustration of the goal, not a prediction or a cortisol measurement.</p>
      </div>
      <p className="mt-4 font-semibold leading-relaxed text-[color:var(--color-ink)]/75">Your plan works on the three signals behind your stress: sleep, resting heart rate and HRV.</p>

      <div className="mt-5 flex items-baseline justify-between">
        <span className="text-xs font-extrabold tracking-wider text-[color:var(--color-ink-muted)]">YOUR PLAN</span>
        <span className="text-xs font-bold text-[color:var(--color-ink-muted)]">Swipe →</span>
      </div>
      <ul className="app-snap -mx-5 mt-2 pb-2">
        {habits.map((habit) => (
          <li key={habit.title} className="app-card w-[62%] p-4">
            <div className="flex items-start justify-between">
              <img src={habit.image} alt="" width="56" height="56" className="h-14 w-14 object-contain" />
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[color:var(--color-teal)] text-white" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            <div className="mt-3 font-extrabold leading-tight">{habit.title}</div>
            <div className="mt-1 text-sm leading-snug text-[color:var(--color-ink-muted)]">{habit.body}</div>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

function Paywall({ plan, setPlan, rating, onBuy, busy, error, webview, platform }: {
  plan: 'weekly' | 'yearly'; setPlan: (p: PlanId) => void; rating: Props['rating']; onBuy: () => void; busy: boolean; error: string;
  webview: ReturnType<typeof inAppBrowser>; platform: Platform;
}) {
  const weekly = PLANS.weekly.price;
  const yearly = PLANS.yearly.price;
  const savePct = Math.round((1 - yearly / (weekly * 52)) * 100);
  const tile = (id: 'weekly' | 'yearly', children: ReactNode, badge: string) => {
    const on = plan === id;
    return (
      <button
        type="button"
        role="radio"
        aria-checked={on}
        onClick={() => setPlan(id)}
        className={`relative flex-1 rounded-[1.25rem] border-[2.5px] bg-white/90 px-3 pb-3 pt-5 text-left transition active:scale-[0.98] ${on ? 'border-[rgba(18,24,38,0.9)]' : 'border-transparent'}`}
      >
        <span className={`absolute -top-2.5 left-3 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${on ? 'bg-[rgba(18,24,38,0.9)] text-white' : 'bg-[color:var(--color-surface-2)]'}`}>{badge}</span>
        {children}
      </button>
    );
  };
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
      <img src={IMG('paywall_header')} alt="" width="480" height="300" className="-mt-14 w-full [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" />
      <div className="-mt-8 flex-1 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-center gap-2">
          <Stars className="h-5 w-5" value={rating.value} />
          <span className="text-lg font-extrabold tabular-nums">{rating.value}</span>
          <span className="text-sm font-semibold text-[color:var(--color-ink-muted)]">· {rating.count} App Store ratings</span>
        </div>
        <h1 className="mt-3 text-center text-[2rem] font-extrabold tracking-tight">Explore Calmer Days</h1>

        <ul className="mt-4 space-y-2">
          {PERKS.map((perk) => (
            <li key={perk.label} className="flex items-center gap-3 font-bold">
              <img src={perk.image} alt="" width="36" height="36" className="h-9 w-9 object-contain" />
              {perk.label}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-3" role="radiogroup" aria-label="Choose a plan">
          {tile('weekly', (
            <>
              <div className="text-sm font-extrabold">Weekly</div>
              <div className="mt-1 text-2xl font-extrabold tabular-nums">{money(weekly)}<span className="text-sm">/wk</span></div>
              <div className="text-xs font-semibold text-[color:var(--color-ink-muted)]">billed weekly</div>
            </>
          ), 'Popular')}
          {tile('yearly', (
            <>
              <div className="text-sm font-extrabold">Yearly</div>
              <div className="mt-1 text-2xl font-extrabold tabular-nums">{money(yearly)}<span className="text-sm">/yr</span></div>
              <div className="text-xs font-semibold text-[color:var(--color-ink-muted)]">billed annually · {money(yearly / 12)}/mo</div>
            </>
          ), `Save ${savePct}%`)}
        </div>

        {webview && platform === 'ios' && (
          <p className="mt-4 rounded-2xl bg-white/80 p-3 text-sm font-semibold">Apple Pay isn't available inside this app's browser. Open this page in Safari to use it, or pay by card here.</p>
        )}

        <p className="mt-5 text-center text-sm font-bold text-[color:var(--color-ink)]/70">Cancel anytime. No commitment.</p>
        <div className="mt-3"><PrimaryButton onClick={onBuy} disabled={busy}>{busy ? 'Opening checkout…' : 'Start My Journey ›'}</PrimaryButton></div>
        {error && <p className="mt-2 text-center text-sm font-bold text-[#c0392b]" role="alert">{error}</p>}
        <p className="mt-3 text-center text-xs leading-relaxed text-[color:var(--color-ink-muted)]">
          You'll be charged {plan === 'yearly' ? `${money(yearly)} today and every year` : `${money(weekly)} today and every week`} until you cancel.
        </p>
        <p className="mt-4 text-center text-xs font-semibold text-[color:var(--color-ink-muted)]">
          <a href="/privacy/" className="underline">Privacy</a> · <a href="/terms/" className="underline">Terms</a>
        </p>
      </div>
    </div>
  );
}
