import Link from 'next/link';
import { Plus, LayoutDashboard, FileText, CheckCircle2, ThumbsUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { STATUS_META, UPVOTE_THRESHOLD } from '@/lib/constants';
import type { CitizenSummary } from '@/lib/home-data';

export function CitizenPanel({
  name,
  summary,
}: {
  name: string;
  summary: CitizenSummary | null;
}) {
  const firstName = name.split(' ')[0];

  return (
    <section className="space-y-5">
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hello, {firstName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {summary && summary.filed > 0
                ? `You have filed ${summary.filed} report${summary.filed === 1 ? '' : 's'} and cast ${summary.votesCast} vote${summary.votesCast === 1 ? '' : 's'}.`
                : 'Nothing filed yet. Spotted something on your street?'}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/report">
              <Button className="gap-2" id="citizen-report-btn">
                <Plus className="w-4 h-4" />
                Report a problem
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Your reports
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Filed', value: summary?.filed ?? 0, icon: FileText, tone: 'text-primary' },
            { label: 'Fixed', value: summary?.resolved ?? 0, icon: CheckCircle2, tone: 'text-emerald-400' },
            { label: 'Votes cast', value: summary?.votesCast ?? 0, icon: ThumbsUp, tone: 'text-amber-400' },
            { label: 'Badges', value: summary?.badges ?? 0, icon: Award, tone: 'text-purple-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4">
              <s.icon className={`w-4 h-4 mb-2 ${s.tone}`} />
              <p className={`text-xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Most recent report, so returning users see movement immediately */}
      {summary?.latest && (
        <Link href={`/issue/${summary.latest.id}`} className="block">
          <div className="glass-hover p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Your latest report</p>
              <p className="font-medium text-sm truncate">{summary.latest.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.latest.status === 'PENDING'
                  ? `${summary.latest.upvotes} of ${UPVOTE_THRESHOLD} votes needed`
                  : `${summary.latest.upvotes} vote${summary.latest.upvotes === 1 ? '' : 's'}`}
              </p>
            </div>
            <Badge variant={summary.latest.status.toLowerCase() as never} className="flex-shrink-0">
              {STATUS_META[summary.latest.status as keyof typeof STATUS_META]?.label}
            </Badge>
          </div>
        </Link>
      )}
    </section>
  );
}
