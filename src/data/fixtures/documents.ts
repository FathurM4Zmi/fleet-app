import type { DocumentDetail } from '../types';

/** Document detail pages opened from the profile hub and notifications. */
export const documentDetails: DocumentDetail[] = [
  {
    key: 'sim',
    title: 'SIM',
    subtitle: 'Dokumen Lisensi Driver',
    updatedNote: 'Diperbarui 12 Sep 2025',
    cardLabel: 'KARTU SIM PENGEMUDI',
    cardNumber: '1234-5678-9012-3456',
    holderName: 'Budi Santoso',
    status: 'expiring',
    statusLabel: 'Segera Habis',
    warning: {
      title: 'SIM akan kedaluwarsa dalam 21 hari',
      body: 'Kedaluwarsa pada 12 Nov 2026',
    },
    rows: [
      { key: 'no', label: 'Nomor SIM', value: '1234-5678-9012-3456', mono: true },
      { key: 'nama', label: 'Nama', value: 'Budi Santoso' },
      { key: 'golongan', label: 'Golongan', value: 'B1', badge: true },
      { key: 'penerbit', label: 'Penerbit', value: 'Polres Jakarta Utara' },
    ],
  },
  {
    key: 'ktp',
    title: 'KTP',
    subtitle: 'Kartu Tanda Penduduk',
    updatedNote: 'Diperbarui 04 Jan 2024',
    cardLabel: 'KARTU TANDA PENDUDUK',
    cardNumber: '3174-0812-9901-0007',
    holderName: 'Budi Santoso',
    status: 'valid',
    statusLabel: 'Valid',
    rows: [
      { key: 'nik', label: 'NIK', value: '3174-0812-9901-0007', mono: true },
      { key: 'nama', label: 'Nama', value: 'Budi Santoso' },
      { key: 'alamat', label: 'Alamat', value: 'Jl. Melati No. 12, Jakarta Utara' },
      { key: 'berlaku', label: 'Berlaku', value: 'Seumur hidup' },
    ],
  },
  {
    key: 'homolog',
    title: 'Sertifikat Homolog',
    subtitle: 'Sertifikasi Kompetensi Driver',
    updatedNote: 'Diperbarui 20 Feb 2025',
    cardLabel: 'SERTIFIKAT KOMPETENSI',
    cardNumber: 'HMG-2025-0417',
    holderName: 'Budi Santoso',
    status: 'valid',
    statusLabel: 'Valid',
    rows: [
      { key: 'no', label: 'Nomor Sertifikat', value: 'HMG-2025-0417', mono: true },
      { key: 'nama', label: 'Nama', value: 'Budi Santoso' },
      { key: 'kelas', label: 'Kelas', value: 'Angkutan Barang', badge: true },
      { key: 'penerbit', label: 'Penerbit', value: 'Kemenhub RI' },
    ],
  },
];

export const documentDetailByKey = (key: string): DocumentDetail | undefined =>
  documentDetails.find((document) => document.key === key);
