import type { SafetyEvent } from '../types';

export const SAFETY_FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'rem', label: 'Rem' },
  { key: 'kecepatan', label: 'Kecepatan' },
  { key: 'efektifitas', label: 'Efektifitas' },
  { key: 'lainnya', label: 'Lainnya' },
];

export const safetyScore = {
  value: 88,
  delta: '+6 pts bulan ini',
  note: 'Performa mengemudi aman dan terkendali',
};

/** Auto-detected driving events for the current day (module M13). */
export const safetyEvents: SafetyEvent[] = [
  {
    key: 'safe-01',
    category: 'rem',
    categoryLabel: 'REM',
    severity: 'critical',
    title: 'Rem mendadak',
    location: 'Jl. Raya Cikarang',
    time: '09:42',
    metric: '-8.4 m/s²',
    metricNote: 'deselerasi',
    hasPhoto: true,
  },
  {
    key: 'safe-02',
    category: 'kecepatan',
    categoryLabel: 'KECEPATAN',
    severity: 'warning',
    title: 'Melebihi batas 20 km/jam',
    location: 'Tol Outer Ring',
    time: '10:18',
    metric: '80 km/jam',
    metricNote: 'di zona 60 km/jam',
    hasPhoto: true,
  },
  {
    key: 'safe-03',
    category: 'efektifitas',
    categoryLabel: 'EFEKTIFITAS',
    severity: 'info',
    title: 'Idle terlalu lama',
    location: 'Gudang Cikarang',
    time: '11:02',
    metric: 'Mesin menyala diam',
    metricNote: '24 menit',
    hasPhoto: false,
  },
];
