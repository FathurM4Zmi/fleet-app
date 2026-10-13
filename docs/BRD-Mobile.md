DAFTAR ISI

| 0. Kontrol Dokumen | 1 |
|---|---|
| 1. Ringkasan Eksekutif | 2 |
| 2. Latar Belakang dan Peluang Bisnis | 3 |
| 3. Tujuan Bisnis dan Indikator Keberhasilan | 4 |
| 4. Ruang Lingkup | 5 |
| 5. Pemangku Kepentingan dan Peran Pengguna | 7 |
| 6. Permasalahan Saat Ini dan Target Kondisi | 8 |
| 7. Proses Bisnis Target | 9 |
| 8. Kebutuhan Bisnis | 11 |
| 9. Aturan Bisnis | 15 |
| 10. Kebutuhan Data, Dashboard, dan Pelaporan | 17 |
| 11. Ekspektasi Non-Fungsional | 19 |
| 12. Asumsi, Dependensi, dan Batasan | 21 |
| 13. Risiko dan Mitigasi | 22 |
| 14. Deliverable Prototype dan Kriteria Penerimaan | 23 |
| 15. Roadmap Produk | 24 |
| 16. Keputusan Terbuka | 24 |
| Lampiran A. Ringkasan Ketertelusuran Kebutuhan | 26 |
| Lampiran B. Glosarium dan Referensi | 26 |

Dokumen ini merupakan baseline kebutuhan bisnis untuk pengembangan prototype Fleet Management System GenZys.

# 0. KONTROL DOKUMEN

## 0.1 Informasi Dokumen

| Atribut | Keterangan |
|---|---|
| Nama Dokumen | Business Requirements Document (BRD) - Fleet Management System |
| Kode Dokumen | BRD/FMS/26/001 |
| Versi | 1.0 |
| Tanggal | 15 Juli 2026 |
| Penyusun | PT GenZys Digital Creatindo |
| Status | Baseline Internal untuk Pengembangan Prototype |
| Klasifikasi | Internal - Product Development |
| Referensi Produk | Product Catalog GenZys 2026 - Fleet Management System, halaman katalog 22-23 |

## 0.2 Riwayat Revisi

| Versi | Tanggal | Perubahan | Penyusun |
|---|---|---|---|
| 1.0 | 15 Juli 2026 | Penyusunan baseline kebutuhan bisnis untuk prototype Fleet Management System. | PT GenZys Digital Creatindo |

## 0.3 Review dan Persetujuan

| Peran | Nama/Pihak | Tanggung Jawab | Status |
|---|---|---|---|
| Business Owner | Manajemen PT GenZys Digital Creatindo | Menetapkan arah produk, target pasar, dan prioritas bisnis. | Untuk Review |
| Product/Project Lead | Ditentukan | Menjaga scope dan menurunkan BRD menjadi PRD, FRD, desain, serta backlog. | Untuk Review |
| Technical Lead | Ditentukan | Memvalidasi feasibility, arsitektur, keamanan, integrasi peta, dan batasan teknis. | Untuk Review |
| Prototype Team | Internal/PKL | Mengimplementasikan prototype berdasarkan baseline yang disetujui. | Belum Ditugaskan |

## 0.4 Tujuan dan Penggunaan Dokumen

Dokumen ini menetapkan kebutuhan bisnis, ruang lingkup, aturan operasional, indikator keberhasilan, serta kriteria penerimaan untuk pengembangan prototype Fleet Management System milik GenZys. Dokumen menjadi baseline sebelum kebutuhan diturunkan ke Product Requirements Document (PRD), Functional Requirements Document (FRD), desain UI/UX, arsitektur solusi, backlog, dan skenario pengujian.

| ■ Batasan Dokumen BRD menjelaskan kebutuhan dan nilai bisnis yang harus dicapai. Detail teknis implementasi, desain basis data, spesifikasi API, protokol GPS tracker, field-level validation, serta test case rinci ditetapkan pada dokumen turunannya. |
|---|

# 1. RINGKASAN EKSEKUTIF

Fleet Management System adalah platform digital untuk mendukung pengelolaan kendaraan operasional secara terpusat, mencakup data armada dan pengemudi, perencanaan perjalanan, penugasan kendaraan, pemantauan posisi dan status, histori perjalanan, geofence, penggunaan bahan bakar, biaya operasional, perawatan, masa berlaku dokumen, notifikasi, serta dashboard dan laporan manajemen.

Solusi ditujukan untuk perusahaan logistik, distribusi, transportasi, ekspedisi, manufaktur, perkebunan, pertambangan, konstruksi, rental kendaraan, FMCG, serta organisasi yang memiliki kendaraan operasional atau mobile workforce. Target awal adalah prototype fungsional dan sales-ready yang dapat mendemonstrasikan siklus operasional armada secara realistis menggunakan data simulasi, tanpa bergantung pada perangkat GPS fisik pada fase pertama.

| ■ Nilai Bisnis Utama Menyediakan satu sumber data armada, meningkatkan visibilitas kendaraan dan perjalanan, membantu kontrol penggunaan dan biaya, mencegah keterlambatan perawatan atau dokumen, serta mempercepat keputusan operasional berbasis data. |
|---|

# 2. LATAR BELAKANG DAN PELUANG BISNIS

## 2.1 Konteks Bisnis

Operasional armada sering dikelola melalui spreadsheet, grup percakapan, formulir kertas, aplikasi peta yang tidak terhubung, serta laporan manual dari pengemudi. Kondisi tersebut menyebabkan status kendaraan tidak terlihat secara konsisten, penugasan tumpang tindih, histori perjalanan sulit ditelusuri, jadwal perawatan terlewat, dokumen kedaluwarsa, dan biaya operasional tidak dapat dibandingkan secara cepat.

Platform Fleet Management yang terpusat memungkinkan perusahaan menghubungkan kendaraan, pengemudi, penugasan, perjalanan, lokasi, bahan bakar, perawatan, dokumen, dan laporan dalam satu siklus data. Bagi GenZys, produk ini memiliki nilai strategis karena dapat dikembangkan secara bertahap dari prototype berbasis simulasi menjadi solusi yang terintegrasi dengan GPS tracker, IoT gateway, API telematics, ERP, HRIS, maupun sistem distribusi.

## 2.2 Pernyataan Permasalahan

