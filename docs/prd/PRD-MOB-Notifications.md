---
tags: [PRD, Mobile, Driver, Notification]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Notifications]]
---

# PRD-MOB — Notifikasi Inbox

**[PRD-MOB-09]** - Notifikasi Inbox
**Modul Sumber**: M12 (Notifications) · **Folder BE**: `Notifications`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 2
**FRD**: FRD-M12-01 (Inbox), FRD-M12-05 (Preferences)

---

## Tujuan
Driver melihat semua notifikasi terkait dirinya (tugas baru, coaching, reminder dokumen, status WO dari DVIR) dalam satu inbox, real-time.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Daftar Notif | read/unread, severity (Critical/Warning/Info), waktu |
| Filter | per tipe (Tugas, Coaching, Dokumen, Sistem) |
| Detail | tap → buka layar terkait (trip/DVIR/coaching) |
| Badge | jumlah unread di bottom nav |

## Spesifikasi Fungsional
- Inbox in-app agregat; tandai read saat dibuka (FRD-M12-01).
- Push real-time (SignalR/push) untuk notif Critical & tugas.
- Deep-link: tap notif → layar relevan (mis. notif WO → DVIR/trip).
- Preferensi per-tipe (notif Critical tidak bisa dimatikan) — FRD-M12-05.

## Acceptance Criteria
- Given notif Critical masuk, When push, Then tampil < 2 detik + badge unread (FRD-M12-01).
- Given driver tap notif tugas, When dibuka, Then diarahkan ke layar trip terkait.
- Given preferensi dimatikan untuk tipe non-kritis, When kirim, Then tipe itu dilewati; Critical tetap masuk (FRD-M12-05).

## Wording (Microcopy)
- Kosong: "Tidak ada notifikasi baru."
- Semua dibaca: "Semua notifikasi telah dibaca."

## Non-Fungsional
- Push permission diminta setelah login (bukan saat cold start).
- Offline: notif terakhir dari cache; push masuk saat online.

## Dependency
M12 (notifikasi), M04/M17/M20 (sumber event), SignalR/push.
