// Shared pieces for the web copy of the 5.9 iOS onboarding: the stage
// geometry, Zen's typewriter, glass, buttons, SF-Symbol-like icons, the wheel
// picker and the watch showcase.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

export const A = (name: string) => `/app-ui/ob/${name}`;

export const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- stage

/** Geometry of the scaled stage, in the app's points. */
export interface Stage {
  /** Stage size (the whole viewport, in points). */
  width: number;
  height: number;
  /** Safe-area insets, in points. */
  top: number;
  bottom: number;
  /** The phone-width column the screens are laid out in. */
  w: number;
  left: number;
  /** The column's height between the safe areas (SwiftUI's `h`). */
  h: number;
  /** Points → CSS px. */
  scale: number;
}

export const StageContext = createContext<Stage>({
  width: 390, height: 763, top: 0, bottom: 0, w: 390, left: 0, h: 763, scale: 1,
});
export const useStage = () => useContext(StageContext);

/** The safe-area column every screen is drawn in. */
export function Col({ children, className = '', style }: { children?: ReactNode; className?: string; style?: CSSProperties }) {
  const st = useStage();
  return (
    <div className={`ob-col ${className}`} style={{ top: st.top, left: st.left, width: st.w, height: st.h, ...style }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------- async scripts

export class Cancelled extends Error {}

export function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new Cancelled());
    const id = window.setTimeout(resolve, ms);
    signal.addEventListener('abort', () => { window.clearTimeout(id); reject(new Cancelled()); }, { once: true });
  });
}

const quiet = (e: unknown) => { if (!(e instanceof Cancelled)) console.error(e); };

/** Runs an async script for as long as the component (and `deps`) last. */
export function useScript(script: (signal: AbortSignal) => Promise<void>, deps: unknown[]) {
  useEffect(() => {
    const ctl = new AbortController();
    script(ctl.signal).catch(quiet);
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Starts async sequences from event handlers; all of them stop on unmount. */
export function useRunner() {
  const ctl = useRef<AbortController | null>(null);
  useEffect(() => {
    ctl.current = new AbortController();
    return () => ctl.current?.abort();
  }, []);
  return useCallback((fn: (signal: AbortSignal) => Promise<void>) => {
    if (!ctl.current) ctl.current = new AbortController();
    fn(ctl.current.signal).catch(quiet);
  }, []);
}

/** Zen's typewriter: one character at a time (38 per second unless told). */
export async function typeInto(set: (s: string) => void, full: string, signal: AbortSignal, cps = 38) {
  if (reducedMotion()) { set(full); return; }
  let cur = '';
  for (const ch of Array.from(full)) {
    cur += ch;
    set(cur);
    await sleep(1000 / cps, signal);
  }
}

/**
 * iOS's "pushOut" line breaking (SwiftUI Text): when the last line would hold
 * a single word, the word before it moves down too, as long as the line it
 * leaves still runs at least half the width. Returns the character offset to
 * break before, or -1.
 */
export function pushOutOffset(el: HTMLElement): number {
  const nodes: { node: Text; start: number }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let text = '';
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    nodes.push({ node: n as Text, start: text.length });
    text += (n as Text).data;
  }
  const locate = (i: number) => {
    let k = nodes.length - 1;
    while (k > 0 && nodes[k].start > i) k--;
    return { node: nodes[k].node, offset: i - nodes[k].start };
  };
  const range = document.createRange();
  const words: { start: number; word: string; top: number; left: number; right: number }[] = [];
  const re = /\S+/g;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const a = locate(m.index);
    const b = locate(m.index + m[0].length);
    range.setStart(a.node, a.offset);
    range.setEnd(b.node, b.offset);
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0);
    if (!rects.length) continue;
    words.push({ start: m.index, word: m[0], top: rects[0].top, left: rects[0].left, right: rects[rects.length - 1].right });
  }
  if (words.length < 3) return -1;
  const lines: (typeof words)[] = [];
  for (const w of words) {
    const line = lines[lines.length - 1];
    if (line && Math.abs(line[0].top - w.top) < 3) line.push(w);
    else lines.push([w]);
  }
  // Measured against the app: only two-line text, and only when the lone
  // last word is short (≤ ~35% of the width; 24–29% words moved, 42–50% didn't).
  if (lines.length !== 2) return -1;
  const [prev, last] = lines;
  if (last.length !== 1 || /[-\u2011]./.test(last[0].word) || prev.length < 2) return -1;
  const box = el.getBoundingClientRect();
  const scale = box.width / (el.offsetWidth || 1);
  const cs = getComputedStyle(el);
  const width = box.width - (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)) * scale;
  const orphan = last[0].right - last[0].left;
  return orphan <= width * 0.36 ? prev[prev.length - 1].start : -1;
}

