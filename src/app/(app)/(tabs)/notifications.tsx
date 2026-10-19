import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { EmptyState, Screen, Text } from '@/components/ui';
import type { Notification, NotificationSeverity } from '@/data/types';
import { useNotifications } from '@/hooks/useNotifications';
import { formatRelative } from '@/lib/format';
import { colors, radius, shadows, spacing } from '@/theme';

type FilterKey = 'all' | 'trip' | 'coaching' | 'document' | 'system';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'trip', label: 'Tugas' },
  { key: 'coaching', label: 'Coaching' },
  { key: 'document', label: 'Dokumen' },
  { key: 'system', label: 'Sistem' },
];

const SEVERITY: Record<NotificationSeverity, { bg: string; fg: string; icon: IconName }> = {
  critical: { bg: colors.criticalContainer, fg: colors.critical, icon: 'report' },
  warning: { bg: colors.warningContainer, fg: colors.warning, icon: 'warning' },
  info: { bg: colors.infoContainer, fg: '#1D4ED8', icon: 'truck' },
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<FilterKey>('all');

  const visible = useMemo(
    () =>
      notifications
        .filter((entry) => filter === 'all' || entry.type === filter)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [notifications, filter],
  );

  const open = (entry: Notification) => {
    markRead(entry.id);
    router.push(`/notifications/${entry.id}`);
  };

  return (
    <Screen>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerRow}>
          <View>
            <Text variant="headlineLg" style={styles.title}>
              Notifikasi
            </Text>
            <Text variant="caption" color="textSecondary" style={styles.subtitle}>
              {unreadCount} belum dibaca
            </Text>
          </View>
          <Pressable
            onPress={markAllRead}
            disabled={unreadCount === 0}
            accessibilityRole="button"
            style={styles.markAll}
          >
            <Text variant="caption" color={unreadCount === 0 ? 'textMuted' : 'primaryContainer'}>
              Tandai semua dibaca
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map((item) => {
            const active = item.key === filter;
            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text variant="labelSm" color={active ? 'onPrimary' : 'textSecondary'}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon="notifications"
            title="Tidak ada notifikasi"
            description="Belum ada pemberitahuan pada filter ini."
          />
        ) : (
          visible.map((entry) => {
            const tone = SEVERITY[entry.severity];
            const unread = !entry.readAt;
            return (
              <Pressable
                key={entry.id}
                onPress={() => open(entry)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <View style={[styles.iconTile, { backgroundColor: tone.bg }]}>
                  <Icon name={tone.icon} size={20} color={tone.fg} />
                </View>

                <View style={styles.rowText}>
                  <Text variant="labelMd" numberOfLines={1} style={styles.rowTitle}>
                    {entry.title}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={2}>
                    {entry.body}
                  </Text>
                </View>

                <View style={styles.rowMeta}>
                  <Text variant="labelSm" color="textMuted">
                    {formatRelative(entry.createdAt)}
                  </Text>
                  {unread ? <View style={styles.unreadDot} /> : null}
                </View>
              </Pressable>
            );
          })
        )}

        <View style={styles.syncBadgeWrap}>
          <View style={styles.syncBadge}>
            <View style={styles.syncDot} />
            <Text variant="labelSm" color="onSurfaceVariant">
              Semua notifikasi tersinkron • Online
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.md,
    backgroundColor: colors.canvas,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { fontSize: 26, lineHeight: 32 },
  subtitle: { marginTop: 2 },
  markAll: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.input },
  chips: { gap: spacing.sm, paddingTop: spacing.md },
  chip: {
    height: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  list: { flex: 1 },
  listContent: { gap: spacing.md, paddingHorizontal: spacing.gutter, paddingTop: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  rowPressed: { opacity: 0.9 },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 14, lineHeight: 19 },
  rowMeta: { alignItems: 'flex-end', gap: spacing.xs, paddingTop: 2 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryContainer,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  syncBadgeWrap: { alignItems: 'center', paddingTop: spacing.sm },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceHigh,
  },
  syncDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
});
