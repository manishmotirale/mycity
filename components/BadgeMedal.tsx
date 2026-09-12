import { cn } from '@/lib/utils';

/**
 * Animated SVG medals, one per badge type. Drawn inline rather than shipped as
 * images so they scale crisply, adapt to the theme, and cost no extra requests.
 *
 * Each medal is built from the same parts: a rotating conic halo, a hexagonal
 * plate with a metallic gradient, a device in the middle, and a glare that
 * sweeps across on a loop.
 */

export type MedalType = 'REPORTER_1' | 'SUPPORTER_10' | 'RESOLVER_1';

interface MedalTheme {
  /** Plate gradient stops, light to dark. */
  from: string;
  to: string;
  /** Halo and glow colour. */
  glow: string;
  ribbon: string;
}

const THEMES: Record<MedalType, MedalTheme> = {
  // Bronze — first report.
  REPORTER_1: { from: '#fbbf24', to: '#b45309', glow: '#f59e0b', ribbon: '#92400e' },
  // Silver-blue — ten votes cast.
  SUPPORTER_10: { from: '#7dd3fc', to: '#0369a1', glow: '#0ea5e9', ribbon: '#075985' },
  // Gold-emerald — something you reported got fixed.
  RESOLVER_1: { from: '#6ee7b7', to: '#047857', glow: '#10b981', ribbon: '#065f46' },
};

/** The mark inside the plate, one per badge. */
function Device({ type }: { type: MedalType }) {
  const stroke = {
    fill: 'none',
    stroke: 'white',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'REPORTER_1') {
    // Map pin with a planted flag: the first report on the map.
    return (
      <g {...stroke}>
        <path d="M32 20a7 7 0 0 1 7 7c0 5-7 12-7 12s-7-7-7-12a7 7 0 0 1 7-7Z" />
        <circle cx="32" cy="27" r="2.4" fill="white" stroke="none" />
        <path d="M22 44h20" />
      </g>
    );
  }

  if (type === 'SUPPORTER_10') {
    // Three rising chevrons: repeatedly backing other people's reports.
    return (
      <g {...stroke}>
        <path d="M23 38l9-8 9 8" />
        <path d="M23 30l9-8 9 8" opacity="0.75" />
        <path d="M26 45h12" opacity="0.55" />
      </g>
    );
  }

  // Wrench crossed with a tick: work completed and verified.
  return (
    <g {...stroke}>
      <path d="M24 41l11-11" />
      <path d="M33 24a5 5 0 0 0 6.8 6.6l3.6 3.6a2.4 2.4 0 0 1-3.4 3.4l-3.6-3.6A5 5 0 0 0 33 24Z" />
      <path d="M22 32.5l3.2 3.2L31 30" opacity="0.85" />
    </g>
  );
}

interface BadgeMedalProps {
  type: MedalType;
  size?: number;
  /** Dimmed and static, for badges not yet earned. */
  locked?: boolean;
  /** Stagger index for the entrance animation. */
  index?: number;
  className?: string;
}

export function BadgeMedal({
  type,
  size = 72,
  locked = false,
  index = 0,
  className,
}: BadgeMedalProps) {
  const theme = THEMES[type];
  const uid = `${type}-${locked ? 'locked' : 'earned'}`;

  return (
    <div
      className={cn(
        'relative flex-shrink-0',
        !locked && 'animate-badge-pop',
        locked && 'opacity-35 saturate-0',
        className
      )}
      style={{
        width: size,
        height: size,
        animationDelay: locked ? undefined : `${index * 110}ms`,
      }}
      aria-hidden
    >
      {/* Rotating halo behind the plate */}
      {!locked && (
        <div
          className="absolute inset-[-14%] rounded-full animate-badge-halo"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${theme.glow}00 200deg, ${theme.glow}66 300deg, ${theme.glow}00 360deg)`,
            filter: 'blur(5px)',
          }}
        />
      )}

      <svg viewBox="0 0 64 64" width={size} height={size} className="relative">
        <defs>
          <linearGradient id={`plate-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor={theme.from} />
            <stop offset="100%" stopColor={theme.to} />
          </linearGradient>

          {/* Inner bevel, brighter at the top edge */}
          <linearGradient id={`bevel-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.45" />
            <stop offset="45%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="black" stopOpacity="0.2" />
          </linearGradient>

          <clipPath id={`clip-${uid}`}>
            <path d="M32 3.5 55 16.75v30.5L32 60.5 9 47.25v-30.5Z" />
          </clipPath>
        </defs>

        {/* Ribbon tails tucked behind the plate */}
        <path
          d={`M22 47 L14 61 L22.5 58.5 L26 63 L32 50 Z`}
          fill={theme.ribbon}
          opacity={locked ? 0.5 : 0.9}
        />
        <path
          d={`M42 47 L50 61 L41.5 58.5 L38 63 L32 50 Z`}
          fill={theme.ribbon}
          opacity={locked ? 0.5 : 0.75}
        />

        {/* Hexagonal plate */}
        <path
          d="M32 3.5 55 16.75v30.5L32 60.5 9 47.25v-30.5Z"
          fill={`url(#plate-${uid})`}
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.6"
        />
        <path
          d="M32 3.5 55 16.75v30.5L32 60.5 9 47.25v-30.5Z"
          fill={`url(#bevel-${uid})`}
        />

        {/* Inset ring */}
        <path
          d="M32 9.5 49.5 19.8v24.4L32 54.5 14.5 44.2V19.8Z"
          fill="none"
          stroke="white"
          strokeOpacity="0.28"
          strokeWidth="1.1"
        />

        <Device type={type} />

        {/* Glare sweep, clipped to the plate so it never spills outside */}
        {!locked && (
          <g clipPath={`url(#clip-${uid})`}>
            <rect
              className="animate-badge-glare"
              x="-26"
              y="-6"
              width="16"
              height="76"
              fill="white"
              opacity="0.3"
            />
          </g>
        )}
      </svg>

      {/* Sparkles */}
      {!locked && (
        <>
          <span
            className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-white animate-badge-twinkle"
            style={{ boxShadow: `0 0 6px 2px ${theme.glow}` }}
          />
          <span
            className="absolute bottom-3 left-0 w-1 h-1 rounded-full bg-white animate-badge-twinkle anim-delay-700"
            style={{ boxShadow: `0 0 5px 1px ${theme.glow}` }}
          />
        </>
      )}
    </div>
  );
}
