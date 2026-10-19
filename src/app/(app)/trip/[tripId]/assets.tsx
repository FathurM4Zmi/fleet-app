import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Line, Path, Polyline, Stop, Text as SvgText } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { BottomBar, Button, Card, EmptyState, Screen, ScreenBody, ScreenHeader, Text } from '@/components/ui';
import { tripAssets } from '@/data/fixtures';
import { useTrip } from '@/hooks/useTrip';
import { colors, radius, shadows, spacing } from '@/theme';

export default function TripAssetsScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);

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

  const { reefer, trailers, warning } = tripAssets;

  return (
    <Screen>
      <ScreenHeader title="Aset Trip" onBack />

      <ScreenBody bottomPadding={140}>
        {/* Strip */}
        <Card shadow>
          <View style={styles.stripRow}>
            <View style={styles.stripLeft}>
              <Icon name="cargo" size={20} color={colors.secondary} />
              <Text variant="headlineSm">{trip.code}</Text>
            </View>
            <View style={styles.activeChip}>
              <View style={styles.activeDot} />
              <Text variant="labelMd" color="#1D4ED8">
                Aset Aktif
              </Text>
            </View>
          </View>
        </Card>

        {/* Info */}
        <View style={styles.info}>
          <Icon name="truck" size={24} color={colors.primaryContainer} />
          <Text variant="bodyMd" color="onSurface" style={styles.flex}>
            Aset yang terdaftar akan divalidasi dispatcher sebelum tiba.
          </Text>
        </View>

        {/* Reefer */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            REEFER BOX
          </Text>
          <Card padded={false} shadow style={[styles.reeferCard, { borderLeftColor: colors.critical }]}>
            <View style={styles.reeferInner}>
              <View style={styles.reeferHead}>
                <Text variant="headlineSm">{reefer.name}</Text>
                <View style={styles.warningChip}>
                  <Icon name="error" size={13} color={colors.critical} />
                  <Text variant="labelMd" color={colors.critical}>
                    {reefer.statusLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.reeferBody}>
                <View style={styles.reeferRow}>
                  <View style={styles.reeferLabel}>
                    <Icon name="temperature" size={18} color={colors.secondary} />
                    <Text variant="caption" color="textSecondary">
                      Suhu Ruang Kargo
                    </Text>
                  </View>
                  <Text variant="headlineSm" color="critical">
                    {reefer.temperatureC} °C
                  </Text>
                </View>
                <View style={styles.reeferRow}>
                  <View style={styles.reeferLabel}>
                    <Icon name="humidity" size={18} color={colors.secondary} />
                    <Text variant="caption" color="textSecondary">
                      Kelembaban Relatif
                    </Text>
                  </View>
                  <Text variant="headlineSm">{reefer.humidityPercent}%</Text>
                </View>
              </View>

              <View style={styles.reeferFoot}>
                <View style={styles.sensorRow}>
                  <View style={styles.sensorDot} />
                  <Text variant="labelMd" color="textSecondary">
                    Sensor BLE Aktif
                  </Text>
                </View>
                <Text variant="labelMd" color="textMuted">
                  ID: {reefer.sensorId}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Trend */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            TREN 6 JAM TERAKHIR
          </Text>
          <Card shadow>
            <TemperatureChart />
            <View style={styles.chartAxis}>
              {reefer.trendLabels.map((label, index) => (
                <Text
                  key={label}
                  variant="labelSm"
                  color={index === reefer.trendLabels.length - 1 ? 'ink' : 'textMuted'}
                >
                  {index === reefer.trendLabels.length - 1 ? `${label} (Kini)` : label}
                </Text>
              ))}
            </View>
            <View style={styles.trendNote}>
              <Icon name="success" size={18} color={colors.success} />
              <Text variant="labelLg" color="success">
                {reefer.trendNote}
              </Text>
            </View>
          </Card>
        </View>

        {/* Trailer box */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            TRAILER BOX
          </Text>
          <View style={styles.trailerGrid}>
            {trailers.map((asset) => (
              <View key={asset.key} style={styles.trailerCard}>
                <View style={styles.trailerHead}>
                  <Text variant="labelMd" color="textSecondary">
                    {asset.code}
                  </Text>
                  <View
                    style={[
                      styles.trailerChip,
                      asset.statusTone === 'success'
                        ? styles.trailerChipOk
                        : styles.trailerChipWarn,
                    ]}
                  >
                    {asset.statusTone === 'success' ? (
                      <View style={styles.trailerDotOk} />
                    ) : (
                      <Icon name="warning" size={12} color={colors.warning} />
                    )}
                    <Text
                      variant="labelSm"
                      color={asset.statusTone === 'success' ? colors.success : colors.warning}
                    >
                      {asset.statusLabel}
                    </Text>
                  </View>
                </View>
                <Text variant="headlineSm">{asset.name}</Text>
                <View style={styles.trailerFoot}>
                  <Icon
                    name={asset.footIcon}
                    size={16}
                    color={asset.statusTone === 'success' ? colors.secondary : colors.warning}
                  />
                  <Text
                    variant="labelMd"
                    color={asset.statusTone === 'success' ? 'textSecondary' : colors.warning}
                  >
                    {asset.footNote}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.lockNote}>
            <Icon name="lock" size={16} color={colors.textSecondary} />
            <Text variant="labelMd" color="textSecondary">
              Gembok elektronik aktif
            </Text>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            PERINGATAN
          </Text>
          <Card padded={false} shadow style={[styles.assetWarning, { borderLeftColor: colors.warning }]}>
            <View style={styles.assetWarningInner}>
              <View style={styles.assetWarningHead}>
                <Icon name="warning" size={20} color={colors.warning} />
                <View style={styles.flex}>
                  <Text variant="headlineSm">{warning.title}</Text>
                  <Text variant="bodyMd" color="onSurfaceVariant" style={styles.assetWarningBody}>
                    {warning.body}
                  </Text>
                </View>
              </View>
              <View style={styles.assetWarningActions}>
                <Pressable accessibilityRole="button" style={styles.assetAction}>
                  <Text variant="labelLg">Lapor Dispatcher</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push(`/trip/${trip.id}/route`)}
                  accessibilityRole="button"
                  style={styles.assetActionGhost}
                >
                  <Icon name="nearMe" size={18} color={colors.primaryContainer} />
                  <Text variant="labelLg" color="primaryContainer">
                    Lokasi
                  </Text>
                </Pressable>
              </View>
            </View>
          </Card>
        </View>

        {/* Scan tile */}
        <Pressable accessibilityRole="button" style={styles.scanTile}>
          <View style={styles.scanIcon}>
            <Icon name="qr" size={30} color={colors.primaryContainer} />
          </View>
          <Text variant="headlineSm">Pindai Tambah Aset</Text>
          <Text variant="labelMd" color="textSecondary" style={styles.scanHint}>
            Format QR, Code 128, atau RFID tag
          </Text>
        </Pressable>
      </ScreenBody>

      <BottomBar>
        <Button label="Simpan Daftar Aset" onPress={() => router.back()} />
      </BottomBar>
    </Screen>
  );
}

function TemperatureChart() {
  const points = '30,75 75,70 140,64 205,58 260,60 310,60';

  return (
    <Svg viewBox="0 0 320 120" width="100%" height={140}>
      <Defs>
        <LinearGradient id="tempGradient" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor="#1B4DFF" stopOpacity="0.18" />
          <Stop offset="100%" stopColor="#1B4DFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      <Line stroke="#E5E7EB" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="310" y1="20" y2="20" />
      <Line stroke="#E5E7EB" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="310" y1="60" y2="60" />
      <Line stroke="#E5E7EB" strokeWidth="1" x1="30" x2="310" y1="100" y2="100" />

      <SvgText fill="#9CA3AF" fontFamily="Inter" fontSize="10" textAnchor="end" x="24" y="24">
        6°C
      </SvgText>
      <SvgText fill="#9CA3AF" fontFamily="Inter" fontSize="10" textAnchor="end" x="24" y="64">
        4°C
      </SvgText>
      <SvgText fill="#9CA3AF" fontFamily="Inter" fontSize="10" textAnchor="end" x="24" y="103">
        2°C
      </SvgText>

      <Path d="M 30,75 L 75,70 L 140,64 L 205,58 L 260,60 L 310,60 L 310,100 L 30,100 Z" fill="url(#tempGradient)" />
      <Polyline
        points={points}
        fill="none"
        stroke="#1B4DFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <Circle cx="30" cy="75" fill="#1B4DFF" r="3" />
      <Circle cx="140" cy="64" fill="#1B4DFF" r="3" />
      <Circle cx="205" cy="58" fill="#1B4DFF" r="3" />
      <Circle cx="310" cy="60" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" r="4" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },

  stripRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stripLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: '#E6EDFD',
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1D4ED8' },

  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md + 2,
    borderRadius: radius.card,
    backgroundColor: '#E6EDFD',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  section: { marginTop: spacing.lg, gap: spacing.sm },
  reeferCard: { borderLeftWidth: 4, overflow: 'hidden' },
  reeferInner: { padding: spacing.lg, gap: spacing.md },
  reeferHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  warningChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.criticalContainer,
  },
  reeferBody: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reeferRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reeferLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reeferFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sensorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sensorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },

  chartAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: spacing.xl,
    paddingRight: spacing.xs,
    marginTop: spacing.xs,
  },
  trendNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  trailerGrid: { flexDirection: 'row', gap: spacing.md },
  trailerCard: {
    flex: 1,
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  trailerHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  trailerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  trailerChipOk: { backgroundColor: colors.successContainer },
  trailerChipWarn: { backgroundColor: colors.warningContainer },
  trailerDotOk: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  trailerFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  lockNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: 2 },

  assetWarning: { borderLeftWidth: 4, overflow: 'hidden' },
  assetWarningInner: { padding: spacing.lg, gap: spacing.md },
  assetWarningHead: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm + 2 },
  assetWarningBody: { marginTop: spacing.xs },
  assetWarningActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  assetAction: {
    minHeight: 48,
    paddingHorizontal: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  assetActionGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    minHeight: 48,
    paddingHorizontal: spacing.sm,
  },

  scanTile: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    backgroundColor: 'rgba(239,246,255,0.5)',
  },
  scanIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  scanHint: { marginTop: 2 },
});
