import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
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
  type BadgeTone,
} from '@/components/ui';
import { useTrip } from '@/hooks/useTrip';
import type { DvirInspection, DvirStatus } from '@/data/types';
import { formatDateTime, formatNumber } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

const STATUS_TONE: Record<DvirStatus, BadgeTone> = {
  draft: 'neutral',
  submitted: 'info',
  passed: 'success',
  failed: 'critical',
};

const STATUS_LABEL: Record<DvirStatus, string> = {
  draft: 'Draf',
  submitted: 'Terkirim',
  passed: 'Lulus',
  failed: 'Gagal',
};

export default function DvirHistoryScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip, vehicle, preTrip, postTrip } = useTrip(tripId);

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Riwayat DVIR" onBack />
        <EmptyState
          icon="error"
          title="Riwayat tidak ditemukan"
          description="Kembali dan ulangi inspeksi DVIR."
        />
      </Screen>
    );
  }

  const records: { key: string; title: string; inspection?: DvirInspection }[] = [
    { key: 'pre', title: 'Pre-Trip', inspection: preTrip },
    { key: 'post', title: 'Post-Trip', inspection: postTrip },
  ];

  const hasAny = records.some((record) => record.inspection);

  return (
    <Screen>
      <ScreenHeader title="Riwayat DVIR" onBack />

      <ScreenBody bottomPadding={150}>
        <View style={styles.stack}>
          {/* Trip summary */}
          <Card shadow>
            <View style={styles.tripTop}>
              <View style={styles.flex}>
                <Text variant="labelSm" color="textMuted" style={styles.tracked}>
                  NOMOR TRIP
                </Text>
                <Text variant="headlineSm">{trip.code}</Text>
              </View>
              <View style={styles.plateRow}>
                <View style={styles.plateIcon}>
                  <Icon name="truck" size={16} color={colors.primaryContainer} />
                </View>
                <Text variant="bodyBold">{vehicle?.plate ?? '—'}</Text>
              </View>
            </View>
            <Text variant="caption" color="textSecondary" style={styles.tripRoute}>
              {trip.origin} → {trip.destination}
            </Text>
          </Card>

          {hasAny ? (
            records.map((record) => (
              <InspectionCard key={record.key} title={record.title} inspection={record.inspection} />
            ))
          ) : (
            <EmptyState
              icon="checklist"
              title="Belum ada riwayat DVIR"
              description="Inspeksi pre-trip dan post-trip akan tampil di sini setelah dikirim."
            />
          )}

          <View style={styles.footerNote}>
            <Icon name="lock" size={15} color={colors.textMuted} />
            <Text variant="labelSm" color="textSecondary">
              Riwayat bersifat read-only (FRD-MOB-DVIR)
            </Text>
          </View>
        </View>
      </ScreenBody>

      <BottomBar>
        <Button
          label="Kembali ke Beranda"
          iconAfter="home"
          onPress={() => {
            if (router.canDismiss()) router.dismissAll();
            else router.navigate('/(app)/(tabs)');
          }}
        />
      </BottomBar>
    </Screen>
  );
}

function InspectionCard({ title, inspection }: { title: string; inspection?: DvirInspection }) {
  if (!inspection) {
    return (
      <Card>
        <View style={styles.cardHead}>
          <Text variant="titleMd">{title}</Text>
          <Badge label="Belum diisi" tone="neutral" />
        </View>
        <Text variant="caption" color="textSecondary" style={styles.cardBody}>
          Belum ada laporan untuk sesi ini.
        </Text>
      </Card>
    );
  }

  const total = inspection.items.length;
  const failures = inspection.items.filter((item) => item.result === 'fail').length;
  const answered = inspection.items.filter((item) => item.result !== null).length;

  return (
    <Card>
      <View style={styles.cardHead}>
        <Text variant="titleMd">{title}</Text>
        <Badge label={STATUS_LABEL[inspection.status]} tone={STATUS_TONE[inspection.status]} dot />
      </View>

      <View style={styles.metaGrid}>
        <MetaCell label="Waktu" value={inspection.submittedAt ? formatDateTime(inspection.submittedAt) : '—'} />
        <MetaCell label="Odometer" value={`${formatNumber(inspection.odometerKm)} km`} />
        <MetaCell label="Diperiksa" value={`${answered}/${total} item`} />
        <MetaCell
          label="Temuan"
          value={failures > 0 ? `${failures} gagal` : 'Tidak ada'}
          tone={failures > 0 ? colors.critical : colors.success}
        />
      </View>
    </Card>
  );
}

function MetaCell({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <View style={styles.metaCell}>
      <Text variant="labelSm" color="textMuted" style={styles.tracked}>
        {label}
      </Text>
      <Text variant="bodyBold" color={tone}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },
  stack: { gap: spacing.md },

  tripTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  tripRoute: { marginTop: spacing.md },
  plateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  plateIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },

  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardBody: { marginTop: spacing.sm },

  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md,
    marginTop: spacing.md,
  },
  metaCell: { width: '50%', gap: 2 },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
});