| Permasalahan | Dampak Bisnis |
|---|---|
| Data kendaraan, pengemudi, perjalanan, servis, dan dokumen tersebar. | Informasi tidak konsisten dan membutuhkan rekonsiliasi manual. |
| Posisi serta status kendaraan tidak tersedia secara terpusat. | Koordinasi operasional lambat dan estimasi kedatangan tidak akurat. |
| Penugasan kendaraan dan pengemudi tidak memiliki validasi ketersediaan. | Terjadi double assignment, kendaraan tidak sesuai kebutuhan, atau pengemudi tidak eligible. |
| Histori perjalanan dan penyimpangan rute sulit ditelusuri. | Investigasi insiden, keterlambatan, atau penggunaan di luar kepentingan operasional menjadi lemah. |
| Pencatatan bahan bakar dan biaya tidak dikaitkan dengan kendaraan atau perjalanan. | Efisiensi dan indikasi penyimpangan konsumsi sulit dianalisis. |
| Servis dan masa berlaku dokumen bergantung pada pengingat manual. | Risiko breakdown, downtime, denda, dan ketidakpatuhan meningkat. |
| Laporan armada dibuat secara periodik dari banyak sumber. | Manajemen terlambat memperoleh KPI utilisasi, biaya, dan ketersediaan armada. |

## 2.3 Peluang dan Positioning Produk

Produk diposisikan sebagai Vehicle Operations & Tracking Management Platform yang modular, configurable, dan dapat digunakan untuk kendaraan milik perusahaan, sewa, kendaraan proyek, distribusi, service fleet, maupun armada lapangan. Fase awal berfokus pada visibility, assignment, trip, maintenance, fuel, document, dan reporting; advanced telematics dan optimization ditempatkan pada roadmap.

| Segmen | Kebutuhan Dominan | Nilai yang Ditawarkan |
|---|---|---|
| Logistik/Distribusi/Ekspedisi | Monitoring kendaraan, perjalanan, pengemudi, keterlambatan, dan biaya. | Live map, trip status, geofence, alert, fuel, dan performance report. |
| Manufaktur/FMCG/Perkebunan | Kendaraan operasional lintas site dan jadwal penggunaan. | Centralized fleet data, allocation, utilization, maintenance, dan document control. |
| Pertambangan/Konstruksi | Kendaraan proyek, heavy vehicle, area terbatas, dan safety monitoring. | Geofence, operating status, inspection readiness, incident traceability, dan downtime visibility. |
| Rental/Corporate Fleet | Kontrak, availability, maintenance, kilometer, dan biaya per kendaraan. | Availability dashboard, service reminder, document expiry, dan cost history. |

# 3. TUJUAN BISNIS DAN INDIKATOR KEBERHASILAN

## 3.1 Tujuan Bisnis

• Menyediakan sumber data terpusat untuk kendaraan, pengemudi, penugasan, perjalanan, lokasi, biaya, perawatan, dan dokumen.

• Meningkatkan visibilitas posisi, status, ketersediaan, dan aktivitas kendaraan secara near real-time.

• Mengurangi konflik penugasan kendaraan atau pengemudi melalui validasi availability dan eligibility.

• Mendukung kontrol rute, area operasi, waktu perjalanan, idle, dan penyimpangan melalui geofence serta alert.

• Meningkatkan disiplin perawatan dan kepatuhan dokumen melalui reminder dan status readiness.

• Menyediakan KPI utilisasi, biaya, konsumsi bahan bakar, downtime, dan performa operasional untuk manajemen.

• Menghasilkan prototype reusable yang dapat dikembangkan menuju pilot client dan integrasi tracker nyata.

## 3.2 Indikator Keberhasilan Prototype

| Indikator | Target Prototype | Metode Validasi |
|---|---|---|
| Coverage alur inti | Vehicle onboarding sampai trip closure, maintenance, dan reporting dapat didemonstrasikan. | End-to-end demo checklist. |
| Integritas assignment | Tidak ada kendaraan atau pengemudi aktif pada dua penugasan yang overlap tanpa override. | Negative and overlap scenario test. |
| Tracking visibility | Simulated positions, last update, status, route trace, dan map marker tampil konsisten. | Simulator and UI validation. |
| Geofence monitoring | Entry, exit, dan breach scenario menghasilkan event/alert yang dapat ditelusuri. | Seeded geofence scenario. |
| Maintenance readiness | Due/overdue service dan document expiry teridentifikasi pada dashboard. | Rule and reminder validation. |
| Reporting | Utilization, trip, fuel, maintenance, downtime, dan cost report dapat difilter dan diekspor. | Report reconciliation. |
| Usability | Flow dispatcher/admin usable pada desktop dan ringkasan driver usable pada mobile. | Internal walkthrough. |
| Quality | Tidak ada defect Critical dan High pada alur demo utama. | Issue log and sign-off. |

## 3.3 Prinsip Keberhasilan Produk

| ■ Business-First Prototype Prototype harus menunjukkan keputusan operasional yang lebih cepat dan data yang dapat ditelusuri. Visual map yang menarik tidak boleh menggantikan validasi assignment, status lifecycle, maintenance, dan reporting yang merupakan nilai bisnis utama. |
|---|

# 4. RUANG LINGKUP

## 4.1 In-Scope Prototype MVP

| Area | Cakupan MVP |
|---|---|
| Access & Organization | Login, role-based access, organization/site/depot, timezone, dan configuration dasar. |
| Vehicle Master | Identitas kendaraan, tipe, kepemilikan, kapasitas, odometer, status, foto, perangkat tracker dummy, dan dokumen. |
| Driver Master | Profil, kontak, lisensi, masa berlaku, status, kompetensi/vehicle class, dan availability. |
| Assignment & Trip | Permintaan/plan perjalanan, tujuan, jadwal, vehicle-driver assignment, dispatch, start, complete, cancel, dan notes. |
| Tracking & Map | Simulated live position, last update, speed/status, route trace, map filters, dan detail vehicle. |
| Geofence & Alert | Master geofence, entry/exit/breach event, overspeed, offline, idle, dan configurable alert simulation. |
| Fuel & Operational Cost | Fuel log, odometer, volume, amount, receipt evidence, dan operational expense sederhana. |
| Maintenance | Service plan berdasarkan tanggal/odometer, work order sederhana, due/overdue, cost, dan downtime. |
| Document & Compliance | STNK/KIR/insurance/license document, expiry reminder, dan readiness status. |
| Dashboard & Reporting | Fleet status, availability, utilization, trip, fuel, maintenance, cost, alerts, dan export. |
| Audit & Administration | Audit trail untuk perubahan kritis, override reason, import/seed, dan demo settings. |

## 4.2 Out-of-Scope Fase Prototype

• Integrasi perangkat GPS tracker fisik, CAN bus, OBD-II, fuel sensor, dashcam, atau IoT gateway production.

• Route optimization, automated dispatch, predictive ETA, machine learning, atau AI driving behavior scoring.

• Payroll pengemudi, settlement, reimbursement lengkap, invoicing, customer billing, atau accounting ledger.

• Warehouse management, order management, delivery proof, e-POD, dan last-mile customer application lengkap.

