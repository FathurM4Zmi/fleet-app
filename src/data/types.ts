/**
 * View models for the FleetOps Driver app.
 *
 * These shapes are produced by `src/data/adapters.ts` from the API DTOs in
 * `src/lib/api/types.ts`; screens never consume raw wire objects.
 */

export type DriverStatus = 'active' | 'inactive';

export interface Driver {
  id: string;
  name: string;
  /** Two-letter initials used by the avatar. */
  initials: string;
  phone: string;
  employeeId: string;
  site: string;
  /** SIM (driving licence) number. */
  licenseNo: string;
  /** ISO date. */
  licenseExpiry: string;
  status: DriverStatus;
  /** 0–100 composite health score (module M13). */
  dnaScore: number;
}

export type VehicleStatus = 'available' | 'in_use' | 'blocked';

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: string;
  odometerKm: number;
  status: VehicleStatus;
  /** Set when a failed DVIR has blocked the unit. */
  blockedReason?: string;
}

export type TripStatus =
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface TripEvent {
  id: string;
  label: string;
  /** ISO datetime. */
  at: string;
  done: boolean;
}

export interface TripRecipient {
  name: string;
  role: string;
  initials: string;
}

export interface Trip {
  id: string;
  /** Human readable trip number, e.g. `TRP-2026-1042`. */
  code: string;
  status: TripStatus;
  origin: string;
  originAddress: string;
  destination: string;
  destinationAddress: string;
  shipper: string;
  cargo: string;
  /** Free-text manifest detail, e.g. seal number. */
  cargoNote: string;
  weightKg: number;
  distanceKm: number;
  /** ISO datetime. */
  scheduledAt: string;
  vehicleId: string;
  /** Plate/model come from the trip response so list cards avoid a second fetch. */
  vehiclePlate?: string;
  vehicleModel?: string;
  driverId: string;
  recipient: TripRecipient;
  /** Handover instruction shown to the driver, e.g. gate number. */
  instruction?: string;
  timeline: TripEvent[];
  rejectReason?: string;
  /** False until the pre-trip DVIR has been submitted. */
  preTripDone: boolean;
  /** False until the post-trip DVIR has been submitted. */
  postTripDone: boolean;
}

export type DvirResult = 'pass' | 'fail' | 'na';

export interface DvirItem {
  id: string;
  label: string;
  /** Grouping heading in the form, e.g. `Kelistrikan`. */
  group: string;
  result: DvirResult | null;
  note?: string;
  /** Local file URI. Required when `result === 'fail'`. */
  photoUri?: string;
}

export type DvirStatus = 'draft' | 'submitted' | 'passed' | 'failed';

export interface DvirInspection {
  id: string;
  tripId: string;
  type: 'pre' | 'post';
  items: DvirItem[];
  odometerKm: number;
  status: DvirStatus;
  /** ISO datetime. */
  submittedAt?: string;
}

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface Pod {
  id: string;
  tripId: string;
  /** Local file URIs of the captured documentation photos. */
  photoUris: string[];
  /** `true` once the recipient signature has been captured. */
  hasSignature: boolean;
  recipientName: string;
  scannedCode?: string;
  geo: { lat: number; lng: number };
  /** ISO datetime. */
  capturedAt: string;
  syncStatus: SyncStatus;
}

export type NotificationSeverity = 'info' | 'warning' | 'critical';

export interface Notification {
  id: string;
  type: 'trip' | 'alert' | 'document' | 'coaching' | 'system';
  title: string;
  body: string;
  severity: NotificationSeverity;
  tripId?: string;
  /** ISO datetime, absent when unread. */
  readAt?: string;
  /** ISO datetime. */
  createdAt: string;
}

export interface AuthSession {
  driverId: string;
  token: string;
  /** ISO datetime. */
  issuedAt: string;
}

/** A headline tile on the Ringkasan Kinerja grid (M10). */
export interface PerformanceKpi {
  key: string;
  label: string;
  value: string;
  /** Unit rendered beside the value, e.g. `km`. */
  unit?: string;
  /** Signed change chip, e.g. `+3`. */
  delta?: string;
  deltaTone?: 'success' | 'warning';
  /** Caption under the value, e.g. `Target: 10 trip`. */
  note: string;
}

/** One day on the 7-day performance trend chart. */
export interface PerformanceTrendPoint {
  /** Short Indonesian day label, e.g. `Sen`. */
  day: string;
  trips: number;
  onTimePercent: number;
}

export interface PerformanceScore {
  value: number;
  max: number;
  fleetAverage: number;
  /** Difference against the fleet average, in points. */
  fleetDelta: number;
  verified: boolean;
}

/** One scored parameter of the driver DNA breakdown (M13). */
export interface ScoreComponent {
  key: string;
  label: string;
  score: number;
  /** Short qualitative band, e.g. `Sangat Baik`. */
  band: string;
  tone: 'success' | 'warning';
}

