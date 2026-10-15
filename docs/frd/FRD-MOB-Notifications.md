---
tags: [FRD, Mobile, Driver, Notification]
category: Mobile
related: [[PRD-MOB-Notifications]]
---

# FRD-MOB — Notifikasi Inbox

**Mirror**: FRD-M12-01 (Inbox), FRD-M12-05 (Preferences)
**BRD-Mobile**: MBR-009, MBR-030 · [BRD-Mobile.md](../BRD-Mobile.md)

## FRD-MOB-NOTIF-01 Inbox Agregat
Daftar notif read/unread + severity.
**AC**: Given notif masuk, When buka Inbox, Then tampil dengan status read/unread & severity (mirror FRD-M12-01).

## FRD-MOB-NOTIF-02 Push Real-time Critical
**AC**: Given notif Critical, When push, Then tampil < 2 detik + badge unread (mirror FRD-M12-01).

## FRD-MOB-NOTIF-03 Deep-link
**AC**: Given driver tap notif tugas, When dibuka, Then diarahkan ke layar trip terkait.

## FRD-MOB-NOTIF-04 Preferensi
**AC**: Given preferensi matikan tipe non-kritis, When kirim, Then tipe itu dilewati; Critical tetap masuk (mirror FRD-M12-05).

## Wording
- "Tidak ada notifikasi baru."
- "Semua notifikasi telah dibaca."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M12 | [prd/frd/FRD-M12-Notifications.md](../../../prd/frd/FRD-M12-Notifications.md) |
| PRD modul | [M12](../../../prd/PRD-M12-Notifications.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