• Procurement kendaraan, contract lifecycle, leasing calculation, depreciation, dan asset accounting lengkap.

• Emergency response integration, government/regulatory integration, toll, traffic, atau e-ticketing external.

• Production-grade multi-tenant SaaS, high-frequency telemetry, offline mobile native, dan 24/7 SLA.

## 4.3 Prioritas MoSCoW

| Prioritas | Definisi | Fitur |
|---|---|---|
| Must | Wajib tersedia agar prototype menyampaikan nilai inti. | Vehicle, driver, availability, assignment, trip lifecycle, map simulation, history, maintenance, document expiry, dashboard, report, audit. |
| Should | Penting dan sangat memperkuat demo. | Geofence, overspeed/offline/idle alert, fuel log, expenses, downtime, import, notification center. |
| Could | Dikerjakan bila kapasitas memungkinkan. | Driver mobile task list, pre-trip inspection, issue reporting, shareable tracking link, advanced map playback. |
| Won't - Fase 1 | Ditunda secara eksplisit. | Real tracker integration, route optimization, AI scoring, billing, payroll, e-POD, predictive maintenance. |

# 5. PEMANGKU KEPENTINGAN DAN PERAN PENGGUNA

## 5.1 Pemangku Kepentingan

| Stakeholder | Kepentingan | Ekspektasi |
|---|---|---|
| Business Owner/Management | Product-market fit, commercial readiness, dan investment priority. | Prototype menunjukkan nilai, diferensiasi, dan roadmap yang realistis. |
| Fleet/Operations Manager | Availability, utilization, cost, compliance, dan service level armada. | Dashboard dan kontrol operasional terpusat. |
| Dispatcher/Transport Coordinator | Penugasan kendaraan, pengemudi, jadwal, rute, dan exception. | Tidak ada overlap dan status perjalanan terlihat jelas. |
| Driver/Field Operator | Daftar tugas, informasi trip, vehicle readiness, dan pelaporan sederhana. | Instruksi ringkas, mobile-friendly, dan tidak membebani operasional. |
| Maintenance Officer/Workshop | Service due, work order, spare/cost history, dan downtime. | Prioritas maintenance dapat ditentukan dari data. |
| Finance/Cost Controller | Fuel, expense, maintenance cost, dan cost per vehicle. | Data biaya dapat ditelusuri dan diekspor. |
| IT/System Administrator | Access, configuration, integration, security, dan availability. | Role terkontrol, configuration jelas, dan audit tersedia. |
| Prototype/Sales Team | Demo scenario dan materi discovery. | Environment stabil, data realistis, dan workflow mudah dijelaskan. |

## 5.2 Peran Pengguna

| Role | Akses Utama | Batasan |
|---|---|---|
| System Administrator | User, role, organization, configuration, master data, integration setting, dan audit. | Tidak otomatis berwenang melakukan dispatch atau approve biaya. |
| Fleet Manager | Seluruh fleet overview, vehicle/driver readiness, approval/override, KPI, dan report. | Perubahan kritis wajib memiliki reason/audit. |
| Dispatcher/Operations | Create trip, assign vehicle-driver, dispatch, monitor map, handle exception, dan close operation. | Tidak mengubah security setting atau audit. |
| Driver | Melihat assignment sendiri, acknowledge, start/end trip, update status, upload evidence/issue. | Tidak melihat biaya atau kendaraan lain kecuali diizinkan. |
| Maintenance Officer | Service plan, inspection issue, work order, maintenance status, cost, dan downtime. | Tidak melakukan dispatch tanpa role tambahan. |
| Finance/Cost Controller | Review fuel/expense/cost report dan koreksi sesuai workflow. | Tidak mengubah tracking atau assignment. |
| Management/Viewer | Dashboard, map view, KPI, trend, dan report read-only. | Tidak melakukan transaksi operasional. |

| ■ Segregation of Duties Prototype perlu menunjukkan bahwa user yang mengelola biaya, operasi, maintenance, dan konfigurasi dapat dipisahkan. Role gabungan hanya digunakan pada demo kecil dengan alasan yang terdokumentasi. |
|---|

# 6. PERMASALAHAN SAAT INI DAN TARGET KONDISI

| Area | Kondisi Saat Ini | Target Kondisi |
|---|---|---|
| Master Fleet | Data kendaraan dan pengemudi pada spreadsheet terpisah. | Satu master terstruktur dengan status, document, dan readiness. |
| Assignment | Penugasan melalui chat/telepon tanpa conflict validation. | Assignment terjadwal dengan availability dan eligibility check. |
| Tracking | Lokasi diperoleh secara manual atau dari platform terpisah. | Map terpusat dengan position, timestamp, status, dan route history. |
| Exception | Keterlambatan, offline, overspeed, atau area breach diketahui terlambat. | Alert dan exception queue dengan owner serta resolution. |
| Fuel/Cost | Nota dan rekap biaya tidak terkait trip secara konsisten. | Fuel/expense terkait vehicle, driver, odometer, trip, dan evidence. |
| Maintenance | Servis reaktif atau berdasarkan pengingat personal. | Preventive plan, due/overdue, work order, downtime, dan history. |
| Compliance | Masa berlaku dokumen diperiksa manual. | Expiry reminder dan readiness block sesuai policy. |
| Reporting | Rekap bulanan disusun ulang dari banyak file. | Dashboard dan report otomatis dengan filter serta export. |

# 7. PROSES BISNIS TARGET

## 7.1 Onboarding Kendaraan dan Pengemudi

1. Administrator atau Fleet Manager mendaftarkan organization, site/depot, tipe kendaraan, dan konfigurasi dasar.

2. Kendaraan dibuat dengan identitas, kapasitas, kepemilikan, odometer, document, service plan, serta status awal.

3. Pengemudi dibuat dengan profil, lisensi, kelas kendaraan, masa berlaku, dan availability.

4. Sistem mengevaluasi readiness kendaraan dan eligibility pengemudi berdasarkan status, dokumen, dan maintenance.

5. Data yang belum lengkap diberi status draft/incomplete dan tidak dapat dipilih pada assignment tertentu sesuai policy.

## 7.2 Perencanaan dan Penugasan Perjalanan

1. Dispatcher membuat trip/assignment dengan asal, tujuan, jadwal, tujuan perjalanan, cargo/passenger note, dan priority.

2. Sistem menampilkan kandidat kendaraan dan pengemudi yang available serta eligible.

3. Dispatcher memilih kendaraan dan pengemudi; sistem memvalidasi overlap, readiness, capacity, dan document expiry.

4. Jika policy membutuhkan approval, trip masuk status Pending Approval; jika tidak, dapat langsung Planned/Assigned.

5. Pengemudi menerima assignment dan melakukan acknowledge sebelum jadwal keberangkatan.

