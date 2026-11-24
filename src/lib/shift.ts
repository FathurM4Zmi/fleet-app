import type { ShiftDto } from '@/lib/api/endpoints';

export type ShiftAction = 'clockIn' | 'clockOut' | null;

/** Menit sebelum mulai saat tombol clock-in mulai aktif — sama dengan ShiftPolicy server. */
export const EARLY_CLOCK_IN_MINUTES = 60;

/**
 * Shift yang relevan untuk kartu beranda: yang sedang dijalani (sudah clock-in, belum clock-out),
 * lalu shift berikutnya yang belum berakhir. `null` = tidak ada shift dalam waktu dekat.
 */
export function pickShift(shifts: ShiftDto[], now: Date): ShiftDto | null {
  const active = shifts.find((s) => s.clockInAt && !s.clockOutAt);
  if (active) return active;
  return (
    shifts
      .filter((s) => s.status !== 'Dibatalkan' && !s.clockInAt && new Date(s.endAt) > now)
      .sort((a, b) => a.startAt.localeCompare(b.startAt))[0] ?? null
  );
}

export function shiftAction(shift: ShiftDto, now: Date): ShiftAction {
  if (shift.clockInAt && !shift.clockOutAt) return 'clockOut';
  if (shift.clockInAt) return null;
  const opensAt = new Date(shift.startAt).getTime() - EARLY_CLOCK_IN_MINUTES * 60_000;
  return now.getTime() >= opensAt && now < new Date(shift.endAt) ? 'clockIn' : null;
}
