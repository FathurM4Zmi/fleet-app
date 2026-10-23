import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Button, Screen, ScreenBody, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

/**
 * Reset PIN is an assisted flow: only a supervisor/admin can issue a new PIN
 * from the FleetOps web app. The driver app does not call a reset endpoint
 * (the backend only exposes `/auth/pin/change` for an authenticated driver).
 */
export default function ResetPinScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen style={{ backgroundColor: colors.surface }}>
      <ScreenBody bottomPadding={spacing.lg}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Icon name="lock" size={24} color={colors.primaryContainer} />
          </View>
          <Text variant="headlineMd" align="center">
            Reset PIN
          </Text>
          <Text variant="labelMd" color="secondary" align="center" style={styles.headerSub}>
            Demi keamanan akun, PIN tidak dapat diubah sendiri dari aplikasi driver.
          </Text>
        </View>

        <View style={styles.card}>
          <Icon name="headset" size={20} color={colors.primaryContainer} />
          <View style={styles.cardText}>
            <Text variant="titleMd">Hubungi supervisor</Text>
            <Text variant="bodyMd" color="textSecondary" style={styles.cardBody}>
              Supervisor akan memverifikasi identitas Anda dan menerbitkan PIN baru melalui
              aplikasi web FleetOps. Setelah itu masuk kembali dengan PIN tersebut.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Icon name="info" size={20} color={colors.textSecondary} />
          <View style={styles.cardText}>
            <Text variant="titleMd">Sudah punya PIN baru?</Text>
            <Text variant="bodyMd" color="textSecondary" style={styles.cardBody}>
              Gunakan PIN dari supervisor pada layar login. PIN bawaan harus segera diganti
              melalui menu profil setelah berhasil masuk.
            </Text>
          </View>
        </View>
      </ScreenBody>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Kembali ke login" onPress={() => router.replace('/(auth)/login')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: spacing.lg, gap: spacing.xs },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  headerSub: { marginTop: spacing.xs },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },
  cardText: { flex: 1, gap: spacing.xs },
  cardBody: { lineHeight: 21 },
  footer: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
