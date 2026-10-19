import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Card, EmptyState, Screen, ScreenBody, Text } from '@/components/ui';
import { tripEtaSummary, tripRouteStops, tripTelemetry } from '@/data/fixtures';
import { useTrip } from '@/hooks/useTrip';
import { colors, radius, shadows, spacing } from '@/theme';

export default function TripRouteScreen() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip, vehicle } = useTrip(tripId);

  if (!trip) {
    return (
      <Screen>
        <View style={[styles.darkBar, { paddingTop: insets.top }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            onPress={() => router.back()}
            style={styles.darkBack}
          >
            <Icon name="back" size={24} color={colors.onPrimary} />
          </Pressable>
          <Text variant="headlineSm" color={colors.onPrimary}>
            Posisi Trip
          </Text>
          <View style={styles.darkSpacer} />
        </View>
        <EmptyState
          icon="map"
          title="Trip tidak ditemukan"
          description="Penugasan ini mungkin sudah dibatalkan oleh dispatcher."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[styles.darkBar, { paddingTop: insets.top }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={() => router.back()}
          style={styles.darkBack}
        >
          <Icon name="back" size={24} color={colors.onPrimary} />
        </Pressable>
        <Text variant="headlineSm" color={colors.onPrimary}>
          Posisi Trip
        </Text>
        <View style={styles.gpsPill}>
          <View style={styles.gpsDot} />
          <Text variant="labelSm" color="#6EE7B7">
            {tripTelemetry.gpsLabel}
          </Text>
        </View>
      </View>

      <ScreenBody bottomPadding={spacing.xxl} style={styles.body}>
        {/* Map */}
        <View style={styles.map}>
          <RouteMap />
          <View style={styles.recenter}>
            <Icon name="recenter" size={22} color="#374151" />
          </View>
        </View>

        {/* ETA bar */}
        <View style={styles.etaBar}>
          <EtaCell label="ETA" value={tripEtaSummary.eta} />
          <View style={styles.etaDivider} />
          <EtaCell label="Sisa Jarak" value={`${tripEtaSummary.remainingKm} km`} highlight />
          <View style={styles.etaDivider} />
          <EtaCell label="Sisa Waktu" value={`${tripEtaSummary.remainingMinutes} mnt`} />
        </View>

        {/* Telemetry */}
        <View style={styles.sectionHead}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            TELEMETRIK
          </Text>
          <Text variant="labelSm" color="textMuted">
            {vehicle?.model ?? '—'} • {vehicle?.plate ?? '—'}
          </Text>
        </View>

        <Card shadow>
          <View style={styles.telemetryRow}>
            <View style={styles.telemetryLabel}>
              <Icon name="fuel" size={20} color="textSecondary" />
              <Text variant="caption" color="textSecondary">
                Level BBM
              </Text>
            </View>
            <Text variant="labelLg">{tripTelemetry.fuelPercent}%</Text>
          </View>
          <View style={styles.fuelTrack}>
            <View style={[styles.fuelFill, { width: `${tripTelemetry.fuelPercent}%` }]} />
          </View>

          <View style={styles.divider} />
          <TelemetryRow icon="speed" label="Kecepatan" value={`${tripTelemetry.speedKmh} km/h`} />

          <View style={styles.divider} />
          <View style={styles.telemetryRow}>
            <View style={styles.telemetryLabel}>
              <Icon name="power" size={20} color="textSecondary" />
              <Text variant="caption" color="textSecondary">
                Ignition
              </Text>
            </View>
            <View style={styles.onChip}>
              <View style={styles.onDot} />
              <Text variant="labelSm" color="success">
                {tripTelemetry.ignition}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.telemetryRow}>
            <View style={styles.telemetryLabel}>
              <Icon name="sensors" size={20} color="textSecondary" />
              <Text variant="caption" color="textSecondary">
                Last update
              </Text>
            </View>
            <View style={styles.onChip}>
              <View style={styles.onDot} />
              <Text variant="labelSm" color="success">
                {tripTelemetry.lastUpdate}
              </Text>
            </View>
          </View>
        </Card>

        {/* Stops */}
        <View style={styles.sectionHead}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            TITIK ANTAR
          </Text>
          <Text variant="labelSm" color="primaryContainer">
            Manifest #DO-8831
          </Text>
        </View>

        <Card shadow>
          {tripRouteStops.map((stop, index) => (
            <View key={stop.key}>
              <View style={styles.stopRow}>
                <View
                  style={[
                    styles.stopBadge,
                    { backgroundColor: stop.tone === 'done' ? colors.primaryContainer : colors.critical },
                  ]}
                >
                  <Text variant="labelSm" color={colors.onPrimary}>
                    {stop.index}
                  </Text>
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyBold">{stop.name}</Text>
                  <View
                    style={[
                      styles.stopChip,
                      stop.tone === 'done' ? styles.stopChipDone : styles.stopChipNext,
                    ]}
                  >
                    <Text
                      variant="labelSm"
                      color={stop.tone === 'done' ? colors.success : '#1D4ED8'}
                    >
                      {stop.note}
                    </Text>
                  </View>
                </View>
              </View>
              {index < tripRouteStops.length - 1 ? <View style={styles.stopRail} /> : null}
            </View>
          ))}
        </Card>

        {/* Safety note */}
        <View style={styles.safetyNote}>
          <Icon name="shield" size={16} color={colors.textMuted} />
          <Text variant="labelSm" color="textMuted">
            Lokasi dikirim berkala untuk keamanan perjalanan Anda.
          </Text>
        </View>
      </ScreenBody>
    </Screen>
  );
}

function EtaCell({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.etaCell}>
      <Text variant="labelSm" color="textSecondary" style={styles.upper}>
        {label}
      </Text>
      <Text variant="headlineSm" color={highlight ? 'primaryContainer' : 'ink'}>
        {value}
      </Text>
    </View>
  );
}

function TelemetryRow({ icon, label, value }: { icon: 'speed' | 'fuel'; label: string; value: string }) {
  return (
    <View style={styles.telemetryRow}>
      <View style={styles.telemetryLabel}>
        <Icon name={icon} size={20} color="textSecondary" />
        <Text variant="caption" color="textSecondary">
          {label}
        </Text>
      </View>
      <Text variant="labelLg">{value}</Text>
    </View>
  );
}

function RouteMap() {
  return (
    <Svg viewBox="0 0 390 290" width="100%" height="100%">
      <Rect fill="#E8ECF0" width="390" height="290" />

      {/* Zone patches */}
      <Path d="M 0 0 L 140 0 L 130 90 L 0 70 Z" fill="#E1E6EB" />
      <Path d="M 180 0 L 390 0 L 390 110 L 260 80 Z" fill="#E2E7ED" />
      <Path d="M 270 140 L 390 160 L 390 290 L 250 290 Z" fill="#DFE5EC" />
      <Path d="M 0 160 L 120 180 L 110 290 L 0 290 Z" fill="#E1E7EE" />
      <Rect fill="#D7E5D9" opacity="0.8" rx="6" width="58" height="42" x="28" y="18" />
      <Rect fill="#D7E5D9" opacity="0.8" rx="8" width="70" height="48" x="295" y="195" />

      {/* Roads */}
      <Path d="M -20 120 L 410 115" stroke="#D1D9E0" strokeLinecap="round" strokeWidth="6" />
      <Path d="M -20 220 L 410 230" stroke="#D1D9E0" strokeLinecap="round" strokeWidth="5" />
      <Path d="M 145 -10 L 135 305" stroke="#D1D9E0" strokeLinecap="round" strokeWidth="7" />
      <Path d="M 285 -10 L 275 305" stroke="#D1D9E0" strokeLinecap="round" strokeWidth="6" />

      {/* Highway + active route */}
      <Path
        d="M 48 55 C 90 95, 120 140, 205 148 C 265 155, 310 195, 345 235"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="10"
        fill="none"
      />
      <Path
        d="M 52 58 C 90 95, 120 140, 205 148 C 265 155, 310 195, 342 232"
        stroke="#1B4DFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        fill="none"
      />
      <Path
        d="M 52 58 C 90 95, 120 140, 185 146"
        stroke="#93C5FD"
        strokeDasharray="3 3"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
      />

      {/* Origin */}
      <G x={52} y={58}>
        <Circle r="14" fill="#1B4DFF" stroke="#FFFFFF" strokeWidth="2.5" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="4">
          1
        </SvgText>
        <Rect fill="rgba(255,255,255,0.95)" rx="4" width="76" height="20" x="18" y="-10" />
        <SvgText fill="#111827" fontFamily="Inter" fontSize="10" fontWeight="700" textAnchor="middle" x="56" y="4">
          Kelapa Gading
        </SvgText>
      </G>

      {/* Live vehicle */}
      <G x={205} y={148}>
        <Circle r="18" fill="#EA580C" opacity="0.25" />
        <Circle r="11" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2.5" />
        <Rect fill="#111827" rx="8" width="52" height="20" x="-26" y="-36" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="10" fontWeight="700" textAnchor="middle" x="0" y="-22">
          54 km/h
        </SvgText>
      </G>

      {/* Destination */}
      <G x={342} y={232}>
        <Circle r="14" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="4">
          2
        </SvgText>
        <Rect fill="rgba(255,255,255,0.95)" rx="4" width="76" height="20" x="-38" y="16" />
        <SvgText fill="#111827" fontFamily="Inter" fontSize="10" fontWeight="700" textAnchor="middle" x="0" y="30">
          Cikarang Barat
        </SvgText>
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },

  darkBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: '#111827',
  },
  darkBack: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkSpacer: { width: 44 },
  gpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(6,78,59,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.4)',
  },
  gpsDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },

  body: { paddingTop: 0 },
  map: { height: 290, marginHorizontal: -spacing.gutter, backgroundColor: '#E9EDF2', overflow: 'hidden' },
  recenter: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    ...shadows.card,
  },

  etaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -spacing.gutter,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingVertical: spacing.md,
  },
  etaCell: { flex: 1, alignItems: 'center', gap: 2 },
  etaDivider: { width: 1, height: 32, backgroundColor: colors.divider },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  telemetryLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  fuelTrack: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  fuelFill: { height: '100%', borderRadius: radius.pill, backgroundColor: '#10B981' },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  onChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.successContainer,
  },
  onDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },

  stopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  stopBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  stopChipDone: { backgroundColor: colors.successContainer },
  stopChipNext: { backgroundColor: '#E6EDFD' },
  stopRail: {
    marginLeft: spacing.lg,
    marginVertical: spacing.xs,
    height: 28,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },

  safetyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});
