/**
 * Web build: raster tiles (plain <Image> requests, no native module needed).
 *
 * The native app prefers MapLibre (see MapCanvas.native.tsx) and falls back to
 * this same raster map when the native module is unavailable, e.g. in Expo Go.
 */
export { MapCanvas } from './MapCanvas.raster';
