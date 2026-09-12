import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkAndAwardBadges } from '@/lib/badges';
import { awardCoins } from '@/lib/coins';

/**
 * PATCH /api/issues/[id]/resolve — authority moves an issue forward.
 *
 * Transitions are enforced in the WHERE clause rather than trusted from the UI:
 * this is a plain PATCH any authority could replay by hand, and without the guard
 * a resolved issue could be pushed back to IN_PROGRESS or a report that never met
 * the vote threshold could be closed outright.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || !['AUTHORITY', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, proofPhotoUrl } = body;

    if (action !== 'start' && action !== 'resolve') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (action === 'resolve' && !proofPhotoUrl) {
      return NextResponse.json(
        { error: 'A photo of the completed work is required before closing a report.' },
        { status: 400 }
      );
    }

    const from = action === 'start' ? 'VALIDATED' : 'IN_PROGRESS';
    const to = action === 'start' ? 'IN_PROGRESS' : 'RESOLVED';

    // updateMany so a status mismatch returns count 0 instead of throwing P2025,
    // which the old code let fall through to a generic 500.
    const { count } = await prisma.issue.updateMany({
      where: { id, status: from },
      data: action === 'start' ? { status: to } : { status: to, proofPhotoUrl },
    });

    if (count === 0) {
      const existing = await prisma.issue.findUnique({
        where: { id },
        select: { status: true },
      });

      if (!existing) {
        return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
      }
      return NextResponse.json(
        {
          error: `This report is ${existing.status.toLowerCase().replace('_', ' ')}, so it cannot be moved to ${to.toLowerCase().replace('_', ' ')}.`,
        },
        { status: 409 }
      );
    }

    const issue = await prisma.issue.findUnique({
      where: { id },
      select: { id: true, authorId: true, status: true, proofPhotoUrl: true },
    });

    if (action === 'resolve' && issue) {
      // The reporter is rewarded, not the authority who closed it.
      await awardCoins({
        userId: issue.authorId,
        reason: 'REPORT_RESOLVED',
        issueId: issue.id,
      }).catch((err) => console.error('[resolve] awardCoins failed', err));
      await checkAndAwardBadges(issue.authorId, 'RESOLVED').catch((err) =>
        console.error('[resolve] checkAndAwardBadges failed', err)
      );
    }

    revalidatePath('/');
    revalidatePath('/authority');
    revalidatePath('/dashboard');
    revalidatePath('/profile');
    revalidatePath('/leaderboard');
    revalidatePath(`/issue/${id}`);

    return NextResponse.json(issue);
  } catch (error) {
    console.error('[PATCH /api/issues/[id]/resolve]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
