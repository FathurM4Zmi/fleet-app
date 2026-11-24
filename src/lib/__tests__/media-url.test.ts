/**
 * G30 — berkas bukti (`uploads/...`) wajib login di BE. Gambar tidak bisa membawa header
 * Authorization di Expo web, jadi URL bukti menyertakan access token sesi.
 */
import { API_BASE_URL, mediaUrl } from '@/lib/api/config';
import { currentToken } from '@/lib/auth/session';

jest.mock('@/lib/auth/session', () => ({ currentToken: jest.fn() }));

const token = currentToken as jest.Mock;

describe('mediaUrl', () => {
  beforeEach(() => token.mockReset());

  it('menambahkan access token ke URL berkas bukti di server', () => {
    token.mockReturnValue('abc.def');
    expect(mediaUrl('uploads/driver/x.jpg')).toBe(`${API_BASE_URL}/uploads/driver/x.jpg?access_token=abc.def`);
  });

  it('tanpa sesi tetap menghasilkan URL (server menolak 401, bukan crash di klien)', () => {
    token.mockReturnValue(null);
    expect(mediaUrl('/uploads/driver/x.jpg')).toBe(`${API_BASE_URL}/uploads/driver/x.jpg`);
  });

  it('URI lokal/absolut tidak diubah', () => {
    token.mockReturnValue('abc');
    expect(mediaUrl('file:///tmp/a.jpg')).toBe('file:///tmp/a.jpg');
    expect(mediaUrl('https://cdn.example/a.jpg')).toBe('https://cdn.example/a.jpg');
    expect(mediaUrl(null)).toBeUndefined();
  });
});
