import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { BottomBar, Button, Card, Screen, ScreenBody, Text } from '@/components/ui';
import { SAFETY_FILTERS } from '@/data/constants';
import { toSafetyEvent } from '@/data/adapters';
import { useSafetyEvents } from '@/hooks/api/useDriverData';
import { colors, radius, shadows, spacing } from '@/theme';
import type { SafetyEvent } from '@/data/types';

const SEVERITY_COLOR: Record<SafetyEvent['severity'], string> = {
  critical: colors.critical,
  warning: colors.warning,
  info: '#1D4ED8',
};

const SEVERITY_TILE: Record<SafetyEvent['severity'], { bg: string; fg: string }> = {
  critical: { bg: colors.criticalContainer, fg: colors.critical },
  warning: { bg: colors.warningContainer, fg: colors.warning },
  info: { bg: '#E6EDFD', fg: '#1D4ED8' },
};

export default function SafetyScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const query = useSafetyEvents(30, 100);
  const safetyEvents = (query.data ?? []).map(toSafetyEvent);

  const penalty = safetyEvents.reduce((total, event) => {
    if (event.severity === 'critical') return total + 10;
    if (event.severity === 'warning') return total + 4;
    return total + 1;
  }, 0);
  const safetyScore = {
    value: Math.max(0, 100 - penalty),
    delta: safetyEvents.length === 0 ? 'Tidak ada pelanggaran' : `${safetyEvents.length} peristiwa`,
    note:
      safetyEvents.length === 0
        ? 'Tidak ada peristiwa safety dalam 30 hari terakhir.'
        : `Skor dihitung dari ${safetyEvents.length} peristiwa safety 30 hari terakhir.`,
  };

  const visible = useMemo(
    () => safetyEvents.filter((event) => filter === 'all' || event.category === filter),
    [safetyEvents, filter],
  );

  return (
    <Screen>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            hitSlop={8}
            style={styles.headerButton}
          >
            <Icon name="back" size={24} color={colors.onSurface} />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable accessibilityRole="button" accessibilityLabel="Informasi" hitSlop={8}>
              <Icon name="info" size={22} color={colors.secondary} />
            </Pressable>
          </View>
        </View>
        <View style={styles.titleBlock}>
          <Text variant="headlineMd">Peristiwa Safety</Text>
          <Text variant="bodyMd" color="textSecondary">
            Perilaku mengemudi Anda
          </Text>
        </View>
      </View>

      <ScreenBody bottomPadding={140} style={styles.body}>
        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {SAFETY_FILTERS.map((item) => {
            const active = item.key === filter;
            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text variant="labelLg" color={active ? 'onPrimary' : 'ink'}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Score */}
        <Card shadow>
          <View style={styles.scoreHead}>
            <Text variant="labelMd" color="textSecondary" style={styles.upper}>
              SKOR SAFETY
            </Text>
            <View style={styles.deltaChip}>
              <Icon name="arrowUp" size={14} color={colors.success} />
              <Text variant="labelSm" color={colors.success}>
                {safetyScore.delta}
              </Text>
            </View>
          </View>
          <View style={styles.scoreValue}>
            <Text variant="displayLg">{safetyScore.value}</Text>
            <Text variant="headlineSm" color="textSecondary">
              / 100
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${safetyScore.value}%` }]} />
          </View>
          <Text variant="bodyMd" color="textSecondary" style={styles.scoreNote}>
            {safetyScore.note}
          </Text>
        </Card>

        {/* Events */}
        <View style={styles.sectionHead}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            DAFTAR PERISTIWA ({visible.length})
          </Text>
          <Text variant="labelSm" color="textSecondary">
            Hari Ini
          </Text>
        </View>

        <View style={styles.eventList}>
          {visible.map((event) => (
            <SafetyRow key={event.key} event={event} />
          ))}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Icon name="info" size={20} color={colors.primaryContainer} />
          <Text variant="caption" color="onSurface" style={styles.flex}>
            Peristiwa Safety terjadi otomatis dari data kendaraan, bukan dari laporan manual.
          </Text>
        </View>
      </ScreenBody>

      <BottomBar>
        <Button
          label="Lihat Rencana Coaching"
          iconAfter="forward"
          onPress={() => router.push('/coaching')}
        />
      </BottomBar>
    </Screen>
  );
}

function SafetyRow({ event }: { event: SafetyEvent }) {
  const tile = SEVERITY_TILE[event.severity];

  return (
    <View style={styles.event}>
      <View style={[styles.eventDot, { backgroundColor: SEVERITY_COLOR[event.severity] }]} />
      <View style={styles.flex}>
        <View style={styles.eventMeta}>
          <View style={[styles.eventBadge, { backgroundColor: tile.bg }]}>
            <Text variant="labelSm" color={tile.fg}>
              {event.categoryLabel}
            </Text>
          </View>
          <View style={styles.eventTime}>
            <Icon name="schedule" size={13} color={colors.secondary} />
            <Text variant="labelSm" color="secondary">
              {event.time}
            </Text>
          </View>
        </View>
        <Text variant="bodyBold" numberOfLines={1}>
          {event.title}
        </Text>
        <View style={styles.eventLocation}>
          <Icon name="location" size={14} color={colors.secondary} />
          <Text variant="labelSm" color="secondary" numberOfLines={1}>
            {event.location}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text variant="labelSm" color={tile.fg}>
            {event.metric}
          </Text>
          <Text variant="labelSm">{event.metricNote}</Text>
        </View>
      </View>

      {event.hasPhoto ? (
        <View style={styles.thumb}>
          <Icon name="image" size={22} color={colors.textMuted} />
        </View>
      ) : (
        <View style={styles.thumbArrow}>
          <Icon name="forward" size={20} color={colors.secondary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },

  header: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196,197,217,0.3)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  titleBlock: { marginTop: spacing.xs, gap: 2 },

  body: { paddingTop: spacing.lg },
  filters: { gap: spacing.sm, paddingVertical: 2 },
  filterChip: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(196,197,217,0.6)',
    backgroundColor: colors.surface,
  },
  filterChipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },

  scoreHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deltaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.successContainer,
  },
  scoreValue: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginVertical: spacing.xs },
  track: {
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceContainer,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  trackFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.success },
  scoreNote: { paddingTop: spacing.xs },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  eventList: { gap: spacing.md, marginTop: spacing.md },
  event: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md + 2,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(196,197,217,0.4)',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  eventDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  eventBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  eventTime: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  eventLocation: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLow,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(196,197,217,0.4)',
    alignSelf: 'center',
  },
  thumbArrow: { width: 32, alignItems: 'flex-end', alignSelf: 'center' },

  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: '#E6EDFD',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
});
