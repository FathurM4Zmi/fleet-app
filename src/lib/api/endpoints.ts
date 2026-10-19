import { apiRequest } from './client';
import type {
  ActivityEntry,
  AppNotification,
  Coaching,
  Compliance,
  DamageReport,
  Dna,
  DriverDocumentDetail,
  DriverDocumentSummary,
  DriverHome,
  DriverMe,
  DriverTask,
  DriverTrip,
  DriverVehicle,
  DvirQueueItem,
  DvirRecord,
  FuelCard,
  FuelLog,
  FuelTransaction,
  LoginResponse,
  OdometerCorrection,
  OtpRequestResult,
  PagedResult,
  Performance,
  RouteOption,
  SafetyEvent,
  Settlement,
  TrackingPoint,
  TripAsset,
  TripTracking,
  TripWarnings,
  VehicleSpec,
} from './types';

const BASE = '/api/driver';

/* ── Auth (M01) ─────────────────────────────────────────────────────── */

const AUTH = '/api/driver/auth';

export const authApi = {
  loginPin: (identifier: string, pin: string) =>
    apiRequest<LoginResponse>(`${AUTH}/login/pin`, {
      method: 'POST',
      body: { identifier, pin },
      anonymous: true,
    }),
  requestOtp: (identifier: string) =>
    apiRequest<OtpRequestResult>(`${AUTH}/otp/request`, {
      method: 'POST',
      body: { identifier },
      anonymous: true,
    }),
  verifyOtp: (identifier: string, code: string) =>
    apiRequest<LoginResponse>(`${AUTH}/otp/verify`, {
      method: 'POST',
      body: { identifier, code },
      anonymous: true,
    }),
  loginQr: (token: string) =>
    apiRequest<LoginResponse>(`${AUTH}/qr`, { method: 'POST', body: { token }, anonymous: true }),
  changePin: (currentPin: string, newPin: string) =>
    apiRequest<void>(`${AUTH}/pin/change`, { method: 'POST', body: { currentPin, newPin } }),
};

/* ── Profil & beranda (M03) ─────────────────────────────────────────── */

export const profileApi = {
  me: () => apiRequest<DriverMe>(`${BASE}/me`),
  home: () => apiRequest<DriverHome>(`${BASE}/home`),
  updateContact: (body: { name: string; phone?: string | null }) =>
    apiRequest<{ driverId: string; name: string; phone: string | null }>(`${BASE}/me`, {
      method: 'PUT',
      body,
    }),
};

/* ── Trip (M04) ─────────────────────────────────────────────────────── */

export const tripApi = {
  list: (params: { status?: string; from?: string; to?: string; take?: number } = {}) =>
    apiRequest<DriverTrip[]>(`${BASE}/trips`, { query: params }),
  detail: (id: string) => apiRequest<DriverTrip>(`${BASE}/trips/${id}`),
  accept: (id: string) => apiRequest<void>(`${BASE}/trips/${id}/accept`, { method: 'POST' }),
  decline: (id: string, reason: string) =>
    apiRequest<void>(`${BASE}/trips/${id}/decline`, { method: 'POST', body: { reason } }),
  start: (id: string) => apiRequest<void>(`${BASE}/trips/${id}/start`, { method: 'POST' }),
  complete: (id: string, actualDistanceKm?: number) =>
    apiRequest<void>(`${BASE}/trips/${id}/complete`, {
      method: 'POST',
      body: { actualDistanceKm: actualDistanceKm ?? null },
    }),
};

/* ── Tracking / rute / warning / aset (M05/M06/M14/M19) ─────────────── */

export const tripOpsApi = {
  tracking: (tripId: string) => apiRequest<TripTracking>(`${BASE}/trips/${tripId}/tracking`),
  routes: (tripId: string) => apiRequest<RouteOption[]>(`${BASE}/trips/${tripId}/routes`),
  selectRoute: (tripId: string, routeId: string) =>
    apiRequest<void>(`${BASE}/trips/${tripId}/routes/${routeId}/select`, { method: 'POST' }),
  warnings: (tripId: string) => apiRequest<TripWarnings>(`${BASE}/trips/${tripId}/warnings`),
  assets: (tripId: string) => apiRequest<TripAsset[]>(`${BASE}/trips/${tripId}/assets`),
  checkAsset: (tripId: string, assetId: string) =>
    apiRequest<void>(`${BASE}/trips/${tripId}/assets/${assetId}/check`, { method: 'POST' }),
};

/* ── DVIR (M17) ─────────────────────────────────────────────────────── */

export interface DvirPayload {
  vehicleId: string;
  inspectionType: 'PreTrip' | 'PostTrip';
  odometerKm: number;
  passed: boolean;
  defectNotes?: string | null;
  photoPaths?: string[] | null;
  checklistJson?: string | null;
}

export const dvirApi = {
  queue: () => apiRequest<DvirQueueItem[]>(`${BASE}/dvir/queue`),
  history: (params: { vehicleId?: string; take?: number } = {}) =>
    apiRequest<DvirRecord[]>(`${BASE}/dvir`, { query: params }),
  submit: (payload: DvirPayload) =>
    apiRequest<{ id: string }>(`${BASE}/dvir`, { method: 'POST', body: payload }),
};

