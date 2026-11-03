# Backlog Fitur Supervisor — pendukung Aplikasi Driver

Dokumen ini daftar fitur di **web supervisor** yang harus ada supaya layar-layar
aplikasi driver berisi data. Setiap baris menyebut: apa yang harus dilakukan
supervisor, endpoint backend yang dipakai, dan statusnya.

Legenda status: **ADA** = endpoint sudah ada di `GenZysFleetOps-be`, tinggal dibuat UI-nya.
**GAP** = endpoint belum ada, perlu tambah backend + UI.

---

## 1. P0 — Tanpa ini driver tidak bisa dipakai sama sekali

| # | Fitur app driver | Aksi supervisor di web | Endpoint | Status |
|---|---|---|---|---|
| 1 | Login PIN | Daftarkan driver lalu aktifkan akses aplikasi (identifier HP + PIN 6 digit). Aksi ulang = reset PIN + buka lockout 15 menit | `POST /api/drivers`, `POST /api/drivers/{id}/app-access` | ADA |
| 2 | Beranda & daftar trip | Buat trip (kendaraan + driver + jadwal) lalu assign ke driver | `POST /api/trips`, `PUT /api/trips/{id}/assign` | ADA |
| 3 | Task / POD | Buat delivery task, assign ke driver, pantau hasil POD | `POST /api/delivery-tasks`, `PUT /api/delivery-tasks/{id}/assign` | ADA |
| 4 | DVIR (pre/post trip) | Review hasil inspeksi: pass / fail / out-of-service. Tanpa review, status report menggantung di Submitted | `PUT /api/dvirs/{id}/pass`, `/fail`, `/out-of-service` | ADA |
| 5 | Fuel card | Terbitkan kartu BBM untuk driver (limit bulanan) + catat/flag transaksi | `POST /api/fuel-cards`, `POST /api/fuel-cards/{id}/transactions` | ADA |
| 6 | Notifikasi | Kirim notifikasi in-app ke driver | `POST /api/notifications/dispatch` | ADA |
| 7 | Dokumen & kepatuhan | Unggah SIM/STNK/KIR dengan tanggal kedaluwarsa | `POST /api/documents` | ADA |

---

## 2. P1 — Fitur yang sering diminta user, tapi butuh kerja tambahan

| # | Fitur app driver | Aksi supervisor di web | Endpoint | Status |
|---|---|---|---|---|
| 8 | Aset trip (checklist barang) | Tempelkan aset ke trip + status aset (idle/aktif/out-of-service) | `PUT /api/assets/{id}/idle|activate|out-of-service` ada; **assign aset ke trip belum ada** | GAP |
| 9 | Opsi rute per trip | Tentukan 1–2 opsi rute untuk trip; driver memilih salah satu | `POST /api/routes` (optimasi) ada, **tidak terhubung ke trip** | GAP |
| 10 | Koreksi odometer | Setujui/tolak pengajuan koreksi odometer dari driver | Domain `OdometerCorrection.Approve/Reject` ada, **endpoint belum** | GAP |
| 11 | Coaching | Buat rencana coaching untuk driver, mulai, dan tutup | `POST /api/coaching-plans`, `PUT /{id}/start|complete|cancel` | ADA |
| 12 | Login QR | Tampilkan QR login berumur pendek untuk driver | `POST /api/drivers/{id}/qr-token` | ADA |
| 13 | Warning / geofence | Buat geofence + aturan alert; acknowledge/resolve alert | `/api/geofences`, `/api/alert-rules`, `PUT /api/alerts/{id}/acknowledge|resolve` | ADA |

---

## 3. P2 — Pelengkap (data turunan / back office)

| # | Fitur app driver | Aksi supervisor di web | Endpoint | Status |
|---|---|---|---|---|
| 14 | Kinerja & DNA | Input safety event (harsh braking, speeding, dll) — skor dihitung otomatis | `POST /api/safety-events` | ADA |
| 15 | Settlement | Tetapkan rate card aktif + tutup (settle) trip yang selesai | `/api/rate-cards`, `PUT /api/trips/{id}/settle` | ADA |
| 16 | Laporan kerusakan | Laporan driver otomatis jadi Work Order Corrective; supervisor assign → start → done → close | `PUT /api/work-orders/{id}/assign|start|done|close` | ADA |
| 17 | Insiden | Investigasi lalu resolve insiden yang dilaporkan driver | `PUT /api/incidents/{id}/investigate|resolve` | ADA |
| 18 | Kendaraan saat ini | Otomatis dari trip aktif — tidak perlu aksi khusus | `GET /api/driver/vehicle` | ADA |
| 19 | Aktivitas & riwayat | Turunan dari trip/DVIR/POD — tidak perlu aksi khusus | — | ADA |
| 20 | Profil driver | Driver boleh ubah nama & no HP sendiri; supervisor tidak perlu | `PUT /api/driver/me` | ADA |

---

## 4. Yang perlu dikerjakan temanmu (ringkas)

### Backend (4 endpoint baru)
1. `POST /api/trips/{id}/assets` + `GET /api/trips/{id}/assets` — pasang/lepas aset ke trip.
2. `POST /api/trips/{id}/routes` — simpan opsi rute milik trip (bukan rute generik).
3. `GET /api/odometer-corrections?status=Pending` + `PUT /api/odometer-corrections/{id}/approve|reject` — pakai method domain yang sudah ada.
4. (Opsional) `GET /api/drivers/{id}/access` — cek status akses + lockout sisa waktu.

### Web supervisor (UI)
- Halaman **Driver → tab "Akses Aplikasi"**: tombol "Aktifkan/Reset PIN", input identifier + PIN, tombol "Buka kunci akun", tombol "Tampilkan QR login".
- Halaman **Trip**: tombol Assign ke driver, panel aset trip, panel opsi rute, tombol Settle.
- Halaman **DVIR**: filter status Submitted, tombol Pass / Fail / Out of Service.
- Halaman **Task/POD**: assign driver + lihat foto & tanda tangan POD.
- Halaman **Koreksi Odometer**: daftar pengajuan Pending + Approve/Reject (setelah endpoint #3 ada).
- Halaman **Fuel Card**: terbitkan kartu, limit bulanan, daftar transaksi + flag.
- Halaman **Coaching**: buat/ mulai / selesai.
- Halaman **Notifikasi**: compose + pilih penerima (driver) + kirim.

---

## 5. Role yang membuka masing-masing fitur

| Role | Fitur |
|---|---|
| Dispatcher | Trip, task/POD, aset trip, opsi rute, notifikasi, geofence/alert |
| Fleet Manager | Driver + akses aplikasi (PIN/QR), kendaraan, dokumen, coaching |
| Maintenance | Work order (termasuk dari laporan kerusakan driver), DVIR review |
| Finance / Cost Controller | Fuel card, rate card, settlement |
| Safety Officer | Insiden, safety event, coaching |
| Management / Viewer | Hanya lihat dashboard & laporan |

---

## 6. Definisi selesai (dipakai saat minta ke temanmu)

- Driver baru bisa login PIN dari HP setelah supervisor menekan **Aktifkan akses** (tanpa seed/dummy).
- Trip baru muncul di app setelah **assign**; aset & opsi rute ikut muncul di detail trip.
- DVIR yang dikirim driver berubah status setelah supervisor menekan Pass/Fail/Out of Service.
- Kartu BBM dan settlement hanya tampil bila supervisor/finance sudah menerbitkan/menutup trip.
- Semua aksi di atas tercatat di audit trail (`/api/audit`).
