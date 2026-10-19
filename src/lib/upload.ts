import { apiUpload } from '@/lib/api/client';

const MIME_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

/**
 * Uploads a locally captured photo and returns the server path that is stored in
 * `photoPaths` / `receiptPath`. Photos that already point at the server
 * (`uploads/...`) are returned untouched so retries stay idempotent.
 */
export async function uploadImage(uri: string, prefix = 'bukti'): Promise<string> {
  if (!uri) return uri;
  if (uri.startsWith('uploads/') || uri.startsWith('/uploads/')) {
    return uri.replace(/^\//, '');
  }

  const fileName = uri.split('/').pop() ?? `${prefix}.jpg`;
  const extension = (fileName.split('.').pop() ?? 'jpg').toLowerCase();
  const type = MIME_BY_EXTENSION[extension] ?? 'image/jpeg';

  const result = await apiUpload('/api/driver/uploads', {
    uri,
    name: fileName.includes('.') ? fileName : `${prefix}.jpg`,
    type,
  });
  return result.path;
}
