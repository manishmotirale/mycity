import { NextRequest, NextResponse } from 'next/server';
import { IssueStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const STATUSES = Object.values(IssueStatus);

// Reads search params, so it can never be prerendered. Declaring this stops the
// build from attempting static analysis and logging a dynamic-usage error.
export const dynamic = 'force-dynamic';

/**
 * GET /api/issues — list issues, optionally filtered by status or author.
 * Used by the authority dashboard, which refetches on tab change.
 *
 * Issues are public, so this is unauthenticated by design. It deliberately does
 * not expose who upvoted what — only the totals.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') ?? 'newest';
    const authorId = searchParams.get('authorId');

    const requestedStatus = searchParams.get('status');
    if (requestedStatus && !STATUSES.includes(requestedStatus as IssueStatus)) {
      return NextResponse.json({ error: 'Unknown status filter.' }, { status: 400 });
    }
    const status = requestedStatus as IssueStatus | null;

    const issues = await prisma.issue.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(authorId ? { authorId } : {}),
      },
      include: {
        author: { select: { name: true, image: true, role: true } },
        _count: { select: { upvotes: true } },
      },
      orderBy: sort === 'most_upvoted' ? { upvotes: { _count: 'desc' } } : { createdAt: 'desc' },
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error('[GET /api/issues]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
