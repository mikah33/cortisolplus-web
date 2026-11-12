// HowZenHelpsView (5.9): the eight lesson slides between the goal page and
// the profile questions.

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  A,
  BlockButton,
  Col,
  Glass,
  Icon,
  TypedLine,
  WatchShowcase,
  ZenWave,
  sleep,
  typeInto,
  useElementSize,
  useScript,
  useStage,
} from './ui';
import type { Platform } from './content';

type Ready = () => void;

interface Metric {
  key: 'rhr' | 'sleep' | 'hrv';
  unit: string;
  line: string;
  badLine: string;
  goodTitle: string;
  badTitle: string;
  goodNum: string;
  badNum: string;
}

const RHR: Metric = {
  key: 'rhr', unit: 'bpm',
  line: 'A healthy resting heart rate sits between 50 and 70 bpm.',
  badLine: 'A high resting heart rate keeps you in stress mode, driving cortisol high.',
  goodTitle: 'Healthy', badTitle: 'Elevated', goodNum: '58', badNum: '84',
};
const SLEEP: Metric = {
  key: 'sleep', unit: 'hrs',
  line: "Aim for 7 to 9 hours a night — that's the sweet spot.",
  badLine: '6 or less hours of sleep spikes cortisol — your body never fully resets.',
  goodTitle: 'Rested', badTitle: 'Deprived', goodNum: '8', badNum: '5',
};
const HRV: Metric = {
  key: 'hrv', unit: 'ms',
  line: 'Higher HRV means better recovery — a healthy range is about 40 to 80 ms.',
  badLine: 'Low HRV means poor recovery, increasing cortisol.',
  goodTitle: 'Strong', badTitle: 'Low', goodNum: '62', badNum: '24',
};

export const EDU_KEYS = [
  'what_is_cortisol', 'what_does_it_do', 'signals', 'signal_rhr', 'signal_sleep', 'signal_hrv', 'watch_companion', 'get_to_know_you',
];
const BUTTONS = ['What does it do?', 'Show Me How', "Let's see", 'Next', 'Next', 'Next', 'Love it', "Let's go"];

// ---------------------------------------------------------------- slides

function CortisolIntro({ onReady }: { onReady: Ready }) {
  const st = useStage();
  const full = "This is cortisol — your body's main stress hormone.";
  const [t, setT] = useState('');
  useScript(async (s) => {
    await sleep(400, s);
    await typeInto(setT, full, s);
    onReady();
  }, []);
  return (
    <div className="ob-fill ob-flex" style={{ padding: '56px 28px 0', gap: 24 }}>
      <div style={{ height: 190, flex: 'none' }}>{t && <TypedLine full={full} shown={t} size={25} />}</div>
      <img src={A('cortisol_scene.webp')} alt="Zen in a lab coat explaining cortisol at a chalkboard" style={{ width: st.w - 56 - 44, height: 'auto', margin: '0 22px' }} />
    </div>
  );
}

function CortisolEffects({ onReady }: { onReady: Ready }) {
  const st = useStage();
  const l1 = 'High cortisol leads to weight gain and faster aging.';
  const l2 = "But don't worry — we help you keep it low.";
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  useScript(async (s) => {
    await sleep(300, s);
    await typeInto(setA, l1, s);
    await sleep(800, s);
    await typeInto(setB, l2, s);
    onReady();
  }, []);
  const each = (st.w - 56 - 4 - 2) / 2;
  return (
    <div className="ob-fill ob-flex" style={{ padding: '56px 28px 0', gap: 24 }}>
      <div className="ob-flex" style={{ height: 190, flex: 'none', gap: 12 }}>
        {a && <TypedLine full={l1} shown={a} size={25} color={b ? 'rgba(0,0,0,0.28)' : '#000'} />}
        {b && <TypedLine full={l2} shown={b} size={25} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, padding: '0 2px', maxHeight: 540 }}>
        <img src={A('effect_fat.webp')} alt="Zen with extra weight" style={{ width: each, height: 'auto', transform: 'translateY(-46px)' }} />
        <img src={A('effect_old.webp')} alt="Zen looking older" style={{ width: each, height: 'auto' }} />
      </div>
    </div>
  );
}

