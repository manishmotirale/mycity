import Link from 'next/link';
import { Shield, Users, ShieldCheck, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminSummary } from '@/lib/home-data';

export function AdminPanel({
  name,
  summary,
  averageResolutionDays,
}: {
  name: string;
  summary: AdminSummary | null;
  averageResolutionDays: number | null;
}) {
  const firstName = name.split(' ')[0];
  const fixRate =
    summary && summary.issues > 0 ? Math.round((summary.resolved / summary.issues) * 100) : null;

  return (
    <section className="space-y-5">
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hello, {firstName}</h1>
              <p className="text-sm text-muted-foreground">
                {summary?.authorities === 0
                  ? 'No authority accounts exist yet, so nobody can close reports.'
                  : `${summary?.authorities ?? 0} authority account${summary?.authorities === 1 ? '' : 's'} can act on reports.`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button className="gap-2" id="admin-open-panel-btn">
                <Users className="w-4 h-4" />
                Manage roles
              </Button>
            </Link>
            <Link href="/authority">
              <Button variant="outline" className="gap-2">
                <ShieldCheck className="w-4 h-4" />
                Queue
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Users', value: summary?.users ?? 0, icon: Users, tone: 'text-primary' },
            { label: 'Authorities', value: summary?.authorities ?? 0, icon: ShieldCheck, tone: 'text-amber-400' },
            { label: 'Reports', value: summary?.issues ?? 0, icon: FileText, tone: 'text-foreground' },
            { label: 'Fixed', value: summary?.resolved ?? 0, icon: CheckCircle2, tone: 'text-emerald-400' },
            { label: 'Fix rate', value: fixRate === null ? '—' : `${fixRate}%`, icon: CheckCircle2, tone: 'text-purple-400' },
            {
              label: 'Avg time to fix',
              value:
                averageResolutionDays === null
                  ? '—'
                  : averageResolutionDays < 1
                    ? '<1d'
                    : `${averageResolutionDays.toFixed(1)}d`,
              icon: CheckCircle2,
              tone: 'text-sky-700 dark:text-sky-300',
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

      {/* Backlog warning: validated reports with nobody able to close them */}
      {summary && summary.unassigned > 0 && summary.authorities === 0 && (
        <div className="glass-card p-5 flex items-center gap-4 border-amber-500/20">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-sm">
              {summary.unassigned} report{summary.unassigned === 1 ? '' : 's'} cleared the vote
              threshold with no authority to handle them
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Promote someone to Authority on the admin page so the queue can move.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
