import { useMemo } from 'react';

import type { Trip, TripStatus } from '@/data/types';
import { useAppStore } from '@/store/app';

export interface TripBuckets {
  /** Assigned or accepted — needs a driver decision or a start. */
  upcoming: Trip[];
  /** Currently being executed. */
  active: Trip[];
  /** Completed or rejected. */
  history: Trip[];
}

const bucketOf = (status: TripStatus): keyof TripBuckets => {
  if (status === 'assigned' || status === 'accepted') return 'upcoming';
  if (status === 'in_progress') return 'active';
  return 'history';
};

export function useTrips() {
  const { state, dispatch } = useAppStore();

  return useMemo(() => {
    const buckets: TripBuckets = { upcoming: [], active: [], history: [] };
    for (const trip of state.trips) {
      buckets[bucketOf(trip.status)].push(trip);
    }

    const bySchedule = (a: Trip, b: Trip) => a.scheduledAt.localeCompare(b.scheduledAt);
    buckets.upcoming.sort(bySchedule);
    buckets.active.sort(bySchedule);
    buckets.history.sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));

    return {
      trips: state.trips,
      ...buckets,
      /** The trip surfaced on the home screen. */
      nextTrip: buckets.active[0] ?? buckets.upcoming[0],
      accept: (tripId: string) => dispatch({ type: 'trip/setStatus', tripId, status: 'accepted' }),
      reject: (tripId: string, reason: string) =>
        dispatch({ type: 'trip/reject', tripId, reason }),
    };
  }, [state.trips, dispatch]);
}
