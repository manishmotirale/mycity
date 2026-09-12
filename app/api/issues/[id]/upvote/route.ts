import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { prisma, isUniqueConstraintError } from '@/lib/prisma';
import { checkAndAwardBadges } from '@/lib/badges';
import { awardCoins } from '@/lib/coins';
import { UPVOTE_THRESHOLD } from '@/lib/constants';

// POST /api/issues/[id]/upvote
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const issue = await prisma.issue.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
    if (!issue) return NextResponse.json({ error: 'Issue not found' }, { status: 404 });

    // Voting for your own report would let an author earn UPVOTE_CAST coins on top
    // of REPORT_FILED and push their own report toward the escalation threshold.
    if (issue.authorId === userId) {
      return NextResponse.json({ error: 'You cannot vote on your own report.' }, { status: 403 });
    }

    // Let the unique constraint be the arbiter rather than checking first: a
    // find-then-create pair races on a double click and would 500 instead of 409.
    try {
      await prisma.upvote.create({ data: { issueId: id, userId } });
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        return NextResponse.json({ error: 'Already upvoted' }, { status: 409 });
      }
      throw err;
    }

    const voteCount = await prisma.upvote.count({ where: { issueId: id } });

    // Enough of the neighbourhood backed it — hand it to the authority. The
    // PENDING check lives in the WHERE clause so a concurrent vote cannot stomp a
    // status an authority has already moved on.
    if (voteCount >= UPVOTE_THRESHOLD) {
      await prisma.issue.updateMany({
        where: { id, status: 'PENDING' },
        data: { status: 'VALIDATED' },
      });
    }

    // Rewards are best-effort, but log failures so silent drift is detectable.
    await awardCoins({ userId, reason: 'UPVOTE_CAST', issueId: id }).catch((err) =>
      console.error('[upvote] awardCoins failed', err)
    );
    await checkAndAwardBadges(userId, 'UPVOTE').catch((err) =>
      console.error('[upvote] checkAndAwardBadges failed', err)
    );

    revalidatePath('/');
    revalidatePath(`/issue/${id}`);
    revalidatePath('/profile');
    revalidatePath('/leaderboard');

    return NextResponse.json({ success: true, voteCount });
  } catch (error) {
    console.error('[POST /api/issues/[id]/upvote]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
