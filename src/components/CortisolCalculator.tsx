import { useState } from 'react';

interface Question {
  id: string;
  prompt: string;
  options: { label: string; weight: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'sleep',
    prompt: 'How many hours do you typically sleep?',
    options: [
      { label: '8+ hours', weight: 0 },
      { label: '7–8 hours', weight: 1 },
      { label: '6–7 hours', weight: 2 },
      { label: 'Under 6 hours', weight: 3 },
    ],
  },
  {
    id: 'wake',
    prompt: 'Do you wake feeling rested?',
    options: [
      { label: 'Usually', weight: 0 },
      { label: 'Sometimes', weight: 1 },
      { label: 'Rarely', weight: 2 },
      { label: 'Never', weight: 3 },
    ],
  },
  {
    id: 'stress',
    prompt: 'How would you describe your stress level day-to-day?',
    options: [
      { label: 'Low', weight: 0 },
      { label: 'Moderate', weight: 1 },
      { label: 'High', weight: 2 },
      { label: 'Constant', weight: 3 },
    ],
  },
  {
    id: 'belly',
    prompt: 'Have you noticed weight gain around your midsection?',
    options: [
      { label: 'No', weight: 0 },
      { label: 'Slightly', weight: 1 },
      { label: 'Yes, noticeably', weight: 2 },
      { label: 'Yes, rapidly', weight: 3 },
    ],
  },
  {
    id: 'caffeine',
    prompt: 'How much caffeine do you drink per day?',
    options: [
      { label: 'None', weight: 0 },
      { label: '1 cup', weight: 1 },
      { label: '2–3 cups', weight: 2 },
      { label: '4+ cups', weight: 3 },
    ],
  },
  {
    id: 'cravings',
    prompt: 'Do you crave sugary or salty foods?',
    options: [
      { label: 'Rarely', weight: 0 },
      { label: 'Sometimes', weight: 1 },
      { label: 'Often', weight: 2 },
      { label: 'Constantly', weight: 3 },
    ],
  },
  {
    id: 'mood',
    prompt: 'Mood: anxious, irritable, or wired-but-tired?',
    options: [
      { label: 'Rarely', weight: 0 },
      { label: 'Sometimes', weight: 1 },
      { label: 'Most days', weight: 2 },
      { label: 'All the time', weight: 3 },
    ],
  },
  {
    id: 'exercise',
    prompt: 'Do you exercise intensely (>5 days/week)?',
    options: [
      { label: 'No, I rest enough', weight: 0 },
      { label: 'Moderate, with recovery', weight: 0 },
      { label: 'Yes, daily hard sessions', weight: 2 },
      { label: 'Yes, often overtrained', weight: 3 },
    ],
  },
];

function interpret(score: number, max: number) {
  const pct = score / max;
  if (pct < 0.25) return { band: 'Low', tone: 'low', body: "Signs point to a healthy cortisol pattern. Keep doing what you're doing." };
  if (pct < 0.5) return { band: 'Normal', tone: 'normal', body: 'A few signals worth watching. Tracking your HRV and sleep daily would surface trends.' };
  if (pct < 0.75) return { band: 'Elevated', tone: 'elevated', body: 'Multiple high-cortisol indicators. Real-time tracking can pinpoint your worst triggers.' };
  return { band: 'High', tone: 'high', body: 'Most major indicators are elevated. Daily HRV-based tracking + a doctor visit are worth it.' };
}

export default function CortisolCalculator() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const max = QUESTIONS.length * 3;
  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const complete = Object.keys(answers).length === QUESTIONS.length;

  if (submitted && complete) {
    const result = interpret(score, max);
    const toneMap: Record<string, string> = {
      low: 'text-[color:var(--color-level-low)]',
      normal: 'text-[color:var(--color-level-normal)]',
      elevated: 'text-[color:var(--color-level-elevated)]',
      high: 'text-[color:var(--color-level-high)]',
    };
    const toneClass = toneMap[result.tone];

    return (
      <div className="p-8 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
        <div className="text-sm text-[color:var(--color-ink-muted)] uppercase tracking-wider mb-2">Your result</div>
        <div className={`text-4xl font-bold mb-4 ${toneClass}`}>{result.band}</div>
        <p className="text-[color:var(--color-ink-muted)] mb-8">{result.body}</p>

        <div className="mb-8">
          <div className="text-sm text-[color:var(--color-ink-muted)] mb-2">Score</div>
          <div className="h-2 rounded-full bg-[color:var(--color-surface-2)] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[color:var(--color-teal)] to-[color:var(--color-coral)]" style={{ width: `${(score / max) * 100}%` }} />
          </div>
          <div className="text-xs text-[color:var(--color-ink-muted)] mt-2">{score} / {max}</div>
        </div>

        <p className="text-sm text-[color:var(--color-ink-muted)] mb-4">
          This quiz is educational, not diagnostic. For a continuous, biometric-based reading, install Cortisol+ on your iPhone and Apple Watch.
        </p>

        <button
          onClick={() => { setAnswers({}); setSubmitted(false); }}
          className="text-sm text-[color:var(--color-teal)] hover:underline"
        >
          ← Retake quiz
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
      className="space-y-8"
    >
      {QUESTIONS.map((q, i) => (
        <fieldset key={q.id} className="p-6 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
          <legend className="text-sm text-[color:var(--color-ink-muted)] mb-2">Question {i + 1} of {QUESTIONS.length}</legend>
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
        {complete ? 'See my result' : `Answer all questions (${Object.keys(answers).length} / ${QUESTIONS.length})`}
      </button>
    </form>
  );
}
