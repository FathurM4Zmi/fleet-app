/**
 * Wire types for `GenZysFleetOps-be` `/api/driver`.
 *
 * Mirrors the C# records one-for-one (camelCase JSON). Keep this file in sync
 * with `GenZysFleetOps.Api/Controllers/DriverAppController.cs` and the feature
 * slices under `Modules/<module>/Features/Driver*.cs`.
 */

export type TripStatusWire =
  | 'Scheduled'
  | 'Assigned'
  | 'Acknowledged'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'Settled'
  | 'Declined';

export interface DriverMe {
  driverId: string;
  name: string;
  licenseNumber: string;
  phone: string | null;
  status: string;
  licenseExpiryDate: string | null;
  loginIdentifier: string | null;
  lastLoginAt: string | null;
  appAccessActive: boolean;
}

export interface DriverTrip {
  id: string;
  vehicleId: string;
  vehiclePlate: string | null;
  vehicleModel: string | null;
  tripCode: string | null;
  origin: string | null;
  originAddress: string | null;
  destination: string | null;
  destinationAddress: string | null;
  shipper: string | null;
  cargo: string | null;
  cargoNote: string | null;
  weightKg: number | null;
  plannedDistanceKm: number | null;
  recipientName: string | null;
  recipientRole: string | null;
  instruction: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  status: TripStatusWire;
  actualStartAt: string | null;
  actualEndAt: string | null;
  actualDistanceKm: number | null;
  declineReason: string | null;
  preTripDone: boolean;
  postTripDone: boolean;
}

export interface DriverHome {
  profile: DriverMe;
  upcomingTrips: DriverTrip[];
  unreadNotifications: number;
  pendingDvir: number;
  openTasks: number;
}

export interface LoginResponse {
  requiresTwoFactor: boolean;
  twoFactorChallengeToken: string | null;
  token: string | null;
  expiresAt: string | null;
  user: { id: string; email: string; fullName: string; role: string; isActive: boolean } | null;
}

export interface OtpRequestResult {
  sent: boolean;
  expiresAt: string | null;
  devCode: string | null;
}

export interface DvirRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string | null;
  inspectionType: string;
  odometerKm: number;
  status: string;
  submittedAt: string;
  defects: string | null;
  photoPaths: string[];
  checklistJson: string | null;
}

