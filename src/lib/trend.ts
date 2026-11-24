/**
 * Arah tren skor untuk label di layar DNA/coaching. Sebelumnya label "Konsisten Naik"
 * di-hardcode sehingga tampil walau skor turun (audit UX 2026-11-24).
 */
export type TrendDirection = 'up' | 'down' | 'flat' | 'insufficient';

/** Selisih poin minimum agar dianggap naik/turun (di bawahnya = stabil). */
export const TREND_THRESHOLD = 5;

export function trendDirection(values: readonly number[]): TrendDirection {
  if (values.length < 2) return 'insufficient';
  const change = values[values.length - 1] - values[0];
  if (change >= TREND_THRESHOLD) return 'up';
  if (change <= -TREND_THRESHOLD) return 'down';
  return 'flat';
}

export const TREND_LABEL: Record<TrendDirection, string> = {
  up: 'Naik',
  down: 'Turun',
  flat: 'Stabil',
  insufficient: 'Data baru',
};
