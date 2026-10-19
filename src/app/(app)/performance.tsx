import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  Card,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
  TrendChart,
} from '@/components/ui';
import { performanceKpis, performanceScore, performanceTrend } from '@/data/fixtures';
import type { PerformanceKpi } from '@/data/types';
import { colors, radius, spacing } from '@/theme';

type Period = 'week' | 'month';

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
];

export default function PerformanceScreen() {
  const [period, setPeriod] = useState<Period>('week');

  return (
    <Screen>
      <ScreenHeader
        title="Kinerja Saya"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Pilih periode kalender" hitSlop={8}>
            <Icon name="calendar" size={24} color={colors.primaryContainer} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={spacing.xxl}>
        <View style={styles.filters}>
          {PERIODS.map((entry) => {
            const active = entry.value === period;
            return (
              <Pressable
                key={entry.value}
                onPress={() => setPeriod(entry.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
              >
                <Text variant="labelSm" style={{ color: active ? colors.onPrimary : colors.secondary }}>
                  {entry.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.grid}>
          {[performanceKpis.slice(0, 2), performanceKpis.slice(2)].map((row, index) => (
            <View key={index} style={styles.gridRow}>
              {row.map((kpi) => (
                <KpiTile key={kpi.key} kpi={kpi} />
              ))}
            </View>
          ))}
        </View>

        <Card style={styles.section}>
          <View style={styles.rowBetween}>
            <Text variant="labelSm" color="textSecondary" style={styles.tracked}>
              TREN 7 HARI
            </Text>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primaryContainer }]} />
                <Text variant="caption" color="textSecondary">
                  Trip
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                <Text variant="caption" color="textSecondary">
                  Tepat waktu
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.chartWrap}>
            <TrendChart
              series={[
                {
                  key: 'onTime',
                  color: colors.success,
                  values: performanceTrend.map((point) => point.onTimePercent),
                },
                {
                  key: 'trips',
                  color: colors.primaryContainer,
                  values: performanceTrend.map((point) => point.trips),
                },
              ]}
            />

            <View style={styles.axis}>
              {performanceTrend.map((point) => (
                <Text key={point.day} variant="labelSm" color="textSecondary" style={styles.axisLabel}>
                  {point.day}
                </Text>
              ))}
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <View style={styles.rowBetween}>
            <Text variant="labelSm" color="textSecondary" style={styles.tracked}>
              SKOR KINERJA
            </Text>
            {performanceScore.verified ? (
              <View style={styles.verifiedChip}>
                <Icon name="verified" size={14} color={colors.primary} />
                <Text variant="labelSm" color="primary">
                  Terverifikasi
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.scoreRow}>
            <Text variant="displayLg" style={styles.scoreValue}>
              {performanceScore.value}
            </Text>
            <Text variant="labelLg" color="textSecondary">
              /{performanceScore.max}
            </Text>
          </View>

          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${performanceScore.value}%` }]} />
          </View>

          <View style={styles.compareRow}>
            <Icon name="trendingUp" size={16} color={colors.success} />
            <Text variant="caption" color="secondary">
              Di atas rata-rata fleet{' '}
              <Text variant="labelMd" color="ink">
                {performanceScore.fleetDelta} poin
              </Text>
            </Text>
          </View>
        </Card>

        <View style={styles.infoPanel}>
          <Icon name="info" size={20} color={colors.primaryContainer} style={styles.infoIcon} />
          <Text variant="caption" color="onSurface" style={styles.infoText}>
            Data dihitung otomatis dari trip, DVIR, dan POD yang Anda kirimkan. Pembaruan
            dilakukan berkala setiap status trip selesai.
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/activity')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
        >
          <View style={styles.linkLeft}>
            <Icon name="history" size={20} color={colors.primaryContainer} />
            <Text variant="bodyMd">Lihat Riwayat Laporan Lengkap</Text>
          </View>
          <Icon name="forward" size={20} color={colors.secondary} />
        </Pressable>
      </ScreenBody>
    </Screen>
  );
}

function KpiTile({ kpi }: { kpi: PerformanceKpi }) {
  const tone = kpi.deltaTone === 'warning' ? colors.warning : colors.success;
  const toneBg = kpi.deltaTone === 'warning' ? colors.warningContainer : colors.successContainer;

  return (
    <Card style={styles.kpiTile}>
      <View style={styles.kpiHead}>
        <Text variant="labelSm" color="secondary" style={[styles.tracked, styles.kpiLabel]}>
          {kpi.label.toUpperCase()}
        </Text>

        {kpi.delta ? (
          <View style={[styles.deltaChip, { backgroundColor: toneBg }]}>
            <Text variant="labelSm" style={{ color: tone }}>
              {kpi.deltaTone === 'warning' ? `↑ ${kpi.delta}` : kpi.delta}
            </Text>
          </View>
        ) : (
          <Icon name="route" size={16} color={colors.textMuted} />
        )}
      </View>

      <View style={styles.kpiValueRow}>
        <Text variant="displayLg" style={styles.kpiValue}>
          {kpi.value}
        </Text>
        {kpi.unit ? (
          <Text variant="labelSm" color="textSecondary">
            {kpi.unit}
          </Text>
        ) : null}
      </View>

      <Text variant="caption" color="textSecondary">
        {kpi.note}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  pill: {
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: colors.primaryContainer },
  pillIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider },

  grid: { gap: spacing.sm + 4, marginTop: spacing.md },
  gridRow: { flexDirection: 'row', gap: spacing.sm + 4 },
  kpiTile: { flex: 1, justifyContent: 'space-between', gap: spacing.sm },
  kpiHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.xs },
  kpiLabel: { flex: 1, fontSize: 10 },
  deltaChip: { paddingHorizontal: spacing.sm, paddingVertical: 1, borderRadius: radius.pill },
  kpiValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  kpiValue: { fontSize: 30, lineHeight: 32 },

  section: { gap: spacing.md, marginTop: spacing.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  tracked: { letterSpacing: 0.8 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  chartWrap: { gap: spacing.sm },
  axis: { flexDirection: 'row', alignItems: 'center' },
  axisLabel: { flex: 1, textAlign: 'center' },

  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.infoContainer,
  },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  scoreValue: { fontSize: 30, lineHeight: 34 },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
    overflow: 'hidden',
  },
  trackFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primaryContainer },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  infoPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.secondaryContainer,
    backgroundColor: colors.surfaceLow,
  },
  infoIcon: { marginTop: 1 },
  infoText: { flex: 1 },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  linkLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  pressed: { opacity: 0.85 },
});
