import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Button, Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { toTripWarning, toTripWarningHistory } from '@/data/adapters';
import { useTripWarnings } from '@/hooks/api/useDriverData';
import { useTrip } from '@/hooks/useTrip';
import { colors, radius, shadows, spacing } from '@/theme';
import type { TripWarning } from '@/data/types';

const SEVERITY = {
  critical: { accent: colors.critical, chipBg: colors.criticalContainer, chipFg: colors.critical },
  warning: { accent: colors.warning, chipBg: colors.warningContainer, chipFg: colors.warning },
  info: { accent: '#1D4ED8', chipBg: '#E6EDFD', chipFg: '#1D4ED8' },
} as const;

export default function TripWarningsScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);
  const query = useTripWarnings(tripId);
  const [handled, setHandled] = useState<string[]>([]);
  const [filter, setFilter] = useState<'active' | 'all' | 'done'>('active');

  const tripWarnings = (query.data?.active ?? []).map(toTripWarning);
  const tripWarningHistory = (query.data?.history ?? []).map(toTripWarningHistory);
  const active = tripWarnings.filter((warning) => !handled.includes(warning.key));
  const done = tripWarnings.filter((warning) => handled.includes(warning.key));
  const visible = filter === 'active' ? active : filter === 'done' ? done : tripWarnings;

  return (
    <Screen>
      <ScreenHeader
        title="Peringatan Trip"
        subtitle={`${active.length} belum ditangani`}
        onBack
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {(
            [
              { key: 'active', label: `Aktif (${active.length})` },
              { key: 'all', label: `Semua (${tripWarnings.length})` },
              { key: 'done', label: `Selesai (${done.length})` },
            ] as const
          ).map((item) => {
            const selected = item.key === filter;
            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[styles.filterChip, selected && styles.filterChipActive]}
              >
                <Text variant="labelMd" color={selected ? 'onPrimary' : 'secondary'}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {visible.length === 0 ? (
          <EmptyState
            icon="success"
            title={filter === 'done' ? 'Belum ada yang selesai' : 'Semua peringatan tertangani'}
            description={
              filter === 'done'
                ? 'Peringatan yang Anda tandai ditangani akan muncul di sini.'
                : 'Tidak ada peringatan aktif untuk trip ini.'
            }
          />
        ) : (
          visible.map((warning) => (
            <WarningCard
              key={warning.key}
              warning={warning}
              handled={handled.includes(warning.key)}
              onHandle={() => setHandled((current) => [...current, warning.key])}
              onOpenRoute={() => router.push(`/trip/${tripId}/routes`)}
            />
          ))
        )}

        {/* History */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text variant="labelMd" color="textSecondary" style={styles.upper}>
              RIWAYAT
            </Text>
            <Text variant="labelSm" color="textSecondary">
              Hari ini
            </Text>
          </View>
          <Card padded={false} shadow style={styles.overflow}>
            {tripWarningHistory.map((entry, index) => (
              <View key={entry.key}>
                <View style={styles.historyRow}>
                  <View style={styles.historyIcon}>
                    <Icon name="success" size={18} color={colors.success} />
                  </View>
                  <View style={styles.flex}>
                    <View style={styles.historyHead}>
                      <Text variant="bodyBold" numberOfLines={1} style={styles.flex}>
                        {entry.title}
                      </Text>
                      <Text variant="labelSm" color="textSecondary">
                        {entry.time}
                      </Text>
                    </View>
                    <Text variant="caption" color="textSecondary" style={styles.historyNote}>
                      {entry.note}
                    </Text>
                  </View>
                </View>
                {index < tripWarningHistory.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </Card>
        </View>

        {trip ? (
          <Button
            label="Buka Rute & Posisi"
            variant="secondary"
            size="md"
            icon="map"
            onPress={() => router.push(`/trip/${trip.id}/route`)}
          />
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function WarningCard({
  warning,
  handled = false,
  onHandle,
  onOpenRoute,
}: {
  warning: TripWarning;
  handled?: boolean;
  onHandle: () => void;
  onOpenRoute: () => void;
}) {
  const tone = SEVERITY[warning.severity];

  return (
    <Card padded={false} shadow style={[styles.warningCard, { borderLeftColor: tone.accent }]}>
      <View style={styles.warningInner}>
        <View style={styles.warningHead}>
          <View style={[styles.severityChip, { backgroundColor: tone.chipBg }]}>
            <Text variant="labelSm" color={tone.chipFg}>
              {warning.severityLabel}
            </Text>
          </View>
          {warning.sla ? (
            <View style={[styles.slaChip, { backgroundColor: tone.chipBg }]}>
              <Icon name={warning.severity === 'critical' ? 'timer' : 'schedule'} size={15} color={tone.chipFg} />
              <Text variant="labelSm" color={tone.chipFg} style={styles.mono}>
                {warning.sla}
              </Text>
            </View>
          ) : warning.timeLabel ? (
            <Text variant="labelMd" color="textSecondary">
              {warning.timeLabel}
            </Text>
          ) : null}
        </View>

        <View style={styles.warningBody}>
          <Text variant="headlineSm">{warning.title}</Text>
          <Text variant="bodyMd" color="onSurfaceVariant" style={styles.warningNote}>
            {warning.note}
          </Text>
        </View>

        {warning.suggestsRoute ? (
          <Pressable
            onPress={onOpenRoute}
            accessibilityRole="button"
            style={({ pressed }) => [styles.suggestion, pressed && styles.pressed]}
          >
            <View style={styles.suggestionLeft}>
              <View style={styles.suggestionIcon}>
                <Icon name="routeAlt" size={18} color={colors.warning} />
              </View>
              <Text variant="labelLg">Rute alternatif disarankan</Text>
            </View>
            <Icon name="forward" size={20} color={colors.secondary} />
          </Pressable>
        ) : null}

        {handled ? (
          <View style={styles.handledRow}>
            <Icon name="success" size={16} color={colors.success} />
            <Text variant="labelMd" color="success">
              Sudah ditangani
            </Text>
          </View>
        ) : warning.severity === 'critical' ? (
          <View style={styles.warningActions}>
            <Pressable accessibilityRole="button" style={[styles.action, styles.actionGhost]}>
              <Text variant="labelLg">Beri Alasan</Text>
            </Pressable>
            <Pressable
              onPress={onHandle}
              accessibilityRole="button"
              style={[styles.action, styles.actionPrimary]}
            >
              <Text variant="labelLg" color="onPrimary">
                Tandai Ditangani
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },
  mono: { fontVariant: ['tabular-nums'] },
  overflow: { overflow: 'hidden' },
  pressed: { opacity: 0.9 },

  scroll: { flex: 1 },
  content: { gap: spacing.lg, paddingHorizontal: spacing.gutter, paddingTop: spacing.sm, paddingBottom: spacing.xxl },

  filters: { gap: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  filterChipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },

  warningCard: {
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  warningInner: { padding: spacing.lg, gap: spacing.md },
  warningHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  severityChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  slaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  warningBody: { gap: spacing.xs },
  handledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  warningNote: { lineHeight: 20 },

  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },
  suggestionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningContainer,
  },

  warningActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  action: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.input,
  },
  actionGhost: { borderWidth: 1, borderColor: colors.outlineVariant },
  actionPrimary: { backgroundColor: colors.primaryContainer, ...shadows.card },

  section: { gap: spacing.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 2 },
  historyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.md + 2 },
  historyIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successContainer,
    marginTop: 2,
  },
  historyHead: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  historyNote: { marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.divider },
});
