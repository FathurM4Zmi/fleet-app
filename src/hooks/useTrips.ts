import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { toTrip } from '@/data/adapters';
import type { Trip, TripStatus } from '@/data/types';
import { useApiQuery } from '@/hooks/api/useApiQuery';
import { useOutbox } from '@/hooks/useOutbox';
import { ApiError } from '@/lib/api/client';
import { tripApi } from '@/lib/api/endpoints';
import type { DriverTrip } from '@/lib/api/types';
import { readCache, writeCache } from '@/lib/offline/cache';
import { enqueue } from '@/lib/offline/queue';

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
  if (status === 'in_progress' || status === 'arrived') return 'active';
  return 'history';
};

/** Cache daftar trip agar Inbox tetap terisi saat offline (FRD-MOB-INBOX-04). */
const CACHE_KEY = 'trips';

/** Aksi antrian disimpan sebagai `/api/driver/trips/{id}/accept|decline`. */
const queuedActionOf = (path: string): { tripId: string; action: 'accept' | 'decline' } | null => {
  const match = /\/trips\/([^/]+)\/(accept|decline)$/.exec(path);
  return match ? { tripId: match[1], action: match[2] as 'accept' | 'decline' } : null;
};

const isOffline = (error: unknown) => error instanceof ApiError && error.status === 0;

export function useTrips() {
  const query = useApiQuery(() => tripApi.list({ take: 100 }), []);
  const { items: outbox } = useOutbox();
  const [cached, setCached] = useState<DriverTrip[] | null>(null);

  useEffect(() => {
    void readCache<DriverTrip[]>(CACHE_KEY).then(setCached);
  }, []);

  useEffect(() => {
    if (query.data) void writeCache(CACHE_KEY, query.data);
  }, [query.data]);

  // Aksi yang masih menunggu sinyal ditampilkan seolah sudah terjadi, supaya
  // driver tidak menekan tombolnya berkali-kali saat offline.
  const queued = useMemo(() => {
    const map = new Map<string, 'accept' | 'decline'>();
    for (const item of outbox) {
      const pending = queuedActionOf(item.path);
      if (pending) map.set(pending.tripId, pending.action);
    }
    return map;
  }, [outbox]);

  const trips = useMemo(
    () =>
      (query.data ?? cached ?? []).map((dto) => {
        const trip = toTrip(dto);
        const action = queued.get(dto.id);
        if (action === 'accept') return { ...trip, status: 'accepted' as TripStatus };
        if (action === 'decline') return { ...trip, status: 'rejected' as TripStatus };
        return trip;
      }),
    [query.data, cached, queued],
  );

  const { refetch } = query;

  // Begitu antrian terkirim, ambil status asli dari server.
  const previousQueued = useRef(0);
  useEffect(() => {
    if (previousQueued.current > 0 && queued.size === 0) void refetch();
    previousQueued.current = queued.size;
  }, [queued, refetch]);

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
      try {
        await tripApi.accept(tripId);
      } catch (error) {
        if (!isOffline(error)) throw error;
        await enqueue({
          kind: 'trip',
          label: 'Terima tugas',
          path: `/api/driver/trips/${tripId}/accept`,
          method: 'POST',
          body: null,
        });
        return;
      }
      await refetch();
    },
    [refetch],
  );

  const reject = useCallback(
    async (tripId: string, reason: string) => {
      try {
        await tripApi.decline(tripId, reason);
      } catch (error) {
        if (!isOffline(error)) throw error;
        await enqueue({
          kind: 'trip',
          label: 'Tolak tugas',
          path: `/api/driver/trips/${tripId}/decline`,
          method: 'POST',
          body: { reason },
        });
        return;
      }
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
