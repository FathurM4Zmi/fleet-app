import type { ActivityCategory } from './types';

/** UI filter chips — not server data. */
export const ACTIVITY_FILTERS: { label: string; value: ActivityCategory | 'all' }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Login', value: 'login' },
  { label: 'DVIR', value: 'dvir' },
  { label: 'POD', value: 'pod' },
  { label: 'BBM', value: 'fuel' },
  { label: 'Trip', value: 'trip' },
];

export const INCIDENT_CATEGORIES = [
  'Kecelakaan',
  'Nyaris Celaka',
  'Pelanggaran Aturan',
  'Kerusakan Properti',
  'Lainnya',
] as const;

export const INCIDENT_SEVERITIES = ['Ringan', 'Sedang', 'Berat'] as const;

export const SAFETY_FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'rem', label: 'Rem' },
  { key: 'kecepatan', label: 'Kecepatan' },
  { key: 'efektifitas', label: 'Efektifitas' },
  { key: 'lainnya', label: 'Lainnya' },
];
