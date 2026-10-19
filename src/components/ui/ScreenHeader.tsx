import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { colors, sizes, spacing } from '@/theme';
import { Text } from './Text';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Pass `true` for the default `router.back()`, or a custom handler. */
  onBack?: boolean | (() => void);
  /** Rendered at the trailing edge. */
  right?: ReactNode;
  /** Hides the bottom hairline. */
  borderless?: boolean;
}

export function ScreenHeader({ title, subtitle, onBack, right, borderless = false }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const handleBack = typeof onBack === 'function' ? onBack : () => router.back();

  return (
    <View
      style={[
        styles.base,
        { paddingTop: insets.top + spacing.sm },
        !borderless && styles.bordered,
      ]}
    >
      {onBack ? (
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          hitSlop={8}
          style={styles.back}
        >
          <Icon name="back" size={22} color={colors.ink} />
        </Pressable>
      ) : null}

      <View style={styles.titleBlock}>
        <Text variant="headlineSm" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: sizes.header,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.sm,
    backgroundColor: colors.canvas,
  },
  bordered: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  titleBlock: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
