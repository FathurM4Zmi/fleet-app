import { useEffect, useRef, useState } from 'react';
import {
  Image,
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

import { Icon, type IconName } from '@/components/Icon';
import { Badge, Button, Card, Screen, ScreenHeader, Text } from '@/components/ui';
import {
  supervisor,
  supervisorAutoReplies,
  supervisorCallLogs,
  supervisorMessages,
  supervisorTopics,
} from '@/data/supervisor';
import type { SupervisorMessage } from '@/data/supervisor';
import { capturePhoto } from '@/lib/photo';
import { colors, radius, shadows, spacing } from '@/theme';

const nowTime = () =>
  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const CALL_TYPE: Record<'outgoing' | 'incoming' | 'missed', { icon: IconName; label: string }> = {
  outgoing: { icon: 'phone', label: 'Panggilan keluar' },
  incoming: { icon: 'phone', label: 'Panggilan masuk' },
  missed: { icon: 'cancel', label: 'Tidak terjawab' },
};

export default function SupervisorScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [messages, setMessages] = useState<SupervisorMessage[]>(supervisorMessages);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const scrollToEnd = () => scrollRef.current?.scrollToEnd({ animated: true });

  const append = (message: Omit<SupervisorMessage, 'id' | 'time'>) => {
    setMessages((current) => [
      ...current,
      { ...message, id: `sup-msg-${current.length + 1}`, time: nowTime() },
    ]);
    requestAnimationFrame(scrollToEnd);
  };

  const queueAutoReply = () => {
    setTyping(true);
    const timer = setTimeout(() => {
      setTyping(false);
      setMessages((current) => [
        ...current,
        {
          id: `sup-msg-${current.length + 1}`,
          from: 'supervisor',
          kind: 'text',
          text: supervisorAutoReplies[replyIndex % supervisorAutoReplies.length],
          time: nowTime(),
        },
      ]);
      setReplyIndex((index) => index + 1);
      requestAnimationFrame(scrollToEnd);
    }, 1500);
    timers.current.push(timer);
  };

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    append({ from: 'driver', kind: 'text', text: value, status: 'sent' });
    setDraft('');
    queueAutoReply();
  };

  const attachPhoto = async () => {
    const uri = await capturePhoto();
    if (uri) {
      append({ from: 'driver', kind: 'image', imageUri: uri, status: 'sent' });
      queueAutoReply();
    }
  };

  const shareLocation = () => {
    append({
      from: 'driver',
      kind: 'location',
      text: 'Lokasi saat ini • Jl. Raya Cikarang No. 88',
      status: 'sent',
    });
    queueAutoReply();
  };

  const call = (number: string) => {
    Linking.openURL(`tel:${number.replace(/[^+\d]/g, '')}`);
  };

  const startChat = () => {
    scrollToEnd();
    inputRef.current?.focus();
  };

  const pickTopic = (message: string) => {
    setDraft(message);
    inputRef.current?.focus();
  };

  return (
    <Screen>
      <ScreenHeader title="Hubungi Supervisor" subtitle="Bantuan operasional" onBack />

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
          {/* Supervisor card */}
          <Card shadow style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View>
                <View style={styles.avatar}>
                  <Text variant="headlineSm" color="onPrimary">
                    {supervisor.initials}
                  </Text>
                </View>
                <View style={styles.avatarDot} />
              </View>
              <View style={styles.flex}>
                <View style={styles.nameRow}>
                  <Text variant="headlineSm" numberOfLines={1} style={styles.flex}>
                    {supervisor.name}
                  </Text>
                  <Badge label={supervisor.availability} tone="success" />
                </View>
                <Text variant="labelMd" color="textSecondary">
                  {supervisor.role}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {supervisor.site} • {supervisor.shift}
                </Text>
              </View>
            </View>

            <View style={styles.infoRows}>
              <InfoRow
                icon="schedule"
                label="Jam kerja"
                value={supervisor.workingHours}
              />
              <InfoRow
                icon="timer"
                label="Respons rata-rata"
                value={supervisor.responseTime}
              />
              <Pressable
                onPress={() => call(supervisor.phone)}
                accessibilityRole="button"
                accessibilityLabel="Telepon supervisor"
                style={({ pressed }) => [styles.infoRow, pressed && styles.pressed]}
              >
                <Icon name="phone" size={18} color={colors.primaryContainer} />
                <Text variant="bodyMd" color="textSecondary" style={styles.flex}>
                  Nomor telepon
                </Text>
                <Text variant="labelLg" color="primaryContainer">
                  {supervisor.phone}
                </Text>
              </Pressable>
            </View>

            <View style={styles.contactActions}>
              <Button
                label="Telepon"
                icon="phone"
                size="md"
                onPress={() => call(supervisor.phone)}
                style={styles.contactAction}
              />
              <Button
                label="Chat"
                icon="chatBubble"
                variant="secondary"
                size="md"
                onPress={startChat}
                style={styles.contactAction}
              />
            </View>
          </Card>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <QuickAction
              icon="emergency"
              label="Darurat"
              tone="critical"
              onPress={() => call(supervisor.emergencyPhone)}
            />
            <QuickAction icon="location" label="Kirim lokasi" onPress={shareLocation} />
            <QuickAction icon="camera" label="Foto bukti" onPress={attachPhoto} />
          </View>

          {/* Topics */}
          <View style={styles.section}>
            <Text variant="labelMd" color="textMuted" style={styles.sectionTitle}>
              TOPIK PESAN CEPAT
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickRow}
            >
              {supervisorTopics.map((topic) => (
                <Pressable
                  key={topic.key}
                  onPress={() => pickTopic(topic.message)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.quickChip, pressed && styles.pressed]}
                >
                  <Icon name="flag" size={15} color={colors.primaryContainer} />
                  <Text variant="labelMd" color="primaryContainer">
                    {topic.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Chat thread */}
          <Text variant="labelMd" color="textMuted" style={styles.sectionTitle}>
            CHAT
          </Text>

          <View style={styles.dayDivider}>
            <View style={styles.dayLine} />
            <Text variant="labelSm" color="textMuted">
              Hari ini
            </Text>
            <View style={styles.dayLine} />
          </View>

          <View style={styles.thread}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {typing ? (
              <View style={styles.bubbleRow}>
                <View style={[styles.bubble, styles.bubbleTheirs, styles.typing]}>
                  <Text variant="caption" color="textSecondary">
                    {supervisor.name.split(' ')[0]} sedang mengetik…
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Call history */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text variant="labelMd" color="textMuted" style={styles.sectionTitle}>
                RIWAYAT PANGGILAN
              </Text>
              <Text variant="labelSm" color="textMuted">
                3 terakhir
              </Text>
            </View>
            <Card padded={false} shadow style={styles.overflow}>
              {supervisorCallLogs.map((log, index) => {
                const meta = CALL_TYPE[log.type];
                const missed = log.type === 'missed';
                return (
                  <View key={log.id}>
                    <Pressable
                      onPress={() => call(supervisor.phone)}
                      accessibilityRole="button"
                      style={({ pressed }) => [styles.callRow, pressed && styles.pressed]}
                    >
                      <View
                        style={[
                          styles.callIcon,
                          missed && { backgroundColor: colors.criticalContainer },
                        ]}
                      >
                        <Icon
                          name={meta.icon}
                          size={16}
                          color={missed ? colors.critical : colors.success}
                        />
                      </View>
                      <View style={styles.flex}>
                        <Text variant="bodyBold" numberOfLines={1}>
                          {meta.label}
                        </Text>
                        <Text variant="caption" color="textSecondary">
                          {log.time}
                        </Text>
                      </View>
                      <Text variant="labelMd" color="textSecondary">
                        {log.duration}
                      </Text>
                    </Pressable>
                    {index < supervisorCallLogs.length - 1 ? (
                      <View style={styles.rowDivider} />
                    ) : null}
                  </View>
                );
              })}
            </Card>
          </View>

          <Text variant="caption" color="textMuted" align="center">
            Pesan dan panggilan tercatat pada riwayat trip dan tidak dapat dihapus.
          </Text>
        </ScrollView>

        {/* Composer */}
        <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable
            onPress={attachPhoto}
            accessibilityRole="button"
            accessibilityLabel="Lampirkan foto"
            style={({ pressed }) => [styles.attachButton, pressed && styles.pressed]}
          >
            <Icon name="camera" size={20} color={colors.primaryContainer} />
          </Pressable>

          <View style={styles.inputWrap}>
            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={setDraft}
              placeholder="Tulis pesan ke supervisor"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              multiline
            />
          </View>

          <Pressable
            onPress={() => send(draft)}
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

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={18} color={colors.textSecondary} />
      <Text variant="bodyMd" color="textSecondary" style={styles.flex}>
        {label}
      </Text>
      <Text variant="labelMd">{value}</Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  tone = 'default',
  onPress,
}: {
  icon: IconName;
  label: string;
  tone?: 'default' | 'critical';
  onPress: () => void;
}) {
  const critical = tone === 'critical';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.quickAction,
        critical && styles.quickActionCritical,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.quickActionIcon, critical && styles.quickActionIconCritical]}>
        <Icon
          name={icon}
          size={20}
          color={critical ? colors.critical : colors.primaryContainer}
        />
      </View>
      <Text variant="labelMd" align="center" color={critical ? 'critical' : 'onSurface'}>
        {label}
      </Text>
    </Pressable>
  );
}

