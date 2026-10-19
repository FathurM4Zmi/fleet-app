import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { Badge, Button, Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { useDvirForm } from '@/hooks/useDvirForm';
import { useTrip } from '@/hooks/useTrip';
import { estimatedDurationHours, formatNumber, formatTime } from '@/lib/format';
import { useAppStore } from '@/store/app';
import { colors, radius, spacing } from '@/theme';

type Tone = 'success' | 'warning' | 'info' | 'idle';

const TONE_COLOR: Record<Tone, { fg: string; bg: string }> = {
  success: { fg: colors.success, bg: colors.successContainer },
  warning: { fg: colors.warning, bg: colors.warningContainer },
  info: { fg: colors.primaryContainer, bg: colors.infoContainer },
  idle: { fg: colors.textSecondary, bg: colors.neutralContainer },
};

export default function DvirSubmittedScreen() {
  const { tripId, result, type } = useLocalSearchParams<{
    tripId: string;
    result?: string;
    type?: string;
  }>();

  const inspectionType: 'pre' | 'post' = type === 'post' ? 'post' : 'pre';
  const { trip, vehicle, driver } = useTrip(tripId);
  const { inspection } = useDvirForm(tripId, inspectionType);
  const { state } = useAppStore();
  const insets = useSafeAreaInsets();

  const failed = result === 'failed';

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Laporan DVIR" onBack />
        <EmptyState icon="error" title="Laporan tidak ditemukan" description="Kembali dan ulangi inspeksi." />
      </Screen>
    );
  }

  const reportNo = trip.code.replace('TRP', 'DVIR');
  const workOrder = trip.code.replace('TRP', 'WO');
  const submittedAt = inspection?.submittedAt ?? new Date().toISOString();
  const submittedTime = formatTime(submittedAt);
  const photos = (inspection?.items ?? []).filter((item) => item.result === 'fail' && item.photoUri);

  const completedTrips = state.trips.filter((entry) => entry.status === 'completed');
  const totalKm = completedTrips.reduce((sum, entry) => sum + entry.distanceKm, 0);
  const totalHours = completedTrips.reduce(
    (sum, entry) => sum + estimatedDurationHours(entry.distanceKm),
    0,
  );

  const goHome = () => {
    if (router.canDismiss()) router.dismissAll();
    else router.navigate('/(app)/(tabs)');
  };

  return (
    <Screen>
      <ScreenHeader
        title={failed ? 'DVIR Laporkan' : 'DVIR Selesai'}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tutup"
            hitSlop={8}
            onPress={goHome}
          >
            <Icon name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={[styles.halo, failed ? styles.haloWarning : styles.haloSuccess]}>
            <View style={[styles.haloInner, { backgroundColor: failed ? colors.warning : colors.success }]}>
              <Icon name="check" size={28} color={colors.onPrimary} />
            </View>
          </View>
          <Text variant="headlineMd">Laporan DVIR terkirim</Text>
          <Text variant="caption" color="textSecondary" style={styles.bannerSub}>
            {failed ? 'Menunggu tinjauan supervisor' : 'Semua item lolos'} • {submittedTime}
          </Text>
        </View>

        {/* Reference */}
        <Card>
          <View style={styles.refTop}>
            <View style={styles.flex}>
              <Text variant="labelSm" color="textMuted" style={styles.tracked}>
                NOMOR LAPORAN
              </Text>
              <Text variant="headlineMd">{reportNo}</Text>
            </View>
            <Badge
              label={failed ? `${inspectionType === 'pre' ? 'Pre' : 'Post'}-Trip Gagal` : `${inspectionType === 'pre' ? 'Pre' : 'Post'}-Trip`}
              tone={failed ? 'warning' : 'success'}
            />
          </View>
          <View style={styles.refBottom}>
            <View style={styles.plateRow}>
              <View style={styles.plateIcon}>
                <Icon name="truck" size={16} color={colors.primaryContainer} />
              </View>
              <Text variant="bodyBold">{vehicle?.plate ?? '—'}</Text>
            </View>
            <Badge label={failed ? 'Menunggu Tinjauan' : 'Disetujui'} tone={failed ? 'warning' : 'success'} />
          </View>
        </Card>

        {/* Outcome panel */}
        {failed ? (
          <View style={styles.warnPanel}>
            <Icon name="warning" size={24} color={colors.warning} />
            <View style={styles.flex}>
              <Text variant="titleMd" color="#92400E">
                Kendaraan Anda diblokir dari assignment
              </Text>
              <Text variant="caption" color="#B45309" style={styles.panelBody}>
                Perbaikan wajib selesai sebelum menerima trip baru. Trip berjalan tetap dapat
                diselesaikan.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.successPanel}>
            <View style={styles.successIcon}>
              <Icon name="verified" size={18} color={colors.onPrimary} />
            </View>
            <View style={styles.flex}>
              <Text variant="bodyBold" color={colors.success}>
                Tidak ada defect ditemukan
              </Text>
              <Text variant="caption" color="#0F6548" style={styles.panelBody}>
                Kendaraan tetap dapat digunakan untuk assignment besok.
              </Text>
            </View>
          </View>
        )}

        {/* Work order (failed only) */}
        {failed ? (
          <Card
            onPress={() =>
              router.push({
                pathname: '/dvir/[tripId]/work-order',
                params: { tripId, type: inspectionType },
              })
            }
          >
            <View style={styles.woTop}>
              <View style={styles.woIdentity}>
                <View style={styles.woIcon}>
                  <Icon name="workOrder" size={20} color={colors.warning} />
                </View>
                <View>
                  <Text variant="labelSm" color="textMuted" style={styles.tracked}>
                    WORK ORDER OTOMATIS
                  </Text>
                  <Text variant="headlineSm">{workOrder}</Text>
                </View>
              </View>
              <Badge label="Menunggu Perbaikan" tone="warning" />
            </View>
            <View style={styles.woFooter}>
              <Text variant="caption" color="textMuted">
                Dibuat otomatis • Estimasi selesai besok
              </Text>
              <Icon name="forward" size={18} color={colors.textMuted} />
            </View>
          </Card>
        ) : null}

        {/* Photo evidence (failed only) */}
        {failed && photos.length > 0 ? (
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
                  <Image source={{ uri: photo.photoUri }} style={styles.evidenceImage} resizeMode="cover" />
                  <View style={styles.evidenceTag}>
                    <View style={styles.evidenceDot} />
                    <Text variant="labelSm" color="#991B1B">
                      KRITIS
                    </Text>
                  </View>
                  <Text variant="labelMd" numberOfLines={1} style={styles.evidenceLabel}>
                    {photo.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Odometer summary (post-trip, success) */}
        {!failed && inspectionType === 'post' ? (
          <Card>
            <Text variant="labelSm" color="textMuted" style={styles.tracked}>
              PENCATATAN KILOMETER
            </Text>
            <View style={styles.odoRow}>
              <Text variant="displayLg">
                {formatNumber(inspection?.odometerKm ?? 0)}{' '}
                <Text variant="caption" color="textSecondary">
                  km
                </Text>
              </Text>
            </View>
            <Text variant="caption" color="textMuted">
              Tercatat sebagai acuan inspeksi berikutnya.
            </Text>
          </Card>
        ) : null}

        {/* Day summary (success only) */}
        {!failed ? (
          <Card>
            <Text variant="labelSm" color="textMuted" style={[styles.tracked, styles.cardLabel]}>
              RINGKASAN HARI INI
            </Text>
            <SummaryRow label="Trip diselesaikan" value={`${completedTrips.length} trip`} divider />
            <SummaryRow label="Total jarak" value={`${formatNumber(totalKm)} km`} divider />
            <SummaryRow label="BBM diisi" value={`${formatNumber(Math.round(totalKm * 0.28))} Liter`} divider />
            <SummaryRow label="Jam kerja" value={`${totalHours} jam`} />
          </Card>
        ) : null}

        {/* Activity timeline */}
        <Card>
          <Text variant="labelSm" color="textMuted" style={[styles.tracked, styles.cardLabel]}>
            AKTIVITAS
          </Text>
          <View style={styles.timeline}>
            <View style={styles.timelineRail} />
            {(failed
              ? [
                  { label: 'DVIR terkirim', sub: `Pengemudi: ${driver.name}`, time: submittedTime, tone: 'info' as Tone, icon: 'check' as IconName },
                  { label: 'Work order dibuat otomatis', sub: 'Sistem Logistik FleetOps', time: submittedTime, tone: 'warning' as Tone, icon: 'workOrder' as IconName },
                  { label: 'Supervisor diberi tahu', sub: 'Notifikasi push dikirim', time: submittedTime, tone: 'info' as Tone, icon: 'notifications' as IconName },
                  { label: 'Tinjauan supervisor', sub: 'Dalam antrean verifikasi', time: 'Menunggu', tone: 'idle' as Tone, icon: null },
                ]
              : [
                  { label: 'Laporan terkirim', sub: undefined, time: submittedTime, tone: 'success' as Tone, icon: 'check' as IconName },
                  { label: 'Nilai keamanan harian diperbarui', sub: undefined, time: submittedTime, tone: 'success' as Tone, icon: 'check' as IconName },
                  { label: 'Rekap shift dikirim ke supervisor', sub: undefined, time: submittedTime, tone: 'info' as Tone, icon: 'check' as IconName },
                ]
            ).map((event) => (
              <View key={event.label} style={styles.timelineRow}>
                <View style={[styles.timelineDot, { backgroundColor: TONE_COLOR[event.tone].bg }]}>
                  {event.icon ? (
                    <Icon name={event.icon} size={14} color={TONE_COLOR[event.tone].fg} />
                  ) : (
                    <View style={[styles.timelineDotInner, { backgroundColor: TONE_COLOR.idle.fg }]} />
                  )}
                </View>
                <View style={styles.flex}>
                  <Text variant="caption" color={event.tone === 'idle' ? 'textSecondary' : 'ink'} style={styles.timelineLabel}>
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
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label={failed ? 'Kembali ke Beranda' : 'Selesai dan Kembali ke Beranda'}
          iconAfter="home"
          onPress={goHome}
        />
        <Button
          label={failed ? 'Lihat Work Order' : 'Lihat Riwayat DVIR'}
          variant="ghost"
          onPress={() =>
            failed
              ? router.push({
                  pathname: '/dvir/[tripId]/work-order',
                  params: { tripId, type: inspectionType },
                })
              : router.push({ pathname: '/dvir/[tripId]/history', params: { tripId } })
          }
        />
      </View>
    </Screen>
  );
}

function SummaryRow({ label, value, divider = false }: { label: string; value: string; divider?: boolean }) {
  return (
    <View style={[styles.summaryRow, divider && styles.summaryDivider]}>
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
      <Text variant="bodyBold">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { gap: spacing.md, paddingHorizontal: spacing.gutter, paddingBottom: spacing.xxl },
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },
  cardLabel: { marginBottom: spacing.md },

  banner: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.md, paddingBottom: spacing.sm },
  halo: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  haloSuccess: { backgroundColor: colors.successContainer },
  haloWarning: { backgroundColor: colors.warningContainer },
  haloInner: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  bannerSub: { textAlign: 'center' },

  refTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  refBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  plateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  plateIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoContainer,
  },

  warnPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FDF1E3',
  },
  successPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#B9E6D5',
    backgroundColor: colors.successContainer,
  },
  successIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
  panelBody: { marginTop: 2 },

  woTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  woIdentity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  woIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningContainer,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  woFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },

  evidence: { gap: spacing.sm },
  evidenceGrid: { flexDirection: 'row', gap: spacing.md },
  evidenceCard: {
    flex: 1,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  evidenceImage: { width: '100%', height: 110, backgroundColor: colors.surfaceContainer },
  evidenceTag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  evidenceDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.critical },
  evidenceLabel: { padding: spacing.sm },

  odoRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginVertical: spacing.xs },

  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  summaryDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },

  timeline: { paddingLeft: spacing.xl, gap: spacing.lg },
  timelineRail: {
    position: 'absolute',
    left: 11,
    top: spacing.sm,
    bottom: spacing.sm,
    width: 2,
    backgroundColor: colors.divider,
  },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  timelineDot: {
    position: 'absolute',
    left: -spacing.xl,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  timelineDotInner: { width: 8, height: 8, borderRadius: 4 },
  timelineLabel: { fontFamily: 'Inter_500Medium' },

  footer: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
