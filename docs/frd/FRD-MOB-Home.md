---
tags: [FRD, Mobile, Driver, Home]
category: Mobile
related: [[PRD-MOB-Home]]
---

# FRD-MOB — Driver App Home

**Mirror**: FRD-M03-09 (Driver App Home), FRD-M04-08 (accept/decline)
**BRD-Mobile**: MBR-002 · [BRD-Mobile.md](../BRD-Mobile.md)

## FRD-MOB-HOME-01 Next Trip Card
Menampilkan trip berikutnya + aksi Accept/Decline 1-tap.
**AC**: Given ada trip ditugaskan, When buka Home, Then kartu Next Trip tampil dengan Accept/Decline (mirror FRD-M03-09).

## FRD-MOB-HOME-02 Decline Wajib Alasan
**AC**: Given driver tap Decline, When submit, Then form alasan wajib sebelum terkirim (mirror FRD-M04-08).

## FRD-MOB-HOME-03 DNA Ring Real-time
**AC**: Given skor DNA berubah di server, When SignalR push, Then ring ter-update tanpa refresh manual.

## FRD-MOB-HOME-04 Quick Action Kontekstual
**AC**: Given trip belum DVIR pre-trip, When buka Home, Then aksi DVIR muncul sebagai quick action utama.

## Wording
- "Belum ada tugas. Istirahatlah dulu."
- "Alasan penolakan wajib diisi."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M03 | [prd/frd/FRD-M03-Driver-Management.md](../../../prd/frd/FRD-M03-Driver-Management.md) |
| PRD modul | [M03](../../../prd/PRD-M03-Driver-Master.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
