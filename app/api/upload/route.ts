import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSignedUpload, isCloudinaryConfigured, type UploadKind } from '@/lib/cloudinary';

const VALID_KINDS: UploadKind[] = ['issue', 'proof', 'avatar'];

/**
 * GET /api/upload?kind=issue|proof
 * Hands the browser a short-lived signature for a direct Cloudinary upload.
 * Only "proof" is restricted, since that photo closes out an issue.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'You must be signed in to upload a photo.' }, { status: 401 });
  }

  const kind = req.nextUrl.searchParams.get('kind') as UploadKind | null;
  if (!kind || !VALID_KINDS.includes(kind)) {
    return NextResponse.json({ error: 'Unknown upload kind.' }, { status: 400 });
  }

  if (kind === 'proof' && !['AUTHORITY', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Only authorities can upload proof photos.' }, { status: 403 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          'Photo uploads are not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json(createSignedUpload(kind));
}
