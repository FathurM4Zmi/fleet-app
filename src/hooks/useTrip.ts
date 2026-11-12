import { useCallback, useMemo, useState } from 'react';

import { toDvir, toTrip, toVehicle, toVehicleFromTrip } from '@/data/adapters';
import type { DvirInspection, Trip, Vehicle } from '@/data/types';
import { dvirApi, profileApi, tripApi, vehicleApi } from '@/lib/api/endpoints';
import { ApiError } from '@/lib/api/client';
import { enqueue } from '@/lib/offline/queue';
import { useApiQuery } from '@/hooks/api/useApiQuery';

export function useTrip(tripId: string | undefined) {
  const tripQuery = useApiQuery(() => tripApi.detail(tripId as string), [tripId], {
    enabled: Boolean(tripId),
  });
  const vehicleQuery = useApiQuery(vehicleApi.current, [tripId], { enabled: Boolean(tripId) });
  const meQuery = useApiQuery(profileApi.me, [], { enabled: Boolean(tripId) });
  const dvirQuery = useApiQuery(
    () => dvirApi.history({ vehicleId: tripQuery.data?.vehicleId, take: 20 }),
    [tripQuery.data?.vehicleId],
    { enabled: Boolean(tripQuery.data?.vehicleId) },
  );

  const trip: Trip | undefined = useMemo(
    () => (tripQuery.data ? toTrip(tripQuery.data) : undefined),
    [tripQuery.data],
  );

  // FRD-MOB-TRIPEXEC-04 — a transition queued offline must still drive the UI.
  const [pendingStatus, setPendingStatus] = useState<Trip['status'] | null>(null);

  const effectiveTrip: Trip | undefined = useMemo(() => {
    if (!trip || !pendingStatus || trip.status === pendingStatus) return trip;
    return { ...trip, status: pendingStatus };
  }, [trip, pendingStatus]);

  const vehicle: Vehicle | undefined = useMemo(() => {
    if (!trip) return undefined;
    if (vehicleQuery.data && vehicleQuery.data.vehicleId === trip.vehicleId) {
      return toVehicle(vehicleQuery.data);
    }
    return tripQuery.data ? toVehicleFromTrip(tripQuery.data) : undefined;
  }, [trip, vehicleQuery.data, tripQuery.data]);

  const inspections = useMemo(() => (dvirQuery.data ?? []).map(toDvir), [dvirQuery.data]);

  const preTrip: DvirInspection | undefined = inspections.find((entry) => entry.type === 'pre');
  const postTrip: DvirInspection | undefined = inspections.find((entry) => entry.type === 'post');

  const refetch = tripQuery.refetch;

  const transition = useCallback(
    async (
      next: Trip['status'],
      path: string,
      label: string,
      call: () => Promise<void>,
      body: unknown = null,
    ) => {
      if (!tripId) return;
      try {
        await call();
        setPendingStatus(null);
        await refetch();
      } catch (error) {
        if (!(error instanceof ApiError) || !error.isNetworkError) throw error;
        // Offline: keep the driver moving and let the outbox replay the call.
        setPendingStatus(next);
        await enqueue({ kind: 'trip', label, path, method: 'POST', body });
      }
    },
    [tripId, refetch],
  );

  const setStatus = useCallback(
    async (status: Trip['status']) => {
      if (!tripId) return;
      if (status === 'accepted') {
        await transition(status, `/api/driver/trips/${tripId}/accept`, 'Terima tugas', () =>
          tripApi.accept(tripId),
        );
      } else if (status === 'in_progress') {
        await transition(status, `/api/driver/trips/${tripId}/start`, 'Mulai perjalanan', () =>
          tripApi.start(tripId),
        );
      } else if (status === 'arrived') {
        await transition(status, `/api/driver/trips/${tripId}/arrive`, 'Tiba di tujuan', () =>
          tripApi.arrive(tripId),
        );
      } else if (status === 'completed') {
        await transition(
          status,
          `/api/driver/trips/${tripId}/complete`,
          'Selesaikan trip',
          () => tripApi.complete(tripId),
          { actualDistanceKm: null },
        );
      }
    },
    [tripId, transition],
  );

  const reject = useCallback(
    async (reason: string) => {
      if (!tripId) return;
      await transition(
        'rejected',
        `/api/driver/trips/${tripId}/decline`,
        'Tolak tugas',
        () => tripApi.decline(tripId, reason),
        { reason },
      );
    },
    [tripId, transition],
  );

  const start = useCallback(async () => {
    if (!tripId) return;
    await transition('in_progress', `/api/driver/trips/${tripId}/start`, 'Mulai perjalanan', () =>
      tripApi.start(tripId),
    );
  }, [tripId, transition]);

  const arrive = useCallback(async () => {
    if (!tripId) return;
    await transition('arrived', `/api/driver/trips/${tripId}/arrive`, 'Tiba di tujuan', () =>
      tripApi.arrive(tripId),
    );
  }, [tripId, transition]);

  const complete = useCallback(
    async (actualDistanceKm?: number) => {
      if (!tripId) return;
      await transition(
        'completed',
        `/api/driver/trips/${tripId}/complete`,
        'Selesaikan trip',
        () => tripApi.complete(tripId, actualDistanceKm),
        { actualDistanceKm: actualDistanceKm ?? null },
      );
    },
    [tripId, transition],
  );

  return {
    trip: effectiveTrip,
    vehicle,
    preTrip,
    postTrip,
    pod: undefined,
    driver: meQuery.data,
    loading: tripQuery.loading,
    error: tripQuery.error,
    refetch: tripQuery.refetch,
    setStatus,
    reject,
    start,
    arrive,
    complete,
  };
}
