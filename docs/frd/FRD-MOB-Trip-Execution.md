---
tags: [FRD, Mobile, Driver, Trip]
category: Mobile
related: [[PRD-MOB-Trip-Execution]]
---

# FRD-MOB — Trip Execution

**Mirror**: FRD-M04-09 (Trip Execution), FRD-M04-06 (status workflow)

## FRD-MOB-TRIPEXEC-01 Transisi Status
Assigned → Started → Arrived → Completed; tiap transisi immutable + tercatat.
**AC**: Given trip Assigned, When driver tap Mulai, Then status Started + timestamp tercatat (mirror FRD-M04-06/09).

## FRD-MOB-TRIPEXEC-02 Selesikan → POD
**AC**: Given driver tap Selesaikan, When trip complete, Then diarahkan ke POD Capture & status Completed (mirror FRD-M04-06).

## FRD-MOB-TRIPEXEC-03 Lokasi Berkala
Posisi driver dikirim berkala (hemat baterai) untuk live map M05.
**AC**: Given trip Ongoing, When driver bergerak, Then posisi ter-update di live map dengan interval wajar.

## FRD-MOB-TRIPEXEC-04 Offline Transisi
**AC**: Given offline, When transisi status, Then tersimpan lokal & sync idempotent saat online.

## Wording
- "Mulai perjalanan?"
- "Selesaikan trip dan lanjut unggah bukti pengiriman."
