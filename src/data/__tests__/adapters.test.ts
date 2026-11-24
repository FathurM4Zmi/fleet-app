import {
  dayAndTime,
  initialsOf,
  parseChecklist,
  rupiah,
  serializeChecklist,
  shortDate,
  toActivity,
  toChecklist,
  toCoaching,
  toComplianceDocuments,
  toDamageReport,
  toDna,
  toDocumentDetail,
  toDriver,
  toFuelCard,
  toFuelLog,
  toFuelTransaction,
  toIncidents,
  toNotification,
  toOdometerCorrection,
  toPerformance,
  toPod,
  toProfileDocument,
  toRouteOption,
  toSafetyEvent,
  toSettlement,
  toTrip,
  toTripAsset,
  toTripWarning,
  toTripWarningHistory,
  toVehicle,
  toVehicleDetail,
  toVehicleDocument,
  toVehicleFromTrip,
  toDvir,
} from '@/data/adapters';
import type {
  ActivityEntry as ActivityEntryWire,
  Coaching as CoachingWire,
  Compliance as ComplianceWire,
  DamageReport as DamageReportWire,
  Dna as DnaWire,
  DriverDocumentDetail as DocumentDetailWire,
  DriverDocumentSummary as DocumentSummaryWire,
  DriverMe as DriverMeWire,
  DriverTask as DriverTaskWire,
  DriverTrip as DriverTripWire,
  DriverVehicle as DriverVehicleWire,
  DvirRecord as DvirWire,
  FuelCard as FuelCardWire,
  FuelLog as FuelLogWire,
  FuelTransaction as FuelTransactionWire,
  OdometerCorrection as OdometerWire,
  Performance as PerformanceWire,
  RouteOption as RouteOptionWire,
  SafetyEvent as SafetyEventWire,
  Settlement as SettlementWire,
  TripAsset as TripAssetWire,
  TripWarning as TripWarningWire,
  TripWarningHistory as TripWarningHistoryWire,
} from '@/lib/api/types';

const trip = (overrides: Partial<DriverTripWire> = {}): DriverTripWire => ({
  id: '01a1ecb2-39b2-7561-bf10-7d96522ce7df',
  vehicleId: 'veh-1',
  vehiclePlate: 'B 9456 KJU',
  vehicleModel: 'Isuzu Giga FVR',
  tripCode: 'TRP-20261118-0101',
  origin: 'Jakarta',
  originAddress: 'Depo Cakung',
  destination: 'Bandung',
  destinationAddress: 'Area bongkar muat',
  shipper: 'PT Logistik Nusantara',
  cargo: 'Muatan campuran',
  cargoNote: null,
  weightKg: 4000,
  plannedDistanceKm: 120,
  recipientName: 'Pak Hendro',
  recipientRole: 'Koordinator Gudang',
  instruction: null,
  scheduledStart: '2026-11-18T10:00:00+00:00',
  scheduledEnd: '2026-11-18T18:00:00+00:00',
  status: 'Assigned',
  actualStartAt: null,
  arrivedAt: null,
  actualEndAt: null,
  actualDistanceKm: null,
  declineReason: null,
  preTripDone: false,
  postTripDone: false,
  ...overrides,
});

