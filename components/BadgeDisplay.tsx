import { formatDistanceToNow } from 'date-fns';
import { Lock } from 'lucide-react';
import { BADGE_META, BADGE_ORDER } from '@/lib/constants';
import { BadgeMedal, type MedalType } from '@/components/BadgeMedal';
import { cn } from '@/lib/utils';

interface Badge {
  id: string;
  type: string;
  name: string;
  createdAt: Date | string;
}

interface BadgeDisplayProps {
  badges: Badge[];
  /** Small medals only, no captions. Used where space is tight. */
  compact?: boolean;
  /** Also show the badges not yet earned, so progress is visible. */
  showLocked?: boolean;
}

export function BadgeDisplay({
  badges,
  compact = false,
  showLocked = true,
}: BadgeDisplayProps) {
  const earned = new Map(badges.map((b) => [b.type, b]));

  if (compact) {
    if (badges.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, i) => {
          const meta = BADGE_META[badge.type as keyof typeof BADGE_META];
          if (!meta) return null;
          return (
            <span key={badge.id} title={`${meta.name} — ${meta.description}`}>
              <BadgeMedal type={badge.type as MedalType} size={34} index={i} />
            </span>
          );
        })}
      </div>
    );
  }

  // Fixed order so the grid does not reshuffle as badges are earned.
  const rows = BADGE_ORDER.filter((type) => showLocked || earned.has(type));

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No badges yet. They arrive as you file reports and vote.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((type, i) => {
        const meta = BADGE_META[type];
        const badge = earned.get(type);
        const isEarned = Boolean(badge);

        return (
          <div
            key={type}
            className={cn(
              'group relative flex items-center gap-3 rounded-2xl border p-3 overflow-hidden transition-all duration-300',
              isEarned
                ? 'border-border bg-card hover:-translate-y-1 hover:border-primary/40'
                : 'border-dashed border-border bg-transparent'
            )}
            title={meta.description}
          >
            <BadgeMedal type={type} size={compact ? 40 : 56} locked={!isEarned} index={i} />

            <div className="min-w-0">
              <p
                className={cn(
                  'text-sm font-semibold flex items-center gap-1.5',
                  isEarned ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {meta.name}
                {!isEarned && <Lock className="w-3 h-3" />}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {isEarned ? meta.description : meta.hint}
              </p>
              {badge && (
                <p className="text-[11px] text-muted-foreground/70 mt-1">
                  Earned {formatDistanceToNow(new Date(badge.createdAt), { addSuffix: true })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
