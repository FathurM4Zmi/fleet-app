# Dokumentasi Mobile — GenZys FleetOps Driver App (`fleet-app`)

Dokumentasi aplikasi mobile driver (Flutter). Semua layar mobile ditarik dari modul
otoritatif `MODULE-MAP-v2.md` (M01–M22) dan selaras dengan `FRD.md` + folder BE.

## Struktur
```
fleet-app/docs/
├── BRD-Mobile.md                 # BRD turunan (refer BRD induk)
├── prd/
│   ├── PRD-Mobile-Driver-App.md  # PRD INDUK (screen inventory + prinsip)
│   ├── PRD-MOB-Login-Driver.md   # M01
│   ├── PRD-MOB-Home.md           # M03
│   ├── PRD-MOB-Profile.md        # M03 + M09
│   ├── PRD-MOB-Inbox.md          # M04
│   ├── PRD-MOB-Trip-Execution.md # M04
│   ├── PRD-MOB-DVIR.md           # M17
│   ├── PRD-MOB-POD.md            # M21
│   ├── PRD-MOB-Fuel-Log.md       # M07
│   ├── PRD-MOB-Notifications.md  # M12
│   └── PRD-MOB-Coaching.md       # M20
└── frd/
    ├── FRD-MOB-Login-Driver.md
    ├── FRD-MOB-Home.md
    ├── FRD-MOB-Profile.md
    ├── FRD-MOB-Inbox.md
    ├── FRD-MOB-Trip-Execution.md
    ├── FRD-MOB-DVIR.md
    ├── FRD-MOB-POD.md
    ├── FRD-MOB-Fuel-Log.md
    ├── FRD-MOB-Notifications.md
    └── FRD-MOB-Coaching.md
```

## Statistik
- **PRD**: 11 (1 induk + 10 layar)
- **FRD**: 10 (per layar)
- **Layar mobile**: 10 (driver-facing)
- **Platform**: Flutter (Android prioritas, iOS target berikutnya)

## Layar → Modul Sumber → Folder BE
| Layar | Modul | Folder BE |
|---|---|---|
| Login Driver | M01 | `AccessOrganization` |
| Driver App Home | M03 | `DriverMaster` |
| Profil & Dokumen | M03+M09 | `DriverMaster`/`DocumentCompliance` |
| Driver Inbox | M04 | `AssignmentTrip` |
| Trip Execution | M04 | `AssignmentTrip` |
| DVIR Form | M17 | `DvirInspection` |
| POD Capture | M21 | `CustomerExperiencePOD` |
| Fuel Log | M07 | `FuelCost` |
| Notifikasi | M12 | `Notifications` |
| Coaching | M20 | `CoachingWorkforce` |

## Catatan
- Jumlah PRD menyesuaikan **layar nyata** (tidak dipaksakan jadi 50 demi angka).
- BRD induk (keseluruhan sistem) tetap di `prd/BRD_...docx`; `BRD-Mobile.md` adalah turunan.
- Offline-first wajib untuk DVIR, POD, Fuel Log (R-MOB-01).
