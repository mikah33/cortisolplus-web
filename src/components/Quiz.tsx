import { useEffect, useRef, useState } from 'react';
import { quizIdFromPath, trackQuiz } from '../lib/quizAnalytics';
import { SITE } from '../consts';
import { AppleIcon, GooglePlayIcon } from './icons/StoreIcons';

// What Cortisol+ tracks for each kind of answer. Matched on the question's id
// and wording; higher option weights mean more strain in every quiz.
const FEATURES = [
  { key: 'sleep', match: /sleep|rested|wake|night|alarm|asleep|hours|tired/i, icon: '/app-ui/start/perk_sleep.webp', title: 'Sleep', body: 'Scores every night from your watch, stage by stage, so you can see what changes it.' },
  { key: 'stress', match: /stress|pace|switch|dread|exhaust|cynical|irrit|racing|snapping|mood|anxious|effective/i, icon: '/app-ui/start/perk_score.webp', title: 'Stress through the day', body: 'Your watch companion shows your stress score, so you can spot what pushes it up.' },
  { key: 'habits', match: /energy|caffeine|alcohol|screens|cravings|appetite/i, icon: '/app-ui/start/habit_calm.webp', title: 'Habits', body: 'See how caffeine, alcohol and late screens line up with your HRV and sleep.' },
  { key: 'recovery', match: /exercise|train|sick|recover|weekend|belly/i, icon: '/app-ui/start/habit_move.webp', title: 'Recovery & Bio Age', body: 'Follows recovery and pace of aging from your HRV and resting heart rate.' },
  { key: 'tension', match: /jaw|phys|headache|tense/i, icon: '/app-ui/start/perk_calm.webp', title: 'Calm sessions with Zen', body: 'A short guided breathing reset when tension builds.' },
];