function FactorsIntro({ onReady }: { onReady: Ready }) {
  const st = useStage();
  const full = 'There are 3 signals I watch most to keep it in check:';
  const [t, setT] = useState('');
  useScript(async (s) => {
    await sleep(300, s);
    await typeInto(setT, full, s);
    onReady();
  }, []);
  const H = 460;
  const chip = (img: string, label: string) => (
    <Glass radius={15} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', width: 'fit-content' }}>
      <img src={A(`${img}.webp`)} alt="" style={{ width: 50, height: 50, objectFit: 'contain' }} />
      <span className="ob-t" style={{ fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>
    </Glass>
  );
  return (
    <div className="ob-fill ob-flex">
      <div className="ob-spacer" />
      <TypedLine full={full} shown={t} style={{ height: 96, margin: '0 28px', flex: 'none' }} />
      <div style={{ height: 12, flex: 'none' }} />
      <div style={{ position: 'relative', height: H, flex: 'none' }}>
        <img
          src={A('zen_presenting.webp')}
          alt=""
          className="ob-center"
          style={{ height: H * 0.56, width: 'auto', left: st.w * 0.78, top: H * 0.55 }}
        />
        <div className="ob-flex" style={{ position: 'absolute', left: 18, top: '50%', transform: `translateY(calc(-50% - ${H * 0.04}px))`, gap: 9 }}>
          {chip('metric_rhr', 'Resting HR')}
          {chip('metric_sleep', 'Sleep')}
          {chip('metric_hrv', 'Recovery (HRV)')}
        </div>
      </div>
      <div className="ob-spacer" />
    </div>
  );
}

/** A live ECG line scrolling right → left (HowZenHelpsView.ECGView). */
function Ecg({ color, intervals, gaps, height }: { color: string; intervals: number[]; gaps?: string[]; height: number }) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const vw = size.w || 130;
  const qrs = 26;
  const speed = 46;
  const period = intervals.reduce((a, b) => a + b, 0);
  const starts = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const iv of intervals) { out.push(acc); acc += iv; }
    return out;
  }, [intervals]);
  const tpl = (f: number) => {
    const pts: [number, number][] = [[0, 0], [0.18, 0.1], [0.28, 0], [0.36, -0.12], [0.44, 1], [0.52, -0.35], [0.62, 0], [0.8, 0.16], [1, 0]];
    for (let i = 1; i < pts.length; i++) {
      if (f <= pts[i][0]) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        return y0 + (y1 - y0) * ((f - x0) / Math.max(0.0001, x1 - x0));
      }
    }
    return 0;
  };
  const value = (x: number) => {
    let xm = x % period;
    if (xm < 0) xm += period;
    for (const s of starts) if (xm >= s && xm < s + qrs) return tpl((xm - s) / qrs);
    return 0;
  };
  const total = period * 2 + vw;
  const baseY = gaps ? height * 0.4 : height * 0.56;
  const amp = gaps ? height * 0.34 : height * 0.42;
  let d = `M0 ${(baseY - value(0) * amp).toFixed(2)}`;
  for (let x = 0.5; x <= total; x += 0.5) d += `L${x} ${(baseY - value(x) * amp).toFixed(2)}`;

  const markers: ReactNode[] = [];
  if (gaps) {
    const ay = baseY + amp * 0.9;
    let bx = 0;
    let i = 0;
    while (bx < total) {
      const iv = intervals[i % intervals.length];
      const ms = gaps[i % gaps.length];
      const x0 = bx + qrs * 0.5 + 3;
      const x1 = bx + iv + qrs * 0.5 - 3;
      markers.push(
        <g key={i}>
          <path d={`M${x0} ${ay}H${x1}M${x0} ${ay}l5 -3M${x0} ${ay}l5 3M${x1} ${ay}l-5 -3M${x1} ${ay}l-5 3`} stroke={color} strokeOpacity={0.55} strokeWidth={1.3} fill="none" />
          <text x={(x0 + x1) / 2} y={ay + 11} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} fill={color} fillOpacity={0.55} fontFamily="var(--ob-font)">{ms}</text>
        </g>,
      );
      bx += iv;
      i += 1;
    }
  }

  return (
    <div ref={ref} style={{ height, overflow: 'hidden', position: 'relative' }}>
      <svg
        width={total}
        height={height}
        style={{ position: 'absolute', left: 0, top: 0, animation: `ob-ecg-${period} ${period / speed}s linear infinite` }}
        aria-hidden="true"
      >
        <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {markers}
      </svg>
      <style>{`@keyframes ob-ecg-${period} { from { transform: translateX(0); } to { transform: translateX(-${period}px); } }`}</style>
    </div>
  );
}

