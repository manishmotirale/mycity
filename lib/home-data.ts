import { prisma } from '@/lib/prisma';

/**
 * Summaries for the role-aware home page. Each loader swallows database errors
 * and returns null so the page can still render its "database unreachable"
 * banner instead of throwing.
 */

export interface PublicStats {
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
}

export async function getPublicStats(): Promise<PublicStats | null> {
  try {
    const [total, resolved, pending, inProgress] = await Promise.all([
      prisma.issue.count(),
      prisma.issue.count({ where: { status: 'RESOLVED' } }),
      prisma.issue.count({ where: { status: 'PENDING' } }),
      prisma.issue.count({ where: { status: 'IN_PROGRESS' } }),
    ]);
    return { total, resolved, pending, inProgress };
  } catch {
    return null;
  }
}

export interface CitizenSummary {
  filed: number;
  resolved: number;
  awaitingVotes: number;
  votesCast: number;
  badges: number;
  reputation: number;
  latest: {
    id: string;
    title: string;
    status: string;
    upvotes: number;
  } | null;
}

export async function getCitizenSummary(userId: string): Promise<CitizenSummary | null> {
  try {
    const [filed, resolved, awaitingVotes, votesCast, badges, user, latest] = await Promise.all([
      prisma.issue.count({ where: { authorId: userId } }),
      prisma.issue.count({ where: { authorId: userId, status: 'RESOLVED' } }),
      prisma.issue.count({ where: { authorId: userId, status: 'PENDING' } }),
      prisma.upvote.count({ where: { userId } }),
      prisma.badge.count({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { reputationScore: true } }),
      prisma.issue.findFirst({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true, _count: { select: { upvotes: true } } },
      }),
    ]);

    return {
      filed,
      resolved,
      awaitingVotes,
      votesCast,
      badges,
      reputation: user?.reputationScore ?? 0,
      latest: latest
        ? {
            id: latest.id,
            title: latest.title,
            status: latest.status,
            upvotes: latest._count.upvotes,
          }
        : null,
    };
  } catch {
    return null;
  }
}

export interface AuthoritySummary {
  awaitingAction: number;
  inProgress: number;
  closed: number;
  oldestWaiting: { id: string; title: string; createdAt: Date } | null;
}

export async function getAuthoritySummary(): Promise<AuthoritySummary | null> {
  try {
    const [awaitingAction, inProgress, closed, oldestWaiting] = await Promise.all([
      prisma.issue.count({ where: { status: 'VALIDATED' } }),
      prisma.issue.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.issue.count({ where: { status: 'RESOLVED' } }),
      prisma.issue.findFirst({
        where: { status: 'VALIDATED' },
        orderBy: { createdAt: 'asc' },
        select: { id: true, title: true, createdAt: true },
      }),
    ]);
    return { awaitingAction, inProgress, closed, oldestWaiting };
  } catch {
    return null;
  }
}

export interface AdminSummary {
  users: number;
  citizens: number;
  authorities: number;
  admins: number;
  issues: number;
  resolved: number;
  unassigned: number;
}

export async function getAdminSummary(): Promise<AdminSummary | null> {
  try {
    const [users, citizens, authorities, admins, issues, resolved, unassigned] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CITIZEN' } }),
      prisma.user.count({ where: { role: 'AUTHORITY' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.issue.count(),
      prisma.issue.count({ where: { status: 'RESOLVED' } }),
      prisma.issue.count({ where: { status: 'VALIDATED' } }),
    ]);
    return { users, citizens, authorities, admins, issues, resolved, unassigned };
  } catch {
    return null;
  }
}

/**
 * Mean time from report to resolution, in days. Returns null when nothing has
 * been resolved yet, so callers can show a dash rather than "0 days".
 */
export async function getAverageResolutionDays(): Promise<number | null> {
  try {
    const resolved = await prisma.issue.findMany({
      where: { status: 'RESOLVED' },
      select: { createdAt: true, updatedAt: true },
    });
    if (resolved.length === 0) return null;

    const totalMs = resolved.reduce(
      (sum, i) => sum + (i.updatedAt.getTime() - i.createdAt.getTime()),
      0
    );
    return totalMs / resolved.length / (1000 * 60 * 60 * 24);
  } catch {
    return null;
  }
}

export interface IssueBreakdown {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
}

/** Counts grouped by status and category, for the admin analytics panel. */
export async function getIssueBreakdown(): Promise<IssueBreakdown | null> {
  try {
    const [total, statusGroups, categoryGroups] = await Promise.all([
      prisma.issue.count(),
      prisma.issue.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.issue.groupBy({ by: ['category'], _count: { _all: true } }),
    ]);

    return {
      total,
      byStatus: Object.fromEntries(statusGroups.map((g) => [g.status, g._count._all])),
      byCategory: Object.fromEntries(categoryGroups.map((g) => [g.category, g._count._all])),
    };
  } catch {
    return null;
  }
}
