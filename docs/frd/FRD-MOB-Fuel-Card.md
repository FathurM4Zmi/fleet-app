---
tags: [FRD, Mobile, Driver, Fuel]
category: Mobile
related: [[PRD-MOB-Fuel-Card]]
---

# FRD-MOB — Kartu BBM & Pengeluaran Saya (Fuel Card)

**Mirror**: FRD-M22-01 (Fuel Card Mgmt), FRD-M22-02 (Spend Transactions), FRD-M22-03 (Fraud Detection)
**BRD-Mobile**: MBR-023 · [BRD-Mobile.md](../BRD-Mobile.md)

## FRD-MOB-FCARD-01 Kartu Saya (Masked)
Nomor kartu (masked), limit, sisa kuota, status aktif.
**AC**: Given driver punya kartu BBM, When buka layar, Then kartu (masked) + limit + sisa kuota tampil (mirror FRD-M22-01).

## FRD-MOB-FCARD-02 Riwayat Transaksi
Daftar transaksi (tanggal, SPBU, volume, nominal, status rekonsiliasi).
**AC**: Given ada transaksi baru, When data dimuat, Then transaksi muncul dan tertaut ke entri Fuel Log terkait (mirror FRD-M22-02).

## FRD-MOB-FCARD-03 Tautan ke Fuel Log
Transaksi tertaut ke entri BBM (M07).
**AC**: Given transaksi direkonsiliasi, When dibuka, Then entri Fuel Log terkait dapat dilihat.

## FRD-MOB-FCARD-04 Penanda Fraud Read-only
Transaksi ditandai → label "menunggu tinjauan", tanpa opsi ubah.
**AC**: Given transaksi ditandai fraud, When dibuka, Then label "menunggu tinjauan" tampil tanpa opsi ubah (mirror FRD-M22-03).

## FRD-MOB-FCARD-05 Masking & Keamanan
Nomor kartu selalu masked; data finansial tidak cleartext.
**AC**: Given kartu ditampilkan, When dirender, Then hanya digit terakhir yang terlihat.

## FRD-MOB-FCARD-06 Batas Lingkup Mobile
Hanya kartu/transaksi driver sendiri; aktivasi/limit = admin-only.
**AC**: Given driver membuka layar, When data dimuat, Then hanya kartu miliknya yang tampil (mirror FRD-M01-06).

## Wording
- "Volume BBM harus lebih dari 0 liter."
- "Transaksi mencurigakan terdeteksi dan ditandai untuk ditinjau."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M22 | [prd/frd/FRD-M22-Fuel-Spend.md](../../../prd/frd/FRD-M22-Fuel-Spend.md) |
| PRD modul | [M22](../../../prd/PRD-M22-Fuel-Spend-Management.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
