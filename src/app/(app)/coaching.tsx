import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Card, Screen, ScreenBody, ScreenHeader, Text, TrendChart } from '@/components/ui';
import { coachingCertifications, coachingPlan, coachingScore, coachingSessions, coachingTrend } from '@/data/fixtures';
import type { CoachingMilestoneState, DocumentStatus } from '@/data/types';
import { colors, radius, spacing } from '@/theme';

const DOC_ICON: Record<string, IconName> = {
  homolog: 'award',
  'first-aid': 'health',
};

const DOC_TONE: Record<DocumentStatus, { fg: string; bg: string }> = {
  valid: { fg: colors.success, bg: colors.successContainer },
  expiring: { fg: colors.warning, bg: colors.warningContainer },
  expired: { fg: colors.critical, bg: colors.criticalContainer },
};

const MILESTONE_TONE: Record<CoachingMilestoneState, { fg: string; bg?: string; border?: string }> = {
  done: { fg: colors.success },
  waiting: { fg: colors.warning, bg: '#FEF3C7' },
  locked: { fg: colors.textMuted },
};

export default function CoachingScreen() {
  const done = coachingPlan.milestones.filter((milestone) => milestone.state === 'done').length;
  const total = coachingPlan.milestones.length;
  const percent = Math.round((done / total) * 100);

  return (
    <Screen>
      <ScreenHeader
        title="Coaching Saya"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Bantuan atau info" hitSlop={8}>
            <Icon name="info" size={22} color={colors.secondary} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={spacing.xxl}>
        <Card shadow style={styles.section}>
          <View style={styles.rowBetween}>
            <View>
              <Text variant="labelSm" color="textSecondary" style={styles.tracked}>
                SKOR SAFETY
              </Text>
              <Text variant="caption" color="textSecondary" style={styles.scorePeriod}>
                {coachingScore.period}
              </Text>
            </View>
            <View style={styles.scoreRight}>
              <Text variant="displayLg" style={styles.scoreValue}>
                {coachingScore.value}
              </Text>
              <Text variant="caption" color="textSecondary">
                / {coachingScore.max}
              </Text>
            </View>
          </View>

          <View style={styles.chartWrap}>
            <TrendChart
              height={82}
              series={[
                {
                  key: 'safety',
                  color: colors.success,
                  values: coachingTrend.map((point) => point.score),
                },
              ]}
            />
            <View style={styles.axis}>
              {coachingTrend.map((point, index) => {
                const latest = index === coachingTrend.length - 1;
                return (
                  <Text
                    key={point.label}
                    variant="labelSm"
                    color={latest ? 'success' : 'textSecondary'}
                    style={styles.axisLabel}
                  >
                    {point.label}
                  </Text>
                );
              })}
            </View>
          </View>

          <View style={styles.deltaRow}>
            <View style={styles.deltaPill}>
              <Icon name="arrowUp" size={15} color={colors.success} />
              <Text variant="labelSm" color="success">
                +{coachingScore.delta} pts sejak coaching
              </Text>
            </View>
            <Text variant="labelSm" color="textSecondary">
              Peringkat Site: #{coachingScore.siteRank}
            </Text>
          </View>
        </Card>

        <Card shadow style={styles.section}>
          <View style={styles.rowBetween}>
            <Text variant="labelSm" color="primaryContainer" style={styles.tracked}>
              PLAN AKTIF
            </Text>
            <View style={styles.targetChip}>
              <Text variant="labelSm" color="textSecondary">
                Target: {coachingPlan.targetDate}
              </Text>
            </View>
          </View>

          <Text variant="bodyBold" style={styles.planTitle}>
            {coachingPlan.title}
          </Text>
          <Text variant="caption" color="textSecondary" style={styles.planBody}>
            {coachingPlan.description}
          </Text>

          <View style={styles.progressBlock}>
            <View style={styles.rowBetween}>
              <Text variant="caption" color="textSecondary">
                Progres Milestone
              </Text>
              <Text variant="labelMd" color="ink">
                {done} / {total} Selesai ({percent}%)
              </Text>
            </View>

            <View style={styles.segments}>
              {coachingPlan.milestones.map((milestone) => (
                <View
                  key={milestone.key}
                  style={[styles.segment, milestone.state === 'done' && styles.segmentDone]}
                />
              ))}
            </View>
          </View>

          <View style={styles.milestones}>
            {coachingPlan.milestones.map((milestone) => {
              const tone = MILESTONE_TONE[milestone.state];
              const locked = milestone.state === 'locked';

              return (
                <View key={milestone.key} style={styles.milestoneRow}>
                  <View
                    style={[
                      styles.milestoneDot,
                      milestone.state === 'done' && styles.milestoneDotDone,
                      locked && styles.milestoneDotLocked,
                    ]}
                  >
                    {milestone.state === 'done' ? (
                      <Icon name="check" size={15} color={colors.onPrimary} />
                    ) : null}
                  </View>

                  <View style={styles.milestoneText}>
                    <Text
                      variant="labelMd"
                      color={locked ? 'textMuted' : 'onSurface'}
                      style={styles.flex}
                    >
                      {milestone.label}
                    </Text>

                    {tone.bg ? (
                      <View style={[styles.milestoneChip, { backgroundColor: tone.bg }]}>
                        <Text variant="labelSm" style={{ color: tone.fg }}>
                          {milestone.note}
                        </Text>
                      </View>
                    ) : (
                      <Text variant="labelSm" style={{ color: tone.fg }}>
                        {milestone.note}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={() => router.push('/coaching/update')}
            accessibilityRole="button"
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Icon name="refresh" size={17} color={colors.primaryContainer} />
            <Text variant="labelMd" color="primaryContainer">
              Perbarui Progres
            </Text>
          </Pressable>
        </Card>

        <View style={styles.sectionHead}>
          <Text variant="labelSm" color="textSecondary" style={styles.tracked}>
            SERTIFIKASI
          </Text>
          <Pressable accessibilityRole="button" hitSlop={8}>
            <Text variant="labelMd" color="primaryContainer">
              Lihat Semua
            </Text>
          </Pressable>
        </View>

        <View style={styles.certGrid}>
          {coachingCertifications.map((document) => {
            const tone = DOC_TONE[document.status];

            return (
              <Card key={document.key} style={styles.certCard}>
                <View style={[styles.certIcon, { backgroundColor: tone.bg }]}>
                  <Icon
                    name={DOC_ICON[document.key] ?? 'verified'}
                    size={19}
                    color={tone.fg}
                  />
                </View>
                <Text variant="labelLg">{document.title}</Text>
                <Text variant="labelSm" color={document.status === 'valid' ? 'textSecondary' : 'warning'} style={styles.certNote}>
                  {document.note}
                </Text>

                <View style={styles.certFooter}>
                  <View style={[styles.certChip, { backgroundColor: tone.bg }]}>
                    <Text variant="labelSm" style={{ color: tone.fg }}>
                      {document.statusLabel}
                    </Text>
                  </View>
                  {document.hint ? (
                    <Text variant="labelSm" color="textMuted">
                      {document.hint}
                    </Text>
                  ) : (
                    <Icon name="schedule" size={15} color={tone.fg} />
                  )}
                </View>
              </Card>
            );
          })}
        </View>

        <View style={styles.sectionHead}>
          <Text variant="labelSm" color="textSecondary" style={styles.tracked}>
            RIWAYAT
          </Text>
          <Text variant="labelSm" color="textSecondary">
            {coachingSessions.length} sesi sebelumnya
          </Text>
        </View>

        <Card padded={false} shadow>
          {coachingSessions.map((session, index) => (
            <View key={session.key}>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.sessionRow, pressed && styles.pressed]}
              >
                <View style={styles.sessionBody}>
                  <Text variant="labelLg" numberOfLines={1}>
                    {session.title}
                  </Text>
                  <Text variant="labelSm" color="textSecondary" numberOfLines={1}>
                    {session.note}
                  </Text>
                </View>

                <View style={styles.sessionTrailing}>
                  <View style={styles.sessionChip}>
                    <Text variant="labelSm" color="textSecondary">
                      {session.statusLabel}
                    </Text>
                  </View>
                  <Icon name="forward" size={18} color={colors.textMuted} />
                </View>
              </Pressable>

              {index < coachingSessions.length - 1 ? <View style={styles.rowDivider} /> : null}
            </View>
          ))}
        </Card>
      </ScreenBody>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },
  pressed: { opacity: 0.85 },

  section: { gap: spacing.md, marginBottom: spacing.md },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },

  scorePeriod: { marginTop: 2 },
  scoreRight: { alignItems: 'flex-end' },
  scoreValue: { fontSize: 38, lineHeight: 40 },
  chartWrap: { gap: spacing.sm, marginTop: spacing.sm },
  axis: { flexDirection: 'row', alignItems: 'center' },
  axisLabel: { flex: 1, textAlign: 'center' },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLow,
  },
  deltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.successContainer,
  },

  planTitle: { marginTop: spacing.xs },
  planBody: { marginTop: 2 },
  targetChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: '#F3F4F6',
  },
  progressBlock: { gap: spacing.sm, marginTop: spacing.sm },
  segments: { flexDirection: 'row', gap: 6, height: 8 },
  segment: { flex: 1, borderRadius: radius.pill, backgroundColor: colors.divider },
  segmentDone: { backgroundColor: colors.primaryContainer },

  milestones: { gap: spacing.md, marginTop: spacing.sm },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  milestoneDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneDotDone: { borderColor: colors.primaryContainer, backgroundColor: colors.primaryContainer },
  milestoneDotLocked: { borderColor: colors.borderIdle },
  milestoneText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  milestoneChip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },

  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 40,
    marginTop: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
  },

  certGrid: { flexDirection: 'row', gap: spacing.sm + 4 },
  certCard: { flex: 1, gap: spacing.xs },
  certIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  certNote: { marginTop: 1 },
  certFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLow,
  },
  certChip: { paddingHorizontal: spacing.sm, paddingVertical: 1, borderRadius: radius.sm },

  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    padding: spacing.md,
  },
  sessionBody: { flex: 1, gap: 2 },
  sessionTrailing: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sessionChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: '#F3F4F6',
  },
  rowDivider: { height: 1, backgroundColor: colors.divider },
});
