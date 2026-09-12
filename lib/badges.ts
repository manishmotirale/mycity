import { BadgeType, Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { BADGE_META } from './constants';
import { awardCoins } from './coins';

/** Reputation granted the first time a badge is earned. */
const REPUTATION_PER_BADGE = 10;

/**
 * Awards any badges the user has just qualified for.
 *
 * Each badge is created with `create`, not `upsert`, so a duplicate raises P2002
 * and we can tell a genuinely new badge from one already held. The previous
 * version used upsert and counted every fulfilled promise as new, which handed
 * out reputation on every single report and upvote forever.
 */
export async function checkAndAwardBadges(
  userId: string,
  action: 'REPORT' | 'UPVOTE' | 'RESOLVED'
): Promise<BadgeType[]> {
  const candidates: BadgeType[] = [];

  if (action === 'REPORT') {
    const issueCount = await prisma.issue.count({ where: { authorId: userId } });
    if (issueCount >= 1) candidates.push('REPORTER_1');
  }

  if (action === 'UPVOTE') {
    // Only votes on other people's reports count, matching the badge description.
    const upvoteCount = await prisma.upvote.count({
      where: { userId, issue: { authorId: { not: userId } } },
    });
    if (upvoteCount >= 10) candidates.push('SUPPORTER_10');
  }

  if (action === 'RESOLVED') {
    candidates.push('RESOLVER_1');
  }

  const newlyEarned: BadgeType[] = [];

  for (const type of candidates) {
    try {
      // The badge row and its reputation are written together. Done separately, a
      // crash between them left the badge permanently unpaid: the retry hits P2002,
      // so newlyEarned comes back empty and the reputation is never recoverable.
      await prisma.$transaction([
        prisma.badge.create({ data: { name: BADGE_META[type].name, type, userId } }),
        prisma.user.update({
          where: { id: userId },
          data: { reputationScore: { increment: REPUTATION_PER_BADGE } },
        }),
      ]);
      newlyEarned.push(type);
    } catch (err) {
      // P2002 on @@unique([type, userId]) means they already have it. Not an error.
      if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) {
        throw err;
      }
    }
  }

  // One coin award per badge. The badge type is used as the ledger's reference key
  // so its unique constraint stops a badge from ever paying out twice.
  for (const type of newlyEarned) {
    await awardCoins({ userId, reason: 'BADGE_EARNED', issueId: type }).catch((err) =>
      console.error('[badges] awardCoins failed', err)
    );
  }

  return newlyEarned;
}