export interface DvirQueueItem {
  tripId: string;
  vehicleId: string;
  vehiclePlate: string | null;
  requiredType: string;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface DriverTask {
  id: string;
  tripId: string | null;
  customerName: string;
  customerPhone: string;
  address: string;
  scheduledDate: string;
  status: string;
  deliveredAt: string | null;
  podPhotoPath: string | null;
  podSignaturePath: string | null;
  podNotes: string | null;
  podLatitude: number | null;
  podLongitude: number | null;
  podCapturedAt: string | null;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  notificationType: string;
  severity: string;
  templateCode: string | null;
  sourceType: string | null;
  sourceId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  unread?: number;
}

export interface TrackingPoint {
  latitude: number;
  longitude: number;
  speed: number | null;
  at: string;
}

export interface TripTracking {
  tripId: string;
  vehicleId: string;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  lastSeenAt: string | null;
  isLive: boolean;
  trail: TrackingPoint[];
}

export interface RouteOption {
  key: string;
  title: string;
  subtitle: string;
  minutes: number;
  km: number;
  tag: string | null;
  statusLabel: string;
  statusTone: string;
  recommended: boolean;
  selected: boolean;
}

export interface TripWarning {
  key: string;
  severity: string;
  severityLabel: string;
  title: string;
  note: string | null;
  sla: string | null;
  timeLabel: string | null;
  suggestsRoute: boolean;
}

export interface TripWarningHistory {
  key: string;
  title: string;
  note: string | null;
  time: string;
}

export interface TripWarnings {
  active: TripWarning[];
  history: TripWarningHistory[];
}

export interface TripAsset {
  key: string;
  code: string;
  name: string;
  statusLabel: string;
  statusTone: string;
  footNote: string;
  footIcon: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  odometerKm: number;
  pricePerLiter: number;
  station: string | null;
  receiptPath: string | null;
  createdAt: string;
  syncStatus: string;
}

export interface FuelCard {
  number: string;
  holder: string;
  limit: number;
  remaining: number;
  used: number;
  resetDay: number;
  status: string;
}

export interface FuelTransaction {
  key: string;
  station: string;
  dateLabel: string;
  liters: number;
  amount: number;
  status: string;
  statusLabel: string;
  note: string | null;
}

export interface CoachingMilestone {
  key: string;
  label: string;
  state: string;
  note: string;
}

export interface CoachingPlan {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  milestones: CoachingMilestone[];
}

export interface CoachingSession {
  key: string;
  title: string;
  note: string;
  status: string;
  statusLabel: string;
}

export interface Coaching {
  plan: CoachingPlan | null;
  sessions: CoachingSession[];
}

export interface PerformanceKpi {
  key: string;
  label: string;
  value: string;
  unit: string | null;
  delta: string | null;
  deltaTone: string | null;
  note: string;
}

export interface PerformanceTrendPoint {
  day: string;
  trips: number;
  onTimePercent: number;
}

export interface PerformanceScore {
  value: number;
  max: number;
  fleetAverage: number;
  fleetDelta: number;
  verified: boolean;
}

export interface Performance {
  kpis: PerformanceKpi[];
  trend: PerformanceTrendPoint[];
  score: PerformanceScore;
}

export interface ActivityEntry {
  key: string;
  category: string;
  title: string;
  detail: string;
  time: string;
  tone: string;
}

export interface DnaComponent {
  key: string;
  label: string;
  score: number;
  band: string;
  tone: string;
}

export interface DnaTrendPoint {
  label: string;
  score: number;
}

export interface Dna {
  score: number;
  delta: number;
  weeksTracked: number;
  tier: string;
  fleetAverage: number;
  updatedAt: string;
  trend: DnaTrendPoint[];
  components: DnaComponent[];
  insight: { title: string; body: string };
}

export interface DamageReport {
  id: string;
  code: string;
  vehicleId: string;
  category: string;
  severity: string;
  description: string;
  photoPaths: string[];
  submittedAt: string;
  status: string;
  statusLabel: string;
}

export interface SafetyEvent {
  key: string;
  category: string;
  categoryLabel: string;
  severity: string;
  title: string;
  location: string | null;
  time: string;
  metric: string;
  metricNote: string;
  hasPhoto: boolean;
}

export interface ComplianceItem {
  key: string;
  label: string;
  done: boolean;
}

export interface IncidentRow {
  key: string;
  date: string;
  title: string;
  status: string;
  statusLabel: string;
  severity: string;
  location: string | null;
}

export interface Compliance {
  checklist: ComplianceItem[];
  incidents: IncidentRow[];
}

export interface VehicleSpec {
  label: string;
  value: string;
}

export interface DriverVehicle {
  vehicleId: string;
  plate: string;
  model: string | null;
  year: number | null;
  odometerKm: number;
  status: string;
  fuelType: string | null;
  transmission: string | null;
  capacityKg: number | null;
  healthScore: number | null;
  healthNote: string | null;
  specs: VehicleSpec[];
}

export interface OdometerCorrection {
  id: string;
  vehicleId: string;
  recordedKm: number;
  requestedKm: number;
  reason: string;
  photoPaths: string[];
  status: string;
  submittedAt: string;
}

export interface DriverDocumentRow {
  label: string;
  value: string;
  mono: boolean;
  badge: boolean;
}

export interface DriverDocumentDetail {
  key: string;
  title: string;
  subtitle: string;
  updatedNote: string;
  cardLabel: string;
  cardNumber: string;
  holderName: string;
  status: string;
  statusLabel: string;
  rows: DriverDocumentRow[];
}

export interface DriverDocumentSummary {
  key: string;
  title: string;
  note: string;
  status: string;
  statusLabel: string;
  hint: string | null;
}

export interface SettlementLine {
  key: string;
  destination: string;
  meta: string;
  amount: number;
}

export interface SettlementPeriod {
  key: string;
  label: string;
  amount: number;
  status: string;
}

export interface SettlementStep {
  key: string;
  label: string;
  state: string;
}

export interface Settlement {
  amount: number;
  tripCount: number;
  status: string;
  periods: SettlementPeriod[];
  lines: SettlementLine[];
  steps: SettlementStep[];
}

export interface UploadResult {
  path: string;
  url: string;
}
