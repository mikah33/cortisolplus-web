import { useState } from 'react';
import { QUESTIONS } from './CortisolCalculator';
import { trackQuiz } from '../lib/quizAnalytics';

// Homepage hook for the 60-second check-in: the first two questions answer
// right here, then the full quiz opens with them filled in (see Quiz.tsx).
const QUIZ_ID = 'cortisol-calculator';
const HREF = '/tools/cortisol-calculator/';
const TEASER = QUESTIONS.slice(0, 2);

export default function QuizTeaser() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const step = TEASER.findIndex((q) => !(q.id in answers));
  const done = step === -1;
  const q = done ? null : TEASER[step];

  const pick = (questionIndex: number, optionIndex: number) => {
    const question = TEASER[questionIndex];
    if (Object.keys(answers).length === 0) {
      trackQuiz('quiz_start', { quiz_id: QUIZ_ID, question_count: QUESTIONS.length, source: 'home_teaser' });
    }
    trackQuiz('quiz_answer', {
      quiz_id: QUIZ_ID,
      question_id: question.id,
      question_number: questionIndex + 1,
      answer_index: optionIndex,
      answer_label: question.options[optionIndex].label,
      changed: false,
      answered_count: Object.keys(answers).length + 1,
      source: 'home_teaser',
    });
    const next = { ...answers, [question.id]: optionIndex };
    setAnswers(next);
    try {
      sessionStorage.setItem(`quiz-prefill:${QUIZ_ID}`, JSON.stringify(next));
    } catch {
      // Storage blocked: the full quiz just starts from question 1.
    }
  };

  return (
    <div className="app-card overflow-hidden p-5">
      <div className="flex items-center justify-between text-xs font-extrabold">
        <span className="text-[color:var(--color-teal-dark)]">Free · 60 seconds</span>
        <span className="tabular-nums text-[color:var(--color-ink-muted)]">
          {done ? `2 of ${QUESTIONS.length} done` : `Question ${step + 1} of ${QUESTIONS.length}`}
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-[color:var(--color-surface-2)]">
        <div
          className="h-full rounded-full bg-[color:var(--color-teal)] transition-[width] duration-300"
          style={{ width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {q ? (
        <fieldset className="mt-4" key={q.id}>
          <legend className="text-[1.25rem] font-extrabold leading-snug tracking-tight">{q.prompt}</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {q.options.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => pick(step, i)}
                className="min-h-[3rem] rounded-2xl bg-[color:var(--color-surface-2)] px-3 py-2.5 text-left text-sm font-bold transition active:scale-[0.97] hover:bg-[#e2e9e9]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <div className="mt-4">
          <p className="text-[1.25rem] font-extrabold leading-snug tracking-tight">Nice start. {QUESTIONS.length - 2} quick questions left.</p>
          <p className="mt-1 text-sm text-[color:var(--color-ink-muted)]">Caffeine, mood, cravings and training. Your answers are saved.</p>
          <a
            href={HREF}
            onClick={() => trackQuiz('quiz_cta_click', { quiz_id: QUIZ_ID, source: 'home_teaser' })}
            className="app-btn mt-4 w-full"
          >
            Finish my check-in ›
          </a>
        </div>
      )}
      <p className="mt-4 text-[11px] leading-snug text-[color:var(--color-ink-muted)]">
        A reflection tool, not a cortisol test or diagnosis.
      </p>
    </div>
  );
}
