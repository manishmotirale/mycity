import Link from 'next/link';
import { Camera, ThumbsUp, Wrench, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UPVOTE_THRESHOLD } from '@/lib/constants';
import type { PublicStats } from '@/lib/home-data';

const STEPS = [
  {
    icon: Camera,
    title: 'Photograph it',
    body: 'Pothole, overflowing bin, dead streetlight, burst pipe. Drop a pin on the exact spot.',
    tone: 'text-primary bg-sky-500/10 border-sky-500/20',
  },
  {
    icon: ThumbsUp,
    title: 'Neighbours back it',
    body: `At ${UPVOTE_THRESHOLD} votes the report stops being one person complaining and goes to the authority.`,
    tone: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: Wrench,
    title: 'They prove the fix',
    body: 'An authority cannot close a report without attaching a photo of the finished work.',
    tone: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
];

export function LandingHero({ stats }: { stats: PublicStats | null }) {
  return (
    <div className="space-y-14">
      <section className="text-center pt-10 pb-4 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-primary text-xs font-medium mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          {UPVOTE_THRESHOLD} votes sends a report to the authority
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-5">
          <span className="gradient-text">The pothole</span>
          <span className="block text-foreground">nobody reported.</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
          Most street problems go unreported because nobody knows who to tell. MyCity turns a
          photo into a tracked report your neighbours can back, and holds the authority to a
          before-and-after.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register">
            <Button size="lg" variant="gradient" className="gap-2" id="hero-signup-btn">
              <UserPlus className="w-5 h-5" />
              Sign up
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="gap-2" id="hero-signin-btn">
              <LogIn className="w-5 h-5" />
              Sign in
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Free. You only need an account to file a report or vote.
        </p>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <div key={step.title} className="glass-card p-6 relative">
              <span className="absolute top-5 right-5 text-4xl font-bold text-foreground/[0.07] select-none">
                {i + 1}
              </span>
              <div
                className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${step.tone}`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Public numbers */}
      {stats && stats.total > 0 && (
        <section className="glass-card p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Reports filed', value: stats.total, tone: 'text-primary' },
              { label: 'Fixed', value: stats.resolved, tone: 'text-emerald-400' },
              { label: 'Being worked on', value: stats.inProgress, tone: 'text-sky-700 dark:text-sky-300' },
              {
                label: 'Fix rate',
                value: `${Math.round((stats.resolved / stats.total) * 100)}%`,
                tone: 'text-amber-400',
              },
            ].map((s) => (
              <div key={s.label}>
                <p className={`text-2xl sm:text-3xl font-bold ${s.tone}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
