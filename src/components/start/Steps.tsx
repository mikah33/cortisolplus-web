// The 5.9 steps after the questions that the web keeps: SocialProofView,
// NewBuildingPlanView and NewPlanRevealView. The app's notifications,
// Apple Health and Connect Your Device pages are left off the web.

import { useEffect, useMemo, useRef, useState } from 'react';
import { A, BlockButton, Col, CompanionFace, Glass, Icon, LoopVideo, Txt, reducedMotion, useShown, useStage } from './ui';
import type { Platform } from './content';

const first = (name: string) => name.trim().split(/\s+/)[0] ?? '';

// ---------------------------------------------------------------- People Love Cortisol+

export interface Review { title: string; body: string; author: string; rating: number }

export function Social({ rating, reviews, platform, onContinue }: {
  rating: number; reviews: Review[]; platform: Platform; onContinue: () => void;
}) {
  const title = useShown(300);
  const cards = useShown(500);
  const badges = useShown(700);
  const [stars, setStars] = useState(0);
  const [active, setActive] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (reducedMotion()) { setStars(5); return; }
    const ids = [0, 1, 2, 3, 4].map((i) => window.setTimeout(() => setStars(i + 1), 400 + i * 100));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, []);
  useEffect(() => {
    if (reducedMotion() || reviews.length < 2) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % reviews.length), 3500);
    return () => window.clearInterval(id);
  }, [reviews.length]);
  const badge = (icon: string, top: string, bottom: string) => (
    <div className="ob-flex" style={{ gap: 6, alignItems: 'center', flex: 1 }} key={icon}>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: 'var(--ob-mint)', display: 'grid', placeItems: 'center' }}>
        <img src={A(`${icon}.webp`)} alt="" style={{ width: 50, height: 50, objectFit: 'contain' }} />
      </div>
      <div className="ob-flex" style={{ gap: 1, alignItems: 'center' }}>
        <span className="ob-t" style={{ fontSize: 12, fontWeight: 700 }}>{top}</span>
        <span className="ob-t" style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)' }}>{bottom}</span>
      </div>
    </div>
  );
  return (
    <Col className="ob-flex" style={{ alignItems: 'center' }}>
      <div className="ob-spacer" />
      <div className={`ob-fs ${title ? 'on' : ''} ob-flex`} style={{ gap: 8, alignItems: 'center', textAlign: 'center' }}>
        <h1 className="ob-t" style={{ fontSize: 34, fontWeight: 700 }}>People Love<br />Cortisol+</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} aria-label={`Rated ${rating} out of 5 on the App Store`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ display: 'inline-block', transform: i < stars ? 'scale(1)' : 'scale(0.5)', transition: 'transform 300ms cubic-bezier(0.3, 1.6, 0.5, 1)' }}>
              <Icon.star size={22} color={i < stars ? '#000' : 'rgba(0,0,0,0.15)'} />
            </span>
          ))}
          <span className="ob-t" style={{ fontSize: 20, fontWeight: 700, paddingLeft: 4 }}>{rating}</span>
        </div>
      </div>
      <div style={{ height: 28, flex: 'none' }} />
      <div className={`ob-fs ${cards ? 'on' : ''}`} style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: '100%', transform: `translateX(${-active * 100}%)`, transition: 'transform 450ms cubic-bezier(0.3, 0.9, 0.3, 1)' }}>
          {reviews.map((r) => (
            <div key={r.author} style={{ flex: '0 0 100%', padding: '0 32px' }}>
              <Glass radius={20} className="ob-flex" style={{ gap: 12, padding: 20, justifyContent: 'center', minHeight: '100%' }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: Math.round(r.rating) }).map((_, i) => <Icon.star key={i} size={12} color="#ffcc00" />)}
                </div>
                <p className="ob-t" style={{ fontSize: 16, color: 'rgba(0,0,0,0.85)', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  "{r.body}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(74,194,158,0.15)', display: 'grid', placeItems: 'center', color: 'var(--ob-teal)', fontSize: 12, fontWeight: 700 }} className="ob-sys">
                    {r.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="ob-flex ob-sys" style={{ gap: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{r.author}</span>
                    <span style={{ fontSize: 11, color: 'rgba(60,60,67,0.6)' }}>App Store review</span>
                  </div>
                </div>
              </Glass>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, paddingTop: 8 }}>
        {reviews.map((r, i) => (
          <span key={r.author} style={{ width: 6, height: 6, borderRadius: '50%', background: i === active ? 'var(--ob-teal)' : 'rgba(142,142,147,0.3)', transition: 'background-color 200ms' }} />
        ))}
      </div>
      <div style={{ height: 24, flex: 'none' }} />
      <div className={`ob-fs ${badges ? 'on' : ''}`} style={{ display: 'flex', gap: 16, alignSelf: 'stretch', padding: '0 32px' }}>
        {badge('trust_lock', 'Private', 'On-Device')}
        {badge('trust_watch', platform === 'android' ? 'Wear OS' : 'Apple', 'Watch')}
        {badge('trust_ai', 'AI', 'Powered')}
      </div>
      <div className="ob-spacer" />
      <div style={{ width: '100%', padding: '0 28px' }}>
        <BlockButton onClick={() => { if (done.current) return; done.current = true; onContinue(); }}>Continue</BlockButton>
      </div>
      <div style={{ height: 40, flex: 'none' }} />
    </Col>
  );
}

// ---------------------------------------------------------------- Optimizing your personal plan

const STATUSES = [
  'Analyzing your answers…',
  'Calibrating your baseline…',
  'Personalizing your habits…',
  'Setting up your watch companion…',
  'Finalizing your plan…',
];

function Confetti() {
  const st = useStage();
  const pieces = useMemo(() => {
    const colors = ['rgb(242,89,115)', 'rgb(242,153,64)', 'rgb(51,184,140)', 'rgb(77,153,242)', 'rgb(153,128,230)', 'rgb(250,204,64)'];
    return Array.from({ length: 130 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 200;
      return {
        color: colors[Math.floor(Math.random() * colors.length)],
        w: 7 + Math.random() * 5,
        h: 9 + Math.random() * 6,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        drop: 120 + Math.random() * 300,
        spin: -260 + Math.random() * 520,
        delay: Math.random() * 60,
      };
    });
  }, []);
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setBurst(true)));
    return () => cancelAnimationFrame(id);
  }, []);
  if (reducedMotion()) return null;
  const cx = st.width / 2;
  const cy = st.height * 0.42;
  return (
    <div className="ob-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          style={{
            left: cx - p.w / 2,
            top: cy - p.h / 2,
            width: p.w,
            height: p.h,
            background: p.color,
            transitionDelay: `${p.delay}ms`,
            transform: burst ? `translate(${p.dx}px, ${p.dy + p.drop}px) rotate(${p.spin}deg)` : 'none',
            opacity: burst ? 0 : 1,
          }}
        />
      ))}
    </div>
  );
}

