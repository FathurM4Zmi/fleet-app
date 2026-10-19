# Manifest Desain Stitch — GenZys FleetOps Driver

> Sumber: `docs/QUICK-REFERENCE.md` (23 layar driver-facing).
> Stitch project: `10337307985651430571` — https://stitch.withgoogle.com/project/10337307985651430571
> Design system: `GenZys FleetOps Driver` (asset `3410050116658867246`)
>
> **Status singkatan:** ✅ final · 🔄 perlu review · 🗑️ hapus (duplikat/obsolete)

## Peta layar → PRD

| # | Layar | Modul | Status | Nama screen di Stitch | Ukuran |
|---|---|---|---|---|---|
| 1 | Login Driver | M01 | ✅ | `Login Driver` | 1768 |
| 1a | Verifikasi OTP | M01 | ✅ | `Verifikasi OTP Driver` | 1768 |
| 1b | Pindai QR | M01 | ✅ | `Pindai QR - Otentikasi Driver` | 1768 |
| 1c | Lupa PIN | M01 | ✅ | `Lupa PIN - Atur Ulang PIN (Mobile)` | 1768 |
| 2 | Beranda | M03 | ✅ | `Beranda Driver App` | 1768 |
| 3 | Inbox | M04 | ✅ | `Inbox Driver - Daftar Trip` | 2818 |
| 3a | Detail Trip | M04 | ✅ | `Detail Trip - Gudang Cikarang Barat` | 2234 |
| 3b | Tolak Tugas (sheet) | M04 | ✅ | `Tolak Tugas - Konfirmasi Penolakan` | 1768 |
| 3c | Trip Execution | M04 | ✅ | `Trip Aktif - Trip Execution` | 2022 |
| 4 | DVIR Pre-Trip | M17 | ✅ | `DVIR Form - Inspeksi Kendaraan (Mobile)` | 2302 |
| 5 | DVIR Post-Trip | M17 | ✅ | `DVIR Form - Inspeksi Pasca Perjalanan (Post-Trip)` | 1768 |
| 6 | Kirim Laporan Pre-Trip | M17 | ✅ | `Kirim Laporan Pre-Trip - Konfirmasi Gagal (Mobile)` | 1768 |
| 7 | Kirim Laporan Post-Trip | M17 | ✅ | `Kirim Laporan Post-Trip - Konfirmasi Sukses (Mobile)` | 1768 |
| 8 | Laporan Terkirim (gagal) | M17 | ✅ | `Laporan DVIR Terkirim - Konfirmasi Gagal` | 2760 |
| 9 | Laporan Terkirim (sukses) | M17 | ✅ | `Laporan DVIR Terkirim - Sukses Post-Trip (Mobile Portrait)` | 2258 |
| 10 | POD Capture | M21 | ✅ | `POD Capture - Bukti Pengiriman` | 1768 |
| 11 | POD Sukses | M21 | ✅ | `Bukti Pengiriman Tersimpan - Sukses POD` | 2520 |
| 12 | Fuel Log | M07 | ✅ | `Catat BBM - Fuel Log` | 2478 |
| 13 | Koreksi Odometer (sheet) | M07 | 🔄 | `Ajukan Koreksi Odometer` | 1768 ×2 |
| 14 | Koreksi Diajukan | M07 | ✅ | `Koreksi Diajukan - Odometer Berhasil Diajukan` | 1768 |
| 15 | Notifikasi | M12 | ✅ | `Notifikasi Driver - Kotak Masuk (Portrait)` | 1768 |
| 16 | Detail Notifikasi Kritis | M12 | ✅ | `Detail Notifikasi Kritis - Unit Dinonaktifkan (Mobile)` | 1768 |
| 17 | Mode Offline | — | ✅ | `Mode Offline - Tugas Saya (Mobile)` | 2482 |
| 18 | Coaching | M20 | ✅ | `Coaching & Sertifikasi Saya (Mobile)` | 2464 |
| 19 | Perbarui Progres Coaching | M20 | ✅ | `Perbarui Progres Coaching` | 1768 |
| 20 | Profil (hub) | M03 | ✅ | `Profil Driver` | 1768 |
| 21 | Detail Dokumen | M09 | 🔄 | `Detail Dokumen - SIM Driver` | 1768 / 1922 |
| 22 | Kendaraan Saya | M02 | ✅ | `Kendaraan Saya - Detail Unit Isuzu Traga` | 1768 |
| 23 | Rute & Posisi Trip | M05 | ✅ | `Rute & Posisi Trip (Mobile)` | 1768 |
| 24 | Peringatan Trip | M06 | ✅ | `Peringatan Trip (Mobile Portrait)` | 1840 |
| 25 | Laporan Kerusakan | M08 | ✅ | `Laporan Kerusakan - Laporkan Defect Armada (Mobile)` | 1830 |
| 26 | Ringkasan Kinerja | M10 | ✅ | `Ringkasan Kinerja Saya (Detail View)` | 2010 |
| 27 | Aktivitas Saya | M11 | ✅ | `Aktivitas Saya - Jejak Aksi Driver (Portrait)` | 1768 |
| 28 | DNA Kesehatan Saya | M13 | ✅ | `DNA Kesehatan Saya` | 2380 |
| 29 | Rute Disarankan | M14 | ✅ | `Pilih Rute - Rute Disarankan (Mobile)` | 2326 |
| 30 | Settlement | M15 | ✅ | `Settlement & Pendapatan Saya (Mobile)` | 1768 |
| 31 | Kepatuhan & Sertifikasi | M16 | ✅ | `Kepatuhan & Sertifikasi Saya (Mobile Portrait)` | 2206 |
| 32 | Peristiwa Safety | M18 | ✅ | `Peristiwa Safety Saya (Mobile)` | 2038 |
| 33 | Aset & Equipment | M19 | ✅ | `Aset & Equipment Trip (Mobile)` | 2472 |
| 34 | Kartu BBM | M22 | ✅ | `Kartu BBM & Pengeluaran Saya` | 2234 |