describe('toTrip', () => {
  it.each([
    ['Scheduled', 'scheduled'],
    ['Assigned', 'assigned'],
    ['Acknowledged', 'accepted'],
    ['InProgress', 'in_progress'],
    ['Arrived', 'arrived'],
    ['Completed', 'completed'],
    ['Settled', 'completed'],
    ['Cancelled', 'rejected'],
    ['Declined', 'rejected'],
  ])('maps %s to %s', (wire, expected) => {
    expect(toTrip(trip({ status: wire as DriverTripWire['status'] })).status).toBe(expected);
  });

  it('falls back to assigned for a status the app does not know', () => {
    expect(toTrip(trip({ status: 'WeirdNewStatus' as DriverTripWire['status'] })).status).toBe(
      'assigned',
    );
  });

  it('uses em dashes instead of leaking nulls into the screen', () => {
    const view = toTrip(
      trip({
        tripCode: null,
        cargoNote: null,
        shipper: null,
        recipientName: null,
        recipientRole: null,
      }),
    );

    expect(view.code).toBe('TRP-01A1ECB2');
    expect(view.cargoNote).toBe('—');
    expect(view.shipper).toBe('—');
    expect(view.recipient.name).toBe('—');
    expect(view.recipient.role).toBe('Penerima');
  });

  it('marks timeline steps done only when the matching timestamp exists', () => {
    const assigned = toTrip(trip());
    expect(assigned.timeline.map((step) => step.done)).toEqual([true, false, false, false]);

    const running = toTrip(
      trip({ status: 'InProgress', actualStartAt: '2026-11-18T10:05:00+00:00' }),
    );
    expect(running.timeline.map((step) => step.done)).toEqual([true, true, true, false]);

    const arrived = toTrip(
      trip({
        status: 'Arrived',
        actualStartAt: '2026-11-18T10:05:00+00:00',
        arrivedAt: '2026-11-18T16:40:00+00:00',
      }),
    );
    expect(arrived.timeline.map((step) => step.done)).toEqual([true, true, true, true]);
  });

  it('falls back to the actual distance when no plan was set', () => {
    expect(toTrip(trip({ plannedDistanceKm: null, actualDistanceKm: 212 })).distanceKm).toBe(212);
  });
});

describe('driver and vehicle mapping', () => {
  const me: DriverMeWire = {
    driverId: 'drv-1',
    name: 'Budi Santoso',
    licenseNumber: 'SIM-2024-0001',
    phone: null,
    status: 'Active',
    licenseExpiryDate: '2028-11-02',
    loginIdentifier: '081234567001',
    lastLoginAt: null,
    appAccessActive: true,
  };

  it('builds initials from the first two words', () => {
    expect(initialsOf('Budi Santoso')).toBe('BS');
    expect(initialsOf('  Rina   Kartika  Putri ')).toBe('RK');
    expect(initialsOf('')).toBe('');
  });

  it('maps an active driver and keeps the DNA score passed in', () => {
    const view = toDriver(me, 82);

    expect(view.initials).toBe('BS');
    expect(view.status).toBe('active');
    expect(view.phone).toBe('—');
    expect(view.dnaScore).toBe(82);
  });

  it('maps inactive drivers and unknown vehicle statuses', () => {
    expect(toDriver({ ...me, status: 'Suspended' }).status).toBe('inactive');

    const vehicle: DriverVehicleWire = {
      vehicleId: 'veh-1',
      plate: 'B 9456 KJU',
      model: null,
      year: 2021,
      odometerKm: 246800,
      status: 'SomethingElse',
      fuelType: null,
      transmission: null,
      capacityKg: null,
      healthScore: null,
      healthNote: null,
      specs: [],
    };

    const view = toVehicle(vehicle);
    expect(view.status).toBe('available');
    expect(view.model).toBe('—');
    expect(view.odometerKm).toBe(246800);
    expect(toVehicle({ ...vehicle, status: 'OutOfService' }).status).toBe('blocked');
  });
});