export function Building({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const shown = useShown(16);
  useEffect(() => {
    const duration = reducedMotion() ? 800 : 4000;
    let frame = 0;
    let t: number | undefined;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
      else t = window.setTimeout(() => setComplete(true), 300);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(t); };
  }, []);
  const status = STATUSES[Math.min(STATUSES.length - 1, Math.floor(progress * STATUSES.length))];

  if (complete) {
    return (
      <>
        <Col className="ob-flex" style={{ alignItems: 'center', textAlign: 'center', animation: 'ob-fade-in 450ms ease-out' }}>
          <div className="ob-spacer" />
          <img src={A('zen_celebrate.webp')} alt="Zen celebrating" style={{ height: 250, width: 'auto' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 10, color: 'rgb(51,184,140)' }}>
            <Icon.checkSeal size={15} />
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5 }}>PLAN READY</span>
          </div>
          <h1 className="ob-t" style={{ fontSize: 32, fontWeight: 700, paddingTop: 6 }}>You're all set!</h1>
          <Txt as="p" className="ob-t" style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)', padding: '10px 38px 0' }}>Your personal plan to bring your cortisol down is ready.</Txt>
          <div className="ob-spacer" />
          <div style={{ width: '100%', padding: '0 24px 16px' }}>
            <BlockButton onClick={onDone}>See my plan</BlockButton>
          </div>
        </Col>
        <Confetti />
      </>
    );
  }

  return (
    <Col className="ob-flex" style={{ alignItems: 'center', textAlign: 'center', opacity: shown ? 1 : 0, transition: 'opacity 350ms ease-out' }}>
      <div className="ob-spacer" />
      <LoopVideo src={A('zen_plan.mp4')} poster={A('zen_plan_poster.webp')} style={{ width: 300, height: 226, borderRadius: 22, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', flex: 'none' }} />
      <Txt as="h1" className="ob-t" style={{ fontSize: 27, fontWeight: 700, padding: '30px 32px 0' }}>Optimizing your personal plan</Txt>
      <p className="ob-t" style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)', paddingTop: 8 }}>Dedicated for you</p>
      <div style={{ alignSelf: 'stretch', padding: '30px 40px 0' }}>
        <div role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} style={{ position: 'relative', height: 10, borderRadius: 5, background: 'rgba(0,0,0,0.08)' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, borderRadius: 5, background: 'rgba(0,0,0,0.85)' }} />
        </div>
      </div>
      <span className="ob-t" style={{ fontSize: 15, fontWeight: 700, color: 'rgba(0,0,0,0.7)', paddingTop: 12, fontVariantNumeric: 'tabular-nums' }}>{Math.round(progress * 100)}%</span>
      <span className="ob-t" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(0,0,0,0.45)', paddingTop: 4 }} aria-live="polite">{status}</span>
      <div className="ob-spacer" />
    </Col>
  );
}

