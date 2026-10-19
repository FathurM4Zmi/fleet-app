import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Card, EmptyState, Screen, ScreenBody, Text } from '@/components/ui';
import { useTripTracking } from '@/hooks/api/useDriverData';
import { useTrip } from '@/hooks/useTrip';
import { addHours, estimatedDurationHours, formatTime } from '@/lib/format';
import { colors, radius, shadows, spacing } from '@/theme';

const MAP_WIDTH = 340;
const MAP_HEIGHT = 180;

export default function TripRouteScreen() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip, vehicle } = useTrip(tripId);
  const trackingQuery = useTripTracking(tripId);
  const tracking = trackingQuery.data;

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

  const etaIso = addHours(trip.scheduledAt, estimatedDurationHours(trip.distanceKm));
  const remainingKm = Math.max(0, Math.round(trip.distanceKm * 0.4));
  const speed = tracking?.speed ?? 0;

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
          <View style={[styles.gpsDot, !tracking?.isLive && styles.gpsDotStale]} />
          <Text variant="labelSm" color={tracking?.isLive ? '#6EE7B7' : '#FCD34D'}>
            {tracking?.isLive ? 'GPS AKTIF' : 'SINYAL TERAKHIR'}
          </Text>
        </View>
      </View>

      <ScreenBody bottomPadding={spacing.xxl} style={styles.body}>
        <View style={styles.map}>
          <TrailMap trail={tracking?.trail ?? []} />
          <View style={styles.mapFooter}>
            <Text variant="labelSm" color="textSecondary">
              {tracking?.latitude != null && tracking?.longitude != null
                ? `${tracking.latitude.toFixed(5)}, ${tracking.longitude.toFixed(5)}`
                : 'Koordinat belum tersedia'}
            </Text>
            <Text variant="labelSm" color="textMuted">
              {tracking?.lastSeenAt ? `Terakhir ${formatTime(tracking.lastSeenAt)} WIB` : 'Menunggu telemetri'}
            </Text>
          </View>
        </View>

        <View style={styles.etaBar}>
          <EtaCell label="ETA" value={formatTime(etaIso)} />
          <View style={styles.etaDivider} />
          <EtaCell label="Sisa Jarak" value={`${remainingKm} km`} highlight />
          <View style={styles.etaDivider} />
          <EtaCell label="Kecepatan" value={`${Math.round(speed)} km/h`} />
        </View>

        <View style={styles.sectionHead}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            TELEMETRIK
          </Text>
          <Text variant="labelSm" color="textMuted">
            {vehicle?.model ?? '—'} • {vehicle?.plate ?? '—'}
          </Text>
        </View>

        <Card shadow>
          <TelemetryRow icon="speed" label="Kecepatan" value={`${Math.round(speed)} km/h`} />
          <View style={styles.divider} />
          <TelemetryRow
            icon="sensors"
            label="Titik jejak 6 jam"
            value={`${tracking?.trail.length ?? 0} titik`}
          />
          <View style={styles.divider} />
          <TelemetryRow
            icon="schedule"
            label="Posisi terakhir"
            value={tracking?.lastSeenAt ? `${formatTime(tracking.lastSeenAt)} WIB` : '—'}
          />
        </Card>

        {trackingQuery.error ? (
          <Text variant="caption" color="critical" align="center">
            {trackingQuery.error.message}
          </Text>
        ) : null}

        <View style={styles.note}>
          <Icon name="info" size={20} color="#1D4ED8" />
          <Text variant="caption" color="textSecondary" style={styles.flex}>
            Posisi berasal dari telematika kendaraan. Bila titik tidak bergerak lebih dari 10 menit,
            perangkat mungkin kehilangan sinyal.
          </Text>
        </View>
      </ScreenBody>
    </Screen>
  );
}

/** Draws the real GPS trail; shows a neutral grid when no points exist. */
function TrailMap({ trail }: { trail: { latitude: number; longitude: number }[] }) {
  if (trail.length < 2) {
    return (
      <View style={styles.mapEmpty}>
        <Icon name="map" size={40} color={colors.textMuted} />
        <Text variant="labelMd" color="textMuted">
          Belum ada jejak posisi
        </Text>
      </View>
    );
  }

  const lats = trail.map((point) => point.latitude);
  const lngs = trail.map((point) => point.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = maxLat - minLat || 1e-6;
  const lngSpan = maxLng - minLng || 1e-6;

  const pad = 16;
  const points = trail
    .map((point) => {
      const x = pad + ((point.longitude - minLng) / lngSpan) * (MAP_WIDTH - pad * 2);
      const y = MAP_HEIGHT - pad - ((point.latitude - minLat) / latSpan) * (MAP_HEIGHT - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const last = trail[trail.length - 1];
  const lastX = pad + ((last.longitude - minLng) / lngSpan) * (MAP_WIDTH - pad * 2);
  const lastY = MAP_HEIGHT - pad - ((last.latitude - minLat) / latSpan) * (MAP_HEIGHT - pad * 2);

  return (
    <Svg width="100%" height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
      <Polyline
        points={points}
        fill="none"
        stroke={colors.primaryContainer}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={lastX} cy={lastY} r={7} fill={colors.primaryContainer} />
      <Circle cx={lastX} cy={lastY} r={3} fill="#FFFFFF" />
    </Svg>
  );
}

function EtaCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.etaCell}>
      <Text variant="labelSm" color="textMuted" style={styles.upper}>
        {label}
      </Text>
      <Text variant="titleMd" color={highlight ? 'primaryContainer' : 'ink'}>
        {value}
      </Text>
    </View>
  );
}

function TelemetryRow({
  icon,
  label,
  value,
}: {
  icon: 'speed' | 'sensors' | 'schedule';
  label: string;
  value: string;
}) {
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  darkBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.sm,
    backgroundColor: colors.ink,
  },
  darkBack: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  darkSpacer: { width: 40 },
  gpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  gpsDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34D399' },
  gpsDotStale: { backgroundColor: '#FCD34D' },
  body: { paddingHorizontal: spacing.gutter },
  map: {
    marginTop: spacing.md,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  mapEmpty: { height: MAP_HEIGHT, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  mapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  etaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  etaCell: { flex: 1, alignItems: 'center', gap: 4 },
  etaDivider: { width: 1, height: 32, backgroundColor: colors.divider },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  upper: { letterSpacing: 0.8 },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  telemetryLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  divider: { height: 1, backgroundColor: colors.divider },
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.infoContainer,
  },
});
