import type { ComplianceChecklistItem, IncidentRecord, StatusDocument } from '../types';

/** Incident form option sets (M16 — FRD-MOB-CMP-02). */
export const INCIDENT_CATEGORIES = [
  'Kecelakaan',
  'Nyaris Celaka',
  'Pelanggaran Aturan',
  'Kerusakan Properti',
  'Lainnya',
] as const;

export const INCIDENT_SEVERITIES = ['Ringan', 'Sedang', 'Berat'] as const;

export const complianceDocuments: StatusDocument[] = [
  {
    key: 'sim',
    title: 'SIM',
    note: 'Kedaluwarsa 12 Nov 2026',
    status: 'valid',
    statusLabel: 'Valid',
  },
  {
    key: 'homolog',
    title: 'Sertifikat Homolog',
    note: 'Kedaluwarsa dalam 14 hari',
    status: 'expiring',
    statusLabel: 'Segera Habis',
  },
  {
    key: 'safety-training',
    title: 'Pelatihan Safety',
    note: 'Kedaluwarsa 3 Sep 2025',
    status: 'expired',
    statusLabel: 'Kedaluwarsa',
  },
];

export const complianceChecklist: ComplianceChecklistItem[] = [
  { key: 'signature', label: 'Absen signature', done: true },
  { key: 'strand', label: 'Uji strand', done: true },
  { key: 'emergency', label: 'Simulasi darurat', done: false },
];

export const complianceProgress = { done: 2, total: 5 };

export const incidents: IncidentRecord[] = [
  { key: 'inc-2026-08', date: '28 Agu 2026', title: 'Nyaris menabrak', status: 'Ditutup' },
  { key: 'inc-2026-07', date: '12 Jul 2026', title: 'Rem blong', status: 'Ditutup' },
];
