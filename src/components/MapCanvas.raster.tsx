import { useMemo, useRef, useState, type ComponentRef } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { Text } from '@/components/ui';
import { colors, radius } from '@/theme';

import type { MapCanvasProps, MapPoint } from './MapCanvas.types';

const TILE_SIZE = 256;
const MIN_ZOOM = 4;
const MAX_ZOOM = 14;

/**
 * Raster-tile map. Tiles are plain <Image> requests, so it runs on the web and
 * inside Expo Go (where the MapLibre native module is unavailable).
 *
 * MapTiler when `EXPO_PUBLIC_MAPTILER_API_KEY` is set, OpenStreetMap otherwise
 * (no key needed).
 */
const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY?.trim() ?? '';
const MAPTILER_STYLE = process.env.EXPO_PUBLIC_MAPTILER_STYLE?.trim() || 'streets-v2';

function tileUrl(zoom: number, x: number, y: number): string {
  if (MAPTILER_KEY) {
    return `https://api.maptiler.com/maps/${MAPTILER_STYLE}/256/${zoom}/${x}/${y}.png?key=${encodeURIComponent(MAPTILER_KEY)}`;
  }
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

/** Web-Mercator projection to world pixel coordinates (EPSG:3857, 256 px tiles). */
function project(latitude: number, longitude: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((latitude * Math.PI) / 180);
  const x = ((longitude + 180) / 360) * scale;
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
}

/** Inverse of `project` — world pixels back to a coordinate. */
function unproject(x: number, y: number, zoom: number): MapPoint {
  const scale = TILE_SIZE * 2 ** zoom;
  const longitude = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const latitude = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { latitude, longitude };
}

function fitZoom(points: MapPoint[], width: number, height: number) {
  if (points.length < 2) return 12;
  for (let zoom = MAX_ZOOM; zoom > MIN_ZOOM; zoom--) {
    const projected = points.map((point) => project(point.latitude, point.longitude, zoom));
    const xs = projected.map((point) => point.x);
    const ys = projected.map((point) => point.y);
    const fitsX = Math.max(...xs) - Math.min(...xs) <= Math.max(64, width - 48);
    const fitsY = Math.max(...ys) - Math.min(...ys) <= Math.max(64, height - 48);
    if (fitsX && fitsY) return zoom;
  }
  return MIN_ZOOM;
}

/**
 * Raster map with an overlay for trails and pins. Attribution is required and
 * rendered below.
 */
export function MapCanvas({
  points = [],
  markers = [],
  height = 220,
  zoom: fixedZoom,
  emptyLabel = 'Menunggu data lokasi',
  rounded = true,
  onPressPoint,
  selected,
}: MapCanvasProps) {
  const [size, setSize] = useState({ width: 0, height });
  const containerRef = useRef<ComponentRef<typeof View>>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== size.width) setSize({ width, height });
  };

  const anchors = useMemo(
    () =>
      [...points, ...markers].filter(
        (point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude),
      ),
    [points, markers],
  );

  const view = useMemo(() => {
    const width = size.width;
    if (width <= 0) return null;

    const zoom = fixedZoom ?? fitZoom(anchors, width, height);

    // Centre on the bounding box of the anchors; fall back to Jakarta.
    const centre =
      anchors.length > 0
        ? {
            latitude:
              (Math.min(...anchors.map((p) => p.latitude)) +
                Math.max(...anchors.map((p) => p.latitude))) /
              2,
            longitude:
              (Math.min(...anchors.map((p) => p.longitude)) +
                Math.max(...anchors.map((p) => p.longitude))) /
              2,
          }
        : { latitude: -6.2, longitude: 106.8166 };

    const centreWorld = project(centre.latitude, centre.longitude, zoom);
    const topLeft = { x: centreWorld.x - width / 2, y: centreWorld.y - height / 2 };
    const tileCount = 2 ** zoom;

    const tiles: { key: string; uri: string; left: number; top: number }[] = [];
    const firstX = Math.floor(topLeft.x / TILE_SIZE);
    const lastX = Math.floor((topLeft.x + width) / TILE_SIZE);
    const firstY = Math.floor(topLeft.y / TILE_SIZE);
    const lastY = Math.floor((topLeft.y + height) / TILE_SIZE);

    for (let x = firstX; x <= lastX; x++) {
      for (let y = firstY; y <= lastY; y++) {
        if (y < 0 || y >= tileCount) continue;
        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        tiles.push({
          key: `${zoom}-${x}-${y}`,
          uri: tileUrl(zoom, wrappedX, y),
          left: x * TILE_SIZE - topLeft.x,
          top: y * TILE_SIZE - topLeft.y,
        });
      }
    }

    const toScreen = (point: MapPoint) => {
      const world = project(point.latitude, point.longitude, zoom);
      return { x: world.x - topLeft.x, y: world.y - topLeft.y };
    };

    return { zoom, tiles, toScreen, topLeft };
  }, [anchors, fixedZoom, height, size.width]);

  const linePoints = points
    .filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude))
    .map((point) => view?.toScreen(point))
    .filter(Boolean);
  const polyline = linePoints.map((point) => `${point!.x.toFixed(1)},${point!.y.toFixed(1)}`).join(' ');

  const handlePress = (event: GestureResponderEvent) => {
    if (!view || !onPressPoint) return;

    const native = event.nativeEvent as {
      locationX?: number;
      locationY?: number;
      pageX?: number;
      pageY?: number;
    };

    const emit = (localX: number, localY: number) => {
      // A NaN here would poison every projected marker, so bail out instead.
      if (!Number.isFinite(localX) || !Number.isFinite(localY)) return;
      const point = unproject(
        view.topLeft.x + localX,
        view.topLeft.y + localY,
        view.zoom,
      );
      if (Number.isFinite(point.latitude) && Number.isFinite(point.longitude)) {
        onPressPoint(point);
      }
    };

    // React Native Web does not always fill `locationX` for press events, so
    // fall back to the page position measured against the container.
    if (Number.isFinite(native.locationX) && Number.isFinite(native.locationY)) {
      emit(native.locationX as number, native.locationY as number);
      return;
    }

    if (Number.isFinite(native.pageX) && Number.isFinite(native.pageY)) {
      containerRef.current?.measureInWindow((x, y) => {
        emit((native.pageX as number) - x, (native.pageY as number) - y);
      });
    }
  };

  return (
    <View
      ref={containerRef}
      style={[styles.container, { height }, !rounded && styles.square]}
      onLayout={onLayout}
    >
      {view
        ? view.tiles.map((tile) => (
            <Image
              key={tile.key}
              source={{ uri: tile.uri }}
              style={[styles.tile, { left: tile.left, top: tile.top }]}
              fadeDuration={0}
              accessibilityIgnoresInvertColors
            />
          ))
        : null}

      {view && (linePoints.length > 1 || markers.length > 0) ? (
        <Svg
          width={size.width}
          height={height}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          {linePoints.length > 1 ? (
            <>
              <Polyline
                points={polyline}
                fill="none"
                stroke={colors.primaryContainer}
                strokeOpacity={0.25}
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Polyline
                points={polyline}
                fill="none"
                stroke={colors.primaryContainer}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : null}

          {markers
            .filter(
              (marker) =>
                Number.isFinite(marker.latitude) && Number.isFinite(marker.longitude),
            )
            .map((marker, index) => {
              const position = view.toScreen(marker);
              const tone = marker.color ?? colors.primaryContainer;
              return (
                <Circle
                  key={`marker-${index}`}
                  cx={position.x}
                  cy={position.y}
                  r={8}
                  fill={tone}
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                />
              );
            })}

          {selected &&
          Number.isFinite(selected.latitude) &&
          Number.isFinite(selected.longitude) ? (
            <Circle
              cx={view.toScreen(selected).x}
              cy={view.toScreen(selected).y}
              r={16}
              fill="none"
              stroke={colors.primary}
              strokeWidth={3}
            />
          ) : null}
        </Svg>
      ) : null}

      {onPressPoint ? (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel="Pilih titik di peta"
        />
      ) : null}

      {!view || (anchors.length === 0 && points.length === 0) ? (
        <View style={styles.empty} pointerEvents="none">
          <Text variant="labelMd" color="textSecondary">
            {emptyLabel}
          </Text>
        </View>
      ) : null}

      <View style={styles.attribution} pointerEvents="none">
        <Text variant="caption" color="textSecondary">
          {MAPTILER_KEY ? '© MapTiler · © OpenStreetMap contributors' : '© OpenStreetMap contributors'}
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
  tile: { position: 'absolute', width: TILE_SIZE, height: TILE_SIZE },
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
