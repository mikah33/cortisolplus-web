// /start/ — the web copy of the Cortisol+ 5.9 iOS onboarding (NewOnboardingView):
// launch movie → Zen's hello and name → symptoms → goals → the lesson → the
// profile questions → reviews → building the plan → the plan → paywall
// (with the one-time exit offer).
//
// Left out on the web: the app's notifications, Apple Health, Connect Your
// Device and scan pages (a web page can't ask for those or read heart data).
// Every screen is drawn at the app's point sizes on a stage scaled to the
// viewport (see ui.tsx), so a phone shows what the app shows.

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import './ob.css';
import { CHECKOUT_ENABLED, type Platform, type PlanId } from './content';
import { readPurchase, writePurchase, type Purchase } from './purchase';
import { A, Alert, BackButton, StageContext, reducedMotion, type Stage } from './ui';
import Welcome, { type WelcomeResume } from './Welcome';
import Education, { EDU_KEYS } from './Education';
import Questionnaire, { QUESTIONS, type Profile } from './Questionnaire';
import { Building, PlanReveal, Social, type Review } from './Steps';
import { Done, ExitOffer, Paywall, type PaywallPlan } from './Paywall';

export type { Review };

interface Props {
  reviews: Review[];
  rating: { value: number; count: number };
  appStoreUrl: string;
  googlePlayUrl: string;
  /** QR code (SVG markup) for cortisolplus.com/download/, shown to desktop visitors. */
  qrSvg: string;
}

type StepId = 'welcome' | 'edu' | 'questions' | 'social' | 'building' | 'plan' | 'paywall' | 'done';

interface Answers extends Profile {
  name: string;
  symptoms: string[];
  goals: string[];
}

const DEFAULT_ANSWERS: Answers = {
  name: '', symptoms: [], goals: [],
  age: 28, gender: '', feet: 5, inches: 8, weight: 160, sleep: '', exercise: '',
};

/** The screen keys the app reports (OnboardingLiveActivity.screenOrder), for the screens the web keeps. */
const STEP_KEYS: Partial<Record<StepId, string>> = {
  social: 'social_proof', building: 'building_plan', plan: 'plan_reveal', paywall: 'paywall',
};
/** Screens earlier visitors may have saved that the web no longer has: resume on the reviews. */
const RETIRED_KEYS = ['notifications', 'apple_health', 'connect'];

interface Saved {
  screen: string;
  answers: Answers;
  reachedPaywall: boolean;
  sawExitOffer: boolean;
}

const STORAGE_KEY = 'cp_start_v2';

function readSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { screen: String(parsed.screen ?? ''), answers: { ...DEFAULT_ANSWERS, ...parsed.answers }, reachedPaywall: !!parsed.reachedPaywall, sawExitOffer: !!parsed.sawExitOffer };
  } catch {
    return null;
  }
}

function writeSaved(saved: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    /* private mode: the flow still works, it just won't resume */
  }
}

function detectPlatform(): Platform {
  const forced = new URLSearchParams(location.search).get('platform');
  const value = forced || document.documentElement.dataset.platform;
  return value === 'ios' || value === 'android' ? value : 'other';
}

function inAppBrowser(): boolean {
  return /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|BytedanceWebview/i.test(navigator.userAgent);
}

// ---------------------------------------------------------------- stage

const DESIGN_MIN_H = 740;

function readInsets(probe: HTMLElement | null) {
  if (!probe) return { top: 0, bottom: 0 };
  const cs = getComputedStyle(probe);
  return { top: parseFloat(cs.paddingTop) || 0, bottom: parseFloat(cs.paddingBottom) || 0 };
}

function computeStage(probe: HTMLElement | null): Stage {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const insets = readInsets(probe);
  const scale = Math.min(vw / 390, (vh - insets.top - insets.bottom) / DESIGN_MIN_H, 1.15);
  const width = vw / scale;
  const height = vh / scale;
  const top = insets.top / scale;
  const bottom = insets.bottom / scale;
  const w = Math.min(width, Math.max(390, Math.min(vw, 430)));
  return { width, height, top, bottom, w, left: (width - w) / 2, h: height - top - bottom, scale };
}

