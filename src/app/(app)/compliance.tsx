import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Button, Card, Screen, ScreenBody, ScreenHeader, Text } from '@/components/ui';
import { toChecklist, toComplianceDocuments, toIncidents } from '@/data/adapters';
import type { DocumentStatus } from '@/data/types';
import { useCompliance, useDocuments } from '@/hooks/api/useDriverData';
import { colors, radius, spacing } from '@/theme';

const DOC_ICON: Record<string, IconName> = {
  sim: 'idCard',
  homolog: 'verified',
  'safety-training': 'health',
};

const DOC_TONE: Record<DocumentStatus, { fg: string; bg: string }> = {
  valid: { fg: colors.success, bg: colors.successContainer },
  expiring: { fg: colors.warning, bg: colors.warningContainer },
  expired: { fg: colors.critical, bg: colors.criticalContainer },
};

export default function ComplianceScreen() {
  const complianceQuery = useCompliance();
  const documentsQuery = useDocuments();

  const complianceDocuments = toComplianceDocuments(documentsQuery.data ?? []);
  const complianceChecklist = complianceQuery.data ? toChecklist(complianceQuery.data) : [];
  const incidents = complianceQuery.data ? toIncidents(complianceQuery.data) : [];

  const done = complianceChecklist.filter((item) => item.done).length;
  const complianceProgress = { done, total: complianceChecklist.length };
  const percent = complianceChecklist.length
    ? Math.round((done / complianceChecklist.length) * 100)
    : 0;

  return (
    <Screen>
      <ScreenHeader
        title="Kepatuhan"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Bantuan" hitSlop={8}>
            <Icon name="help" size={22} color={colors.secondary} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={spacing.xxl}>
        <Text variant="caption" color="onSurfaceVariant" style={styles.ribbon}>
          Status dokumen pengemudi &amp; kepatuhan armada.
        </Text>

        <View style={styles.docs}>
          {complianceDocuments.map((document) => {
            const tone = DOC_TONE[document.status];

            return (
              <Card key={document.key} shadow style={styles.docCard}>
                <View style={styles.docLeft}>
                  <View style={[styles.docIcon, { backgroundColor: tone.bg }]}>
                    <Icon name={DOC_ICON[document.key] ?? 'document'} size={22} color={tone.fg} />
                  </View>
                  <View style={styles.docText}>
                    <Text variant="labelLg">{document.title}</Text>
                    <Text variant="labelSm" color="textSecondary" style={styles.docNote}>
                      {document.note}
                    </Text>
                  </View>
                </View>

                <View style={[styles.statusChip, { backgroundColor: tone.bg, borderColor: tone.fg }]}>
                  <View style={[styles.statusDot, { backgroundColor: tone.fg }]} />
                  <Text variant="labelSm" style={{ color: tone.fg }}>
                    {document.statusLabel}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>

        <Text variant="labelSm" color="textSecondary" style={[styles.tracked, styles.sectionTitle]}>
          CHECKLIST KEPATUHAN
        </Text>

        <Card shadow>
          <View style={styles.checklist}>
            {complianceChecklist.map((item) => (
              <View key={item.key} style={styles.checkRow}>
                <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                  {item.done ? <Icon name="check" size={15} color={colors.onPrimary} /> : null}
                </View>
                <Text variant="labelMd">{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text variant="labelSm" color="textSecondary">
              Progres Kepatuhan
            </Text>
            <Text variant="labelSm" color="textSecondary">
              {complianceProgress.done} dari {complianceProgress.total} selesai
            </Text>
          </View>

          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${percent}%` }]} />
          </View>
        </Card>

        <Text variant="labelSm" color="textSecondary" style={[styles.tracked, styles.sectionTitle]}>
          LAPOR INSIDEN
        </Text>

        <Card shadow style={styles.incidentCard}>
          <Text variant="caption" color="textSecondary">
            Laporkan insiden keselamatan. Laporan bersifat immutable setelah dikirim.
          </Text>
          <Button
            label="Laporkan Insiden"
            icon="warning"
            onPress={() => router.push('/compliance/incident')}
          />
        </Card>

        <Text variant="labelSm" color="textSecondary" style={[styles.tracked, styles.sectionTitle]}>
          RIWAYAT INSIDEN
        </Text>

        <Card padded={false} shadow>
          {incidents.map((incident, index) => (
            <View key={incident.key}>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.incidentRow, pressed && styles.pressed]}
              >
                <View style={styles.incidentBody}>
                  <Text variant="labelSm" color="textSecondary">
                    {incident.date}
                  </Text>
                  <Text variant="labelLg">{incident.title}</Text>
                </View>

                <View style={styles.incidentTrailing}>
                  <View style={styles.incidentChip}>
                    <Text variant="labelSm" color="onSurfaceVariant">
                      {incident.status}
                    </Text>
                  </View>
                  <Icon name="forward" size={18} color={colors.outlineVariant} />
                </View>
              </Pressable>

              {index < incidents.length - 1 ? <View style={styles.rowDivider} /> : null}
            </View>
          ))}
        </Card>

        <View style={styles.syncFooter}>
          <Icon name="cloudDone" size={15} color={colors.success} />
          <Text variant="labelSm" color="textSecondary">
            Data tersinkronisasi 1 menit yang lalu
          </Text>
        </View>
      </ScreenBody>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },
  pressed: { opacity: 0.85 },
  ribbon: { marginBottom: spacing.md },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },

  docs: { gap: spacing.sm + 4 },
  docCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  docLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4, flex: 1 },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docText: { flex: 1 },
  docNote: { marginTop: 1 },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },

  checklist: { gap: spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2, minHeight: 32 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { borderColor: colors.primaryContainer, backgroundColor: colors.primaryContainer },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  track: {
    height: 6,
    marginTop: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
    overflow: 'hidden',
  },
  trackFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primaryContainer },

  incidentCard: { gap: spacing.md },

  incidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    padding: spacing.md,
  },
  incidentBody: { flex: 1, gap: 2 },
  incidentTrailing: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  incidentChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceContainer,
  },
  rowDivider: { height: 1, backgroundColor: colors.divider },

  syncFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
});