function SleepStages({ good }: { good: boolean }) {
  const green = 'rgb(51,184,115)';
  const blue = 'rgb(92,128,230)';
  const red = 'rgb(230,71,71)';
  const gray = 'rgba(0,0,0,0.35)';
  const ink = good ? green : red;
  const rows: [string, string, number, string][] = good
    ? [['Awake', '11m', 0.03, red], ['Deep', '1h 42m', 0.21, green], ['REM', '2h 09m', 0.27, blue], ['Light', '4h 06m', 0.51, gray]]
    : [['Awake', '48m', 0.16, red], ['Deep', '19m', 0.06, green], ['REM', '1h 02m', 0.2, blue], ['Light', '3h 22m', 0.65, gray]];
  return (
    <div className="ob-flex" style={{ gap: 7 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: ink, lineHeight: 1.1 }}>{good ? '97' : '54'}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: ink }}>{good ? 'Excellent' : 'Poor'}</span>
      </div>
      {rows.map(([name, dur, frac, c]) => (
        <div key={name} className="ob-flex" style={{ gap: 2 }}>
          <div style={{ display: 'flex', gap: 3, fontSize: 9, lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>{name}</span>
            <span style={{ color: 'rgba(0,0,0,0.4)' }}>{dur}</span>
          </div>
          <div style={{ position: 'relative', height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.07)' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${frac * 100}%`, borderRadius: 2, background: c }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CompareCard({ m, good, style }: { m: Metric; good: boolean; style?: CSSProperties }) {
  const ink = good ? 'rgb(46,158,112)' : 'rgb(224,77,87)';
  const isSleep = m.key === 'sleep';
  const vizH = isSleep ? 176 : 86;
  const cardH = isSleep ? 344 : 260;
  const ecg = m.key === 'rhr' ? (good ? [88, 88, 88, 88] : [54, 54, 54, 54]) : m.key === 'hrv' ? (good ? [86, 92, 86, 80] : [81, 84, 82, 79]) : null;
  const gaps = m.key === 'hrv' ? (good ? ['808', '872', '812', '750'] : ['768', '793', '769', '745']) : undefined;
  return (
    <Glass radius={24} style={{ flex: 1, minWidth: 0, height: cardH, padding: '18px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: '0 3px 16px rgba(0,0,0,0.05)', ...style }}>
      <div className="ob-t" style={{ fontSize: 19, fontWeight: 700 }}>{good ? m.goodTitle : m.badTitle}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: ink }}>
        <span className="ob-t" style={{ fontSize: 13, fontWeight: 600 }}>Cortisol</span>
        {good ? <Icon.arrowDown size={11} /> : <Icon.arrowUp size={11} />}
      </div>
      <div style={{ flex: 1, minHeight: 6 }} />
      <div style={{ height: vizH, width: '100%', padding: '0 2px' }}>
        {ecg ? <Ecg color={ink} intervals={ecg} gaps={gaps} height={vizH} /> : <SleepStages good={good} />}
      </div>
      <div style={{ flex: 1, minHeight: 6 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: ink, lineHeight: 1.1 }}>{good ? m.goodNum : m.badNum}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.4)' }}>{m.unit}</span>
      </div>
    </Glass>
  );
}

function MetricCompare({ m, onReady }: { m: Metric; onReady: Ready }) {
  const [bad, setBad] = useState('');
  const [goodT, setGoodT] = useState('');
  const [beat, setBeat] = useState(0);
  useScript(async (s) => {
    await sleep(300, s);
    await typeInto(setBad, m.badLine, s);
    await sleep(900, s);
    setBeat(1);
    await sleep(350, s);
    await typeInto(setGoodT, m.line, s);
    onReady();
  }, []);
  return (
    <div className="ob-fill ob-flex" style={{ paddingTop: 56 }}>
      <div className="ob-flex" style={{ height: 210, flex: 'none', gap: 12, margin: '0 28px' }}>
        <TypedLine full={m.badLine} shown={bad} size={25} color={beat >= 1 ? 'rgba(0,0,0,0.28)' : '#000'} />
        {goodT && <TypedLine full={m.line} shown={goodT} size={25} />}
      </div>
      <div style={{ height: 8, flex: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px' }}>
        <CompareCard m={m} good={false} style={{ transform: 'translateY(22px)' }} />
        {beat >= 1 ? (
          <CompareCard m={m} good style={{ transform: 'translateY(-22px)', animation: 'ob-card-in 520ms cubic-bezier(0.22, 0.9, 0.25, 1) both' }} />
        ) : (
          <div style={{ flex: 1, height: 260 }} />
        )}
      </div>
      <style>{'@keyframes ob-card-in { from { opacity: 0; translate: 120% 0; } to { opacity: 1; translate: 0 0; } }'}</style>
    </div>
  );
}

function WatchCompanion({ onReady, platform }: { onReady: Ready; platform: Platform }) {
  const full = platform === 'android'
    ? 'I track all three from your Wear OS watch — and your companion shows your stress right on your wrist.'
    : 'I track all three from your Apple Watch — and your companion shows your stress right on your wrist.';
  const [t, setT] = useState('');
  useScript(async (s) => {
    await sleep(300, s);
    await typeInto(setT, full, s);
    onReady();
  }, []);
  return (
    <div className="ob-fill ob-flex" style={{ paddingTop: 56 }}>
      <TypedLine full={full} shown={t} size={25} style={{ height: 150, margin: '0 28px', flex: 'none' }} />
      <div className="ob-spacer" />
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <WatchShowcase size={340} />
      </div>
      <div className="ob-spacer" />
    </div>
  );
}

function GetToKnowYou({ onReady }: { onReady: Ready }) {
  const p1 = "Now you know what drives cortisol the most — let's work towards improving it.";
  const p2 = ' We can start by building your profile.';
  const [t, setT] = useState('');
  useScript(async (s) => {
    await sleep(300, s);
    await typeInto(setT, p1, s);
    await sleep(600, s);
    await typeInto((x) => setT(p1 + x), p2, s);
    onReady();
  }, []);
  return (
    <div className="ob-fill ob-flex">
      <div className="ob-spacer" />
      <TypedLine full={p1 + p2} shown={t} style={{ height: 176, margin: '0 28px', flex: 'none' }} />
      <div style={{ height: 8, flex: 'none' }} />
      <ZenWave play style={{ width: 230, height: 308, margin: '0 auto', flex: 'none' }} />
      <div className="ob-spacer" />
    </div>
  );
}

// ---------------------------------------------------------------- the lesson

export default function Education({ start, platform, onSlide, onDone }: {
  start: number; platform: Platform; onSlide: (index: number) => void; onDone: () => void;
}) {
  const [index, setIndex] = useState(Math.min(Math.max(start, 0), 7));
  const [prev, setPrev] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);
  const outTimer = useRef(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => { onSlide(index); }, [index, onSlide]);
  useEffect(() => () => window.clearTimeout(outTimer.current), []);

  const next = () => {
    if (!ready) return;
    if (index === 7) { onDone(); return; }
    setReady(false);
    setPrev(index);
    setIndex(index + 1);
    window.clearTimeout(outTimer.current);
    outTimer.current = window.setTimeout(() => setPrev(null), 480);
  };

  const slide = (i: number, live: boolean) => {
    const onReady = live ? () => setReady(true) : () => undefined;
    switch (i) {
      case 0: return <CortisolIntro onReady={onReady} />;
      case 1: return <CortisolEffects onReady={onReady} />;
      case 2: return <FactorsIntro onReady={onReady} />;
      case 3: return <MetricCompare m={RHR} onReady={onReady} />;
      case 4: return <MetricCompare m={SLEEP} onReady={onReady} />;
      case 5: return <MetricCompare m={HRV} onReady={onReady} />;
      case 6: return <WatchCompanion onReady={onReady} platform={platform} />;
      default: return <GetToKnowYou onReady={onReady} />;
    }
  };

  return (
    <Col className="ob-flex" style={{ opacity: shown ? 1 : 0, transition: 'opacity 300ms ease-out' }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'visible' }}>
        {prev !== null && <div key={`s${prev}`} className="ob-fill ob-edu-out">{slide(prev, false)}</div>}
        <div key={`s${index}`} className={`ob-fill ${prev !== null ? 'ob-edu-in' : ''}`}>{slide(index, true)}</div>
      </div>
      <div className="ob-flex" style={{ gap: 20, paddingBottom: 8, flex: 'none', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }} aria-label={`Slide ${index + 1} of 8`}>
          {BUTTONS.map((_, i) => (
            <span key={i} style={{ height: 7, width: i === index ? 22 : 7, borderRadius: 4, background: i === index ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.18)', transition: 'width 300ms cubic-bezier(0.3, 1.2, 0.5, 1)' }} />
          ))}
        </div>
        <div style={{ width: '100%', padding: '0 28px' }}>
          <BlockButton onClick={next} ready={ready} size={19}>{BUTTONS[index]}</BlockButton>
        </div>
      </div>
    </Col>
  );
}
