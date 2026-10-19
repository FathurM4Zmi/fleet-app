import type { DvirItem } from '../types';

interface ChecklistSeed {
  group: string;
  label: string;
}

/** Pre-trip inspection checklist. */
const PRE_TRIP: ChecklistSeed[] = [
  { group: 'Dokumen', label: 'STNK & KIR masih berlaku' },
  { group: 'Dokumen', label: 'SIM B2 Umum dibawa' },
  { group: 'Dokumen', label: 'Surat jalan lengkap' },
  { group: 'Eksterior', label: 'Lampu depan & sein berfungsi' },
  { group: 'Eksterior', label: 'Lampu rem & mundur berfungsi' },
  { group: 'Eksterior', label: 'Ban & tekanan angin normal' },
  { group: 'Eksterior', label: 'Kaca spion lengkap & bersih' },
  { group: 'Mesin', label: 'Oli mesin pada level aman' },
  { group: 'Mesin', label: 'Air radiator cukup' },
  { group: 'Mesin', label: 'Tidak ada kebocoran oli / air' },
  { group: 'Kabin', label: 'Sabuk keselamatan berfungsi' },
  { group: 'Kabin', label: 'Klakson berfungsi' },
  { group: 'Kabin', label: 'Wiper & air pembersih kaca berfungsi' },
  { group: 'Keselamatan', label: 'APAR tersedia & belum kedaluwarsa' },
  { group: 'Keselamatan', label: 'Segitiga pengaman tersedia' },
  { group: 'Keselamatan', label: 'Kotak P3K lengkap' },
];

/** Post-trip inspection checklist. */
const POST_TRIP: ChecklistSeed[] = [
  { group: 'Eksterior', label: 'Bodi & bak tidak rusak' },
  { group: 'Eksterior', label: 'Lampu & sein masih berfungsi' },
  { group: 'Eksterior', label: 'Ban tidak aus / bocor' },
  { group: 'Mesin', label: 'Oli mesin pada level aman' },
  { group: 'Mesin', label: 'Air radiator cukup' },
  { group: 'Kabin', label: 'Kabin bersih & tidak ada barang tertinggal' },
  { group: 'Keselamatan', label: 'APAR & segitiga masih tersedia' },
  { group: 'Keselamatan', label: 'Tidak ada kerusakan baru selama perjalanan' },
];

const toItems = (seeds: ChecklistSeed[], prefix: string): DvirItem[] =>
  seeds.map((seed, index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    label: seed.label,
    group: seed.group,
    result: null,
  }));

export const createPreTripItems = (): DvirItem[] => toItems(PRE_TRIP, 'pre');

export const createPostTripItems = (): DvirItem[] => toItems(POST_TRIP, 'post');
