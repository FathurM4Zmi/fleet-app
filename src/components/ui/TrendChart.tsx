import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import { colors } from '@/theme';

/** Fixed coordinate space; the SVG scales to the parent width. */
const VIEW_W = 320;
const VIEW_H = 120;
const PAD_X = 10;
const PAD_TOP = 14;
const PAD_BOTTOM = 16;
const BASELINE = VIEW_H - PAD_BOTTOM;
const GRID_ROWS = [20, 60, 100];

export interface TrendSeries {
  key: string;
  color: string;
  values: number[];
  /** Fills the area between the line and the baseline. */
  filled?: boolean;
}

export interface TrendChartProps {
  series: TrendSeries[];
  /**
   * Dashed horizontal marker, e.g. a fleet average. Normalised against the
   * first series, so it is only meaningful for single-series charts.
   */
  reference?: number;
  height?: number;
  /** Draws the dashed grid rails behind the series. */
  grid?: boolean;
}

interface Point {
  x: number;
  y: number;
}

/** Quadratic smoothing through segment midpoints — no sharp elbows. */
const buildPath = (points: Point[]): string => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x},${points[i].y} ${midX},${midY}`;
  }

  const last = points[points.length - 1];
  return `${d} L ${last.x},${last.y}`;
};

const closeArea = (line: string, points: Point[]): string =>
  `${line} L ${points[points.length - 1].x},${BASELINE} L ${points[0].x},${BASELINE} Z`;

/**
 * Scales a series to its own min/max. Each series therefore gets its own
 * y-axis — the same treatment the Stitch designs use when they plot trips and
 * punctuality percentages on a single card.
 */
const toPoints = (values: number[], extra: number[] = []): { points: Point[]; min: number; span: number } => {
  const min = Math.min(...values, ...extra);
  const max = Math.max(...values, ...extra);
  const span = max - min || 1;
  const step = values.length > 1 ? (VIEW_W - PAD_X * 2) / (values.length - 1) : 0;

  return {
    min,
    span,
    points: values.map((value, index) => ({
      x: PAD_X + index * step,
      y: PAD_TOP + (1 - (value - min) / span) * (BASELINE - PAD_TOP),
    })),
  };
};

export function TrendChart({ series, reference, height = 128, grid = true }: TrendChartProps) {
  const first = series[0];
  const scale = first ? toPoints(first.values, reference === undefined ? [] : [reference]) : undefined;

  const referenceY =
    reference === undefined || !scale
      ? undefined
      : PAD_TOP + (1 - (reference - scale.min) / scale.span) * (BASELINE - PAD_TOP);

  return (
    <View style={[styles.base, { height }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none">
        {grid
          ? GRID_ROWS.map((y, index) => (
              <Line
                key={y}
                x1={0}
                x2={VIEW_W}
                y1={y}
                y2={y}
                stroke={colors.surfaceLow}
                strokeWidth={1}
                strokeDasharray={index === GRID_ROWS.length - 1 ? undefined : '2 2'}
              />
            ))
          : null}

        {referenceY === undefined ? null : (
          <Line
            x1={0}
            x2={VIEW_W}
            y1={referenceY}
            y2={referenceY}
            stroke={colors.textMuted}
            strokeWidth={1.2}
            strokeDasharray="4 4"
          />
        )}

        {series.map((entry) => {
          const { points } = toPoints(entry.values);
          const line = buildPath(points);

          return (
            <G key={entry.key}>
              {entry.filled ? (
                <Path d={closeArea(line, points)} fill={entry.color} fillOpacity={0.14} />
              ) : null}
              <Path
                d={line}
                fill="none"
                stroke={entry.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((point) => (
                <Circle
                  key={`${entry.key}-${point.x}`}
                  cx={point.x}
                  cy={point.y}
                  r={3.5}
                  fill={colors.surface}
                  stroke={entry.color}
                  strokeWidth={2}
                />
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { width: '100%' },
});
