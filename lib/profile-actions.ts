'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import {
  prisma,
  DB_UNREACHABLE_MESSAGE,
  isDbUnreachable,
  isUniqueConstraintError,
} from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { UpdateProfileSchema } from '@/lib/validations';

/**
 * Saves the signed-in user's own profile. There is no userId parameter on purpose:
 * the target is always the session user, so this cannot be used to edit someone else.
 */
export async function updateProfile(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: 'You must be signed in to edit your profile.' };

  const parsed = UpdateProfileSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, username, bio, location, image } = parsed.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        // Empty strings clear the field rather than storing "". This applies to
        // the photo too — previously an empty image was dropped from the update,
        // so a photo could never be removed once set.
        username: username ? username : null,
        bio: bio ? bio : null,
        location: location ? location : null,
        image: image ? image : null,
      },
    });

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    revalidatePath('/leaderboard');
    return { success: true };
  } catch (err: unknown) {
    if (isDbUnreachable(err)) return { error: DB_UNREACHABLE_MESSAGE };
    if (isUniqueConstraintError(err)) {
      return { error: 'That username is already taken. Try another one.' };
    }
    return { error: 'Could not save your profile. Please try again.' };
  }
}