describe('DVIR and POD', () => {
  it('treats a missing or broken checklist as empty instead of throwing', () => {
    expect(parseChecklist(null)).toEqual([]);
    expect(parseChecklist('')).toEqual([]);
    expect(parseChecklist('not json')).toEqual([]);
    expect(parseChecklist('{"id":"a"}')).toEqual([]);
  });

  it('round-trips the checklist the form saves', () => {
    const items = [
      { id: 'brake', label: 'Rem', group: 'Rem', result: 'pass' as const },
      { id: 'lamp', label: 'Lampu', group: 'Lampu', result: 'fail' as const, note: 'mati' },
    ];

    expect(parseChecklist(serializeChecklist(items))).toEqual(items);
  });

  it('maps a pre-trip DVIR with its checklist items', () => {
    const dto: DvirWire = {
      id: 'dvir-1',
      vehicleId: 'veh-1',
      vehiclePlate: 'B 9456 KJU',
      inspectionType: 'PreTrip',
      odometerKm: 246800,
      status: 'Passed',
      submittedAt: '2026-11-18T09:00:00+00:00',
      defects: null,
      photoPaths: [],
      checklistJson: serializeChecklist([
        { id: 'brake', label: 'Rem', group: 'Rem', result: 'pass', photoPath: 'uploads/dvir/1.jpg' },
      ]),
    };

    const view = toDvir(dto);
    expect(view.type).toBe('pre');
    expect(view.status).toBe('passed');
    expect(view.items).toHaveLength(1);
    expect(view.items[0].photoUri).toBe('uploads/dvir/1.jpg');
  });

  it('treats an unrecognised inspection type as post-trip', () => {
    const view = toDvir({
      id: 'dvir-2',
      vehicleId: 'veh-1',
      vehiclePlate: null,
      inspectionType: 'Unknown',
      odometerKm: 1,
      status: 'Failed',
      submittedAt: '2026-11-18T09:00:00+00:00',
      defects: 'ban bocor',
      photoPaths: ['uploads/dvir/2.jpg'],
      checklistJson: null,
    });

    expect(view.type).toBe('post');
    expect(view.status).toBe('failed');
    expect(view.defects).toBe('ban bocor');
  });

  it('only marks a POD as signed when the signature path exists', () => {
    const task: DriverTaskWire = {
      id: 'task-1',
      tripId: null,
      customerName: 'Toko Maju',
      customerPhone: '0812',
      address: 'Jl. Merdeka 1',
      scheduledDate: '2026-11-18T10:00:00+00:00',
      status: 'Pending',
      deliveredAt: null,
      podPhotoPath: null,
      podSignaturePath: null,
      podNotes: null,
      podLatitude: null,
      podLongitude: null,
      podCapturedAt: null,
    };

    const pending = toPod(task);
    expect(pending.photoUris).toEqual([]);
    expect(pending.hasSignature).toBe(false);
    expect(pending.tripId).toBe('');
    expect(pending.syncStatus).toBe('pending');
    expect(pending.geo).toEqual({ lat: 0, lng: 0 });

    const delivered = toPod({
      ...task,
      status: 'Delivered',
      podPhotoPath: 'uploads/pod/1.jpg',
      podSignaturePath: 'uploads/pod/1.sig',
      podLatitude: -6.2,
      podLongitude: 106.8,
    });

    expect(delivered.photoUris).toEqual(['uploads/pod/1.jpg']);
    expect(delivered.hasSignature).toBe(true);
    expect(delivered.syncStatus).toBe('synced');
    expect(delivered.geo).toEqual({ lat: -6.2, lng: 106.8 });
  });
});

describe('notifications', () => {
  const base = {
    id: 'n-1',
    title: 'Trip baru',
    message: 'Ada trip masuk',
    notificationType: 'Trip',
    severity: 'Warning',
    sourceType: 'Trip',
    sourceId: 'trip-9',
    isRead: false,
    readAt: null,
    createdAt: '2026-11-18T10:00:00+00:00',
  };

  it('maps type, severity and the trip deep-link', () => {
    const view = toNotification(base);

    expect(view.type).toBe('trip');
    expect(view.severity).toBe('warning');
    expect(view.tripId).toBe('trip-9');
  });

  it('does not deep-link when the source is not a trip', () => {
    const view = toNotification({ ...base, sourceType: 'Document', sourceId: 'doc-1' });

    expect(view.tripId).toBeUndefined();
  });

  it('falls back to a system info notification for unknown values', () => {
    const view = toNotification({
      ...base,
      notificationType: 'Mystery',
      severity: 'Low',
      sourceType: null,
      sourceId: null,
    });

    expect(view.type).toBe('system');
    expect(view.severity).toBe('info');
  });
});

