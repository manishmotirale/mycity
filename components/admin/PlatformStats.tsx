import { BarChart3, Clock } from 'lucide-react';
import { CATEGORY_META, STATUS_META } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { IssueBreakdown } from '@/lib/home-data';

const STATUS_BAR = {
  PENDING: 'bg-slate-400',
  VALIDATED: 'bg-amber-400',
  IN_PROGRESS: 'bg-sky-400',
  RESOLVED: 'bg-emerald-400',
} as const;

function Bar({ value, total, tone }: { value: number; total: number; tone: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
      <div className={cn('h-full rounded-full transition-all', tone)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PlatformStats({
  breakdown,
  averageResolutionDays,
}: {
  breakdown: IssueBreakdown | null;
  averageResolutionDays: number | null;
}) {
  if (!breakdown || breakdown.total === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Reports</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          No reports have been filed yet, so there is nothing to chart.
        </p>
      </div>
    );
  }

  const { total, byStatus, byCategory } = breakdown;
  const resolved = byStatus.RESOLVED ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Status breakdown */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Where reports stand</h2>
          </div>
          <span className="text-xs text-muted-foreground">{total} total</span>
        </div>

        <div className="space-y-4">
          {(Object.keys(STATUS_BAR) as (keyof typeof STATUS_BAR)[]).map((status) => {
            const value = byStatus[status] ?? 0;
            return (
              <div key={status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{STATUS_META[status].label}</span>
                  <span className="font-medium tabular-nums">
                    {value}
                    <span className="text-muted-foreground ml-1.5">
                      {Math.round((value / total) * 100)}%
                    </span>
                  </span>
                </div>
                <Bar value={value} total={total} tone={STATUS_BAR[status]} />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-foreground/5">
          <div>
            <p className="text-xl font-bold text-emerald-400">
              {Math.round((resolved / total) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Fix rate</p>
          </div>
          <div>
            <p className="text-xl font-bold text-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {averageResolutionDays === null
                ? '—'
                : averageResolutionDays < 1
                  ? '<1 day'
                  : `${averageResolutionDays.toFixed(1)} days`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Average time to fix</p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">What people report</h2>
        </div>

        <div className="space-y-4">
          {Object.entries(CATEGORY_META)
            .map(([key, meta]) => ({ key, meta, value: byCategory[key] ?? 0 }))
            .sort((a, b) => b.value - a.value)
            .map(({ key, meta, value }) => (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span aria-hidden>{meta.icon}</span>
                    {meta.label}
                  </span>
                  <span className="font-medium tabular-nums">
                    {value}
                    <span className="text-muted-foreground ml-1.5">
                      {Math.round((value / total) * 100)}%
                    </span>
                  </span>
                </div>
                <Bar value={value} total={total} tone="bg-sky-400" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
