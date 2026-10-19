import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  BottomBar,
  Button,
  Card,
  ProgressRing,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
  TrendChart,
} from '@/components/ui';
import { dnaSummary } from '@/data/fixtures';
import { scoreTone } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

export default function DnaScreen() {
  const tone = scoreTone(dnaSummary.score);
  const ringColor = tone === 'success' ? colors.success : colors.warning;

  return (
    <Screen>
      <ScreenHeader
        title="DNA Saya"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Bantuan dan info" hitSlop={8}>
            <Icon name="info" size={22} color={colors.secondary} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={spacing.xxl * 2}>
        <Card shadow style={styles.hero}>
          <View style={styles.heroRow}>
            <ProgressRing
              value={dnaSummary.score}
              size={128}
              strokeWidth={10}
              color={ringColor}
              caption="Skor Indeks"
            />

            <View style={styles.heroChips}>
              <View style={styles.deltaPill}>
                <Icon name="arrowUp" size={16} color={colors.success} />
                <Text variant="labelLg" color="success">
                  +{dnaSummary.delta}
                </Text>
              </View>

              <View style={styles.neutralPill}>
                <Text variant="labelMd" color="textSecondary">
                  {dnaSummary.weeksTracked} minggu
                </Text>
              </View>

              <View style={styles.tierRow}>
                <Icon name="verified" size={14} color={colors.success} />
                <Text variant="labelSm" color="success">
                  {dnaSummary.tier}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.heroFooter}>
            <Text variant="bodyBold">DNA Kesehatan Driver</Text>
            <Text variant="caption" color="textSecondary" style={styles.heroSub}>
              Performa operasional dan keselamatan berkendara
            </Text>
          </View>
        </Card>

        <Card shadow style={styles.section}>
          <View style={styles.rowBetween}>
            <Text variant="labelSm" color="textMuted" style={styles.tracked}>
              TREN {dnaSummary.weeksTracked} MINGGU
            </Text>
            <View style={styles.risingChip}>
              <Text variant="labelSm" color="success">
                Konsisten Naik
              </Text>
            </View>
          </View>

          <View style={styles.chartWrap}>
            <TrendChart
              height={144}
              reference={dnaSummary.fleetAverage}
              series={[
                {
                  key: 'score',
                  color: colors.success,
                  values: dnaSummary.trend.map((point) => point.score),
                  filled: true,
                },
              ]}
            />

            <View style={styles.referenceRow}>
              <View style={styles.referenceLeft}>
                <View style={styles.referenceSwatch} />
                <Text variant="labelSm" color="textSecondary">
                  Rata-rata fleet {dnaSummary.fleetAverage}
                </Text>
              </View>
              <Text variant="labelSm" color="success">
                Skor Terkini: {dnaSummary.score}
              </Text>
            </View>

            <View style={styles.axis}>
              {dnaSummary.trend.map((point, index) => {
                const latest = index === dnaSummary.trend.length - 1;
                return (
                  <Text
                    key={point.label}
                    variant="labelSm"
                    color={latest ? 'ink' : 'textMuted'}
                    style={styles.axisLabel}
                  >
                    {latest ? `${point.label} (Kini)` : point.label}
                  </Text>
                );
              })}
            </View>
          </View>
        </Card>

        <Card shadow style={styles.section}>
          <View style={styles.rowBetween}>
            <Text variant="labelSm" color="textMuted" style={styles.tracked}>
              BREAKDOWN KOMPONEN
            </Text>
            <Text variant="labelSm" color="textSecondary">
              {dnaSummary.components.length} Parameter
            </Text>
          </View>

          <View style={styles.components}>
            {dnaSummary.components.map((component) => {
              const componentTone =
                component.tone === 'success' ? colors.success : colors.warning;
              const componentBg =
                component.tone === 'success' ? colors.successContainer : colors.warningContainer;

              return (
                <View key={component.key}>
                  <View style={styles.componentHead}>
                    <Text variant="bodyMd">{component.label}</Text>
                    <View style={styles.componentMeta}>
                      <View style={[styles.bandChip, { backgroundColor: componentBg }]}>
                        <Text variant="labelSm" style={{ color: componentTone }}>
                          {component.band}
                        </Text>
                      </View>
                      <Text variant="bodyBold" style={{ color: componentTone }}>
                        {component.score}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.track}>
                    <View
                      style={[
                        styles.trackFill,
                        { width: `${component.score}%`, backgroundColor: componentTone },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        <Card shadow style={styles.section}>
          <Text variant="labelSm" color="textMuted" style={[styles.tracked, styles.insightTitle]}>
            KENAPA SKOR TURUN
          </Text>

          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <Icon name="trendingDown" size={20} color={colors.warning} />
            </View>
            <View style={styles.insightBody}>
              <Text variant="bodyBold" color="warning">
                {dnaSummary.insight.title}
              </Text>
              <Text variant="caption" color="warning" style={styles.insightText}>
                {dnaSummary.insight.body}
              </Text>
            </View>
          </View>
        </Card>
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

const styles = StyleSheet.create({
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },

  syncRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  syncLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  syncDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },

  hero: { marginTop: spacing.md, gap: spacing.md },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heroChips: { flex: 1, gap: spacing.sm, paddingLeft: spacing.sm },
  deltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#B6E4D3',
    backgroundColor: colors.successContainer,
  },
  neutralPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: '#F3F4F6',
  },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  heroFooter: {
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLow,
  },
  heroSub: { marginTop: 2 },

  section: { marginTop: spacing.md, gap: spacing.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  risingChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.successContainer,
  },
  chartWrap: { gap: spacing.sm },
  referenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  referenceLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  referenceSwatch: {
    width: 16,
    height: 0,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderBottomColor: colors.textMuted,
  },
  axis: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLow,
  },
  axisLabel: { flex: 1, textAlign: 'center' },

  components: { gap: spacing.md },
  componentHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: 6,
  },
  componentMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bandChip: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: radius.sm },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.divider, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: radius.pill },

  insightTitle: { marginBottom: spacing.md },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: colors.warningContainer,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
  },
  insightBody: { flex: 1 },
  insightText: { marginTop: spacing.xs },
});
