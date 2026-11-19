import { useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Card, Screen, ScreenBody, ScreenHeader, Text } from '@/components/ui';
import { useApiQuery } from '@/hooks/api/useApiQuery';
import { notificationApi } from '@/lib/api/endpoints';
import { colors, radius, spacing } from '@/theme';

/** Tipe notifikasi yang bisa diatur driver. `*` = default untuk tipe lain. */
const TYPES: { type: string; label: string; description: string }[] = [
  { type: 'Alert', label: 'Peringatan trip', description: 'Geofence, kecepatan, dan peringatan lain.' },
  { type: 'SafetyEvent', label: 'Peristiwa safety', description: 'Pengereman mendadak, speeding, dan sejenisnya.' },
  { type: '*', label: 'Notifikasi lain', description: 'Penugasan, POD, dan pengingat umum.' },
];

export default function NotificationPreferencesScreen() {
  const query = useApiQuery(notificationApi.preferences, []);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const enabledOf = (type: string) => {
    if (overrides[type] !== undefined) return overrides[type];
    const row = (query.data ?? []).find((item) => item.notificationType === type);
    return row?.isEnabled ?? true;
  };

  const toggle = async (type: string, next: boolean) => {
    setOverrides((previous) => ({ ...previous, [type]: next }));
    try {
      await notificationApi.setPreference(type, next);
    } catch (error) {
      setOverrides((previous) => ({ ...previous, [type]: !next }));
      Alert.alert(
        'Gagal menyimpan preferensi',
        error instanceof Error ? error.message : 'Periksa koneksi lalu coba lagi.',
      );
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Preferensi Notifikasi" subtitle="Pilih notifikasi yang ingin diterima" onBack />
      <ScreenBody bottomPadding={spacing.xxl}>
        <Card padded={false}>
          {TYPES.map((entry, index) => (
            <View key={entry.type}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <Text variant="bodyBold">{entry.label}</Text>
                  <Text variant="caption" color="textSecondary">
                    {entry.description}
                  </Text>
                </View>
                <Switch
                  value={enabledOf(entry.type)}
                  onValueChange={(next) => void toggle(entry.type, next)}
                  trackColor={{ false: colors.surfaceHigh, true: colors.primaryContainer }}
                  thumbColor={colors.surface}
                  accessibilityLabel={`Aktifkan ${entry.label}`}
                />
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.note}>
          <Icon name="info" size={20} color="#1D4ED8" />
          <Text variant="caption" color="textSecondary" style={styles.flex}>
            Notifikasi kritis tetap dikirim meskipun tipenya dimatikan.
          </Text>
        </View>

        {query.error ? (
          <Text variant="caption" color="critical" align="center" style={styles.error}>
            {query.error.message}
          </Text>
        ) : null}
      </ScreenBody>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  rowText: { flex: 1, gap: 2 },
  divider: { height: 1, backgroundColor: colors.divider, marginHorizontal: spacing.md },
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.infoContainer,
  },
  error: { marginTop: spacing.md },
});