describe('fuel', () => {
  it('formats rupiah with Indonesian separators', () => {
    expect(rupiah(4500)).toBe('Rp 4.500');
    expect(rupiah(1_250_000.4)).toBe('Rp 1.250.000');
  });

  it('formats a transaction amount and keeps unknown statuses pending', () => {
    const dto: FuelTransactionWire = {
      key: 'txn-1',
      station: 'SPBU Cakung',
      dateLabel: '18 Nov',
      liters: 40,
      amount: 680000,
      status: 'flagged',
      statusLabel: 'Perlu tinjauan',
      note: null,
    };

    expect(toFuelTransaction(dto).amount).toBe('Rp 680.000');
    expect(toFuelTransaction(dto).status).toBe('flagged');
    expect(toFuelTransaction({ ...dto, status: 'mystery' }).status).toBe('pending');
  });

  it('maps an active card and blocks anything else', () => {
    const card: FuelCardWire = {
      number: '4111 **** 1234',
      holder: 'Budi Santoso',
      limit: 5_000_000,
      remaining: 3_200_000,
      used: 1_800_000,
      resetDay: 1,
      status: 'Active',
    };

    expect(toFuelCard(card).status).toBe('active');
    expect(toFuelCard({ ...card, status: 'Blocked' }).status).toBe('blocked');
    expect(toFuelCard(card).remaining).toBe(3_200_000);
  });
});

describe('settlement', () => {
  const base: SettlementWire = {
    amount: 1_250_000,
    tripCount: 4,
    status: 'Siap dibayar',
    periods: [{ key: '2026-11', label: 'November 2026', amount: 1_250_000, status: 'Siap dibayar' }],
    lines: [{ key: 'l1', destination: 'Bandung', meta: '120 km', amount: 540_000 }],
    steps: [
      { key: 's1', label: 'Trip selesai', state: 'done' },
      { key: 's2', label: 'Verifikasi', state: 'Berjalan' },
      { key: 's3', label: 'Transfer', state: 'menunggu' },
    ],
  };

  it('formats amounts and maps step states', () => {
    const view = toSettlement(base);

    expect(view.summary.total).toBe('Rp 1.250.000');
    expect(view.summary.period).toBe('November 2026');
    expect(view.summary.paidNote).toBe('4 trip selesai');
    expect(view.lines[0].amount).toBe('Rp 540.000');
    expect(view.steps.map((step) => step.state)).toEqual(['done', 'active', 'upcoming']);
  });

  it('shows a dash instead of Rp 0 when no rate card matched', () => {
    const view = toSettlement({
      ...base,
      amount: 0,
      status: 'Tarif belum ditetapkan',
      periods: [{ key: '2026-11', label: 'November 2026', amount: 0, status: 'Tarif belum ditetapkan' }],
      lines: [{ key: 'l1', destination: 'Bandung', meta: '120 km', amount: 0 }],
    });

    expect(view.summary.rateMissing).toBe(true);
    expect(view.summary.total).toBe('—');
    expect(view.lines[0].amount).toBe('—');
    expect(view.history[0].amount).toBe('—');
  });
});

