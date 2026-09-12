'use client';

import { ALLOWED_IMAGE_MIME, MAX_UPLOAD_BYTES } from '@/lib/constants';

/**
 * Uploads one image to Cloudinary and returns its https URL.
 *
 * The signature comes from /api/upload, then the file goes browser → Cloudinary
 * directly. Throws with a message worth showing the user, so callers should
 * catch and surface it rather than failing silently.
 */
export async function uploadImage(
  file: File,
  kind: 'issue' | 'proof' | 'avatar'
): Promise<string> {
  if (!ALLOWED_IMAGE_MIME.includes(file.type)) {
    throw new Error('That file type is not supported. Use a JPG, PNG or WEBP image.');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(`That image is ${mb}MB. Please pick one under 10MB.`);
  }

  const signatureRes = await fetch(`/api/upload?kind=${kind}`);
  const signed = await signatureRes.json();
  if (!signatureRes.ok) {
    throw new Error(signed.error ?? 'Could not start the upload.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('api_key', signed.apiKey);
  body.append('timestamp', String(signed.timestamp));
  body.append('signature', signed.signature);
  body.append('folder', signed.folder);
  body.append('allowed_formats', signed.allowed_formats);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
    { method: 'POST', body }
  );
  const result = await uploadRes.json();

  if (!uploadRes.ok || !result.secure_url) {
    // Cloudinary's own message is the useful one here ("cloud_name mismatch",
    // "Invalid Signature", format rejections, and so on).
    throw new Error(result?.error?.message ?? 'Cloudinary rejected the upload.');
  }

  return result.secure_url as string;
}
