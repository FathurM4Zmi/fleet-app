import type { ShiftDto } from '@/lib/api/endpoints';
import { pickShift, shiftAction } from '@/lib/shift';

const now = new Date('2026-11-24T06:30:00+07:00');
const shift = (id: string, start: string, end: string, extra: Partial<ShiftDto> = {}): ShiftDto => ({
  id, startAt: start, endAt: end, note: null, status: 'Terjadwal', attendance: 'Terjadwal',
  clockInAt: null, clockOutAt: null, workedHours: 0, ...extra,
});

describe('kartu shift beranda (FRD-M20-05)', () => {
  it('mengutamakan shift yang sedang dijalani, lalu shift terdekat yang belum lewat', () => {
    const past = shift('past', '2026-11-23T07:00:00+07:00', '2026-11-23T15:00:00+07:00');
    const next = shift('next', '2026-11-24T07:00:00+07:00', '2026-11-24T15:00:00+07:00');
    const later = shift('later', '2026-11-25T07:00:00+07:00', '2026-11-25T15:00:00+07:00');
    expect(pickShift([later, past, next], now)?.id).toBe('next');

    const running = shift('run', '2026-11-23T22:00:00+07:00', '2026-11-24T06:00:00+07:00', { clockInAt: '2026-11-23T22:01:00+07:00' });
    expect(pickShift([next, running], now)?.id).toBe('run');
  });

  it('clock-in baru aktif 60 menit sebelum mulai; setelah clock-in tombol jadi clock-out', () => {
    expect(shiftAction(shift('a', '2026-11-24T07:00:00+07:00', '2026-11-24T15:00:00+07:00'), now)).toBe('clockIn');
    expect(shiftAction(shift('b', '2026-11-24T08:00:00+07:00', '2026-11-24T16:00:00+07:00'), now)).toBeNull();
    expect(shiftAction(shift('c', '2026-11-24T07:00:00+07:00', '2026-11-24T15:00:00+07:00', { clockInAt: '2026-11-24T06:50:00+07:00' }), now)).toBe('clockOut');
  });
});
