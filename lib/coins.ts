import { CoinReason, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Coins are the reward currency. They are deliberately kept separate from
 * reputationScore: reputation reflects standing and never decreases, while coins
 * are a spendable balance that will be drawn down by gift-card redemptions.
 */
export const COIN_REWARDS: Record<CoinReason, number> = {
  REPORT_FILED: 10,
  REPORT_RESOLVED: 50,
  UPVOTE_CAST: 2,
  BADGE_EARNED: 25,
  REDEMPTION: 0, // set per redemption, always negative
  ADJUSTMENT: 0, // manual correction
};

export const COIN_REASON_LABELS: Record<CoinReason, string> = {
  REPORT_FILED: 'Filed a report',
  REPORT_RESOLVED: 'A report you filed was fixed',
  UPVOTE_CAST: 'Backed a neighbour’s report',
  BADGE_EARNED: 'Earned a badge',
  REDEMPTION: 'Redeemed for a reward',
  ADJUSTMENT: 'Manual adjustment',
};

/** Coins needed before a redemption is worth offering. */
export const REDEMPTION_THRESHOLD = 500;

interface AwardOptions {
  userId: string;
  reason: CoinReason;
  /**
   * Reference key that makes the award unique per user and reason, so it can only
   * ever be paid once. Usually an issue id; BADGE_EARNED uses the badge type.
   */
  issueId?: string | null;
  /** Overrides the table above. Use a negative number to deduct. */
  amount?: number;
}

/**
 * Records a ledger entry and moves the cached balance in the same transaction, so
 * the two can never disagree.
 *
 * Returns false when this exact award already exists. The unique constraint on
 * (userId, reason, issueId) makes the operation idempotent, so a double click, a
 * retry, or a re-run of the resolve handler cannot pay out twice.
 *
 * IMPORTANT: Postgres treats NULLs as distinct in a unique index, so that guard
 * only applies when `issueId` is set. Every reward call site passes a reference —
 * a report id, or the badge type for BADGE_EARNED. A future REDEMPTION path must
 * pass its own idempotency key rather than relying on this being automatic.
 */
export async function awardCoins({
  userId,
  reason,
  issueId = null,
  amount,
}: AwardOptions): Promise<boolean> {
  const value = amount ?? COIN_REWARDS[reason];
  if (value === 0) return false;

  try {
    await prisma.$transaction([
      prisma.coinTransaction.create({ data: { userId, reason, issueId, amount: value } }),
      prisma.user.update({ where: { id: userId }, data: { coins: { increment: value } } }),
    ]);
    return true;
  } catch (err) {
    // P2002 = this user has already been paid for this reason on this issue.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return false;
    }
    throw err;
  }
}

export interface CoinSummary {
  balance: number;
  recent: {
    id: string;
    amount: number;
    reason: CoinReason;
    createdAt: Date;
  }[];
}

export async function getCoinSummary(userId: string): Promise<CoinSummary | null> {
  try {
    const [user, recent] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { coins: true } }),
      prisma.coinTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: { id: true, amount: true, reason: true, createdAt: true },
      }),
    ]);

    return { balance: user?.coins ?? 0, recent };
  } catch {
    return null;
  }
}
