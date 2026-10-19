import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, G, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { Icon, type IconName } from '@/components/Icon';
import { Badge, Button, Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { useTrip } from '@/hooks/useTrip';
import { addHours, estimatedDurationHours, formatKm, formatTime } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

const NOTE_LIMIT = 200;
const NOTE_PRESETS = ['+ Macet', '+ Berhenti', '+ Reroute'] as const;

export default function TripExecutionScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip, vehicle, completeEvent } = useTrip(tripId);

  const [note, setNote] = useState('');

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Trip Aktif" onBack />
        <EmptyState
          icon="error"
          title="Trip tidak ditemukan"
          description="Penugasan ini mungkin sudah dibatalkan oleh dispatcher."
        />
      </Screen>
    );
  }

  const arrived = trip.timeline.find((event) => event.label === 'Tiba di tujuan')?.done ?? false;
  const completed = trip.status === 'completed';
  const activeIndex = completed ? 3 : arrived ? 2 : 1;

  const etaIso = addHours(trip.scheduledAt, estimatedDurationHours(trip.distanceKm));
  const remainingKm = Math.max(0, Math.round(trip.distanceKm * (arrived ? 0 : 0.4)));
  const etaLabel = arrived ? 'Tiba' : `Est. ${formatTime(etaIso)} WIB`;

  const handleArrive = () => {
    completeEvent('Tiba di tujuan');
    router.push(`/pod/${trip.id}/capture`);
  };

  return (
    <Screen>
      <ScreenHeader
        title="Trip Aktif"
        onBack
        right={<WorkingBadge />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Map */}
        <View style={styles.map}>
          <RouteMap />
          <View style={styles.mapPill}>
            <View style={styles.mapPillDot} />
            <Text variant="labelSm" style={styles.mapPillText}>
              {arrived
                ? `Tiba di ${trip.destination}`
                : `${formatKm(remainingKm)} lagi • ${etaLabel}`}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pusatkan lokasi"
            style={styles.mapRecenter}
          >
            <Icon name="recenter" size={22} color={colors.primaryContainer} />
          </Pressable>
        </View>

        {/* Stepper */}
        <View style={styles.section}>
          <Card shadow>
            <StepRail activeIndex={activeIndex} />
          </Card>
        </View>

        {/* Destination */}
        <View style={styles.section}>
          <Card shadow>
            <View style={styles.destTop}>
              <Badge label="TITIK BONGKAR" tone="critical" />
              <Text variant="caption" color="textSecondary">
                Unit: {vehicle?.plate ?? '—'}
              </Text>
            </View>

            <View style={styles.destMain}>
              <View style={styles.destText}>
                <Text variant="headlineSm">{trip.destination}</Text>
                <View style={styles.destAddress}>
                  <Icon name="location" size={16} color={colors.textMuted} />
                  <Text variant="caption" color="textSecondary" style={styles.flex}>
                    {trip.destinationAddress}
                  </Text>
                </View>
              </View>
              <View style={styles.target}>
                <Text variant="labelSm" color="textMuted" style={styles.targetLabel}>
                  TARGET
                </Text>
                <Text variant="labelMd" color="primaryContainer">
                  Tiba {formatTime(etaIso)}
                </Text>
              </View>
            </View>

            <View style={styles.cargoNote}>
              <Icon name="cargo" size={16} color={colors.primaryContainer} />
              <Text variant="caption" numberOfLines={1} style={styles.flex}>
                Muatan: {trip.cargoNote}
              </Text>
            </View>
          </Card>
        </View>

        {/* Quick access */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.sectionLabel}>
            AKSES CEPAT
          </Text>
          <Card shadow>
            <View style={styles.tiles}>
              <QuickTile
                icon="map"
                label="Lihat Peta"
                onPress={() => router.push(`/trip/${tripId}/route`)}
              />
              <QuickTile
                icon="warning"
                label="Peringatan"
                tone={colors.warning}
                dot
                onPress={() => router.push(`/trip/${tripId}/warnings`)}
              />
              <QuickTile
                icon="cargo"
                label="Aset"
                onPress={() => router.push(`/trip/${tripId}/assets`)}
              />
            </View>
          </Card>
        </View>

        {/* Travel notes */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.sectionLabel}>
            CATATAN PERJALANAN
          </Text>
          <Card shadow>
            <View style={styles.noteWrap}>
              <TextInput
                value={note}
                onChangeText={(value) => setNote(value.slice(0, NOTE_LIMIT))}
                placeholder="Catat kejadian di jalan…"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                maxLength={NOTE_LIMIT}
                style={styles.noteInput}
              />
              <Text variant="micro" color="textMuted" style={styles.noteCount}>
                {note.length}/{NOTE_LIMIT}
              </Text>
            </View>
            <View style={styles.presets}>
              {NOTE_PRESETS.map((preset) => (
                <Pressable
                  key={preset}
                  accessibilityRole="button"
                  onPress={() =>
                    setNote((current) => {
                      const next = current ? `${current} ${preset}` : preset;
                      return next.slice(0, NOTE_LIMIT);
                    })
                  }
                  style={styles.preset}
                >
                  <Text variant="caption" color={colors.textSecondary}>
                    {preset}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <View style={styles.contactRow}>
            <Button
              label={`Hubungi ${trip.recipient.name.split(' ')[0]}`}
              variant="secondary"
              size="md"
              icon="phone"
              style={styles.flex}
              disabled={!trip.recipient.phone}
              onPress={() =>
                trip.recipient.phone &&
                Linking.openURL(`tel:${trip.recipient.phone.replace(/[^+\d]/g, '')}`)
              }
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kirim pesan"
              style={styles.chatButton}
              onPress={() => router.push(`/trip/${trip.id}/chat`)}
            >
              <Icon name="chatBubble" size={22} color={colors.primaryContainer} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={arrived ? 'Lanjut ke POD' : 'Sampai di Titik'}
          icon="pin"
          disabled={completed}
          onPress={handleArrive}
        />
      </View>
    </Screen>
  );
}

function WorkingBadge() {
  const [pulse] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.3,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.workingBadge}>
      <Animated.View style={[styles.workingDot, { opacity: pulse }]} />
      <Text variant="labelMd" color="primaryContainer">
        Dikerjakan
      </Text>
    </View>
  );
}

