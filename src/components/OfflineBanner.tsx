import { useNetInfo } from '@react-native-community/netinfo';
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
  // Visibilitas status sistem (heuristik #1): beri tahu saat sinyal hilang walau antrean kosong,
  // supaya driver tahu aksinya akan disimpan dulu, bukan gagal diam-diam.
  const net = useNetInfo();
  const offline = net.isConnected === false;

  if (pending === 0 && !offline) return null;

  return (
    <View style={[styles.banner, { paddingTop: insets.top + spacing.xs }]}>
      <Icon name="sync" size={16} color={colors.onPrimary} />
      <Text variant="labelSm" color="onPrimary" style={styles.text}>
        {syncing
          ? 'Menyinkronkan data…'
          : pending > 0
            ? 'Tersimpan offline. Akan tersinkron saat online.'
            : 'Tidak ada sinyal. Data yang dikirim akan disimpan dan dikirim otomatis.'}
      </Text>
      {!syncing && pending > 0 ? (
        <Pressable
          onPress={() => void sync()}
          accessibilityRole="button"
          accessibilityLabel={`Kirim ${pending} data yang menunggu`}
          hitSlop={8}
        >
          <Text variant="labelSm" color="onPrimary" style={styles.action}>
            {`Kirim (${pending})`}
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