/* ── POD / task (M21) ───────────────────────────────────────────────── */

export const taskApi = {
  list: (params: { status?: string; tripId?: string; take?: number } = {}) =>
    apiRequest<DriverTask[]>(`${BASE}/tasks`, { query: params }),
  start: (id: string) => apiRequest<void>(`${BASE}/tasks/${id}/start`, { method: 'POST' }),
  deliver: (
    id: string,
    payload: {
      photoPath?: string | null;
      signaturePath?: string | null;
      notes?: string | null;
      latitude: number;
      longitude: number;
      capturedAt: string;
    },
  ) => apiRequest<void>(`${BASE}/tasks/${id}/pod`, { method: 'POST', body: payload }),
  fail: (id: string, reason: string) =>
    apiRequest<void>(`${BASE}/tasks/${id}/fail`, { method: 'POST', body: { reason } }),
};

/* ── Notifikasi (M12) ───────────────────────────────────────────────── */

export const notificationApi = {
  list: (params: { isRead?: boolean; page?: number; pageSize?: number } = {}) =>
    apiRequest<PagedResult<AppNotification>>(`${BASE}/notifications`, { query: params }),
  read: (id: string) => apiRequest<void>(`${BASE}/notifications/${id}/read`, { method: 'POST' }),
};

/* ── BBM & kartu (M07/M22) ──────────────────────────────────────────── */

export const fuelApi = {
  logs: (take = 50) => apiRequest<FuelLog[]>(`${BASE}/fuel`, { query: { take } }),
  submit: (payload: {
    vehicleId: string;
    liters: number;
    amount: number;
    odometerKm: number;
    station?: string | null;
    receiptPath: string;
    tripId?: string | null;
    notes?: string | null;
  }) => apiRequest<{ id: string }>(`${BASE}/fuel`, { method: 'POST', body: payload }),
  card: () => apiRequest<FuelCard | null>(`${BASE}/fuel-card`),
  cardTransactions: (take = 50) =>
    apiRequest<FuelTransaction[]>(`${BASE}/fuel-card/transactions`, { query: { take } }),
};

/* ── Coaching / kinerja / aktivitas / DNA (M20/M10/M11/M13) ─────────── */

export const insightApi = {
  coaching: () => apiRequest<Coaching>(`${BASE}/coaching`),
  updateCoaching: (planId: string, status: 'InProgress' | 'Completed') =>
    apiRequest<void>(`${BASE}/coaching/${planId}/progress`, { method: 'POST', body: { status } }),
  performance: () => apiRequest<Performance>(`${BASE}/performance`),
  activity: (days = 30, take = 50) =>
    apiRequest<ActivityEntry[]>(`${BASE}/activity`, { query: { days, take } }),
  dna: () => apiRequest<Dna>(`${BASE}/dna`),
};

/* ── Kerusakan / safety / kepatuhan (M08/M18/M16) ───────────────────── */

export const safetyApi = {
  damage: (take = 50) => apiRequest<DamageReport[]>(`${BASE}/damage`, { query: { take } }),
  reportDamage: (payload: {
    vehicleId: string;
    category: string;
    severity: string;
    description: string;
    photoPaths: string[];
  }) => apiRequest<{ id: string }>(`${BASE}/damage`, { method: 'POST', body: payload }),
  events: (days = 30, take = 50) =>
    apiRequest<SafetyEvent[]>(`${BASE}/safety`, { query: { days, take } }),
  compliance: () => apiRequest<Compliance>(`${BASE}/compliance`),
  reportIncident: (payload: {
    vehicleId: string;
    category: string;
    severity: string;
    location: string;
    chronology: string;
    description: string;
    occurredAt: string;
    photoPaths: string[];
  }) => apiRequest<{ id: string }>(`${BASE}/incidents`, { method: 'POST', body: payload }),
};

/* ── Kendaraan & dokumen (M02/M09/M16) ──────────────────────────────── */

export const vehicleApi = {
  current: () => apiRequest<DriverVehicle>(`${BASE}/vehicle`),
  documents: (vehicleId?: string) =>
    apiRequest<DriverDocumentSummary[]>(`${BASE}/vehicle/documents`, { query: { vehicleId } }),
  submitOdometerCorrection: (payload: {
    requestedKm: number;
    reason: string;
    photoPaths?: string[] | null;
  }) => apiRequest<{ id: string }>(`${BASE}/vehicle/odometer-correction`, { method: 'POST', body: payload }),
  odometerCorrections: () =>
    apiRequest<OdometerCorrection[]>(`${BASE}/vehicle/odometer-corrections`),
};

export const documentApi = {
  list: () => apiRequest<DriverDocumentSummary[]>(`${BASE}/documents`),
  detail: (id: string) => apiRequest<DriverDocumentDetail>(`${BASE}/documents/${id}`),
};

/* ── Settlement (M15) ───────────────────────────────────────────────── */

export const settlementApi = {
  summary: (months = 3) => apiRequest<Settlement>(`${BASE}/settlement`, { query: { months } }),
};

/* ── Upload (foto DVIR / POD / BBM / kerusakan / insiden) ───────────── */

export { apiUpload as uploadFile } from './client';

export type { TrackingPoint, VehicleSpec };
