import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, sizes, spacing } from '@/theme';
import { Text } from './Text';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Tint for the icon tile. Defaults to the brand blue. */
  iconColor?: string;
  /** Rendered at the trailing edge, before the chevron. */
  trailing?: ReactNode;
  /** Shows a chevron and makes the row pressable. */
  onPress?: () => void;
  /** Draws a bottom divider. Default `true`. */
  divider?: boolean;
}

export function ListRow({
  title,
  subtitle,
  icon,
  iconColor = colors.primaryContainer,
  trailing,
  onPress,
  divider = true,
}: ListRowProps) {
  const content = (
    <View style={[styles.base, divider && styles.divider]}>
      {icon ? (
        <View style={styles.iconTile}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>
      ) : null}

      <View style={styles.text}>
        <Text variant="titleMd" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing}
      {onPress ? <Icon name="forward" size={18} color={colors.outline} /> : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: sizes.touchTarget + 8,
    paddingVertical: spacing.md,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  pressed: { opacity: 0.7 },
});
