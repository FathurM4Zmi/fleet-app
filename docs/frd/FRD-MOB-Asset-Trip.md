---
tags: [FRD, Mobile, Driver, Asset]
category: Mobile
related: [[PRD-MOB-Asset-Trip]]
---

# FRD-MOB — Aset & Equipment Trip (Asset Trip)

**Mirror**: FRD-M19-01 (Asset List), FRD-M19-03 (Reefer / Cold-Chain), FRD-M19-06 (Asset Geofence)

## FRD-MOB-AST-01 Aset Terpasang pada Trip
Daftar aset yang menempel pada trip aktif driver (asset-tag, kategori, status).
**AC**: Given trip aktif punya aset terpasang, When buka layar, Then daftar aset + status tampil (mirror FRD-M19-01).

## FRD-MOB-AST-02 Panel Reefer
Suhu/kelembapan + status alarm cold-chain.
**AC**: Given aset reefer melewati ambang suhu, When melewati threshold, Then alarm tampil di panel reefer (mirror FRD-M19-03).

## FRD-MOB-AST-03 Peringatan Anti-theft
Pergerakan aset di luar zona untuk aset trip.
**AC**: Given aset bergerak di luar zona, When terdeteksi, Then peringatan anti-theft tampil (mirror FRD-M19-06).

## FRD-MOB-AST-04 Chain-of-Custody Read-only
Status chain-of-custody hanya-baca di mobile.
**AC**: Given driver membuka detail aset, When data dimuat, Then chain-of-custody tampil read-only.

## FRD-MOB-AST-05 Batas Lingkup Mobile
Hanya aset trip driver; asset list/registry & utilisasi/biaya = admin-only.
**AC**: Given driver membuka layar, When data dimuat, Then hanya aset trip miliknya yang tampil (mirror FRD-M01-06).

## Wording
- "Pergerakan aset di luar zona yang diizinkan terdeteksi."
- "Tidak ada aset pada perjalanan ini."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M19 | [prd/frd/FRD-M19-Asset-Equipment.md](../../../prd/frd/FRD-M19-Asset-Equipment.md) |
| PRD modul | [M19](../../../prd/PRD-M19-Asset-Equipment-Tracking.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
