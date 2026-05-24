import { useState } from 'react';

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
}

const TONE: Record<QuizBand['tone'], string> = {
  low: 'text-[color:var(--color-level-low)]',
  normal: 'text-[color:var(--color-level-normal)]',
  elevated: 'text-[color:var(--color-level-elevated)]',
  high: 'text-[color:var(--color-level-high)]',
};

export default function Quiz({
  questions,
  bands,
  scoreLabel = 'Your result',
  ctaHref = '/download',
  ctaLabel = 'Get Cortisol+',
}: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const max = questions.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.weight)), 0);
  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const complete = Object.keys(answers).length === questions.length;

  if (submitted && complete) {
    const pct = score / max;
    const band = bands.find((b, i) => pct < b.threshold || i === bands.length - 1) ?? bands[bands.length - 1];

    return (
      <div className="p-8 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-ink-muted)] mb-2">{scoreLabel}</div>
        <div className={`text-4xl font-bold mb-4 ${TONE[band.tone]}`}>{band.band}</div>
        <p className="text-[color:var(--color-ink-muted)] mb-8">{band.body}</p>

        <div className="mb-8">
          <div className="text-sm text-[color:var(--color-ink-muted)] mb-2">Score</div>
          <div className="h-2 rounded-full bg-[color:var(--color-surface-2)] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[color:var(--color-teal)] to-[color:var(--color-coral)]" style={{ width: `${pct * 100}%` }} />
          </div>
          <div className="text-xs text-[color:var(--color-ink-muted)] mt-2 tabular-nums">{score} / {max}</div>
        </div>

        <p className="text-sm text-[color:var(--color-ink-muted)] mb-6">
          This quiz is educational, not diagnostic. For continuous, biometric-based tracking, install Cortisol+ on your iPhone and Apple Watch.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href={ctaHref}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-br from-[color:var(--color-teal)] to-[color:var(--color-teal-dark)] text-white font-semibold text-sm shadow-sm hover:brightness-110 transition"
          >
            {ctaLabel}
          </a>
          <button
            type="button"
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="text-sm text-[color:var(--color-teal)] hover:underline"
          >
            ← Retake quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
      className="space-y-6"
    >
      {questions.map((q, i) => (
        <fieldset key={q.id} className="p-6 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
          <legend className="text-xs uppercase tracking-widest text-[color:var(--color-ink-muted)] mb-2">Question {i + 1} of {questions.length}</legend>
          <div className="text-lg font-medium mb-4">{q.prompt}</div>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label key={opt.label} className="flex items-center gap-3 p-3 rounded-lg border border-[color:var(--color-border)] hover:border-[color:var(--color-teal)]/40 cursor-pointer transition">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === opt.weight}
                  onChange={() => setAnswers({ ...answers, [q.id]: opt.weight })}
                  className="accent-[color:var(--color-teal)]"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <button
        type="submit"
        disabled={!complete}
        className="w-full px-6 py-4 rounded-full bg-gradient-to-br from-[color:var(--color-teal)] to-[color:var(--color-teal-dark)] disabled:from-[color:var(--color-surface-2)] disabled:to-[color:var(--color-surface-2)] disabled:text-[color:var(--color-ink-muted)] text-white font-semibold shadow-sm hover:brightness-110 transition"
      >
        {complete ? 'See my result' : `Answer all questions (${Object.keys(answers).length} / ${questions.length})`}
      </button>
    </form>
  );
}
