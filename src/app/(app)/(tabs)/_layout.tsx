import { Tabs, router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Divider, ListRow, Sheet, Text } from '@/components/ui';
import { useNotifications } from '@/hooks/useNotifications';
import { useTrips } from '@/hooks/useTrips';
import { colors, fonts, radius, shadows, sizes, spacing } from '@/theme';

function CenterActionButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Aksi cepat"
      style={({ pressed }) => [styles.fabWrap, pressed && styles.fabPressed]}
    >
      <View style={styles.fab}>
        <Icon name="add" size={28} color={colors.onPrimary} />
      </View>
    </Pressable>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { upcoming, active, history } = useTrips();
  const { unreadCount } = useNotifications();
  const [actionsOpen, setActionsOpen] = useState(false);

  /** The trip the contextual actions apply to. */
  const focusTrip = active[0] ?? upcoming[0];
  const pendingCount = upcoming.filter((trip) => trip.status === 'assigned').length;

  const openTrip = (path: Href) => {
    setActionsOpen(false);
    router.push(path);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primaryContainer,
          tabBarInactiveTintColor: colors.secondary,
          tabBarLabelStyle: { fontFamily: fonts.semiBold, fontSize: 11 },
          tabBarStyle: {
            height: sizes.tabBar + insets.bottom,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.sm,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
            ...shadows.raised,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: 'Inbox',
            tabBarBadge: pendingCount || undefined,
            tabBarBadgeStyle: styles.badge,
            tabBarIcon: ({ color }) => <Icon name="inbox" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: '',
            tabBarButton: () => <CenterActionButton onPress={() => setActionsOpen(true)} />,
          }}
          listeners={{ tabPress: (event) => event.preventDefault() }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notifikasi',
            tabBarBadge: unreadCount || undefined,
            tabBarBadgeStyle: styles.badge,
            tabBarIcon: ({ color }) => <Icon name="notifications" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <Icon name="profile" size={24} color={color} />,
          }}
        />
      </Tabs>

      <Sheet
        visible={actionsOpen}
        onClose={() => setActionsOpen(false)}
        title="Aksi Cepat"
        description={
          focusTrip
            ? `${focusTrip.code} • ${focusTrip.destination}`
            : 'Belum ada trip aktif untuk dikerjakan.'
        }
      >
        {focusTrip ? (
          <View style={styles.actionList}>
            {!focusTrip.preTripDone ? (
              <>
                <ListRow
                  icon="checklist"
                  title="Mulai DVIR Pre-Trip"
                  subtitle="Inspeksi kendaraan wajib sebelum berangkat"
                  onPress={() => openTrip(`/dvir/${focusTrip.id}/pre-trip`)}
                />
                <Divider />
              </>
            ) : null}
            <ListRow
              icon="camera"
              title="Ambil Bukti Kirim (POD)"
              subtitle="Foto, tanda tangan penerima, dan lokasi"
              onPress={() => openTrip(`/pod/${focusTrip.id}/capture`)}
            />
            <Divider />
            {focusTrip.preTripDone && !focusTrip.postTripDone ? (
              <>
                <ListRow
                  icon="checklist"
                  title="Mulai DVIR Post-Trip"
                  subtitle="Inspeksi kendaraan setelah perjalanan selesai"
                  onPress={() => openTrip(`/dvir/${focusTrip.id}/post-trip`)}
                />
                <Divider />
              </>
            ) : null}
            <ListRow
              icon="route"
              title="Buka Trip Aktif"
              subtitle="Status perjalanan dan aksi start / arrive / selesai"
              onPress={() => openTrip(`/trip/${focusTrip.id}/execution`)}
            />
            <Divider />
            <ListRow
              icon="map"
              title="Rute & Posisi"
              subtitle="Peta langsung, telemetri, dan titik antar"
              onPress={() => openTrip(`/trip/${focusTrip.id}/route`)}
            />
            <Divider />
            <ListRow
              icon="warning"
              title="Peringatan Trip"
              subtitle="Zona rute, SLA, dan perubahan dispatch"
              onPress={() => openTrip(`/trip/${focusTrip.id}/warnings`)}
            />
            <Divider />
            <ListRow
              icon="cargo"
              title="Aset Trip"
              subtitle="Reefer, trailer box, dan status gembok"
              onPress={() => openTrip(`/trip/${focusTrip.id}/assets`)}
            />
            <Divider />
            <ListRow
              icon="fuel"
              title="Catat BBM"
              subtitle="Volume, odometer, dan foto struk"
              onPress={() => openTrip('/fuel')}
            />
          </View>
        ) : (
          <Text variant="bodyMd" color="textSecondary">
            {history.length > 0
              ? 'Semua trip Anda sudah selesai. Trip baru akan muncul di Inbox.'
              : 'Belum ada penugasan. Hubungi dispatcher bila ini tidak sesuai.'}
          </Text>
        )}
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  fabWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  fabPressed: { opacity: 0.85 },
  fab: {
    width: sizes.fab,
    height: sizes.fab,
    borderRadius: sizes.fab / 2,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.raised,
  },
  badge: {
    backgroundColor: colors.critical,
    color: colors.onPrimary,
    fontFamily: fonts.bold,
    fontSize: 10,
    borderRadius: radius.pill,
  },
  actionList: { gap: 0 },
});
