import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  Badge,
  BottomBar,
  Button,
  Card,
  EmptyState,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { toTripAsset } from '@/data/adapters';
import { useTripAssets } from '@/hooks/api/useDriverData';
import { useTrip } from '@/hooks/useTrip';
import { tripOpsApi } from '@/lib/api/endpoints';
import { colors, radius, shadows, spacing } from '@/theme';

export default function TripAssetsScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);
  const query = useTripAssets(tripId);
  const [checked, setChecked] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const assets = (query.data ?? []).map(toTripAsset);
  const pending = assets.filter((asset) => !checked.includes(asset.key));

  const verify = async (assetId: string) => {
    if (!tripId || busyId) return;
    setBusyId(assetId);
    setError(null);
    try {
      await tripOpsApi.checkAsset(tripId, assetId);
      setChecked((current) => [...current, assetId]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Gagal memverifikasi aset.');
    } finally {
      setBusyId(null);
    }
  };

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Aset Trip" onBack />
        <EmptyState
          icon="cargo"
          title="Trip tidak ditemukan"
          description="Penugasan ini mungkin sudah dibatalkan oleh dispatcher."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Aset Trip" onBack />

      <ScreenBody bottomPadding={140}>
        <Card shadow>
          <View style={styles.stripRow}>
            <View style={styles.stripLeft}>
              <Icon name="cargo" size={20} color={colors.secondary} />
              <Text variant="headlineSm">{trip.code}</Text>
            </View>
            <Badge
              label={`${checked.length}/${assets.length} diverifikasi`}
              tone={pending.length === 0 && assets.length > 0 ? 'success' : 'neutral'}
              dot
            />
          </View>
        </Card>

        <View style={styles.info}>
          <Icon name="truck" size={24} color={colors.primaryContainer} />
          <Text variant="bodyMd" color="onSurface" style={styles.flex}>
            Periksa setiap aset sebelum berangkat. Verifikasi tercatat atas nama Anda.
          </Text>
        </View>

        {assets.length === 0 ? (
          <EmptyState
            icon="cargo"
            title="Tidak ada aset"
            description={
              query.error?.message ?? 'Dispatcher belum menautkan aset ke perjalanan ini.'
            }
          />
        ) : (
          <View style={styles.list}>
            {assets.map((asset) => {
              const verified = checked.includes(asset.key);
              return (
                <Card key={asset.key} style={styles.assetCard}>
                  <View style={styles.assetHead}>
                    <View style={styles.flex}>
                      <Text variant="labelSm" color="textMuted" style={styles.tracked}>
                        {asset.code}
                      </Text>
                      <Text variant="titleMd">{asset.name}</Text>
                    </View>
                    <Badge
                      label={verified ? 'Terverifikasi' : asset.statusLabel}
                      tone={verified ? 'success' : asset.statusTone === 'success' ? 'success' : 'warning'}
                      dot
                    />
                  </View>

                  <View style={styles.assetFoot}>
                    <View style={styles.footNote}>
                      <Icon
                        name={asset.footIcon === 'lock' ? 'lock' : 'search'}
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text variant="caption" color="textSecondary">
                        {asset.footNote}
                      </Text>
                    </View>

                    {verified ? (
                      <View style={styles.verifiedRow}>
                        <Icon name="success" size={16} color={colors.success} />
                        <Text variant="labelMd" color="success">
                          Selesai
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => void verify(asset.key)}
                        disabled={busyId === asset.key}
                        style={styles.verifyButton}
                      >
                        <Text variant="labelMd" color="primaryContainer">
                          {busyId === asset.key ? 'Memeriksa…' : 'Verifikasi'}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {error ? (
          <Text variant="caption" color="critical" align="center">
            {error}
          </Text>
        ) : null}
      </ScreenBody>

      <BottomBar>
        <Button
          label="Kembali ke Trip"
          variant="secondary"
          onPress={() => router.back()}
        />
      </BottomBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  stripRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stripLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.infoContainer,
  },
  list: { marginTop: spacing.lg, gap: spacing.md },
  assetCard: { ...shadows.card, gap: spacing.md },
  assetHead: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tracked: { letterSpacing: 0.8 },
  assetFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  footNote: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  verifyButton: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
});
