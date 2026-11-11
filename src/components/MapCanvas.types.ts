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
  /**
   * When set, the camera centres on this point (the live vehicle position)
   * instead of fitting every point, so the map follows the trip in real time.
   */
  follow?: MapPoint | null;
  emptyLabel?: string;
  /** Set false when the map is full-bleed inside a screen section. */
  rounded?: boolean;
  /**
   * Makes the map tappable and reports the coordinate under the finger.
   * Used by the fuel screen to pick the filling point.
   */
  onPressPoint?: (point: MapPoint) => void;
  /** Point drawn with a highlight ring, e.g. the currently selected SPBU. */
  selected?: MapPoint | null;
}
