import { v2 as cloudinary } from 'cloudinary';
import { ALLOWED_IMAGE_FORMATS } from '@/lib/constants';

// Server-only module: importing it from a client component pulls the Cloudinary
// SDK (and Node's fs) into the browser bundle and breaks the build.

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const apiKey = process.env.CLOUDINARY_API_KEY ?? '';
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? '';

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

/** Where each kind of photo lands in the media library. */
const UPLOAD_FOLDERS = {
  issue: 'mycity/issues',
  proof: 'mycity/proofs',
  avatar: 'mycity/avatars',
} as const;

export type UploadKind = keyof typeof UPLOAD_FOLDERS;

export function isCloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

/**
 * Builds the credentials the browser needs to upload one file straight to
 * Cloudinary. Signed uploads mean no dashboard-side upload preset is required,
 * and the file never passes through this server (so no request body limit).
 *
 * Every param below is part of the signature, so the browser cannot swap the
 * destination folder or sneak in a disallowed file format.
 */
export function createSignedUpload(kind: UploadKind) {
  const params = {
    allowed_formats: ALLOWED_IMAGE_FORMATS,
    folder: UPLOAD_FOLDERS[kind],
    timestamp: Math.round(Date.now() / 1000),
  };

  return {
    ...params,
    signature: cloudinary.utils.api_sign_request(params, apiSecret),
    apiKey,
    cloudName,
  };
}
