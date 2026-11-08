import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { MapCanvas } from '@/components/MapCanvas';
import { BottomBar, Button, EmptyState, Screen, ScreenBody, ScreenHeader, Text } from '@/components/ui';
import { toRouteOption } from '@/data/adapters';
import { useTripRoutes } from '@/hooks/api/useDriverData';
import { useRealtime } from '@/hooks/useRealtime';
import { useTrip } from '@/hooks/useTrip';
import { tripOpsApi } from '@/lib/api/endpoints';
import { colors, radius, shadows, spacing } from '@/theme';
import type { RouteOption } from '@/data/types';

const STATUS_TONE = {
  success: { bg: colors.successContainer, fg: colors.success, icon: 'bolt' as const },
  warning: { bg: colors.warningContainer, fg: colors.warning, icon: 'warning' as const },
  neutral: { bg: colors.surfaceHigh, fg: colors.secondary, icon: 'routeAlt' as const },
};

export default function SelectRouteScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);
  const query = useTripRoutes(tripId);
  const routeOptions = (query.data ?? []).map(toRouteOption);

  // FRD-MOB-RTE-05 — ETA ikut posisi terbaru tanpa tarik-ulang manual.
  useRealtime('tracking', () => void query.refetch());
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected =
    picked ??
    routeOptions.find((option) => option.recommended)?.key ??
    routeOptions[0]?.key ??
    '';

  const apply = async () => {
    if (!trip || !selected || applying) return;
    setApplying(true);
    setError(null);
    try {
      await tripOpsApi.selectRoute(trip.id, selected);
      router.replace(`/trip/${trip.id}/route`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Gagal menerapkan rute.');
    } finally {
      setApplying(false);
    }
  };

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Pilih Rute" onBack />
        <EmptyState
          icon="route"
          title="Trip tidak ditemukan"
          description="Penugasan ini mungkin sudah dibatalkan oleh dispatcher."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title="Pilih Rute"
        subtitle="Rute Disarankan"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Perbarui kondisi" hitSlop={8}>
            <Icon name="refresh" size={22} color={colors.secondary} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={140}>
        {/* Map preview */}
        <View style={styles.map}>
          <RoutePreview
            option={routeOptions.find((candidate) => candidate.key === selected) ?? routeOptions[0]}
          />
          <View style={styles.mapChipTopLeft}>
            <View style={styles.mapDotGreen} />
            <Text variant="labelSm" color="secondary" style={styles.upper}>
              GPS Akurat • Lalu Lintas Langsung
            </Text>
          </View>
          <View style={styles.mapBadgeBottom}>
            <View style={styles.mapDotBlue} />
            <Text variant="labelSm">{trip.origin}</Text>
          </View>
          <View style={styles.mapBadgeTop}>
            <View style={styles.mapDotRed} />
            <Text variant="labelSm">{trip.destination}</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.sectionHead}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            OPSI RUTE
          </Text>
          <Text variant="labelMd" color="textSecondary">
            {routeOptions.length} Jalur Tersedia
          </Text>
        </View>

        <View style={styles.options}>
          {routeOptions.map((option) => (
            <RouteCard
              key={option.key}
              option={option}
              selected={option.key === selected}
              onSelect={() => setPicked(option.key)}
            />
          ))}
        </View>

        {routeOptions.length === 0 ? (
          <EmptyState
            icon="route"
            title="Belum ada saran rute"
            description={query.error?.message ?? 'Dispatcher belum menyiapkan alternatif rute untuk trip ini.'}
          />
        ) : null}

        {error ? (
          <Text variant="caption" color="critical" align="center">
            {error}
          </Text>
        ) : null}

        {/* Assumption note */}
        <View style={styles.note}>
          <Icon name="info" size={22} color="#1D4ED8" />
          <Text variant="caption" color="textSecondary" style={styles.flex}>
            Saran rute dihitung dari kondisi lalu lintas terkini dan riwayat perjalanan Anda. Estimasi
            waktu dapat berubah sesuai muatan.
          </Text>
        </View>
      </ScreenBody>

      <BottomBar>
        <View style={styles.footerRow}>
          <Button label="Batal" variant="secondary" onPress={() => router.back()} style={styles.footerGhost} />
          <Button
            label={applying ? 'Menerapkan…' : 'Terapkan Rute'}
            icon="navigation"
            disabled={!selected || applying}
            onPress={apply}
            style={styles.footerPrimary}
          />
        </View>
      </BottomBar>
    </Screen>
  );
}

