---
tags: [PRD, Mobile, Driver, DVIR]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-DVIR]]
---

# PRD-MOB — DVIR Form (Pre/Post-Trip)

**[PRD-MOB-06]** - DVIR Form
**Modul Sumber**: M17 (DVIR & Daily Inspection) · **Folder BE**: `DvirInspection`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 2
**FRD**: FRD-M17-02 (Driver DVIR Form), FRD-M17-03 (Workflow), FRD-M17-07 (Defect→WO)

---

## Tujuan
Driver mengisi inspeksi pre/post-trip lewat checklist template + foto defect, **offline-safe**. Fail → unit diblokir dari assignment (M04) sampai repair.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Tipe Inspeksi | Pre-Trip / Post-Trip (pilih) |
| Checklist | Item per template (pass/fail/tidak berlaku) |
| Foto Defect | Kamera/galeri per item gagal |
| Odometer | Input odometer saat inspeksi |
| Submit | Tombol besar; indikator offline |

## Spesifikasi Fungsional
- Checklist dari template per vehicle-class (FRD-M17-04).
- Item fail → wajib foto defect + catatan.
- **Offline-safe**: form tersimpan lokal, sync saat online (idempotent).
- Submit → status Submitted → review supervisor (FRD-M17-03).
- Fail → auto-WO di M08 (FRD-M17-07) — driver melihat notifikasi tindak lanjut.

## Acceptance Criteria
- Given driver mengisi checklist, When submit tanpa sinyal, Then tersimpan lokal & sync saat online (FRD-M17-02).
- Given ada item fail + foto, When submit, Then DVIR Submitted & (bila supervisor fail) unit ter-block di M04 (FRD-M17-03).
- Given defect, When supervisor fail, Then WO otomatis dibuat di M08 & driver dapat notifikasi (FRD-M17-07).

## Wording (Microcopy)
- Offline: "Tersimpan offline. Akan tersinkron saat online."
- Item gagal: "Foto kondisi wajib diunggah untuk item yang gagal."
- Terkirim: "Laporan DVIR terkirim untuk ditinjau."

## Non-Fungsional
- Foto dikompresi sebelum sync (hemat data).
- Form tahan proses app di-kill (persist draft).

## Dependency
M17 (DVIR), M08 (auto-WO), M04 (block assignment), M02 (kendaraan).
