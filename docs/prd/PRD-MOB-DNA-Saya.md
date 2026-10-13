---
tags: [PRD, Mobile, Driver, DNA]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-DNA-Saya]] [[PRD-MOB-Coaching]] [[PRD-MOB-Performance]]
---

# PRD-MOB — DNA Kesehatan Saya (Driver DNA)

**[PRD-MOB-17]** - DNA Kesehatan Saya
**Modul Sumber**: M13 (Fleet DNA / Health Score Engine) · **Folder BE**: `HealthEngine`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 4
**FRD**: FRD-M13-04 (Driver DNA Detail), FRD-M13-02 (Fleet DNA Overview)

---

## Tujuan
Driver melihat **breakdown skor DNA miliknya** per sub-komponen beserta alasan penilaian, sehingga perbaikan terasa transparan dan bisa ditindaklanjuti lewat Coaching (M20).

## Komponen Layar
| Komponen | Isi |
|---|---|
| DNA Ring Besar | Skor komposit 0–100 + tren rolling 12 minggu |
| Breakdown Sub-Komponen | Mis. perilaku mengemudi, konsumsi, kepatuhan DVIR, ketepatan waktu |
| Penjelasan Skor | Alasan tiap komponen turun/naik |
| Tren | Grafik perubahan skor per periode |
| CTA | "Lihat Rencana Coaching" → M20 |

## Spesifikasi Fungsional
- Menampilkan **hanya** DNA driver sendiri (ownership, FRD-M01-06) — bukan overview armada (admin-only).
- Bobot sub-komponen mengikuti config OD-06 (bukan hardcode) — layar hanya menampilkan hasil.
- Skor ter-update real-time via SignalR saat recompute Hangfire selesai (FRD-M13-06).
- Jika skor turun melewati ambang, tampilkan banner penurunan + tautan ke Coaching.
- Read-only — driver tidak dapat mengubah skor.

## Acceptance Criteria
- Given driver membuka layar, When data dimuat, Then skor komposit + breakdown sub-komponen tampil (FRD-M13-04).
- Given skor berubah di server, When SignalR push, Then ring ter-update tanpa refresh manual.
- Given skor turun signifikan, When dibuka, Then banner "Skor kesehatan turun {n} poin" tampil.

## Wording (Microcopy)
- Skor turun: "Skor kesehatan turun {n} poin sejak periode lalu."
- Tanpa data: "Skor belum tersedia. Selesaikan beberapa trip terlebih dahulu."

## Non-Fungsional
- Render < 2 detik; grafik ringan.
- Tampilkan skor cache terakhir saat offline.

## Dependency
M13 (skor DNA), M18 (safety events), M05/M07 (telemetry & konsumsi), M20 (coaching).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M13 | [prd/PRD-M13-Fleet-DNA-Health-Engine.md](../../../prd/PRD-M13-Fleet-DNA-Health-Engine.md) |
| FRD modul M13 | [prd/frd/FRD-M13-Fleet-DNA-Health.md](../../../prd/frd/FRD-M13-Fleet-DNA-Health.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