function RouteCard({
  option,
  selected,
  onSelect,
}: {
  option: RouteOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const tone = STATUS_TONE[option.statusTone];

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.optionHead}>
        <View style={styles.optionHeadLeft}>
          <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected ? <Icon name="check" size={16} color={colors.onPrimary} /> : null}
          </View>
          <View style={styles.flex}>
            <Text variant="headlineSm">{option.title}</Text>
            <Text variant="labelMd" color="textSecondary">
              {option.subtitle}
            </Text>
          </View>
        </View>

        {option.recommended ? (
          <View style={styles.recommended}>
            <Icon name="verified" size={14} color="#1D4ED8" />
            <Text variant="labelSm" color="#1D4ED8" style={styles.upper}>
              Rekomendasi
            </Text>
          </View>
        ) : option.tag ? (
          <View style={styles.tag}>
            <Text variant="labelSm" color="textSecondary">
              {option.tag}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricCell}>
          <Text variant="labelSm" color="textSecondary" style={styles.upper}>
            Estimasi Waktu
          </Text>
          <View style={styles.metricValue}>
            <Text variant="headlineMd" color={selected ? 'primaryContainer' : 'ink'}>
              {option.minutes}
            </Text>
            <Text variant="caption" color={selected ? 'primaryContainer' : 'ink'}>
              menit
            </Text>
          </View>
        </View>
        <View style={styles.metricCell}>
          <Text variant="labelSm" color="textSecondary" style={styles.upper}>
            Jarak Tempuh
          </Text>
          <View style={styles.metricValue}>
            <Text variant="headlineMd">{option.km}</Text>
            <Text variant="caption">km</Text>
          </View>
        </View>
      </View>

      <View style={styles.optionFoot}>
        <View style={[styles.statusTag, { backgroundColor: tone.bg }]}>
          <Icon name={tone.icon} size={16} color={tone.fg} />
          <Text variant="labelSm" color={tone.fg}>
            {option.statusLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function RoutePreview({ option }: { option?: RouteOption }) {
  const origin =
    option?.originLat != null && option?.originLng != null
      ? { latitude: option.originLat, longitude: option.originLng }
      : null;
  const destination =
    option?.destLat != null && option?.destLng != null
      ? { latitude: option.destLat, longitude: option.destLng }
      : null;

  return (
    <MapCanvas
      points={origin && destination ? [origin, destination] : []}
      markers={[
        ...(origin ? [{ ...origin, color: colors.primaryContainer }] : []),
        ...(destination ? [{ ...destination, color: colors.error }] : []),
      ]}
      height={180}
      rounded={false}
      emptyLabel="Rute belum tersedia"
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },
  pressed: { opacity: 0.9 },

  map: {
    height: 180,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: '#EDF2F7',
  },
  mapChipTopLeft: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  mapDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  mapBadgeBottom: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: colors.divider,
    maxWidth: '60%',
  },
  mapBadgeTop: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: colors.divider,
    maxWidth: '60%',
  },
  mapDotBlue: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryContainer },
  mapDotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  options: { gap: spacing.md, marginTop: spacing.md },

  option: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  optionSelected: { borderWidth: 2, borderColor: colors.primaryContainer },
  optionHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  optionHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2, flex: 1 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  recommended: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: '#E6EDFD',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: '#F1F3F5',
  },

  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    marginVertical: spacing.xs,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  metricCell: { flex: 1, gap: 2 },
  metricValue: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  optionFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },

  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md + 2,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: colors.surfaceLow,
  },

  footerRow: { flexDirection: 'row', gap: spacing.md },
  footerGhost: { flex: 1 },
  footerPrimary: { flex: 1.4 },
});
