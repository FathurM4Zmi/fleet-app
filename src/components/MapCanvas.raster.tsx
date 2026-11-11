import { useCallback, useMemo, useRef, useState, type ComponentRef } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/ui';
import { colors, radius, shadows } from '@/theme';

import type { MapCanvasProps, MapPoint } from './MapCanvas.types';

const TILE_SIZE = 256;
const MIN_ZOOM = 4;
const MAX_ZOOM = 18;
/** Zoom used when the map follows the live vehicle position. */
const FOLLOW_ZOOM = 15;
const DEFAULT_CENTRE: MapPoint = { latitude: -6.2, longitude: 106.8166 };

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

const clampZoom = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

interface Touch {
  pageX: number;
  pageY: number;
}

interface ViewState {
  zoom: number;
  centre: MapPoint;
}

/** Moves the camera by a screen-space delta, keeping the same zoom. */
function shiftCentre(centre: MapPoint, zoom: number, dx: number, dy: number): MapPoint {
  const world = project(centre.latitude, centre.longitude, zoom);
  return unproject(world.x - dx, world.y - dy, zoom);
}

const touchDistance = (a: Touch, b: Touch) => Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);

const touchMidpoint = (a: Touch, b: Touch) => ({
  x: (a.pageX + b.pageX) / 2,
  y: (a.pageY + b.pageY) / 2,
});

