import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Button, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { toCoaching } from '@/data/adapters';
import { useCoaching } from '@/hooks/api/useDriverData';
import { insightApi } from '@/lib/api/endpoints';
import { capturePhoto, captureVideo } from '@/lib/photo';
import { colors, radius, spacing } from '@/theme';

const NOTE_LIMIT = 200;

export default function CoachingUpdateScreen() {
  const insets = useSafeAreaInsets();
  const coachingQuery = useCoaching();
  const coachingPlan = coachingQuery.data ? toCoaching(coachingQuery.data).plan : null;
  const [note, setNote] = useState('');
  const [photoA, setPhotoA] = useState<string>();
  const [photoB, setPhotoB] = useState<string>();
  const [video, setVideo] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!coachingPlan) {
    return (
      <Screen>
        <ScreenHeader title="Perbarui Progres" onBack />
        <EmptyState
          icon="school"
          title="Belum ada rencana coaching"
          description={coachingQuery.error?.message ?? 'Supervisor belum menetapkan rencana coaching.'}
        />
      </Screen>
    );
  }

  const done = coachingPlan.milestones.filter((milestone) => milestone.state === 'done').length;
  const total = coachingPlan.milestones.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const save = async () => {
    if (saving || !coachingPlan.id) return;
    setSaving(true);
    setError(null);
    try {
      await insightApi.updateCoaching(coachingPlan.id, 'Completed');
      router.back();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Gagal menyimpan progres.');
    } finally {
      setSaving(false);
    }
  };

  const evidence = [
    { key: 'photo-1', label: 'Foto 1', uri: photoA, set: setPhotoA, capture: capturePhoto },
    { key: 'photo-2', label: 'Foto 2', uri: photoB, set: setPhotoB, capture: capturePhoto },
    { key: 'video', label: 'Video', uri: video, set: setVideo, capture: captureVideo },
  ];

  return (
    <Screen style={styles.root}>
      <Pressable style={styles.scrim} onPress={() => router.back()} accessibilityLabel="Tutup" />

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.handle} />

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Icon name="sync" size={24} color={colors.primaryContainer} />
            </View>
            <Text variant="headlineMd" align="center">
              Perbarui Progres
            </Text>
            <Text variant="caption" color="textSecondary" align="center">
              {coachingPlan.title}
            </Text>

            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Tutup modal"
              hitSlop={8}
              style={styles.close}
            >
              <Icon name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.summary}>
            <View style={styles.rowBetween}>
              <Text variant="labelMd" color="onSurfaceVariant">
                {done} dari {total} milestone selesai
              </Text>
              <View style={styles.percentChip}>
                <Text variant="labelSm" color="onPrimary">
                  {percent}%
                </Text>
              </View>
            </View>

            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${percent}%` }]} />
            </View>
          </View>

          <View>
            <View style={[styles.rowBetween, styles.sectionHead]}>
              <Text variant="labelSm" color="textMuted" style={styles.tracked}>
                MILESTONE
              </Text>
              <Text variant="labelSm" color="textMuted">
                Status Terbaru
              </Text>
            </View>

            <View style={styles.milestoneList}>
              {coachingPlan.milestones.map((milestone) => {
                const isDone = milestone.state === 'done';
                const isWaiting = milestone.state === 'waiting';
                const isLocked = milestone.state === 'locked';

                return (
                  <View
                    key={milestone.key}
                    style={[styles.milestoneRow, isWaiting && styles.milestoneRowActive]}
                  >
                    <View style={styles.milestoneLeft}>
                      <View
                        style={[
                          styles.checkbox,
                          isDone && styles.checkboxDone,
                          isLocked && styles.checkboxLocked,
                        ]}
                      >
                        {isDone ? <Icon name="check" size={14} color={colors.onPrimary} /> : null}
                      </View>
                      <Text
                        variant="labelMd"
                        color={isDone || isLocked ? 'textMuted' : 'onSurface'}
                        style={isDone ? styles.struck : undefined}
                      >
                        {milestone.label}
                      </Text>
                    </View>

                    {isWaiting ? (
                      <View style={styles.waitingChip}>
                        <Text variant="labelSm" color="warning">
                          {milestone.note}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.milestoneNote}>
                        {isLocked ? (
                          <Icon name="lock" size={13} color={colors.textMuted} />
                        ) : null}
                        <Text variant="labelSm" color="textMuted">
                          {milestone.note}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View>
            <Text variant="labelSm" color="textMuted" style={[styles.tracked, styles.sectionHead]}>
              CATATAN UNTUK SUPERVISOR
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              maxLength={NOTE_LIMIT}
              multiline
              placeholder="Contoh: sudah menyelesaikan 3 sesi latihan"
              placeholderTextColor={colors.textMuted}
              style={styles.notes}
            />
            <Text variant="labelSm" color="textMuted" align="right" style={styles.counter}>
              {note.length}/{NOTE_LIMIT}
            </Text>
          </View>

          <View>
            <Text variant="labelSm" color="textMuted" style={[styles.tracked, styles.sectionHead]}>
              FOTO / VIDEO BUKTI
            </Text>

            <View style={styles.evidenceRow}>
              {evidence.map((tile) => (
                <Pressable
                  key={tile.key}
                  onPress={async () => {
                    const uri = await tile.capture();
                    if (uri) tile.set(uri);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={tile.label}
                  style={[styles.evidenceTile, tile.uri ? styles.evidenceFilled : styles.evidenceEmpty]}
                >
                  {tile.uri ? (
                    <>
                      {tile.key === 'video' ? (
                        <Icon name="play" size={22} color={colors.onPrimary} />
                      ) : (
                        <Image source={{ uri: tile.uri }} style={styles.evidenceImage} resizeMode="cover" />
                      )}
                      <Pressable
                        onPress={() => tile.set(undefined)}
                        accessibilityRole="button"
                        accessibilityLabel={`Hapus ${tile.label}`}
                        hitSlop={6}
                        style={styles.evidenceRemove}
                      >
                        <Icon name="close" size={12} color={colors.onPrimary} />
                      </Pressable>
                    </>
                  ) : (
                    <>
                      <Icon name="camera" size={20} color={colors.textSecondary} />
                      <Text variant="labelSm" color="textSecondary">
                        {tile.label}
                      </Text>
                    </>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={saving ? 'Menyimpan…' : 'Simpan Progres'}
            disabled={saving}
            onPress={save}
          />
          {error ? (
            <Text variant="caption" color="critical" align="center">
              {error}
            </Text>
          ) : null}
          <Button label="Batal" variant="secondary" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: 'transparent' },
  scrim: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)' },
  sheet: {
    maxHeight: '88%',
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

  header: { alignItems: 'center', gap: spacing.xs },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoContainer,
    marginBottom: spacing.xs,
  },
  close: { position: 'absolute', top: 0, right: -spacing.sm },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  tracked: { letterSpacing: 0.8, textTransform: 'uppercase' },
  sectionHead: { marginBottom: spacing.sm },

  summary: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },
  percentChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryContainer,
  },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.divider, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primaryContainer },

  milestoneList: { borderTopWidth: 1, borderTopColor: colors.surfaceLow },
  milestoneRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLow,
  },
  milestoneRowActive: {
    borderRadius: radius.input,
    backgroundColor: 'rgba(253,243,231,0.6)',
  },
  milestoneLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2, flex: 1 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.borderIdle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { borderColor: colors.primaryContainer, backgroundColor: colors.primaryContainer },
  checkboxLocked: { backgroundColor: '#F3F4F6' },
  struck: { textDecorationLine: 'line-through' },
  milestoneNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  waitingChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FEF3C7',
  },

  notes: {
    minHeight: 96,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  counter: { marginTop: spacing.xs },

  evidenceRow: { flexDirection: 'row', gap: spacing.sm + 4 },
  evidenceTile: {
    flex: 1,
    height: 80,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    overflow: 'hidden',
  },
  evidenceEmpty: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    backgroundColor: '#F9FAFB',
  },
  evidenceFilled: { backgroundColor: colors.surfaceContainer },
  evidenceImage: { width: '100%', height: '100%' },
  evidenceRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,24,39,0.6)',
  },

  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