export interface QuizOption {
  label: string;
  weight: number;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export interface QuizBand {
  threshold: number;
  band: string;
  tone: 'low' | 'normal' | 'elevated' | 'high';
  body: string;
}

interface Props {
  questions: QuizQuestion[];
  bands: QuizBand[];
  scoreLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
  /** Analytics name; defaults to the page's last path segment. */
  quizId?: string;
}


// One question per screen, like the app's onboarding: tap an answer and the
// next question slides in. Back steps return to change an answer; finishing
// the last question opens the results screen.
export default function Quiz({
  questions,
  ctaHref = '/download/',
  ctaLabel = 'Get Cortisol+',
  quizId,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [dir, setDir] = useState<'next' | 'back'>('next');
  const started = useRef(false);
  const card = useRef<HTMLDivElement>(null);
  const id = () => quizId ?? quizIdFromPath(location.pathname);

  // Answers given in the homepage teaser (QuizTeaser) carry over, and the
  // flow opens on the first unanswered question.
  useEffect(() => {
    try {
      const key = `quiz-prefill:${id()}`;
      const saved = JSON.parse(sessionStorage.getItem(key) || 'null');
      sessionStorage.removeItem(key);
      if (saved && typeof saved === 'object') {
        const valid = Object.fromEntries(
          Object.entries(saved).filter(([qid, i]) => questions.some((q) => q.id === qid && typeof i === 'number' && q.options[i])),
        ) as Record<string, number>;
        if (Object.keys(valid).length) {
          started.current = true;
          setAnswers(valid);
          const next = questions.findIndex((q) => !(q.id in valid));
          setStep(next === -1 ? questions.length - 1 : next);
        }
      }
    } catch {
      // Storage blocked: the quiz simply starts at question 1.
    }
  }, []);

  // Keep the question card in view as the flow moves on.
  const keepInView = () => {
    const el = card.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 72 || top > window.innerHeight * 0.6) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const choose = (optionIndex: number) => {
    if (picked !== null) return;
    const q = questions[step];
    if (!started.current) {
      started.current = true;
      trackQuiz('quiz_start', { quiz_id: id(), question_count: questions.length });
    }
    const next = { ...answers, [q.id]: optionIndex };
    trackQuiz('quiz_answer', {
      quiz_id: id(),
      question_id: q.id,
      question_number: step + 1,
      answer_index: optionIndex,
      answer_label: q.options[optionIndex].label,
      changed: q.id in answers,
      answered_count: Object.keys(next).length,
    });
    setAnswers(next);
    setPicked(optionIndex);
    // A beat to see the selection, then move on.
    window.setTimeout(() => {
      setPicked(null);
      setDir('next');
      if (step + 1 < questions.length) {
        setStep(step + 1);
      } else {
        trackQuiz('quiz_complete', { quiz_id: id(), question_count: questions.length });
        setDone(true);
      }
      requestAnimationFrame(keepInView);
    }, 220);
  };

  const back = () => {
    if (step === 0) return;
    setDir('back');
    setStep(step - 1);
  };

  const restart = () => {
    trackQuiz('quiz_retake', { quiz_id: id() });
    started.current = false;
    setAnswers({});
    setStep(0);
    setDir('back');
    setDone(false);
    requestAnimationFrame(keepInView);
  };

  if (done) {
    // Up to three features tied to the answers with the most strain.
    const strained = questions
      .map((x) => ({ x, w: x.options[answers[x.id]]?.weight ?? 0 }))
      .filter(({ w }) => w >= 2)
      .sort((a, b) => b.w - a.w);
    const picks: typeof FEATURES = [];
    for (const { x } of strained) {
      const f = FEATURES.find((f) => f.match.test(`${x.id} ${x.prompt}`));
      if (f && !picks.includes(f)) picks.push(f);
      if (picks.length === 3) break;
    }
    const personal = picks.length > 0;
    for (const key of ['stress', 'sleep', 'tension']) {
      if (picks.length === 3) break;
      const f = FEATURES.find((f) => f.key === key)!;
      if (!picks.includes(f)) picks.push(f);
    }
    const platform = typeof document !== 'undefined' ? document.documentElement.dataset.platform : undefined;
    const stores = [
      { href: SITE.appStoreUrl, label: 'App Store', os: 'ios' },
      { href: SITE.googlePlayUrl, label: 'Google Play', os: 'android' },
    ].sort((a) => (a.os === platform ? -1 : 0));

    return (
      <div ref={card} className="quiz-card scroll-mt-24 p-5 sm:p-6">
        <div className="text-xs font-extrabold text-[color:var(--color-teal-dark)]">All {questions.length} answered</div>
        <h2 className="mt-1 text-[1.75rem] font-extrabold leading-tight tracking-tight outline-none" tabIndex={-1} ref={(node) => node?.focus()}>
          {personal ? 'Here’s what to watch' : 'Nice. Keep it that way'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
          {personal
            ? 'Based on your answers, these are the patterns Cortisol+ would track for you, every day, from your watch.'
            : 'Your answers look steady. Cortisol+ helps you notice early when that changes.'}
        </p>

        <ul className="mt-4 space-y-2.5">
          {picks.map((f) => (
            <li key={f.key} className="flex items-center gap-3 rounded-2xl bg-[color:var(--color-surface-2)]/70 p-3">
              <img src={f.icon} alt="" width="48" height="48" className="h-11 w-11 shrink-0 object-contain" />
              <div>
                <div className="font-extrabold">{f.title}</div>
                <p className="text-sm leading-snug text-[color:var(--color-ink-muted)]">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <a
          href="/start/"
          onClick={() => trackQuiz('quiz_cta_click', { quiz_id: id(), destination: 'start' })}
          className="app-btn mt-5 w-full"
        >
          Build my plan ›
        </a>
        <div className="mt-4 flex items-center gap-3 text-xs font-bold text-[color:var(--color-ink-muted)]" aria-hidden="true">
          <span className="h-px flex-1 bg-[color:var(--color-surface-2)]" />or download free<span className="h-px flex-1 bg-[color:var(--color-surface-2)]" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {stores.map((st) => (
            <a
              key={st.os}
              href={st.href}
              onClick={() => trackQuiz('quiz_cta_click', { quiz_id: id(), destination: st.os })}
              className="app-btn app-btn--light !min-h-[3rem] !px-3 text-sm"
              {...(st.os === 'ios' ? { 'data-event': 'appstore-click' } : {})}
            >
              {st.os === 'ios' ? <AppleIcon className="h-4 w-4 -mt-0.5" /> : <GooglePlayIcon className="h-4 w-4" />}
              {st.label}
            </a>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] leading-snug text-[color:var(--color-ink-muted)]">Free to download. Analysis needs Pro or an eligible trial. Not a cortisol test or diagnosis.</p>

        <details className="mt-5 rounded-2xl bg-[color:var(--color-surface-2)]/60 px-4 py-3">
          <summary className="cursor-pointer text-sm font-bold">Your answers</summary>
          <dl className="mt-2 divide-y divide-white">
            {questions.map((x) => (
              <div key={x.id} className="flex items-start justify-between gap-4 py-2">
                <dt className="text-sm text-[color:var(--color-ink-muted)]">{x.prompt}</dt>
                <dd className="shrink-0 text-right text-sm font-extrabold">{x.options[answers[x.id]]?.label}</dd>
              </div>
            ))}
          </dl>
        </details>
        <button type="button" onClick={restart} className="mt-4 w-full text-center text-sm font-bold text-[color:var(--color-teal-dark)]">
          Retake the check-in
        </button>
        <p className="mt-3 text-center text-[11px] leading-snug text-[color:var(--color-ink-muted)]">This reflection tool has no validated scoring and can’t estimate cortisol or burnout. Persistent symptoms deserve professional advice. With your analytics choice, we count which options are picked, anonymously.</p>
      </div>
    );
  }

  const q = questions[step];
  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div>
      <div ref={card} className="quiz-card scroll-mt-24 overflow-hidden p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            aria-label="Previous question"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-surface-2)] text-lg font-bold transition active:scale-95 disabled:invisible"
          >
            ‹
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={Object.keys(answers).length} aria-label="Questions answered">
            <div className="h-full rounded-full bg-[color:var(--color-teal)] transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="w-9 shrink-0 text-center text-xs font-extrabold tabular-nums text-[color:var(--color-ink-muted)]">{step + 1}/{questions.length}</span>
        </div>

        <fieldset key={q.id} className={`quiz-step quiz-step--${dir} mt-6`}>
          <legend className="text-[1.5rem] font-extrabold leading-tight tracking-tight text-balance">{q.prompt}</legend>
          <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label={q.prompt}>
            {q.options.map((opt, optionIndex) => {
              const on = picked === optionIndex || (picked === null && answers[q.id] === optionIndex);
              return (
                <button
                  key={opt.label}
                  type="button"
                  role="radio"
                  aria-checked={answers[q.id] === optionIndex}
                  onClick={() => choose(optionIndex)}
                  className={`flex min-h-[3.5rem] items-center justify-between gap-3 rounded-2xl border-[2.5px] px-4 py-3 text-left font-bold transition active:scale-[0.98] ${on ? 'border-[color:var(--color-ink)] bg-white' : 'border-transparent bg-[color:var(--color-surface-2)] hover:bg-[#e2e9e9]'}`}
                >
                  {opt.label}
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${on ? 'border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white' : 'border-[#c7cfd6]'}`} aria-hidden="true">
                    {on && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Every question stays in the page for search engines and for anyone who wants to preview. */}
      <details className="group mt-3 px-1 text-sm">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 font-semibold text-[color:var(--color-ink-muted)] [&::-webkit-details-marker]:hidden">
          See all {questions.length} questions <span className="transition-transform group-open:rotate-90" aria-hidden="true">›</span>
        </summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[color:var(--color-ink-muted)]">
          {questions.map((x) => <li key={x.id}>{x.prompt}</li>)}
        </ol>
      </details>

      <style>{`
        .quiz-card { background: white; border-radius: 1.75rem; box-shadow: 0 1px 2px rgba(15,20,25,.04), 0 12px 32px -16px rgba(15,20,25,.18); }
        .quiz-step { animation: quiz-in .28s cubic-bezier(.16,1,.3,1) both; }
        .quiz-step--back { animation-name: quiz-in-back; }
        @keyframes quiz-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
        @keyframes quiz-in-back { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .quiz-step { animation: none; } }
      `}</style>
    </div>
  );
}
