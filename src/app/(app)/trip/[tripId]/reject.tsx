import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Button, Screen, Text } from '@/components/ui';
import { useTrip } from '@/hooks/useTrip';
import { formatDayDate, formatTime } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';

const NOTE_LIMIT = 200;

const REASONS = [
  'Sudah ada tugas lain',
  'Kendaraan bermasalah',
  'Lokasi terlalu jauh',
  'Beristirahat',
  'Lainnya',
] as const;

export default function RejectTripScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip, reject } = useTrip(tripId);
  const insets = useSafeAreaInsets();

  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showError, setShowError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = Boolean(reason) || note.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) {
      setShowError(true);
      return;
    }
    const detail = note.trim();
    const summary = reason ?? 'Lainnya';
    setSubmitting(true);
    setSubmitError(null);
    try {
      await reject(detail ? `${summary} — ${detail}` : summary);
      router.back();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Gagal mengirim penolakan. Coba lagi.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen style={styles.root}>
      <Pressable style={styles.scrim} onPress={() => router.back()} accessibilityLabel="Tutup" />

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.handle} />

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.warnIcon}>
              <Icon name="warning" size={28} color={colors.critical} />
            </View>
            <Text variant="headlineMd">Tolak Tugas Ini?</Text>
            {trip ? (
              <Text variant="caption" color="textSecondary" style={styles.headerSub}>
                {trip.destination} • {formatDayDate(trip.scheduledAt)} {formatTime(trip.scheduledAt)}
              </Text>
            ) : null}
          </View>

          <View style={[styles.alert, showError && styles.alertStrong]}>
            <Icon name="warning" size={18} color={colors.critical} />
            <Text variant="labelMd" color="critical" style={styles.flex}>
              {submitError
                ? submitError
                : showError && !canSubmit
                  ? 'Pilih alasan atau tulis catatan terlebih dahulu.'
                  : 'Alasan penolakan wajib diisi.'}
            </Text>
          </View>

          <View>
            <Text variant="labelMd" color="textSecondary" style={styles.sectionLabel}>
              ALASAN PENOLAKAN
            </Text>
            <View style={styles.chips}>
              {REASONS.map((item) => {
                const selected = reason === item;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setReason(item);
                      setShowError(false);
                    }}
                    style={({ pressed }) => [
                      styles.chip,
                      selected ? styles.chipSelected : styles.chipIdle,
                      pressed && styles.pressed,
                    ]}
                  >
                    {selected ? <Icon name="check" size={18} color={colors.onPrimary} /> : null}
                    <Text
                      variant="labelMd"
                      color={selected ? colors.onPrimary : colors.ink}
                      style={styles.chipLabel}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.noteWrap}>
            <TextInput
              value={note}
              onChangeText={(value) => {
                setNote(value.slice(0, NOTE_LIMIT));
                if (value.trim()) setShowError(false);
              }}
              placeholder="Tuliskan alasan Anda…"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              maxLength={NOTE_LIMIT}
              style={styles.noteInput}
            />
            <Text variant="micro" color="textMuted" style={styles.noteCount}>
              {note.length}/{NOTE_LIMIT}
            </Text>
          </View>

          <View style={styles.info}>
            <Icon name="info" size={18} color={colors.onSurfaceVariant} />
            <Text variant="micro" color="onSurfaceVariant" style={styles.flex}>
              Pengajuan Anda akan diteruskan ke supervisor untuk ditinjau.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={submitting ? 'Mengirim…' : 'Kirim Penolakan'}
            variant="destructive"
            icon="cancel"
            disabled={submitting}
            onPress={() => void handleSubmit()}
          />
          <Button label="Batal" variant="secondary" disabled={submitting} onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: 'transparent' },
  scrim: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)' },
  sheet: {
    maxHeight: '84%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: spacing.sm,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.outlineVariant,
  },
  body: { flexGrow: 0 },
  bodyContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.lg },
  flex: { flex: 1 },
  pressed: { opacity: 0.85 },

  header: { alignItems: 'center', gap: spacing.xs },
  headerSub: { textAlign: 'center' },
  warnIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.criticalContainer,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.2)',
    marginBottom: spacing.xs,
  },

  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.3)',
    backgroundColor: colors.criticalContainer,
  },
  alertStrong: { borderColor: colors.critical, borderWidth: 1.5 },

  sectionLabel: { textTransform: 'uppercase', marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
  },
  chipIdle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  chipSelected: { backgroundColor: colors.primaryContainer },
  chipLabel: { fontSize: 13 },

  noteWrap: { position: 'relative' },
  noteInput: {
    minHeight: 84,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  noteCount: { position: 'absolute', bottom: spacing.sm, right: spacing.md },

  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },

  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
