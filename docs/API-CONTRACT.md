# Kontrak API Mobile — GenZys FleetOps Driver App

Dokumen ini adalah **sumber tunggal** pemetaan layar `fleet-app` (React Native / Expo)
ke endpoint backend. Setiap baris sudah diverifikasi terhadap controller di
`GenZysFleetOps-be/src/GenZysFleetOps.Api/Controllers/`.

- Base URL: `{API}/api/driver`
- Auth: `Authorization: Bearer <JWT>` — klaim `driver_id` adalah **satu-satunya**
  sumber kepemilikan data. `driverId` tidak pernah dikirim di body/query.
- Permission: `driver-app.read` (GET) dan `driver-app.write` (POST/PUT).
  Role `Driver` tidak memiliki `trips.write`, `pod.write`, atau `dvir.write`.
- Semua waktu ISO-8601 UTC (`2026-10-19T04:25:13Z`).
- Error: `400` validasi, `401` sesi bukan driver, `403` data bukan milik driver,
  `404` objek tidak ada **atau** bukan milik driver (anti-enumerasi), `409` konflik state.

---

## 1. Login Driver (M01)

| Aksi | Endpoint | Body |
|---|---|---|
| Login PIN | `POST /auth/login/pin` | `{ identifier, pin }` |
| Minta OTP | `POST /auth/otp/request` | `{ identifier }` → `202`, `devCode` hanya di Development |
| Verifikasi OTP | `POST /auth/otp/verify` | `{ identifier, code }` |
| Login QR | `POST /auth/qr` | `{ token }` (token 10 menit) |
| Ganti PIN | `POST /auth/pin/change` | `{ currentPin, newPin }` |

Aturan: PIN 6 digit, 5 percobaan gagal → lock 15 menit; OTP 5 menit, maks 5 percobaan;
identifier ambigu (telepon dipakai >1 driver) ditolak.

## 2. Beranda & Profil (M03)

| Layar | Endpoint | Isi |
|---|---|---|
| Home | `GET /home` | profil, 5 trip terdekat, unread, DVIR pending, task terbuka |
| Profil | `GET /me` | nama, NIK, site, SIM, status, masa berlaku |
| Ubah kontak | `PUT /me` `{ name, phone }` | hanya nama & nomor HP; `driverId` dari klaim token |
| Dokumen | `GET /documents` | daftar dokumen driver + status valid/expiring/expired |
| Detail dokumen | `GET /documents/{id}` | baris detail + status |

## 3. Trip (M04)

| Layar | Endpoint |
|---|---|
| Inbox / daftar trip | `GET /trips?status=&from=&to=&take=` |
| Detail trip | `GET /trips/{id}` |
| Terima | `POST /trips/{id}/accept` |
| Tolak (alasan wajib) | `POST /trips/{id}/decline` `{ reason }` |
| Mulai | `POST /trips/{id}/start` |
| Selesai | `POST /trips/{id}/complete` `{ actualDistanceKm? }` |

`GET /trips/{id}` mengembalikan detail perjalanan lengkap (`tripCode`, `origin`,
`destination`, `shipper`, `cargo`, `weightKg`, `recipientName`, `instruction`,
`preTripDone`, `postTripDone`).

## 4. Rute, Posisi, Peringatan (M05/M06/M14)

| Layar | Endpoint |
|---|---|
| Peta & posisi | `GET /trips/{id}/tracking` — posisi terakhir + jejak 6 jam, `isLive` ≤ 10 menit |
| Rute disarankan | `GET /trips/{id}/routes` |
| Pilih rute | `POST /trips/{id}/routes/{routeId}/select` |
| Peringatan trip | `GET /trips/{id}/warnings` — aktif + riwayat, SLA |

## 5. DVIR (M17)

| Aksi | Endpoint |
|---|---|
| Antrean hari ini | `GET /dvir/queue` |
| Riwayat | `GET /dvir?vehicleId=&take=` |
| Submit | `POST /dvir` |

Body submit:
```json
{
  "vehicleId": "…",
  "inspectionType": "PreTrip",
  "odometerKm": 15000,
  "passed": false,
  "defectNotes": "Lampu rem kanan mati",
  "photoPaths": ["dvir/2026/10/19/lampu.jpg"],
  "checklistJson": "[{\"key\":\"lampu\",\"group\":\"Kelistrikan\",\"result\":\"fail\"}]"
}
```
Aturan: 1 tipe inspeksi per kendaraan per driver per hari (409 bila ulang); maks 5 foto;
gagal → unit `OutOfService` (BRL-004).

## 6. POD (M21)

| Aksi | Endpoint |
|---|---|
| Task pengiriman | `GET /tasks?tripId=&status=&take=` |
| Mulai antar | `POST /tasks/{id}/start` |
| Kirim POD | `POST /tasks/{id}/pod` |
| Gagal antar | `POST /tasks/{id}/fail` `{ reason }` |