/**
 * Raster map with an overlay for trails and pins, plus drag / pinch-to-zoom
 * gestures and on-screen zoom controls. Attribution is required and rendered
 * below.
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
  const [size, setSize] = useState({ width: 0, height });
  const containerRef = useRef<ComponentRef<typeof View>>(null);

  // Camera after the driver pans or pinches; `null` means "auto" (fit or follow).
  const [manual, setManual] = useState<ViewState | null>(null);
  const manualRef = useRef<ViewState | null>(null);

  const applyView = useCallback((next: ViewState) => {
    manualRef.current = next;
    setManual(next);
  }, []);

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

  /** Camera derived from the props: follow the live point, or fit the trail. */
  const autoView = useMemo<ViewState | null>(() => {
    const width = size.width;
    if (width <= 0) return null;

    const followPoint =
      follow && Number.isFinite(follow.latitude) && Number.isFinite(follow.longitude)
        ? follow
        : null;

    const zoom = fixedZoom ?? (followPoint ? FOLLOW_ZOOM : fitZoom(anchors, width, height));

    if (followPoint) {
      return { zoom, centre: { latitude: followPoint.latitude, longitude: followPoint.longitude } };
    }
    if (anchors.length > 0) {
      return {
        zoom,
        centre: {
          latitude:
            (Math.min(...anchors.map((p) => p.latitude)) +
              Math.max(...anchors.map((p) => p.latitude))) /
            2,
          longitude:
            (Math.min(...anchors.map((p) => p.longitude)) +
              Math.max(...anchors.map((p) => p.longitude))) /
            2,
        },
      };
    }
    return { zoom, centre: DEFAULT_CENTRE };
  }, [anchors, fixedZoom, follow, height, size.width]);

  const active = manual ?? autoView;

  const lastGesture = useRef<{ touches: Touch[]; view: ViewState } | null>(null);
  /** First touch of a one-finger drag, used to tell a tap from a pan. */
  const pressStart = useRef<{ x: number; y: number } | null>(null);

  /**
   * React Native Web does not always fill `touches` for mouse drags, so fall
   * back to the event's own page coordinates.
   */
  const touchesOf = (event: GestureResponderEvent): Touch[] => {
    const native = event.nativeEvent;
    if (native.touches && native.touches.length > 0) return [...native.touches];
    if (Number.isFinite(native.pageX) && Number.isFinite(native.pageY)) {
      return [{ pageX: native.pageX, pageY: native.pageY }];
    }
    return [];
  };

  // Two fingers always start a pinch; a single finger only becomes a pan after
  // moving, so taps still reach the `onPressPoint` overlay.
  const onStartShouldSetResponder = (event: GestureResponderEvent) => {
    const touches = touchesOf(event);
    if (touches.length >= 2) return true;
    if (touches.length === 1) {
      pressStart.current = { x: touches[0].pageX, y: touches[0].pageY };
    }
    return false;
  };

  const onMoveShouldSetResponder = (event: GestureResponderEvent) => {
    const touches = touchesOf(event);
    if (touches.length >= 2) return true;
    const start = pressStart.current;
    if (!start || touches.length !== 1) return false;
    return Math.hypot(touches[0].pageX - start.x, touches[0].pageY - start.y) > 4;
  };

  const onResponderGrant = (event: GestureResponderEvent) => {
    const view = manualRef.current ?? autoView;
    if (!view) return;
    lastGesture.current = { touches: touchesOf(event), view };
  };

  const onResponderMove = (event: GestureResponderEvent) => {
    const last = lastGesture.current;
    const touches = touchesOf(event);
    if (!last || touches.length === 0) return;

    // `last.view` is the camera we computed on the previous frame; using the
    // React state here would lag one move behind.
    const view = last.view;
    const previous = last.touches;
    let next: ViewState | null = null;

    if (touches.length >= 2 && previous.length >= 2) {
      const previousDistance = Math.max(1, touchDistance(previous[0], previous[1]));
      const distance = Math.max(1, touchDistance(touches[0], touches[1]));
      const previousMid = touchMidpoint(previous[0], previous[1]);
      const mid = touchMidpoint(touches[0], touches[1]);
      const zoom = clampZoom(view.zoom + Math.log2(distance / previousDistance));
      const centre = shiftCentre(view.centre, view.zoom, mid.x - previousMid.x, mid.y - previousMid.y);
      next = { zoom, centre };
    } else if (touches.length === 1 && previous.length === 1) {
      const dx = touches[0].pageX - previous[0].pageX;
      const dy = touches[0].pageY - previous[0].pageY;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      next = { zoom: view.zoom, centre: shiftCentre(view.centre, view.zoom, dx, dy) };
    }

    if (next) applyView(next);
    lastGesture.current = { touches: [...touches], view: next ?? view };
  };

  const endGesture = () => {
    lastGesture.current = null;
    pressStart.current = null;
  };

  const view = useMemo(() => {
    const width = size.width;
    if (!active || width <= 0) return null;

    const { zoom, centre } = active;
    const centreWorld = project(centre.latitude, centre.longitude, zoom);
    const topLeft = { x: centreWorld.x - width / 2, y: centreWorld.y - height / 2 };

    // Pinch produces fractional zoom levels, but tiles only exist at integer
    // zooms. Fetch the nearest level and scale the images to the current zoom.
    const tileZoom = Math.round(zoom);
    const scale = 2 ** (zoom - tileZoom);
    const scaledTileSize = TILE_SIZE * scale;
    const tileCount = 2 ** tileZoom;

    const tiles: { key: string; uri: string; left: number; top: number; size: number }[] = [];
    const firstX = Math.floor(topLeft.x / scaledTileSize);
    const lastX = Math.floor((topLeft.x + width) / scaledTileSize);
    const firstY = Math.floor(topLeft.y / scaledTileSize);
    const lastY = Math.floor((topLeft.y + height) / scaledTileSize);

    for (let x = firstX; x <= lastX; x++) {
      for (let y = firstY; y <= lastY; y++) {
        if (y < 0 || y >= tileCount) continue;
        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        tiles.push({
          key: `${tileZoom}-${x}-${y}`,
          uri: tileUrl(tileZoom, wrappedX, y),
          left: x * scaledTileSize - topLeft.x,
          top: y * scaledTileSize - topLeft.y,
          size: scaledTileSize,
        });
      }
    }

    const toScreen = (point: MapPoint) => {
      const world = project(point.latitude, point.longitude, zoom);
      return { x: world.x - topLeft.x, y: world.y - topLeft.y };
    };

    return { zoom, tiles, toScreen, topLeft };
  }, [active, height, size.width]);

  const zoomBy = (delta: number) => {
    const current = manualRef.current ?? autoView;
    if (!current) return;
    const zoom = clampZoom(current.zoom + delta);
    if (zoom === current.zoom) return;
    applyView({ zoom, centre: current.centre });
  };

  const resetToAuto = () => {
    manualRef.current = null;
    setManual(null);
  };

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
      onStartShouldSetResponder={onStartShouldSetResponder}
      onMoveShouldSetResponder={onMoveShouldSetResponder}
      onResponderGrant={onResponderGrant}
      onResponderMove={onResponderMove}
      onResponderRelease={endGesture}
      onResponderTerminate={endGesture}
      onResponderTerminationRequest={() => false}
    >
      {view
        ? view.tiles.map((tile) => (
            <Image
              key={tile.key}
              source={{ uri: tile.uri }}
              style={[
                styles.tile,
                { left: tile.left, top: tile.top, width: tile.size, height: tile.size },
              ]}
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

      <View style={styles.controls} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Perbesar peta"
          onPress={() => zoomBy(1)}
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
        >
          <Text variant="titleMd" color="ink" style={styles.controlGlyph}>
            +
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Perkecil peta"
          onPress={() => zoomBy(-1)}
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
        >
          <Text variant="titleMd" color="ink" style={styles.controlGlyph}>
            −
          </Text>
        </Pressable>
        {follow ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke posisi kendaraan"
            onPress={resetToAuto}
            style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
          >
            <Icon name="recenter" size={20} color={colors.primaryContainer} />
          </Pressable>
        ) : null}
      </View>

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
  controls: {
    position: 'absolute',
    right: 10,
    top: 10,
    gap: 8,
  },
  controlButton: {
    width: 38,
    height: 38,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: colors.divider,
    ...shadows.card,
  },
  controlPressed: { backgroundColor: colors.surfaceLow },
  controlGlyph: { lineHeight: 22 },
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
