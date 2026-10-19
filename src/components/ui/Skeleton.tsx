import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  /** Corner radius. Defaults to the input radius (8). */
  cornerRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Placeholder block with a gentle opacity pulse. Used instead of a spinner. */
export function Skeleton({ width = '100%', height = 16, cornerRadius = radius.input, style }: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[styles.base, { width, height, borderRadius: cornerRadius, opacity }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.surfaceContainer },
});
