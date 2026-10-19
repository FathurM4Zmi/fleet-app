import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { BottomBar, Button, Card, Screen, ScreenBody, ScreenHeader, Text } from '@/components/ui';
import { settlementHistory, settlementLines, settlementSummary } from '@/data/fixtures';
import type { SettlementStep, SettlementStepState } from '@/data/types';
import { colors, radius, spacing } from '@/theme';

const STEPS: SettlementStep[] = [
  { key: 'draft', label: 'Draft', state: 'done' },
  { key: 'submitted', label: 'Diajukan', state: 'done' },
  { key: 'approved', label: 'Disetujui', state: 'active' },
  { key: 'paid', label: 'Dibayar', state: 'upcoming' },
];

const STEP_LABEL_COLOR: Record<SettlementStepState, 'secondary' | 'primary' | 'textMuted'> = {
  done: 'secondary',
  active: 'primary',
  upcoming: 'textMuted',
};

export default function SettlementScreen() {
  return (
    <Screen>
      <ScreenHeader
        title="Settlement"
        subtitle={settlementSummary.period}
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Kalender" hitSlop={8}>
            <Icon name="calendar" size={24} color={colors.secondary} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={spacing.xxl * 2}>
        <View style={styles.hero}>
          <View style={styles.rowBetween}>
            <Text variant="labelSm" color="primary" style={styles.tracked}>
              TOTAL SETTLEMENT
            </Text>
            <View style={styles.approvedChip}>
              <Icon name="success" size={16} color={colors.success} />
              <Text variant="labelSm" color="success">
                {settlementSummary.status}
              </Text>
            </View>
          </View>

          <Text variant="displayLg" style={styles.total}>
            {settlementSummary.total}
          </Text>

          <View style={styles.heroFooter}>
            <View style={styles.paidRow}>
              <Icon name="schedule" size={18} color={colors.primary} />
              <Text variant="labelSm" color="primary">
                {settlementSummary.paidNote}
              </Text>
            </View>
            <Text variant="labelMd" color="primary">
              {settlementSummary.punctuality}
            </Text>
          </View>
        </View>

        <Card shadow style={styles.section}>
          <View style={styles.stepper}>
            <View style={styles.rail} />
            <View style={styles.railFill} />

            {STEPS.map((step) => {
              const done = step.state === 'done';
              const active = step.state === 'active';

              return (
                <View key={step.key} style={styles.step}>
                  <View
                    style={[
                      styles.stepDot,
                      done && styles.stepDotDone,
                      active && styles.stepDotActive,
                      step.state === 'upcoming' && styles.stepDotUpcoming,
                    ]}
                  >
                    {done ? (
                      <Icon name="check" size={18} color={colors.onSurface} />
                    ) : (
                      <View
                        style={[
                          styles.stepInner,
                          { backgroundColor: active ? colors.onPrimary : colors.borderIdle },
                        ]}
                      />
                    )}
                  </View>
                  <Text variant="labelSm" color={STEP_LABEL_COLOR[step.state]}>
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card shadow style={styles.section}>
          <View style={styles.cardHead}>
            <Text variant="labelSm" color="textSecondary" style={styles.tracked}>
              RINCIAN PER TRIP
            </Text>
            <Text variant="labelSm" color="onSurfaceVariant">
              {settlementLines.length} Perjalanan
            </Text>
          </View>

          {settlementLines.map((line, index) => (
            <View key={line.key}>
              <View style={styles.lineRow}>
                <View style={styles.lineBody}>
                  <Text variant="bodyMd" numberOfLines={1}>
                    {line.destination}
                  </Text>
                  <Text variant="labelSm" color="textSecondary" numberOfLines={1}>
                    {line.meta}
                  </Text>
                </View>
                <Text variant="bodyBold">{line.amount}</Text>
              </View>
              {index < settlementLines.length - 1 ? <View style={styles.rowDivider} /> : null}
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text variant="bodyBold" style={styles.tracked}>
              TOTAL
            </Text>
            <Text variant="headlineSm" color="primaryContainer">
              {settlementSummary.total}
            </Text>
          </View>
        </Card>

        <View style={styles.notice}>
          <Icon name="lock" size={20} color={colors.secondary} />
          <Text variant="bodyMd" color="onSurfaceVariant" style={styles.noticeText}>
            Data ini hanya dapat dibaca. Koreksi settlement diajukan lewat supervisor.
          </Text>
        </View>

        <Card shadow style={styles.section}>
          <View style={styles.cardHead}>
            <Text variant="labelSm" color="textSecondary" style={styles.tracked}>
              PERIODE SEBELUMNYA
            </Text>
            <Icon name="history" size={20} color={colors.secondary} />
          </View>

          {settlementHistory.map((period, index) => (
            <View key={period.key}>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.historyRow, pressed && styles.pressed]}
              >
                <View style={styles.historyBody}>
                  <Text variant="bodyMd">{period.label}</Text>
                  <Text variant="bodyBold">{period.amount}</Text>
                </View>

                <View style={styles.historyTrailing}>
                  <View style={styles.paidChip}>
                    <Text variant="labelSm" color="success">
                      {period.status}
                    </Text>
                  </View>
                  <Icon name="forward" size={20} color={colors.secondary} />
                </View>
              </Pressable>

              {index < settlementHistory.length - 1 ? <View style={styles.rowDivider} /> : null}
            </View>
          ))}
        </Card>
      </ScreenBody>

      <BottomBar>
        <Button label="Lihat Slip" icon="receipt" onPress={() => undefined} />
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.download, pressed && styles.pressed]}
        >
          <Text variant="bodyMd" color="secondary">
            Unduh PDF
          </Text>
        </Pressable>
      </BottomBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },
  pressed: { opacity: 0.85 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },

  hero: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: colors.infoContainer,
  },
  approvedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(18,128,92,0.2)',
    backgroundColor: colors.successContainer,
  },
  total: { fontSize: 28, lineHeight: 34 },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(191,219,254,0.6)',
  },
  paidRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  section: { marginTop: spacing.md },

  stepper: { flexDirection: 'row', alignItems: 'flex-start', position: 'relative' },
  rail: {
    position: 'absolute',
    top: 15,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: colors.divider,
  },
  railFill: {
    position: 'absolute',
    top: 15,
    left: 24,
    width: '66%',
    height: 2,
    backgroundColor: colors.primaryContainer,
  },
  step: { flex: 1, alignItems: 'center', gap: spacing.xs + 2 },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  stepDotDone: { backgroundColor: colors.secondaryContainer },
  stepDotActive: { backgroundColor: colors.primaryContainer, borderWidth: 4, borderColor: 'rgba(27,77,255,0.2)' },
  stepDotUpcoming: { backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: colors.borderIdle },
  stepInner: { width: 10, height: 10, borderRadius: 5 },

  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: 48,
    paddingVertical: spacing.sm + 2,
  },
  lineBody: { flex: 1, gap: 2, paddingRight: spacing.sm },
  rowDivider: { height: 1, backgroundColor: colors.divider },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm + 2,
    borderTopWidth: 2,
    borderTopColor: colors.divider,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },
  noticeText: { flex: 1 },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: 48,
    paddingVertical: spacing.sm + 2,
  },
  historyBody: { flex: 1, gap: 2 },
  historyTrailing: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  paidChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(18,128,92,0.2)',
    backgroundColor: colors.successContainer,
  },

  download: { height: 40, alignItems: 'center', justifyContent: 'center' },
});
