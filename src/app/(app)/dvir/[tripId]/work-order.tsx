import { router, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import {
  Badge,
  BottomBar,
  Button,
  Card,
  EmptyState,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { useDvirForm } from '@/hooks/useDvirForm';
import { useTrip } from '@/hooks/useTrip';
import { formatDateTime, formatTime } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

type Tone = 'success' | 'warning' | 'info' | 'idle';

const TONE_COLOR: Record<Tone, { fg: string; bg: string }> = {
  success: { fg: colors.success, bg: colors.successContainer },
  warning: { fg: colors.warning, bg: colors.warningContainer },
  info: { fg: colors.primaryContainer, bg: colors.infoContainer },
  idle: { fg: colors.textSecondary, bg: colors.neutralContainer },
};

export default function DvirWorkOrderScreen() {
  const { tripId, type } = useLocalSearchParams<{ tripId: string; type?: string }>();
  const inspectionType: 'pre' | 'post' = type === 'post' ? 'post' : 'pre';

  const { trip, vehicle, driver } = useTrip(tripId);
  const { inspection } = useDvirForm(tripId, inspectionType);

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Work Order" onBack />
        <EmptyState
          icon="error"
          title="Work order tidak ditemukan"
          description="Kembali dan ulangi inspeksi DVIR."
        />
      </Screen>
    );
  }

  const workOrder = trip.code.replace('TRP', 'WO');
  const submittedAt = inspection?.submittedAt ?? new Date().toISOString();
  const failures = (inspection?.items ?? []).filter((item) => item.result === 'fail');
  const photos = failures.filter((item) => item.photoUri);

  const timeline: { label: string; sub?: string; time: string; tone: Tone; icon: IconName | null }[] = [
    {
      label: 'DVIR terkirim',
      sub: `Pengemudi: ${driver?.name ?? 'Pengemudi'}`,
      time: formatTime(submittedAt),
      tone: 'info',
      icon: 'check',
    },
    {
      label: 'Work order dibuat otomatis',
      sub: 'Sistem Logistik FleetOps',
      time: formatTime(submittedAt),
      tone: 'warning',
      icon: 'workOrder',
    },
    {
      label: 'Dispatcher diberi tahu',
      sub: 'Notifikasi push dikirim',
      time: formatTime(submittedAt),
      tone: 'info',
      icon: 'notifications',
    },
    {
      label: 'Penugasan teknisi',
      sub: 'Dalam antrean perbaikan',
      time: 'Menunggu',
      tone: 'idle',
      icon: null,
    },
  ];

  return (
    <Screen>
      <ScreenHeader title="Work Order" onBack />

      <ScreenBody bottomPadding={150}>
        {/* Work order identity */}
        <Card shadow>
          <View style={styles.heroTop}>
            <View style={styles.heroIdentity}>
              <View style={styles.heroIcon}>
                <Icon name="workOrder" size={22} color={colors.warning} />
              </View>
              <View>
                <Text variant="labelSm" color="textMuted" style={styles.tracked}>
                  WORK ORDER OTOMATIS
                </Text>
                <Text variant="headlineMd">{workOrder}</Text>
              </View>
            </View>
            <Badge label="Menunggu Perbaikan" tone="warning" />
          </View>
          <Text variant="caption" color="textSecondary" style={styles.heroNote}>
            Dibuat otomatis dari DVIR {inspectionType === 'pre' ? 'pre-trip' : 'post-trip'} •{' '}
            {formatDateTime(submittedAt)}
          </Text>
        </Card>

        {/* Unit */}
        <Card>
          <View style={styles.unitRow}>
            <View style={styles.unitIcon}>
              <Icon name="truck" size={24} color={colors.primaryContainer} />
            </View>
            <View style={styles.flex}>
              <Text variant="bodyBold">{vehicle?.plate ?? '—'}</Text>
              <Text variant="labelMd" color="secondary">
                {vehicle?.model ?? '—'} • {trip.code}
              </Text>
            </View>
            <Badge label="Diblokir" tone="critical" dot />
          </View>
        </Card>

        {/* Impact */}
        <View style={styles.warnPanel}>
          <Icon name="warning" size={24} color={colors.warning} />
          <View style={styles.flex}>
            <Text variant="titleMd" color="#92400E">
              Unit diblokir dari assignment
            </Text>
            <Text variant="caption" color="#B45309" style={styles.panelBody}>
              Perbaikan wajib selesai sebelum unit dapat menerima trip baru. Trip berjalan tetap
              dapat diselesaikan.
            </Text>
          </View>
        </View>

        {/* Reported defects */}
        <Text variant="labelSm" color="textSecondary" style={[styles.tracked, styles.sectionTitle]}>
          DEFECT DILAPORKAN
        </Text>
        <Card padded={false} shadow>
          {failures.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text variant="caption" color="textSecondary">
                Tidak ada item gagal pada inspeksi ini.
              </Text>
            </View>
          ) : (
            failures.map((item, index) => (
              <View key={item.id}>
                <View style={styles.defectRow}>
                  <View style={styles.defectIcon}>
                    <Icon name="defect" size={18} color={colors.critical} />
                  </View>
                  <View style={styles.flex}>
                    <Text variant="bodyBold">{item.label}</Text>
                    <Text variant="labelSm" color="textSecondary">
                      {item.group}
                    </Text>
                    {item.note ? (
                      <Text variant="caption" color="textMuted" style={styles.defectNote}>
                        {item.note}
                      </Text>
                    ) : null}
                  </View>
                  <Badge label="Gagal" tone="critical" />
                </View>
                {index < failures.length - 1 ? <View style={styles.rowDivider} /> : null}
              </View>
            ))
          )}
        </Card>

        {/* Photo evidence */}
        {photos.length > 0 ? (
          <View style={styles.evidence}>
            <View style={styles.rowBetween}>
              <Text variant="labelMd" color="textMuted" style={styles.tracked}>
                BUKTI KONDISI
              </Text>
              <Text variant="labelMd" color="textSecondary">
                {photos.length} Lampiran Foto
              </Text>
            </View>
            <View style={styles.evidenceGrid}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.evidenceCard}>
                  <Image
                    source={{ uri: photo.photoUri }}
                    style={styles.evidenceImage}
                    resizeMode="cover"
                  />
                  <Text variant="labelMd" numberOfLines={1} style={styles.evidenceLabel}>
                    {photo.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Activity */}
        <Card>
          <Text variant="labelSm" color="textMuted" style={[styles.tracked, styles.cardLabel]}>
            AKTIVITAS
          </Text>
          <View style={styles.timeline}>
            <View style={styles.timelineRail} />
            {timeline.map((event) => (
              <View key={event.label} style={styles.timelineRow}>
                <View style={[styles.timelineDot, { backgroundColor: TONE_COLOR[event.tone].bg }]}>
                  {event.icon ? (
                    <Icon name={event.icon} size={14} color={TONE_COLOR[event.tone].fg} />
                  ) : (
                    <View
                      style={[styles.timelineDotInner, { backgroundColor: TONE_COLOR.idle.fg }]}
                    />
                  )}
                </View>
                <View style={styles.flex}>
                  <Text
                    variant="caption"
                    color={event.tone === 'idle' ? 'textSecondary' : 'ink'}
                    style={styles.timelineLabel}
                  >
                    {event.label}
                  </Text>
                  {event.sub ? (
                    <Text variant="micro" color="textMuted">
                      {event.sub}
                    </Text>
                  ) : null}
                </View>
                <Text variant="labelMd" color={event.tone === 'idle' ? 'textMuted' : 'textSecondary'}>
                  {event.time}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </ScreenBody>

      <BottomBar>
        <Button label="Lihat Kendaraan Saya" icon="truck" onPress={() => router.push('/vehicle')} />
        <Button
          label="Kembali ke Beranda"
          variant="ghost"
          onPress={() => {
            if (router.canDismiss()) router.dismissAll();
            else router.navigate('/(app)/(tabs)');
          }}
        />
      </BottomBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  cardLabel: { marginBottom: spacing.md },
  rowDivider: { height: 1, backgroundColor: colors.divider },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  heroIdentity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4, flex: 1 },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningContainer,
  },
  heroNote: { marginTop: spacing.md },

  unitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  unitIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },

  warnPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.warningContainer,
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.25)',
  },
  panelBody: { marginTop: 2 },

  emptyRow: { padding: spacing.md },
  defectRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
    padding: spacing.md,
  },
  defectIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.criticalContainer,
  },
  defectNote: { marginTop: 2 },

  evidence: { marginTop: spacing.lg, gap: spacing.sm },
  evidenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  evidenceCard: {
    width: '47%',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  evidenceImage: { width: '100%', height: 96, backgroundColor: colors.surfaceContainer },
  evidenceLabel: { padding: spacing.sm },

  timeline: { position: 'relative' },
  timelineRail: {
    position: 'absolute',
    left: 15,
    top: 6,
    bottom: 6,
    width: 2,
    backgroundColor: colors.divider,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotInner: { width: 8, height: 8, borderRadius: 4 },
  timelineLabel: { marginBottom: 1 },
});
