---
tags: [PRD, Mobile, Driver, Route]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Route-Suggest]] [[PRD-MOB-Trip-Tracking]]
---

# PRD-MOB — Rute Disarankan (Route Suggest)

**[PRD-MOB-18]** - Rute Disarankan
**Modul Sumber**: M14 (Route Optimization & Dispatch Intelligence) · **Folder BE**: `RouteOptimizer`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 4
**FRD**: FRD-M14-01 (Route Optimizer)

---

## Tujuan
Driver melihat **rute & ETA yang disarankan** untuk trip-nya (multi-opsi ringkas), bisa menerima atau memilih alternatif — hasil dispatch intelligence yang disederhanakan untuk layar kecil.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Kartu Rute | 2–3 opsi: estimasi waktu, jarak, catatan asumsi |
| Peta Ringkas | Pratinjau rute terpilih |
| CTA | "Terapkan Rute" (konfirmasi sebelum simpan) |
| Catatan Asumsi | Penjelasan dasar saran (tidak over-ask) |

## Spesifikasi Fungsional
- Menampilkan rute untuk **trip aktif driver** saja; saran dispatch ke armada penuh = out-of-scope mobile.
- **Konfirmasi wajib** sebelum menerapkan rute ("Rute disarankan, belum diterapkan") — FRD-M14-01.
- Fase 1 rule-based (urutan geofence + jarak); solver lanjutan di balik `IRouteSolver` (Phase 2) — layar tidak berubah.
- ETA diperbarui saat posisi berubah (via M05).
- Bila optimizer flag OFF, layar menampilkan rute default dari M04 (fallback aman).

## Acceptance Criteria
- Given trip aktif punya saran rute, When buka layar, Then opsi rute + ETA + asumsi tampil (FRD-M14-01).
- Given driver tap "Terapkan Rute", When belum konfirmasi, Then rute tidak diterapkan (butuh konfirmasi).
- Given optimizer dimatikan, When buka layar, Then rute default trip ditampilkan sebagai fallback.

## Wording (Microcopy)
- Konfirmasi: "Rute disarankan, belum diterapkan. Konfirmasi untuk menyimpan."
- Tanpa saran: "Belum ada rute disarankan untuk perjalanan ini."

## Non-Fungsional
- Render < 2 detik; peta ringan & ter-cache.
- Aman offline: tampilkan rute terakhir yang tersimpan.

## Dependency
M04 (trip), M05 (posisi/ETA), M06 (geofence urutan), M14 (optimizer).
