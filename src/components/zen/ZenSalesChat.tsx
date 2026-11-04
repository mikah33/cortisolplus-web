// Zen on the homepage: an inline chat card where visitors ask about the app
// and Zen can attach one of the /start/ web plans. Replies come from the
// zenWebChat function (PUBLIC_ZEN_WEB_URL); without that set, a labeled local
// demo answers instead so the UI can be reviewed without deploying.
//
// Buying reuses /start/'s checkout and its unlock screen: the purchase is saved
// where /start/ looks for it, then the buyer is sent there.
import { useEffect, useRef, useState } from 'react';
import { CHECKOUT_ENABLED, PLANS, type PlanId } from '../start/content';
import { writePurchase } from '../start/purchase';
import { mockReply } from './mock';

const ENDPOINT = import.meta.env.PUBLIC_ZEN_WEB_URL as string | undefined;
const DEMO = !ENDPOINT;

type Offer = PlanId;
interface Message {
  role: 'user' | 'assistant';
  content: string;
  offer?: Offer;
}

const SUGGESTIONS = [
  'What does my score actually show?',
  'Does it work with my watch?',
  'Which plan should I pick?',
];

const GREETING =
  "Hi, I'm Zen. Ask me anything about Cortisol+: what it tracks, how the score works, or which plan fits you.";

const money = (n: number) => `$${n.toFixed(2)}`;

function newConversationId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }
}

async function askZen(conversationId: string, messages: Message[]): Promise<{ reply: string; offer?: Offer }> {
  const turns = messages.map(({ role, content }) => ({ role, content }));
  if (DEMO) return mockReply(turns);
  const res = await fetch(ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, messages: turns }),
  });
  if (!res.ok) throw new Error(`Zen is unavailable (${res.status})`);
  const data = await res.json();
  const offer = (['weekly', 'yearly', 'yearlyExit'] as const).find((p) => p === data.offer);
  return { reply: String(data.reply || ''), offer };
}

