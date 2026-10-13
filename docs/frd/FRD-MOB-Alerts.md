---
tags: [FRD, Mobile, Driver, Alert]
category: Mobile
related: [[PRD-MOB-Alerts]]
---

# FRD-MOB — Peringatan Trip (Alerts)

**Mirror**: FRD-M06-01 (Unified Command Feed), FRD-M06-04 (Geofence Breach), FRD-M06-06 (Exception Resolution)

## FRD-MOB-ALT-01 Feed Peringatan Trip
Daftar peringatan yang tertaut ke trip driver, urut severity + SLA countdown.
**AC**: Given peringatan baru untuk trip driver, When SignalR push, Then item muncul di atas daftar dengan badge severity (mirror FRD-M06-01).

## FRD-MOB-ALT-02 Geofence Breach Saya
Deteksi keluar zona rute saat trip berjalan.
**AC**: Given kendaraan keluar zona, When terdeteksi, Then peringatan geofence tampil (mirror FRD-M06-04).

## FRD-MOB-ALT-03 Resolusi Wajib Alasan
Tandai ditangani / beri alasan wajib sebelum submit.
**AC**: Given driver tap "Beri Alasan", When submit tanpa alasan, Then ditolak (mirror FRD-M06-06).

## FRD-MOB-ALT-04 Immutable & Audit
Resolusi/override masuk audit immutable.
**AC**: Given peringatan di-resolve, When dicek di audit, Then entri tercatat immutable (mirror BRL-028).

## FRD-MOB-ALT-05 Push Critical
Severity Critical → push notifikasi (M12) walau app background.
**AC**: Given severity=Critical, When alert masuk, Then push terkirim dan item tampil di atas feed.

## Wording
- "Alasan override wajib diisi."
- "Anda keluar dari zona rute yang ditentukan."