## 7.3 Eksekusi dan Pemantauan Perjalanan

1. Pengemudi atau Dispatcher memulai perjalanan; sistem mencatat actual start, odometer awal, dan status In Progress.

2. Simulator/tracker mengirim posisi, timestamp, kecepatan, heading, ignition/status, dan telemetry minimal.

3. Map memperbarui marker kendaraan, last update, route trace, dan status koneksi.

4. Rule engine menghasilkan event untuk geofence entry/exit, overspeed, excessive idle, offline, atau route deviation simulation.

5. Dispatcher memonitor exception, memberi catatan, menetapkan owner, dan melakukan escalation/resolution.

## 7.4 Penyelesaian Perjalanan dan Rekonsiliasi

1. Pengemudi atau Dispatcher menyelesaikan trip dan mencatat actual arrival, odometer akhir, serta completion note.

2. Fuel dan expense dapat ditautkan ke trip dengan volume, amount, location, dan receipt evidence.

3. Sistem menghitung jarak, durasi, idle, deviation, dan ringkasan trip berdasarkan data yang tersedia.

4. Trip bermasalah dapat berstatus Completed with Exception dan memerlukan review Fleet Manager.

5. Trip ditutup setelah data minimal lengkap dan tidak ada exception wajib yang belum diselesaikan.

## 7.5 Perawatan dan Kepatuhan

1. Sistem menghitung maintenance due berdasarkan tanggal, odometer, engine hour optional, atau rule lainnya.

2. Maintenance Officer membuat work order, menetapkan workshop/vendor, jadwal, pekerjaan, biaya, dan downtime.

3. Kendaraan berstatus Maintenance/Unavailable tidak dapat ditugaskan kecuali override berwenang.

4. Document expiry menghasilkan reminder dan dapat memengaruhi readiness sesuai konfigurasi.

5. Setelah work order selesai, odometer/service date berikutnya diperbarui dan riwayat tersimpan.

## 7.6 Lifecycle Status Utama

| Objek | Status Utama | Catatan |
|---|---|---|
| Vehicle | Draft, Available, Assigned, In Trip, Maintenance, Inactive, Retired | Status operasional dan readiness harus dibedakan dari connection status. |
| Driver | Draft, Available, Assigned, On Trip, Unavailable, Suspended, Inactive | Eligibility dipengaruhi lisensi dan class. |
| Trip | Draft, Pending Approval, Planned, Assigned, Acknowledged, In Progress, Completed, Completed with Exception, Cancelled | Transisi wajib tervalidasi dan diaudit. |
| Tracker/Connection | Online, Delayed, Offline, Unknown | Ditentukan dari last received timestamp dan threshold. |
| Maintenance | Planned, Due, Overdue, In Progress, Completed, Cancelled | Dapat memblokir availability. |
| Alert | Open, Acknowledged, Investigating, Resolved, Dismissed | Resolution note wajib untuk jenis tertentu. |

# 8. KEBUTUHAN BISNIS

Kebutuhan berikut menggunakan prioritas MoSCoW. Semua requirement Must menjadi baseline acceptance prototype kecuali terdapat change request yang disetujui.

| ID | Area | Kebutuhan Bisnis | Prioritas |
|---|---|---|---|
| BR-001 | Access & Organization | Sistem menyediakan autentikasi dan role-based access untuk System Administrator, Fleet Manager, Dispatcher, Driver, Maintenance, Finance, dan Viewer. | Must |
| BR-002 | Access & Organization | Sistem mendukung organization, site/depot, timezone, operating hour, dan basic policy configuration. | Must |
| BR-003 | Vehicle Master | User berwenang dapat membuat, mengubah, melihat, menonaktifkan, dan mencari data kendaraan. | Must |
| BR-004 | Vehicle Master | Data kendaraan mencakup nomor unit/plate, VIN/chassis optional, tipe, brand/model, tahun, ownership, capacity, odometer, status, foto, dan site. | Must |
| BR-005 | Vehicle Master | Sistem menyimpan readiness summary berdasarkan status, maintenance, document, dan assignment. | Must |
| BR-006 | Driver Master | User berwenang dapat mengelola profil pengemudi, lisensi, class/competency, expiry, kontak, status, dan site. | Must |
| BR-007 | Driver Master | Sistem menampilkan availability dan eligibility pengemudi untuk kendaraan tertentu. | Must |
| BR-008 | Assignment & Trip | Dispatcher dapat membuat trip dengan origin, destination, schedule, purpose, priority, notes, dan reference number. | Must |
| BR-009 | Assignment & Trip | Sistem memvalidasi overlap kendaraan dan pengemudi sebelum assignment disimpan. | Must |
| BR-010 | Assignment & Trip | Sistem memvalidasi vehicle readiness, driver eligibility, capacity, dan expiry berdasarkan policy. | Must |
| BR-011 | Assignment & Trip | Dispatcher dapat assign, reassign, cancel, dispatch, dan close trip sesuai permission dan status. | Must |
| BR-012 | Assignment & Trip | Driver dapat melihat assignment sendiri, acknowledge, start, update status, dan complete melalui tampilan mobile-friendly. | Should |
| BR-013 | Assignment & Trip | Approval workflow dapat diaktifkan untuk trip berdasarkan organization, vehicle type, priority, atau policy. | Should |
| BR-014 | Tracking & Map | Sistem menampilkan kendaraan pada peta dengan marker, status, speed, last update, driver, trip, dan connection status. | Must |
| BR-015 | Tracking & Map | Sistem menerima data simulasi telemetry dan menyimpan histori posisi untuk kebutuhan demo. | Must |
| BR-016 | Tracking & Map | User dapat memfilter peta berdasarkan site, status, vehicle type, trip, driver, dan connection. | Must |
| BR-017 | Tracking & Map | Sistem menampilkan route trace/playback dasar untuk rentang waktu atau trip terpilih. | Should |
| BR-018 | Tracking & Map | Sistem membedakan operational status dengan tracker connection status. | Must |
| BR-019 | Geofence & Alert | User berwenang dapat membuat geofence polygon/circle dengan nama, tipe, site, dan status. | Should |
| BR-020 | Geofence & Alert | Sistem menghasilkan event entry, exit, dan breach dari data simulasi. | Should |
| BR-021 | Geofence & Alert | Sistem mendukung alert overspeed, excessive idle, offline/delayed, document expiry, maintenance due, dan assignment conflict. | Should |
| BR-022 | Geofence & Alert | Alert memiliki severity, timestamp, vehicle, driver/trip context, owner, status, note, dan resolution. | Should |
| BR-023 | Fuel & Cost | User dapat mencatat fuel transaction dengan vehicle, driver, trip optional, odometer, volume, price, total, location, dan receipt. | Should |
| BR-024 | Fuel & Cost | Sistem menghitung consumption indicator dan menandai data tidak wajar berdasarkan configurable threshold sederhana. | Could |
| BR-025 | Fuel & Cost | User dapat mencatat operational expense sederhana dan mengaitkannya dengan vehicle/trip. | Should |
| BR-026 | Maintenance | User dapat membuat preventive maintenance plan berdasarkan tanggal dan/atau odometer. | Must |
| BR-027 | Maintenance | Sistem menampilkan service upcoming, due, overdue, current work order, dan maintenance history. | Must |
| BR-028 | Maintenance | Maintenance Officer dapat membuat dan menyelesaikan work order dengan task, vendor/workshop, cost, downtime, evidence, dan next due. | Must |
| BR-029 | Maintenance | Vehicle berstatus In Maintenance/Unavailable tidak ditampilkan sebagai kandidat assignment normal. | Must |
| BR-030 | Document & Compliance | User dapat mengelola document kendaraan dan pengemudi dengan issue date, expiry date, file, dan reminder. | Must |
| BR-031 | Document & Compliance | Sistem dapat memblokir atau memperingatkan assignment apabila document expired/near expiry sesuai policy. | Must |
| BR-032 | Dashboard & Reporting | Dashboard menampilkan fleet status, availability, utilization, active trip, alerts, due maintenance, document expiry, dan cost summary. | Must |
| BR-033 | Dashboard & Reporting | Sistem menyediakan report kendaraan, pengemudi, trip, route history, fuel, cost, maintenance, downtime, document, dan alert. | Must |
| BR-034 | Dashboard & Reporting | Report dapat difilter, diurutkan, dan diekspor ke format spreadsheet/CSV untuk kebutuhan demo. | Must |
| BR-035 | Audit & Administration | Perubahan status kritis, assignment, override, document, odometer, cost, dan alert resolution tercatat pada audit trail. | Must |
| BR-036 | Audit & Administration | Prototype menyediakan seeded data dan telemetry simulator yang dapat diaktifkan tanpa perangkat fisik. | Must |
| BR-037 | Configuration & Integration | Threshold connection, overspeed, idle, reminder, dan basic business rule dapat dikonfigurasi. | Should |
| BR-038 | Configuration & Integration | Arsitektur produk disiapkan agar sumber telemetry dapat diganti dari simulator menjadi API/tracker adapter pada fase berikutnya. | Should |

