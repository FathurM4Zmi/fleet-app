import type { ActivityCategory, ActivityEntry, SettlementPeriod, SettlementTripLine } from '../types';

export const ACTIVITY_FILTERS: { label: string; value: ActivityCategory | 'all' }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Login', value: 'login' },
  { label: 'DVIR', value: 'dvir' },
  { label: 'POD', value: 'pod' },
  { label: 'BBM', value: 'fuel' },
  { label: 'Trip', value: 'trip' },
];

export const activityEntries: ActivityEntry[] = [
  {
    key: 'login-4821',
    category: 'login',
    title: 'Login berhasil',
    detail: 'Sesi #4821',
    time: '08:02',
    tone: 'success',
  },
  {
    key: 'dvir-0291',
    category: 'dvir',
    title: 'DVIR Pre-Trip dikirim',
    detail: 'DVIR-2026-0291 • B 9123 KJA',
    time: '08:14',
    tone: 'info',
  },
  {
    key: 'pod-0871',
    category: 'pod',
    title: 'POD tersinkron',
    detail: 'POD-2026-00871 • Gudang Cikarang',
    time: '11:14',
    tone: 'success',
  },
  {
    key: 'fuel-1204',
    category: 'fuel',
    title: 'Catat BBM diajukan',
    detail: '45 L Solar • Rp 652.500',
    time: '12:30',
    tone: 'info',
  },
];

/** Label for the day the entries above belong to. */
export const activityDay = '13 Okt 2026';

export const settlementSummary = {
  period: 'Februari 2026',
  total: 'Rp 8.450.000',
  status: 'Disetujui',
  paidNote: 'Dibayar 28 Feb 2026',
  punctuality: 'Tepat Waktu',
};

export const settlementLines: SettlementTripLine[] = [
  {
    key: 'trp-88210',
    destination: 'Gudang Cikarang Barat',
    meta: 'ID: TRP-88210 • 03 Feb',
    amount: 'Rp 2.100.000',
  },
  {
    key: 'trp-88254',
    destination: 'Pluto Pile Jakarta',
    meta: 'ID: TRP-88254 • 09 Feb',
    amount: 'Rp 2.350.000',
  },
  {
    key: 'trp-88301',
    destination: 'Bekasi Distribution',
    meta: 'Via Cibitung Logistik • 15 Feb',
    amount: 'Rp 1.900.000',
  },
  {
    key: 'trp-88342',
    destination: 'Bekasi Distribution',
    meta: 'ID: TRP-88342 • 22 Feb',
    amount: 'Rp 2.100.000',
  },
];

export const settlementHistory: SettlementPeriod[] = [
  { key: '2026-01', label: 'Januari 2026', amount: 'Rp 8.120.000', status: 'Dibayar' },
  { key: '2025-12', label: 'Desember 2025', amount: 'Rp 7.950.000', status: 'Dibayar' },
];
