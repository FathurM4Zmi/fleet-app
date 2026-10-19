import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing } from '@/theme';
import { Text } from './Text';

export interface KeyValueRowProps {
  label: string;
  value: string;
  /** Colours the value, e.g. a critical status. */
  valueColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function KeyValueRow({ label, value, valueColor, style }: KeyValueRowProps) {
  return (
    <View style={[styles.base, style]}>
      <Text variant="bodyMd" color="textSecondary" style={styles.label}>
        {label}
      </Text>
      <Text variant="bodyBold" color={valueColor} style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: { flexShrink: 1 },
  value: { flexShrink: 0, textAlign: 'right', color: colors.ink },
});
