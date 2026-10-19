import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, spacing } from '@/theme';
import { Text } from './Text';

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: string;
  /** Usually a `<Button />`. */
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.base}>
      <View style={styles.iconTile}>
        <Icon name={icon} size={32} color={colors.primaryContainer} />
      </View>
      <Text variant="titleMd" align="center">
        {title}
      </Text>
      {description ? (
        <Text variant="bodyMd" color="textSecondary" align="center">
          {description}
        </Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  action: { marginTop: spacing.md, alignSelf: 'stretch' },
});