/** One point on the 12-week DNA trend chart. */
export interface DnaTrendPoint {
  /** Axis label, e.g. `M3`. */
  label: string;
  score: number;
}

export type DocumentStatus = 'valid' | 'expiring' | 'expired';

/** A licence, certificate, or training record (M16 / M20). */
export interface StatusDocument {
  key: string;
  title: string;
  note: string;
  status: DocumentStatus;
  statusLabel: string;
  /** Trailing hint on the coaching cards, e.g. `Aktif`. */
  hint?: string;
}

export type CoachingMilestoneState = 'done' | 'waiting' | 'locked';

export interface CoachingMilestone {
  key: string;
  label: string;
  state: CoachingMilestoneState;
  /** e.g. `Selesai 10 Apr` or `Menunggu peninjauan`. */
  note: string;
}

export interface CoachingPlan {
  id: string;
  title: string;
  description: string;
  /** e.g. `25 Apr`. */
  targetDate: string;
  milestones: CoachingMilestone[];
}

export interface CoachingSession {
  key: string;
  title: string;
  note: string;
  status: 'done' | 'cancelled';
  statusLabel: string;
}

export interface ComplianceChecklistItem {
  key: string;
  label: string;
  done: boolean;
}

export interface IncidentRecord {
  key: string;
  /** e.g. `28 Agu 2026`. */
  date: string;
  title: string;
  status: string;
}

/**
 * A safety incident filed by the driver (M16). Immutable once submitted —
 * corrections are made through a follow-up report (FRD-MOB-CMP-03).
 */
export interface IncidentReport {
  id: string;
  category: string;
  severity: string;
  location: string;
  /** Narrative timeline of what happened. */
  chronology: string;
  description: string;
  /** Local file URIs. At least one is mandatory (FRD-MOB-CMP-04). */
  photoUris: string[];
  /** ISO datetime. */
  submittedAt: string;
}

export type ActivityCategory = 'login' | 'dvir' | 'pod' | 'fuel' | 'trip';

export type ActivityTone = 'success' | 'info' | 'warning';

/** One row on the Aktivitas Saya audit trail (M11). */
export interface ActivityEntry {
  key: string;
  category: ActivityCategory;
  title: string;
  detail: string;
  /** e.g. `08:02`. */
  time: string;
  tone: ActivityTone;
}

export type SettlementStepState = 'done' | 'active' | 'upcoming';

export interface SettlementStep {
  key: string;
  label: string;
  state: SettlementStepState;
}

/** One trip line inside a settlement period (M15). */
export interface SettlementTripLine {
  key: string;
  destination: string;
  /** e.g. `ID: TRP-88210 • 03 Feb`. */
  meta: string;
  /** Pre-formatted rupiah amount. */
  amount: string;
}

export interface SettlementPeriod {
  key: string;
  label: string;
  /** Pre-formatted rupiah amount. */
  amount: string;
  status: string;
}

export interface DnaSummary {
  score: number;
  /** Change against the previous period, in points. */
  delta: number;
  weeksTracked: number;
  tier: string;
  fleetAverage: number;
  /** ISO datetime of the last recalculation. */
  updatedAt: string;
  trend: DnaTrendPoint[];
  components: ScoreComponent[];
  /** Explanation for the latest drop. */
  insight: { title: string; body: string };
}

/* ------------------------------------------------------------------ *
 * Batch 3 — fuel, notification detail, documents, vehicle, safety,
 * and trip operations (route / warnings / assets).
 * ------------------------------------------------------------------ */

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  odometerKm: number;
  /** Rupiah per litre. */
  pricePerLiter: number;
  station: string;
  /** Local file URI of the receipt photo. Required for audit. */
  receiptUri?: string;
  /** ISO datetime. */
  createdAt: string;
  syncStatus: SyncStatus;
}

export interface OdometerCorrection {
  id: string;
  vehicleId: string;
  /** The value currently on record. */
  recordedKm: number;
  /** The value the driver is asking for. */
  requestedKm: number;
  reason: string;
  photoUris: string[];
  status: 'pending' | 'approved' | 'rejected';
  /** ISO datetime. */
  submittedAt: string;
}

export interface DamageReport {
  id: string;
  vehicleId: string;
  category: string;
  severity: string;
  description: string;
  photoUris: string[];
  /** ISO datetime. */
  submittedAt: string;
}

export interface FuelCardAccount {
  /** Masked card number, e.g. `4821 •••• •••• 7734`. */
  number: string;
  holder: string;
  /** Rupiah monthly limit. */
  limit: number;
  /** Rupiah left in the current cycle. */
  remaining: number;
  /** Rupiah already spent in the current cycle. */
  used: number;
  /** Day of month the quota resets. */
  resetDay: number;
  status: 'active' | 'blocked';
}

