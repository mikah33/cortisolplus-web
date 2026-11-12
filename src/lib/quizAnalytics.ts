// Quiz funnel events for GA4. Only the quiz, the question and the option the
// visitor tapped are sent: no free text, results, emails or identifiers.
// window.gtag only exists once WebsiteAnalytics has loaded Google Analytics for
// a visitor whose privacy choice allows it, so these calls follow that choice.

type Params = Record<string, string | number | boolean>;

export function quizIdFromPath(path: string): string {
  return path.replace(/\/+$/, '').split('/').pop() || 'quiz';
}

export function trackQuiz(event: 'quiz_start' | 'quiz_answer' | 'quiz_complete' | 'quiz_cta_click' | 'quiz_retake', params: Params) {
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (import.meta.env.DEV) console.debug('[quiz-analytics]', event, params);
  w.gtag?.('event', event, params);
}
