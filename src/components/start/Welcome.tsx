// NewWelcomeView (6.0): Zen's hello and "Let's go" (no name ask: the app dropped
// it in 6.0, it was the biggest leak before the paywall), the symptom and goal
// pages, and Zen's hand-off into the lesson. No account links on the web.

import { useState } from 'react';
import {
  A,
  BlockButton,
  Col,
  Glass,
  Icon,
  TypedLine,
  Txt,
  ZenWave,
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
  symptoms: string[];
  goals: string[];
  update: (patch: { name?: string; symptoms?: string[]; goals?: string[] }) => void;
  resumeAt: WelcomeResume;
  /** The analytics/resume key of the page on screen. */
  onScreen: (key: string) => void;
  /** "Sounds Great!" — into the lesson. */
  onDone: () => void;
}

type Phase = 'intro' | 'symptoms' | 'goals';
interface Line { text: string; full: string; faded: boolean }

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
const HANDOFF = 'Great! Now that I have a little insight, let me explain what I do.';

export default function Welcome({ symptoms, goals, update, resumeAt, onScreen, onDone }: Props) {
  const st = useStage();
  const { w, h } = st;
  const run = useRunner();

  // 'greet' is an old save from when the name was asked: resume on the symptoms.
  const resumePhase: Phase = resumeAt === 'symptoms' || resumeAt === 'greet' ? 'symptoms' : resumeAt === 'goals' || resumeAt === 'handoff' ? 'goals' : 'intro';
  const resumed = !!resumeAt;

  const [started, setStarted] = useState(resumed);
  const [zenDropped, setZenDropped] = useState(resumed);
  const [lines, setLines] = useState<Line[]>([]);
  const [showGreeting, setShowGreeting] = useState(resumed);
  const [phase, setPhase] = useState<Phase>(resumed ? resumePhase : 'intro');
  const [showLetsGo, setShowLetsGo] = useState(false);
  const [panel, setPanel] = useState<{ x: number; t: number } | null>(null);
  const [wipe, setWipe] = useState<{ p: number; t: number } | null>(resumeAt === 'handoff' ? { p: 1, t: 0 } : null);
  const [handoff, setHandoff] = useState(resumeAt === 'handoff');
  const [handoffTyped, setHandoffTyped] = useState('');
  const [selSymptoms, setSelSymptoms] = useState<string[]>(symptoms);
  const [selGoals, setSelGoals] = useState<string[]>(goals);


  // ------------------------------------------------------------ Zen's hello

  const typeLine = async (full: string, signal: AbortSignal, cps = 38) => {
    setLines((ls) => [...ls.map((l) => ({ ...l, faded: true })), { text: '', full, faded: false }]);
    await typeInto((s) => setLines((ls) => ls.map((l, i) => (i === ls.length - 1 ? { ...l, text: s } : l))), full, signal, cps);
  };

  useScript(async (signal) => {
    if (resumed) {
      onScreen(resumeAt === 'handoff' ? 'zen_handoff' : resumePhase);
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
    // Two quick lines from Zen, then "Let's go" (the 6.0 app's hello).
    await typeLine("Hi, I'm Zen, your stress coach.", signal, 55);
    await sleep(350, signal);
    await typeLine("Let's find out what's driving your stress.", signal);
    await sleep(250, signal);
    setShowLetsGo(true);
  }, []);

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

  /** "Let's go" under Zen's hello: sweep to the first question. */
  const letsGo = () => sweepTo('symptoms', () => {
    setShowGreeting(true);
    setLines([]);
  });

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
        {/* Zen, under his hello. */}
        <ZenWave
          play={started}
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
              </>
            ) : phase === 'symptoms' ? (
              <>
                {questionTitle('First — which of these sound like you?')}
                <div className="ob-flex" style={{ gap: 12, paddingTop: 10 }}>
                  {SYMPTOM_OPTIONS.map((o) => option(o, selSymptoms.includes(o.id), () => toggle(selSymptoms, setSelSymptoms, o.id)))}
                </div>
              </>
            ) : phase === 'goals' ? (
              <>
                {questionTitle("What's your main goal?")}
                <div className="ob-flex" style={{ gap: 12, paddingTop: 10 }}>
                  {GOAL_OPTIONS.map((o) => option(o, selGoals.includes(o.id), () => toggle(selGoals, setSelGoals, o.id)))}
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Zen's hello → "Let's go" */}
        {showLetsGo && phase === 'intro' && (
          <div className="ob-center" style={{ left: w / 2, top: h * 0.93 }}>
            <button type="button" className="ob-capsule" style={{ animation: 'ob-pop-in 420ms cubic-bezier(0.3, 1.3, 0.5, 1) both' }} onClick={letsGo}>
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
