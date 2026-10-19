import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors, typography } from '@/theme';
import { Text } from './Text';

export interface ProgressRingProps {
  /** 0–100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** Ring colour. Defaults to the brand blue. */
  color?: string;
  /** Track colour. */
  trackColor?: string;
  /** Rendered under the value. */
  caption?: string;
  /** Rendered as a smaller suffix beside the value, e.g. `/100`. */
  suffix?: string;
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6.5,
  color = colors.primaryContainer,
  trackColor = colors.divider,
  caption,
  suffix,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <View style={[styles.base, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="transparent"
          // Start the arc at 12 o'clock.
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.centre} pointerEvents="none">
        <View style={styles.valueRow}>
          <Text
            variant="headlineMd"
            style={{ fontSize: Math.round(size * 0.3), lineHeight: Math.round(size * 0.34) }}
          >
            {Math.round(clamped)}
          </Text>
          {suffix ? (
            <Text variant="labelSm" color="textMuted">
              {suffix}
            </Text>
          ) : null}
        </View>
        {caption ? (
          <Text variant="labelSm" color="textMuted" style={styles.caption}>
            {caption.toUpperCase()}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  centre: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  caption: { fontSize: typography.labelSm.fontSize - 1, letterSpacing: 0.4 },
});
