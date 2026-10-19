import * as Location from 'expo-location';

export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * Best-effort position for POD / incident evidence. Returns `null` when the
 * driver denies permission or the fix times out, so callers can decide whether
 * the evidence is still usable.
 */
export async function currentPosition(): Promise<GeoPoint | null> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) return null;

    const last = await Location.getLastKnownPositionAsync({ maxAge: 60_000 });
    if (last) {
      return { lat: last.coords.latitude, lng: last.coords.longitude };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  } catch {
    return null;
  }
}
