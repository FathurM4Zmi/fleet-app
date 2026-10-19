import { useMemo } from 'react';

import type { DvirInspection, Pod, Trip, Vehicle } from '@/data/types';
import { useAppStore } from '@/store/app';

export function useTrip(tripId: string | undefined) {
  const { state, dispatch } = useAppStore();

  return useMemo(() => {
    const trip: Trip | undefined = state.trips.find((entry) => entry.id === tripId);
    const vehicle: Vehicle | undefined = state.vehicles.find(
      (entry) => entry.id === trip?.vehicleId,
    );
    const preTrip: DvirInspection | undefined = state.dvir.find(
      (entry) => entry.tripId === tripId && entry.type === 'pre',
    );
    const postTrip: DvirInspection | undefined = state.dvir.find(
      (entry) => entry.tripId === tripId && entry.type === 'post',
    );
    const pod: Pod | undefined = state.pods.find((entry) => entry.tripId === tripId);

    const completeEvent = (label: string) => {
      if (!tripId) return;
      const event = trip?.timeline.find((entry) => entry.label === label);
      if (event) {
        dispatch({ type: 'trip/completeEvent', tripId, eventId: event.id });
      }
    };

    return {
      trip,
      vehicle,
      preTrip,
      postTrip,
      pod,
      driver: state.driver,
      /** Marks a named timeline step as done, e.g. `Konfirmasi driver`. */
      completeEvent,
      setStatus: (status: Trip['status']) => {
        if (tripId) dispatch({ type: 'trip/setStatus', tripId, status });
      },
      reject: (reason: string) => {
        if (tripId) dispatch({ type: 'trip/reject', tripId, reason });
      },
    };
  }, [state, tripId, dispatch]);
}
