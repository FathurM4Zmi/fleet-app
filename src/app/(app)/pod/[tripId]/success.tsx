import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { Button, Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { usePodForm } from '@/hooks/usePodForm';
import { useTrip } from '@/hooks/useTrip';
import { formatDateTime } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

type Tone = 'success' | 'info' | 'idle';

const TONE_COLOR: Record<Tone, { fg: string; bg: string }> = {
  success: { fg: colors.success, bg: colors.successContainer },
  info: { fg: colors.primaryContainer, bg: colors.infoContainer },
  idle: { fg: colors.textSecondary, bg: colors.neutralContainer },
};

const PHOTO_LABELS = ['Kargo', 'Manifest', 'Segel', 'Kondisi', 'Lainnya'];

export default function PodSuccessScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);
  const { pod, markSynced } = usePodForm(tripId);
  const insets = useSafeAreaInsets();

  // The design shows a synced state; simulate the upload completing on mount.
  useEffect(() => {
    if (pod && pod.syncStatus !== 'synced') markSynced();
  }, [pod, markSynced]);

  const goHome = () => {
    if (router.canDismiss()) router.dismissAll();
    else router.navigate('/(app)/(tabs)');
  };

  if (!trip || !pod) {
    return (
      <Screen>
        <ScreenHeader title="Bukti Pengiriman" onBack />
        <EmptyState
          icon="error"
          title="Bukti belum tersedia"
          description="Ambil bukti pengiriman terlebih dahulu."
        />
      </Screen>
    );
  }

  const podNo = trip.code.replace('TRP', 'POD');
  const time = `${formatDateTime(pod.capturedAt)} WIB`;

  return (
    <Screen>
      <ScreenHeader
        title="FleetOps Driver"
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Tutup" hitSlop={8} onPress={goHome}>
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
          <View style={styles.halo}>
            <View style={styles.haloInner}>
              <Icon name="check" size={28} color={colors.onPrimary} />
            </View>
          </View>
          <Text variant="headlineMd" align="center">
            Bukti Pengiriman Tersimpan
          </Text>
          <View style={styles.lockLine}>
            <Icon name="lock" size={14} color={colors.textSecondary} />
            <Text variant="labelMd" color="textSecondary">
              {podNo} • Terkunci dan tidak dapat diubah
            </Text>
          </View>
        </View>

        {/* Summary */}
        <Card>
          <View style={styles.rowBetween}>
            <Text variant="labelMd" color="textSecondary" style={styles.tracked}>
              FOTO DOKUMENTASI ({pod.photoUris.length})
            </Text>
            <View style={styles.verifiedRow}>
              <Icon name="verified" size={14} color={colors.primaryContainer} />
              <Text variant="labelMd" color="primaryContainer">
                Terverifikasi
              </Text>
            </View>
          </View>

          {pod.photoUris.length > 0 ? (
            <View style={styles.photoGrid}>
              {pod.photoUris.slice(0, 4).map((uri, index) => (
                <View key={uri} style={styles.photoTile}>
                  <Image source={{ uri }} style={styles.photoImage} resizeMode="cover" />
                  <View style={styles.photoLabel}>
                    <Text variant="labelSm" color={colors.onPrimary}>
                      #{index + 1} {PHOTO_LABELS[index] ?? 'Foto'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.summaryDivider} />

          <SummaryRow
            label="Penerima"
            value={pod.recipientName}
            trailing={
              pod.hasSignature ? (
                <View style={styles.ttdChip}>
                  <Icon name="signature" size={13} color={colors.primaryContainer} />
                  <Text variant="labelSm" color="primaryContainer">
                    Ttd
                  </Text>
                </View>
              ) : undefined
            }
            divider
          />
          <SummaryRow label="Waktu" value={time} divider />
          <SummaryRow
            label="Lokasi"
            value={`${pod.geo.lat.toFixed(4)}, ${pod.geo.lng.toFixed(4)}`}
            sub={`(${trip.destination})`}
            divider
          />
          <SummaryRow
            label="Foto & Dokumen"
            value={`${pod.photoUris.length} berkas terunggah`}
            trailing={<Icon name="success" size={16} color={colors.success} />}
          />
        </Card>

        {/* Timeline */}
        <Card>
          <View style={styles.timelineHeader}>
            <Icon name="schedule" size={16} color={colors.textSecondary} />
            <Text variant="labelMd" color="textSecondary" style={styles.tracked}>
              AKTIVITAS
            </Text>
          </View>
          <View style={styles.timeline}>
            <View style={styles.timelineRail} />
            {(
              [
                { label: 'POD tercatat', sub: 'Data bukti pengiriman disimpan aman', time, tone: 'success' as Tone, icon: 'check' as IconName },
                { label: 'Notifikasi pelanggan dikirim', sub: 'Email & WhatsApp konfirmasi terkirim', time, tone: 'info' as Tone, icon: 'send' as IconName },
                { label: 'Tagihan dibuat', sub: 'Menunggu validasi dispatcher', time: 'Menunggu', tone: 'idle' as Tone, icon: null },
              ]
            ).map((event) => (
              <View key={event.label} style={styles.timelineRow}>
                <View style={[styles.timelineDot, { backgroundColor: TONE_COLOR[event.tone].bg }]}>
                  {event.icon ? (
                    <Icon name={event.icon} size={13} color={TONE_COLOR[event.tone].fg} />
                  ) : (
                    <View style={[styles.timelineDotInner, { backgroundColor: TONE_COLOR.idle.fg }]} />
                  )}
                </View>
                <View style={styles.flex}>
                  <View style={styles.rowBetween}>
                    <Text variant="caption" color={event.tone === 'idle' ? 'textSecondary' : 'ink'} style={styles.timelineLabel}>
                      {event.label}
                    </Text>
                    <Text variant="labelMd" color={event.tone === 'idle' ? 'textMuted' : 'textSecondary'}>
                      {event.time}
                    </Text>
                  </View>
                  <Text variant="micro" color="textMuted">
                    {event.sub}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Kembali ke Beranda" icon="home" onPress={goHome} />
        <Button
          label="Lihat Detail Trip"
          variant="ghost"
          iconAfter="forward"
          onPress={() => router.replace(`/trip/${trip.id}`)}
        />
      </View>
    </Screen>
  );
}

function SummaryRow({
  label,
  value,
  sub,
  trailing,
  divider = false,
}: {
  label: string;
  value: string;
  sub?: string;
  trailing?: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, divider && styles.summaryDivider]}>
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
      <View style={styles.summaryValue}>
        <Text variant="bodyBold" style={styles.summaryText}>
          {value}
        </Text>
        {sub ? (
          <Text variant="micro" color="textSecondary">
            {sub}
          </Text>
        ) : null}
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { gap: spacing.md, paddingHorizontal: spacing.gutter, paddingBottom: spacing.xxl },
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  tracked: { letterSpacing: 0.6, fontSize: 11, textTransform: 'uppercase' },

  banner: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.md },
  halo: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.successContainer, marginBottom: spacing.sm },
  haloInner: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.success },
  lockLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },

  syncBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#BCE4D3',
    backgroundColor: colors.successContainer,
  },
  syncIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18,128,92,0.15)',
  },
  autoChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(18,128,92,0.1)',
  },
  bannerBody: { marginTop: 2 },

  photoGrid: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  photoTile: {
    flex: 1,
    aspectRatio: 4 / 3,
    borderRadius: radius.input,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceContainer,
  },
  photoImage: { width: '100%', height: '100%' },
  photoLabel: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  summaryDivider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.sm },
  summaryValue: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  summaryText: { textAlign: 'right', flexShrink: 1 },
  ttdChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainer,
  },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },

  online: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: colors.successContainer,
  },
  onlineIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18,128,92,0.1)',
  },

  timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  timeline: { paddingLeft: spacing.xl, gap: spacing.lg },
  timelineRail: { position: 'absolute', left: 9, top: spacing.sm, bottom: spacing.sm, width: 2, backgroundColor: colors.divider },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  timelineDot: {
    position: 'absolute',
    left: -spacing.xl,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  timelineDotInner: { width: 6, height: 6, borderRadius: 3 },
  timelineLabel: { fontFamily: 'Inter_600SemiBold' },

  footer: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
