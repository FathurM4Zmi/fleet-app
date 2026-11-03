import { useMemo, useState } from 'react';
import { Image, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { Text } from '@/components/ui';
import { colors, radius } from '@/theme';

const TILE_SIZE = 256;
const MIN_ZOOM = 4;
const MAX_ZOOM = 14;

export interface MapPoint {
  latitude: number;
  longitude: number;
}

export interface MapMarker extends MapPoint {
  color?: string;
  label?: string;
}

export interface MapCanvasProps {
  /** Polyline to draw, e.g. the GPS trail or the route between origin and destination. */
  points?: MapPoint[];
  /** Pins drawn on top of the map. */
  markers?: MapMarker[];
  height?: number;
  /** Force a zoom level; when omitted the view is fitted to `points`/`markers`. */
  zoom?: number;
  emptyLabel?: string;
  /** Set false when the map is full-bleed inside a screen section. */
  rounded?: boolean;
}

/** Web-Mercator projection to world pixel coordinates (EPSG:3857, 256 px tiles). */
function project(latitude: number, longitude: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((latitude * Math.PI) / 180);
  const x = ((longitude + 180) / 360) * scale;
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
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
 * Real map (OpenStreetMap raster tiles) with an overlay for trails and pins.
 *
 * Tiles are plain <Image> requests, so the component works in Expo Go, native dev builds
 * and the web build without an API key. Usage policy requires attribution, rendered below.
 */
export function MapCanvas({
  points = [],
  markers = [],
  height = 220,
  zoom: fixedZoom,
  emptyLabel = 'Menunggu data lokasi',
  rounded = true,
}: MapCanvasProps) {
  const [size, setSize] = useState({ width: 0, height });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== size.width) setSize({ width, height });
  };

  const anchors = useMemo(
    () => [...points, ...markers].filter((point) => Number.isFinite(point.latitude)),
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
          uri: `https://a.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${wrappedX}/${y}.png`,
          left: x * TILE_SIZE - topLeft.x,
          top: y * TILE_SIZE - topLeft.y,
        });
      }
    }

    const toScreen = (point: MapPoint) => {
      const world = project(point.latitude, point.longitude, zoom);
      return { x: world.x - topLeft.x, y: world.y - topLeft.y };
    };

    return { zoom, tiles, toScreen };
  }, [anchors, fixedZoom, height, size.width]);

  const linePoints = points.map((point) => view?.toScreen(point)).filter(Boolean);
  const polyline = linePoints.map((point) => `${point!.x.toFixed(1)},${point!.y.toFixed(1)}`).join(' ');

  return (
    <View style={[styles.container, { height }, !rounded && styles.square]} onLayout={onLayout}>
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
        <Svg width={size.width} height={height} style={StyleSheet.absoluteFill}>
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

          {markers.map((marker, index) => {
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
        </Svg>
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
          © OpenStreetMap · © CARTO
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
