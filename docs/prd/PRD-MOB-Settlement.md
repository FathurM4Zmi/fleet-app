---
tags: [PRD, Mobile, Driver, Billing]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Settlement]] [[PRD-MOB-Fuel-Log]]
---

# PRD-MOB — Settlement & Pendapatan Saya (Settlement)

**[PRD-MOB-19]** - Settlement & Pendapatan Saya
**Modul Sumber**: M15 (Billing, Rate Card & Cost Center) · **Folder BE**: `BillingCostCenter`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 3
**FRD**: FRD-M15-04 (Invoice / Settlement), FRD-M15-02 (Trip Costing)

---

## Tujuan
Driver melihat **rincian settlement/pendapatannya** per periode (trip, jarak, rate card) secara transparan — read-only, tanpa kemampuan membuat/menyetujui settlement (itu ranah admin, SoD).

## Komponen Layar
| Komponen | Isi |
|---|---|
| Kartu Periode | Total pendapatan/settlement periode terpilih |
| Rincian per Trip | Trip, jarak, tarif (rate card), subtotal |
| Status | Draft / Diajukan / Disetujui / Dibayar |
| Riwayat | Settlement periode sebelumnya |
| Unduh | Tautan lihat slip (web/PDF) |

## Spesifikasi Fungsional
- **Read-only** untuk driver: melihat hasil settlement, tidak membuat/mengubah/menyetujui (SoD, FRD-M01-07).
- Angka bersumber dari Trip Costing (M15) atas trip driver sendiri (ownership, FRD-M01-06).
- Tarif mengikuti Rate Card (OD-12); bila rate card belum ada untuk kelas kendaraan, tampilkan pesan jelas.
- Status settlement hanya diperbarui oleh alur approval admin — mobile tidak memicu approval.
- Notifikasi saat settlement disetujui/dibayar via M12.

## Acceptance Criteria
- Given ada settlement periode ini, When buka layar, Then total + rincian per trip tampil (FRD-M15-04).
- Given rate card kelas kendaraan belum ditetapkan, When dibuka, Then pesan "Rate card belum ditetapkan" tampil, bukan angka salah.
- Given driver mencoba menyetujui, When aksi dilakukan, Then tidak tersedia (read-only, SoD).

## Wording (Microcopy)
- SoD: "Pembuat tidak dapat menyetujui settlement-nya sendiri."
- Tarif kosong: "Rate card untuk kelas kendaraan ini belum ditetapkan."

## Non-Fungsional
- Render < 2 detik; mata uang & format lokal.
- Data finansial tidak disimpan cleartext di device.

## Dependency
M04 (trip), M07 (biaya BBM), M15 (costing/settlement), M12 (notifikasi status).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M15 | [prd/PRD-M15-Billing-Rate-Card.md](../../../prd/PRD-M15-Billing-Rate-Card.md) |
| FRD modul M15 | [prd/frd/FRD-M15-Billing-RateCard.md](../../../prd/frd/FRD-M15-Billing-RateCard.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
