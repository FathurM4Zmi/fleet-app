import { useMemo } from 'react';

import { toRouteOption } from '@/data/adapters';
import { useTripRoutes } from '@/hooks/api/useDriverData';
import type { MapPoint } from '@/components/MapCanvas.types';

/**
 * Planned route for a trip: the endpoints of the option the driver already
 * applied (or the recommended/first one). Used to draw a dashed line towards
 * the destination before any GPS fix exists.
 */
export function useTripRoutePlan(tripId: string | undefined) {
  const query = useTripRoutes(tripId);

  const plan = useMemo(() => {
    const options = (query.data ?? []).map(toRouteOption);
    const option =
      options.find((candidate) => candidate.selected) ??
      options.find((candidate) => candidate.recommended) ??
      options[0];

    const origin: MapPoint | null =
      option?.originLat != null && option.originLng != null
        ? { latitude: option.originLat, longitude: option.originLng }
        : null;
    const destination: MapPoint | null =
      option?.destLat != null && option.destLng != null
        ? { latitude: option.destLat, longitude: option.destLng }
        : null;

    return {
      origin,
      destination,
      points: origin && destination ? [origin, destination] : [],
    };
  }, [query.data]);

  return { ...plan, loading: query.loading, error: query.error };
}
