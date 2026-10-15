---
tags: [FRD, Mobile, Driver, DVIR]
category: Mobile
related: [[PRD-MOB-DVIR]]
---

# FRD-MOB — DVIR Form

**Mirror**: FRD-M17-02 (Driver DVIR Form), FRD-M17-03 (workflow), FRD-M17-07 (defect→WO)
**BRD-Mobile**: MBR-006 · [BRD-Mobile.md](../BRD-Mobile.md)

## FRD-MOB-DVIR-01 Checklist & Foto Defect
Checklist per template + foto defect untuk item gagal.
**AC**: Given driver mengisi checklist, When submit, Then item pass/fail + foto defect tersimpan (mirror FRD-M17-02).

## FRD-MOB-DVIR-02 Offline-safe
**AC**: Given tanpa sinyal, When submit, Then tersimpan lokal & sync saat online (mirror FRD-M17-02).

## FRD-MOB-DVIR-03 Fail → Block + WO
**AC**: Given supervisor fail, When review selesai, Then unit ter-block di M04 & WO otomatis di M08 (mirror FRD-M17-03/07).

## FRD-MOB-DVIR-04 Item Gagal Wajib Foto
**AC**: Given ada item fail, When submit tanpa foto, Then ditolak dengan permintaan foto.

## Wording
- "Tersimpan offline. Akan tersinkron saat online."
- "Foto kondisi wajib diunggah untuk item yang gagal."
- "Laporan DVIR terkirim untuk ditinjau."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M17 | [prd/frd/FRD-M17-DVIR-Inspection.md](../../../prd/frd/FRD-M17-DVIR-Inspection.md) |
| PRD modul | [M17](../../../prd/PRD-M17-DVIR-Inspection.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
