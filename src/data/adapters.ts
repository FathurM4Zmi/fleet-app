/**
 * Mappers from backend DTOs (`src/lib/api/types.ts`) to the view models used by
 * the screens (`src/data/types.ts`). Keeping the mapping here means screens do
 * not need to know about wire naming, enum casing, or currency formatting.
 */
import type {
  ActivityEntry as ActivityEntryWire,
  Coaching as CoachingWire,
  Compliance as ComplianceWire,
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
import { formatDate, formatDayDate, formatNumber, formatTime } from '@/lib/format';
import type {
  ActivityCategory,
  ActivityEntry,
  ActivityTone,
  CoachingMilestone,
  CoachingPlan,
  CoachingSession,
  ComplianceChecklistItem,
  DnaSummary,
  DocumentDetail,
  DocumentStatus,
  Driver,
  FuelCardAccount,
  FuelLog,
  FuelTransaction,
  FuelTxnStatus,
  IncidentRecord,
  Notification,
  OdometerCorrection,
  PerformanceKpi,
  PerformanceScore,
  PerformanceTrendPoint,
  Pod,
  RouteOption,
  SafetyCategory,
  SafetyEvent,
  ScoreComponent,
  SettlementPeriod,
  SettlementStep,
  SettlementTripLine,
  StatusDocument,
  SyncStatus,
  Trip,
  TripAsset,
  TripEvent,
  TripStatus,
  TripWarning,
  TripWarningHistoryEntry,
  Vehicle,
  VehicleDetail,
  VehicleDocument,
  VehicleStatus,
} from '@/data/types';

export const rupiah = (value: number) => `Rp ${formatNumber(Math.round(value))}`;

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const lower = (value: string | null | undefined) => (value ?? '').toLowerCase();

/* ── Trip ───────────────────────────────────────────────────────────── */

const TRIP_STATUS: Record<string, TripStatus> = {
  Scheduled: 'assigned',
  Assigned: 'assigned',
  Acknowledged: 'accepted',
  InProgress: 'in_progress',
  Completed: 'completed',
  Settled: 'completed',
  Cancelled: 'rejected',
  Declined: 'rejected',
};

export function toTrip(dto: DriverTripWire): Trip {
  const status = TRIP_STATUS[dto.status] ?? 'assigned';
  const timeline: TripEvent[] = [
    {
      id: 'assigned',
      label: 'Trip ditugaskan',
      at: dto.scheduledStart,
      done: true,
    },
    {
      id: 'accepted',
      label: 'Konfirmasi driver',
      at: dto.actualStartAt ?? dto.scheduledStart,
      done: status !== 'assigned',
    },
    {
      id: 'started',
      label: 'Mulai perjalanan',
      at: dto.actualStartAt ?? dto.scheduledStart,
      done: Boolean(dto.actualStartAt),
    },
    {
      id: 'arrived',
      label: 'Tiba di tujuan',
      at: dto.actualEndAt ?? dto.scheduledEnd,
      done: Boolean(dto.actualEndAt),
    },
  ];

  return {
    id: dto.id,
    code: dto.tripCode ?? `TRP-${dto.id.slice(0, 8).toUpperCase()}`,
    status,
    origin: dto.origin ?? '—',
    originAddress: dto.originAddress ?? '—',
    destination: dto.destination ?? '—',
    destinationAddress: dto.destinationAddress ?? '—',
    shipper: dto.shipper ?? '—',
    cargo: dto.cargo ?? '—',
    cargoNote: dto.cargoNote ?? '—',
    weightKg: dto.weightKg ?? 0,
    distanceKm: dto.plannedDistanceKm ?? dto.actualDistanceKm ?? 0,
    scheduledAt: dto.scheduledStart,
    vehicleId: dto.vehicleId,
    vehiclePlate: dto.vehiclePlate ?? undefined,
    vehicleModel: dto.vehicleModel ?? undefined,
    driverId: '',
    recipient: {
      name: dto.recipientName ?? '—',
      role: dto.recipientRole ?? 'Penerima',
      initials: initialsOf(dto.recipientName ?? '—'),
    },
    instruction: dto.instruction ?? undefined,
    timeline,
    rejectReason: dto.declineReason ?? undefined,
    preTripDone: dto.preTripDone,
    postTripDone: dto.postTripDone,
  };
}

export function toVehicleFromTrip(dto: DriverTripWire): Vehicle {
  return {
    id: dto.vehicleId,
    plate: dto.vehiclePlate ?? '—',
    model: dto.vehicleModel ?? '—',
    type: '—',
    odometerKm: 0,
    status: 'in_use',
  };
}

/* ── Driver & vehicle ───────────────────────────────────────────────── */

export function toDriver(me: DriverMeWire, dnaScore = 0): Driver {
  return {
    id: me.driverId,
    name: me.name,
    initials: initialsOf(me.name),
    phone: me.phone ?? '—',
    employeeId: me.loginIdentifier ?? '—',
    site: '—',
    licenseNo: me.licenseNumber,
    licenseExpiry: me.licenseExpiryDate ?? '',
    status: lower(me.status) === 'active' ? 'active' : 'inactive',
    dnaScore,
  };
}

const VEHICLE_STATUS: Record<string, VehicleStatus> = {
  Available: 'available',
  InUse: 'in_use',
  OutOfService: 'blocked',
  Maintenance: 'blocked',
};

export function toVehicle(dto: DriverVehicleWire): Vehicle {
  return {
    id: dto.vehicleId,
    plate: dto.plate,
    model: dto.model ?? '—',
    type: dto.fuelType ?? '—',
    odometerKm: Number(dto.odometerKm),
    status: VEHICLE_STATUS[dto.status] ?? 'available',
    blockedReason: dto.healthNote ?? undefined,
  };
}

export function toVehicleDetail(dto: DriverVehicleWire, documents: VehicleDocument[] = []): VehicleDetail {
  return {
    vehicleId: dto.vehicleId,
    fuelType: dto.fuelType ?? '—',
    transmission: dto.transmission ?? '—',
    year: dto.year ? String(dto.year) : '—',
    healthScore: dto.healthScore ?? 0,
    healthNote: dto.healthNote ?? 'Belum ada data kesehatan unit',
    healthDelta: '—',
    capacityKg: dto.capacityKg ? Number(dto.capacityKg) : 0,
    specs: dto.specs,
    documents,
    maintenance: [],
  };
}

/* ── DVIR / POD ─────────────────────────────────────────────────────── */

/** Wire shape stored in `checklist_json` by the mobile form. */
export interface ChecklistEntry {
  id: string;
  label: string;
  group: string;
  result: 'pass' | 'fail' | 'na' | null;
  note?: string;
  photoPath?: string;
}

export function parseChecklist(json: string | null | undefined): ChecklistEntry[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as ChecklistEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeChecklist(items: ChecklistEntry[]): string {
  return JSON.stringify(items);
}

export function toDvir(dto: DvirWire) {
  const checklist = parseChecklist(dto.checklistJson);
  return {
    id: dto.id,
    tripId: '',
    type: lower(dto.inspectionType) === 'pretrip' ? ('pre' as const) : ('post' as const),
    items: checklist.map((entry) => ({
      id: entry.id,
      label: entry.label,
      group: entry.group,
      result: entry.result,
      note: entry.note,
      photoUri: entry.photoPath,
    })),
    odometerKm: Number(dto.odometerKm),
    status:
      lower(dto.status) === 'passed' ? ('passed' as const)
      : lower(dto.status) === 'failed' ? ('failed' as const)
      : ('submitted' as const),
    submittedAt: dto.submittedAt,
    defects: dto.defects ?? undefined,
    photoPaths: dto.photoPaths,
  };
}

export function toPod(dto: DriverTaskWire): Pod {
  return {
    id: dto.id,
    tripId: dto.tripId ?? '',
    photoUris: dto.podPhotoPath ? [dto.podPhotoPath] : [],
    hasSignature: Boolean(dto.podSignaturePath),
    recipientName: dto.customerName,
    geo: { lat: Number(dto.podLatitude ?? 0), lng: Number(dto.podLongitude ?? 0) },
    capturedAt: dto.podCapturedAt ?? dto.deliveredAt ?? dto.scheduledDate,
    syncStatus: (lower(dto.status) === 'delivered' ? 'synced' : 'pending') as SyncStatus,
  };
}

/* ── Notifikasi ─────────────────────────────────────────────────────── */

const NOTIFICATION_TYPE: Record<string, Notification['type']> = {
  Trip: 'trip',
  Alert: 'alert',
  Geofence: 'alert',
  Document: 'document',
  Coaching: 'coaching',
  System: 'system',
  Maintenance: 'system',
};

export function toNotification(dto: {
  id: string;
  title: string;
  message: string;
  notificationType: string;
  severity: string;
  sourceType: string | null;
  sourceId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}): Notification {
  return {
    id: dto.id,
    type: NOTIFICATION_TYPE[dto.notificationType] ?? 'system',
    title: dto.title,
    body: dto.message,
    severity:
      lower(dto.severity) === 'critical' ? 'critical'
      : lower(dto.severity) === 'warning' ? 'warning'
      : 'info',
    tripId: lower(dto.sourceType ?? '') === 'trip' ? dto.sourceId ?? undefined : undefined,
    readAt: dto.readAt ?? undefined,
    createdAt: dto.createdAt,
  };
}

/* ── Kinerja / DNA / aktivitas ──────────────────────────────────────── */

export function toPerformance(dto: PerformanceWire): {
  kpis: PerformanceKpi[];
  trend: PerformanceTrendPoint[];
  score: PerformanceScore;
} {
  return {
    kpis: dto.kpis.map((kpi) => ({
      key: kpi.key,
      label: kpi.label,
      value: kpi.value,
      unit: kpi.unit ?? undefined,
      delta: kpi.delta ?? undefined,
      deltaTone:
        lower(kpi.deltaTone) === 'success' ? 'success'
        : lower(kpi.deltaTone) === 'warning' ? 'warning'
        : undefined,
      note: kpi.note,
    })),
    trend: dto.trend,
    score: dto.score,
  };
}

export function toDna(dto: DnaWire): DnaSummary {
  return {
    score: dto.score,
    delta: dto.delta,
    weeksTracked: dto.weeksTracked,
    tier: dto.tier,
    fleetAverage: dto.fleetAverage,
    updatedAt: dto.updatedAt,
    trend: dto.trend,
    components: dto.components.map(
      (component): ScoreComponent => ({
        key: component.key,
        label: component.label,
        score: component.score,
        band: component.band,
        tone: lower(component.tone) === 'success' ? 'success' : 'warning',
      }),
    ),
    insight: dto.insight,
  };
}

const ACTIVITY_TONE: Record<string, ActivityTone> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
};

export function toActivity(dto: ActivityEntryWire): ActivityEntry {
  const category = lower(dto.category);
  return {
    key: dto.key,
    category: (['login', 'dvir', 'pod', 'fuel', 'trip'].includes(category)
      ? category
      : 'trip') as ActivityCategory,
    title: dto.title,
    detail: dto.detail,
    time: dto.time,
    tone: ACTIVITY_TONE[lower(dto.tone)] ?? 'info',
  };
}

/* ── Coaching ───────────────────────────────────────────────────────── */

const MILESTONE_STATE = (state: string): CoachingMilestone['state'] => {
  const value = lower(state);
  if (value === 'done' || value === 'selesai') return 'done';
  if (value === 'locked' || value === 'terkunci') return 'locked';
  return 'waiting';
};

const SESSION_STATUS = (status: string): CoachingSession['status'] =>
  lower(status).startsWith('cancel') ? 'cancelled' : 'done';

export function toCoaching(dto: CoachingWire): {
  plan: CoachingPlan | null;
  sessions: CoachingSession[];
  milestones: CoachingMilestone[];
} {
  const milestones: CoachingMilestone[] = (dto.plan?.milestones ?? []).map((m) => ({
    key: m.key,
    label: m.label,
    state: MILESTONE_STATE(m.state),
    note: m.note,
  }));

  return {
    plan: dto.plan
      ? {
          id: dto.plan.id,
          title: dto.plan.title,
          description: dto.plan.description,
          targetDate: dto.plan.targetDate,
          milestones,
        }
      : null,
    sessions: dto.sessions.map((s) => ({
      key: s.key,
      title: s.title,
      note: s.note,
      status: SESSION_STATUS(s.status),
      statusLabel: s.statusLabel,
    })),
    milestones,
  };
}

/* ── Kepatuhan / safety ─────────────────────────────────────────────── */

const DOC_STATUS = (status: string): DocumentStatus => {
  const value = lower(status);
  if (value.startsWith('expired') || value === 'kedaluwarsa') return 'expired';
  if (value.startsWith('expiring') || value === 'segera') return 'expiring';
  return 'valid';
};

export function toComplianceDocuments(
  summaries: DocumentSummaryWire[],
): StatusDocument[] {
  return summaries.map((summary) => ({
    key: summary.key,
    title: summary.title,
    note: summary.note,
    status: DOC_STATUS(summary.status),
    statusLabel: summary.statusLabel,
    hint: summary.hint ?? undefined,
  }));
}

export function toChecklist(dto: ComplianceWire): ComplianceChecklistItem[] {
  return dto.checklist;
}

export function toIncidents(dto: ComplianceWire): IncidentRecord[] {
  return dto.incidents.map((incident) => ({
    key: incident.key,
    date: incident.date,
    title: incident.title,
    status: incident.statusLabel,
  }));
}

const SAFETY_CATEGORY: Record<string, SafetyCategory> = {
  rem: 'rem',
  braking: 'rem',
  kecepatan: 'kecepatan',
  speed: 'kecepatan',
  efektifitas: 'efektifitas',
  efficiency: 'efektifitas',
};

export function toSafetyEvent(dto: SafetyEventWire): SafetyEvent {
  const category = lower(dto.category);
  return {
    key: dto.key,
    category: SAFETY_CATEGORY[category] ?? 'lainnya',
    categoryLabel: dto.categoryLabel,
    severity:
      lower(dto.severity) === 'critical' ? 'critical'
      : lower(dto.severity) === 'warning' ? 'warning'
      : 'info',
    title: dto.title,
    location: dto.location ?? '—',
    time: dto.time,
    metric: dto.metric,
    metricNote: dto.metricNote,
    hasPhoto: dto.hasPhoto,
  };
}

/* ── BBM ────────────────────────────────────────────────────────────── */

export function toFuelLog(dto: FuelLogWire): FuelLog {
  return {
    id: dto.id,
    vehicleId: dto.vehicleId,
    liters: Number(dto.liters),
    odometerKm: Number(dto.odometerKm),
    pricePerLiter: Number(dto.pricePerLiter),
    station: dto.station ?? '—',
    receiptUri: dto.receiptPath ?? undefined,
    createdAt: dto.createdAt,
    syncStatus: (lower(dto.syncStatus) === 'pending' ? 'pending' : 'synced') as SyncStatus,
  };
}

export function toFuelCard(dto: FuelCardWire): FuelCardAccount {
  return {
    number: dto.number,
    holder: dto.holder,
    limit: Number(dto.limit),
    remaining: Number(dto.remaining),
    used: Number(dto.used),
    resetDay: dto.resetDay,
    status: lower(dto.status) === 'active' ? 'active' : 'blocked',
  };
}

const FUEL_TXN_STATUS: Record<string, FuelTxnStatus> = {
  reconciled: 'reconciled',
  pending: 'pending',
  flagged: 'flagged',
};

export function toFuelTransaction(dto: FuelTransactionWire): FuelTransaction {
  return {
    key: dto.key,
    station: dto.station,
    dateLabel: dto.dateLabel,
    liters: Number(dto.liters),
    amount: rupiah(Number(dto.amount)),
    status: FUEL_TXN_STATUS[lower(dto.status)] ?? 'pending',
    statusLabel: dto.statusLabel,
    note: dto.note ?? undefined,
  };
}

/* ── Kendaraan: koreksi odometer & dokumen ──────────────────────────── */

export function toOdometerCorrection(dto: OdometerWire): OdometerCorrection {
  return {
    id: dto.id,
    vehicleId: dto.vehicleId,
    recordedKm: Number(dto.recordedKm),
    requestedKm: Number(dto.requestedKm),
    reason: dto.reason,
    photoUris: dto.photoPaths,
    status:
      lower(dto.status) === 'approved' ? 'approved'
      : lower(dto.status) === 'rejected' ? 'rejected'
      : 'pending',
    submittedAt: dto.submittedAt,
  };
}

export function toDocumentDetail(dto: DocumentDetailWire): DocumentDetail {
  return {
    key: dto.key,
    title: dto.title,
    subtitle: dto.subtitle,
    updatedNote: dto.updatedNote,
    cardLabel: dto.cardLabel,
    cardNumber: dto.cardNumber,
    holderName: dto.holderName,
    status: DOC_STATUS(dto.status),
    statusLabel: dto.statusLabel,
    rows: dto.rows.map((row, index) => ({
      key: `${dto.key}-${index}`,
      label: row.label,
      value: row.value,
      mono: row.mono,
      badge: row.badge,
    })),
  };
}

export function toVehicleDocument(dto: DocumentSummaryWire): VehicleDocument {
  return {
    key: dto.key,
    label: dto.title,
    note: dto.note,
    status: DOC_STATUS(dto.status),
    statusLabel: dto.statusLabel,
  };
}

/* ── Rute / warning / aset ──────────────────────────────────────────── */

export function toRouteOption(dto: RouteOptionWire): RouteOption {
  return {
    key: dto.key,
    title: dto.title,
    subtitle: dto.subtitle,
    minutes: dto.minutes,
    km: Number(dto.km),
    tag: dto.tag ?? undefined,
    statusLabel: dto.statusLabel,
    statusTone:
      lower(dto.statusTone) === 'success' ? 'success'
      : lower(dto.statusTone) === 'warning' ? 'warning'
      : 'neutral',
    recommended: dto.recommended,
  };
}

export function toTripWarning(dto: TripWarningWire): TripWarning {
  return {
    key: dto.key,
    severity:
      lower(dto.severity) === 'critical' ? 'critical'
      : lower(dto.severity) === 'warning' ? 'warning'
      : 'info',
    severityLabel: dto.severityLabel,
    title: dto.title,
    note: dto.note ?? '',
    sla: dto.sla ?? undefined,
    timeLabel: dto.timeLabel ?? undefined,
    suggestsRoute: dto.suggestsRoute,
  };
}

export function toTripWarningHistory(dto: TripWarningHistoryWire): TripWarningHistoryEntry {
  return { key: dto.key, title: dto.title, note: dto.note ?? '', time: dto.time };
}

export function toTripAsset(dto: TripAssetWire): TripAsset {
  return {
    key: dto.key,
    code: dto.code,
    name: dto.name,
    statusLabel: dto.statusLabel,
    statusTone: lower(dto.statusTone) === 'success' ? 'success' : 'warning',
    footNote: dto.footNote,
    footIcon: lower(dto.footIcon) === 'lock' ? 'lock' : 'search',
  };
}

/* ── Settlement ─────────────────────────────────────────────────────── */

export function toSettlement(dto: SettlementWire): {
  summary: {
    period: string;
    total: string;
    status: string;
    paidNote: string;
    punctuality: string;
  };
  lines: SettlementTripLine[];
  history: SettlementPeriod[];
  steps: SettlementStep[];
} {
  const current = dto.periods[0];
  return {
    summary: {
      period: current?.label ?? 'Periode berjalan',
      total: rupiah(Number(dto.amount)),
      status: dto.status,
      paidNote: `${dto.tripCount} trip selesai`,
      punctuality: 'Estimasi',
    },
    lines: dto.lines.map((line) => ({
      key: line.key,
      destination: line.destination,
      meta: line.meta,
      amount: rupiah(Number(line.amount)),
    })),
    history: dto.periods.map((period) => ({
      key: period.key,
      label: period.label,
      amount: rupiah(Number(period.amount)),
      status: period.status,
    })),
    steps: dto.steps.map((step) => ({
      key: step.key,
      label: step.label,
      state: SETTLEMENT_STEP_STATE(step.state),
    })),
  };
}

const SETTLEMENT_STEP_STATE = (state: string): SettlementStep['state'] => {
  const value = lower(state);
  if (value === 'done' || value === 'selesai') return 'done';
  if (value === 'active' || value === 'berjalan') return 'active';
  return 'upcoming';
};

/* ── Misc ───────────────────────────────────────────────────────────── */

export const shortDate = (iso: string) => formatDate(iso);
export const dayAndTime = (iso: string) => `${formatDayDate(iso)} • ${formatTime(iso)}`;
