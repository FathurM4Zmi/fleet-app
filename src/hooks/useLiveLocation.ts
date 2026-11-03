import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface LiveCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  /** Wall-clock time of the fix, used to tell "live" from "stale". */
  at: number;
}

function toCoords(position: Location.LocationObject): LiveCoords {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    at: position.timestamp,
  };
}

/**
 * Subscribes to the device GPS while the screen is mounted so the map and the
 * incident form show the driver's real position instead of a static snapshot.
 * Returns `null` until the first fix (or when permission is denied).
 */
export function useLiveLocation(enabled = true) {
  const [coords, setCoords] = useState<LiveCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let subscription: Location.LocationSubscription | null = null;

    void (async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) {
          if (!cancelled) setError('Izin lokasi ditolak. Aktifkan di pengaturan perangkat.');
          return;
        }

        const last = await Location.getLastKnownPositionAsync({ maxAge: 60_000 });
        if (last && !cancelled) setCoords(toCoords(last));

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
            timeInterval: 5_000,
          },
          (position) => {
            if (!cancelled) {
              setCoords(toCoords(position));
              setError(null);
            }
          },
          (message) => {
            if (!cancelled) setError(message);
          },
        );
      } catch {
        if (!cancelled) setError('Lokasi tidak tersedia di perangkat ini.');
      }
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [enabled]);

  return { coords, error };
}
