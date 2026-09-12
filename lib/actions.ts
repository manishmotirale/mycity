'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import {
  prisma,
  DB_UNREACHABLE_MESSAGE,
  isDbUnreachable,
  isUniqueConstraintError,
} from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { CreateIssueSchema, RegisterSchema } from '@/lib/validations';
import { checkAndAwardBadges } from '@/lib/badges';
import { awardCoins } from '@/lib/coins';

// ─── Register a new user ──────────────────────────────────────────────────────
export async function registerUser(formData: unknown) {
  const parsed = RegisterSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: 'An account with this email already exists.' };

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return { success: true };
  } catch (err: unknown) {
    if (isDbUnreachable(err)) return { error: DB_UNREACHABLE_MESSAGE };
    // Lost the race against a concurrent signup with the same email.
    if (isUniqueConstraintError(err)) {
      return { error: 'An account with this email already exists.' };
    }
    return { error: 'Registration failed. Please try again.' };
  }
}

// ─── Create a new issue report ─────────────────────────────────────────────────
export async function createIssue(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: 'You must be logged in to report an issue.' };

  const parsed = CreateIssueSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const issue = await prisma.issue.create({
      data: {
        ...parsed.data,
        authorId: session.user.id,
      },
    });

    // Rewards are best-effort: a coin or badge failure must not lose the report.
    // Failures are logged rather than silenced, so unpaid rewards are detectable.
    await awardCoins({
      userId: session.user.id,
      reason: 'REPORT_FILED',
      issueId: issue.id,
    }).catch((err) => console.error('[createIssue] awardCoins failed', err));
    await checkAndAwardBadges(session.user.id, 'REPORT').catch((err) =>
      console.error('[createIssue] checkAndAwardBadges failed', err)
    );

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/profile');
    revalidatePath('/leaderboard');
    return { success: true, issueId: issue.id };
  } catch (err: unknown) {
    if (isDbUnreachable(err)) return { error: DB_UNREACHABLE_MESSAGE };
    return { error: 'Failed to create issue. Please try again.' };
  }
}

// Upvoting and authority status changes live in app/api/issues/[id]/upvote and
// .../resolve, because the components that trigger them are client components
// calling fetch rather than invoking a server action.
