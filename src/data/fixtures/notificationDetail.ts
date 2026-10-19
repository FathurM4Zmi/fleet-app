import type { NotificationDetail } from '../types';

/**
 * Extra context for the notification detail screen, keyed by notification id.
 * Only the "unit dinonaktifkan" alert has a bespoke layout in the design.
 */
export const notificationDetails: NotificationDetail[] = [
  {
    notificationId: 'ntf-001',
    vehicleId: 'veh-003',
    defect: 'Rem utama tidak berfungsi',
    detectedNote: 'Terdeteksi saat DVIR Pre-Trip, 13 Okt 2026 08:12',
    workOrder: {
      code: 'WO-2026-0841',
      note: 'Dibuat otomatis oleh sistem • Estimasi selesai 14 Okt',
      statusLabel: 'Menunggu Perbaikan',
      statusTone: 'warning',
    },
    impact:
      'Anda tidak dapat menerima assignment baru hingga perbaikan selesai. Trip berjalan tetap dapat diselesaikan.',
    timeline: [
      {
        key: 'nd-1',
        label: 'DVIR gagal dikirim',
        note: 'Laporan inspeksi pre-trip ditolak',
        time: '08:12',
        tone: 'critical',
      },
      {
        key: 'nd-2',
        label: 'Work order dibuat otomatis',
        note: 'Tiket perbaikan teknis diterbitkan',
        time: '08:12',
        tone: 'warning',
      },
      {
        key: 'nd-3',
        label: 'Supervisor diberi tahu',
        note: 'Notifikasi eskalasi terkirim ke dispatch',
        time: '08:13',
        tone: 'info',
      },
    ],
  },
  {
    notificationId: 'ntf-002',
    documentKey: 'sim',
    timeline: [
      {
        key: 'nd-1',
        label: 'Pengingat dikirim',
        note: 'Sistem mendeteksi masa berlaku hampir habis',
        time: '10:00',
        tone: 'warning',
      },
      {
        key: 'nd-2',
        label: 'Menunggu tindak lanjut',
        note: 'Unggah dokumen terbaru ke admin',
        time: '10:01',
        tone: 'info',
      },
    ],
  },
];

export const notificationDetailById = (notificationId: string): NotificationDetail | undefined =>
  notificationDetails.find((detail) => detail.notificationId === notificationId);
