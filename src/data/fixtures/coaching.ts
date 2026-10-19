import type { CoachingPlan, CoachingSession, DnaTrendPoint, StatusDocument } from '../types';

export const coachingScore = {
  value: 87,
  max: 100,
  /** Window the score covers. */
  period: '6 bulan terakhir',
  /** Points gained since the coaching programme started. */
  delta: 9,
  siteRank: 4,
};

/** Six monthly safety-score readings, oldest first. */
export const coachingTrend: DnaTrendPoint[] = [
  { label: 'Nov', score: 78 },
  { label: 'Des', score: 80 },
  { label: 'Jan', score: 79 },
  { label: 'Feb', score: 82 },
  { label: 'Mar', score: 84 },
  { label: 'Apr', score: 87 },
];

export const coachingPlan: CoachingPlan = {
  title: 'Tingkatkan maneuvering parked',
  description:
    'Fokus reduksi blindspot saat bongkar muat & manuver sempit di depo logistik.',
  targetDate: '25 Apr',
  milestones: [
    { key: 'assessment', label: 'Evaluasi awal', state: 'done', note: 'Selesai 10 Apr' },
    { key: 'reversing', label: 'Latihan reversing 3x', state: 'done', note: 'Selesai 18 Apr' },
    { key: 'field-test', label: 'Uji lapangan', state: 'done', note: 'Selesai 22 Apr' },
    { key: 'supervisor', label: 'Evaluasi supervisor', state: 'waiting', note: 'Menunggu peninjauan' },
    { key: 'certification', label: 'Sertifikasi', state: 'locked', note: 'Terkunci' },
  ],
};

export const coachingCertifications: StatusDocument[] = [
  {
    key: 'homolog',
    title: 'Homolog',
    note: 'Sertifikasi Armada',
    status: 'valid',
    statusLabel: 'Valid',
    hint: 'Aktif',
  },
  {
    key: 'first-aid',
    title: 'First Aid',
    note: 'Kedaluwarsa 3 Des 2026',
    status: 'expiring',
    statusLabel: 'Segera Habis',
  },
];

export const coachingSessions: CoachingSession[] = [
  {
    key: 'eco-driving',
    title: 'Eco-Driving & Hemat Bahan Bakar',
    note: 'Selesai pada 14 Feb 2025 • Skor +12',
    status: 'done',
    statusLabel: 'Selesai',
  },
  {
    key: 'fatigue',
    title: 'Manajemen Kelelahan & Istirahat',
    note: 'Dibatalkan oleh dispatcher • Reschedule',
    status: 'cancelled',
    statusLabel: 'Dibatalkan',
  },
];