## 8.1 Kebutuhan Berdasarkan Persona

| Persona | Job-to-be-Done | Outcome |
|---|---|---|
| Fleet Manager | Mengetahui kendaraan yang siap, aktif, bermasalah, due service, dan cost tertinggi. | Dapat menentukan prioritas operasional dan tindakan korektif. |
| Dispatcher | Menemukan kendaraan/pengemudi available, membuat assignment, dan memonitor exception. | Penugasan lebih cepat tanpa overlap dan status perjalanan jelas. |
| Driver | Menerima detail perjalanan dan melaporkan status atau isu secara ringkas. | Instruksi tidak tercecer dan aktivitas tercatat. |
| Maintenance Officer | Mengetahui kendaraan due/overdue dan mengelola work order. | Breakdown dan downtime dapat ditekan. |
| Finance/Controller | Membandingkan fuel, expense, maintenance, dan cost per vehicle. | Indikasi pemborosan atau anomali lebih cepat ditemukan. |
| Management | Melihat utilization, availability, trip performance, cost, dan trend. | Keputusan fleet sizing dan investment lebih berbasis data. |

# 9. ATURAN BISNIS

| ID | Aturan Bisnis |
|---|---|
| BRL-001 | Setiap kendaraan wajib memiliki nomor unit unik dalam satu organization. |
| BRL-002 | Nomor polisi dapat diubah dengan audit; histori identitas lama tidak boleh hilang. |
| BRL-003 | Vehicle operational status dan tracker connection status merupakan atribut berbeda. |
| BRL-004 | Kendaraan Inactive, Retired, Maintenance, atau Unavailable tidak dapat dipilih untuk assignment normal. |
| BRL-005 | Pengemudi Suspended, Inactive, lisensi expired, atau tidak eligible terhadap class kendaraan tidak dapat ditugaskan. |
| BRL-006 | Satu kendaraan tidak boleh memiliki lebih dari satu assignment aktif yang overlap, kecuali override oleh role berwenang. |
| BRL-007 | Satu pengemudi tidak boleh memiliki lebih dari satu assignment aktif yang overlap, kecuali override oleh role berwenang. |
| BRL-008 | Override wajib menyimpan alasan, user, waktu, dan objek yang terdampak. |
| BRL-009 | Trip tidak dapat masuk In Progress sebelum memiliki vehicle dan driver yang valid, kecuali policy driverless/equipment diaktifkan. |
| BRL-010 | Actual start dan actual completion tidak boleh menghasilkan durasi negatif; koreksi wajib diaudit. |
| BRL-011 | Odometer akhir tidak boleh lebih kecil dari odometer awal tanpa administrative correction beralasan. |
| BRL-012 | Odometer vehicle diperbarui dari nilai valid terbaru; sumber data dan waktu perubahan harus dapat ditelusuri. |
| BRL-013 | Trip Cancelled tidak dapat dimulai kembali; user harus membuat assignment baru atau melakukan reopen berwenang. |
| BRL-014 | Trip dengan exception wajib tidak dapat Closed sebelum exception resolved atau di-waive oleh Fleet Manager. |
| BRL-015 | Tracker dinyatakan Delayed atau Offline berdasarkan last received timestamp dan configurable threshold. |
| BRL-016 | Telemetry out-of-order dapat disimpan untuk audit tetapi tidak boleh mengganti latest position secara salah. |
| BRL-017 | Geofence event terbentuk ketika posisi valid melintasi boundary sesuai tolerance yang ditetapkan. |
| BRL-018 | Overspeed event menggunakan speed threshold per organization, vehicle type, atau geofence bila tersedia. |
| BRL-019 | Alert yang telah Resolved tidak dapat dihapus; koreksi dilakukan melalui note atau reopen dengan audit. |
| BRL-020 | Fuel transaction wajib memiliki vehicle, tanggal, odometer atau reason exception, volume, dan amount. |
| BRL-021 | Fuel volume dan amount harus bernilai positif; pembatalan dilakukan melalui status void/reversal, bukan penghapusan permanen. |
| BRL-022 | Maintenance due dihitung berdasarkan rule terdekat antara tanggal dan odometer apabila keduanya digunakan. |
| BRL-023 | Work order In Progress membuat kendaraan tidak available kecuali maintenance type tidak memblokir operasi. |
| BRL-024 | Work order Completed wajib menyimpan completion date, odometer, summary pekerjaan, dan next due bila applicable. |
| BRL-025 | Dokumen expired dapat memblokir assignment atau menghasilkan warning sesuai policy per document type. |
| BRL-026 | Near-expiry period configurable dan default prototype menggunakan 30 hari. |
| BRL-027 | Data finansial hanya dapat dilihat atau diubah oleh role yang memiliki permission terkait. |
| BRL-028 | Data historis trip, telemetry, maintenance, cost, dan audit tidak dapat dihapus oleh user operasional biasa. |
| BRL-029 | Semua timestamp disimpan konsisten dan ditampilkan mengikuti timezone organization/site. |
| BRL-030 | Prototype menggunakan synthetic data; data kendaraan, pengemudi, dan rute nyata tidak digunakan tanpa persetujuan. |