export default function ZenSalesChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState('');
  const conversationId = useRef('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationId.current = newConversationId();
  }, []);

  // Keep the newest message in view inside the card, without moving the page.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const content = text.trim().slice(0, 600);
    if (!content || thinking) return;
    const next: Message[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setDraft('');
    setError('');
    setThinking(true);
    try {
      const { reply, offer } = await askZen(conversationId.current, next);
      setMessages([...next, { role: 'assistant', content: reply, offer }]);
    } catch {
      setError("Zen couldn't answer just now. Try again in a moment.");
      setMessages(messages);
      setDraft(content);
    } finally {
      setThinking(false);
    }
  };

  const onSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    void send(draft);
  };

  return (
    <div className="app-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-4">
        <img src="/app-ui/zen_greet.webp" alt="" width="306" height="480" className="h-14 w-auto shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold">Ask Zen</span>
            {DEMO && (
              <span className="rounded-full bg-[#fff4e0] px-2 py-0.5 text-[10px] font-extrabold text-[#8a4b00]">
                Demo replies · not live
              </span>
            )}
          </div>
          <p className="text-sm leading-snug text-[color:var(--color-ink-muted)]">{GREETING}</p>
        </div>
      </div>

      <div
        ref={listRef}
        className="mt-3 max-h-[26rem] space-y-3 overflow-y-auto px-4 pb-1"
        role="log"
        aria-live="polite"
        aria-label="Conversation with Zen"
      >
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <p key={i} className="ml-auto w-fit max-w-[85%] rounded-[1.1rem] rounded-br-md bg-[rgba(18,24,38,0.9)] px-3.5 py-2 text-sm text-white">
              {m.content}
            </p>
          ) : (
            <div key={i} className="max-w-[92%]">
              <p className="w-fit rounded-[1.1rem] rounded-bl-md bg-[color:var(--color-surface-2,#f2f4f7)] px-3.5 py-2 text-sm leading-relaxed">
                {m.content}
              </p>
              {m.offer && <PlanCard plan={m.offer} />}
            </div>
          ),
        )}
        {thinking && (
          <p className="w-fit rounded-[1.1rem] rounded-bl-md bg-[color:var(--color-surface-2,#f2f4f7)] px-3.5 py-2 text-sm text-[color:var(--color-ink-muted)]">
            <span className="sr-only">Zen is typing</span>
            <span aria-hidden="true" className="zen-dots">•••</span>
          </p>
        )}
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void send(s)}
              className="rounded-full border border-[color:var(--color-ink)]/10 bg-white px-3 py-1.5 text-left text-[13px] font-bold transition active:scale-[0.97]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="px-4 pt-2 text-sm font-bold text-[#c0392b]" role="alert">{error}</p>}

      <form onSubmit={onSubmit} className="flex items-center gap-2 p-4">
        <label htmlFor="zen-input" className="sr-only">Message Zen</label>
        <input
          id="zen-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={600}
          placeholder="Ask Zen anything about the app"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-full border border-[color:var(--color-ink)]/10 bg-white px-4 py-2.5 text-[16px] outline-none focus:border-[color:var(--color-teal)]"
        />
        <button
          type="submit"
          disabled={!draft.trim() || thinking}
          aria-label="Send"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[rgba(18,24,38,0.92)] text-white transition disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      <p className="px-4 pb-4 text-[11px] leading-snug text-[color:var(--color-ink-muted)]">
        Zen is an AI guide. It explains the app and can suggest a plan; it doesn't give medical advice, and Cortisol+ doesn't measure cortisol.
      </p>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .zen-dots { animation: zen-dots 1.2s ease-in-out infinite; letter-spacing: 0.15em; }
        }
        @keyframes zen-dots { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

function PlanCard({ plan }: { plan: Offer }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const weekly = PLANS.weekly.price;
  const yearly = PLANS.yearly.price;
  const exit = plan === 'yearlyExit';
  const price = PLANS[plan].price;
  const period = plan === 'weekly' ? 'week' : 'year';

  const buy = async () => {
    if (!CHECKOUT_ENABLED) {
      window.location.href = '/start/';
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { checkout } = await import('../start/checkout');
      const result = await checkout(plan, { web_source: 'zen_chat' });
      if (result.status === 'purchased') {
        writePurchase({
          plan,
          email: result.email ?? null,
          redeemUrl: result.redeemUrl ?? null,
          redeemUrlRedirect: result.redeemUrlRedirect ?? null,
        });
        // /start/ shows a saved purchase's unlock and download screen.
        window.location.href = '/start/';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative mt-2 rounded-[1.25rem] border-[2px] border-[rgba(18,24,38,0.9)] bg-white p-4">
      {exit && (
        <span className="absolute -top-2.5 left-3 rounded-full bg-[color:var(--color-teal)] px-2 py-0.5 text-[11px] font-extrabold">
          One-time offer · save {Math.round((1 - price / yearly) * 100)}%
        </span>
      )}
      {plan === 'yearly' && (
        <span className="absolute -top-2.5 left-3 rounded-full bg-[rgba(18,24,38,0.9)] px-2 py-0.5 text-[11px] font-extrabold text-white">
          Save {Math.round((1 - yearly / (weekly * 52)) * 100)}% vs weekly
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-extrabold">{plan === 'weekly' ? 'Weekly' : 'Yearly'}</span>
        <span className="tabular-nums">
          {exit && <span className="mr-1.5 text-sm font-bold text-[color:var(--color-ink-muted)] line-through">{money(yearly)}</span>}
          <span className="text-2xl font-extrabold">{money(price)}</span>
          <span className="text-sm font-semibold">/{period === 'week' ? 'wk' : 'yr'}</span>
        </span>
      </div>
      {plan !== 'weekly' && (
        <p className="text-xs font-semibold text-[color:var(--color-ink-muted)]">About {money(price / 52)} a week</p>
      )}
      <button type="button" onClick={() => void buy()} disabled={busy} className="app-btn mt-3 w-full">
        {busy ? 'Opening checkout…' : exit ? 'Claim this offer' : `Get ${plan === 'weekly' ? 'Weekly' : 'Yearly'}`}
      </button>
      {error && <p className="mt-2 text-center text-sm font-bold text-[#c0392b]" role="alert">{error}</p>}
      <p className="mt-2 text-center text-[11px] leading-snug text-[color:var(--color-ink-muted)]">
        You'll be charged {money(price)} today and every {period} until you cancel. Cancel anytime.
      </p>
    </div>
  );
}
