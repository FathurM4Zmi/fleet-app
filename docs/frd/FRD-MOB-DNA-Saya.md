---
tags: [FRD, Mobile, Driver, DNA]
category: Mobile
related: [[PRD-MOB-DNA-Saya]]
---

# FRD-MOB — DNA Kesehatan Saya (Driver DNA)

**Mirror**: FRD-M13-04 (Driver DNA Detail), FRD-M13-02 (Fleet DNA Overview), FRD-M13-06 (Score Recompute)

## FRD-MOB-DNA-01 Skor Komposit & Breakdown
DNA ring driver + breakdown sub-komponen dengan alasan.
**AC**: Given driver membuka layar, When data dimuat, Then skor komposit + breakdown sub-komponen tampil (mirror FRD-M13-04).

## FRD-MOB-DNA-02 Update Real-time
Skor ter-update via SignalR setelah recompute Hangfire.
**AC**: Given skor berubah di server, When SignalR push, Then ring ter-update tanpa refresh manual (mirror FRD-M13-06).

## FRD-MOB-DNA-03 Banner Penurunan
Bila skor turun melewati ambang, tampilkan banner + tautan Coaching.
**AC**: Given skor turun signifikan, When dibuka, Then banner "Skor kesehatan turun {n} poin" tampil.

## FRD-MOB-DNA-04 Tren Rolling
Grafik perubahan skor per periode (rolling).
**AC**: Given ada data historis, When dibuka, Then tren skor tampil.

## FRD-MOB-DNA-05 Batas Lingkup Mobile
Hanya DNA driver sendiri; bobot config (OD-06) & overview armada = admin-only.
**AC**: Given driver membuka layar, When data dimuat, Then hanya DNA miliknya yang tampil (mirror FRD-M01-06).

## Wording
- "Skor kesehatan turun {n} poin sejak periode lalu."
- "Skor belum tersedia. Selesaikan beberapa trip terlebih dahulu."
