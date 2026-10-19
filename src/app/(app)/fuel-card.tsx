import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { toFuelCard, toFuelTransaction } from '@/data/adapters';
import { useFuelCard, useFuelTransactions } from '@/hooks/api/useDriverData';
import { formatNumber } from '@/lib/format';
import { colors, radius, shadows, spacing } from '@/theme';
import type { FuelTransaction, FuelTxnStatus } from '@/data/types';

type FilterKey = 'all' | 'reconciled' | 'pending';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'reconciled', label: 'Sudah Direkonsiliasi' },
  { key: 'pending', label: 'Menunggu' },
];

const TXN_TONE: Record<FuelTxnStatus, { bg: string; fg: string; border: string }> = {
  reconciled: { bg: colors.successContainer, fg: colors.success, border: 'rgba(18,128,92,0.2)' },
  pending: { bg: colors.warningContainer, fg: colors.warning, border: 'rgba(180,83,9,0.2)' },
  flagged: { bg: colors.criticalContainer, fg: colors.critical, border: 'rgba(220,38,38,0.2)' },
};

export default function FuelCardScreen() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const cardQuery = useFuelCard();
  const txnQuery = useFuelTransactions(50);

  const card = cardQuery.data ? toFuelCard(cardQuery.data) : undefined;
  const fuelTransactions = (txnQuery.data ?? []).map(toFuelTransaction);

  const usagePercent = card && card.limit > 0 ? Math.round((card.used / card.limit) * 100) : 0;

  const visible = useMemo(
    () =>
      fuelTransactions.filter((txn) => {
        if (filter === 'all') return true;
        if (filter === 'pending') return txn.status !== 'reconciled';
        return txn.status === 'reconciled';
      }),
    [fuelTransactions, filter],
  );

  if (!card) {
    return (
      <Screen>
        <ScreenHeader title="Kartu BBM" onBack />
        <EmptyState
          icon="fuel"
          title="Belum ada kartu BBM"
          description={
            cardQuery.error?.message ?? 'Kartu BBM belum diterbitkan untuk akun Anda. Hubungi admin armada.'
          }
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title="Kartu BBM"
        subtitle={card.holder}
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Bantuan" hitSlop={8}>
            <Icon name="help" size={22} color={colors.onSurfaceVariant} />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View style={styles.hero}>
          <View style={[styles.heroRing, styles.heroRingTop]} />
          <View style={[styles.heroRing, styles.heroRingBottom]} />

          <View style={styles.heroHead}>
            <View style={styles.heroHeadLeft}>
              <View style={styles.heroTag}>
                <Text variant="labelMd" color={colors.onPrimary}>
                  KARTU BBM
                </Text>
              </View>
              <Icon name="contactless" size={18} color="rgba(255,255,255,0.8)" />
            </View>
            <View style={styles.heroStatus}>
              <View style={styles.heroStatusDot} />
              <Text variant="labelMd" color={colors.onPrimary}>
                Aktif
              </Text>
            </View>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.chip} />
            <Text variant="headlineMd" color={colors.onPrimary} style={styles.cardNumber}>
              {card.number}
            </Text>
            <Text variant="labelMd" color="rgba(255,255,255,0.9)">
              {card.holder}
            </Text>
          </View>

          <View style={styles.heroFoot}>
            <View>
              <Text variant="labelMd" color="rgba(255,255,255,0.7)">
                LIMIT
              </Text>
              <Text variant="bodyBold" color={colors.onPrimary}>
                Rp {formatNumber(card.limit)}
              </Text>
            </View>
            <View style={styles.heroFootRight}>
              <Text variant="labelMd" color="rgba(255,255,255,0.7)">
                SISA KUOTA
              </Text>
              <Text variant="headlineSm" color={colors.onPrimary}>
                Rp {formatNumber(card.remaining)}
              </Text>
            </View>
          </View>
        </View>

        {/* Usage */}
        <View style={styles.usageCard}>
          <View style={styles.usageHead}>
            <Text variant="labelLg">Pemakaian Bulan Ini</Text>
            <View style={styles.usagePercent}>
              <Text variant="labelMd" color="primaryContainer">
                {usagePercent}%
              </Text>
            </View>
          </View>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${usagePercent}%` }]} />
          </View>
          <View style={styles.usageFoot}>
            <Text variant="labelMd">Terpakai Rp {formatNumber(card.used)}</Text>
            <Text variant="labelMd" color="secondary">
              Reset tanggal {card.resetDay}
            </Text>
          </View>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((item) => {
            const active = item.key === filter;
            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text variant="labelMd" color={active ? 'onPrimary' : 'ink'}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text variant="headlineSm">Riwayat Transaksi BBM</Text>
            <Text variant="labelMd" color="secondary">
              {visible.length} Transaksi
            </Text>
          </View>

          <View style={styles.txnList}>
            {visible.map((txn) => (
              <TransactionRow key={txn.key} txn={txn} />
            ))}
          </View>
        </View>

        {/* Notice */}
        <View style={styles.notice}>
          <Icon name="lock" size={20} color={colors.onSurfaceVariant} />
          <Text variant="caption" color="onSurfaceVariant" style={styles.flex}>
            Transaksi bertanda tidak dapat diedit oleh driver.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function TransactionRow({ txn }: { txn: FuelTransaction }) {
  const tone = TXN_TONE[txn.status];
  const flagged = txn.status === 'flagged';

  return (
    <View style={[styles.txn, flagged && styles.txnFlagged]}>
      <View style={styles.txnMain}>
        <View
          style={[
            styles.txnIcon,
            { backgroundColor: flagged ? colors.criticalContainer : colors.surfaceContainer },
          ]}
        >
          <Icon name="fuel" size={22} color={flagged ? colors.critical : colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyBold" numberOfLines={1}>
            {txn.station}
          </Text>
          <Text variant="labelMd" color="secondary">
            {txn.dateLabel} • {txn.liters} L
          </Text>
        </View>
        <View style={styles.txnRight}>
          <Text variant="bodyBold">{txn.amount}</Text>
          <View style={[styles.txnBadge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
            {flagged ? <Icon name="warning" size={13} color={tone.fg} /> : null}
            <Text variant="labelSm" color={tone.fg}>
              {txn.statusLabel}
            </Text>
          </View>
        </View>
      </View>

      {txn.note ? (
        <View style={styles.txnNote}>
          <Icon name="info" size={15} color={colors.critical} />
          <Text variant="labelSm" color={colors.critical}>
            {txn.note}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { gap: spacing.lg, paddingHorizontal: spacing.gutter, paddingTop: spacing.sm, paddingBottom: spacing.xxl },

  hero: {
    borderRadius: 16,
    padding: spacing.lg + 4,
    backgroundColor: colors.primaryContainer,
    overflow: 'hidden',
    minHeight: 200,
    justifyContent: 'space-between',
    ...shadows.card,
  },
  heroRing: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroRingTop: { width: 176, height: 176, right: -48, top: -48 },
  heroRingBottom: { width: 144, height: 144, left: -40, bottom: -56 },
  heroHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heroTag: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(18,128,92,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.4)',
  },
  heroStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80' },
  heroBody: { gap: spacing.sm, marginVertical: spacing.lg },
  chip: {
    width: 36,
    height: 28,
    borderRadius: 4,
    backgroundColor: 'rgba(217,119,6,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.4)',
  },
  cardNumber: { letterSpacing: 2 },
  heroFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  heroFootRight: { alignItems: 'flex-end' },

  usageCard: {
    gap: spacing.sm + 2,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  usageHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  usagePercent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainer,
  },
  track: {
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
    padding: 2,
    overflow: 'hidden',
  },
  trackFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primaryContainer },
  usageFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  filters: { gap: spacing.sm, paddingVertical: 2 },
  filterChip: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },

  section: { gap: spacing.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  txnList: { gap: spacing.sm + 2 },
  txn: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    padding: spacing.md + 2,
    ...shadows.card,
  },
  txnFlagged: { borderColor: '#FECACA' },
  txnMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  txnIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnRight: { alignItems: 'flex-end', gap: spacing.xs },
  txnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  txnNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.sm + 2,
    marginHorizontal: -(spacing.md + 2),
    marginBottom: -(spacing.md + 2),
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
    backgroundColor: 'rgba(252,232,232,0.7)',
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    padding: spacing.md + 2,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: '#F3F4F6',
  },
});