// ---------------------------------------------------------------- the flow

interface Layer { id: number; step: StepId; cls: string }
type Cover = { x: number; t: number; o: number; ot: number } | null;

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

export default function StartFlow({ reviews, rating, appStoreUrl, googlePlayUrl, qrSvg }: Props) {
  const probe = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [platform, setPlatform] = useState<Platform>('other');
  const [webview, setWebview] = useState(false);
  const [launch, setLaunch] = useState<'showing' | 'leaving' | 'gone'>('showing');

  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [layers, setLayers] = useState<Layer[]>([]);
  const step = layers.length ? layers[layers.length - 1].step : null;
  const [cover, setCover] = useState<Cover>(null);
  const [welcomeResume, setWelcomeResume] = useState<WelcomeResume>(null);
  const [eduStart, setEduStart] = useState(0);
  const [qStart, setQStart] = useState(0);

  const [plan, setPlan] = useState<PaywallPlan>('yearly');
  const [exitOpen, setExitOpen] = useState(false);
  const [sawExitOffer, setSawExitOffer] = useState(false);
  const [reachedPaywall, setReachedPaywall] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [alert, setAlert] = useState<null | { title: string; message: string }>(null);

  const screen = useRef('meet_zen');
  const layerId = useRef(0);
  const moving = useRef(false);

  // ------------------------------------------------------------ stage size

  useLayoutEffect(() => {
    const update = () => {
      // The on-screen keyboard (Android) shouldn't shrink the stage.
      const el = document.activeElement;
      if (el && el.tagName === 'INPUT') return;
      setStage(computeStage(probe.current));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      [html.style.overflow, document.body.style.overflow] = prev;
    };
  }, []);

  // ------------------------------------------------------------ start / resume

  useEffect(() => {
    setPlatform(detectPlatform());
    setWebview(inAppBrowser());
    const saved = readSaved();
    const bought = readPurchase();
    if (saved) {
      setAnswers(saved.answers);
      setSawExitOffer(saved.sawExitOffer);
      setReachedPaywall(saved.reachedPaywall);
    }
    let first: StepId = 'welcome';
    // Local preview only: ?step=welcome:symptoms | edu:3 | questions:2 | paywall | exit | …
    const params = new URLSearchParams(location.search);
    const preview = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? params.get('step') : null;
    if (preview) {
      const [s, sub] = preview.split(':');
      const name = params.get('name') ?? 'Alex';
      setAnswers({ ...DEFAULT_ANSWERS, name });
      if (s === 'welcome' && sub) setWelcomeResume(sub as WelcomeResume);
      if (s === 'edu') setEduStart(Number(sub) || 0);
      if (s === 'questions') setQStart(Number(sub) || 0);
      if (s === 'exit') setExitOpen(true);
      if (params.has('nolaunch')) setLaunch('gone');
      setLayers([{ id: ++layerId.current, step: (s === 'exit' ? 'paywall' : s) as StepId, cls: '' }]);
      return;
    }
    if (bought) {
      setPurchase(bought);
      first = 'done';
    } else if (saved?.reachedPaywall) {
      // Back after leaving on the paywall: open on it with the exit offer up.
      first = 'paywall';
      setExitOpen(true);
    } else if (saved) {
      const key = saved.screen;
      const q = QUESTIONS.findIndex((x) => x.id === key);
      const e = EDU_KEYS.indexOf(key);
      if (key === 'name_submitted') setWelcomeResume(saved.answers.name ? 'greet' : 'symptoms');
      else if (key === 'symptoms' || key === 'goals') setWelcomeResume(key);
      else if (key === 'zen_handoff') setWelcomeResume('handoff');
      else if (e >= 0) { first = 'edu'; setEduStart(e); }
      else if (q >= 0) { first = 'questions'; setQStart(q); }
      else if (RETIRED_KEYS.includes(key)) first = 'social';
      else {
        const found = (Object.keys(STEP_KEYS) as StepId[]).find((s) => STEP_KEYS[s] === key);
        if (found) first = found === 'plan' ? 'building' : found;
      }
    }
    setLayers([{ id: ++layerId.current, step: first, cls: '' }]);
  }, []);

  // ------------------------------------------------------------ launch movie

  const video = useRef<HTMLVideoElement>(null);
  const hasStage = !!stage;
  useEffect(() => {
    if (launch !== 'showing' || !hasStage) return;
    const leave = () => {
      setLaunch((l) => (l === 'showing' ? 'leaving' : l));
    };
    if (reducedMotion()) { leave(); return; }
    const v = video.current;
    // Plays once; if autoplay is blocked (Low Power Mode) or slow, move on.
    const failsafe = window.setTimeout(leave, 5200);
    const stalled = window.setTimeout(() => { if (!v || v.currentTime === 0) leave(); }, 1600);
    v?.play().catch(leave);
    v?.addEventListener('ended', leave);
    v?.addEventListener('error', leave);
    return () => {
      window.clearTimeout(failsafe);
      window.clearTimeout(stalled);
      v?.removeEventListener('ended', leave);
      v?.removeEventListener('error', leave);
    };
  }, [launch, hasStage]);
  useEffect(() => {
    if (launch !== 'leaving') return;
    const id = window.setTimeout(() => setLaunch('gone'), 350);
    return () => window.clearTimeout(id);
  }, [launch]);

  // ------------------------------------------------------------ persistence

  const persist = useCallback((patch: Partial<Saved> = {}) => {
    const next: Saved = {
      screen: patch.screen ?? screen.current,
      answers: patch.answers ?? answersRef.current,
      reachedPaywall: patch.reachedPaywall ?? reachedRef.current,
      sawExitOffer: patch.sawExitOffer ?? sawRef.current,
    };
    if (patch.screen) screen.current = patch.screen;
    writeSaved(next);
  }, []);
  const answersRef = useRef(answers);
  const reachedRef = useRef(reachedPaywall);
  const sawRef = useRef(sawExitOffer);
  answersRef.current = answers;
  reachedRef.current = reachedPaywall;
  sawRef.current = sawExitOffer;

  const update = useCallback((patch: Partial<Answers>) => {
    setAnswers((a) => {
      const next = { ...a, ...patch };
      answersRef.current = next;
      persist({ answers: next });
      return next;
    });
  }, [persist]);

  const onScreen = useCallback((key: string) => persist({ screen: key }), [persist]);
  const onSlide = useCallback((i: number) => persist({ screen: EDU_KEYS[i] }), [persist]);
  const onQuestion = useCallback((i: number) => persist({ screen: QUESTIONS[i].id }), [persist]);

  useEffect(() => {
    if (!step) return;
    const key = STEP_KEYS[step];
    if (key) persist({ screen: key });
    if (step === 'paywall' && !reachedRef.current) {
      setReachedPaywall(true);
      reachedRef.current = true;
      persist({ reachedPaywall: true });
    }
    if (step === 'paywall' || step === 'plan') void import('./checkout');
  }, [step, persist]);

  // ------------------------------------------------------------ navigation

  /** Step transitions: slide in from the right, fade, pop back, or swap. */
  const go = useCallback((next: StepId, how: 'slide' | 'fade' | 'back' | 'instant' = 'slide') => {
    if (moving.current) return;
    const id = ++layerId.current;
    if (how === 'instant' || reducedMotion()) {
      setLayers([{ id, step: next, cls: '' }]);
      return;
    }
    moving.current = true;
    setLayers((ls) => {
      const cur = ls[ls.length - 1];
      if (how === 'back') return [{ id, step: next, cls: 'ob-hold' }, { ...cur, cls: 'ob-leave-slide ob-sky' }];
      return [{ ...cur, cls: how === 'fade' ? 'ob-leave-fade' : 'ob-hold' }, { id, step: next, cls: `${how === 'fade' ? 'ob-enter-fade' : 'ob-enter-slide'} ob-sky` }];
    });
    window.setTimeout(() => {
      setLayers((ls) => ls.filter((l) => l.id === id).map((l) => ({ ...l, cls: '' })));
      moving.current = false;
    }, how === 'fade' ? 370 : 540);
  }, []);

  /** Lesson sweep: a sky panel covers right → left, the page swaps, it leaves left. */
  const sweepTo = useCallback(async (next: StepId) => {
    if (moving.current) return;
    moving.current = true;
    if (reducedMotion()) { setLayers([{ id: ++layerId.current, step: next, cls: '' }]); moving.current = false; return; }
    setCover({ x: 100, t: 0, o: 1, ot: 0 });
    await nextFrame();
    setCover({ x: 0, t: 340, o: 1, ot: 0 });
    await wait(340);
    setLayers([{ id: ++layerId.current, step: next, cls: '' }]);
    setCover({ x: -100, t: 360, o: 1, ot: 0 });
    await wait(360);
    setCover(null);
    moving.current = false;
  }, []);

  /** "Let's go" hand-off: the sky sweeps in, holds a beat, then fades over the questions. */
  const wipeTo = useCallback(async (next: StepId) => {
    if (moving.current) return;
    moving.current = true;
    if (reducedMotion()) { setLayers([{ id: ++layerId.current, step: next, cls: '' }]); moving.current = false; return; }
    setCover({ x: 100, t: 0, o: 1, ot: 0 });
    await nextFrame();
    setCover({ x: 0, t: 500, o: 1, ot: 0 });
    await wait(500);
    setLayers([{ id: ++layerId.current, step: next, cls: '' }]);
    await wait(250);
    setCover({ x: 0, t: 0, o: 0, ot: 400 });
    await wait(450);
    setCover(null);
    moving.current = false;
  }, []);

  // ------------------------------------------------------------ paywall

  const openExitOffer = useCallback(() => {
    setSawExitOffer(true);
    sawRef.current = true;
    persist({ sawExitOffer: true });
    setExitOpen(true);
  }, [persist]);

  // Leaving the tab on the paywall and coming back brings up the exit offer.
  useEffect(() => {
    if (step !== 'paywall') return;
    let left = false;
    const onVis = () => {
      if (document.visibilityState === 'hidden') { if (!busy) left = true; return; }
      if (left && !busy && !purchase) { left = false; openExitOffer(); }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [step, busy, purchase, openExitOffer]);

  const pay = async (chosen: PlanId) => {
    if (!CHECKOUT_ENABLED) { go('done'); return; }
    setBusy(true);
    setError('');
    try {
      const { checkout } = await import('./checkout');
      const result = await checkout(chosen, {
        $displayName: answers.name.trim(),
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
        setExitOpen(false);
        go('done');
      } else if (chosen !== 'yearlyExit' && !sawRef.current) {
        // Backed out of checkout → the one-time exit offer, like Apple's sheet in the app.
        openExitOffer();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // Desktop buyers scan the unlock link with their phone.
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

  // ------------------------------------------------------------ returning users

  const storeUrl = platform === 'android' ? googlePlayUrl : appStoreUrl;
  const signIn = () => { window.location.href = storeUrl; };
  const restore = () => {
    const bought = readPurchase();
    if (bought) { setPurchase(bought); setExitOpen(false); go('done', 'fade'); return; }
    setAlert({
      title: 'Restore Purchases',
      message: 'Subscribed in the app? Open Cortisol+ and tap Restore Purchases. Bought on the web? Open the unlock link we emailed you.',
    });
  };

  // ------------------------------------------------------------ screens

  const render = (s: StepId): ReactNode => {
    switch (s) {
      case 'welcome':
        return (
          <Welcome
            name={answers.name}
            symptoms={answers.symptoms}
            goals={answers.goals}
            update={update}
            resumeAt={welcomeResume}
            onScreen={onScreen}
            onDone={() => { setEduStart(0); void sweepTo('edu'); }}
            onSignIn={signIn}
            onRestore={restore}
          />
        );
      case 'edu':
        return <Education start={eduStart} platform={platform} onSlide={onSlide} onDone={() => { setQStart(0); void wipeTo('questions'); }} />;
      case 'questions':
        return (
          <Questionnaire
            start={qStart}
            profile={answers}
            update={update}
            onQuestion={onQuestion}
            onBack={() => { setEduStart(7); go('edu', 'back'); }}
            onDone={() => go('social')}
          />
        );
      case 'social':
        return <Social rating={rating.value} reviews={reviews} platform={platform} onContinue={() => go('building', 'fade')} />;
      case 'building':
        return <Building onDone={() => go('plan')} />;
      case 'plan':
        return <PlanReveal name={answers.name} onCommit={() => go('paywall')} />;
      case 'paywall':
        return (
          <Paywall
            plan={plan}
            setPlan={setPlan}
            rating={rating.value}
            usersCount="50k+"
            busy={busy}
            error={exitOpen ? '' : error}
            onBuy={() => void pay(plan)}
            onBack={() => (sawRef.current ? go('plan', 'back') : openExitOffer())}
            onRestore={restore}
            inAppBrowser={webview}
            platform={platform}
          />
        );
      case 'done':
        return (
          <Done
            name={answers.name}
            platform={platform}
            purchased={!!purchase}
            unlockUrl={purchase?.redeemUrl ?? null}
            unlockQr={unlockQr}
            downloadQr={qrSvg}
            appStoreUrl={appStoreUrl}
            googlePlayUrl={googlePlayUrl}
          />
        );
    }
  };

  const backTarget: Partial<Record<StepId, StepId>> = { social: 'questions', building: 'social' };
  const goBack = (target: StepId) => {
    if (target === 'questions') setQStart(QUESTIONS.length - 1);
    go(target, 'back');
  };
  const showBack = !!step && !!backTarget[step] && layers.length === 1;

  return (
    <div className="ob-root">
      <div ref={probe} aria-hidden="true" style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }} />
      {stage && (
        <div className="ob-stage" style={{ width: stage.width, height: stage.height, transform: `scale(${stage.scale})` }}>
          <StageContext.Provider value={stage}>
            {launch !== 'showing' && layers.map((l) => (
              <div key={l.id} className={`ob-layer ${l.cls}`}>{render(l.step)}</div>
            ))}

            {launch !== 'showing' && showBack && (
              <BackButton onClick={() => goBack(backTarget[step!]!)} style={{ top: stage.top + 50, left: stage.left + 20 }} />
            )}

            {cover && (
              <div
                className="ob-panel ob-sky shadow"
                style={{
                  zIndex: 90,
                  transform: `translateX(${cover.x}%)`,
                  opacity: cover.o,
                  transition: [cover.t ? `transform ${cover.t}ms cubic-bezier(0.42, 0, 0.58, 1)` : '', cover.ot ? `opacity ${cover.ot}ms cubic-bezier(0.42, 0, 0.58, 1)` : ''].filter(Boolean).join(', ') || 'none',
                }}
              />
            )}

            {exitOpen && step === 'paywall' && launch !== 'showing' && (
              <ExitOffer
                busy={busy}
                error={error}
                onClaim={() => void pay('yearlyExit')}
                onClose={() => { setExitOpen(false); setError(''); }}
              />
            )}

            {alert && (
              <Alert title={alert.title} message={alert.message} buttons={[{ label: 'OK', bold: true, onClick: () => setAlert(null) }]} />
            )}

            {launch !== 'gone' && (
              <div className="ob-launch" style={{ opacity: launch === 'leaving' ? 0 : 1 }} aria-label="Getting your experience ready">
                <video ref={video} src={A('launch.mp4')} muted playsInline autoPlay preload="auto" aria-hidden="true" />
              </div>
            )}
          </StageContext.Provider>
        </div>
      )}
    </div>
  );
}
