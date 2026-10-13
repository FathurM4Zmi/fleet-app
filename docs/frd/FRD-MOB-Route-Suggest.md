---
tags: [FRD, Mobile, Driver, Route]
category: Mobile
related: [[PRD-MOB-Route-Suggest]]
---

# FRD-MOB — Rute Disarankan (Route Suggest)

**Mirror**: FRD-M14-01 (Route Optimizer)

## FRD-MOB-RTE-01 Opsi Rute + ETA
Menampilkan 2–3 opsi rute (waktu, jarak, asumsi) untuk trip aktif.
**AC**: Given trip aktif punya saran rute, When buka layar, Then opsi rute + ETA + asumsi tampil (mirror FRD-M14-01).

## FRD-MOB-RTE-02 Konfirmasi Terapkan
Rute tidak diterapkan tanpa konfirmasi.
**AC**: Given driver tap "Terapkan Rute", When belum konfirmasi, Then rute tidak diterapkan.

## FRD-MOB-RTE-03 Asumsi Transparan
Menampilkan dasar saran (tidak over-ask).
**AC**: Given opsi rute tampil, When dibuka detail, Then catatan asumsi terlihat.

## FRD-MOB-RTE-04 Fallback Rule-based/Default
Jika optimizer OFF, tampilkan rute default dari M04.
**AC**: Given optimizer dimatikan, When buka layar, Then rute default trip ditampilkan sebagai fallback.

## FRD-MOB-RTE-05 ETA Real-time
ETA diperbarui saat posisi berubah (via M05).
**AC**: Given posisi berubah, When SignalR push, Then ETA ter-update tanpa refresh manual.

## Wording
- "Rute disarankan, belum diterapkan. Konfirmasi untuk menyimpan."
- "Belum ada rute disarankan untuk perjalanan ini."
