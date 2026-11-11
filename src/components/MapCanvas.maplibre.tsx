import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors, radius } from '@/theme';

import type { MapCanvasProps } from './MapCanvas.types';

/**
 * MapTiler vector style. Set `EXPO_PUBLIC_MAPTILER_API_KEY` in `.env` — Expo
 * inlines it at bundle time. `EXPO_PUBLIC_MAPTILER_STYLE` optionally overrides
 * the style id (default `streets-v2`).
 */
const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY?.trim() ?? '';
const MAPTILER_STYLE = process.env.EXPO_PUBLIC_MAPTILER_STYLE?.trim() || 'streets-v2';
const MAPTILER_STYLE_URL = `https://api.maptiler.com/maps/${MAPTILER_STYLE}/style.json?key=${encodeURIComponent(MAPTILER_KEY)}`;

const FIT_PADDING = { top: 48, right: 48, bottom: 48, left: 48 };
const DEFAULT_CENTER: [number, number] = [106.8166, -6.2];

/**
 * Real map (MapLibre + MapTiler vector tiles) with an overlay for trails and pins.
 *
 * MapLibre coordinates are [longitude, latitude] — the opposite order of the
 * `MapPoint` props, so every conversion happens here.
 */
export function MapCanvas({
  points = [],
  markers = [],
  height = 220,
  zoom: fixedZoom,
  follow,
  emptyLabel = 'Menunggu data lokasi',
  rounded = true,
  onPressPoint,
  selected,
}: MapCanvasProps) {
  // Serialise the coordinates so re-renders of the parent screen (e.g. typing a
  // note) don't re-fit the camera; only real position changes do.
  const anchorKey = [...points, ...markers]
    .filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude))
    .map((point) => `${point.longitude},${point.latitude}`)
    .join(';');

  /** [west, south, east, north] — null when a single point is all we have. */
  const bounds = useMemo<[number, number, number, number] | null>(() => {
    const coordinates = anchorKey
      ? anchorKey.split(';').map((pair) => pair.split(',').map(Number))
      : [];
    if (coordinates.length < 2) return null;
    const lngs = coordinates.map((coordinate) => coordinate[0]);
    const lats = coordinates.map((coordinate) => coordinate[1]);
    const west = Math.min(...lngs);
    const east = Math.max(...lngs);
    const south = Math.min(...lats);
    const north = Math.max(...lats);
    if (west === east && south === north) return null;
    return [west, south, east, north];
  }, [anchorKey]);

  const center = useMemo<[number, number]>(() => {
    if (bounds) return [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
    if (anchorKey) {
      const [longitude, latitude] = anchorKey.split(';')[0].split(',').map(Number);
      return [longitude, latitude];
    }
    return DEFAULT_CENTER;
  }, [anchorKey, bounds]);

  const routeKey = points
    .filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude))
    .map((point) => `${point.longitude},${point.latitude}`)
    .join(';');

  /** Live vehicle position — the camera tracks it as new fixes arrive. */
  const followKey =
    follow && Number.isFinite(follow.latitude) && Number.isFinite(follow.longitude)
      ? `${follow.longitude},${follow.latitude}`
      : null;

  const followCenter = useMemo<[number, number] | null>(() => {
    if (!followKey) return null;
    const [longitude, latitude] = followKey.split(',').map(Number);
    return [longitude, latitude];
  }, [followKey]);

  const route = useMemo<GeoJSON.FeatureCollection>(() => {
    const coordinates = routeKey
      ? (routeKey.split(';').map((pair) => pair.split(',').map(Number)) as [number, number][])
      : [];
    if (coordinates.length < 2) return { type: 'FeatureCollection', features: [] };
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates },
        },
      ],
    };
  }, [routeKey]);

  return (
    <View style={[styles.container, { height }, !rounded && styles.square]}>
      <Map
        style={StyleSheet.absoluteFill}
        mapStyle={MAPTILER_STYLE_URL}
        logo={false}
        attribution={false}
        compass={false}
        scaleBar={false}
        onPress={
          onPressPoint
            ? (event: unknown) => {
                const [longitude, latitude] = (
                  event as { geometry: { coordinates: [number, number] } }
                ).geometry.coordinates;
                onPressPoint({ latitude, longitude });
              }
            : undefined
        }
      >
        {followCenter ? (
          <Camera center={followCenter} zoom={fixedZoom ?? 15} duration={400} />
        ) : bounds ? (
          <Camera bounds={bounds} padding={FIT_PADDING} duration={500} />
        ) : (
          <Camera center={center} zoom={fixedZoom ?? 12} duration={500} />
        )}

        {points.length > 1 ? (
          <GeoJSONSource id="map-route" data={route}>
            <Layer
              id="map-route-halo"
              type="line"
              paint={{
                'line-color': colors.primaryContainer,
                'line-opacity': 0.25,
                'line-width': 9,
              }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
            <Layer
              id="map-route-line"
              type="line"
              paint={{
                'line-color': colors.primaryContainer,
                'line-width': 5,
              }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
          </GeoJSONSource>
        ) : null}

        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            lngLat={[marker.longitude, marker.latitude]}
          >
            <View
              style={[
                styles.marker,
                { backgroundColor: marker.color ?? colors.primaryContainer },
              ]}
            />
          </Marker>
        ))}

        {selected ? (
          <Marker lngLat={[selected.longitude, selected.latitude]}>
            <View style={styles.selectedRing} />
          </Marker>
        ) : null}
      </Map>

      {anchorKey === '' ? (
        <View style={styles.empty} pointerEvents="none">
          <Text variant="labelMd" color="textSecondary">
            {emptyLabel}
          </Text>
        </View>
      ) : null}

      <View style={styles.attribution} pointerEvents="none">
        <Text variant="caption" color="textSecondary">
          © MapTiler · © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#E8EDF2',
    borderRadius: radius.card,
  },
  square: { borderRadius: 0 },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  selectedRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  empty: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attribution: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
});
