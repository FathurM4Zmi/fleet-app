import { useCallback, useMemo } from 'react';

import { toDvir, toTrip, toVehicle, toVehicleFromTrip } from '@/data/adapters';
import type { DvirInspection, Trip, Vehicle } from '@/data/types';
import { dvirApi, profileApi, tripApi, vehicleApi } from '@/lib/api/endpoints';
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

  const completeEvent = useCallback(
    async (label: string) => {
      if (!tripId) return;
      if (label === 'Tiba di tujuan') await tripApi.complete(tripId);
      await refetch();
    },
    [tripId, refetch],
  );

  const setStatus = useCallback(
    async (status: Trip['status']) => {
      if (!tripId) return;
      if (status === 'accepted') await tripApi.accept(tripId);
      else if (status === 'in_progress') await tripApi.start(tripId);
      else if (status === 'completed') await tripApi.complete(tripId);
      await refetch();
    },
    [tripId, refetch],
  );

  const reject = useCallback(
    async (reason: string) => {
      if (!tripId) return;
      await tripApi.decline(tripId, reason);
      await refetch();
    },
    [tripId, refetch],
  );

  const start = useCallback(async () => {
    if (!tripId) return;
    await tripApi.start(tripId);
    await refetch();
  }, [tripId, refetch]);

  const complete = useCallback(
    async (actualDistanceKm?: number) => {
      if (!tripId) return;
      await tripApi.complete(tripId, actualDistanceKm);
      await refetch();
    },
    [tripId, refetch],
  );

  return {
    trip,
    vehicle,
    preTrip,
    postTrip,
    pod: undefined,
    driver: meQuery.data,
    loading: tripQuery.loading,
    error: tripQuery.error,
    refetch: tripQuery.refetch,
    completeEvent,
    setStatus,
    reject,
    start,
    complete,
  };
}
