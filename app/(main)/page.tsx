import { Suspense } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { IssueCategory, IssueStatus } from '@prisma/client';
import { Plus, LayoutGrid } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { IssueCard } from '@/components/IssueCard';
import { Button } from '@/components/ui/button';
import { LandingHero } from '@/components/home/LandingHero';
import { CitizenPanel } from '@/components/home/CitizenPanel';
import { AuthorityPanel } from '@/components/home/AuthorityPanel';
import { AdminPanel } from '@/components/home/AdminPanel';
import { FeedFilters, type FeedQuery } from '@/components/home/FeedFilters';
import {
  getAdminSummary,
  getAuthoritySummary,
  getAverageResolutionDays,
  getCitizenSummary,
  getPublicStats,
} from '@/lib/home-data';

// Next 16 delivers searchParams as a Promise.
interface PageProps {
  searchParams: Promise<{ sort?: string; status?: string; category?: string }>;
}

const STATUSES = Object.values(IssueStatus);
const CATEGORIES = Object.values(IssueCategory);

async function IssueGrid({ query, userId }: { query: FeedQuery; userId?: string }) {
  let issues: Awaited<ReturnType<typeof loadIssues>> = [];
  try {
    issues = await loadIssues(query);
  } catch {
    // Database unreachable — the banner above already explains it.
  }

  if (issues.length === 0) {
    const filtered = Boolean(query.status || query.category);
    return (
      <div className="col-span-full flex flex-col items-center gap-4 py-20">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <LayoutGrid className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Nothing here yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            {filtered
              ? 'No reports match these filters. Try widening them.'
              : 'No reports have been filed yet.'}
          </p>
        </div>
        <Link href="/report">
          <Button className="gap-2 mt-2">
            <Plus className="w-4 h-4" />
            Report a problem
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} currentUserId={userId} />
      ))}
    </>
  );
}

function loadIssues(query: FeedQuery) {
  return prisma.issue.findMany({
    where: {
      ...(query.status ? { status: query.status as IssueStatus } : {}),
      ...(query.category ? { category: query.category as IssueCategory } : {}),
    },
    include: {
      author: { select: { name: true, image: true, role: true } },
      upvotes: { select: { userId: true } },
      _count: { select: { upvotes: true } },
    },
    orderBy:
      query.sort === 'most_upvoted' ? { upvotes: { _count: 'desc' } } : { createdAt: 'desc' },
    take: 50,
  });
}

export default async function HomePage({ searchParams }: PageProps) {
  const [session, params] = await Promise.all([
    getServerSession(authOptions),
    searchParams,
  ]);
  const role = session?.user.role;

  // Ignore unknown values from hand-edited URLs rather than passing them to Prisma.
  const query: FeedQuery = {
    sort: params.sort === 'most_upvoted' ? 'most_upvoted' : 'newest',
    status: STATUSES.includes(params.status as IssueStatus) ? params.status : undefined,
    category: CATEGORIES.includes(params.category as IssueCategory) ? params.category : undefined,
  };

  const stats = await getPublicStats();

  const [citizen, authority, admin, averageResolutionDays] = await Promise.all([
    role === 'CITIZEN' && session ? getCitizenSummary(session.user.id) : null,
    role === 'AUTHORITY' || role === 'ADMIN' ? getAuthoritySummary() : null,
    role === 'ADMIN' ? getAdminSummary() : null,
    role === 'AUTHORITY' || role === 'ADMIN' ? getAverageResolutionDays() : null,
  ]);

  const displayName = session?.user.name ?? 'there';

  return (
    <div className="space-y-10">
      {stats === null && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
          <span className="text-xl mt-0.5">⚙️</span>
          <div>
            <p className="font-semibold text-sm">Database not reachable</p>
            <p className="text-xs opacity-80 mt-0.5">
              Check <code className="bg-amber-500/20 px-1 rounded">DATABASE_URL</code> in{' '}
              <code className="bg-amber-500/20 px-1 rounded">.env</code> and confirm your Neon
              project isn&apos;t suspended, then restart the server.
            </p>
          </div>
        </div>
      )}

      {/* Signed out gets the pitch; each role gets its own summary. */}
      {!session && <LandingHero stats={stats} />}
      {session && role === 'CITIZEN' && <CitizenPanel name={displayName} summary={citizen} />}
      {session && role === 'AUTHORITY' && (
        <AuthorityPanel
          name={displayName}
          summary={authority}
          averageResolutionDays={averageResolutionDays}
        />
      )}
      {session && role === 'ADMIN' && (
        <AdminPanel
          name={displayName}
          summary={admin}
          averageResolutionDays={averageResolutionDays}
        />
      )}

      <section id="feed" className="scroll-mt-20">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {session ? 'Reports from your area' : 'Recent reports'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {role === 'AUTHORITY' || role === 'ADMIN'
                ? 'Everything on the platform, including reports still gathering votes.'
                : 'Back the ones that affect you. One vote per person.'}
            </p>
          </div>
          <FeedFilters query={query} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Suspense
            fallback={Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card h-72 skeleton rounded-2xl" />
            ))}
          >
            <IssueGrid query={query} userId={session?.user.id} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