describe('route, warning and asset mapping', () => {
  const route = (overrides: Partial<RouteOptionWire> = {}): RouteOptionWire => ({
    key: 'r1',
    title: 'Via Tol',
    subtitle: '120 km • 102 menit',
    minutes: 102,
    km: 120,
    tag: null,
    statusLabel: 'Disarankan',
    statusTone: 'Success',
    recommended: true,
    selected: false,
    originLat: -6.2,
    originLng: 106.8,
    destLat: -6.9,
    destLng: 107.6,
    ...overrides,
  });

  it('keeps the recommended route and its coordinates', () => {
    const view = toRouteOption(route());

    expect(view.tag).toBeUndefined();
    expect(view.statusTone).toBe('success');
    expect(view.recommended).toBe(true);
    expect(view.destLat).toBe(-6.9);
  });

  it('carries the server-selected flag so the screen can restore the choice', () => {
    // Setelah driver menerapkan satu rute, server mengirim selected=true dan
    // recommended=false untuk semua opsi — tanpa flag ini layar balik ke opsi pertama.
    const applied = toRouteOption(route({ selected: true, recommended: false }));

    expect(applied.selected).toBe(true);
    expect(applied.recommended).toBe(false);
    expect(toRouteOption(route()).selected).toBe(false);
  });

  it('renders a High alert as a warning tone, not info', () => {
    const dto: TripWarningWire = {
      key: 'w1',
      severity: 'High',
      severityLabel: 'TINGGI',
      title: 'GeofenceBreach',
      note: null,
      sla: null,
      timeLabel: null,
      suggestsRoute: false,
    };

    expect(toTripWarning(dto).severity).toBe('warning');
    expect(toTripWarning(dto).note).toBe('');
    expect(toTripWarning({ ...dto, severity: 'Critical' }).severity).toBe('critical');
    expect(toTripWarning({ ...dto, severity: 'Low' }).severity).toBe('info');
  });

  it('translates known alert types so drivers never see raw enum names', () => {
    const dto: TripWarningWire = {
      key: 'w1',
      severity: 'High',
      severityLabel: 'TINGGI',
      title: 'GeofenceBreach',
      note: null,
      sla: null,
      timeLabel: null,
      suggestsRoute: false,
    };

    // FRD-MOB-Alerts wording, bukan "GeofenceBreach".
    expect(toTripWarning(dto).title).toBe('Anda keluar dari zona rute yang ditentukan.');
    expect(toTripWarning({ ...dto, title: 'MaintenanceOverdue' }).title).toBe(
      'Jadwal perawatan preventif terlewat.',
    );
    // Tipe yang belum dikenal dibiarkan apa adanya.
    expect(toTripWarning({ ...dto, title: 'UnknownAlert' }).title).toBe('UnknownAlert');
    expect(
      toTripWarningHistory({ key: 'h1', title: 'RouteDetour', note: null, time: '05:02' }).title,
    ).toBe('Anda keluar dari zona rute yang ditentukan.');
  });

  it('only exposes reefer telemetry for reefer assets', () => {
    const dto: TripAssetWire = {
      key: 'a1',
      code: 'AST-1',
      name: 'Trailer Box',
      statusLabel: 'Belum diperiksa',
      statusTone: 'warning',
      footNote: 'Belum discan',
      footIcon: 'search',
      isReefer: false,
      temperatureC: null,
      humidityPct: null,
      tempMinC: null,
      tempMaxC: null,
      alarmState: null,
      alarmLabel: null,
      telemetryAt: null,
      custody: [{ at: '18 Nov 08:00', actor: 'Budi', action: 'Serah terima', location: null, note: null }],
    };

    const dry = toTripAsset(dto);
    expect(dry.reefer).toBeUndefined();
    expect(dry.footIcon).toBe('search');
    expect(dry.custody[0].key).toBe('a1-custody-0');

    const reefer = toTripAsset({
      ...dto,
      isReefer: true,
      temperatureC: -18,
      alarmState: 'alarm',
      alarmLabel: 'Suhu di atas batas',
    });
    expect(reefer.reefer?.temperatureC).toBe(-18);
    expect(reefer.reefer?.alarm).toBe('alarm');

    const unknownAlarm = toTripAsset({ ...dto, isReefer: true, alarmState: 'offline' });
    expect(unknownAlarm.reefer?.alarm).toBe('unknown');
    expect(unknownAlarm.reefer?.label).toBe('Belum ada data suhu');
  });
});

describe('document detail', () => {
  const dto: DocumentDetailWire = {
    key: 'sim',
    title: 'SIM B2',
    subtitle: 'SIM-2024-0001',
    updatedNote: 'Diperbarui 2 hari lalu',
    cardLabel: 'Nomor SIM',
    cardNumber: 'SIM-2024-0001',
    holderName: 'Budi Santoso',
    status: 'ExpiringSoon',
    statusLabel: 'Segera berakhir',
    rows: [{ label: 'Berlaku sampai', value: '02 Nov 2028', mono: false, badge: true }],
    photoPath: 'uploads/dokumen/sim.jpg',
  };

  it('turns a stored path into an absolute URL', () => {
    const view = toDocumentDetail(dto);

    expect(view.status).toBe('expiring');
    expect(view.photoUrl).toMatch(/^https?:\/\/.+\/uploads\/dokumen\/sim\.jpg$/);
    expect(view.rows[0].key).toBe('sim-0');
  });

  it('leaves an already absolute or local URI untouched', () => {
    expect(toDocumentDetail({ ...dto, photoPath: 'file:///tmp/sim.jpg' }).photoUrl).toBe(
      'file:///tmp/sim.jpg',
    );
    expect(toDocumentDetail({ ...dto, photoPath: 'https://cdn.test/sim.jpg' }).photoUrl).toBe(
      'https://cdn.test/sim.jpg',
    );
  });

  it('maps expired documents', () => {
    expect(toDocumentDetail({ ...dto, status: 'Expired' }).status).toBe('expired');
    expect(toDocumentDetail({ ...dto, status: 'Valid' }).status).toBe('valid');
  });
});

