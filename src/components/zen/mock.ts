// Canned replies for ZenSalesChat when PUBLIC_ZEN_WEB_URL isn't set (local
// review). The card labels them "Demo replies"; nothing here calls a model.
// Mirrors the live function's rules: plan cards only on buying interest, and
// the $59.99 exit offer at most once per conversation.
import type { PlanId } from '../start/content';

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockReply(turns: Turn[]): Promise<{ reply: string; offer?: PlanId }> {
  await wait(700);
  const last = turns[turns.length - 1]?.content.toLowerCase() ?? '';
  const exitUsed = turns.some((t) => t.role === 'assistant' && t.content.includes('59.99'));

  if (/(expensive|pricey|afford|cheaper|too much|discount|cost too)/.test(last)) {
    if (!exitUsed) {
      return {
        reply:
          "Fair question. There's a one-time option I can offer here: Yearly at $59.99 instead of $83.99. It renews at $59.99 each year until you cancel, and you can cancel anytime.",
        offer: 'yearlyExit',
      };
    }
    return { reply: "Totally fair to weigh it. Yearly is $83.99, about $1.62 a week, and renews each year until you cancel. No pressure either way." };
  }
  if (/(no thanks|not now|maybe later|^no\b)/.test(last)) {
    return { reply: 'No problem at all. The app is a free download whenever you want to look around.' };
  }
  if (/(plan|pick|buy|subscribe|yearly|weekly|sign up|get it)/.test(last)) {
    return {
      reply:
        'If you want to give it a real go, Yearly is the better value: $83.99 a year, about $1.62 a week, versus $14.99 every week. Both renew until you cancel.',
      offer: 'yearly',
    };
  }
  if (/(watch|wear|galaxy|pixel|apple|android|fitbit|oura|device)/.test(last)) {
    return {
      reply:
        'On iPhone it reads Apple Watch data through Apple Health. On Android it uses Health Connect, so Wear OS watches and other wearables that sync there work too.',
    };
  }
  if (/(score|cortisol|measure|show|hrv|sleep)/.test(last)) {
    return {
      reply:
        "It turns your HRV, sleep, resting heart rate and activity into one 0–100 stress-and-recovery score, and shows which factor moved it. Despite the name, it doesn't measure cortisol; it's an estimate from your wearable, not a lab test.",
    };
  }
  return {
    reply: 'I can help with what Cortisol+ tracks, which devices it works with, or which plan fits you. What would be most useful?',
  };
}
