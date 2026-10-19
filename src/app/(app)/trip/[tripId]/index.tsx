import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Screen,
  ScreenHeader,
  Text,
} from '@/components/ui';
import type { TripStatus } from '@/data/types';
import { useTrip } from '@/hooks/useTrip';
import { formatDayDate, formatKg, formatKm, formatTime } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

const HERO_STATUS: Record<TripStatus, string> = {
  assigned: 'Menunggu Konfirmasi',
  accepted: 'Dikonfirmasi',
  in_progress: 'Dalam Perjalanan',
  completed: 'Selesai',
  rejected: 'Dibatalkan',
};

export default function TripDetailScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip, vehicle, setStatus, completeEvent } = useTrip(tripId);

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Detail Trip" onBack />
        <EmptyState
          icon="error"
          title="Trip tidak ditemukan"
          description="Penugasan ini mungkin sudah dibatalkan oleh dispatcher."
        />
      </Screen>
    );
  }

  const vehicleReady = vehicle?.status !== 'blocked';
  const canDecide = trip.status === 'assigned';

  return (
    <Screen style={{ backgroundColor: colors.canvas }}>
      <ScreenHeader
        title="Detail Trip"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Menu opsi" hitSlop={8}>
            <Icon name="more" size={24} color={colors.ink} />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text variant="labelSm" style={styles.heroCode}>
            {trip.code}
          </Text>
          <Text variant="headlineMd" color="onPrimary" style={styles.heroTitle}>
            {trip.destination}
          </Text>
          <View style={styles.heroBadge}>
            <View style={styles.heroDot} />
            <Text variant="labelMd" color="primaryContainer">
              {HERO_STATUS[trip.status]}
            </Text>
          </View>
        </View>

        {/* Key facts */}
        <Card padded={false}>
          <FactRow
            icon="schedule"
            label="Waktu"
            value={`${formatDayDate(trip.scheduledAt)} • ${formatTime(trip.scheduledAt)}`}
            divider
          />
          <FactRow icon="distance" label="Jarak" value={formatKm(trip.distanceKm)} divider />
          <FactRow
            icon="cargo"
            label="Jenis muatan"
            value={`${trip.cargo} • ${formatKg(trip.weightKg)}`}
          />
        </Card>

        {/* Route */}
        <Section title="RUTE">
          <Card>
            <View style={styles.stepper}>
              <View style={styles.stepperRail} />
              <Stop
                tone="success"
                kicker="Titik Jemput"
                title={trip.origin}
                address={trip.originAddress}
              />
              <Stop
                tone="critical"
                kicker="Titik Tujuan"
                title={trip.destination}
                address={trip.destinationAddress}
              />
            </View>
            <Button
              label="Lihat peta"
              variant="secondary"
              size="md"
              icon="map"
              style={styles.mapButton}
              onPress={() => router.push(`/trip/${tripId}/route`)}
            />
          </Card>
        </Section>

        {/* Recipient */}
        <Section title="PENERIMA">
          <Card>
            <View style={styles.recipient}>
              <View style={styles.recipientAvatar}>
                <Text variant="bodyBold" color="primaryContainer">
                  {trip.recipient.initials}
                </Text>
              </View>
              <View style={styles.recipientText}>
                <Text variant="titleMd">{trip.recipient.name}</Text>
                <Text variant="caption" color="textSecondary">
                  {trip.recipient.role}
                </Text>
              </View>
            </View>
            <View style={styles.recipientActions}>
              <Button
                label="Telepon"
                variant="secondary"
                size="md"
                icon="phone"
                style={styles.recipientButton}
                onPress={() => undefined}
              />
              <Button
                label="Chat"
                variant="secondary"
                size="md"
                icon="chatBubble"
                style={styles.recipientButton}
                onPress={() => undefined}
              />
            </View>
          </Card>
        </Section>

        {trip.instruction ? (
          <View style={styles.instruction}>
            <Icon name="info" size={20} color="#854D0E" />
            <Text variant="bodyMd" color="#713F12" style={styles.instructionText}>
              {trip.instruction}
            </Text>
          </View>
        ) : null}

        {/* Vehicle */}
        <Section title="KENDARAAN">
          <Card>
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleIcon}>
                <Icon name="truck" size={24} color={colors.primaryContainer} />
              </View>
              <View style={styles.vehicleText}>
                <Text variant="bodyBold">{vehicle?.plate ?? 'Belum ditugaskan'}</Text>
                <Text variant="caption" color="textSecondary">
                  {vehicle ? `${vehicle.model} • ${vehicle.type}` : '—'}
                </Text>
              </View>
              <Badge
                label={vehicleReady ? 'Siap Jalan' : 'Diblokir'}
                tone={vehicleReady ? 'success' : 'critical'}
              />
            </View>
            {!vehicleReady && vehicle?.blockedReason ? (
              <Text variant="caption" color="critical" style={styles.vehicleWarning}>
                {vehicle.blockedReason}
              </Text>
            ) : null}
          </Card>
        </Section>

        {trip.rejectReason ? (
          <View style={styles.rejectNote}>
            <Icon name="cancel" size={20} color={colors.critical} />
            <Text variant="bodyMd" color="critical" style={styles.rejectNoteText}>
              {trip.rejectReason}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {canDecide ? (
          <View style={styles.footerRow}>
            <Button
              label="Tolak"
              variant="secondary"
              onPress={() => router.push(`/trip/${trip.id}/reject`)}
              style={styles.footerButton}
            />
            <Button
              label="Terima Tugas"
              onPress={() => {
                setStatus('accepted');
                completeEvent('Konfirmasi driver');
              }}
              style={styles.footerButton}
            />
          </View>
        ) : (
          <Button
            label="Buka Trip Aktif"
            iconAfter="forward"
            onPress={() => router.push(`/trip/${trip.id}/execution`)}
          />
        )}
      </View>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="labelMd" color="textMuted" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function FactRow({
  icon,
  label,
  value,
  divider = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <View style={[styles.factRow, divider && styles.factRowDivider]}>
      <View style={styles.factIcon}>
        <Icon name={icon} size={20} color={colors.primaryContainer} />
      </View>
      <View style={styles.factText}>
        <Text variant="caption" color="textSecondary">
          {label}
        </Text>
        <Text variant="titleMd">{value}</Text>
      </View>
    </View>
  );
}

function Stop({
  tone,
  kicker,
  title,
  address,
}: {
  tone: 'success' | 'critical';
  kicker: string;
  title: string;
  address: string;
}) {
  const color = tone === 'success' ? colors.success : colors.critical;

  return (
    <View style={styles.stop}>
      <View style={[styles.stopDot, { borderColor: color, backgroundColor: `${color}1A` }]}>
        <View style={[styles.stopDotInner, { backgroundColor: color }]} />
      </View>
      <View style={styles.stopText}>
        <Text variant="labelSm" color={color} style={styles.stopKicker}>
          {kicker}
        </Text>
        <Text variant="titleMd">{title}</Text>
        <Text variant="caption" color="textSecondary">
          {address}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { gap: spacing.lg, paddingHorizontal: spacing.gutter, paddingBottom: spacing.xxl },
  hero: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    gap: spacing.xs,
  },
  heroCode: { color: '#BFD3FF', letterSpacing: 1, textTransform: 'uppercase' },
  heroTitle: { marginBottom: spacing.sm },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  heroDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryContainer },
  factRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  factRowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  factIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factText: { flex: 1 },
  section: { gap: spacing.sm },
  sectionTitle: { textTransform: 'uppercase', paddingHorizontal: 2 },
  stepper: { paddingLeft: spacing.xl, gap: spacing.lg },
  stepperRail: {
    position: 'absolute',
    left: 9,
    top: 12,
    bottom: 12,
    width: 0,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  stop: { flexDirection: 'row', gap: spacing.md },
  stopDot: {
    position: 'absolute',
    left: -spacing.xl,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopDotInner: { width: 8, height: 8, borderRadius: 4 },
  stopText: { flex: 1, gap: 2 },
  stopKicker: { textTransform: 'uppercase' },
  mapButton: { marginTop: spacing.lg },
  recipient: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  recipientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.infoContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientText: { flex: 1 },
  recipientActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  recipientButton: { flex: 1 },
  instruction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#FDE047',
    backgroundColor: '#FEF9C3',
  },
  instructionText: { flex: 1, fontSize: 14, lineHeight: 19 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    backgroundColor: colors.infoContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleText: { flex: 1 },
  vehicleWarning: { marginTop: spacing.sm },
  rejectNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.critical,
    backgroundColor: colors.criticalContainer,
  },
  rejectNoteText: { flex: 1 },
  footer: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerRow: { flexDirection: 'row', gap: spacing.md },
  footerButton: { flex: 1 },
});
