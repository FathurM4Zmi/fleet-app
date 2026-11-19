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

  // Camera URIs can carry a query string (`?width=…`) or percent-escapes; both
  // would end up in the multipart filename and make the server reject the part.
  const rawName = uri.split('?')[0]?.split('/').pop() ?? '';
  const fileName = decodeURIComponent(rawName);
  const hasExtension = /\.[a-z0-9]{2,5}$/i.test(fileName);
  const extension = hasExtension ? fileName.split('.').pop()!.toLowerCase() : 'jpg';
  const type = MIME_BY_EXTENSION[extension] ?? 'image/jpeg';

  const result = await apiUpload('/api/driver/uploads', {
    uri,
    name: hasExtension ? fileName : `${prefix}-${Date.now()}.jpg`,
    type,
  });
  return result.path;
}
