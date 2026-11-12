import { APPLE_PATH, PLAY_PARTS } from '../../lib/storeIcons';

export function GooglePlayIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {PLAY_PARTS.map((p) => <path key={p.fill} d={p.d} fill={p.fill} stroke={p.fill} strokeWidth="0.6" strokeLinejoin="round" />)}
    </svg>
  );
}

export function AppleIcon({ className = 'h-5 w-5 -mt-0.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={APPLE_PATH} />
    </svg>
  );
}