## 9.1 Matrix Validasi Assignment

| Validasi | Normal | Warning | Blocked |
|---|---|---|---|
| Vehicle Availability | Available dan tidak overlap | Available tetapi near maintenance/document expiry | Maintenance, Inactive, Retired, overlap tanpa override |
| Driver Eligibility | Available, license valid, class sesuai | License near expiry atau jam kerja mendekati limit policy | Suspended, Inactive, expired, class tidak sesuai |
| Schedule | Tidak overlap dan operating window valid | Di luar preferred operating hour | Tanggal selesai sebelum mulai atau overlap terlarang |
| Capacity/Type | Sesuai kebutuhan | Mendekati batas atau type substitute | Di bawah kebutuhan minimum bila policy hard block |

# 10. KEBUTUHAN DATA, DASHBOARD, DAN PELAPORAN

## 10.1 Entitas Data Utama

| Entitas | Informasi Utama | Relasi Kritis |
|---|---|---|
| Organization/Site | Nama, timezone, policy, operating hour, location. | Vehicle, driver, trip, geofence, user. |
| Vehicle | Identity, type, ownership, capacity, odometer, status, site, tracker. | Trip, driver, telemetry, fuel, maintenance, document. |
| Driver | Profile, license, class, status, availability, site. | Trip, vehicle, document, alert. |
| Trip/Assignment | Reference, origin, destination, schedule, actual, status, purpose. | Vehicle, driver, route, telemetry, fuel, expense, alert. |
| Telemetry Position | Timestamp, latitude, longitude, speed, heading, ignition/status, source. | Vehicle, trip, geofence event. |
| Geofence/Alert | Geometry, type, threshold, event, severity, owner, resolution. | Vehicle, driver, trip, site. |
| Fuel/Expense | Date, odometer, volume, amount, type, vendor/location, evidence. | Vehicle, driver, trip. |
| Maintenance/Work Order | Plan, due, task, vendor, cost, downtime, completion, next due. | Vehicle, issue, document. |
| Document | Type, number, issue, expiry, file, status, reminder. | Vehicle atau driver. |
| Audit Log | Actor, action, object, before/after summary, reason, timestamp. | Seluruh transaksi kritis. |

## 10.2 Dashboard Operasional

| Komponen | Isi Minimum | Pengguna |
|---|---|---|
| Fleet Summary | Total, Available, Assigned, In Trip, Maintenance, Inactive, Online/Offline. | Fleet Manager, Dispatcher, Management |
| Live Map | Marker, status, last update, speed, trip, driver, filter, quick detail. | Dispatcher, Fleet Manager |
| Active Trip Board | Planned, late start, in progress, delayed, exception, completed today. | Dispatcher |
| Alert Queue | Open alert by severity/type, age, owner, dan unresolved count. | Dispatcher, Fleet Manager |
| Maintenance & Compliance | Upcoming/due/overdue service, work order, expiry document. | Maintenance, Fleet Manager |
| Utilization & Availability | Utilization rate, idle availability, downtime, trip frequency. | Management, Fleet Manager |
| Cost Snapshot | Fuel, expense, maintenance, cost per vehicle/km where data available. | Finance, Management |

## 10.3 KPI dan Definisi Awal

| KPI | Definisi Awal Prototype | Catatan |
|---|---|---|
| Fleet Availability Rate | Available vehicle / active fleet pada titik waktu atau periode. | Exclude retired; maintenance treatment configurable. |
| Fleet Utilization Rate | Vehicle yang memiliki active/completed trip / available fleet pada periode. | Final formula dikunci sebelum pilot. |
| Trip Completion Rate | Completed trip / trip yang seharusnya selesai pada periode. | Cancelled dipisahkan. |
| On-Time Start/Arrival | Trip within tolerance terhadap planned time. | Tolerance configurable. |
| Distance Traveled | Akumulasi route/odometer valid per vehicle atau trip. | Source priority perlu diputuskan. |
| Fuel Efficiency | Distance / fuel volume atau fuel per 100 km. | Hanya jika odometer dan fuel cukup. |
| Maintenance Compliance | Work order preventive completed on/before due / total due. | Corrective dipisahkan. |
| Downtime | Durasi vehicle tidak available karena maintenance/issue. | Manual/proxy pada prototype. |
| Alert Resolution Time | Resolved time - alert open time. | By severity/type. |
| Cost per Vehicle/Distance | Fuel + expense + maintenance / vehicle atau distance. | Bukan accounting ledger. |

## 10.4 Laporan Minimum

• Fleet inventory dan readiness report.

• Driver profile, eligibility, assignment, dan license expiry report.

• Trip plan versus actual, completion, delay, distance, dan exception report.

• Vehicle position/route history dan connection availability report.

• Geofence, overspeed, idle, offline, dan alert resolution report.

• Fuel consumption dan operational expense report.

• Maintenance due, work order, cost, compliance, dan downtime report.

• Vehicle/driver document expiry report.

• Utilization, availability, cost, dan executive summary report.

• Audit trail dan administrative override report.

# 11. EKSPEKTASI NON-FUNGSIONAL

| Kategori | Ekspektasi Prototype |
|---|---|
| Usability | Admin/dispatcher workflow desktop-first; driver task dan status mobile-friendly; status dan severity konsisten. |
| Performance | Dashboard, list, dan map awal tampil responsif untuk seeded dataset prototype; heavy history menggunakan pagination/aggregation. |
| Reliability | Duplicate telemetry, retry simulator, dan refresh tidak menghasilkan data kritis ganda atau status korup. |
| Security | Role-based permission, secure password handling, input validation, upload restriction, session management, dan audit. |
| Privacy | Demo memakai synthetic data; driver location diperlakukan sebagai data sensitif dengan akses terbatas. |
| Scalability Direction | Modular boundary untuk fleet, trip, telemetry, maintenance, dan reporting; sumber telemetry menggunakan adapter. |
| Interoperability | API-ready untuk tracker provider, maps, ERP, HRIS, maintenance vendor, dan notification service. |
| Observability | Application log, simulator log, failed process visibility, dan basic health status tersedia. |
| Maintainability | Coding standard, environment configuration, seed, migration, setup guide, dan bounded module responsibility. |
| Compatibility | Web responsive pada browser modern; map dan QR/evidence function diuji pada device umum bila digunakan. |
| Accessibility | Label, contrast, status tidak hanya bergantung pada warna, dan keyboard-friendly pada form utama. |
| Localization | Bahasa Indonesia sebagai default; label/unit/timezone dirancang configurable. |

