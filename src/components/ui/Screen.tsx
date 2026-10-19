import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, spacing } from '@/theme';

export interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Full-bleed canvas. Every route renders inside one of these. */
export function Screen({ children, style }: ScreenProps) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export interface ScreenBodyProps {
  children: ReactNode;
  /** Extra bottom padding so content clears a pinned bar or the tab bar. */
  bottomPadding?: number;
  /** Disables scrolling for screens that manage their own layout. */
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Scrollable content area with the 16px screen gutter applied. */
export function ScreenBody({ children, bottomPadding = spacing.xl, scrollEnabled = true, style }: ScreenBodyProps) {
  return (
    <ScrollView
      style={styles.body}
      scrollEnabled={scrollEnabled}
      contentContainerStyle={[styles.bodyContent, { paddingBottom: bottomPadding }, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: spacing.gutter, paddingTop: spacing.sm },
});