describe('performance, DNA and activity', () => {
  it('drops null units/deltas so the KPI tile does not render empty chips', () => {
    const dto: PerformanceWire = {
      kpis: [
        { key: 'trips', label: 'Trip selesai', value: '12', unit: null, delta: '+3', deltaTone: 'Success', note: 'Target: 10 trip' },
        { key: 'ontime', label: 'On-time', value: '96', unit: '%', delta: null, deltaTone: null, note: 'Target: 95%' },
      ],
      trend: [{ day: 'Sen', trips: 2, onTimePercent: 100 }],
      score: { value: 88, max: 100, fleetAverage: 81, fleetDelta: 7, verified: true },
    };

    const view = toPerformance(dto);

    expect(view.kpis[0].unit).toBeUndefined();
    expect(view.kpis[0].deltaTone).toBe('success');
    expect(view.kpis[1].delta).toBeUndefined();
    expect(view.kpis[1].deltaTone).toBeUndefined();
    expect(view.score.value).toBe(88);
    expect(view.trend[0].day).toBe('Sen');
  });

  it('treats any non-success DNA component tone as warning', () => {
    const dto: DnaWire = {
      score: 82,
      delta: 4,
      weeksTracked: 12,
      tier: 'Baik',
      fleetAverage: 74,
      updatedAt: '2026-11-18T00:00:00+00:00',
      trend: [{ label: 'W1', score: 78 }],
      components: [
        { key: 'brake', label: 'Pengereman', score: 90, band: 'A', tone: 'Success' },
        { key: 'fuel', label: 'Efisiensi', score: 62, band: 'C', tone: 'Critical' },
      ],
      insight: { title: 'Turun 3 poin', body: 'Karena 2 pengereman mendadak.' },
    };

    const view = toDna(dto);

    expect(view.components[0].tone).toBe('success');
    expect(view.components[1].tone).toBe('warning');
    expect(view.insight.body).toBe('Karena 2 pengereman mendadak.');
  });

  it('keeps known activity categories and folds unknown ones into trip', () => {
    const base: ActivityEntryWire = {
      key: 'act-1',
      category: 'DVIR',
      title: 'DVIR dikirim',
      detail: 'Pre-trip • B 9456 KJU',
      time: '08:02',
      tone: 'success',
    };

    expect(toActivity(base).category).toBe('dvir');
    expect(toActivity(base).tone).toBe('success');
    expect(toActivity({ ...base, category: 'payroll' }).category).toBe('trip');
    expect(toActivity({ ...base, tone: 'mystery' }).tone).toBe('info');
  });
});

describe('coaching', () => {
  it('maps milestone states in Indonesian and English', () => {
    const dto: CoachingWire = {
      plan: {
        id: 'plan-1',
        title: 'Keselamatan Berkendara',
        description: 'Kurangi pengereman mendadak',
        targetDate: '25 Nov',
        status: 'InProgress',
        milestones: [
          { key: 'm1', label: 'Sesi 1', state: 'done', note: 'Selesai 10 Nov' },
          { key: 'm2', label: 'Sesi 2', state: 'Selesai', note: 'Selesai 15 Nov' },
          { key: 'm3', label: 'Sesi 3', state: 'locked', note: 'Terkunci' },
          { key: 'm4', label: 'Sesi 4', state: 'menunggu', note: 'Menunggu' },
        ],
      },
      sessions: [
        { key: 's1', title: 'Coaching 1', note: 'Pengereman', status: 'Completed', statusLabel: 'Selesai' },
        { key: 's2', title: 'Coaching 2', note: 'Dibatalkan', status: 'Cancelled', statusLabel: 'Batal' },
      ],
    };

    const view = toCoaching(dto);

    expect(view.milestones.map((item) => item.state)).toEqual([
      'done',
      'done',
      'locked',
      'waiting',
    ]);
    expect(view.plan?.status).toBe('InProgress');
    expect(view.sessions.map((item) => item.status)).toEqual(['done', 'cancelled']);
  });

  it('returns a null plan when the driver has no active coaching', () => {
    const view = toCoaching({ plan: null, sessions: [] });

    expect(view.plan).toBeNull();
    expect(view.milestones).toEqual([]);
  });
});