## 11.1 Target Kinerja Awal untuk Prototype

| Area | Target Awal | Batasan |
|---|---|---|
| Standard page load | <= 3 detik pada environment demo yang stabil. | Tidak termasuk initial map tile dari provider eksternal. |
| List/filter response | <= 2 detik untuk seeded dataset normal. | Pagination wajib untuk histori besar. |
| Telemetry simulation interval | 5-30 detik configurable. | Bukan high-frequency production tracking. |
| Map initial markers | Minimal 100 kendaraan simulasi tetap usable. | Target final ditentukan setelah architecture test. |
| Export | Dataset laporan prototype dapat diekspor tanpa timeout. | Asynchronous export dapat ditambahkan pada productization. |

# 12. ASUMSI, DEPENDENSI, DAN BATASAN

## 12.1 Asumsi

• Prototype menggunakan satu organization dengan beberapa site/depot, tetapi struktur data tidak mengunci pengembangan multi-organization.

• Tracking menggunakan telemetry simulator dan synthetic route sehingga tidak memerlukan tracker fisik.

• Map provider dipilih berdasarkan feasibility, license, coverage, dan cost untuk penggunaan demo.

• Data driver, plate, phone, document, dan lokasi yang dipakai adalah dummy atau telah dianonimkan.

• Maintenance plan awal menggunakan tanggal dan odometer; engine hour dan advanced diagnostics optional.

• Fuel dan cost prototype adalah operational record, bukan sumber accounting resmi.

## 12.2 Dependensi

• Keputusan map provider, usage limit, attribution, dan license.

• Keputusan telemetry payload standar dan simulator behavior.

• Ketersediaan UI/UX design, seeded route, dan business scenario realistis.

• Environment frontend, backend, database, object storage, CI/CD, SSL, dan demo domain.

• Ketersediaan reviewer bisnis untuk mengunci KPI, status, assignment rule, dan open decisions.

• Kapasitas tim internal/PKL serta review teknis berkala.

## 12.3 Batasan

• Prototype bukan sistem keselamatan, emergency dispatch, atau sumber kebenaran regulasi kendaraan.

• Near real-time pada prototype bergantung pada interval simulator, browser refresh, dan environment demo.

• Route trace dari simulator tidak menjamin akurasi jalan, traffic, ETA, atau map matching production.

• KPI cost/fuel hanya valid jika input odometer, volume, amount, dan trip mencukupi.

• Data volume prototype tidak merepresentasikan telemetry production multi-tahun.

• Waktu dan resource pengembangan mengikuti kapasitas tim internal yang tersedia.

# 13. RISIKO DAN MITIGASI

| ID | Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|---|
| R-01 | Scope creep ke route optimization, delivery, payroll, accounting, AI, dan telematics lengkap. | Tinggi | Tinggi | Kunci MVP, change control, dan roadmap eksplisit. |
| R-02 | Tim PKL belum tersedia atau variasi kemampuan tinggi. | Tinggi | Sedang | Starter architecture, bounded task, coding guideline, dan review gate. |
| R-03 | Map provider memiliki cost, quota, attribution, atau license restriction. | Sedang | Tinggi | Evaluasi provider, abstraction, quota monitor, dan fallback demo. |
| R-04 | Simulator terlalu sederhana sehingga demo tidak realistis. | Sedang | Sedang | Seed route, speed variation, delay, offline, geofence, dan exception scenario. |
| R-05 | Status vehicle, trip, tracker, dan maintenance tercampur. | Sedang | Tinggi | Pisahkan state model dan dokumentasikan transition rule pada FRD. |
| R-06 | Data lokasi pengemudi menimbulkan risiko privacy. | Sedang | Tinggi | Synthetic data, RBAC, masking, retention direction, dan privacy notice. |
| R-07 | Telemetry duplicate/out-of-order membuat latest status salah. | Sedang | Tinggi | Timestamp validation, idempotency key, source sequence, dan processing rule. |
| R-08 | Integrasi tracker nyata berbeda-beda antar vendor. | Tinggi | Tinggi | Gunakan canonical telemetry model dan adapter boundary. |
| R-09 | Prototype dianggap production-ready untuk operasi kritikal. | Sedang | Tinggi | Prototype disclaimer dan gap assessment sebelum pilot. |
| R-10 | Data biaya atau odometer tidak lengkap menghasilkan KPI menyesatkan. | Sedang | Sedang | Data quality indicator, completeness flag, dan KPI disclaimer. |
| R-11 | Penggunaan library/map SDK memiliki license atau security risk. | Rendah | Tinggi | Review license, dependency health, security, dan abstraction. |

# 14. DELIVERABLE PROTOTYPE DAN KRITERIA PENERIMAAN

## 14.1 Deliverable

| Deliverable | Deskripsi | Status Target |
|---|---|---|
| BRD | Baseline kebutuhan bisnis, scope, rule, risk, dan acceptance. | Dokumen ini |
| PRD | Persona, user story, feature priority, product behavior, dan roadmap detail. | Berikutnya |
| FRD | Functional flow, fields, validation, permission, status transition, dan exception. | Berikutnya |
| UI/UX Prototype | High-fidelity untuk fleet manager, dispatcher, driver, maintenance, finance, dan management. | Berikutnya |
| Functional Prototype | Responsive application dengan seeded fleet, route, telemetry, trip, fuel, maintenance, dan alert. | Target Delivery |
| Telemetry Simulator | Generator posisi dan event untuk demo tanpa perangkat GPS fisik. | Target Delivery |
| Demo Environment | Deployment yang dapat diakses untuk demo internal/sales. | Target Delivery |
| Test & Issue Log | Checklist alur utama, result, defect, severity, dan resolution. | Target Delivery |
| Technical Handover | Setup, architecture summary, simulator guide, credential procedure, dan known limitation. | Target Delivery |

## 14.2 Kriteria Penerimaan

• Administrator dapat mengelola organization/site, user/role, vehicle, driver, document, dan basic configuration.

• Dispatcher dapat membuat trip, memilih kandidat available/eligible, assign, dispatch, monitor, dan close tanpa overlap terlarang.

• Driver dapat melihat assignment sendiri dan melakukan acknowledge/start/complete pada tampilan mobile-friendly.

• Telemetry simulator menampilkan posisi, last update, status, dan route history pada map secara konsisten.

