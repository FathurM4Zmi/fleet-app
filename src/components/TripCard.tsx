import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Badge, Button, Card, Text, type BadgeTone } from '@/components/ui';
import type { Trip, TripStatus, Vehicle } from '@/data/types';
import { formatWindow } from '@/lib/format';
import { colors, spacing } from '@/theme';

const STATUS: Record<TripStatus, { label: string; tone: BadgeTone; icon: IconName }> = {
  assigned: { label: 'Baru', tone: 'info', icon: 'assignment' },
  accepted: { label: 'Dikonfirmasi', tone: 'info', icon: 'success' },
  in_progress: { label: 'Dikerjakan', tone: 'warning', icon: 'truck' },
  completed: { label: 'Selesai', tone: 'success', icon: 'success' },
  rejected: { label: 'Dibatalkan', tone: 'critical', icon: 'close' },
};

export interface TripCardProps {
  trip: Trip;
  vehicle?: Vehicle;
  /** Shown for completed trips that already carry a POD. */
  hasPod?: boolean;
  /** Renders the online-sync confirmation strip. */
  online?: boolean;
  onPress?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  /** Primary CTA label for in-progress trips, e.g. `Buka Rute`. */
  primaryLabel?: string;
  onPrimary?: () => void;
}

export function TripCard({
  trip,
  vehicle,
  hasPod = false,
  online = false,
  onPress,
  onAccept,
  onReject,
  primaryLabel,
  onPrimary,
}: TripCardProps) {
  const status = STATUS[trip.status];
  const cancelled = trip.status === 'rejected';

  return (
    <Card padded={false} style={styles.card}>
      {online ? (
        <View style={styles.onlineStrip}>
          <Icon name="online" size={18} color={colors.success} />
          <Text variant="labelMd" color="success" style={styles.onlineText}>
            Terhubung online. Data trip diperbarui otomatis.
          </Text>
        </View>
      ) : null}

      <View style={styles.body}>
        <View style={styles.headRow}>
          <Text variant="labelMd" color="textSecondary">
            #{trip.code.replace('TRP-', 'TRP-')}
          </Text>
          <Badge label={status.label} tone={status.tone} />
        </View>

        <Text variant="headlineMd" style={styles.destination}>
          {trip.destination}
        </Text>

        <View style={styles.route}>
          <Icon name="route" size={20} color={cancelled ? colors.textSecondary : colors.primary} />
          <Text variant="bodyMd" color={cancelled ? 'textSecondary' : 'onSurface'} style={styles.routeText}>
            {trip.origin} → {trip.destination}{' '}
            <Text variant="bodyBold" color={cancelled ? 'textSecondary' : 'ink'}>
              ({trip.distanceKm} km)
            </Text>
          </Text>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Icon name="schedule" size={18} color={colors.textSecondary} />
            <Text variant="bodyMd" color="onSurface">
              {formatWindow(trip.scheduledAt, trip.distanceKm)}
            </Text>
          </View>
          <View style={[styles.metaItem, styles.metaItemRight]}>
            <Icon name="truck" size={18} color={colors.textSecondary} />
            <Text variant="labelLg" color="onSurface">
              {vehicle?.plate ?? '—'}
            </Text>
          </View>
        </View>

        {cancelled ? (
          <View style={styles.note}>
            <Icon name="info" size={18} color={colors.critical} />
            <Text variant="bodyMd" color="critical" style={styles.noteText}>
              {trip.rejectReason ?? 'Dibatalkan oleh pengirim.'}
            </Text>
          </View>
        ) : null}

        {trip.status === 'completed' ? (
          <View style={styles.podRow}>
            <Text variant="caption" color="textSecondary">
              Bukti Pengiriman:
            </Text>
            <Badge
              label={hasPod ? 'POD Tervalidasi' : 'POD Belum Diunggah'}
              tone={hasPod ? 'success' : 'warning'}
            />
          </View>
        ) : null}

        {trip.status === 'assigned' && onAccept && onReject ? (
          <View style={styles.actions}>
            <Button label="Tolak" variant="secondary" size="lg" onPress={onReject} style={styles.actionButton} />
            <Button label="Terima" size="lg" onPress={onAccept} style={styles.actionButton} />
          </View>
        ) : null}

        {primaryLabel && onPrimary ? (
          <View style={styles.singleAction}>
            <Button label={primaryLabel} iconAfter="forward" onPress={onPrimary} />
          </View>
        ) : null}

        {onPress && !primaryLabel && trip.status !== 'assigned' ? (
          <View style={styles.singleAction}>
            <Button label="Lihat Detail" variant="secondary" iconAfter="forward" onPress={onPress} />
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  onlineStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.successContainer,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(18,128,92,0.2)',
  },
  onlineText: { flex: 1 },
  body: { padding: spacing.cardPadding },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  destination: { marginTop: spacing.xs },
  route: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.sm },
  routeText: { flex: 1 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metaItemRight: { justifyContent: 'flex-end' },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  noteText: { flex: 1 },
  podRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  actionButton: { flex: 1 },
  singleAction: { marginTop: spacing.lg },
});
