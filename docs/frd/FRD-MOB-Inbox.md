---
tags: [FRD, Mobile, Driver, Trip]
category: Mobile
related: [[PRD-MOB-Inbox]]
---

# FRD-MOB — Driver Inbox

**Mirror**: FRD-M04-08 (Driver Inbox), FRD-M04-06 (status workflow)

## FRD-MOB-INBOX-01 Daftar Trip
Daftar trip ditugaskan; filter by status.
**AC**: Given beberapa trip, When buka Inbox, Then daftar tampil terfilter by status (Assigned/Ongoing/Completed).

## FRD-MOB-INBOX-02 Push Real-time
**AC**: Given trip baru ditugaskan, When SignalR push, Then badge & kartu muncul tanpa refresh (mirror FRD-M04-08).

## FRD-MOB-INBOX-03 Accept/Decline + Alasan
**AC**: Given driver decline, When submit, Then alasan wajib & tercatat di timeline trip (mirror FRD-M04-08).

## FRD-MOB-INBOX-04 Offline
**AC**: Given offline, When buka inbox, Then trip cache tampil; aksi accept/decline masuk antrian sync idempotent.

## Wording
- "Tugas diterima."
- "Alasan penolakan wajib diisi."
- "Belum ada tugas untuk Anda."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M04 | [prd/frd/FRD-M04-Trip-Assignment.md](../../../prd/frd/FRD-M04-Trip-Assignment.md) |
| PRD modul | [M04](../../../prd/PRD-M04-Assignment-Trip.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
