import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import {
  Badge,
  Button,
  Card,
  ProgressRing,
  Screen,
  ScreenBody,
  Skeleton,
  Text,
} from '@/components/ui';
import { toDriver, toVehicle } from '@/data/adapters';
import { useDna, useHome, useVehicle } from '@/hooks/api/useDriverData';
import { useNotifications } from '@/hooks/useNotifications';
import { useTrips } from '@/hooks/useTrips';
import { formatDate, formatKm, formatWindow, scoreTone } from '@/lib/format';
import { emptyDriver } from '@/store/app';
import { colors, radius, shadows, spacing } from '@/theme';

const greeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 19) return 'Selamat sore';
  return 'Selamat malam';
};

/** Days until the SIM expires, floored at zero. */
const daysUntil = (iso: string): number =>
  Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const home = useHome();
  const dna = useDna();
  const vehicleQuery = useVehicle();
  const { unreadCount } = useNotifications();
  const { upcoming, active, accept } = useTrips();

  const driver = home.data ? toDriver(home.data.profile, dna.data?.score ?? 0) : emptyDriver;
  const loading = home.loading;
  const newTasks = upcoming.filter((item) => item.status === 'assigned');
  // New assignments get their own card below, so the "next trip" card prefers
  // a trip the driver has already accepted.
  const trip = active[0] ?? upcoming.find((item) => item.status === 'accepted') ?? (newTasks.length > 0 ? undefined : upcoming[0]);
  const vehicle = vehicleQuery.data ? toVehicle(vehicleQuery.data) : undefined;
  const dnaTone = scoreTone(driver.dnaScore);
  const licenseDays = daysUntil(driver.licenseExpiry);
  const firstName = driver.name.split(' ')[0];

  return (
    <Screen style={{ backgroundColor: colors.surface }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text variant="headlineSm" color="onPrimary">
              {driver.initials}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text variant="headlineSm" style={styles.greeting}>
              {greeting()}, {firstName}
            </Text>
            <Text variant="labelMd" color="secondary">
              Driver • {driver.site}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.navigate('/notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifikasi"
          style={styles.bell}
        >
          <Icon name="notifications" size={26} color={colors.onSurfaceVariant} />
          {unreadCount > 0 ? <View style={styles.bellDot} /> : null}
        </Pressable>
      </View>

      <ScreenBody bottomPadding={spacing.xxl}>
        {loading ? (
          <>
            <Card style={styles.skeletonCard}>
              <View style={styles.skeletonRow}>
                <View style={styles.skeletonText}>
                  <Skeleton width="70%" height={18} />
                  <Skeleton width="90%" height={14} />
                  <Skeleton width={72} height={20} cornerRadius={radius.pill} />
                </View>
                <Skeleton width={80} height={80} cornerRadius={40} />
              </View>
            </Card>
            <Card style={styles.skeletonCard}>
              <Skeleton width="40%" height={12} />
              <Skeleton width="80%" height={22} />
              <Skeleton width="100%" height={64} />
              <Skeleton width="100%" height={56} />
            </Card>
          </>
        ) : (
          <>
            {/* DNA / health score */}
            <Card shadow style={styles.dnaCard}>
              <View style={styles.dnaText}>
                <Text variant="headlineSm">Skor Kesehatan Driver</Text>
                <Text variant="bodyMd" color="secondary" style={styles.dnaSub}>
                  Baik • 3 poin naik bulan ini
                </Text>
              </View>
              <ProgressRing
                value={driver.dnaScore}
                size={80}
                color={dnaTone === 'success' ? colors.success : dnaTone === 'warning' ? colors.warning : colors.critical}
                caption="Skor"
              />
            </Card>

            {/* New incoming tasks */}
            {newTasks.length > 0 ? (
              <Card shadow style={styles.newTasksCard}>
                <View style={styles.newTasksHead}>
                  <View style={styles.newTasksTitle}>
                    <View style={styles.newTasksDot} />
                    <Text variant="titleMd">Tugas Baru Masuk</Text>
                    <Badge label={`${newTasks.length} baru`} tone="info" />
                  </View>
                  <Pressable
                    onPress={() => router.navigate('/inbox')}
                    accessibilityRole="button"
                    accessibilityLabel="Lihat semua tugas baru"
                  >
                    <Text variant="labelMd" color="primaryContainer">
                      Lihat semua ›
                    </Text>
                  </Pressable>
                </View>

                {newTasks.slice(0, 3).map((item) => (
                  <View key={item.id} style={styles.newTaskRow}>
                    <View style={styles.newTaskInfo}>
                      <Text variant="labelMd" numberOfLines={1}>
                        {item.destination}
                      </Text>
                      <Text variant="labelSm" color="textSecondary" numberOfLines={1}>
                        {formatWindow(item.scheduledAt, item.distanceKm)} • {formatKm(item.distanceKm)}
                      </Text>
                    </View>
                    <View style={styles.newTaskActions}>
                      <Pressable
                        onPress={() => router.push(`/trip/${item.id}/reject`)}
                        accessibilityRole="button"
                        accessibilityLabel={`Tolak tugas ke ${item.destination}`}
                        style={({ pressed }) => [styles.newTaskReject, pressed && styles.tilePressed]}
                      >
                        <Text variant="labelMd" color="critical">
                          Tolak
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => accept(item.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Terima tugas ke ${item.destination}`}
                        style={({ pressed }) => [styles.newTaskAccept, pressed && styles.tilePressed]}
                      >
                        <Text variant="labelMd" color="onPrimary">
                          Terima
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </Card>
            ) : null}

            {/* Next trip */}
            {trip ? (
              <Card shadow style={styles.tripCard}>
                <View style={styles.tripHead}>
                  <Text variant="labelMd" color="textMuted" style={styles.upper}>
                    TRIP BERIKUTNYA
                  </Text>
                  <Badge
                    label={trip.status === 'in_progress' ? 'Dalam Perjalanan' : 'Menunggu Konfirmasi'}
                    tone={trip.status === 'in_progress' ? 'warning' : 'info'}
                  />
                </View>

                <View style={styles.tripTitle}>
                  <Text variant="labelMd" color="textSecondary">
                    Lokasi Bongkar Muat
                  </Text>
                  <Text variant="headlineMd">{trip.destination}</Text>
                </View>

                <View style={styles.tripMeta}>
                  <View style={styles.metaCol}>
                    <View style={styles.metaLabel}>
                      <Icon name="schedule" size={18} color={colors.textSecondary} />
                      <Text variant="labelSm" color="textMuted">
                        WAKTU
                      </Text>
                    </View>
                    <Text variant="labelMd">
                      {formatWindow(trip.scheduledAt, trip.distanceKm)}
                    </Text>
                  </View>

                  <View style={[styles.metaCol, styles.metaColMid]}>
                    <View style={styles.metaLabel}>
                      <Icon name="truck" size={18} color={colors.textSecondary} />
                      <Text variant="labelSm" color="textMuted">
                        ARMADA
                      </Text>
                    </View>
                    <Text variant="labelMd">{vehicle?.plate ?? '—'}</Text>
                  </View>

                  <View style={styles.metaCol}>
                    <View style={styles.metaLabel}>
                      <Icon name="gps" size={18} color={colors.textSecondary} />
                      <Text variant="labelSm" color="textMuted">
                        JARAK
                      </Text>
                    </View>
                    <Text variant="labelMd">{formatKm(trip.distanceKm)}</Text>
                  </View>
                </View>

                {trip.status === 'assigned' ? (
                  <View style={styles.tripActions}>
                    <Button
                      label="Tolak"
                      variant="secondary"
                      onPress={() => router.push(`/trip/${trip.id}/reject`)}
                      style={styles.tripAction}
                    />
                    <Button
                      label="Terima"
                      onPress={() => accept(trip.id)}
                      style={styles.tripAction}
                    />
                  </View>
                ) : (
                  <View style={styles.tripActions}>
                    <Button
                      label="Buka Trip Aktif"
                      iconAfter="forward"
                      onPress={() => router.push(`/trip/${trip.id}/execution`)}
                    />
                  </View>
                )}
              </Card>
            ) : newTasks.length > 0 ? null : (
              <Card shadow>
                <Text variant="titleMd">Tidak ada trip aktif</Text>
                <Text variant="bodyMd" color="textSecondary" style={styles.emptyBody}>
                  Penugasan baru akan muncul di Inbox dan lewat notifikasi.
                </Text>
              </Card>
            )}

            {/* Quick actions */}
            <View style={styles.quickSection}>
              <Text variant="labelMd" color="textMuted" style={[styles.upper, styles.quickTitle]}>
                AKSI CEPAT
              </Text>
              <View style={styles.quickGrid}>
                <QuickTile
                  icon="checklist"
                  label="DVIR Pre-Trip"
                  alert={Boolean(trip && !trip.preTripDone)}
                  disabled={!trip}
                  onPress={() => trip && router.push(`/dvir/${trip.id}/pre-trip`)}
                />
                <QuickTile
                  icon="route"
                  label="Trip Aktif"
                  disabled={!trip}
                  onPress={() => trip && router.push(`/trip/${trip.id}/execution`)}
                />
                <QuickTile
                  icon="camera"
                  label="Bukti Kirim"
                  disabled={!trip}
                  onPress={() => trip && router.push(`/pod/${trip.id}/capture`)}
                />
              </View>
            </View>

            {/* Document reminder */}
            {driver.licenseExpiry && licenseDays <= 60 ? (
              <View style={styles.reminder}>
                <View style={styles.reminderLeft}>
                  <View style={styles.reminderIcon}>
                    <Icon name="warning" size={20} color={colors.warning} />
                  </View>
                  <Text variant="bodyMd" style={styles.reminderText}>
                    SIM Anda akan kedaluwarsa dalam {licenseDays} hari ({formatDate(driver.licenseExpiry)})
                  </Text>
                </View>
                <Pressable onPress={() => router.navigate('/profile')} accessibilityRole="button">
                  <Text variant="labelMd" color="warning">
                    Perbarui ›
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </>
        )}
      </ScreenBody>
    </Screen>
  );
}

function QuickTile({
  icon,
  label,
  alert = false,
  disabled = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  alert?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tile, disabled && styles.tileDisabled, pressed && styles.tilePressed]}
    >
      {alert ? <View style={styles.tileAlert} /> : null}
      <View style={styles.tileIcon}>
        <Icon name={icon} size={22} color={colors.primaryContainer} />
      </View>
      <Text variant="labelMd" align="center" style={styles.tileLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    ...shadows.card,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  greeting: { fontSize: 17, lineHeight: 22 },
  bell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.critical,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  skeletonCard: { marginTop: spacing.lg, gap: spacing.md },
  skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  skeletonText: { flex: 1, gap: spacing.sm },
  dnaCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg },
  dnaText: { flex: 1, paddingRight: spacing.sm },
  dnaSub: { marginTop: spacing.xs },
  tripCard: { marginTop: spacing.lg },
  newTasksCard: { marginTop: spacing.lg, gap: spacing.md },
  newTasksHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  newTasksTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  newTasksDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.critical },
  newTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.canvas,
  },
  newTaskInfo: { flex: 1, gap: 2 },
  newTaskActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  newTaskReject: {
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newTaskAccept: {
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLow,
  },
  upper: { textTransform: 'uppercase' },
  tripTitle: { paddingTop: spacing.md, paddingBottom: spacing.sm },
  tripMeta: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.canvas,
  },
  metaCol: { flex: 1 },
  metaColMid: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.sm,
  },
  metaLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 4 },
  tripActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  tripAction: { flex: 1 },
  emptyBody: { marginTop: spacing.sm },
  quickSection: { marginTop: spacing.xl },
  quickTitle: { marginBottom: spacing.sm },
  quickGrid: { flexDirection: 'row', gap: spacing.md },
  tile: {
    flex: 1,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  tileDisabled: { opacity: 0.45 },
  tilePressed: { opacity: 0.85 },
  tileAlert: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.warning,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { fontSize: 13, lineHeight: 17 },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    backgroundColor: '#FDF1E3',
  },
  reminderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  reminderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