/** Re-measure once web fonts settle (Nunito off Apple devices). */
function useFontsReady() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => live && setN(1));
    return () => { live = false; };
  }, []);
  return n;
}

/** Applies pushOut to a string: returns the string with a newline where iOS would break. */
function usePushOut(full: string) {
  const ref = useRef<HTMLElement>(null);
  const st = useStage();
  const fonts = useFontsReady();
  const key = `${full}|${st.w}|${fonts}`;
  const [layout, setLayout] = useState<{ key: string; at: number } | null>(null);
  useLayoutEffect(() => {
    if (layout?.key === key || !ref.current) return;
    setLayout({ key, at: pushOutOffset(ref.current) });
  });
  const at = layout?.key === key ? layout.at : -1;
  return { ref, at, text: at > 0 ? `${full.slice(0, at).trimEnd()}\n${full.slice(at)}` : full };
}

/**
 * The app's TypedLine: the whole sentence is laid out invisibly so the typed
 * characters fill into their final places and nothing reflows.
 */
export function TypedLine({ full, shown, size = 24, color = '#000', style, className = '' }: {
  full: string; shown: string; size?: number; color?: string; style?: CSSProperties; className?: string;
}) {
  const { ref, at, text } = usePushOut(full);
  // Map the typed length onto the text with its inserted break.
  const cut = at > 0 && shown.length > at ? shown.length - (full.slice(0, at).length - full.slice(0, at).trimEnd().length) + 1 : shown.length;
  return (
    <p ref={ref as React.RefObject<HTMLParagraphElement>} className={`ob-typed ${className}`} style={{ fontSize: size, color, ...style }} aria-label={full}>
      <span aria-hidden="true">{text.slice(0, cut)}</span>
      <span aria-hidden="true" className="ob-ghost">{text.slice(cut)}</span>
    </p>
  );
}

/** Plain text with iOS line breaking. */
export function Txt({ children, as = 'span', className = '', style }: {
  children: string; as?: 'span' | 'p' | 'h1'; className?: string; style?: CSSProperties;
}) {
  const { ref, text } = usePushOut(children);
  const Tag = as as 'span';
  return <Tag ref={ref as React.RefObject<HTMLSpanElement>} className={className} style={{ whiteSpace: 'pre-line', ...style }}>{text}</Tag>;
}

/** Flips true `delay` ms after mount (for the staggered fadeSlide reveals). */
export function useShown(delay: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setOn(true), reducedMotion() ? 0 : delay);
    return () => window.clearTimeout(id);
  }, [delay]);
  return on;
}

// ---------------------------------------------------------------- surfaces & buttons

export function Glass({ radius, on = false, className = '', style, children, as: Tag = 'div', ...rest }: {
  radius: number; on?: boolean; className?: string; style?: CSSProperties; children?: ReactNode; as?: 'div' | 'button'; [k: string]: unknown;
}) {
  const T = Tag as 'div';
  return (
    <T className={`ob-glass ${on ? 'is-on' : ''} ${className}`} style={{ borderRadius: radius, ...style }} {...rest}>
      {children}
    </T>
  );
}

export function BlockButton({ children, onClick, disabled, ready = true, dim = 0.22, height = 56, size = 18, weight = 600, style, className = '', label }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; ready?: boolean; dim?: number;
  height?: number; size?: number; weight?: number; style?: CSSProperties; className?: string; label?: string;
}) {
  return (
    <button
      type="button"
      className={`ob-block ${className}`}
      onClick={onClick}
      disabled={disabled || !ready}
      aria-label={label}
      style={{ height, fontSize: size, fontWeight: weight, background: `rgba(0,0,0,${ready ? 0.85 : dim})`, ...style }}
    >
      {children}
    </button>
  );
}

