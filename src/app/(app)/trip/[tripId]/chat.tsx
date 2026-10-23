import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { useTrip } from '@/hooks/useTrip';
import { colors, radius, spacing } from '@/theme';

/**
 * Recipient contact screen.
 *
 * The backend has no messaging endpoint yet, so the previous prototype chat
 * (local-only messages that were never sent) has been removed. Calling the
 * recipient still works through the device dialer.
 */
export default function TripChatScreen() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Kontak Penerima" onBack />
        <EmptyState
          icon="error"
          title="Trip tidak ditemukan"
          description="Penugasan ini mungkin sudah dibatalkan oleh dispatcher."
        />
      </Screen>
    );
  }

  const recipient = trip.recipient;

  const call = () => {
    if (!recipient.phone) return;
    Linking.openURL(`tel:${recipient.phone.replace(/[^+\d]/g, '')}`);
  };

  return (
    <Screen>
      <ScreenHeader
        title={recipient.name}
        subtitle={`${recipient.role} • ${trip.destination}`}
        onBack
        right={
          recipient.phone ? (
            <Pressable
              onPress={call}
              accessibilityRole="button"
              accessibilityLabel={`Telepon ${recipient.name}`}
              hitSlop={8}
              style={styles.callButton}
            >
              <Icon name="phone" size={20} color={colors.primaryContainer} />
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.contactCard}>
          <View style={styles.avatar}>
            <Text variant="bodyBold" color="primaryContainer">
              {recipient.initials}
            </Text>
          </View>
          <View style={styles.flex}>
            <Text variant="titleMd">{recipient.name}</Text>
            <Text variant="caption" color="textSecondary">
              {recipient.phone ? `${recipient.role} • ${recipient.phone}` : recipient.role}
            </Text>
          </View>
          {recipient.phone ? (
            <Pressable
              onPress={call}
              accessibilityRole="button"
              accessibilityLabel="Telepon penerima"
              style={({ pressed }) => [styles.inlineCall, pressed && styles.pressed]}
            >
              <Icon name="phone" size={16} color={colors.primaryContainer} />
              <Text variant="labelMd" color="primaryContainer">
                Telepon
              </Text>
            </Pressable>
          ) : null}
        </Card>

        <Card style={styles.notice}>
          <Icon name="info" size={20} color={colors.textSecondary} />
          <View style={styles.flex}>
            <Text variant="titleMd">Chat belum tersedia</Text>
            <Text variant="bodyMd" color="textSecondary" style={styles.noticeBody}>
              Fitur pesan dalam aplikasi belum terhubung ke server. Hubungi penerima melalui
              telepon agar komunikasi tetap tercatat di perangkat Anda.
            </Text>
          </View>
        </Card>

        <Pressable
          onPress={() => router.push(`/trip/${trip.id}`)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.tripLink, pressed && styles.pressed]}
        >
          <Icon name="assignment" size={16} color={colors.textSecondary} />
          <Text variant="labelMd" color="textSecondary" style={styles.flex}>
            Lihat detail trip {trip.code}
          </Text>
          <Icon name="forward" size={16} color={colors.secondary} />
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.85 },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { gap: spacing.md, padding: spacing.gutter },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.infoContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineCall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noticeBody: { marginTop: spacing.xs, lineHeight: 21 },
  tripLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
});
