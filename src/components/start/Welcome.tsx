// NewWelcomeView (5.9): Zen's hello and the name field, the greeting, the
// symptom and goal pages, and Zen's hand-off into the lesson.

import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import {
  A,
  BlockButton,
  Col,
  Glass,
  Icon,
  TypedLine,
  Txt,
  ZenWave,
  reducedMotion,
  sleep,
  typeInto,
  useRunner,
  useScript,
  useStage,
} from './ui';

export type WelcomeResume = null | 'greet' | 'symptoms' | 'goals' | 'handoff';

export const SYMPTOM_OPTIONS = [
  { id: 'stressed', label: 'Often feel stressed', img: 'symptom_stressed' },
  { id: 'fatigued', label: 'Easily feel fatigued', img: 'symptom_fatigued' },
  { id: 'unrested', label: 'Wake up feeling unrested', img: 'symptom_unrested' },
  { id: 'irregular', label: 'Irregular diet & sleep habits', img: 'symptom_irregular' },
  { id: 'stimulants', label: 'Frequently consume stimulants', img: 'symptom_stimulants' },
];

export const GOAL_OPTIONS = [
  { id: 'lower', label: 'Lower my cortisol & stress', img: 'goal_lower' },
  { id: 'track', label: 'Track my health metrics', img: 'goal_track' },
  { id: 'sleep', label: 'Improve my sleep', img: 'goal_sleep' },
  { id: 'habits', label: 'Build healthier habits', img: 'goal_habits' },
  { id: 'explore', label: 'Not sure — just exploring', img: 'goal_explore' },
];

interface Props {
  name: string;
  symptoms: string[];
  goals: string[];
  update: (patch: { name?: string; symptoms?: string[]; goals?: string[] }) => void;
  resumeAt: WelcomeResume;
  /** The analytics/resume key of the page on screen. */
  onScreen: (key: string) => void;
  /** "Sounds Great!" — into the lesson. */
  onDone: () => void;
  onSignIn: () => void;
  onRestore: () => void;
}

type Phase = 'intro' | 'symptoms' | 'goals';
interface Line { text: string; full: string; faded: boolean }

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
const HANDOFF = 'Great! Now that I have a little insight, let me explain what I do.';

