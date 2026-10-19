import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Text } from './Text';

export type BadgeTone = 'success' | 'warning' | 'critical' | 'info' | 'neutral';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  /** Adds a leading status dot. */
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TONES: Record<BadgeTone, { background: string; border: string; text: string }> = {
  success: {
    background: colors.successContainer,
    border: colors.success,
    text: colors.success,
  },
  warning: {
    background: colors.warningContainer,
    border: colors.warning,
    text: colors.warning,
  },
  critical: {
    background: colors.criticalContainer,
    border: colors.critical,
    text: colors.critical,
  },
  info: { background: colors.infoContainer, border: colors.info, text: colors.info },
  neutral: {
    background: colors.neutralContainer,
    border: colors.outlineVariant,
    text: colors.secondary,
  },
};

export function Badge({ label, tone = 'neutral', dot = false, style }: BadgeProps) {
  const palette = TONES[tone];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: palette.background, borderColor: palette.border },
        style,
      ]}
    >
      {dot ? <View style={[styles.dot, { backgroundColor: palette.text }]} /> : null}
      <Text variant="labelMd" color={palette.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
