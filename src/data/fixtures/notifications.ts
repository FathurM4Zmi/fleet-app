import type { Notification } from '../types';

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString();

/**
 * Synthetic inbox. Timestamps are relative to module load so the relative
 * labels ("5 menit lalu") read correctly whenever the prototype is opened.
 */
export const notifications: Notification[] = [
  {
    id: 'ntf-001',
    type: 'alert',
    title: 'Unit Dinonaktifkan',
    body: 'Kereta rem utama gagal inspeksi DVIR.',
    severity: 'critical',
    createdAt: minutesAgo(5),
  },
  {
    id: 'ntf-002',
    type: 'document',
    title: 'SIM akan kedaluwarsa',
    body: 'SIM Anda akan kedaluwarsa dalam 21 hari.',
    severity: 'warning',
    createdAt: minutesAgo(120),
  },
  {
    id: 'ntf-003',
    type: 'trip',
    title: 'Tugas baru ditugaskan',
    body: 'Trip ke Gudang Cikarang Barat menunggu konfirmasi.',
    severity: 'info',
    tripId: 'trp-1042',
    createdAt: minutesAgo(60 * 26),
  },
  {
    id: 'ntf-004',
    type: 'system',
    title: 'POD terkirim',
    body: 'Bukti pengiriman POD-2026-00871 berhasil dikirim.',
    severity: 'info',
    createdAt: minutesAgo(60 * 30),
    readAt: minutesAgo(60 * 29),
  },
  {
    id: 'ntf-005',
    type: 'coaching',
    title: 'Progres coaching diperbarui',
    body: 'Modul "Eco-Driving Dasar" selesai. 2 modul lagi untuk sertifikasi.',
    severity: 'info',
    createdAt: minutesAgo(60 * 50),
    readAt: minutesAgo(60 * 49),
  },
];