export default function Welcome({ name: savedName, symptoms, goals, update, resumeAt, onScreen, onDone, onSignIn, onRestore }: Props) {
  const st = useStage();
  const { w, h } = st;
  const run = useRunner();

  const resumeName = resumeAt ? savedName : '';
  const resumePhase: Phase = resumeAt === 'symptoms' ? 'symptoms' : resumeAt === 'goals' || resumeAt === 'handoff' ? 'goals' : 'intro';
  const resumed = !!resumeAt && !(resumeAt === 'greet' && !resumeName);

  const [started, setStarted] = useState(resumed);
  const [zenDropped, setZenDropped] = useState(resumed);
  const [lines, setLines] = useState<Line[]>([]);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showField, setShowField] = useState(false);
  const [name, setName] = useState(resumeName);
  const [submitted, setSubmitted] = useState(resumed);
  const [showGreeting, setShowGreeting] = useState(resumed);
  const [phase, setPhase] = useState<Phase>(resumed ? resumePhase : 'intro');
  const [showLetsGo, setShowLetsGo] = useState(resumed && resumePhase === 'intro');
  const [wave, setWave] = useState(0);
  const [panel, setPanel] = useState<{ x: number; t: number } | null>(null);
  const [wipe, setWipe] = useState<{ p: number; t: number } | null>(resumeAt === 'handoff' ? { p: 1, t: 0 } : null);
  const [handoff, setHandoff] = useState(resumeAt === 'handoff');
  const [handoffTyped, setHandoffTyped] = useState('');
  const [selSymptoms, setSelSymptoms] = useState<string[]>(symptoms);
  const [selGoals, setSelGoals] = useState<string[]>(goals);

  const input = useRef<HTMLInputElement>(null);
  const staticName = useRef<HTMLSpanElement>(null);
  const greetName = useRef<HTMLSpanElement>(null);
  const glideFrom = useRef<DOMRect | null>(null);

  const canContinue = name.trim().length > 0;

  // ------------------------------------------------------------ Zen's hello

  const typeLine = async (full: string, signal: AbortSignal, cps = 38) => {
    setLines((ls) => [...ls.map((l) => ({ ...l, faded: true })), { text: '', full, faded: false }]);
    await typeInto((s) => setLines((ls) => ls.map((l, i) => (i === ls.length - 1 ? { ...l, text: s } : l))), full, signal, cps);
  };

  useScript(async (signal) => {
    if (resumed) {
      onScreen(resumeAt === 'greet' ? 'name_submitted' : resumeAt === 'handoff' ? 'zen_handoff' : resumeAt!);
      if (resumeAt === 'handoff') {
        await sleep(350, signal);
        await typeInto(setHandoffTyped, HANDOFF, signal, 40);
      }
      return;
    }
    onScreen('meet_zen');
    setStarted(true);
    await sleep(80, signal);
    setZenDropped(true);
    await sleep(300, signal);
    await typeLine("Hi, I'm Zen, your cortisol coach.", signal, 55);
    await sleep(350, signal);
    // askName
    await typeLine('...and who are you?', signal);
    setShowSubtitle(true);
    await sleep(350, signal);
    onScreen('name_entry');
    setShowField(true);
    await sleep(150, signal);
    input.current?.focus({ preventScroll: true });
  }, []);

  const commit = () => {
    if (!canContinue || submitted) return;
    const finalName = name.trim();
    setName(finalName);
    update({ name: finalName });
    onScreen('name_submitted');
    input.current?.blur();
    setSubmitted(true);
    run(async (signal) => {
      await sleep(320, signal);
      glideFrom.current = staticName.current?.getBoundingClientRect() ?? null;
      setShowGreeting(true);
      setShowSubtitle(false);
      setLines([]);
      setWave((n) => n + 1);
      await sleep(700, signal);
      setShowLetsGo(true);
    });
  };

  // The name glides from the field into the greeting (matchedGeometryEffect).
  useLayoutEffect(() => {
    const from = glideFrom.current;
    const el = greetName.current;
    if (!showGreeting || !from || !el) return;
    glideFrom.current = null;
    if (reducedMotion()) return;
    const to = el.getBoundingClientRect();
    const s = st.scale || 1;
    el.style.transition = 'none';
    el.style.transformOrigin = '0 0';
    el.style.transform = `translate(${(from.left - to.left) / s}px, ${(from.top - to.top) / s}px) scale(${from.height / to.height})`;
    void el.offsetWidth;
    el.style.transition = 'transform 600ms cubic-bezier(0.3, 1.12, 0.45, 1)';
    el.style.transform = 'none';
  }, [showGreeting, st.scale]);

  // ------------------------------------------------------------ sweeps

  /** Mint/sky sweep: a panel slides right → left; the page swaps underneath. */
  const sweepTo = (next: Phase, atCover?: () => void) => {
    onScreen(next);
    run(async (signal) => {
      setPanel({ x: 100, t: 0 });
      await nextFrame();
      setPanel({ x: 0, t: 340 });
      await sleep(340, signal);
      atCover?.();
      setPhase(next);
      setShowLetsGo(false);
      setPanel({ x: -100, t: 360 });
      await sleep(360, signal);
      setPanel(null);
    });
  };

  const skipName = () => {
    setName('');
    update({ name: '' });
    input.current?.blur();
    sweepTo('symptoms', () => {
      setShowGreeting(true);
      setShowSubtitle(false);
      setShowField(false);
      setSubmitted(true);
      setLines([]);
    });
  };

  const confirmSymptoms = () => {
    update({ symptoms: selSymptoms });
    sweepTo('goals');
  };
  const noSymptoms = () => {
    setSelSymptoms([]);
    update({ symptoms: [] });
    sweepTo('goals');
  };

  // "Done": the sky rises from the bottom to a blank canvas, then Zen's hand-off.
  const confirmGoals = () => {
    if (!selGoals.length) return;
    update({ goals: selGoals });
    onScreen('zen_handoff');
    run(async (signal) => {
      setWipe({ p: 0, t: 0 });
      await nextFrame();
      setWipe({ p: 1, t: 800 });
      await sleep(800, signal);
      setHandoff(true);
      await sleep(350, signal);
      await typeInto(setHandoffTyped, HANDOFF, signal, 40);
    });
  };

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  // ------------------------------------------------------------ pieces

  const option = (item: { id: string; label: string; img: string }, on: boolean, onTap: () => void) => (
    <Glass
      as="button"
      key={item.id}
      radius={16}
      on={on}
      className="ob-option"
      onClick={onTap}
      role="checkbox"
      aria-checked={on}
      style={{ gap: 14, padding: '20px 18px' }}
    >
      <img src={A(`${item.img}.webp`)} alt="" width={46} height={46} style={{ width: 46, height: 46, objectFit: 'contain', flex: 'none' }} />
      {/* HStack(spacing: 14) with a Spacer: 14pt on both sides of the spacer, and the 22pt circle symbol draws ~26pt wide */}
      <Txt className="ob-t" style={{ flex: 1, fontSize: 19, fontWeight: 600, color: on ? '#fff' : '#000', transition: 'color 300ms', marginRight: 14 }}>{item.label}</Txt>
      {on
        ? <Icon.checkCircle size={26} color="#fff" style={{ ['--ob-check' as string]: '#000' }} />
        : <Icon.circle size={26} color="rgba(0,0,0,0.25)" />}
    </Glass>
  );

  const questionTitle = (text: string) => (
    <Txt as="h1" className="ob-t" style={{ fontSize: 24, fontWeight: 700 }}>{text}</Txt>
  );

  const zenY = zenDropped ? h * 0.72 - 75 : h * 0.35 + 70;

  return (
    <>
      <Col>
        {/* Zen, under his hello and the name field. */}
        <ZenWave
          play={started}
          replay={wave}
          style={{
            position: 'absolute',
            width: 281.6,
            height: 376.9,
            left: w / 2 + 9 - 140.8,
            top: zenY - 188.45,
            opacity: phase === 'intro' ? 1 : 0,
            transition: 'top 620ms cubic-bezier(0.34, 1.36, 0.64, 1), opacity 300ms ease-in-out',
            pointerEvents: 'none',
          }}
        />

        {started && (
          <div className="ob-abs ob-flex" style={{ left: 28, right: 28, top: h * 0.1 + 10, gap: 14 }}>
            {!showGreeting ? (
              <>
                {lines.map((l, i) => (
                  <TypedLine key={i} full={l.full} shown={l.text} size={25} color={l.faded ? 'rgba(0,0,0,0.26)' : '#000'} />
                ))}
                {showSubtitle && (
                  <p className="ob-t" style={{ fontSize: 15, color: 'rgba(0,0,0,0.4)', animation: 'ob-fade-in 300ms ease-out' }}>
                    Enter the name you would like to go by.
                  </p>
                )}
                {showField && (
                  <>
                    <form
                      onSubmit={(e: FormEvent) => { e.preventDefault(); commit(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6, minHeight: 52, animation: 'ob-fade-in 400ms ease-out' }}
                    >
                      {submitted ? (
                        <span ref={staticName} className="ob-t" style={{ fontSize: 34, fontWeight: 700, whiteSpace: 'nowrap' }}>{name}</span>
                      ) : (
                        <>
                          <input
                            ref={input}
                            className="ob-name-input"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, 40))}
                            autoComplete="given-name"
                            autoCapitalize="words"
                            enterKeyHint="done"
                            aria-label="Your name"
                          />
                          {canContinue && (
                            <button type="submit" className="ob-go" aria-label="Continue">
                              <Icon.arrowRight size={18} />
                            </button>
                          )}
                        </>
                      )}
                    </form>
                    {!submitted && !canContinue && (
                      <button
                        type="button"
                        onClick={skipName}
                        className="ob-t"
                        style={{ alignSelf: 'flex-start', fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.45)', padding: '6px 0' }}
                      >
                        Skip
                      </button>
                    )}
                  </>
                )}
              </>
            ) : phase === 'intro' ? (
              <>
                <p className="ob-typed" style={{ fontSize: 25, animation: 'ob-fade-in 450ms ease-out' }}>Let's get to know each</p>
                <p className="ob-typed" style={{ fontSize: 25, display: 'flex' }}>
                  <span style={{ animation: 'ob-fade-in 450ms ease-out', whiteSpace: 'pre' }}>other, </span>
                  <span ref={greetName} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>{name}!</span>
                </p>
              </>
            ) : phase === 'symptoms' ? (
              <>
                {questionTitle('First — which of these sound like you?')}
                <div className="ob-flex" style={{ gap: 12, paddingTop: 10 }}>
                  {SYMPTOM_OPTIONS.map((o) => option(o, selSymptoms.includes(o.id), () => toggle(selSymptoms, setSelSymptoms, o.id)))}
                </div>
              </>
            ) : (
              <>
                {questionTitle("What's your main goal?")}
                <div className="ob-flex" style={{ gap: 12, paddingTop: 10 }}>
                  {GOAL_OPTIONS.map((o) => option(o, selGoals.includes(o.id), () => toggle(selGoals, setSelGoals, o.id)))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Returning users, under Zen until the name is in. */}
        {started && !submitted && !showGreeting && (
          <div
            className="ob-center ob-t"
            style={{ left: w / 2, top: h * 0.99, display: 'flex', gap: 10, whiteSpace: 'nowrap', fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}
          >
            <button type="button" onClick={onSignIn}>I already have an account</button>
            <span style={{ color: 'rgba(0,0,0,0.35)' }}>·</span>
            <button type="button" onClick={onRestore}>Restore Purchases</button>
          </div>
        )}

        {/* Greeting → "Let's go" */}
        {showLetsGo && phase === 'intro' && (
          <div className="ob-center" style={{ left: w / 2, top: h * 0.93 }}>
            <button type="button" className="ob-capsule" style={{ animation: 'ob-pop-in 420ms cubic-bezier(0.3, 1.3, 0.5, 1) both' }} onClick={() => sweepTo('symptoms')}>
              Let's go
            </button>
          </div>
        )}

        {phase === 'symptoms' && (
          <>
            <div className="ob-center" style={{ left: w / 2, top: h * 0.92 }}>
              <button type="button" className="ob-capsule" disabled={!selSymptoms.length} style={{ background: `rgba(0,0,0,${selSymptoms.length ? 0.85 : 0.3})` }} onClick={confirmSymptoms}>
                Continue
              </button>
            </div>
            <button type="button" className="ob-center ob-t" style={{ left: w / 2, top: h * 0.99, fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }} onClick={noSymptoms}>
              None of these
            </button>
          </>
        )}

        {phase === 'goals' && (
          <div className="ob-center" style={{ left: w / 2, top: h * 0.93 }}>
            <button type="button" className="ob-capsule" disabled={!selGoals.length} style={{ background: `rgba(0,0,0,${selGoals.length ? 0.85 : 0.3})` }} onClick={confirmGoals}>
              Done
            </button>
          </div>
        )}
      </Col>

      {/* Sky sweep between pages */}
      {panel && (
        <div
          className="ob-panel ob-sky shadow"
          style={{ transform: `translateX(${panel.x}%)`, transition: panel.t ? `transform ${panel.t}ms cubic-bezier(0.42, 0, 0.58, 1)` : 'none' }}
        />
      )}

      {/* The sky rising from the bottom into a blank canvas */}
      {wipe && (
        <div
          className="ob-panel ob-sky"
          style={{ clipPath: `inset(${(1 - wipe.p) * 100}% 0 0 0)`, transition: wipe.t ? `clip-path ${wipe.t}ms cubic-bezier(0.42, 0, 0.58, 1)` : 'none' }}
        />
      )}

      {/* Zen's hand-off: its own canvas, no lesson dots */}
      {handoff && (
        <div className="ob-panel ob-sky" style={{ pointerEvents: 'auto', zIndex: 61 }}>
          <Col>
            <TypedLine full={HANDOFF} shown={handoffTyped} size={25} style={{ position: 'absolute', left: 28, right: 28, top: 56, height: 150 }} />
            <img
              src={A('zen_explain.webp')}
              alt=""
              className="ob-center"
              style={{ left: w / 2, top: h * 0.52, maxHeight: 350, maxWidth: w - 80, height: 'auto', width: 'auto' }}
            />
            <div className="ob-center" style={{ left: w / 2, top: h - 60, width: w - 56 }}>
              <BlockButton onClick={onDone} size={19}>Sounds Great!</BlockButton>
            </div>
          </Col>
        </div>
      )}
    </>
  );
}