export function BackButton({ onClick, style }: { onClick: () => void; style?: CSSProperties }) {
  return (
    <button type="button" className="ob-back" onClick={onClick} aria-label="Back" style={style}>
      <Icon.chevronLeft />
    </button>
  );
}

/** iOS-style alert. */
export function Alert({ title, message, buttons }: {
  title: string; message: string; buttons: { label: string; bold?: boolean; onClick: () => void }[];
}) {
  return (
    <div className="ob-alert-scrim" role="alertdialog" aria-label={title}>
      <div className="ob-alert">
        <h2>{title}</h2>
        <p>{message}</p>
        {buttons.map((b) => (
          <button key={b.label} type="button" className={b.bold ? 'bold' : ''} onClick={b.onClick}>{b.label}</button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Zen's videos

const isApple = () => typeof navigator !== 'undefined' && navigator.vendor === 'Apple Computer, Inc.';

/**
 * ZenVideoView: the waving Zen with a transparent background. Safari plays the
 * HEVC-with-alpha .mov, everyone else the VP9-with-alpha .webm. Starts on the
 * first frame, plays once when `play` is true, holds the last frame, and plays
 * again whenever `replay` changes.
 */
export function ZenWave({ play, replay = 0, style, className = '' }: { play: boolean; replay?: number; style?: CSSProperties; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const started = useRef(false);
  useEffect(() => setSrc(isApple() ? A('zen_wave.mov') : A('zen_wave.webm')), []);
  useEffect(() => {
    const v = ref.current;
    if (!v || !play || started.current || !src) return;
    started.current = true;
    if (reducedMotion()) return;
    v.currentTime = 0;
    v.play().catch(() => undefined);
  }, [play, src]);
  const last = useRef(replay);
  useEffect(() => {
    if (replay === last.current) return;
    last.current = replay;
    const v = ref.current;
    if (!v || !started.current || reducedMotion()) return;
    v.currentTime = 0;
    v.play().catch(() => undefined);
  }, [replay]);
  return (
    <video
      ref={ref}
      className={className}
      style={{ objectFit: 'contain', background: 'transparent', ...style }}
      src={src ?? undefined}
      poster={A('zen_wave_first.webp')}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      disablePictureInPicture
    />
  );
}

export function LoopVideo({ src, poster, style, className = '' }: { src: string; poster?: string; style?: CSSProperties; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    ref.current?.play().catch(() => undefined);
  }, []);
  return <video ref={ref} className={className} style={{ objectFit: 'cover', ...style }} src={src} poster={poster} muted loop playsInline autoPlay={!reducedMotion()} aria-hidden="true" />;
}

// ---------------------------------------------------------------- watch showcase

/**
 * CompanionWatchShowcase: the silver case with the watch's home page stepping
 * Low 22 → Elevated 55 → High 72 every two seconds. The three screens are
 * captures of the app's own WatchHomePreview.
 */
export function WatchShowcase({ size = 340, interval = 2000 }: { size?: number; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % 3), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  // WatchCaseGeometry: glass (0.1986, 0.1435, 0.6029 × 0.7145), 5% bezel.
  const g = { x: 0.1986, y: 0.1435, w: 0.6029, h: 0.7145 };
  const b = 0.05;
  const d = { x: (g.x + g.w * b) * size, y: (g.y + g.h * b) * size, w: g.w * (1 - 2 * b) * size, h: g.h * (1 - 2 * b) * size };
  const states = ['low', 'elevated', 'high'];
  const labels = ['calm at a Low score of 22', 'at an Elevated score of 55', 'worried at a High score of 72'];
  return (
    <div className="ob-watch" style={{ width: size, height: size }} role="img" aria-label={`Apple Watch showing Ripple, your stress companion, ${labels[i]}.`}>
      <img src={A('watch_case_silver.webp')} alt="" width={size} height={size} style={{ position: 'absolute', inset: 0, width: size, height: size }} />
      <div className="ob-watch-display" style={{ left: d.x, top: d.y, width: d.w, height: d.h, borderRadius: d.w * 0.2 }}>
        {states.map((s, n) => (
          <img key={s} src={A(`watch_${s}.webp`)} alt="" style={{ opacity: n === i ? 1 : 0 }} />
        ))}
      </div>
    </div>
  );
}

/** CompanionFace(band: .low, style: .ripple) — the character from the ads. */
export function CompanionFace({ size }: { size: number }) {
  return <img src={A('companion_low.webp')} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain' }} />;
}

// ---------------------------------------------------------------- wheel picker

/**
 * SwiftUI's .wheel picker: a drum of rows on a ~75pt cylinder with the
 * selection band in the middle. Native scrolling (momentum + snap) drives it.
 */
export function Wheel<T extends string | number>({ values, value, onChange, format, label }: {
  values: T[]; value: T; onChange: (v: T) => void; format: (v: T) => string; label: string;
}) {
  const ROW = 30;
  const scroller = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(Math.max(0, values.indexOf(value)));
  const settle = useRef<number>(0);
  const index = values.indexOf(value);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = Math.max(0, index) * ROW;
    setPos(Math.max(0, index));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const p = el.scrollTop / ROW;
    setPos(p);
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const n = Math.min(values.length - 1, Math.max(0, Math.round(el.scrollTop / ROW)));
      if (values[n] !== value) onChange(values[n]);
    }, 90);
  };

  const R = 75;
  const step = 22.85; // degrees per row
  const first = Math.max(0, Math.floor(pos) - 4);
  const last = Math.min(values.length - 1, Math.ceil(pos) + 4);
  const rows: ReactNode[] = [];
  for (let n = first; n <= last; n++) {
    const angle = (n - pos) * step;
    if (Math.abs(angle) >= 90) continue;
    const selected = Math.abs(n - pos) < 0.5;
    const fade = Math.cos((angle * Math.PI) / 180);
    rows.push(
      <div
        key={n}
        className="ob-wheel-row"
        style={{
          // A row on the cylinder: lifted by R·sinθ and squashed by cosθ.
          transform: `translateY(${R * Math.sin((angle * Math.PI) / 180)}px) scaleY(${fade})`,
          color: selected ? '#000' : `rgba(0,0,0,${0.32 * fade + 0.04})`,
          opacity: Math.max(0, fade * 1.15 - 0.05),
        }}
      >
        {format(values[n])}
      </div>,
    );
  }

  const keyStep = (dir: number) => {
    const el = scroller.current;
    const n = Math.min(values.length - 1, Math.max(0, index + dir));
    el?.scrollTo({ top: n * ROW, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div className="ob-wheel">
      <div className="ob-wheel-band" />
      <div className="ob-wheel-drum">{rows}</div>
      <div
        ref={scroller}
        className="ob-wheel-scroll"
        onScroll={onScroll}
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuetext={format(value)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') { e.preventDefault(); keyStep(-1); }
          if (e.key === 'ArrowDown') { e.preventDefault(); keyStep(1); }
        }}
      >
        <div style={{ height: 85 - ROW / 2, scrollSnapAlign: 'none' }} />
        {values.map((v) => <div key={String(v)} />)}
        <div style={{ height: 85 - ROW / 2, scrollSnapAlign: 'none' }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- icons (SF Symbol look-alikes)

type IconProps = { size?: number; color?: string; style?: CSSProperties };
const svg = (path: ReactNode, vb = '0 0 24 24') =>
  function I({ size = 17, color = 'currentColor', style }: IconProps) {
    return (
      <svg viewBox={vb} width={size} height={size} fill={color} style={{ display: 'block', flex: 'none', color, ...style }} aria-hidden="true">
        {path}
      </svg>
    );
  };
const stroke = (d: string, w = 2.4) => <path d={d} fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;

export const Icon = {
  chevronLeft: svg(stroke('M15 4.5 7.5 12l7.5 7.5', 2.6)),
  chevronRight: svg(stroke('M9 4.5 16.5 12 9 19.5', 3)),
  arrowRight: svg(stroke('M4 12h15M13 5.5l6.5 6.5-6.5 6.5', 2.8)),
  arrowUp: svg(stroke('M12 20V4.5M5.5 11 12 4.5 18.5 11', 3)),
  arrowDown: svg(stroke('M12 4v15.5M5.5 13 12 19.5 18.5 13', 3)),
  circle: svg(<circle cx="12" cy="12" r="10.4" fill="none" stroke="currentColor" strokeWidth="1.25" />),
  checkCircle: svg(
    <>
      <circle cx="12" cy="12" r="11" />
      <path d="M7 12.4l3.3 3.3L17.2 8.6" fill="none" stroke="var(--ob-check, #000)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>,
  ),
  checkSeal: svg(
    <>
      <path d="M12 1.6l2.5 1.9 3.1-.2 1 2.9 2.6 1.8-.9 3 .9 3-2.6 1.8-1 2.9-3.1-.2L12 22.4l-2.5-1.9-3.1.2-1-2.9-2.6-1.8.9-3-.9-3 2.6-1.8 1-2.9 3.1.2z" />
      <path d="M7.8 12.2l2.8 2.8 5.6-5.8" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </>,
  ),
  shield: svg(
    <>
      <path d="M12 1.8 3.8 5v6.4c0 5.1 3.5 9.4 8.2 10.8 4.7-1.4 8.2-5.7 8.2-10.8V5z" />
      <path d="M8.2 12.1l2.6 2.6 5-5.3" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </>,
  ),
  star: svg(<path d="M12 1.9l3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.4l-6.4 3.7 1.6-7.1L1.8 9.2 9 8.5z" />),
  /** NewPaywallView's soft RoundedStar. */
  roundStar: svg(<path d="M12 2.6c.5 0 .9.3 1.1.7l2.2 4.6 5 .6c.9.1 1.3 1.2.6 1.8l-3.7 3.5.9 5c.2.9-.8 1.6-1.6 1.1L12 17.5l-4.5 2.4c-.8.4-1.8-.2-1.6-1.1l.9-5-3.7-3.5c-.7-.6-.3-1.7.6-1.8l5-.6 2.2-4.6c.2-.4.6-.7 1.1-.7z" />),
  xmark: svg(stroke('M5.5 5.5l13 13M18.5 5.5l-13 13', 3)),
  tag: svg(
    <path d="M3 4.6v6.1c0 .6.2 1.1.6 1.5l8.6 8.6c.8.8 2.1.8 2.9 0l5.8-5.8c.8-.8.8-2.1 0-2.9L12.3 3.5c-.4-.4-.9-.6-1.5-.6H4.7C3.8 2.9 3 3.7 3 4.6zm4.1 4.6a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8z" />,
  ),
};

/** SF's laurel.leading / laurel.trailing: a "(" stem with paired almond leaves. */
export function Laurel({ size = 50, flip = false, color = 'rgba(0,0,0,0.8)' }: { size?: number; flip?: boolean; color?: string }) {
  const P0 = [17, 46], P1 = [0.5, 27], P2 = [14, 3];
  const at = (t: number) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
  ];
  const dir = (t: number) => {
    const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
    const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };
  const leaf = (L: number, W: number) => `M0 0Q${L / 2} ${-W} ${L} 0Q${L / 2} ${W} 0 0Z`;
  const leaves: ReactNode[] = [];
  [0.1, 0.28, 0.46, 0.64, 0.8].forEach((t, i) => {
    const [x, y] = at(t);
    const a = dir(t);
    const L = 8.6 - i * 0.35;
    leaves.push(<path key={`o${i}`} d={leaf(L, 2.5)} transform={`translate(${x} ${y}) rotate(${a - 42})`} />);
    leaves.push(<path key={`i${i}`} d={leaf(L * 0.92, 2.3)} transform={`translate(${x} ${y}) rotate(${a + 40})`} />);
  });
  const [tx, ty] = at(0.96);
  leaves.push(<path key="tip" d={leaf(7.4, 2.4)} transform={`translate(${tx} ${ty}) rotate(${dir(0.96)})`} />);
  return (
    <svg viewBox="-2 0 24 48" width={(size * 24) / 48} height={size} style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined, flex: 'none' }} aria-hidden="true">
      <path d={`M${P0[0]} ${P0[1]}Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <g fill={color}>{leaves}</g>
    </svg>
  );
}

export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}