• Geofence dan minimal tiga alert scenario dapat didemonstrasikan serta memiliki lifecycle resolution.

• Fuel/expense dapat dicatat dan ditautkan dengan vehicle/trip dengan validasi dasar.

• Maintenance plan, due/overdue, work order, completion, next due, dan downtime dapat didemonstrasikan.

• Document expiry memengaruhi warning/readiness sesuai policy.

• Dashboard serta report fleet, trip, fuel, maintenance, alert, cost, dan audit dapat difilter dan diekspor.

• Perubahan kritis dan override tercatat pada audit trail.

• Tidak terdapat defect Critical dan seluruh defect High pada alur utama telah ditutup sebelum sign-off.

# 15. ROADMAP PRODUK

| Fase | Fokus | Cakupan Utama |
|---|---|---|
| Fase 1 - Prototype MVP | Validasi produk dan sales demo. | Master fleet/driver, assignment, trip, map simulation, geofence/alert, fuel, maintenance, document, dashboard, report, audit. |
| Fase 2 - Pilot Client | Implementasi proses nyata satu klien. | Tracker/API integration terbatas, custom policy, UAT, deployment, training, data migration, dan support. |
| Fase 3 - Productization | Reusable multi-client platform. | Multi-tenant/configuration, adapter marketplace, observability, scale telemetry, mobile enhancement, subscription readiness. |
| Fase 4 - Advanced Fleet Suite | Optimization dan connected operations. | Route optimization, dispatch automation, driver behavior, e-POD, predictive maintenance, advanced cost, dan ecosystem integration. |

| ■ Prinsip Roadmap Jangan mengintegrasikan banyak vendor tracker atau membangun optimization sebelum canonical telemetry model, assignment rule, trip lifecycle, maintenance, dan reporting inti stabil serta tervalidasi. |
|---|

# 16. KEPUTUSAN TERBUKA

| ID | Keputusan | Owner | Target | Status |
|---|---|---|---|---|
| OD-01 | Map provider dan skema license apa yang digunakan untuk prototype dan pilot? | Technical Lead | Sebelum UI/architecture | Open |
| OD-02 | Canonical telemetry payload minimum: field, interval, quality, dan sequence? | Technical Lead | Sebelum simulator | Open |
| OD-03 | Apakah prototype menggunakan approval trip atau direct dispatch sebagai default? | Business Owner | Sebelum PRD final | Open |
| OD-04 | Apakah kendaraan tanpa driver/equipment asset perlu didukung pada fase pertama? | Product Lead | Sebelum data model | Open |
| OD-05 | Source priority odometer: manual, telemetry, maintenance, atau latest approved? | Product/Technical Lead | Sebelum FRD | Open |
| OD-06 | Default threshold offline, overspeed, idle, dan on-time tolerance? | Fleet SME/Product Lead | Sebelum simulator scenario | Open |
| OD-07 | Geofence pada MVP wajib Must atau tetap Should? | Business Owner | Sebelum sprint planning | Open |
| OD-08 | Apakah fuel/expense memerlukan approval Finance pada prototype? | Business Owner | Sebelum PRD final | Open |
| OD-09 | Document type mana yang hard-block assignment dan mana yang warning? | Fleet SME | Sebelum FRD | Open |
| OD-10 | Apakah pre-trip inspection dan issue report masuk Could atau ditunda? | Product Lead | Sebelum backlog | Open |
| OD-11 | Prototype single-organization atau configuration-ready multi-organization? | Technical Lead | Sebelum architecture baseline | Open |
| OD-12 | Retention dan akses historical location data pada production direction? | Business Owner/IT | Sebelum pilot proposal | Open |
| OD-13 | Jumlah kendaraan simulasi dan skenario demo standar? | Product/Sales Lead | Sebelum demo seeding | Open |
| OD-14 | Siapa PIC harian dan reviewer untuk task PKL? | Management | Sebelum onboarding PKL | Open |

# Lampiran A. RINGKASAN KETERTELUSURAN KEBUTUHAN

| Tujuan Bisnis | Requirement Terkait | Indikator |
|---|---|---|
| Data armada terpusat | BR-001 s.d. BR-007; BR-030 | Vehicle, driver, document, dan readiness tersedia. |
| Assignment tanpa konflik | BR-008 s.d. BR-013; BRL-004 s.d. BRL-014 | Tidak ada overlap terlarang dan lifecycle trip tervalidasi. |
| Visibility dan exception | BR-014 s.d. BR-022; BRL-015 s.d. BRL-019 | Map, telemetry, geofence, dan alert dapat didemonstrasikan. |
| Kontrol fuel dan cost | BR-023 s.d. BR-025; BRL-020 s.d. BRL-021 | Transaksi dan indikator cost dapat ditelusuri. |
| Maintenance dan compliance | BR-026 s.d. BR-031; BRL-022 s.d. BRL-026 | Due/overdue, work order, document expiry, dan block/warning tersedia. |
| Insight dan governance | BR-032 s.d. BR-038; BRL-027 s.d. BRL-030 | Dashboard, report, audit, simulator, dan integration readiness tersedia. |

# Lampiran B. GLOSARIUM DAN REFERENSI

## B.1 Glosarium

| Istilah | Definisi |
|---|---|
| Fleet | Kumpulan kendaraan atau mobile asset yang dikelola organisasi. |
| Vehicle Readiness | Ringkasan kelayakan kendaraan untuk ditugaskan berdasarkan status, maintenance, document, dan rule. |
| Assignment | Penetapan kendaraan dan pengemudi untuk kebutuhan atau jadwal tertentu. |
| Trip | Realisasi perjalanan dengan planned dan actual information. |
| Telemetry | Data berkala dari tracker/simulator seperti posisi, timestamp, speed, dan status. |
| Geofence | Batas area virtual yang digunakan untuk menghasilkan entry, exit, atau breach event. |
| Idle | Kondisi kendaraan tidak bergerak selama durasi tertentu sesuai rule. |
| Downtime | Durasi kendaraan tidak tersedia untuk operasi karena maintenance atau issue. |
| Work Order | Catatan pekerjaan maintenance dari perencanaan sampai penyelesaian. |
| Administrative Override | Perubahan oleh user berwenang di luar aturan normal dengan reason dan audit. |
| MoSCoW | Metode prioritas Must, Should, Could, dan Won’t. |

## B.2 Referensi

• Product Catalog PT GenZys Digital Creatindo 2026 - Fleet Management System, halaman katalog 22-23.

• Template visual korporat GenZys - Technical Proposal Masyarakat Telematika Indonesia (Mastel), 2026.

• Praktik internal GenZys untuk pemisahan BRD, PRD, FRD, desain, backlog, dan dokumen pengujian.

--- Akhir Dokumen ---
