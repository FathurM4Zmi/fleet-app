import { useCallback, useMemo } from 'react';

import { toTrip } from '@/data/adapters';
import type { Trip, TripStatus } from '@/data/types';
import { tripApi } from '@/lib/api/endpoints';
import { useApiQuery } from '@/hooks/api/useApiQuery';

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
  const query = useApiQuery(() => tripApi.list({ take: 100 }), []);
  const { refetch } = query;
  const trips = useMemo(() => (query.data ?? []).map(toTrip), [query.data]);

  const buckets = useMemo(() => {
    const result: TripBuckets = { upcoming: [], active: [], history: [] };
    for (const trip of trips) result[bucketOf(trip.status)].push(trip);

    const bySchedule = (a: Trip, b: Trip) => a.scheduledAt.localeCompare(b.scheduledAt);
    result.upcoming.sort(bySchedule);
    result.active.sort(bySchedule);
    result.history.sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
    return result;
  }, [trips]);

  const accept = useCallback(
    async (tripId: string) => {
      await tripApi.accept(tripId);
      await refetch();
    },
    [refetch],
  );

  const reject = useCallback(
    async (tripId: string, reason: string) => {
      await tripApi.decline(tripId, reason);
      await refetch();
    },
    [refetch],
  );

  return {
    trips,
    ...buckets,
    nextTrip: buckets.active[0] ?? buckets.upcoming[0],
    loading: query.loading,
    refreshing: query.refreshing,
    error: query.error,
    refetch: query.refetch,
    accept,
    reject,
  };
}
