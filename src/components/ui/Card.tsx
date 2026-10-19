import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { colors, radius, shadows, spacing } from '@/theme';

export interface CardProps {
  children: ReactNode;
  /** Adds the standard 16px inner padding. Default `true`. */
  padded?: boolean;
  /** Applies the restrained ambient card shadow. Default `false`. */
  shadow?: boolean;
  /** Renders the card as a pressable surface. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Card({ children, padded = true, shadow = false, onPress, style, testID }: CardProps) {
  const content = (
    <View style={[styles.base, padded && styles.padded, shadow && shadows.card, style]}>
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  padded: { padding: spacing.cardPadding },
  pressed: { opacity: 0.9 },
});
