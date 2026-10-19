import type { VehicleDetail } from '../types';

/** Rich vehicle profile behind the "Kendaraan Saya" screen (module M05). */
export const vehicleDetail: VehicleDetail = {
  vehicleId: 'veh-001',
  fuelType: 'Diesel',
  transmission: 'Manual',
  year: '2021',
  healthScore: 92,
  healthNote: 'Kondisi baik • tidak ada defect terbuka',
  healthDelta: '+4 pts bulan ini',
  capacityKg: 2_500,
  specs: [
    { label: 'Kapasitas', value: '2.500 kg' },
    { label: 'Bahan bakar', value: 'Diesel' },
    { label: 'Odometer terakhir', value: '148.320 km' },
  ],
  documents: [
    { key: 'stnk', label: 'STNK', note: 'Berlaku s/d 14 Okt 2027', status: 'valid', statusLabel: 'Valid' },
    { key: 'kir', label: 'KIR', note: 'Berlaku s/d 20 Des 2026', status: 'valid', statusLabel: 'Valid' },
    {
      key: 'asuransi',
      label: 'Asuransi',
      note: 'Jatuh tempo 15 Nov 2026 (28 hari)',
      status: 'expiring',
      statusLabel: 'Segera Habis',
    },
  ],
  maintenance: [
    { key: 'wo-0812', code: 'WO-2026-0812', title: 'Ganti filter oli', date: '10 Okt 2026', statusLabel: 'Selesai' },
    { key: 'wo-0790', code: 'WO-2026-0790', title: 'Rotasi & cek ban', date: '28 Sep 2026', statusLabel: 'Selesai' },
    {
      key: 'wo-0845',
      code: 'WO-2026-0845',
      title: 'Servis berkala 150.000 km',
      date: '25 Okt 2026',
      statusLabel: 'Terjadwal',
      upcoming: true,
    },
  ],
};
