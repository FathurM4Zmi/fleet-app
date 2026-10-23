import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/ui';
import { useOutbox } from '@/hooks/useOutbox';
import { colors, spacing } from '@/theme';

/** Shown while submitted evidence is still waiting in the offline outbox. */
export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const { pending, syncing, sync } = useOutbox();

  if (pending === 0) return null;

  return (
    <View style={[styles.banner, { paddingTop: insets.top + spacing.xs }]}>
      <Icon name="sync" size={16} color={colors.onPrimary} />
      <Text variant="labelSm" color="onPrimary" style={styles.text}>
        {syncing ? 'Menyinkronkan data…' : `${pending} data menunggu dikirim`}
      </Text>
      {!syncing ? (
        <Pressable
          onPress={() => void sync()}
          accessibilityRole="button"
          accessibilityLabel="Kirim data yang menunggu"
          hitSlop={8}
        >
          <Text variant="labelSm" color="onPrimary" style={styles.action}>
            Kirim
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xs,
    backgroundColor: colors.primaryContainer,
  },
  text: { flex: 1 },
  action: { textDecorationLine: 'underline' },
});
