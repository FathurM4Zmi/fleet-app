import * as Location from 'expo-location';

export interface GeoPoint {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance between two coordinates, in kilometres. */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Total length of a GPS trail, in kilometres. Fewer than two points is 0. */
export function pathLengthKm(points: { latitude: number; longitude: number }[]): number {
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    total += distanceKm(
      { lat: points[index - 1].latitude, lng: points[index - 1].longitude },
      { lat: points[index].latitude, lng: points[index].longitude },
    );
  }
  return total;
}

/**
 * Best-effort position for POD / incident evidence. Returns `null` when the
 * driver denies permission or the fix times out, so callers can decide whether
 * the evidence is still usable.
 */
/** Human-readable label for a coordinate pair (street + city), else "lat, lng". */
export async function describePosition(point: GeoPoint): Promise<string> {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude: point.lat,
      longitude: point.lng,
    });
    if (address) {
      const label =
        address.formattedAddress ??
        [address.street, address.streetNumber, address.district, address.city, address.region]
          .filter(Boolean)
          .join(' ');
      if (label?.trim()) return label.trim();
    }
  } catch {
    // Geocoding needs network; fall back to raw coordinates below.
  }
  return `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;
}

/** Resolves the current fix straight to an address, or `null` when denied. */
export async function currentAddress(): Promise<string | null> {
  const point = await currentPosition();
  return point ? describePosition(point) : null;
}

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
