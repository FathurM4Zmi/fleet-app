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
  Sheet,
  Text,
} from '@/components/ui';
import { toTripAsset } from '@/data/adapters';
import type { TripAsset, TripAssetReefer } from '@/data/types';
import { useTripAssets, useTripWarnings } from '@/hooks/api/useDriverData';
import { useRealtime } from '@/hooks/useRealtime';
import { useTrip } from '@/hooks/useTrip';
import { tripOpsApi } from '@/lib/api/endpoints';
import { formatRelative } from '@/lib/format';
import { colors, radius, shadows, spacing } from '@/theme';

export default function TripAssetsScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);
  const query = useTripAssets(tripId);
  const warningsQuery = useTripWarnings(tripId);
  useRealtime('alerts', () => void warningsQuery.refetch());
  const [checked, setChecked] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [custodyAsset, setCustodyAsset] = useState<TripAsset | null>(null);

  const assets = (query.data ?? []).map(toTripAsset);
  const pending = assets.filter((asset) => !checked.includes(asset.key));

  // FRD-MOB-AST-03 — geofence/anti-theft alerts raised for this trip.
  const theftWarnings = (warningsQuery.data?.active ?? []).filter((warning) =>
    /geofence|zona|zone|theft|curian|keluar|outside|pergerakan|detour/i.test(
      `${warning.title} ${warning.note ?? ''}`,
    ),
  );

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

        {theftWarnings.length > 0 ? (
          <View style={styles.theftPanel}>
            <View style={styles.theftHead}>
              <Icon name="warning" size={20} color={colors.critical} />
              <Text variant="bodyBold" color="critical" style={styles.flex}>
                Peringatan anti-theft
              </Text>
              <Badge label={`${theftWarnings.length} ALERT`} tone="critical" dot />
            </View>
            <Text variant="caption" color="critical">
              Pergerakan aset di luar zona yang diizinkan terdeteksi.
            </Text>
            {theftWarnings.map((warning) => (
              <View key={warning.key} style={styles.theftRow}>
                <Text variant="labelMd" color="critical">
                  {warning.title}
                </Text>
                {warning.note ? (
                  <Text variant="caption" color="onSurfaceVariant">
                    {warning.note}
                  </Text>
                ) : null}
                {warning.timeLabel ? (
                  <Text variant="labelSm" color="textMuted">
                    {warning.timeLabel}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

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

                  {asset.reefer ? <ReeferPanel reefer={asset.reefer} /> : null}

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Chain of custody ${asset.name}`}
                    onPress={() => setCustodyAsset(asset)}
                    style={styles.custodyLink}
                  >
                    <Icon name="timeline" size={16} color={colors.secondary} />
                    <Text variant="labelMd" color="secondary" style={styles.flex}>
                      Chain of Custody ({asset.custody.length})
                    </Text>
                    <Icon name="forward" size={16} color={colors.secondary} />
                  </Pressable>
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

      <Sheet
        visible={custodyAsset !== null}
        onClose={() => setCustodyAsset(null)}
        title="Chain of Custody"
        description={custodyAsset ? `${custodyAsset.code} • ${custodyAsset.name}` : undefined}
      >
        {custodyAsset && custodyAsset.custody.length > 0 ? (
          <View style={styles.custodyList}>
            {custodyAsset.custody.map((row, index) => (
              <View key={row.key}>
                <View style={styles.custodyRow}>
                  <View style={styles.custodyDot} />
                  <View style={styles.flex}>
                    <Text variant="bodyBold">{row.action}</Text>
                    <Text variant="caption" color="textSecondary">
                      {row.actor} • {formatRelative(row.at)}
                    </Text>
                    {row.location ? (
                      <Text variant="caption" color="textMuted">
                        {row.location}
                      </Text>
                    ) : null}
                    {row.note ? (
                      <Text variant="caption" color="textSecondary">
                        {row.note}
                      </Text>
                    ) : null}
                  </View>
                </View>
                {index < custodyAsset.custody.length - 1 ? (
                  <View style={styles.rowDivider} />
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <Text variant="bodyMd" color="textSecondary">
            Belum ada catatan chain-of-custody untuk aset ini.
          </Text>
        )}
      </Sheet>
    </Screen>
  );
}

/** FRD-MOB-ASSET-02 — suhu/kelembapan + status alarm cold-chain. */
function ReeferPanel({ reefer }: { reefer: TripAssetReefer }) {
  const alarm = reefer.alarm === 'alarm';
  const tone = alarm ? 'critical' : reefer.alarm === 'normal' ? 'success' : 'neutral';

  return (
    <View style={[styles.reefer, alarm && styles.reeferAlarm]}>
      <View style={styles.reeferHead}>
        <Icon
          name={alarm ? 'warning' : 'cargo'}
          size={16}
          color={alarm ? colors.critical : colors.secondary}
        />
        <Text variant="labelSm" color="textMuted" style={[styles.tracked, styles.flex]}>
          PANEL REEFER
        </Text>
        <Badge label={reefer.label} tone={tone} dot />
      </View>

      <View style={styles.reeferMetrics}>
        <ReeferMetric
          label="Suhu"
          value={reefer.temperatureC === null ? '—' : `${reefer.temperatureC.toFixed(1)} °C`}
        />
        <ReeferMetric
          label="Kelembapan"
          value={reefer.humidityPct === null ? '—' : `${Math.round(reefer.humidityPct)} %`}
        />
        <ReeferMetric
          label="Ambang"
          value={
            reefer.minC === null || reefer.maxC === null
              ? '—'
              : `${reefer.minC}…${reefer.maxC} °C`
          }
        />
      </View>

      {reefer.at ? (
        <Text variant="caption" color="textMuted">
          Telemetri {formatRelative(reefer.at)}
        </Text>
      ) : null}
    </View>
  );
}

function ReeferMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reeferMetric}>
      <Text variant="caption" color="textMuted">
        {label}
      </Text>
      <Text variant="bodyBold">{value}</Text>
    </View>
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

  // FRD-MOB-AST-03 — anti-theft / geofence warning
  theftPanel: {
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  theftHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  theftRow: {
    gap: 2,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
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

  // FRD-MOB-ASSET-02 — panel reefer
  reefer: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },
  reeferAlarm: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  reeferHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  reeferMetrics: { flexDirection: 'row', gap: spacing.md },
  reeferMetric: { flex: 1, gap: 2 },

  // FRD-MOB-ASSET-04 — chain-of-custody
  custodyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  custodyList: { gap: 0 },
  custodyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: spacing.sm },
  custodyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    backgroundColor: colors.primaryContainer,
  },
  rowDivider: { height: 1, backgroundColor: colors.divider },
});
