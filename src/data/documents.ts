import type { DocumentDetail } from '@/data/types';

/**
 * Offline/demo content for the driver document screens.
 *
 * The backend seeds documents for the demo drivers only; a fresh account (or an
 * unreachable API) leaves `/documents/:key` empty. These records keep the screen
 * usable and make the layout reviewable with realistic values.
 */
const DUMMY_DOCUMENTS: Record<string, DocumentDetail> = {
  sim: {
    key: 'sim',
    title: 'SIM BII Umum',
    subtitle: 'Surat Izin Mengemudi — Golongan BII Umum',
    updatedNote: 'Diperbarui 12 Sep 2025',
    cardLabel: 'KARTU SIM PENGEMUDI',
    cardNumber: 'B 1234-5678-9012',
    holderName: 'Budi Santoso',
    status: 'expiring',
    statusLabel: 'Segera Habis',
    photoUrl: 'https://placehold.co/600x380/EFF6FF/1B4DFF/png?text=SIM+BII+Umum',
    warning: {
      title: 'Masa berlaku hampir habis',
      body: 'Perpanjang SIM sebelum tanggal berlaku berakhir agar jadwal trip tidak terputus.',
    },
    rows: [
      { key: 'number', label: 'Nomor SIM', value: 'B 1234-5678-9012', mono: true },
      { key: 'name', label: 'Nama', value: 'Budi Santoso' },
      { key: 'type', label: 'Golongan', value: 'BII Umum', badge: true },
      { key: 'issued', label: 'Tanggal Terbit', value: '12 Sep 2020' },
      { key: 'expiry', label: 'Berlaku Sampai', value: '12 Sep 2026' },
      { key: 'issuer', label: 'Penerbit', value: 'Polres Jakarta Selatan' },
    ],
  },
  ktp: {
    key: 'ktp',
    title: 'KTP',
    subtitle: 'Kartu Tanda Penduduk — Elektronik',
    updatedNote: 'Diperbarui 04 Jan 2024',
    cardLabel: 'KARTU TANDA PENDUDUK',
    cardNumber: '3273010101900001',
    holderName: 'Budi Santoso',
    status: 'valid',
    statusLabel: 'Valid',
    photoUrl: 'https://placehold.co/600x380/ECFDF5/12805C/png?text=KTP',
    rows: [
      { key: 'nik', label: 'NIK', value: '3273010101900001', mono: true },
      { key: 'name', label: 'Nama', value: 'Budi Santoso' },
      { key: 'birth', label: 'Tempat/Tgl Lahir', value: 'Bandung, 01 Jan 1990' },
      { key: 'address', label: 'Alamat', value: 'Jl. Soekarno Hatta No. 21, Bandung' },
      { key: 'religion', label: 'Agama', value: 'Islam' },
      { key: 'validity', label: 'Berlaku', value: 'Seumur Hidup', badge: true },
    ],
  },
  homolog: {
    key: 'homolog',
    title: 'Sertifikat Homologasi',
    subtitle: 'Sertifikat Homologasi Kendaraan — B 9123 KJU',
    updatedNote: 'Diperbarui 20 Mar 2025',
    cardLabel: 'SERTIFIKAT HOMOLOGASI',
    cardNumber: 'HM.01/2024/00123',
    holderName: 'PT GenZys Logistik',
    status: 'valid',
    statusLabel: 'Valid',
    photoUrl: 'https://placehold.co/600x380/F5F3FF/5B21B6/png?text=Homologasi',
    rows: [
      { key: 'number', label: 'Nomor Sertifikat', value: 'HM.01/2024/00123', mono: true },
      { key: 'vehicle', label: 'Nomor Rangka', value: 'MHFXW42G8N0123456', mono: true },
      { key: 'engine', label: 'Nomor Mesin', value: '2GD-8891234', mono: true },
      { key: 'type', label: 'Tipe Kendaraan', value: 'CDD Box — Light Truck' },
      { key: 'issued', label: 'Tanggal Terbit', value: '20 Mar 2024' },
      { key: 'status', label: 'Status', value: 'Valid', badge: true },
    ],
  },
  stnk: {
    key: 'stnk',
    title: 'STNK',
    subtitle: 'Surat Tanda Nomor Kendaraan — B 9123 KJU',
    updatedNote: 'Diperbarui 14 Feb 2026',
    cardLabel: 'SURAT TANDA NOMOR KENDARAAN',
    cardNumber: 'B 9123 KJU',
    holderName: 'PT GenZys Logistik',
    status: 'valid',
    statusLabel: 'Valid',
    photoUrl: 'https://placehold.co/600x380/EFF6FF/1B4DFF/png?text=STNK',
    rows: [
      { key: 'plate', label: 'Nomor Kendaraan', value: 'B 9123 KJU', mono: true },
      { key: 'owner', label: 'Pemilik', value: 'PT GenZys Logistik' },
      { key: 'vehicle', label: 'Nomor Rangka', value: 'MHFXW42G8N0123456', mono: true },
      { key: 'engine', label: 'Nomor Mesin', value: '2GD-8891234', mono: true },
      { key: 'type', label: 'Tipe Kendaraan', value: 'CDD Box — Light Truck' },
      { key: 'expiry', label: 'Berlaku Sampai', value: '14 Feb 2031' },
    ],
  },
  skck: {
    key: 'skck',
    title: 'SKCK',
    subtitle: 'Surat Keterangan Catatan Kepolisian',
    updatedNote: 'Diperbarui 02 Jun 2025',
    cardLabel: 'SURAT KETERANGAN CATATAN KEPOLISIAN',
    cardNumber: 'SKCK/2025/00456',
    holderName: 'Budi Santoso',
    status: 'expiring',
    statusLabel: 'Segera Habis',
    photoUrl: 'https://placehold.co/600x380/FEF3C7/92400E/png?text=SKCK',
    warning: {
      title: 'Masa berlaku hampir habis',
      body: 'Perpanjang SKCK sebelum tanggal berlaku berakhir agar penugasan tidak terhambat.',
    },
    rows: [
      { key: 'number', label: 'Nomor SKCK', value: 'SKCK/2025/00456', mono: true },
      { key: 'name', label: 'Nama', value: 'Budi Santoso' },
      { key: 'job', label: 'Pekerjaan', value: 'Pengemudi' },
      { key: 'issuer', label: 'Penerbit', value: 'Polres Jakarta Selatan' },
      { key: 'expiry', label: 'Berlaku Sampai', value: '02 Jun 2026' },
    ],
  },
  kir: {
    key: 'kir',
    title: 'KIR',
    subtitle: 'Kartu Uji Berkala Kendaraan — B 9123 KJU',
    updatedNote: 'Diperbarui 18 Apr 2026',
    cardLabel: 'KARTU UJI BERKALA (KIR)',
    cardNumber: 'KIR/2026/0012',
    holderName: 'PT GenZys Logistik',
    status: 'expiring',
    statusLabel: 'Segera Habis',
    photoUrl: 'https://placehold.co/600x380/FEF3C7/92400E/png?text=KIR',
    warning: {
      title: 'Jadwal uji ulang mendekat',
      body: 'Jadwalkan uji KIR ulang sebelum masa berlaku habis agar kendaraan tetap layak jalan.',
    },
    rows: [
      { key: 'number', label: 'Nomor Uji', value: 'KIR/2026/0012', mono: true },
      { key: 'plate', label: 'Nomor Kendaraan', value: 'B 9123 KJU', mono: true },
      { key: 'type', label: 'Jenis Kendaraan', value: 'Mobil Barang — CDD Box' },
      { key: 'tested', label: 'Tanggal Uji', value: '18 Apr 2026' },
      { key: 'expiry', label: 'Berlaku Sampai', value: '18 Okt 2026' },
      { key: 'result', label: 'Hasil Uji', value: 'Lulus', badge: true },
    ],
  },
  kendaraan: {
    key: 'kendaraan',
    title: 'Foto Kendaraan',
    subtitle: 'Foto unit CDD Box — B 9123 KJU',
    updatedNote: 'Diperbarui 05 Nov 2026',
    cardLabel: 'FOTO KENDARAAN',
    cardNumber: 'B 9123 KJU',
    holderName: 'PT GenZys Logistik',
    status: 'valid',
    statusLabel: 'Valid',
    photoUrl: 'https://placehold.co/600x380/EFF6FF/1B4DFF/png?text=Foto+Kendaraan',
    rows: [
      { key: 'plate', label: 'Nomor Polisi', value: 'B 9123 KJU', mono: true },
      { key: 'type', label: 'Tipe', value: 'CDD Box — Light Truck' },
      { key: 'color', label: 'Warna', value: 'Putih' },
      { key: 'year', label: 'Tahun', value: '2024' },
      { key: 'status', label: 'Status Unit', value: 'Aktif', badge: true },
    ],
  },
};

/** Dummy detail for `/documents/:key`; `undefined` for unknown keys. */
export function dummyDocumentDetail(key: string): DocumentDetail | undefined {
  return DUMMY_DOCUMENTS[key];
}
