/**
 * MBRL-009 — kunci idempotensi untuk operasi tulis yang bisa dikirim ulang (antrean offline).
 *
 * Kunci diturunkan dari ISI permintaan (path + body), bukan acak: percobaan langsung yang gagal di
 * jaringan lalu diputar ulang oleh outbox memakai kunci yang SAMA, sehingga backend memutar ulang
 * respons pertama alih-alih membuat entri ganda. Setiap payload sah unik (path foto, capturedAt,
 * odometer), jadi dua catatan berbeda tidak pernah berbagi kunci.
 * Backend (filter `[Idempotent]`) menerima 8–128 karakter [A-Za-z0-9_-].
 */

/** Endpoint tulis driver yang dilindungi `[Idempotent]` di backend. */
const IDEMPOTENT_PATHS = [
  /\/driver\/dvir$/,
  /\/driver\/fuel$/,
  /\/driver\/damage$/,
  /\/driver\/incidents$/,
  /\/driver\/vehicle\/odometer-correction$/,
  /\/driver\/tasks\/[^/]+\/pod$/,
];

export function isIdempotentPath(path: string): boolean {
  const clean = path.split('?')[0];
  return IDEMPOTENT_PATHS.some((pattern) => pattern.test(clean));
}

/** cyrb53 — hash 53-bit non-kriptografis yang cepat dan stabil lintas platform (tanpa modul native). */
function cyrb53(input: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** `idem-<a>-<b>`: dua hash berbeda seed → ~106 bit efektif, 30-an karakter. */
export function idempotencyKeyFor(path: string, body: unknown): string {
  const text = `${path.split('?')[0]}|${JSON.stringify(body ?? null)}`;
  return `idem-${cyrb53(text, 1).toString(36)}-${cyrb53(text, 2).toString(36)}`;
}
