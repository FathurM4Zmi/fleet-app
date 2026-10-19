import type {
  DnaSummary,
  PerformanceKpi,
  PerformanceScore,
  PerformanceTrendPoint,
} from '../types';

/** Today at a fixed wall-clock time, so "Diperbarui" always reads as today. */
const todayAt = (hours: number, minutes: number): string => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const performanceKpis: PerformanceKpi[] = [
  {
    key: 'trips',
    label: 'Trip Selesai',
    value: '12',
    delta: '+3',
    deltaTone: 'success',
    note: 'Target: 10 trip',
  },
  {
    key: 'onTime',
    label: 'Tepat Waktu',
    value: '92%',
    delta: '+5%',
    deltaTone: 'success',
    note: 'Standar: 85%',
  },
  {
    key: 'distance',
    label: 'Jarak Tempuh',
    value: '1.284',
    unit: 'km',
    note: '6 rute aktif',
  },
  {
    key: 'fuel',
    label: 'Konsumsi',
    value: '8,4',
    unit: 'L/100km',
    delta: 'naik',
    deltaTone: 'warning',
    note: 'Solar Dexlite',
  },
];

/** Monday → Sunday of the current week. */
export const performanceTrend: PerformanceTrendPoint[] = [
  { day: 'Sen', trips: 1, onTimePercent: 80 },
  { day: 'Sel', trips: 2, onTimePercent: 95 },
  { day: 'Rab', trips: 2, onTimePercent: 90 },
  { day: 'Kam', trips: 1, onTimePercent: 85 },
  { day: 'Jum', trips: 3, onTimePercent: 100 },
  { day: 'Sab', trips: 2, onTimePercent: 90 },
  { day: 'Min', trips: 1, onTimePercent: 92 },
];

export const performanceScore: PerformanceScore = {
  value: 87,
  max: 100,
  fleetAverage: 83,
  fleetDelta: 4,
  verified: true,
};

export const dnaSummary: DnaSummary = {
  score: 87,
  delta: 3,
  weeksTracked: 12,
  tier: 'Kategori Prima (Tier 1)',
  fleetAverage: 82,
  updatedAt: todayAt(7, 45),
  trend: [
    { label: 'M1', score: 74 },
    { label: 'M3', score: 78 },
    { label: 'M6', score: 81 },
    { label: 'M9', score: 84 },
    { label: 'M12', score: 87 },
  ],
  components: [
    { key: 'driving', label: 'Perilaku mengemudi', score: 93, band: 'Sangat Baik', tone: 'success' },
    { key: 'fuel', label: 'Konsumsi BBM', score: 81, band: 'Efisien', tone: 'success' },
    { key: 'dvir', label: 'Kepatuhan DVIR', score: 95, band: 'Lengkap', tone: 'success' },
    { key: 'punctuality', label: 'Ketepatan waktu', score: 78, band: 'Perlu Perhatian', tone: 'warning' },
  ],
  insight: {
    title: 'Ketepatan waktu turun 4 poin',
    body: '2 trip terlambat lebih dari 15 menit minggu ini.',
  },
};