describe('compliance and safety', () => {
  const compliance: ComplianceWire = {
    checklist: [{ key: 'c1', label: 'SIM berlaku', done: true }],
    incidents: [
      {
        key: 'i1',
        date: '12 Nov',
        title: 'Serempet pagar',
        status: 'Resolved',
        statusLabel: 'Selesai',
        severity: 'Low',
        location: 'Cakung',
      },
    ],
  };

  it('passes the compliance checklist through and flattens incidents', () => {
    expect(toChecklist(compliance)).toHaveLength(1);
    expect(toChecklist(compliance)[0].done).toBe(true);
    expect(toIncidents(compliance)).toEqual([
      { key: 'i1', date: '12 Nov', title: 'Serempet pagar', status: 'Selesai' },
    ]);
  });

  it('maps document summaries into both profile and vehicle shapes', () => {
    const dto: DocumentSummaryWire = {
      key: 'stnk',
      title: 'STNK',
      documentType: 'Kendaraan',
      note: 'Berlaku 1 tahun',
      status: 'ExpiringSoon',
      statusLabel: 'Segera berakhir',
      hint: 'Perbarui di Samsat',
      photoPath: 'uploads/dokumen/stnk.jpg',
    };

    expect(toProfileDocument(dto)).toEqual({
      key: 'stnk',
      title: 'STNK',
      documentType: 'Kendaraan',
      status: 'expiring',
      statusLabel: 'Segera berakhir',
    });
    expect(toVehicleDocument(dto)).toEqual({
      key: 'stnk',
      label: 'STNK',
      note: 'Berlaku 1 tahun',
      status: 'expiring',
      statusLabel: 'Segera berakhir',
    });

    expect(toComplianceDocuments([dto])[0].hint).toBe('Perbarui di Samsat');
    expect(toComplianceDocuments([{ ...dto, hint: null }])[0].hint).toBeUndefined();
  });

  it('groups safety event categories and falls back to lainnya', () => {
    const dto: SafetyEventWire = {
      key: 's1',
      category: 'HarshBraking',
      categoryLabel: 'Pengereman mendadak',
      severity: 'Warning',
      title: 'Pengereman mendadak',
      location: null,
      time: '09:42',
      metric: '-8.4 m/s²',
      metricNote: 'Di atas ambang 6 m/s²',
      hasPhoto: true,
      videoUrl: null,
    };

    expect(toSafetyEvent(dto).category).toBe('lainnya');
    expect(toSafetyEvent(dto).location).toBe('—');
    expect(toSafetyEvent(dto).severity).toBe('warning');
    expect(toSafetyEvent({ ...dto, category: 'Braking' }).category).toBe('rem');
    expect(toSafetyEvent({ ...dto, category: 'speed' }).category).toBe('kecepatan');
    expect(toSafetyEvent({ ...dto, category: 'efficiency' }).category).toBe('efektifitas');
  });
});

