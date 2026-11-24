import { idempotencyKeyFor, isIdempotentPath } from '@/lib/api/idempotency';

const KEY_PATTERN = /^[A-Za-z0-9_-]{8,128}$/; // sama dengan validasi backend

describe('idempotencyKeyFor', () => {
  const body = { vehicleId: 'v1', liters: 18.5, receiptPath: 'driver/2026/11/19/a.jpg' };

  it('stabil: isi sama → kunci sama (percobaan langsung = putar ulang outbox)', () => {
    expect(idempotencyKeyFor('/api/driver/fuel', body)).toBe(
      idempotencyKeyFor('/api/driver/fuel', { ...body }),
    );
  });

  it('isi berbeda atau path berbeda → kunci berbeda', () => {
    const a = idempotencyKeyFor('/api/driver/fuel', body);
    expect(idempotencyKeyFor('/api/driver/fuel', { ...body, liters: 19 })).not.toBe(a);
    expect(idempotencyKeyFor('/api/driver/damage', body)).not.toBe(a);
  });

  it('query string pada path tidak mengubah kunci', () => {
    expect(idempotencyKeyFor('/api/driver/fuel?x=1', body)).toBe(idempotencyKeyFor('/api/driver/fuel', body));
  });

  it('selalu memenuhi format yang diterima backend', () => {
    for (const b of [null, undefined, {}, body, { note: 'spasi & simbol ✓' }]) {
      expect(idempotencyKeyFor('/api/driver/dvir', b)).toMatch(KEY_PATTERN);
    }
  });

  it('tidak bertabrakan pada 2.000 payload berbeda', () => {
    const keys = new Set<string>();
    for (let i = 0; i < 2000; i++) keys.add(idempotencyKeyFor('/api/driver/fuel', { ...body, odometerKm: i }));
    expect(keys.size).toBe(2000);
  });
});

describe('isIdempotentPath', () => {
  it.each([
    '/api/driver/dvir',
    '/api/driver/fuel',
    '/api/driver/damage',
    '/api/driver/incidents',
    '/api/driver/vehicle/odometer-correction',
    '/api/driver/tasks/3f2a/pod',
  ])('melindungi %s', (path) => expect(isIdempotentPath(path)).toBe(true));

  it.each([
    '/api/driver/trips/1/start',
    '/api/driver/trips/1/complete',
    '/api/driver/notifications/1/read',
    '/api/driver/tasks/3f2a/start',
    '/api/driver/fuel/stations',
  ])('tidak menyentuh %s', (path) => expect(isIdempotentPath(path)).toBe(false));
});
