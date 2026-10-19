import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { BottomBar, Button, EmptyState, Screen, ScreenBody, ScreenHeader, Text } from '@/components/ui';
import { routeOptions } from '@/data/fixtures';
import { useTrip } from '@/hooks/useTrip';
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
  const [selected, setSelected] = useState(routeOptions[0]?.key ?? 'tol');

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
          <RoutePreview />
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
              onSelect={() => setSelected(option.key)}
            />
          ))}
        </View>

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
            label="Terapkan Rute"
            icon="navigation"
            onPress={() => router.replace(`/trip/${trip.id}/route`)}
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

function RoutePreview() {
  return (
    <Svg viewBox="0 0 358 180" width="100%" height="100%">
      <Rect fill="#E8EDF5" width="358" height="180" />
      <Path d="M-10 40 Q 90 60 180 30 T 370 70" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="6" fill="none" />
      <Path d="M40 190 Q 70 110 130 90 T 320 20" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="5" fill="none" />
      <Path d="M190 -10 L 210 190" stroke="#E2E8F0" strokeWidth="4" fill="none" />
      <Path d="M80 -10 L 90 190" stroke="#E2E8F0" strokeWidth="4" fill="none" />

      {/* Alternative routes */}
      <Path
        d="M 46 130 C 60 170, 200 170, 260 120 S 300 70, 312 48"
        stroke="#CBD5E1"
        strokeLinecap="round"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M 46 130 C 80 80, 160 110, 220 70 S 280 60, 312 48"
        stroke="#9CA3AF"
        strokeDasharray="5 4"
        strokeLinecap="round"
        strokeWidth="3.5"
        fill="none"
      />

      {/* Selected route */}
      <Path
        d="M 46 130 C 90 140, 140 60, 230 46 S 290 50, 312 48"
        stroke="#1B4DFF"
        strokeOpacity="0.25"
        strokeLinecap="round"
        strokeWidth="7"
        fill="none"
      />
      <Path
        d="M 46 130 C 90 140, 140 60, 230 46 S 290 50, 312 48"
        stroke="#1B4DFF"
        strokeLinecap="round"
        strokeWidth="4.5"
        fill="none"
      />

      {/* Live vehicle */}
      <G x={185} y={48}>
        <Circle r="8" fill="#1B4DFF" fillOpacity="0.2" />
        <Circle r="5" fill="#1B4DFF" />
        <Circle r="2" fill="#FFFFFF" />
      </G>

      {/* Origin */}
      <G x={46} y={130}>
        <Circle r="10" fill="#1B4DFF" stroke="#FFFFFF" strokeWidth="2" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="9" fontWeight="700" textAnchor="middle" x="0" y="3.5">
          1
        </SvgText>
      </G>

      {/* Destination */}
      <G x={312} y={48}>
        <Circle r="10" fill="#BA1A1A" stroke="#FFFFFF" strokeWidth="2" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="9" fontWeight="700" textAnchor="middle" x="0" y="3.5">
          2
        </SvgText>
      </G>
    </Svg>
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
