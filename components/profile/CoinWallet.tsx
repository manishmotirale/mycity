import { Coins, Gift } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { COIN_REASON_LABELS, REDEMPTION_THRESHOLD, type CoinSummary } from '@/lib/coins';
import { cn } from '@/lib/utils';

export function CoinWallet({ summary }: { summary: CoinSummary | null }) {
  const balance = summary?.balance ?? 0;
  const progress = Math.min(100, (balance / REDEMPTION_THRESHOLD) * 100);
  const remaining = Math.max(0, REDEMPTION_THRESHOLD - balance);

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            Coins
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Earned by reporting problems and backing your neighbours.
          </p>
        </div>
        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
          {balance}
        </p>
      </div>

      {/* Progress toward a reward */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5" />
            {remaining === 0
              ? 'You have enough to redeem a reward'
              : `${remaining} more to your first reward`}
          </span>
          <span className="font-medium tabular-nums">
            {balance}/{REDEMPTION_THRESHOLD}
          </span>
        </div>
        <div className="h-2 rounded-full bg-foreground/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Gift-card redemption is not live yet. Coins keep accruing until it is.
        </p>
      </div>

      {/* Ledger */}
      {summary && summary.recent.length > 0 && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">Recent activity</p>
          <ul className="space-y-2.5">
            {summary.recent.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground truncate">
                  {COIN_REASON_LABELS[entry.reason]}
                </span>
                <span className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                  </span>
                  <span
                    className={cn(
                      'font-semibold tabular-nums w-10 text-right',
                      entry.amount > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary && summary.recent.length === 0 && (
        <p className="text-sm text-muted-foreground pt-2 border-t border-border">
          No coins yet. File a report to get your first ones.
        </p>
      )}
    </div>
  );
}
