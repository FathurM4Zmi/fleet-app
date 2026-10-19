import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, shadows, spacing } from '@/theme';

export interface BottomBarProps {
  children: ReactNode;
  /** Adds the device bottom inset so content clears the home indicator. */
  inset?: boolean;
}

/** Pinned action zone. Render as a sibling of the scroll view, never inside it. */
export function BottomBar({ children, inset = true }: BottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.base,
        shadows.bar,
        { paddingBottom: inset ? insets.bottom + spacing.md : spacing.lg },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.gutter,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
