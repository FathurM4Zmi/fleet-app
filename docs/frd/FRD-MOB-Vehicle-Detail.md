---
tags: [FRD, Mobile, Driver, Vehicle]
category: Mobile
related: [[PRD-MOB-Vehicle-Detail]]
---

# FRD-MOB — Kendaraan Saya (Vehicle Detail)

**Mirror**: FRD-M02-02 (Vehicle Detail), FRD-M02-06 (Vehicle Documents), FRD-M02-09 (Vehicle Health & DNA)

## FRD-MOB-VEH-01 Detail Kendaraan Ditugaskan
Menampilkan identitas, spesifikasi, dan status kendaraan yang sedang/akan ditugaskan ke driver.
**AC**: Given driver punya trip aktif, When buka Kendaraan Saya, Then detail kendaraan yang ditugaskan tampil lengkap (mirror FRD-M02-02).

## FRD-MOB-VEH-02 Dokumen & Expiry Badge
Menampilkan STNK/KIR/insurans + badge expiry (amber < 30 hari, merah expired).
**AC**: Given dokumen hampir expired, When buka layar, Then badge amber tampil pada dokumen terkait (mirror FRD-M02-06).

## FRD-MOB-VEH-03 DNA Ring Real-time
Skor kesehatan kendaraan 0–100, ter-update via SignalR.
**AC**: Given skor DNA kendaraan berubah di server, When SignalR push, Then ring ter-update tanpa refresh manual (mirror FRD-M02-09).

## FRD-MOB-VEH-04 Ownership Scope
Driver hanya melihat kendaraan miliknya (site+user scope).
**AC**: Given driver membuka layar, When data dimuat, Then hanya kendaraan yang ditugaskan ke dirinya yang tampil (mirror FRD-M01-06).

## FRD-MOB-VEH-05 CTA Lapor Kerusakan
Tombol menuju Defect Report (M08).
**AC**: Given driver tap "Laporkan Kerusakan", When aksi dilakukan, Then layar Defect Report terbuka dengan kendaraan terisi otomatis.

## Wording
- "Belum ada kendaraan yang ditugaskan."
- "Kendaraan ini tidak tersedia untuk ditugaskan."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M02 | [prd/frd/FRD-M02-Vehicle-Master.md](../../../prd/frd/FRD-M02-Vehicle-Master.md) |
| PRD modul | [M02](../../../prd/PRD-M02-Vehicle-Master.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
