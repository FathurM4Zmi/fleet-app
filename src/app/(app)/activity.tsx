import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Card, Screen, ScreenBody, ScreenHeader, Text } from '@/components/ui';
import { ACTIVITY_FILTERS } from '@/data/constants';
import { toActivity } from '@/data/adapters';
import type { ActivityCategory, ActivityTone } from '@/data/types';
import { useActivity } from '@/hooks/api/useDriverData';
import { formatDayDate } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

const CATEGORY_ICON: Record<ActivityCategory, IconName> = {
  login: 'success',
  dvir: 'checklist',
  pod: 'cloudDone',
  fuel: 'fuel',
  trip: 'truck',
};

const TONE: Record<ActivityTone, { fg: string; bg: string }> = {
  success: { fg: colors.success, bg: colors.successContainer },
  info: { fg: colors.primaryContainer, bg: colors.infoContainer },
  warning: { fg: colors.warning, bg: colors.warningContainer },
};

type Filter = ActivityCategory | 'all';

export default function ActivityScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const query = useActivity(30, 100);
  const activityEntries = (query.data ?? []).map(toActivity);
  const activityDay = formatDayDate(new Date().toISOString());

  const visible =
    filter === 'all'
      ? activityEntries
      : activityEntries.filter((entry) => entry.category === filter);

  return (
    <Screen>
      <ScreenHeader
        title="Aktivitas Saya"
        subtitle="Jejak aksi Anda"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Filter aktivitas" hitSlop={8}>
            <Icon name="sliders" size={22} color={colors.onSurfaceVariant} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={spacing.xxl}>
        <View style={styles.banner}>
          <Icon name="verified" size={22} color={colors.primary} />
          <Text variant="caption" color="primary" style={styles.bannerText}>
            Hanya aktivitas Anda sendiri yang ditampilkan. Data ini tidak dapat diubah atau
            dihapus.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chips}
        >
          {ACTIVITY_FILTERS.map((entry) => {
            const active = entry.value === filter;
            return (
              <Pressable
                key={entry.value}
                onPress={() => setFilter(entry.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
              >
                <Text variant="labelMd" style={{ color: active ? colors.onPrimary : colors.textSecondary }}>
                  {entry.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Card style={styles.section}>
          <View style={styles.cardHead}>
            <View style={styles.cardHeadLeft}>
              <Icon name="calendar" size={18} color={colors.textSecondary} />
              <Text variant="labelSm" color="onSurfaceVariant" style={styles.tracked}>
                HARI INI • {activityDay.toUpperCase()}
              </Text>
            </View>
            <View style={styles.countChip}>
              <Text variant="labelSm" color="primary">
                {visible.length} Aksi
              </Text>
            </View>
          </View>

          {visible.length === 0 ? (
            <Text variant="caption" color="textSecondary" style={styles.empty}>
              Belum ada aktivitas pada kategori ini.
            </Text>
          ) : (
            <View style={styles.timeline}>
              <View style={styles.rail} />

              {visible.map((entry) => {
                const tone = TONE[entry.tone];

                return (
                  <View key={entry.key} style={styles.row}>
                    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
                      <Icon name={CATEGORY_ICON[entry.category]} size={20} color={tone.fg} />
                    </View>

                    <View style={styles.rowBody}>
                      <View style={styles.rowTop}>
                        <Text variant="bodyBold" style={styles.flex}>
                          {entry.title}
                        </Text>
                        <Text variant="labelSm" color="textMuted">
                          {entry.time}
                        </Text>
                      </View>
                      <Text variant="caption" color="textSecondary" style={styles.detail}>
                        {entry.detail}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.rangeButton, pressed && styles.pressed]}
        >
          <View style={styles.rangeLeft}>
            <Icon name="calendar" size={22} color={colors.textSecondary} />
            <Text variant="labelLg">Rentang: {activityDay}</Text>
          </View>
          <Icon name="expand" size={22} color={colors.textSecondary} />
        </Pressable>
      </ScreenBody>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },
  pressed: { opacity: 0.85 },

  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: colors.infoContainer,
  },
  bannerText: { flex: 1 },

  chipsScroll: { marginTop: spacing.md, marginHorizontal: -spacing.gutter },
  chips: { gap: spacing.sm, paddingHorizontal: spacing.gutter },
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primaryContainer },
  chipIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outlineVariant },

  section: { marginTop: spacing.md },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLow,
  },
  cardHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  countChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    backgroundColor: '#EFF6FF',
  },
  empty: { paddingTop: spacing.md },

  timeline: { position: 'relative', paddingTop: spacing.sm },
  rail: {
    position: 'absolute',
    left: 19,
    top: spacing.xl,
    bottom: spacing.lg,
    width: 2,
    backgroundColor: colors.divider,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 2, paddingTop: 2 },
  rowTop: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  detail: { marginTop: 1 },

  rangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderIdle,
    backgroundColor: colors.surface,
  },
  rangeLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4 },

  footer: { marginTop: spacing.md },
});