describe('fuel log and odometer corrections', () => {
  it('maps a fuel entry and keeps an unknown sync state as synced', () => {
    const dto: FuelLogWire = {
      id: 'fuel-1',
      vehicleId: 'veh-1',
      liters: 40.5,
      odometerKm: 246810,
      pricePerLiter: 6800,
      station: null,
      receiptPath: null,
      createdAt: '2026-11-18T09:00:00+00:00',
      syncStatus: 'Pending',
    };

    const view = toFuelLog(dto);
    expect(view.liters).toBe(40.5);
    expect(view.station).toBe('—');
    expect(view.receiptUri).toBeUndefined();
    expect(view.syncStatus).toBe('pending');
    expect(toFuelLog({ ...dto, syncStatus: 'weird' }).syncStatus).toBe('synced');
  });

  it('maps correction statuses and defaults unknown ones to pending', () => {
    const dto: OdometerWire = {
      id: 'od-1',
      vehicleId: 'veh-1',
      recordedKm: 246800,
      requestedKm: 246900,
      reason: 'Salah baca',
      photoPaths: ['uploads/odo/1.jpg'],
      status: 'Approved',
      submittedAt: '2026-11-18T09:00:00+00:00',
    };

    expect(toOdometerCorrection(dto).status).toBe('approved');
    expect(toOdometerCorrection({ ...dto, status: 'Rejected' }).status).toBe('rejected');
    expect(toOdometerCorrection({ ...dto, status: 'Whatever' }).status).toBe('pending');
    expect(toOdometerCorrection(dto).requestedKm).toBe(246900);
  });
});

describe('vehicle detail and trip-derived vehicle', () => {
  const vehicle: DriverVehicleWire = {
    vehicleId: 'veh-1',
    plate: 'B 9456 KJU',
    model: 'Isuzu Giga FVR',
    year: 2021,
    odometerKm: 246800,
    status: 'Active',
    fuelType: 'Diesel',
    transmission: 'Manual',
    capacityKg: 12000,
    healthScore: null,
    healthNote: null,
    specs: [{ label: 'Model', value: 'Isuzu Giga FVR' }],
  };

  it('stringifies the year and fills health defaults', () => {
    const view = toVehicleDetail(vehicle);

    expect(view.year).toBe('2021');
    expect(view.healthScore).toBeNull(); // G33 — belum dihitung, bukan 0
    expect(view.healthNote).toBe('Belum ada data kesehatan unit');
    expect(view.capacityKg).toBe(12000);
    expect(view.documents).toEqual([]);
  });

  it('falls back to em dashes when the vehicle is incomplete', () => {
    const view = toVehicleDetail({ ...vehicle, year: null, fuelType: null, capacityKg: null });

    expect(view.year).toBe('—');
    expect(view.fuelType).toBe('—');
    expect(view.capacityKg).toBe(0);
  });

  it('builds a minimal vehicle from a trip so the map has a plate', () => {
    const view = toVehicleFromTrip(trip({ vehiclePlate: null, vehicleModel: null }));

    expect(view).toEqual({
      id: 'veh-1',
      plate: '—',
      model: '—',
      type: '—',
      odometerKm: 0,
      status: 'in_use',
    });
  });
});

describe('warning history', () => {
  it('normalises a missing note', () => {
    const dto: TripWarningHistoryWire = {
      key: 'h1',
      title: 'GeofenceBreach',
      note: null,
      time: '18 Nov 09:12',
    };

    expect(toTripWarningHistory(dto)).toEqual({
      key: 'h1',
      title: 'Anda keluar dari zona rute yang ditentukan.',
      note: '',
      time: '18 Nov 09:12',
    });
  });
});

describe('damage reports and date helpers', () => {
  it('passes a damage report through unchanged', () => {
    const dto: DamageReportWire = {
      id: 'wo-1',
      vehicleId: 'veh-1',
      category: 'Ban',
      severity: 'High',
      description: 'Ban belakang kempes',
      photoPaths: ['uploads/damage/1.jpg'],
      submittedAt: '2026-11-18T09:00:00+00:00',
      code: 'WO-DRV-DEMO-001',
      status: 'Open',
      statusLabel: 'Terbuka',
    };

    expect(toDamageReport(dto)).toEqual({
      id: 'wo-1',
      vehicleId: 'veh-1',
      category: 'Ban',
      severity: 'High',
      description: 'Ban belakang kempes',
      photoUris: ['uploads/damage/1.jpg'],
      submittedAt: '2026-11-18T09:00:00+00:00',
      code: 'WO-DRV-DEMO-001',
      status: 'Open',
      statusLabel: 'Terbuka',
    });
  });

  it('formats a short date and a day-plus-time label', () => {
    expect(shortDate('2026-11-18T10:00:00+07:00')).toMatch(/2026/);
    expect(dayAndTime('2026-11-18T10:00:00+07:00')).toContain('•');
  });
});
