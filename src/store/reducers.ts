import { createId, nowIso } from '@/lib/id';
import { createPostTripItems, createPreTripItems } from '@/data/checklists';
import type {
  AuthSession,
  DamageReport,
  Driver,
  DvirInspection,
  DvirItem,
  FuelLog,
  IncidentReport,
  Notification,
  OdometerCorrection,
  Pod,
  Trip,
  TripStatus,
  Vehicle,
} from '@/data/types';

export interface AppState {
  session: AuthSession | null;
  driver: Driver;
  vehicles: Vehicle[];
  trips: Trip[];
  dvir: DvirInspection[];
  pods: Pod[];
  notifications: Notification[];
  fuelLogs: FuelLog[];
  odometerCorrections: OdometerCorrection[];
  damageReports: DamageReport[];
  incidentReports: IncidentReport[];
}

export type AppAction =
  | { type: 'auth/login'; session: AuthSession }
  | { type: 'auth/logout' }
  | { type: 'driver/update'; patch: Partial<Pick<Driver, 'name' | 'phone' | 'initials'>> }
  | { type: 'trip/setStatus'; tripId: string; status: TripStatus }
  | { type: 'trip/completeEvent'; tripId: string; eventId: string }
  | { type: 'trip/reject'; tripId: string; reason: string }
  | { type: 'dvir/start'; tripId: string; inspectionType: 'pre' | 'post' }
  | {
      type: 'dvir/setItem';
      tripId: string;
      inspectionType: 'pre' | 'post';
      itemId: string;
      patch: Partial<DvirItem>;
    }
  | {
      type: 'dvir/setOdometer';
      tripId: string;
      inspectionType: 'pre' | 'post';
      odometerKm: number;
    }
  | { type: 'dvir/submit'; tripId: string; inspectionType: 'pre' | 'post' }
  | { type: 'pod/save'; pod: Omit<Pod, 'id' | 'capturedAt' | 'syncStatus'> }
  | { type: 'pod/markSynced'; tripId: string }
  | { type: 'notification/markRead'; id: string }
  | { type: 'notification/markAllRead' }
  | { type: 'fuel/save'; log: Omit<FuelLog, 'id' | 'createdAt' | 'syncStatus'> }
  | {
      type: 'odometer/correct';
      correction: Omit<OdometerCorrection, 'id' | 'submittedAt' | 'status'>;
    }
  | { type: 'damage/report'; report: Omit<DamageReport, 'id' | 'submittedAt'> }
  | { type: 'incident/report'; report: Omit<IncidentReport, 'id' | 'submittedAt'> };

export const createInspection = (
  tripId: string,
  inspectionType: 'pre' | 'post',
  odometerKm = 0,
): DvirInspection => ({
  id: createId(`dvir-${inspectionType}`),
  tripId,
  type: inspectionType,
  items: inspectionType === 'pre' ? createPreTripItems() : createPostTripItems(),
  odometerKm,
  status: 'draft',
});

const findInspection = (
  state: AppState,
  tripId: string,
  inspectionType: 'pre' | 'post',
): DvirInspection | undefined =>
  state.dvir.find((entry) => entry.tripId === tripId && entry.type === inspectionType);

/** Replaces a single inspection, creating it first when the draft is missing. */
const upsertInspection = (
  state: AppState,
  tripId: string,
  inspectionType: 'pre' | 'post',
  update: (inspection: DvirInspection) => DvirInspection,
): DvirInspection[] => {
  const existing = findInspection(state, tripId, inspectionType);
  if (!existing) {
    return [...state.dvir, update(createInspection(tripId, inspectionType))];
  }
  return state.dvir.map((entry) => (entry.id === existing.id ? update(entry) : entry));
};

