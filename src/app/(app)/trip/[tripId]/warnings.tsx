import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Button, Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { tripWarningHistory, tripWarnings } from '@/data/fixtures';
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
  const [handled, setHandled] = useState<string[]>([]);

  const active = tripWarnings.filter((warning) => !handled.includes(warning.key));

  return (
    <Screen>
      <ScreenHeader
        title="Peringatan Trip"
        subtitle={`${active.length} belum ditangani`}
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Filter" hitSlop={8}>
            <Icon name="sliders" size={22} color={colors.onSurface} />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <View style={[styles.filterChip, styles.filterChipActive]}>
            <Text variant="labelMd" color="onPrimary">
              Aktif ({active.length})
            </Text>
          </View>
          <View style={styles.filterChip}>
            <Text variant="labelMd" color="secondary">
              Semua
            </Text>
          </View>
          <View style={styles.filterChip}>
            <Text variant="labelMd" color="secondary">
              Selesai
            </Text>
          </View>
        </ScrollView>

        {active.length === 0 ? (
          <EmptyState
            icon="success"
            title="Semua peringatan tertangani"
            description="Tidak ada peringatan aktif untuk trip ini."
          />
        ) : (
          active.map((warning) => (
            <WarningCard
              key={warning.key}
              warning={warning}
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
  onHandle,
  onOpenRoute,
}: {
  warning: TripWarning;
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

        {warning.severity === 'critical' ? (
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
