import { prisma } from '@/lib/prisma';

export interface ProfileData {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  role: string;
  coins: number;
  reputationScore: number;
  createdAt: Date;
  badges: { id: string; type: string; name: string; createdAt: Date }[];
  stats: {
    filed: number;
    resolved: number;
    inProgress: number;
    votesCast: number;
    votesReceived: number;
  };
  recentIssues: {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    upvotes: number;
  }[];
}

export async function getProfile(userId: string): Promise<ProfileData | null> {
  try {
    const [user, resolved, inProgress, votesCast, votesReceived, recentIssues] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          image: true,
          bio: true,
          location: true,
          role: true,
          coins: true,
          reputationScore: true,
          createdAt: true,
          badges: { select: { id: true, type: true, name: true, createdAt: true } },
          _count: { select: { issues: true } },
        },
      }),
      prisma.issue.count({ where: { authorId: userId, status: 'RESOLVED' } }),
      prisma.issue.count({ where: { authorId: userId, status: 'IN_PROGRESS' } }),
      prisma.upvote.count({ where: { userId } }),
      prisma.upvote.count({ where: { issue: { authorId: userId } } }),
      prisma.issue.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          _count: { select: { upvotes: true } },
        },
      }),
    ]);

    if (!user) return null;

    return {
      ...user,
      stats: {
        filed: user._count.issues,
        resolved,
        inProgress,
        votesCast,
        votesReceived,
      },
      recentIssues: recentIssues.map((i) => ({
        id: i.id,
        title: i.title,
        status: i.status,
        createdAt: i.createdAt,
        upvotes: i._count.upvotes,
      })),
    };
  } catch {
    return null;
  }
}

export interface LeaderboardRow {
  rank: number;
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  location: string | null;
  role: string;
  coins: number;
  reports: number;
  badges: number;
}

export interface LeaderboardData {
  rows: LeaderboardRow[];
  /** The signed-in user's row, included even when they fall outside the top slice. */
  currentUser: LeaderboardRow | null;
  totalRanked: number;
}

/**
 * Ranked by coins, since that is the currency rewards will be paid from.
 * Only people who have actually earned something are listed, so a fresh install
 * does not show a wall of zeroes.
 */
export async function getLeaderboard(
  currentUserId?: string,
  take = 25
): Promise<LeaderboardData | null> {
  try {
    const [top, totalRanked] = await Promise.all([
      prisma.user.findMany({
        where: { coins: { gt: 0 } },
        orderBy: [{ coins: 'desc' }, { createdAt: 'asc' }],
        take,
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          location: true,
          role: true,
          coins: true,
          _count: { select: { issues: true, badges: true } },
        },
      }),
      prisma.user.count({ where: { coins: { gt: 0 } } }),
    ]);

    const rows: LeaderboardRow[] = top.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      name: u.name,
      username: u.username,
      image: u.image,
      location: u.location,
      role: u.role,
      coins: u.coins,
      reports: u._count.issues,
      badges: u._count.badges,
    }));

    let currentUser = currentUserId ? (rows.find((r) => r.id === currentUserId) ?? null) : null;

    // Outside the visible slice: look them up and derive the true rank by counting
    // everyone ahead of them, rather than loading the whole table.
    if (currentUserId && !currentUser) {
      const me = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          location: true,
          role: true,
          coins: true,
          createdAt: true,
          _count: { select: { issues: true, badges: true } },
        },
      });

      // Only ranked once they have earned something, matching the board's filter.
      if (me && me.coins > 0) {
        // Counts with the same tiebreak the board orders by, otherwise a tie at the
        // boundary reports a rank already occupied by a visible row.
        const ahead = await prisma.user.count({
          where: {
            OR: [
              { coins: { gt: me.coins } },
              { coins: me.coins, createdAt: { lt: me.createdAt } },
            ],
          },
        });
        currentUser = {
          rank: ahead + 1,
          id: me.id,
          name: me.name,
          username: me.username,
          image: me.image,
          location: me.location,
          role: me.role,
          coins: me.coins,
          reports: me._count.issues,
          badges: me._count.badges,
        };
      }
    }

    return { rows, currentUser, totalRanked };
  } catch {
    return null;
  }
}
