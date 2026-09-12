import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { formatDistanceToNow } from 'date-fns';
import {
  User as UserIcon,
  MapPin,
  CalendarDays,
  FileText,
  CheckCircle2,
  ThumbsUp,
  Heart,
  Star,
  Trophy,
} from 'lucide-react';

import { authOptions } from '@/lib/auth';
import { getProfile } from '@/lib/profile-data';
import { getCoinSummary } from '@/lib/coins';
import { STATUS_META } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/RoleBadge';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { CoinWallet } from '@/components/profile/CoinWallet';

export const metadata: Metadata = {
  title: 'Your profile — MyCity',
  description: 'Edit your details and see your badges, coins and reporting history.',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const [profile, coins] = await Promise.all([
    getProfile(session.user.id),
    getCoinSummary(session.user.id),
  ]);

  if (!profile) {
    return (
      <div className="glass-card p-10 text-center max-w-lg mx-auto">
        <p className="font-semibold">Could not load your profile</p>
        <p className="text-sm text-muted-foreground mt-1">
          The database is unreachable. Check DATABASE_URL and try again.
        </p>
      </div>
    );
  }

  const stats = [
    { label: 'Reports filed', value: profile.stats.filed, icon: FileText, tone: 'text-primary' },
    {
      label: 'Fixed',
      value: profile.stats.resolved,
      icon: CheckCircle2,
      tone: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Votes cast',
      value: profile.stats.votesCast,
      icon: ThumbsUp,
      tone: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Votes received',
      value: profile.stats.votesReceived,
      icon: Heart,
      tone: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Identity header */}
      <section className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0 ring-4 ring-primary/15">
            {profile.image ? (
              <Image src={profile.image} alt="" fill className="object-cover" sizes="80px" />
            ) : (
              <UserIcon className="w-9 h-9 text-white" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-bold truncate">{profile.name ?? 'Unnamed citizen'}</h1>
              <RoleBadge role={profile.role} />
            </div>

            {profile.username && (
              <p className="text-sm text-primary font-medium">@{profile.username}</p>
            )}

            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-2 max-w-prose">{profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" />
                {profile.reputationScore} reputation
              </span>
            </div>
          </div>

          <Link href="/leaderboard" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Simple dashboard */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-4">
            <s.icon className={`w-4 h-4 mb-2 ${s.tone}`} />
            <p className={`text-2xl font-bold ${s.tone} tabular-nums`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <CoinWallet summary={coins} />

        {/* Badges */}
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            Badges
            <span className="text-sm font-normal text-muted-foreground">
              ({profile.badges.length})
            </span>
          </h2>
          <BadgeDisplay badges={profile.badges} />
        </section>
      </div>

      {/* Recent reports */}
      <section className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3">
          <h2 className="font-semibold text-sm">Your recent reports</h2>
          <Link href="/dashboard" className="text-xs text-primary hover:opacity-80">
            See all
          </Link>
        </div>

        {profile.recentIssues.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              You have not filed anything yet. Your first report earns coins straight away.
            </p>
            <Link href="/report">
              <Button size="sm">Report a problem</Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {profile.recentIssues.map((issue) => (
              <li key={issue.id}>
                <Link
                  href={`/issue/${issue.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-foreground/[0.03] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{issue.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {issue.upvotes} vote{issue.upvotes === 1 ? '' : 's'} ·{' '}
                      {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant={issue.status.toLowerCase() as never} className="flex-shrink-0">
                    {STATUS_META[issue.status as keyof typeof STATUS_META]?.label}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Editor */}
      <ProfileForm
        initial={{
          name: profile.name ?? '',
          username: profile.username ?? '',
          bio: profile.bio ?? '',
          location: profile.location ?? '',
          image: profile.image ?? '',
        }}
      />
    </div>
  );
}
