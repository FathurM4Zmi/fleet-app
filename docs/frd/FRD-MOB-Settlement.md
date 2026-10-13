---
tags: [FRD, Mobile, Driver, Billing]
category: Mobile
related: [[PRD-MOB-Settlement]]
---

# FRD-MOB — Settlement & Pendapatan Saya (Settlement)

**Mirror**: FRD-M15-04 (Invoice / Settlement), FRD-M15-02 (Trip Costing), FRD-M01-07 (SoD)

## FRD-MOB-SET-01 Ringkasan Settlement
Total pendapatan/settlement + rincian per trip untuk periode terpilih.
**AC**: Given ada settlement periode ini, When buka layar, Then total + rincian per trip tampil (mirror FRD-M15-04).

## FRD-MOB-SET-02 Read-only & SoD
Driver hanya melihat; tidak membuat/menyetujui settlement.
**AC**: Given driver mencoba menyetujui, When aksi dilakukan, Then tidak tersedia (mirror FRD-M01-07).

## FRD-MOB-SET-03 Rate Card Kosong
Bila rate card kelas kendaraan belum ada, tampilkan pesan jelas.
**AC**: Given rate card belum ditetapkan, When dibuka, Then pesan "Rate card belum ditetapkan" tampil, bukan angka salah.

## FRD-MOB-SET-04 Status Settlement
Status Draft/Diajukan/Disetujui/Dibayar; update via notifikasi M12.
**AC**: Given status settlement berubah, When notifikasi M12 diterima, Then status terbaru tampil.

## FRD-MOB-SET-05 Riwayat Periode
Daftar settlement periode sebelumnya.
**AC**: Given ada riwayat, When dibuka, Then daftar settlement periode sebelumnya tampil.

## Wording
- "Pembuat tidak dapat menyetujui settlement-nya sendiri."
- "Rate card untuk kelas kendaraan ini belum ditetapkan."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M15 | [prd/frd/FRD-M15-Billing-RateCard.md](../../../prd/frd/FRD-M15-Billing-RateCard.md) |
| PRD modul | [M15](../../../prd/PRD-M15-Billing-Rate-Card.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
