import { router } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  BottomBar,
  Button,
  Card,
  EmptyState,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { toOdometerCorrection } from '@/data/adapters';
import { useOdometerCorrections } from '@/hooks/api/useDriverData';
import { mediaUrl } from '@/lib/api/config';
import { formatDateTime, formatKm } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

export default function OdometerSubmittedScreen() {
  const query = useOdometerCorrections();

  const correction = useMemo(() => {
    const list = (query.data ?? []).map(toOdometerCorrection);
    return list.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
  }, [query.data]);

  if (!correction) {
    return (
      <Screen>
        <ScreenHeader title="Konfirmasi Koreksi" onBack />
        <EmptyState
          icon="odometer"
          title="Belum ada pengajuan"
          description="Ajukan koreksi odometer dari layar Kendaraan Saya."
        />
      </Screen>
    );
  }

  const code = `KOR-2026-${String(correction.id.replace(/\D/g, '').slice(-4) || '0137').padStart(4, '0')}`;

  return (
    <Screen>
      <ScreenHeader
        title="Konfirmasi Koreksi"
        borderless
        onBack
        right={
          <Pressable
            onPress={() => router.replace('/(app)/(tabs)/profile')}
            accessibilityRole="button"
            accessibilityLabel="Tutup"
            hitSlop={8}
          >
            <Icon name="close" size={22} color={colors.onSurfaceVariant} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={160}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroHalo}>
            <View style={styles.heroCircle}>
              <Icon name="check" size={28} color={colors.onPrimary} />
            </View>
          </View>
          <Text variant="headlineMd">Koreksi berhasil diajukan</Text>
          <Text variant="caption" color="onSurfaceVariant" style={styles.heroNote}>
            Permintaan Anda sedang ditinjau supervisor.
          </Text>
        </View>

        {/* Reference */}
        <Card shadow>
          <Text variant="labelMd" color="secondary" style={styles.upper}>
            NOMOR PENGAJUAN
          </Text>
          <Text variant="headlineMd" style={styles.code}>
            {code}
          </Text>
          <View style={styles.divider} />
          <View style={styles.refRow}>
            <View style={styles.refLabel}>
              <Icon name="calendar" size={16} color={colors.outline} />
              <Text variant="caption" color="textSecondary">
                Waktu Pengajuan
              </Text>
            </View>
            <Text variant="labelMd">{formatDateTime(correction.submittedAt)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.refRow}>
            <Text variant="caption" color="textSecondary">
              Status
            </Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text variant="labelMd" color={colors.warning}>
                Menunggu Tinjauan
              </Text>
            </View>
          </View>
        </Card>

        {/* Summary */}
        <Card shadow style={styles.section}>
          <Text variant="labelMd" color="secondary" style={styles.upper}>
            RINGKASAN
          </Text>

          <View style={styles.compare}>
            <View style={styles.compareSide}>
              <Text variant="labelSm" color="secondary" style={styles.upper}>
                Tercatat
              </Text>
              <View style={styles.strikeRow}>
                <Icon name="delete" size={13} color={colors.critical} />
                <Text variant="labelMd" color="critical" style={styles.strike}>
                  {formatKm(correction.recordedKm)}
                </Text>
              </View>
            </View>
            <Icon name="forward" size={16} color={colors.outline} />
            <View style={[styles.compareSide, styles.compareRight]}>
              <Text variant="labelSm" color="secondary" style={styles.upper}>
                Diajukan
              </Text>
              <Text variant="labelMd">{formatKm(correction.requestedKm)}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.reason}>
            <Text variant="labelMd">
              <Text variant="labelMd" color="onSurface">
                Alasan:{' '}
              </Text>
              &quot;{correction.reason}&quot;
            </Text>
          </View>

          {correction.photoUris.length > 0 ? (
            <View style={styles.evidenceBlock}>
              <View style={styles.evidenceHead}>
                <View style={styles.evidenceLabel}>
                  <Icon name="camera" size={16} color={colors.primaryContainer} />
                  <Text variant="labelMd">
                    {correction.photoUris.length} foto bukti odometer
                  </Text>
                </View>
              </View>
              <View style={styles.evidenceGrid}>
                {correction.photoUris.map((uri, index) => (
                  <View key={uri} style={styles.evidenceTile}>
                    <Image
                      source={{ uri: mediaUrl(uri) ?? uri }}
                      style={styles.evidenceImage}
                      resizeMode="cover"
                    />
                    <View style={styles.evidenceBadge}>
                      <Icon name="success" size={10} color={colors.onPrimary} />
                      <Text variant="labelSm" color={colors.onPrimary}>
                        Bukti {index + 1}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </Card>

        {/* Activity */}
        <Card shadow style={styles.section}>
          <Text variant="labelMd" color="secondary" style={styles.upper}>
            AKTIVITAS
          </Text>
          <View style={styles.timeline}>
            <View style={styles.timelineRail} />
            <TimelineStep title="Pengajuan dibuat" note="Data koreksi tercatat di sistem" time="15:04" done />
            <TimelineStep title="Terkirim ke supervisor" note="Notifikasi push dispatch terkirim" time="15:05" done />
            <TimelineStep title="Supervisor meninjau" note="Verifikasi fisik & log telematika" time="Menunggu" />
          </View>
        </Card>

        {/* Notice */}
        <View style={styles.notice}>
          <Icon name="info" size={18} color={colors.warning} />
          <Text variant="caption" color="#92400E" style={styles.flex}>
            Anda tetap dapat menginput BBM dengan odometer terakhir selama tinjauan berjalan.
          </Text>
        </View>
      </ScreenBody>

      <BottomBar>
        <Button
          label="Kembali ke Catatan BBM"
          iconAfter="forward"
          onPress={() => router.replace('/fuel')}
        />
        <Pressable
          onPress={() => router.replace('/vehicle')}
          accessibilityRole="button"
          style={styles.ghostAction}
        >
          <Text variant="caption" color="textSecondary" style={styles.underline}>
            Lihat Semua Pengajuan
          </Text>
        </Pressable>
      </BottomBar>
    </Screen>
  );
}

function TimelineStep({
  title,
  note,
  time,
  done = false,
}: {
  title: string;
  note: string;
  time: string;
  done?: boolean;
}) {
  return (
    <View style={styles.nodeRow}>
      <View style={[styles.nodeDot, done ? styles.nodeDotDone : styles.nodeDotPending]}>
        {done ? (
          <Icon name="check" size={12} color={colors.onPrimary} />
        ) : (
          <View style={styles.nodeInner} />
        )}
      </View>
      <View style={styles.flex}>
        <Text variant="labelMd" color={done ? 'onSurface' : 'textSecondary'}>
          {title}
        </Text>
        <Text variant="labelSm" color={done ? 'secondary' : 'textMuted'}>
          {note}
        </Text>
      </View>
      <Text variant="labelSm" color="secondary" style={styles.nodeTime}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },

  hero: { alignItems: 'center', paddingTop: spacing.sm, gap: spacing.xs },
  heroHalo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFixed,
    marginBottom: spacing.sm,
  },
  heroCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  heroNote: { marginTop: 2 },

  code: { marginTop: spacing.xs, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm + 2 },
  refRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  refLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: '#FDF1E3',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning },

  section: { marginTop: spacing.lg, gap: spacing.sm },
  compare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  compareSide: { flex: 1, gap: 2 },
  compareRight: { alignItems: 'flex-end' },
  strikeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  strike: { textDecorationLine: 'line-through' },
  reason: {
    padding: spacing.sm + 2,
    borderRadius: radius.input,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.divider,
  },

  evidenceBlock: { gap: spacing.sm, marginTop: spacing.sm },
  evidenceHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  evidenceLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  evidenceGrid: { flexDirection: 'row', gap: spacing.sm },
  evidenceTile: { flex: 1, aspectRatio: 16 / 10, borderRadius: radius.input, overflow: 'hidden' },
  evidenceImage: { width: '100%', height: '100%', backgroundColor: colors.surfaceContainer },
  evidenceBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(17,24,39,0.8)',
  },

  timeline: { gap: spacing.lg, paddingLeft: spacing.xs, marginTop: spacing.xs },
  timelineRail: {
    position: 'absolute',
    left: 9,
    top: 6,
    bottom: 6,
    width: 2,
    backgroundColor: colors.divider,
  },
  nodeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  nodeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDotDone: { backgroundColor: colors.primaryContainer },
  nodeDotPending: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
  },
  nodeInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.outline },
  nodeTime: { marginTop: 2 },

  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },

  ghostAction: { alignItems: 'center', paddingVertical: spacing.xs },
  underline: { textDecorationLine: 'underline' },
});
