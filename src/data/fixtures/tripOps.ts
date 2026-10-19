import type {
  RouteOption,
  TripAsset,
  TripWarning,
  TripWarningHistoryEntry,
} from '../types';

/** Live telemetry snapshot for the Rute & Posisi screen (module M12). */
export const tripTelemetry = {
  fuelPercent: 62,
  speedKmh: 54,
  ignition: 'ON',
  lastUpdate: 'baru saja',
  gpsLabel: 'GPS Baik',
};

export const tripEtaSummary = {
  eta: '11:15',
  remainingKm: 18,
  remainingMinutes: 24,
};

export const tripRouteStops = [
  { key: 'stop-1', index: 1, name: 'Gudang Distribution Kelapa Gading', note: 'Sudah dilewati', tone: 'done' as const },
  { key: 'stop-2', index: 2, name: 'Gudang Cikarang Barat', note: 'Berikutnya • 18 km', tone: 'next' as const },
];

/** Selectable routes on the Pilih Rute screen (module M12). */
export const routeOptions: RouteOption[] = [
  {
    key: 'tol',
    title: 'Via Tol Cikarang',
    subtitle: 'Rute Utama Armada',
    minutes: 42,
    km: 38,
    statusLabel: 'Traffic lancar • Paling Cepat',
    statusTone: 'success',
    recommended: true,
  },
  {
    key: 'raya',
    title: 'Via Jalan Raya',
    subtitle: 'Non-Tol Arteri',
    minutes: 52,
    km: 31,
    tag: 'Hemat Tarif Tol',
    statusLabel: 'Cenderung macet di Pasar Tambun',
    statusTone: 'warning',
  },
  {
    key: 'rancaekek',
    title: 'Via Rancaekek',
    subtitle: 'Jalur Lingkar Selatan',
    minutes: 47,
    km: 44,
    tag: 'Jalur Bebas Truk',
    statusLabel: '1 tikar off / Rute alternatif',
    statusTone: 'neutral',
  },
];

/** Active trip warnings on the Peringatan Trip screen (module M17). */
export const tripWarnings: TripWarning[] = [
  {
    key: 'warn-1',
    severity: 'critical',
    severityLabel: 'KRITIS',
    title: 'Keluar dari zona rute',
    note: 'Keluar 850 m dari rute • Jl. Raya Cikarang',
    sla: 'SLA 00:14:22',
  },
  {
    key: 'warn-2',
    severity: 'warning',
    severityLabel: 'PERINGATAN',
    title: 'Keterlambatan SLA',
    note: 'Proyeksi telat 18 menit',
    sla: 'SLA 01:02:40',
    suggestsRoute: true,
  },
  {
    key: 'warn-3',
    severity: 'info',
    severityLabel: 'INFO',
    title: 'Titik antar diubah',
    note: 'Titik 2 dipindahkan oleh dispatcher',
    timeLabel: 'Baru saja',
  },
];

export const tripWarningHistory: TripWarningHistoryEntry[] = [
  {
    key: 'wh-1',
    title: 'Kecepatan melebihi batas',
    note: 'Terselesaikan otomatis • Kembali normal di KM 32',
    time: '09:15, 13 Okt',
  },
  {
    key: 'wh-2',
    title: 'Sensor pintu bak terbuka',
    note: 'Telah diverifikasi sopir • Penguncian ulang selesai',
    time: '08:40, 13 Okt',
  },
];

/** Registered cargo assets on the Aset Trip screen (module M12). */
export const tripAssets = {
  code: 'TRP-2026-1042',
  reefer: {
    name: 'Reefer RT-02',
    statusLabel: 'Peringatan',
    temperatureC: 4,
    humidityPercent: 62,
    sensorId: 'BLE-RF-091',
    trendNote: 'Suhu stabil sepanjang perjalanan',
    trend: [4, 4.2, 4.5, 4.6, 4.4, 4.4],
    trendLabels: ['08:00', '10:00', '12:00', '14:00'],
  },
  trailers: [
    {
      key: 'AST-4471',
      code: 'AST-4471',
      name: 'Carrier Vector 1550',
      statusLabel: 'Normal',
      statusTone: 'success' as const,
      footNote: 'Terkunci',
      footIcon: 'lock' as const,
    },
    {
      key: 'AST-4472',
      code: 'AST-4472',
      name: 'Cooler Box',
      statusLabel: 'Perlu Cek',
      statusTone: 'warning' as const,
      footNote: 'Inspeksi',
      footIcon: 'search' as const,
    },
  ] satisfies TripAsset[],
  warning: {
    title: 'Pergerakan di luar zona',
    body: 'Aset AST-4473 terdeteksi bergerak di luar zona multimuara.',
  },
};