const patchTrip = (state: AppState, tripId: string, update: (trip: Trip) => Trip): Trip[] =>
  state.trips.map((trip) => (trip.id === tripId ? update(trip) : trip));

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'auth/login':
      return { ...state, session: action.session };

    case 'auth/logout':
      return { ...state, session: null };

    case 'driver/update':
      return { ...state, driver: { ...state.driver, ...action.patch } };

    case 'trip/setStatus':
      return {
        ...state,
        trips: patchTrip(state, action.tripId, (trip) => ({ ...trip, status: action.status })),
      };

    case 'trip/completeEvent':
      return {
        ...state,
        trips: patchTrip(state, action.tripId, (trip) => ({
          ...trip,
          timeline: trip.timeline.map((event) =>
            event.id === action.eventId ? { ...event, done: true, at: nowIso() } : event,
          ),
        })),
      };

    case 'trip/reject':
      return {
        ...state,
        trips: patchTrip(state, action.tripId, (trip) => ({
          ...trip,
          status: 'rejected',
          rejectReason: action.reason,
          timeline: [
            ...trip.timeline.map((event) =>
              event.label === 'Konfirmasi driver'
                ? { ...event, done: false, at: '' }
                : event,
            ),
            { id: createId('ev'), label: 'Tugas ditolak driver', at: nowIso(), done: true },
          ],
        })),
      };

    case 'dvir/start':
      return {
        ...state,
        dvir: upsertInspection(state, action.tripId, action.inspectionType, (entry) => entry),
      };

    case 'dvir/setItem':
      return {
        ...state,
        dvir: upsertInspection(state, action.tripId, action.inspectionType, (entry) => ({
          ...entry,
          items: entry.items.map((item) =>
            item.id === action.itemId ? { ...item, ...action.patch } : item,
          ),
        })),
      };

    case 'dvir/setOdometer':
      return {
        ...state,
        dvir: upsertInspection(state, action.tripId, action.inspectionType, (entry) => ({
          ...entry,
          odometerKm: action.odometerKm,
        })),
      };

    case 'dvir/submit': {
      const inspection = findInspection(state, action.tripId, action.inspectionType);
      if (!inspection) return state;

      const hasFailure = inspection.items.some((item) => item.result === 'fail');
      const status = hasFailure ? 'failed' : 'passed';
      const isPre = action.inspectionType === 'pre';

      return {
        ...state,
        dvir: state.dvir.map((entry) =>
          entry.id === inspection.id ? { ...entry, status, submittedAt: nowIso() } : entry,
        ),
        trips: patchTrip(state, action.tripId, (trip) => ({
          ...trip,
          preTripDone: isPre ? true : trip.preTripDone,
          postTripDone: isPre ? trip.postTripDone : true,
          timeline: trip.timeline.map((event) => {
            const matches = isPre
              ? event.label === 'DVIR pre-trip'
              : event.label === 'POD & DVIR post-trip';
            return matches ? { ...event, done: true, at: nowIso() } : event;
          }),
        })),
        // A failed pre-trip inspection blocks the assigned unit (M17 → M02/M04).
        vehicles: hasFailure
          ? state.vehicles.map((vehicle) =>
              vehicle.id ===
              state.trips.find((trip) => trip.id === action.tripId)?.vehicleId
                ? {
                    ...vehicle,
                    status: 'blocked',
                    blockedReason: `DVIR ${isPre ? 'pre-trip' : 'post-trip'} gagal`,
                  }
                : vehicle,
            )
          : state.vehicles,
      };
    }

    case 'pod/save':
      return {
        ...state,
        pods: [
          ...state.pods.filter((pod) => pod.tripId !== action.pod.tripId),
          {
            ...action.pod,
            id: createId('pod'),
            capturedAt: nowIso(),
            // The app runs online-only, so every POD reaches the server on save.
            syncStatus: 'synced',
          },
        ],
      };

    case 'pod/markSynced':
      return {
        ...state,
        pods: state.pods.map((pod) =>
          pod.tripId === action.tripId ? { ...pod, syncStatus: 'synced' } : pod,
        ),
      };

    case 'notification/markRead':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.id && !notification.readAt
            ? { ...notification, readAt: nowIso() }
            : notification,
        ),
      };

    case 'notification/markAllRead':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.readAt ? notification : { ...notification, readAt: nowIso() },
        ),
      };

    case 'fuel/save':
      return {
        ...state,
        fuelLogs: [
          ...state.fuelLogs,
          {
            ...action.log,
            id: createId('fuel'),
            createdAt: nowIso(),
            // Online-only build: the entry reaches the server on save.
            syncStatus: 'synced',
          },
        ],
      };

    case 'odometer/correct':
      return {
        ...state,
        odometerCorrections: [
          ...state.odometerCorrections,
          { ...action.correction, id: createId('kor'), status: 'pending', submittedAt: nowIso() },
        ],
      };

    case 'damage/report':
      return {
        ...state,
        damageReports: [
          ...state.damageReports,
          { ...action.report, id: createId('dmg'), submittedAt: nowIso() },
        ],
      };

    case 'incident/report':
      return {
        ...state,
        incidentReports: [
          ...state.incidentReports,
          { ...action.report, id: createId('inc'), submittedAt: nowIso() },
        ],
      };

    default:
      return state;
  }
}