Body POD: `{ photoPath?, signaturePath?, notes?, latitude, longitude, capturedAt }` —
minimal satu bukti (foto/tanda tangan/catatan), geo + waktu wajib.
`tripId` dipakai mobile untuk mencari task milik trip yang sedang dibuka.

## 6a. Unggah bukti (foto/signature)

| Aksi | Endpoint |
|---|---|
| Unggah satu file | `POST /uploads` (multipart, field `file`) |

Maks 10 MB, hanya `image/*`. Respons `{ path, url }`; `path` inilah yang dikirim
sebagai `photoPaths` / `receiptPath` / `signaturePath`. File disimpan di
`wwwroot/uploads/driver/yyyy/MM/dd/`. Semua layar yang butuh foto (DVIR, POD, BBM,
damage, insiden) memakai endpoint ini lebih dulu.

## 7. BBM & Kartu (M07/M22)

| Layar | Endpoint |
|---|---|
| Log BBM | `GET /fuel?take=` |
| Catat BBM | `POST /fuel` |
| Kartu BBM | `GET /fuel-card` (null bila tidak ada) |
| Transaksi kartu | `GET /fuel-card/transactions?take=` |

Body catat BBM: `{ vehicleId, liters, amount, odometerKm, station, receiptPath, tripId?, notes? }`.
`receiptPath` **wajib**; kendaraan harus pernah ditugaskan ke driver (403 bila bukan).

## 8. Notifikasi (M12)

| Aksi | Endpoint |
|---|---|
| Daftar | `GET /notifications?isRead=&page=&pageSize=` |
| Tandai dibaca | `POST /notifications/{id}/read` |

## 9. Coaching, Kinerja, Aktivitas, DNA (M20/M10/M11/M13)

| Layar | Endpoint | Sumber data |
|---|---|---|
| Coaching | `GET /coaching` | `coaching_plans` |
| Update progres | `POST /coaching/{planId}/progress` `{ status: "InProgress"\|"Completed" }` | |
| Kinerja | `GET /performance` | trip, DVIR, safety event, insiden 30 hari |
| Aktivitas | `GET /activity?days=&take=` | `audit_logs` (user_id driver) |
| DNA | `GET /dna` | 12 minggu: OTP 35%, safety 30%, inspeksi 20%, kepatuhan 15% |

Tidak ada angka statis: skor 0 bila belum ada data.

## 10. Kerusakan, Safety, Kepatuhan (M08/M18/M16)

| Layar | Endpoint |
|---|---|
| Lapor kerusakan | `POST /damage` |
| Riwayat kerusakan | `GET /damage` |
| Safety event | `GET /safety?days=&take=` |
| Checklist kepatuhan | `GET /compliance` |
| Lapor insiden | `POST /incidents` |

`POST /damage` → membuat work order `Corrective` (M08) dengan `reported_by_driver_id`;
foto wajib. `POST /incidents` → `incidents` dengan lokasi, kronologi, foto (wajib ≥1).

## 11. Kendaraan & Aset (M02/M19)

| Layar | Endpoint |
|---|---|
| Kendaraan saya | `GET /vehicle` |
| Dokumen kendaraan | `GET /vehicle/documents?vehicleId=` |
| Ajukan koreksi odometer | `POST /vehicle/odometer-correction` |
| Riwayat koreksi | `GET /vehicle/odometer-corrections` |
| Aset pada trip | `GET /trips/{id}/assets` |
| Verifikasi aset | `POST /trips/{id}/assets/{assetId}/check` |

Koreksi odometer: satu pengajuan `Pending` per kendaraan (409 bila dobel); nilai
`recordedKm` diambil server, bukan dari klien.

## 12. Settlement (M15)

| Layar | Endpoint |
|---|---|
| Pendapatan | `GET /settlement?months=3` |

Dihitung dari trip selesai × `rate_cards.rate_per_km`. Status selalu **"Estimasi"**
sampai modul finansial menutup periode — jangan tampilkan sebagai "Dibayar".

---

## Offline & retry

- Semua endpoint tulis bersifat **idempoten atau aman diulang** pada kasus yang
  relevan (accept trip, submit DVIR harian ditolak 409, koreksi odometer 409).
- Mobile wajib menyimpan antrean lokal (DVIR, POD, BBM, damage, insiden) dan
  mengirim ulang saat online. Backend tidak menyediakan endpoint batch.
- `GET` tidak memiliki efek samping.

## Ringkasan jumlah

| Grup | Endpoint |
|---|---|
| Auth driver | 5 |
| Profil & beranda | 3 |
| Trip, tracking, rute, warning, aset | 12 |
| DVIR | 3 |
| POD/task | 4 |
| Unggah bukti | 1 |
| BBM & kartu | 4 |
| Notifikasi | 2 |
| Coaching/kinerja/aktivitas/DNA | 5 |
| Kerusakan/safety/kepatuhan | 5 |
| Kendaraan/dokumen | 6 |
| Settlement | 1 |
| **Subtotal `/api/driver`** | **51** |
| Provisioning admin (`api/drivers/{id}/app-access`, `/qr-token`) | 2 |
| **Total driver-facing** | **53** |
