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


export default function Quiz({
  questions,
  ctaHref = '/download',
  ctaLabel = 'Get Cortisol+',
}: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const complete = Object.keys(answers).length === questions.length;

  if (submitted && complete) {
    return (
      <div className="p-8 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
        <h2 className="text-2xl font-bold mb-4" tabIndex={-1} ref={(node) => node?.focus()}>Your check-in</h2>
        <p className="text-[color:var(--color-ink-muted)] mb-6">Here is what you reported. This reflection tool has no validated diagnostic scoring and cannot estimate cortisol, hormone status, burnout risk or sleep debt. There is no medical meaning attached to a total.</p>
        <dl className="space-y-4 mb-6">
          {questions.map(q => <div key={q.id}><dt className="font-medium">{q.prompt}</dt><dd>{q.options[answers[q.id]]?.label}</dd></div>)}
        </dl>
        <p className="text-sm text-[color:var(--color-ink-muted)] mb-6">Choose one routine you would like to observe this week. Try the <a className="underline" href="/resources/stress-sleep-journal/">stress and sleep journal</a>. Persistent or concerning symptoms deserve professional advice regardless of your answers. Results stay in this page and are not sent to analytics.</p>

        <div className="flex flex-wrap gap-3">
          <a
            href={ctaHref}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-br from-[color:var(--color-teal-dark)] to-[#005a50] text-white font-semibold text-sm shadow-sm hover:brightness-110 transition"
          >
            {ctaLabel}
          </a>
          <button
            type="button"
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="text-sm text-[color:var(--color-teal-dark)] hover:underline"
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
            {q.options.map((opt, optionIndex) => (
              <label key={opt.label} className="flex items-center gap-3 p-3 rounded-lg border border-[color:var(--color-border)] hover:border-[color:var(--color-teal)]/40 cursor-pointer transition">
                <input
                  type="radio"
                  name={q.id}
                  value={`${q.id}-${optionIndex}`}
                  required
                  checked={answers[q.id] === optionIndex}
                  onChange={() => setAnswers({ ...answers, [q.id]: optionIndex })}
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
        className="w-full px-6 py-4 rounded-full bg-gradient-to-br from-[color:var(--color-teal-dark)] to-[#005a50] disabled:from-[color:var(--color-surface-2)] disabled:to-[color:var(--color-surface-2)] disabled:text-[color:var(--color-ink-muted)] text-white font-semibold shadow-sm hover:brightness-110 transition"
      >
        {complete ? 'Review my check-in' : `Answer all questions (${Object.keys(answers).length} / ${questions.length})`}
      </button>
    </form>
  );
}
