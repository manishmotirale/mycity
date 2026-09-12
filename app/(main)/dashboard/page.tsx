import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StatusTracker } from '@/components/StatusTracker';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CATEGORY_META, STATUS_META } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChevronUp, Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Your reports — MyCity',
  description: 'Everything you have reported, and where each one stands.',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      badges: true,
      issues: {
        include: {
          _count: { select: { upvotes: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) redirect('/login');

  const totalUpvotesReceived = user.issues.reduce((sum, i) => sum + i._count.upvotes, 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <section className="glass-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar className="w-20 h-20 ring-4 ring-sky-500/20">
          <AvatarImage src={session.user.image ?? ''} />
          <AvatarFallback className="text-xl">
            {session.user.name?.slice(0, 2).toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{session.user.name ?? 'Anonymous Citizen'}</h1>
          <p className="text-muted-foreground text-sm mb-4">{session.user.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{user.issues.length}</p>
              <p className="text-xs text-muted-foreground">Reports filed</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-amber-400">{totalUpvotesReceived}</p>
              <p className="text-xs text-muted-foreground">Votes received</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-400">{user.badges.length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-400">{user.reputationScore}</p>
              <p className="text-xs text-muted-foreground">Reputation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          Badges
        </h2>
        <div className="glass-card p-6">
          <BadgeDisplay badges={user.badges} />
        </div>
      </section>

      {/* My Reports */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your reports ({user.issues.length})</h2>
          <Link href="/report">
            <Button size="sm" className="gap-2" id="dashboard-report-btn">
              <Plus className="w-3.5 h-3.5" />
              New report
            </Button>
          </Link>
        </div>

        {user.issues.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-muted-foreground mb-4">
              You have not filed anything yet. Spotted something on your street?
            </p>
            <Link href="/report">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                File your first report
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {user.issues.map((issue) => {
              const categoryMeta = CATEGORY_META[issue.category as keyof typeof CATEGORY_META];
              const statusMeta = STATUS_META[issue.status as keyof typeof STATUS_META];

              return (
                <Link key={issue.id} href={`/issue/${issue.id}`}>
                  <div className="glass-hover p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={issue.photoUrl} alt={issue.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{issue.title}</h3>
                          <Badge variant={issue.status.toLowerCase() as any} className="flex-shrink-0 text-xs">
                            {statusMeta?.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs', categoryMeta?.color)}>
                            {categoryMeta?.icon} {categoryMeta?.label}
                          </span>
                          <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3" /> {issue._count.upvotes} votes</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking timeline */}
                    <StatusTracker status={issue.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
