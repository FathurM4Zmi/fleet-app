/**
 * Konten untuk layar Supervisor dan chat trip.
 *
 * Backend belum punya endpoint pesan supervisor, jadi isi berkas ini masih contoh
 * dan belum berasal dari server. Begitu endpoint messaging tersedia, ganti dengan
 * hook di `src/hooks/api/` seperti layar lain.
 */
export interface Supervisor {
  name: string;
  initials: string;
  role: string;
  /** E.164-ish number used by the dial action. */
  phone: string;
  site: string;
  shift: string;
  /** Short availability label shown under the name. */
  availability: string;
  /** Typical first-response time, e.g. "± 2 menit". */
  responseTime: string;
  workingHours: string;
  /** Line used by the emergency action. */
  emergencyPhone: string;
}

export type SupervisorMessageKind = 'text' | 'image' | 'location';

export interface SupervisorMessage {
  id: string;
  from: 'supervisor' | 'driver';
  kind: SupervisorMessageKind;
  text?: string;
  imageUri?: string;
  time: string;
  /** Only set for outgoing messages. */
  status?: 'sent' | 'read';
}

export interface SupervisorTopic {
  key: string;
  label: string;
  /** Template inserted into the composer when the topic is picked. */
  message: string;
}

export interface SupervisorCallLog {
  id: string;
  type: 'outgoing' | 'incoming' | 'missed';
  label: string;
  time: string;
  duration: string;
}

export const supervisor: Supervisor = {
  name: 'Andi Wijaya',
  initials: 'AW',
  role: 'Supervisor Operasional',
  phone: '+62 812-9000-1122',
  site: 'Terminal Truk JKT-04',
  shift: 'Shift Pagi • 06.00–14.00',
  availability: 'Siaga',
  responseTime: '± 2 menit',
  workingHours: 'Senin–Sabtu, 06.00–22.00 WIB',
  emergencyPhone: '112',
};

export const supervisorMessages: SupervisorMessage[] = [
  {
    id: 'sup-msg-1',
    from: 'supervisor',
    kind: 'text',
    text: 'Selamat pagi Budi. Ada kendala di jalan?',
    time: '08:12',
  },
  {
    id: 'sup-msg-2',
    from: 'driver',
    kind: 'text',
    text: 'Pagi Pak. Sejauh ini lancar, baru keluar tol Cibitung.',
    time: '08:15',
    status: 'read',
  },
  {
    id: 'sup-msg-3',
    from: 'supervisor',
    kind: 'text',
    text: 'Baik, kabari begitu tiba di lokasi bongkar muat.',
    time: '08:16',
  },
];

export const supervisorQuickReplies = [
  'Sudah tiba di lokasi',
  'Ada kendala di jalan',
  'Butuh bantuan',
] as const;

export const supervisorTopics: SupervisorTopic[] = [
  {
    key: 'delay',
    label: 'Keterlambatan',
    message: 'Saya terlambat karena macet di ',
  },
  {
    key: 'document',
    label: 'Dokumen',
    message: 'Dokumen pengiriman belum lengkap: ',
  },
  {
    key: 'vehicle',
    label: 'Kendala unit',
    message: 'Ada kendala pada unit: ',
  },
  {
    key: 'schedule',
    label: 'Ubah jadwal',
    message: 'Saya ingin mengubah jadwal trip karena ',
  },
];

export const supervisorCallLogs: SupervisorCallLog[] = [
  { id: 'call-1', type: 'outgoing', label: 'Panggilan keluar', time: 'Hari ini, 08:05', duration: '2 mnt 14 dtk' },
  { id: 'call-2', type: 'incoming', label: 'Panggilan masuk', time: 'Kemarin, 16:42', duration: '48 dtk' },
  { id: 'call-3', type: 'missed', label: 'Tidak terjawab', time: 'Kemarin, 09:18', duration: '—' },
];

export const supervisorAutoReplies = [
  'Baik, saya catat. Mohon lanjutkan perjalanan dan kabari jika ada perubahan.',
  'Terima kasih infonya. Saya koordinasikan dengan tim gudang sekarang.',
  'Siap. Kalau butuh bantuan cepat, langsung telepon saya ya.',
];
