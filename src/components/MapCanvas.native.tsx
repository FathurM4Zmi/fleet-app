import type { ComponentType } from 'react';

import { MapCanvas as RasterMap } from './MapCanvas.raster';
import type { MapCanvasProps } from './MapCanvas.types';

/**
 * MapLibre needs a development build. Expo Go does not ship the native module,
 * so requiring it throws — in that case the screen keeps working with the
 * raster map instead of crashing.
 */
let MapLibreMap: ComponentType<MapCanvasProps> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  MapLibreMap = (require('./MapCanvas.maplibre') as { MapCanvas: ComponentType<MapCanvasProps> })
    .MapCanvas;
} catch {
  MapLibreMap = null;
}

export function MapCanvas(props: MapCanvasProps) {
  return MapLibreMap ? <MapLibreMap {...props} /> : <RasterMap {...props} />;
}