const STEPS = ['Diterima', 'Berjalan', 'Tiba', 'Selesai'] as const;

function StepRail({ activeIndex }: { activeIndex: number }) {
  const lastIndex = STEPS.length - 1;

  return (
    <View style={styles.stepper}>
      <View style={styles.stepperRail}>
        <View style={[styles.stepperFill, { flex: activeIndex }]} />
        <View style={{ flex: lastIndex - activeIndex }} />
      </View>

      {STEPS.map((step, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        const filled = done || active;

        return (
          <View key={step} style={styles.step}>
            <View
              style={[
                styles.stepDot,
                filled ? styles.stepDotFilled : styles.stepDotIdle,
                active && styles.stepDotActive,
              ]}
            >
              {done ? (
                <Icon name="check" size={16} color={colors.onPrimary} />
              ) : (
                <View style={[styles.stepDotInner, filled ? styles.stepDotInnerFilled : styles.stepDotInnerIdle]} />
              )}
            </View>
            <Text
              variant="labelSm"
              color={filled ? colors.primaryContainer : colors.textMuted}
              style={styles.stepLabel}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function QuickTile({
  icon,
  label,
  tone = colors.primaryContainer,
  dot = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  tone?: string;
  dot?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      {dot ? <View style={styles.tileDot} /> : null}
      <Icon name={icon} size={20} color={tone} />
      <Text variant="caption" color={colors.ink} style={styles.tileLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

function RouteMap() {
  return (
    <Svg viewBox="0 0 390 260" width="100%" height="100%">
      <Rect fill="#EBF0F5" width="390" height="260" />
      <Path d="M0 60 Q 120 40 240 70 T 390 40" stroke="#DFE5EC" strokeWidth="32" fill="none" />
      <Path d="M-20 200 Q 140 180 260 220 T 410 190" stroke="#E2E7EE" strokeWidth="24" fill="none" />

      <Path d="M60 0 L80 260" stroke="#FFFFFF" strokeWidth="5" />
      <Path d="M210 0 L190 260" stroke="#FFFFFF" strokeWidth="4" />
      <Path d="M330 0 L310 260" stroke="#FFFFFF" strokeWidth="4" />
      <Path d="M0 135 L390 120" stroke="#FFFFFF" strokeWidth="6" />
      <Path d="M0 85 L390 95" stroke="#FFFFFF" strokeWidth="3" />
      <Path d="M0 210 L390 175" stroke="#FFFFFF" strokeWidth="3.5" />

      <Rect fill="#DCEBDC" opacity="0.65" rx="6" width="115" height="60" x="250" y="25" />
      <SvgText fill="#5F8862" fontFamily="Inter" fontSize="9" fontWeight="700" x="258" y="42">
        KAWASAN INDUSTRI
      </SvgText>
      <Rect fill="#E3E8EE" opacity="0.8" rx="6" width="90" height="70" x="25" y="150" />

      <Path
        d="M 52 72 Q 130 95 195 130 T 315 178"
        stroke="#1B4DFF"
        strokeWidth="9"
        opacity="0.18"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 52 72 Q 130 95 195 130 T 315 178"
        stroke="#1B4DFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      <G x={52} y={72}>
        <Circle r="14" fill="#1B4DFF" stroke="#FFFFFF" strokeWidth="2.5" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="4.5">
          1
        </SvgText>
        <Rect fill="#111827" opacity="0.9" rx="4" width="68" height="20" x="-34" y="16" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="0" y="29.5">
          Site Jkt 1
        </SvgText>
      </G>

      <G x={315} y={178}>
        <Circle r="14" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="4.5">
          2
        </SvgText>
        <Rect fill="#DC2626" rx="4" width="48" height="20" x="-24" y="16" />
        <SvgText fill="#FFFFFF" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="0" y="29.5">
          Tujuan
        </SvgText>
      </G>

      {/* Current vehicle position (map centre). */}
      <G x={195} y={130}>
        <Circle r="22" fill="#EA580C" opacity="0.25" />
        <Circle r="12" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2.5" />
        <Polygon fill="#FFFFFF" points="0,-7 5,5 0,2 -5,5" transform="rotate(48)" />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { gap: spacing.lg, paddingBottom: spacing.xxl },
  flex: { flex: 1 },
  section: { paddingHorizontal: spacing.gutter },
  sectionLabel: { textTransform: 'uppercase', marginBottom: spacing.sm, paddingHorizontal: 2 },
  pressed: { opacity: 0.85 },

  // Header badge
  workingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.infoContainer,
  },
  workingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryContainer },

  // Map
  map: { height: 260, borderBottomWidth: 1, borderBottomColor: colors.divider },
  mapPill: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  mapPillDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primaryContainer },
  mapPillText: { color: colors.ink },
  mapRecenter: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stepper
  stepper: { flexDirection: 'row', justifyContent: 'space-between' },
  stepperRail: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 13,
    height: 2,
    borderRadius: 1,
    flexDirection: 'row',
    backgroundColor: colors.divider,
  },
  stepperFill: { backgroundColor: colors.primaryContainer, borderRadius: 1 },
  step: { alignItems: 'center', gap: spacing.xs + 2, width: 56 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotFilled: { backgroundColor: colors.primaryContainer },
  stepDotIdle: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.borderIdle },
  stepDotActive: { borderWidth: 4, borderColor: colors.infoContainer },
  stepDotInner: { width: 10, height: 10, borderRadius: 5 },
  stepDotInnerFilled: { backgroundColor: colors.onPrimary },
  stepDotInnerIdle: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderIdle },
  stepLabel: { textAlign: 'center' },

  // Destination card
  destTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  destMain: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginTop: spacing.md },
  destText: { flex: 1, gap: 2 },
  destAddress: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  target: {
    alignItems: 'flex-end',
    gap: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.canvas,
  },
  targetLabel: { letterSpacing: 0.8 },
  cargoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.canvas,
  },

  // Quick tiles
  tiles: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    height: 64,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  tileDot: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.critical,
  },
  tileLabel: { fontFamily: 'Inter_600SemiBold' },

  // Notes
  noteWrap: { position: 'relative' },
  noteInput: {
    minHeight: 76,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: '#FAFAFC',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  noteCount: { position: 'absolute', bottom: spacing.sm, right: spacing.md },
  presets: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  preset: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.canvas,
  },

  // Contact
  contactRow: { flexDirection: 'row', gap: spacing.sm },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sync chip
  syncRow: { alignItems: 'center', paddingTop: spacing.xs },
  syncChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.successContainer,
  },
  syncDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },

  // Footer
  footer: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
