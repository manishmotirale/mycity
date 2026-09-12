import Link from 'next/link';
import { ShieldCheck, TrendingUp, Wrench, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import type { AuthoritySummary } from '@/lib/home-data';

export function AuthorityPanel({
  name,
  summary,
  averageResolutionDays,
}: {
  name: string;
  summary: AuthoritySummary | null;
  averageResolutionDays: number | null;
}) {
  const firstName = name.split(' ')[0];
  const waiting = summary?.awaitingAction ?? 0;

  return (
    <section className="space-y-5">
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hello, {firstName}</h1>
              <p className="text-sm text-muted-foreground">
                {waiting > 0
                  ? `${waiting} report${waiting === 1 ? '' : 's'} passed the vote threshold and ${waiting === 1 ? 'is' : 'are'} waiting on you.`
                  : 'Nothing is waiting on you right now.'}
              </p>
            </div>
          </div>
          <Link href="/authority">
            <Button variant="warning" className="gap-2" id="authority-open-queue-btn">
              <ShieldCheck className="w-4 h-4" />
              Open the queue
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Waiting on you', value: waiting, icon: TrendingUp, tone: 'text-amber-400' },
            { label: 'In progress', value: summary?.inProgress ?? 0, icon: Wrench, tone: 'text-primary' },
            { label: 'Closed', value: summary?.closed ?? 0, icon: CheckCircle2, tone: 'text-emerald-400' },
            {
              label: 'Avg time to fix',
              value:
                averageResolutionDays === null
                  ? '—'
                  : averageResolutionDays < 1
                    ? '<1d'
                    : `${averageResolutionDays.toFixed(1)}d`,
              icon: CheckCircle2,
              tone: 'text-purple-400',
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4">
              <s.icon className={`w-4 h-4 mb-2 ${s.tone}`} />
              <p className={`text-xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nudge toward the report that has been waiting longest */}
      {summary?.oldestWaiting && (
        <Link href={`/issue/${summary.oldestWaiting.id}`} className="block">
          <div className="glass-hover p-5 flex items-center gap-4 border-amber-500/20">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-amber-400 mb-0.5">Waiting longest</p>
              <p className="font-medium text-sm truncate">{summary.oldestWaiting.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Filed {formatDistanceToNow(new Date(summary.oldestWaiting.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </Link>
      )}
    </section>
  );
}
