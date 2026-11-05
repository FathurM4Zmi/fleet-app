import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Icon, type IconName } from '@/components/Icon';
import { MapCanvas } from '@/components/MapCanvas';
import { Badge, Button, Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { useTripTracking } from '@/hooks/api/useDriverData';
import { useLiveLocation } from '@/hooks/useLiveLocation';
import { useTrip } from '@/hooks/useTrip';
import { addHours, estimatedDurationHours, formatKm, formatTime } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

const NOTE_LIMIT = 200;
const NOTE_PRESETS = ['+ Macet', '+ Berhenti', '+ Reroute'] as const;

export default function TripExecutionScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip, vehicle, start, arrive, complete, setStatus } = useTrip(tripId);
  const trackingQuery = useTripTracking(tripId);
  const tracking = trackingQuery.data;
  const trail = tracking?.trail ?? [];
  const live = useLiveLocation();

  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

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

  const status = trip.status;
  const completed = status === 'completed' || status === 'rejected';
  const arrived = status === 'arrived' || completed;
  const activeIndex = completed ? 3 : arrived ? 2 : status === 'in_progress' ? 1 : 0;

  const etaIso = addHours(trip.scheduledAt, estimatedDurationHours(trip.distanceKm));
  const remainingKm = Math.max(0, Math.round(trip.distanceKm * (arrived ? 0 : 0.4)));
  const etaLabel = arrived ? 'Tiba' : `Est. ${formatTime(etaIso)} WIB`;

  const run = async (action: () => Promise<void>, failureTitle: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } catch (error) {
      Alert.alert(
        failureTitle,
        error instanceof Error ? error.message : 'Periksa koneksi lalu coba lagi.',
      );
    } finally {
      setBusy(false);
    }
  };

  const handlePrimary = async () => {
    if (status === 'assigned') {
      await run(() => setStatus('accepted'), 'Gagal menerima trip');
      return;
    }
    if (status === 'accepted') {
      await run(start, 'Gagal memulai trip');
      return;
    }
    if (status === 'in_progress') {
      await run(async () => {
        await arrive();
        router.push(`/pod/${trip.id}/capture`);
      }, 'Gagal menandai tiba di tujuan');
      return;
    }
    if (status === 'arrived') {
      await run(complete, 'Gagal menyelesaikan trip');
    }
  };

  const primaryLabel =
    status === 'assigned'
      ? 'Terima Trip'
      : status === 'accepted'
        ? 'Mulai Perjalanan'
        : status === 'in_progress'
          ? 'Sampai di Titik'
          : status === 'arrived'
            ? 'Selesaikan Trip'
            : 'Trip Selesai';

  return (
    <Screen>
      <ScreenHeader
        title="Trip Aktif"
        onBack
        right={completed ? <FinishedBadge /> : <WorkingBadge />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Map */}
        <View style={styles.map}>
          <RouteMap trail={trail} live={live.coords} />
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
            accessibilityLabel="Buka peta posisi"
            onPress={() => router.push(`/trip/${trip.id}/route`)}
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
        {completed ? (
          <View style={styles.finished}>
            <View style={styles.finishedRow}>
              <View style={styles.finishedIcon}>
                <Icon name="success" size={22} color={colors.success} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyBold">
                  {status === 'rejected' ? 'Trip sudah ditutup' : 'Trip sudah selesai'}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {status === 'rejected'
                    ? 'Penugasan ini tidak dilanjutkan.'
                    : 'Semua tahapan trip ini sudah tercatat.'}
                </Text>
              </View>
            </View>
            <Button
              label="Kembali ke Halaman Beranda"
              icon="home"
              onPress={() => router.replace('/')}
            />
          </View>
        ) : (
          <>
            {status === 'arrived' ? (
              <Button
                label="Ambil Bukti Kirim (POD)"
                variant="secondary"
                icon="camera"
                onPress={() => router.push(`/pod/${trip.id}/capture`)}
              />
            ) : null}
            <Button
              label={busy ? 'Menyimpan…' : primaryLabel}
              icon="pin"
              disabled={busy}
              onPress={() => void handlePrimary()}
            />
          </>
        )}
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
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
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

function FinishedBadge() {
  return (
    <View style={styles.finishedBadge}>
      <Icon name="success" size={16} color={colors.success} />
      <Text variant="labelMd" color="success">
        Selesai
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

function RouteMap({
  trail,
  live,
}: {
  trail: { latitude: number; longitude: number }[];
  live?: { latitude: number; longitude: number } | null;
}) {
  // Server telemetry can be minutes old (or empty on a fresh install). The
  // device fix is the real current position, so it is always drawn on top.
  const points = trail.length > 0 ? trail : live ? [live] : [];
  const last = points[points.length - 1];
  const markers = [
    ...(last ? [{ ...last, color: '#EA580C' }] : []),
    ...(live ? [{ ...live, color: colors.primaryContainer }] : []),
  ];

  return (
    <MapCanvas
      points={points}
      markers={markers}
      height={260}
      rounded={false}
      emptyLabel="Menunggu posisi kendaraan"
    />
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
  finishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.successContainer,
  },
  finished: { gap: spacing.md },
  finishedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  finishedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successContainer,
  },

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
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