## Navigasi (wajib seragam di 4 tab)

```
Home  ·  Inbox  ·  [ + ]  ·  Notifikasi  ·  Profil
```

Empat layar tab: `Beranda Driver App`, `Inbox Driver - Daftar Trip`,
`Notifikasi Driver - Kotak Masuk (Portrait)`, `Profil Driver`.

Profil adalah **hub** — fitur Kinerja, DNA, Coaching, Kepatuhan, Aktivitas, Settlement
dibuka dari dalam Profil, bukan sebagai slot navbar.

Layar lain (M02/M05/M06/M08/M10/M11/M13/M14/M16/M18/M19/M22) diakses kontekstual
dari Home / Trip / Profil, memakai **back arrow tanpa bottom nav**.

## 🗑️ Hapus dari Stitch

### Obsolete — digantikan versi baru
| Screen | Alasan |
|---|---|
| `Driver App Home` | → `Beranda Driver App` |
| `Driver Inbox` | → `Inbox Driver - Daftar Trip` |
| `Notifikasi Driver` | → `Notifikasi Driver - Kotak Masuk (Portrait)` |
| `Notifikasi Driver - Kotak Masuk` | → versi `(Portrait)` |
| `Profil & Dokumen Saya` | → `Profil Driver` (sekarang hub fitur) |
| `Peringatan Trip (Mobile)` | → `(Mobile Portrait)` 1840 |
| `Ringkasan Kinerja Saya` ×2 | → `(Detail View)` 2010 |
| `Aktivitas Saya - Jejak Aksi Driver` | → versi `(Portrait)` |
| `Kepatuhan & Sertifikasi Saya (Mobile)` 1768 | → `(Mobile Portrait)` 2206 |
| `Aset & Equipment Trip (Mobile Portrait)` | → `(Mobile)` 2472 |

### Landscape — render gagal (13 screen @2560px)
`Coaching & Sertifikasi Saya`, `Coaching ... - Mobile Portrait`,
`Detail Notifikasi Kritis`, `DVIR Form` ×2, `Kirim Laporan Pre-Trip`,
`Kirim Laporan Post-Trip`, `Laporan DVIR Terkirim - Sukses Post-Trip`,
`Mode Offline - Tugas Saya`, `POD Capture`, `Profil & Dokumen Saya`,
`Trip Execution`

Semua punya pasangan portrait — tidak ada yang perlu disimpan.

### Lainnya
- `Generating Screen...` — artefak generate yang gagal
- 2 foto stok (1024×1024) — bukan screen