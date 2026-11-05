import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { useTrip } from '@/hooks/useTrip';
import { colors, radius, spacing } from '@/theme';

interface ChatMessage {
  id: string;
  text: string;
  /** `true` for messages the driver wrote. */
  mine: boolean;
  time: string;
}

const clock = () => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')}`;
};

/**
 * Recipient contact + demo conversation.
 *
 * The backend has no messaging endpoint yet, so the thread lives in local state
 * only — it is a UI prototype, not a delivery channel. The call button is real:
 * it hands the recipient's number to the device dialer.
 */
export default function TripChatScreen() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);

  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

  // Seeded lazily so the greeting carries the real trip code.
  const seed: ChatMessage[] = [
    {
      id: 'seed-1',
      text: `Selamat pagi, saya ${recipient.name}. Untuk pengiriman ${trip.code} hari ini, barang sudah siap diterima di gudang.`,
      mine: false,
      time: '08.12',
    },
    {
      id: 'seed-2',
      text: 'Baik, saya sedang menuju lokasi. Estimasi tiba 30 menit lagi.',
      mine: true,
      time: '08.15',
    },
    {
      id: 'seed-3',
      text: 'Siap, saya tunggu. Tolong kabari saat sudah di gerbang ya.',
      mine: false,
      time: '08.16',
    },
  ];

  const thread = messages.length > 0 ? messages : seed;

  const call = () => {
    if (!recipient.phone) return;
    Linking.openURL(`tel:${recipient.phone.replace(/[^+\d]/g, '')}`);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages([
      ...thread,
      { id: `local-${Date.now()}`, text, mine: true, time: clock() },
    ]);
    setDraft('');
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 64}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
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

          <View style={styles.demoChip}>
            <Icon name="info" size={14} color={colors.textMuted} />
            <Text variant="labelSm" color="textMuted">
              Percakapan contoh — pesan tidak dikirim ke server
            </Text>
          </View>

          {thread.map((message) => (
            <View
              key={message.id}
              style={[
                styles.bubbleRow,
                message.mine ? styles.bubbleRowMine : styles.bubbleRowTheirs,
              ]}
            >
              <View style={[styles.bubble, message.mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text variant="bodyMd" color={message.mine ? 'onPrimary' : 'onSurface'}>
                  {message.text}
                </Text>
                <Text
                  variant="labelSm"
                  color={message.mine ? 'onPrimary' : 'textMuted'}
                  style={styles.bubbleTime}
                >
                  {message.time}
                </Text>
              </View>
            </View>
          ))}

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

        <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <View style={styles.inputShell}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Tulis pesan…"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              multiline
              maxLength={500}
              onSubmitEditing={send}
              returnKeyType="send"
            />
          </View>
          <Pressable
            onPress={send}
            disabled={draft.trim().length === 0}
            accessibilityRole="button"
            accessibilityLabel="Kirim pesan"
            style={({ pressed }) => [
              styles.sendButton,
              draft.trim().length === 0 && styles.sendDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Icon name="send" size={20} color={colors.onPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  content: { gap: spacing.md, padding: spacing.gutter, paddingBottom: spacing.lg },
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
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    alignSelf: 'center',
  },
  bubbleRow: { flexDirection: 'row' },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubbleRowTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.card,
    gap: 4,
  },
  bubbleMine: { backgroundColor: colors.primaryContainer, borderBottomRightRadius: radius.sm },
  bubbleTheirs: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderBottomLeftRadius: radius.sm,
  },
  bubbleTime: { alignSelf: 'flex-end' },
  tripLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
  },
  inputShell: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainer,
  },
  input: {
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  sendDisabled: { opacity: 0.4 },
});
