import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { EmptyState, Screen, Text } from '@/components/ui';
import { TripCard } from '@/components/TripCard';
import type { Trip } from '@/data/types';
import { useTasks } from '@/hooks/api/useDriverData';
import { useTrips } from '@/hooks/useTrips';
import { colors, radius, shadows, spacing } from '@/theme';

type FilterKey = 'all' | 'new' | 'active' | 'done' | 'cancelled';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'new', label: 'Baru' },
  { key: 'active', label: 'Dikerjakan' },
  { key: 'done', label: 'Selesai' },
  { key: 'cancelled', label: 'Dibatalkan' },
];

const matches = (trip: Trip, filter: FilterKey): boolean => {
  switch (filter) {
    case 'new':
      return trip.status === 'assigned';
    case 'active':
      return trip.status === 'accepted' || trip.status === 'in_progress';
    case 'done':
      return trip.status === 'completed';
    case 'cancelled':
      return trip.status === 'rejected';
    default:
      return true;
  }
};

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const { accept, trips } = useTrips();
  const tasks = useTasks({ take: 100 });
  const [filter, setFilter] = useState<FilterKey>('all');

  const deliveredTrips = useMemo(
    () => new Set((tasks.data ?? []).filter((task) => task.tripId).map((task) => task.tripId as string)),
    [tasks.data],
  );

  const counts = useMemo(() => {
    const map: Record<FilterKey, number> = { all: 0, new: 0, active: 0, done: 0, cancelled: 0 };
    for (const trip of trips) {
      map.all += 1;
      if (trip.status === 'assigned') map.new += 1;
      if (trip.status === 'accepted' || trip.status === 'in_progress') map.active += 1;
      if (trip.status === 'completed') map.done += 1;
      if (trip.status === 'rejected') map.cancelled += 1;
    }
    return map;
  }, [trips]);

  const visible = useMemo(
    () =>
      trips
        .filter((trip) => matches(trip, filter))
        .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt)),
    [trips, filter],
  );

  return (
    <Screen style={{ backgroundColor: colors.surface }}>
      <View style={[styles.appBar, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.appBarRow}>
          <View>
            <Text variant="headlineLg">Inbox</Text>
            <Text variant="labelMd" color="secondary" style={styles.subtitle}>
              {counts.all} trip bulan ini
            </Text>
          </View>
          <View style={styles.appBarActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Segarkan data"
              style={styles.iconButton}
            >
              <Icon name="sync" size={24} color={colors.ink} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filter penugasan"
              style={styles.iconButton}
            >
              <Icon name="sliders" size={24} color={colors.ink} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.chipsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map((item) => {
            const active = item.key === filter;
            const count = counts[item.key];
            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text variant="labelMd" color={active ? 'onPrimary' : 'textSecondary'}>
                  {item.label}
                </Text>
                {item.key === 'new' && count > 0 ? (
                  <View style={styles.chipCount}>
                    <Text variant="labelSm" color="onPrimary">
                      {count}
                    </Text>
                  </View>
                ) : null}
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
            icon="inbox"
            title="Tidak ada trip"
            description="Belum ada penugasan pada filter ini. Coba pilih filter lain."
          />
        ) : (
          visible.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              vehicle={
                trip.vehiclePlate
                  ? {
                      id: trip.vehicleId,
                      plate: trip.vehiclePlate,
                      model: trip.vehicleModel ?? '—',
                      type: '—',
                      odometerKm: 0,
                      status: 'in_use',
                    }
                  : undefined
              }
              hasPod={deliveredTrips.has(trip.id)}
              online={trip.id === 'trp-1039'}
              onPress={() => router.push(`/trip/${trip.id}`)}
              onAccept={() => accept(trip.id)}
              onReject={() => router.push(`/trip/${trip.id}/reject`)}
              primaryLabel={trip.status === 'in_progress' ? 'Buka Rute' : undefined}
              onPrimary={() => router.push(`/trip/${trip.id}/execution`)}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  appBar: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    ...shadows.card,
  },
  appBarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subtitle: { marginTop: 2 },
  appBarActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  chips: { gap: spacing.sm, paddingHorizontal: spacing.gutter, paddingVertical: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  chipCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
  },
  list: { flex: 1 },
  listContent: { gap: spacing.lg, paddingHorizontal: spacing.gutter, paddingTop: spacing.lg },
});
