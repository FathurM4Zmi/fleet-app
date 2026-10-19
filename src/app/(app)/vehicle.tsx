import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import {
  Badge,
  BottomBar,
  Button,
  Card,
  ProgressRing,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { vehicleDetail } from '@/data/fixtures';
import { useAppStore } from '@/store/app';
import { colors, radius, spacing } from '@/theme';
import type { DocumentStatus } from '@/data/types';

const DOC_TONE: Record<DocumentStatus, 'success' | 'warning' | 'critical'> = {
  valid: 'success',
  expiring: 'warning',
  expired: 'critical',
};

const DOC_ICON: Record<string, IconName> = {
  stnk: 'document',
  kir: 'checklist',
  asuransi: 'shield',
};

export default function VehicleScreen() {
  const { state } = useAppStore();
  const detail = vehicleDetail;
  const vehicle = state.vehicles.find((entry) => entry.id === detail.vehicleId);

  return (
    <Screen>
      <ScreenHeader
        title="Kendaraan Saya"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Sinkronisasi" hitSlop={8}>
            <Icon name="sync" size={22} color={colors.onSurfaceVariant} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={140}>
        {/* Header */}
        <Card padded={false} shadow>
          <View style={styles.headerRow}>
            <View style={styles.truckTile}>
              <Icon name="truck" size={44} color={colors.primary} />
              <View style={styles.truckBadge}>
                <Text variant="labelSm">CDD</Text>
              </View>
            </View>
            <View style={styles.flex}>
              <Text variant="headlineSm">{vehicle?.plate ?? '—'}</Text>
              <Text variant="bodyMd" color="onSurfaceVariant" style={styles.model}>
                {vehicle?.model ?? '—'} 2.5 Ton
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <MetaCell label="Bahan Bakar" value={detail.fuelType} />
            <MetaCell label="Transmisi" value={detail.transmission} />
            <MetaCell label="Tahun" value={detail.year} />
          </View>
        </Card>

        {/* Health ring */}
        <Card shadow style={styles.healthCard}>
          <ProgressRing value={detail.healthScore} size={64} strokeWidth={5} color={colors.success} suffix="/100" />
          <View style={styles.flex}>
            <Text variant="bodyBold">Skor Kesehatan Kendaraan</Text>
            <Text variant="caption" color="secondary" style={styles.healthNote}>
              {detail.healthNote}
            </Text>
            <View style={styles.healthDelta}>
              <Icon name="trendingUp" size={14} color={colors.success} />
              <Text variant="labelSm" color="success">
                {detail.healthDelta}
              </Text>
            </View>
          </View>
        </Card>

        {/* Specs */}
        <View style={styles.section}>
          <SectionLabel>SPESIFIKASI</SectionLabel>
          <Card padded={false} shadow style={styles.overflow}>
            {detail.specs.map((spec, index) => {
              const isOdometer = spec.label === 'Odometer terakhir';
              const content = (
                <View style={styles.specRow}>
                  <Text variant="bodyMd" color="secondary">
                    {spec.label}
                  </Text>
                  <View style={styles.specRight}>
                    <Text variant={isOdometer ? 'bodyBold' : 'titleMd'}>{spec.value}</Text>
                    {isOdometer ? <Icon name="forward" size={16} color={colors.secondary} /> : null}
                  </View>
                </View>
              );

              return (
                <View key={spec.label}>
                  {isOdometer ? (
                    <Pressable
                      onPress={() => router.push('/vehicle/odometer')}
                      accessibilityRole="button"
                      style={({ pressed }) => pressed && styles.pressed}
                    >
                      {content}
                    </Pressable>
                  ) : (
                    content
                  )}
                  {index < detail.specs.length - 1 ? <View style={styles.divider} /> : null}
                </View>
              );
            })}
          </Card>
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text variant="labelMd" color="textSecondary" style={styles.upper}>
              DOKUMEN
            </Text>
            <Text variant="labelSm" color="textSecondary">
              {detail.documents.length} Terdaftar
            </Text>
          </View>
          <Card padded={false} shadow style={styles.overflow}>
            {detail.documents.map((document, index) => {
              const tone = DOC_TONE[document.status];
              const expiring = document.status !== 'valid';
              return (
                <View key={document.key}>
                  <View style={styles.docRow}>
                    <View
                      style={[
                        styles.docIcon,
                        expiring && { backgroundColor: colors.warningContainer },
                      ]}
                    >
                      <Icon
                        name={DOC_ICON[document.key] ?? 'document'}
                        size={18}
                        color={expiring ? colors.warning : colors.primary}
                      />
                    </View>
                    <View style={styles.flex}>
                      <Text variant="bodyBold">{document.label}</Text>
                      <Text variant="labelMd" color="secondary" numberOfLines={1}>
                        {document.note}
                      </Text>
                    </View>
                    <Badge label={document.statusLabel} tone={tone} />
                  </View>
                  {index < detail.documents.length - 1 ? <View style={styles.divider} /> : null}
                </View>
              );
            })}
          </Card>
        </View>

        {/* Maintenance */}
        <View style={styles.section}>
          <SectionLabel>RIWAYAT PERAWATAN</SectionLabel>
          <Card padded={false} shadow style={styles.overflow}>
            {detail.maintenance.map((record, index) => (
              <View key={record.key}>
                <View style={styles.docRow}>
                  <View
                    style={[
                      styles.docIcon,
                      record.upcoming && { backgroundColor: '#E6EDFD' },
                    ]}
                  >
                    <Icon
                      name={record.upcoming ? 'repeat' : index === 1 ? 'tire' : 'workOrder'}
                      size={18}
                      color={record.upcoming ? '#1D4ED8' : colors.secondary}
                    />
                  </View>
                  <View style={styles.flex}>
                    <Text
                      variant="labelSm"
                      color={record.upcoming ? 'primaryContainer' : 'textSecondary'}
                      style={styles.upper}
                    >
                      {record.code}
                    </Text>
                    <Text variant="bodyBold" numberOfLines={1}>
                      {record.title}
                    </Text>
                    <Text variant="labelMd" color="secondary">
                      {record.date}
                    </Text>
                  </View>
                  <View style={[styles.statusChip, record.upcoming && styles.statusChipUpcoming]}>
                    <Text
                      variant="labelMd"
                      color={record.upcoming ? '#1D4ED8' : 'onSurfaceVariant'}
                    >
                      {record.statusLabel}
                    </Text>
                  </View>
                </View>
                {index < detail.maintenance.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </Card>
        </View>
      </ScreenBody>

      <BottomBar>
        <Button label="Laporkan Kerusakan" icon="warning" onPress={() => router.push('/damage')} />
      </BottomBar>
    </Screen>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaCell}>
      <Text variant="labelSm" color="secondary" style={styles.upper}>
        {label}
      </Text>
      <Text variant="bodyMd">{value}</Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text variant="labelMd" color="textSecondary" style={[styles.upper, styles.sectionTitle]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },
  pressed: { opacity: 0.85 },
  overflow: { overflow: 'hidden' },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md + 2, padding: spacing.lg },
  truckTile: {
    width: 80,
    height: 80,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  truckBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  model: { marginTop: 2, marginBottom: spacing.sm },

  metaRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
  },
  metaCell: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: spacing.sm + 2 },

  healthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  healthNote: { marginTop: 2 },
  healthDelta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.successContainer,
    borderWidth: 1,
    borderColor: 'rgba(18,128,92,0.2)',
  },

  section: { marginTop: spacing.lg, gap: spacing.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { paddingHorizontal: 2 },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  specRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  docIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  divider: { height: 1, backgroundColor: colors.divider },
  statusChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  statusChipUpcoming: { backgroundColor: '#E6EDFD', borderColor: '#BFD5FA' },
});
