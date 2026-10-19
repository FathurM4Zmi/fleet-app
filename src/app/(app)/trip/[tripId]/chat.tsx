import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
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
import { colors, radius, shadows, spacing } from '@/theme';

interface ChatMessage {
  id: string;
  from: 'them' | 'me';
  text: string;
  time: string;
}

const nowTime = () =>
  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

export default function TripChatScreen() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'chat-1',
      from: 'them',
      text: 'Halo, ini pos penerimaan. Ada yang bisa dibantu?',
      time: '07:58',
    },
    {
      id: 'chat-2',
      from: 'me',
      text: 'Baik, unit saya menuju lokasi. Mohon info gerbang masuk.',
      time: '08:02',
    },
  ]);

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Chat Penerima" onBack />
        <EmptyState
          icon="error"
          title="Trip tidak ditemukan"
          description="Penugasan ini mungkin sudah dibatalkan oleh dispatcher."
        />
      </Screen>
    );
  }

  const recipient = trip.recipient;

  const scrollToEnd = () => scrollRef.current?.scrollToEnd({ animated: true });

  const call = () => {
    if (!recipient.phone) return;
    Linking.openURL(`tel:${recipient.phone.replace(/[^+\d]/g, '')}`);
  };

  const send = () => {
    const value = draft.trim();
    if (!value) return;
    setMessages((current) => [
      ...current,
      { id: `chat-${current.length + 1}`, from: 'me', text: value, time: nowTime() },
    ]);
    setDraft('');
    requestAnimationFrame(scrollToEnd);
  };

  return (
    <Screen>
      <ScreenHeader
        title={recipient.name}
        subtitle={`${recipient.role} • ${trip.destination}`}
        onBack
        right={
          <Pressable
            onPress={call}
            accessibilityRole="button"
            accessibilityLabel={`Telepon ${recipient.name}`}
            hitSlop={8}
            style={styles.callButton}
          >
            <Icon name="phone" size={20} color={colors.primaryContainer} />
          </Pressable>
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 56}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
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

          <Text variant="labelMd" color="textMuted" style={styles.sectionTitle}>
            CHAT
          </Text>

          <View style={styles.thread}>
            {messages.map((message) => {
              const mine = message.from === 'me';
              return (
                <View key={message.id} style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
                  <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                    <Text variant="bodyMd" color={mine ? 'onPrimary' : 'onSurface'}>
                      {message.text}
                    </Text>
                    <Text
                      variant="micro"
                      color={mine ? '#D7E3FF' : 'textMuted'}
                      style={styles.bubbleTime}
                    >
                      {message.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

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
          <View style={styles.inputWrap}>
            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={setDraft}
              placeholder="Tulis pesan"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              multiline
            />
          </View>
          <Pressable
            onPress={send}
            disabled={draft.trim().length === 0}
            accessibilityRole="button"
            accessibilityLabel="Kirim pesan"
            style={({ pressed }) => [
              styles.sendButton,
              draft.trim().length === 0 && styles.sendButtonDisabled,
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
    backgroundColor: colors.surfaceContainer,
  },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  contactCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoContainer,
  },
  inlineCall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  sectionTitle: { textTransform: 'uppercase', paddingHorizontal: 2 },
  thread: { gap: spacing.sm },
  bubbleRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    ...shadows.card,
  },
  bubbleTheirs: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderTopLeftRadius: radius.sm,
  },
  bubbleMine: { backgroundColor: colors.primaryContainer, borderTopRightRadius: radius.sm },
  bubbleTime: { alignSelf: 'flex-end' },
  tripLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  inputWrap: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.canvas,
  },
  input: { fontSize: 15, color: colors.ink, paddingVertical: spacing.sm },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  sendButtonDisabled: { opacity: 0.4 },
});
