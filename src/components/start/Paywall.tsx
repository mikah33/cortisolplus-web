// NewPaywallView (5.9) with its one-time exit offer, plus the web-only
// screen after a purchase (download the app, unlock Pro).

import type { ReactNode } from 'react';
import { A, BackButton, BlockButton, Col, CompanionFace, Glass, Icon, Laurel, Txt, useShown, useStage } from './ui';
import { PLANS, type Platform } from './content';

const money = (n: number) => `$${n.toFixed(2)}`;
/** "Only $X/Month": a year ÷ 12, or a week × 52 ÷ 12 rounded up to .99; whole amounts drop the cents. */
function perMonth(plan: 'weekly' | 'yearly') {
  const price = PLANS[plan].price;
  const m = plan === 'weekly' ? Math.floor((price * 52) / 12) + 0.99 : price / 12;
  return Math.abs(m - Math.round(m)) < 0.005 ? `$${Math.round(m)}` : money(m);
}

export type PaywallPlan = 'weekly' | 'yearly';

export function Paywall({ plan, setPlan, rating, usersCount, busy, error, onBuy, onBack, onRestore, inAppBrowser, platform }: {
  plan: PaywallPlan;
  setPlan: (p: PaywallPlan) => void;
  rating: number;
  usersCount: string;
  busy: boolean;
  error: string;
  onBuy: () => void;
  onBack: () => void;
  onRestore: () => void;
  inAppBrowser: boolean;
  platform: Platform;
}) {
  const st = useStage();
  const header = useShown(100);
  const perks = useShown(340);
  const plans = useShown(460);
  const cta = useShown(580);
  const weekly = PLANS.weekly.price;
  const yearly = PLANS.yearly.price;
  const save = Math.round((1 - yearly / (weekly * 52)) * 100);

  // The header is the full-width rocket art (ignoring the top safe area). On
  // a screen shorter than the app's, it gives up sky from its top so the page
  // still fits without scrolling.
  // In the app the rocket starts at the very top of the screen while the
  // page below it is laid out from under the status bar, which leaves a
  // status-bar-tall gap (47pt on a 16e) between the art and the stats.
  const natural = (st.w * 856) / 1200;
  const gap = Math.max(0, 47 - st.top);
  const below = 500 + (inAppBrowser && platform === 'ios' ? 40 : 0);
  const boxH = Math.max(150 + gap, Math.min(natural + gap, st.h + st.top - below));
  const headerH = boxH - gap;

  const perkRows: { icon: ReactNode; text: string }[] = [
    { icon: <img src={A('perk_score.webp')} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />, text: 'Your daily cortisol score' },
    { icon: <CompanionFace size={28} />, text: 'Stress companion on your watch' },
    { icon: <img src={A('perk_sleep.webp')} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />, text: 'Sleep, HRV & recovery insights' },
  ];

  const tile = (id: PaywallPlan, title: string, price: number, period: string, badge: string) => {
    const on = plan === id;
    return (
      <button type="button" className="ob-plan-tile" role="radio" aria-checked={on} onClick={() => setPlan(id)}>
        <span className="ob-t" style={{ fontSize: 11, fontWeight: 700, color: '#fff', padding: '4px 10px', borderRadius: 999, background: on ? 'var(--ob-teal)' : 'rgba(0,0,0,0.35)', transition: 'background-color 300ms', whiteSpace: 'nowrap' }}>
          {badge}
        </span>
        <Glass radius={16} className={`ob-plan-box ${on ? 'is-sel' : ''}`} style={{ opacity: on ? 1 : 0.75 }}>
          <span className="ob-t" style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 1, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: on ? 'var(--ob-teal)' : '#000', transition: 'color 300ms', lineHeight: 1.15 }}>{money(price)}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.45)' }}>{period}</span>
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: on ? 'var(--ob-teal)' : 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: 999, background: on ? 'rgba(74,194,158,0.14)' : 'rgba(0,0,0,0.06)', whiteSpace: 'nowrap', transition: 'all 300ms' }}>
            Only {perMonth(id)}/Month
          </span>
        </Glass>
      </button>
    );
  };

  return (
    <>
      <Col className="ob-flex" style={{ alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', height: boxH, marginTop: -st.top, flex: 'none' }}>
          <img
            src={A('paywall_header.webp')}
            alt=""
            style={{
              width: '100%', height: headerH, objectFit: 'cover', objectPosition: '50% 88%',
              WebkitMaskImage: 'linear-gradient(180deg, #000 52%, rgba(0,0,0,0.45) 80%, transparent 100%)',
              maskImage: 'linear-gradient(180deg, #000 52%, rgba(0,0,0,0.45) 80%, transparent 100%)',
            }}
          />
          <div className={`ob-fs ${header ? 'on' : ''}`} style={{ position: 'absolute', left: 0, right: 0, top: headerH - 36, display: 'flex', justifyContent: 'center', gap: 14, filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.7))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Laurel size={46} />
              <div className="ob-flex" style={{ width: 78, alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1 }}>{usersCount}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.75)' }}>users</span>
              </div>
              <Laurel size={46} flip />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }} aria-label={`Rated ${rating} out of 5 on the App Store`}>
              <Laurel size={46} />
              <div className="ob-flex" style={{ width: 78, alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1 }}>{rating}</span>
                <span style={{ display: 'flex', gap: 3 }}>{[0, 1, 2, 3, 4].map((i) => <Icon.roundStar key={i} size={11} color="#000" />)}</span>
              </div>
              <Laurel size={46} flip />
            </div>
          </div>
        </div>

        <div style={{ height: 4, flex: 'none' }} />
        <h1 className={`ob-fs ${header ? 'on' : ''} ob-t`} style={{ fontSize: 27, fontWeight: 700, padding: '0 20px', whiteSpace: 'nowrap' }}>Explore Calmer Days</h1>
        <div style={{ height: 22, flex: 'none' }} />

        <ul className={`ob-fs ${perks ? 'on' : ''} ob-flex`} style={{ gap: 14, alignSelf: 'stretch', padding: '0 40px', margin: 0, listStyle: 'none' }}>
          {perkRows.map((p) => (
            <li key={p.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 30, display: 'grid', placeItems: 'center', flex: 'none' }}>{p.icon}</span>
              <span className="ob-t" style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{p.text}</span>
            </li>
          ))}
        </ul>

        <div className="ob-spacer" style={{ minHeight: 22 }} />

        <div className={`ob-fs ${plans ? 'on' : ''}`} role="radiogroup" aria-label="Choose a plan" style={{ display: 'flex', alignItems: 'flex-end', gap: 12, alignSelf: 'stretch', padding: '0 24px' }}>
          {tile('weekly', 'Weekly', weekly, '/wk', 'Popular')}
          {tile('yearly', 'Yearly', yearly, '/year', save > 0 ? `Save ${save}%` : 'Best value')}
        </div>
        {error && <p className="ob-sys" role="alert" style={{ fontSize: 12, color: '#ff3b30', textAlign: 'center', padding: '4px 16px 0' }}>{error}</p>}
        {inAppBrowser && platform === 'ios' && (
          <p className="ob-sys" style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', textAlign: 'center', padding: '8px 28px 0' }}>
            Apple Pay isn't available in this app's browser. Open this page in Safari to use it, or pay by card.
          </p>
        )}

        <div style={{ height: 20, flex: 'none' }} />
        <div className={`ob-fs ${cta ? 'on' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon.shield size={15} color="var(--ob-teal)" />
          <span className="ob-t" style={{ fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>Cancel anytime. No commitment.</span>
        </div>
        <div style={{ height: 12, flex: 'none' }} />
        <div className={`ob-fs ${cta ? 'on' : ''}`} style={{ alignSelf: 'stretch', padding: '0 24px' }}>
          <BlockButton onClick={onBuy} disabled={busy} weight={700}>
            {busy ? 'Processing...' : <>Start My Journey <Icon.chevronRight size={15} /></>}
          </BlockButton>
        </div>
        <div style={{ height: 10, flex: 'none' }} />
        <div className={`ob-fs ${cta ? 'on' : ''} ob-flex`} style={{ alignItems: 'center', gap: 3 }}>
          <div className="ob-t" style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.4)' }}>
            <button type="button" onClick={onRestore} style={{ color: 'var(--ob-teal)' }}>Restore</button>
            <span style={{ color: 'rgba(0,0,0,0.3)' }}>·</span>
            <a href="/privacy/" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <span style={{ color: 'rgba(0,0,0,0.3)' }}>·</span>
            <a href="/terms/" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          </div>
          <p className="ob-t" style={{ fontSize: 10.5, color: 'rgba(0,0,0,0.4)' }}>
            Charged {plan === 'yearly' ? `${money(yearly)} now and every year` : `${money(weekly)} now and every week`} until you cancel.
          </p>
        </div>
        <div style={{ height: 8, flex: 'none' }} />
      </Col>
      <BackButton onClick={onBack} style={{ top: st.top + 50, left: st.left + 20 }} />
    </>
  );
}

// ---------------------------------------------------------------- exit offer

export function ExitOffer({ busy, error, onClaim, onClose }: { busy: boolean; error: string; onClaim: () => void; onClose: () => void }) {
  const st = useStage();
  const regular = PLANS.yearly.price;
  const offer = PLANS.yearlyExit.price;
  const pct = Math.round(((regular - offer) / regular) * 100);
  return (
    <div className="ob-fill" style={{ background: '#fff', zIndex: 80, animation: 'ob-exit-in 400ms cubic-bezier(0.3, 1.1, 0.4, 1) both' }} role="dialog" aria-label="One-time offer">
      <style>{'@keyframes ob-exit-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: none; } }'}</style>
      <Col>
        <button type="button" className="ob-x" onClick={onClose} aria-label="Close" style={{ position: 'absolute', left: 20, top: 8, zIndex: 2 }}>
          <Icon.xmark size={15} color="rgba(0,0,0,0.55)" />
        </button>
        <div className="ob-vscroll" style={{ position: 'absolute', inset: 0 }}>
          <div className="ob-flex" style={{ minHeight: Math.max(st.height - 90, 0), boxSizing: 'content-box', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '50px 26px 30px', textAlign: 'center' }}>
            <span className="ob-sys" style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: '#fff', padding: '6px 16px', borderRadius: 999, background: 'var(--ob-coral)' }}>
              EXCLUSIVE {'—'} ONE-TIME OFFER
            </span>
            <img src={A('zen_surprised_sky.webp')} alt="Zen, surprised" style={{ height: 130, width: 'auto' }} />
            <div className="ob-flex" style={{ gap: 10, padding: '0 8px' }}>
              <Txt as="h1" className="ob-t" style={{ fontSize: 26, fontWeight: 700 }}>{'Wait! Is price your hold\u2011up?'}</Txt>
              <p className="ob-t" style={{ fontSize: 15, fontWeight: 500, color: 'rgba(0,0,0,0.55)' }}>
                An exclusive discount, just for you.{' '}
                <strong style={{ fontWeight: 800, color: '#000' }}>This is the ONLY time you'll ever see this offer {'—'} it won't come back.</strong>
              </p>
            </div>
            <div className="ob-flex" style={{ width: '100%', maxWidth: 230, alignItems: 'center', gap: 4, padding: '16px 0', borderRadius: 18, background: 'rgba(74,194,158,0.12)', boxShadow: 'inset 0 0 0 2px var(--ob-teal)' }}>
              <span className="ob-t" style={{ fontSize: 14, fontWeight: 700 }}>Yearly</span>
              <span className="ob-t" style={{ fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.35)', textDecoration: 'line-through' }}>{money(regular)}</span>
              <span className="ob-t" style={{ fontSize: 26, fontWeight: 800, color: 'var(--ob-teal)' }}>{money(offer)}</span>
              <span className="ob-t" style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.5)' }}>per year</span>
              <span className="ob-t" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ob-teal)' }}>{money(offer / 12)}/mo</span>
              <span className="ob-t" style={{ fontSize: 11, fontWeight: 800, color: '#fff', padding: '3px 10px', borderRadius: 999, background: 'var(--ob-coral)', marginTop: 2 }}>SAVE {pct}%</span>
            </div>
            <button type="button" className="ob-sys" onClick={onClaim} disabled={busy} style={{ width: '100%', height: 56, borderRadius: 16, background: 'var(--ob-teal)', color: '#fff', fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {busy ? 'Processing...' : <><Icon.tag size={18} /> Claim My Offer</>}
            </button>
            {error && <p className="ob-sys" role="alert" style={{ fontSize: 12, color: '#ff3b30' }}>{error}</p>}
            <button type="button" className="ob-sys" onClick={onClose} style={{ fontSize: 15, color: 'rgba(60,60,67,0.6)', marginTop: 2 }}>No thanks</button>
            <p className="ob-t" style={{ fontSize: 10.5, color: 'rgba(0,0,0,0.4)', marginTop: -8 }}>Charged {money(offer)} now and every year until you cancel.</p>
          </div>
        </div>
      </Col>
    </div>
  );
}

// ---------------------------------------------------------------- after a web purchase

export function Done({ name, platform, purchased, unlockUrl, unlockQr, downloadQr, appStoreUrl, googlePlayUrl }: {
  name: string; platform: Platform; purchased: boolean; unlockUrl: string | null; unlockQr: string; downloadQr: string;
  appStoreUrl: string; googlePlayUrl: string;
}) {
  const fn = name.trim().split(/\s+/)[0] ?? '';
  const desktop = platform === 'other';
  const steps = [
    { title: 'Download Cortisol+', body: desktop ? 'Free on the App Store and Google Play.' : `Free on ${platform === 'android' ? 'Google Play' : 'the App Store'}.` },
    desktop
      ? { title: 'Scan the unlock code with that phone', body: 'It opens Cortisol+ and turns on your subscription. We emailed you the same link.' }
      : { title: 'Tap “Unlock Pro” on this phone', body: 'It opens Cortisol+ and turns on your subscription. We emailed you the same link.' },
    { title: 'Connect your watch', body: `Allow ${platform === 'android' ? 'Health Connect' : platform === 'ios' ? 'Apple Health' : 'Apple Health or Health Connect'} so Zen can read heart rate, HRV and sleep.` },
  ];
  const store = (which: 'ios' | 'android') => (
    <a
      href={which === 'ios' ? appStoreUrl : googlePlayUrl}
      className="ob-block"
      data-event={which === 'ios' ? 'appstore-click' : 'googleplay-click'}
      style={{ textDecoration: 'none', fontWeight: 700 }}
    >
      {which === 'ios' ? 'Download on the App Store' : 'Get it on Google Play'}
    </a>
  );
  return (
    <Col className="ob-flex">
      <div className="ob-vscroll" style={{ flex: 1, minHeight: 0 }}>
        <div className="ob-flex" style={{ padding: '40px 24px 16px', gap: 0 }}>
          {!purchased && (
            <span className="ob-t" style={{ alignSelf: 'center', fontSize: 12, fontWeight: 800, color: '#8a4b00', background: '#fff4e0', padding: '4px 12px', borderRadius: 999, marginBottom: 12 }}>
              Sample screen · nothing was charged
            </span>
          )}
          <div className="ob-flex" style={{ alignItems: 'center', textAlign: 'center' }}>
            <img src={A('zen_celebrate.webp')} alt="" style={{ height: 150, width: 'auto' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 10, color: 'rgb(51,184,140)' }}>
              <Icon.checkSeal size={15} />
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5 }}>PRO UNLOCKED</span>
            </div>
            <h1 className="ob-t" style={{ fontSize: 30, fontWeight: 700, paddingTop: 6 }}>{fn ? `You're in, ${fn}!` : "You're in!"}</h1>
            <p className="ob-t" style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)', paddingTop: 8 }}>Get the app to start tracking your stress.</p>
          </div>

          {desktop && (
            <Glass radius={20} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, marginTop: 20 }}>
              <div style={{ width: 112, height: 112, borderRadius: 12, background: '#fff', padding: 8, flex: 'none' }} role="img" aria-label="QR code to download Cortisol+" dangerouslySetInnerHTML={{ __html: downloadQr }} />
              <div className="ob-flex" style={{ gap: 4 }}>
                <span className="ob-t" style={{ fontSize: 16, fontWeight: 700 }}>1. Get the app</span>
                <span className="ob-t" style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)' }}>Point your phone's camera here to download Cortisol+ on your iPhone or Android.</span>
              </div>
            </Glass>
          )}
          {desktop && unlockQr && (
            <Glass radius={20} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, marginTop: 12 }}>
              <div style={{ width: 112, height: 112, borderRadius: 12, background: '#fff', padding: 8, flex: 'none' }} role="img" aria-label="QR code that unlocks Pro in the app" dangerouslySetInnerHTML={{ __html: unlockQr }} />
              <div className="ob-flex" style={{ gap: 4 }}>
                <span className="ob-t" style={{ fontSize: 16, fontWeight: 700 }}>2. Then scan to unlock Pro</span>
                <span className="ob-t" style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)' }}>Once Cortisol+ is installed, scan this with the same phone. The link works once and expires in an hour; your email has a fresh one.</span>
              </div>
            </Glass>
          )}

          <ol className="ob-flex" style={{ gap: 14, margin: '22px 0 0', padding: 0, listStyle: 'none' }}>
            {steps.map((s, i) => (
              <li key={s.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800, flex: 'none', background: i === 0 ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.8)', color: i === 0 ? '#fff' : '#000' }}>{i + 1}</span>
                <div className="ob-flex" style={{ gap: 2, paddingTop: 2 }}>
                  <span className="ob-t" style={{ fontSize: 16, fontWeight: 700 }}>{s.title}</span>
                  <span className="ob-t" style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)' }}>{s.body}</span>
                </div>
              </li>
            ))}
          </ol>

          {purchased && (
            <Glass radius={16} style={{ padding: 14, marginTop: 20 }}>
              <span className="ob-t" style={{ fontSize: 14, fontWeight: 700 }}>Not brought right in?</span>
              <p className="ob-t" style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', paddingTop: 2 }}>
                {desktop ? 'Scan the unlock code again' : 'Tap Unlock Pro in the app again'}, or use the link in your email. Once Pro is unlocked, you can always get it back with Restore Purchases in the app.
              </p>
            </Glass>
          )}
          {desktop && <div className="ob-flex" style={{ gap: 10, marginTop: 22 }}>{store('ios')}{store('android')}</div>}
        </div>
      </div>
      {!desktop && (
        <div className="ob-flex" style={{ gap: 10, padding: '8px 24px 16px' }}>
          {store(platform === 'android' ? 'android' : 'ios')}
          {unlockUrl ? (
            <a href={unlockUrl} className="ob-block" style={{ textDecoration: 'none', background: '#fff', color: '#000', fontWeight: 700 }}>Unlock Pro in the app</a>
          ) : (
            <a href={platform === 'android' ? appStoreUrl : googlePlayUrl} className="ob-t" style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.55)' }}>
              {platform === 'android' ? 'On iPhone? Get it on the App Store' : 'On Android? Get it on Google Play'}
            </a>
          )}
        </div>
      )}
    </Col>
  );
}