// ---------------------------------------------------------------- your plan is ready

const HABITS = [
  { icon: 'companion', color: '120,199,160', title: 'Stress on your wrist', sub: 'Your companion shows it live on your watch.' },
  { icon: 'metric_sleep', color: '140,128,230', title: 'Track your sleep', sub: "Your body's #1 cortisol reset." },
  { icon: 'metric_hrv', color: '51,184,140', title: 'Daily cortisol check-ins', sub: 'Catch stress before it builds.' },
  { icon: 'habit_calm', color: '242,140,89', title: 'Calm sessions with Zen', sub: 'Breathe your cortisol down, fast.' },
  { icon: 'habit_move', color: '77,153,242', title: 'Move every day', sub: 'Burn off stress hormones.' },
  { icon: 'goal_habits', color: '217,140,77', title: 'Eat healthier', sub: 'Cut stimulants, lower cortisol.' },
];

export function PlanReveal({ name, onCommit }: { name: string; onCommit: () => void }) {
  const fn = first(name);
  const green = 'rgb(51,184,140)';
  const shown = useShown(16);
  const [chartW, setChartW] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chartRef.current) setChartW(chartRef.current.offsetWidth);
  }, []);
  const w = chartW || 314;
  const h = 112;
  const pts = [[0.05 * w, 0.16 * h], [0.34 * w, 0.34 * h], [0.64 * w, 0.6 * h], [0.95 * w, 0.82 * h]];
  let line = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    line += ` C${(ax + bx) / 2} ${ay} ${(ax + bx) / 2} ${by} ${bx} ${by}`;
  }
  const area = `${line} L${pts[3][0]} ${h} L${pts[0][0]} ${h} Z`;
  const motion = !reducedMotion();
  return (
    <Col className="ob-flex" style={{ opacity: shown ? 1 : 0, transition: 'opacity 400ms ease-out' }}>
      <div className="ob-flex" style={{ gap: 6, padding: '50px 26px 0' }}>
        <Txt as="h1" className="ob-t" style={{ fontSize: 27, fontWeight: 700, paddingRight: 88 }}>{fn ? `${fn}, your plan is ready` : 'Your plan is ready'}</Txt>
        <Txt as="p" className="ob-t" style={{ fontSize: 15, color: 'rgba(0,0,0,0.5)' }}>Stick to it daily and watch your cortisol come down.</Txt>
      </div>
      <div className="ob-vscroll" style={{ flex: 1, minHeight: 0 }}>
        <div className="ob-flex" style={{ gap: 12, padding: '8px 0 10px' }}>
          <div style={{ padding: '0 22px' }}>
            <Glass radius={22} className="ob-flex" style={{ gap: 10, padding: 16, boxShadow: '0 5px 24px rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, color: green }}>YOUR PROJECTED PATH</span>
              <div ref={chartRef} style={{ height: h, position: 'relative' }}>
                <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', display: 'block' }} aria-label="Your cortisol coming down over three weeks: an illustration of the goal, not a prediction">
                  <defs>
                    <linearGradient id="ob-area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor={green} stopOpacity="0.25" />
                      <stop offset="1" stopColor={green} stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="ob-line" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0" stopColor={green} stopOpacity="0.85" />
                      <stop offset="1" stopColor={green} />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2].map((i) => (
                    <line key={i} x1="0" x2={w} y1={h * (0.3 + i * 0.26)} y2={h * (0.3 + i * 0.26)} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 5" />
                  ))}
                  <path d={area} fill="url(#ob-area)" style={motion ? { animation: 'ob-fade-in 1200ms 350ms ease-in-out both' } : undefined} />
                  <path
                    d={line}
                    fill="none"
                    stroke="url(#ob-line)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    style={{ ['--len' as string]: 1, filter: 'drop-shadow(0 3px 4px rgba(51,184,140,0.25))', animation: motion ? 'ob-draw 1200ms 350ms ease-in-out both' : undefined }}
                  />
                  <g style={motion ? { animation: 'ob-fade-in 1200ms 350ms ease-in-out both' } : undefined}>
                    <circle cx={pts[0][0]} cy={pts[0][1]} r="6" fill="rgb(237,92,92)" />
                    <circle cx={pts[3][0]} cy={pts[3][1]} r="12" fill={green} />
                    <path d={`M${pts[3][0] - 4.5} ${pts[3][1] + 0.3} l3 3 l6 -6.2`} fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>Now</span>
                <span style={{ color: green }}>In 3 weeks</span>
              </div>
            </Glass>
          </div>
          <Txt as="p" className="ob-t" style={{ fontSize: 15, fontWeight: 500, color: 'rgba(0,0,0,0.6)', padding: '0 26px' }}>
            Your plan works on the three signals behind your stress: sleep, resting heart rate and HRV.
          </Txt>
          <div className="ob-flex" style={{ gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 22px' }}>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.8, color: 'rgba(0,0,0,0.45)', flex: 1 }}>YOUR PLAN</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.35)' }}>Swipe</span>
              <Icon.arrowRight size={11} color="rgba(0,0,0,0.35)" />
            </div>
            <div className="ob-hscroll">
              {HABITS.map((hb) => (
                <Glass key={hb.title} radius={20} className="ob-flex" style={{ width: 172, height: 168, padding: 14, gap: 12, boxShadow: '0 3px 16px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, rgba(${hb.color},0.24), rgba(${hb.color},0.10))` }}>
                      {hb.icon === 'companion'
                        ? <CompanionFace size={36} />
                        : <img src={A(`${hb.icon}.webp`)} alt="" style={{ width: 37, height: 37, objectFit: 'contain' }} />}
                    </div>
                    <div style={{ flex: 1 }} />
                    <Icon.checkCircle size={19} color="rgba(51,184,140,0.9)" style={{ ['--ob-check' as string]: '#fff' }} />
                  </div>
                  <div style={{ height: 8, flex: 'none' }} />
                  <div className="ob-flex" style={{ gap: 4 }}>
                    <Txt className="ob-t" style={{ fontSize: 16, fontWeight: 700 }}>{hb.title}</Txt>
                    <Txt className="ob-t" style={{ fontSize: 12.5, color: 'rgba(0,0,0,0.5)' }}>{hb.sub}</Txt>
                  </div>
                </Glass>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ob-flex" style={{ gap: 10, alignItems: 'center', paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.checkSeal size={13} color={green} />
          <span className="ob-t" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.55)' }}>Personalized from your answers</span>
        </div>
        <div style={{ width: '100%', padding: '0 24px' }}>
          <BlockButton onClick={onCommit}>Commit to my plan</BlockButton>
        </div>
      </div>
    </Col>
  );
}