function MessageBubble({ message }: { message: SupervisorMessage }) {
  const mine = message.from === 'driver';

  return (
    <View style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        {message.kind === 'image' && message.imageUri ? (
          <Image source={{ uri: message.imageUri }} style={styles.bubbleImage} resizeMode="cover" />
        ) : null}

        {message.kind === 'location' ? (
          <View style={styles.locationBlock}>
            <View style={styles.locationMap}>
              <Icon name="location" size={22} color={colors.primaryContainer} />
            </View>
            <Text variant="labelMd" color={mine ? 'onPrimary' : 'onSurface'}>
              {message.text}
            </Text>
          </View>
        ) : message.text ? (
          <Text variant="bodyMd" color={mine ? 'onPrimary' : 'onSurface'}>
            {message.text}
          </Text>
        ) : null}

        <View style={styles.bubbleMeta}>
          <Text variant="micro" color={mine ? '#D7E3FF' : 'textMuted'}>
            {message.time}
          </Text>
          {mine ? (
            <Icon
              name={message.status === 'read' ? 'success' : 'check'}
              size={12}
              color="#D7E3FF"
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.85 },
  overflow: { overflow: 'hidden' },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  contactCard: { gap: spacing.md },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

  infoRows: {
    gap: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLow,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 34,
  },
  contactActions: { flexDirection: 'row', gap: spacing.sm },
  contactAction: { flex: 1 },

  quickActions: { flexDirection: 'row', gap: spacing.sm },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  quickActionCritical: { borderColor: '#F5C2B8' },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  quickActionIconCritical: { backgroundColor: colors.criticalContainer },

  section: { gap: spacing.sm },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { textTransform: 'uppercase', paddingHorizontal: 2 },

  quickRow: { gap: spacing.sm, paddingVertical: spacing.xs },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },

  dayDivider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dayLine: { flex: 1, height: 1, backgroundColor: colors.divider },

  thread: { gap: spacing.sm },
  bubbleRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    gap: spacing.xs,
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
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 3,
  },
  bubbleImage: {
    width: 190,
    height: 130,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceLow,
  },
  locationBlock: { gap: spacing.xs },
  locationMap: {
    width: 190,
    height: 84,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  typing: { paddingVertical: spacing.sm + 2 },

  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  callIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successContainer,
  },
  rowDivider: { height: 1, backgroundColor: colors.divider, marginLeft: spacing.md },

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
  attachButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
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
