import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { Trophy, Coins, User as UserIcon, Gift, MapPin } from 'lucide-react';

import { authOptions } from '@/lib/auth';
import { getLeaderboard, type LeaderboardRow } from '@/lib/profile-data';
import { COIN_REWARDS } from '@/lib/coins';
import { RoleBadge } from '@/components/RoleBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Leaderboard — MyCity',
  description: 'Who is doing the most to get problems in the city fixed.',
};

/** Medal treatment for the top three, plain numerals after that. */
const PODIUM: Record<number, string> = {
  1: 'bg-amber-400/20 text-amber-700 border-amber-400/40 dark:text-amber-300',
  2: 'bg-slate-400/20 text-slate-700 border-slate-400/40 dark:text-slate-300',
  3: 'bg-orange-500/20 text-orange-700 border-orange-500/40 dark:text-orange-300',
};

function Row({ row, isMe }: { row: LeaderboardRow; isMe: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 sm:px-6 py-3.5 transition-colors',
        isMe ? 'bg-primary/[0.07]' : 'hover:bg-foreground/[0.03]'
      )}
    >
      {/* Rank */}
      <div
        className={cn(
          'w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 text-sm font-bold tabular-nums',
          PODIUM[row.rank] ?? 'border-border text-muted-foreground'
        )}
      >
        {row.rank}
      </div>

      {/* Avatar */}
      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
        {row.image ? (
          <Image src={row.image} alt="" fill className="object-cover" sizes="36px" />
        ) : (
          <UserIcon className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Identity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">
            {row.name ?? row.username ?? 'Anonymous citizen'}
          </p>
          {isMe && (
            <span className="text-[10px] uppercase tracking-wide font-semibold text-primary flex-shrink-0">
              You
            </span>
          )}
          {row.role !== 'CITIZEN' && <RoleBadge role={row.role} showLabel={false} className="px-1 py-0" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {row.username && <span className="truncate">@{row.username}</span>}
          {row.location && (
            <span className="hidden sm:flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3" />
              {row.location}
            </span>
          )}
        </div>
      </div>

      {/* Counts */}
      <div className="hidden sm:block text-right flex-shrink-0">
        <p className="text-sm font-medium tabular-nums">{row.reports}</p>
        <p className="text-xs text-muted-foreground">reports</p>
      </div>
      <div className="hidden md:block text-right flex-shrink-0">
        <p className="text-sm font-medium tabular-nums">{row.badges}</p>
        <p className="text-xs text-muted-foreground">badges</p>
      </div>

      {/* Coins */}
      <div className="text-right flex-shrink-0 w-20">
        <p className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums flex items-center justify-end gap-1">
          <Coins className="w-3.5 h-3.5" />
          {row.coins}
        </p>
        <p className="text-xs text-muted-foreground">coins</p>
      </div>
    </div>
  );
}

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);
  const board = await getLeaderboard(session?.user.id);

  const meInList = board?.currentUser
    ? board.rows.some((r) => r.id === board.currentUser!.id)
    : false;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-sm text-muted-foreground">
              Ranked by coins earned for getting problems fixed
            </p>
          </div>
        </div>
        {!session && (
          <Link href="/register">
            <Button variant="gradient" size="sm">
              Join and start earning
            </Button>
          </Link>
        )}
      </header>

      {/* How coins work */}
      <section className="glass-card p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Gift className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          How to earn coins
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'File a report', value: COIN_REWARDS.REPORT_FILED },
            { label: 'Your report gets fixed', value: COIN_REWARDS.REPORT_RESOLVED },
            { label: 'Back a report', value: COIN_REWARDS.UPVOTE_CAST },
            { label: 'Earn a badge', value: COIN_REWARDS.BADGE_EARNED },
          ].map((r) => (
            <div key={r.label} className="rounded-xl border border-border bg-foreground/[0.03] p-3">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                +{r.value}
              </p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{r.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Coins will be redeemable for gift cards once that goes live. Nothing expires in the
          meantime.
        </p>
      </section>

      {/* Board */}
      <section className="glass-card overflow-hidden">
        <div className="px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">
            {board ? `Top ${board.rows.length}` : 'Rankings'}
          </h2>
          {board && board.totalRanked > board.rows.length && (
            <p className="text-xs text-muted-foreground">
              of {board.totalRanked} people earning coins
            </p>
          )}
        </div>

        {!board ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Rankings are unavailable — the database could not be reached.
            </p>
          </div>
        ) : board.rows.length === 0 ? (
          <div className="px-6 py-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Nobody on the board yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                The first person to file a report takes the top spot.
              </p>
            </div>
            <Link href="/report">
              <Button size="sm">Report a problem</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {board.rows.map((row) => (
              <Row key={row.id} row={row} isMe={row.id === session?.user.id} />
            ))}
          </div>
        )}
      </section>

      {/* Your standing, when you are below the visible slice */}
      {board?.currentUser && !meInList && (
        <section className="glass-card overflow-hidden">
          <div className="px-4 sm:px-6 py-3 border-b border-border">
            <h2 className="font-semibold text-sm">Your standing</h2>
          </div>
          <Row row={board.currentUser} isMe />
        </section>
      )}
    </div>
  );
}
