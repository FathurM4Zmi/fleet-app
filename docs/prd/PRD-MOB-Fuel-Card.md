---
tags: [PRD, Mobile, Driver, Fuel]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Fuel-Card]] [[PRD-MOB-Fuel-Log]]
---

# PRD-MOB — Kartu BBM & Pengeluaran Saya (Fuel Card)

**[PRD-MOB-23]** - Kartu BBM & Pengeluaran Saya
**Modul Sumber**: M22 (Fuel & Spend Management) · **Folder BE**: `FuelSpendMgmt`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 5
**FRD**: FRD-M22-01 (Fuel Card Mgmt), FRD-M22-02 (Spend Transactions)

---

## Tujuan
Driver melihat **kartu BBM miliknya** (limit, status) dan **riwayat transaksi pengisian** yang terhubung ke Fuel Log (M07) — transparan, mendukung pelaporan pengeluaran yang akurat.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Kartu Saya | Nomor kartu (masked), limit, sisa kuota, status aktif |
| Riwayat Transaksi | Daftar transaksi: tanggal, SPBU, volume, nominal, status rekonsiliasi |
| Tautan Fuel Log | Transaksi tertaut ke entri BBM (M07) |
| Penanda Fraud | Flag "menunggu tinjauan" bila transaksi ditandai (read-only) |
| Filter | Rentang tanggal |

## Spesifikasi Fungsional
- Menampilkan **hanya** kartu & transaksi milik driver sendiri (ownership, FRD-M01-06) — bukan manajemen kartu/limit (admin-only).
- Transaksi direkonsiliasi otomatis ke entri Fuel Log (M07); driver dapat melihat pasangan transaksi↔entri.
- Nomor kartu selalu **masked** (tidak pernah ditampilkan penuh) — keamanan.
- Transaksi yang ditandai fraud (FRD-M22-03) tampil sebagai "menunggu tinjauan"; driver tidak dapat mengubah status.
- Read-only: aktivasi/limit kartu dilakukan admin (FRD-M22-01).

## Acceptance Criteria
- Given driver punya kartu BBM, When buka layar, Then kartu (masked) + limit + sisa kuota tampil (FRD-M22-01).
- Given ada transaksi baru, When data dimuat, Then transaksi muncul dan tertaut ke entri Fuel Log terkait (FRD-M22-02).
- Given transaksi ditandai fraud, When dibuka, Then label "menunggu tinjauan" tampil tanpa opsi ubah (read-only).

## Wording (Microcopy)
- Volume invalid: "Volume BBM harus lebih dari 0 liter."
- Fraud: "Transaksi mencurigakan terdeteksi dan ditandai untuk ditinjau."

## Non-Fungsional
- Render < 2 detik; data finansial tidak disimpan cleartext.
- Mask nomor kartu konsisten di semua tampilan.

## Dependency
M07 (fuel log/rekonsiliasi), M15 (cost center), M22 (kartu/transaksi), M12 (notifikasi).