export type FuelTxnStatus = 'reconciled' | 'pending' | 'flagged';

export interface FuelTransaction {
  key: string;
  station: string;
  /** e.g. `13 Okt`. */
  dateLabel: string;
  liters: number;
  /** Pre-formatted rupiah amount. */
  amount: string;
  status: FuelTxnStatus;
  statusLabel: string;
  /** Muted footnote under flagged rows. */
  note?: string;
}

export interface WorkOrder {
  code: string;
  note: string;
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'critical';
}

export type NotificationTone = 'critical' | 'warning' | 'info' | 'success';

/** One node on the notification detail activity track. */
export interface NotificationNode {
  key: string;
  label: string;
  note: string;
  /** e.g. `08:12`. */
  time: string;
  tone: NotificationTone;
}

/** Extra context rendered by the notification detail screen. */
export interface NotificationDetail {
  notificationId: string;
  vehicleId?: string;
  /** Opens the document detail screen from the footer CTA. */
  documentKey?: string;
  defect?: string;
  /** e.g. `Terdeteksi saat DVIR Pre-Trip, 13 Okt 2026 08:12`. */
  detectedNote?: string;
  workOrder?: WorkOrder;
  impact?: string;
  timeline: NotificationNode[];
}

export interface DocumentRow {
  key: string;
  label: string;
  value: string;
  /** Renders the value in a monospaced face. */
  mono?: boolean;
  /** Renders the value as a small primary badge. */
  badge?: boolean;
}

export interface DocumentDetail {
  key: string;
  /** Short title, e.g. `SIM`. */
  title: string;
  subtitle: string;
  /** e.g. `Diperbarui 12 Sep 2025`. */
  updatedNote: string;
  /** Card header label, e.g. `KARTU SIM PENGEMUDI`. */
  cardLabel: string;
  cardNumber: string;
  holderName: string;
  status: DocumentStatus;
  statusLabel: string;
  warning?: { title: string; body: string };
  rows: DocumentRow[];
}

export interface VehicleSpec {
  label: string;
  value: string;
}

export interface VehicleDocument {
  key: string;
  label: string;
  note: string;
  status: DocumentStatus;
  statusLabel: string;
}

export interface MaintenanceRecord {
  key: string;
  /** Work-order code, e.g. `WO-2026-0812`. */
  code: string;
  title: string;
  /** e.g. `10 Okt 2026`. */
  date: string;
  statusLabel: string;
  /** Highlighted (upcoming) rows use the primary tone. */
  upcoming?: boolean;
}

export interface VehicleDetail {
  vehicleId: string;
  fuelType: string;
  transmission: string;
  year: string;
  /** 0–100 health score. */
  healthScore: number;
  healthNote: string;
  healthDelta: string;
  capacityKg: number;
  specs: VehicleSpec[];
  documents: VehicleDocument[];
  maintenance: MaintenanceRecord[];
}

export type SafetyCategory = 'rem' | 'kecepatan' | 'efektifitas' | 'lainnya';

export interface SafetyEvent {
  key: string;
  category: SafetyCategory;
  categoryLabel: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  /** e.g. `09:42`. */
  time: string;
  /** Highlighted metric, e.g. `-8.4 m/s²`. */
  metric: string;
  metricNote: string;
  /** Renders a photo thumbnail tile when true. */
  hasPhoto: boolean;
}

/** One selectable route on the Pilih Rute screen. */
export interface RouteOption {
  key: string;
  title: string;
  subtitle: string;
  minutes: number;
  km: number;
  /** Small tag at the top-right, e.g. `Hemat Tarif Tol`. */
  tag?: string;
  /** Operational status line at the bottom. */
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'neutral';
  recommended?: boolean;
}

export type TripWarningSeverity = 'critical' | 'warning' | 'info';

export interface TripWarning {
  key: string;
  severity: TripWarningSeverity;
  /** e.g. `KRITIS`. */
  severityLabel: string;
  title: string;
  note: string;
  /** SLA countdown, e.g. `SLA 00:14:22`. */
  sla?: string;
  /** e.g. `Baru saja`. */
  timeLabel?: string;
  /** Renders the "rute alternatif" tile when true. */
  suggestsRoute?: boolean;
}

export interface TripWarningHistoryEntry {
  key: string;
  title: string;
  note: string;
  /** e.g. `09:15, 13 Okt`. */
  time: string;
}

export interface TripAsset {
  key: string;
  code: string;
  name: string;
  statusLabel: string;
  statusTone: 'success' | 'warning';
  /** Footer line, e.g. `Terkunci`. */
  footNote: string;
  /** Icon shown beside the footer note. */
  footIcon: 'lock' | 'search';
}
