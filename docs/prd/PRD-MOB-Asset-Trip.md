---
tags: [PRD, Mobile, Driver, Asset]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Asset-Trip]] [[PRD-MOB-Trip-Execution]]
---

# PRD-MOB — Aset & Equipment Trip (Asset Trip)

**[PRD-MOB-22]** - Aset & Equipment Trip
**Modul Sumber**: M19 (Asset & Equipment Tracking) · **Folder BE**: `AssetEquipment`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 5
**FRD**: FRD-M19-01 (Asset List), FRD-M19-03 (Reefer / Cold-Chain), FRD-M19-06 (Asset Geofence)
**BRD-Mobile**: MBR-022 · [BRD-Mobile.md](../BRD-Mobile.md)

---

## Tujuan
Driver melihat **aset/equipment yang menempel pada trip-nya** (trailer, kontainer, reefer) — status, suhu cold-chain, dan peringatan pergerakan — tanpa akses ke registry aset penuh (admin-only).

## Komponen Layar
| Komponen | Isi |
|---|---|
| Aset Terpasang | Daftar aset pada trip aktif (asset-tag, kategori, status) |
| Panel Reefer | Suhu/kelembapan + status alarm (bila cold-chain) |
| Peringatan Aset | Pergerakan di luar zona (anti-theft) untuk aset trip |
| Detail Aset | Identitas ringkas + chain-of-custody (read-only) |

## Spesifikasi Fungsional
- Menampilkan **hanya** aset yang tertaut ke trip aktif driver (ownership, FRD-M01-06) — bukan asset list/registry penuh.
- Suhu reefer & posisi aset bersumber dari tracker (flag ON), reuse infra M05; bila flag OFF, tampilkan data manual/terakhir.
- Peringatan pergerakan tidak sah (FRD-M19-06) muncul real-time + push (M12).
- Chain-of-custody hanya-baca; perubahan status dilakukan di web admin.
- Utilisasi/biaya aset (M19-04) tidak ditampilkan di mobile (admin-only).

## Acceptance Criteria
- Given trip aktif punya aset terpasang, When buka layar, Then daftar aset + status tampil (FRD-M19-01).
- Given aset reefer melewati ambang suhu, When melewati threshold, Then alarm tampil di panel reefer (FRD-M19-03).
- Given aset bergerak di luar zona, When terdeteksi, Then peringatan anti-theft tampil (FRD-M19-06).

## Wording (Microcopy)
- Anti-theft: "Pergerakan aset di luar zona yang diizinkan terdeteksi."
- Tanpa aset: "Tidak ada aset pada perjalanan ini."

## Non-Fungsional
- Render < 2 detik; pembaruan suhu/posisi hemat baterai.
- Tampilkan nilai terakhir saat offline + penanda waktu update.

## Dependency
M04 (trip), M05 (posisi/telemetry), M19 (aset/reefer), M12 (notifikasi).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M19 | [prd/PRD-M19-Asset-Equipment-Tracking.md](../../../prd/PRD-M19-Asset-Equipment-Tracking.md) |
| FRD modul M19 | [prd/frd/FRD-M19-Asset-Equipment.md](../../../prd/frd/FRD-M19-Asset-Equipment.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
