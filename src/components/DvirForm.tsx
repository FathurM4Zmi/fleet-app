import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Button, Card, Screen, ScreenBody, ScreenHeader, SegmentedControl, Text } from '@/components/ui';
import type { DvirItem, DvirResult } from '@/data/types';
import { useDvirForm } from '@/hooks/useDvirForm';
import { useTrip } from '@/hooks/useTrip';
import { formatNumber } from '@/lib/format';
import { capturePhoto } from '@/lib/photo';
import { colors, radius, spacing } from '@/theme';

const NOTE_LIMIT = 120;

const RESULTS: { value: DvirResult; label: string; icon?: 'check' | 'close' }[] = [
  { value: 'pass', label: 'Pass', icon: 'check' },
  { value: 'fail', label: 'Fail', icon: 'close' },
  { value: 'na', label: 'N/A' },
];

export interface DvirFormProps {
  tripId: string;
  type: 'pre' | 'post';
}

export function DvirForm({ tripId, type }: DvirFormProps) {
  const { trip, vehicle } = useTrip(tripId);
  const {
    inspection,
    groups,
    answeredCount,
    failureCount,
    totalCount,
    canSubmit,
    start,
    setResult,
    setNote,
    setPhoto,
    setOdometer,
    submit,
  } = useDvirForm(tripId, type);

  const insets = useSafeAreaInsets();
  const [odometerText, setOdometerText] = useState(() => String(vehicle?.odometerKm ?? ''));

  // Materialise the draft inspection once so every row has a stable target.
  useEffect(() => {
    if (!inspection) start();
  }, [inspection, start]);

  const isPre = type === 'pre';
  const progress = totalCount > 0 ? answeredCount / totalCount : 0;
  const odometerKm = Number(odometerText) || 0;
  const deltaKm = vehicle ? odometerKm - vehicle.odometerKm : 0;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!vehicle || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submit(vehicle.id);
      const result = failureCount > 0 ? 'failed' : 'success';
      router.replace(`/dvir/${tripId}/submitted?result=${result}&type=${type}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Gagal mengirim inspeksi. Coba lagi.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader
        title={isPre ? 'Inspeksi Kendaraan' : 'Inspeksi Pasca Perjalanan'}
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Bantuan" hitSlop={8}>
            <Icon name="help" size={22} color={colors.textSecondary} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={150}>
        <View style={styles.stack}>
          <SegmentedControl
            options={[
              { label: 'Pre-Trip', value: 'pre' },
              { label: 'Post-Trip', value: 'post' },
            ]}
            value={type}
            onChange={(next) => {
              if (next === type) return;
              router.replace(`/dvir/${tripId}/${next === 'pre' ? 'pre-trip' : 'post-trip'}`);
            }}
          />

          <VehicleCard plate={vehicle?.plate ?? '—'} model={vehicle?.model ?? '—'} />

          {isPre ? (
            <View style={styles.online}>
              <Icon name="online" size={18} color={colors.success} />
              <Text variant="caption" color={colors.success} style={styles.flex}>
                Terhubung online. Laporan langsung terkirim ke server.
              </Text>
            </View>
          ) : (
            <Card>
              <View style={styles.contextRow}>
                <View style={styles.flex}>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {trip?.code ?? '—'} • {trip?.destination ?? '—'}
                  </Text>
                  <Text variant="labelMd" style={styles.contextSub}>
                    Tujuan Akhir Rute Logistik
                  </Text>
                </View>
                <View style={styles.doneChip}>
                  <Icon name="success" size={16} color={colors.success} />
                  <Text variant="labelMd" color="success">
                    Selesai
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {!isPre ? (
            <Card style={styles.odometerCard}>
              <View style={styles.rowBetween}>
                <Text variant="labelMd" color="textSecondary" style={styles.tracked}>
                  ODOMETER AKHIR
                </Text>
                <View style={styles.requiredRow}>
                  <Icon name="odometer" size={16} color={colors.primaryContainer} />
                  <Text variant="labelMd" color="primaryContainer">
                    Wajib Diisi
                  </Text>
                </View>
              </View>
              <View style={styles.odometerField}>
                <TextInput
                  value={odometerText}
                  onChangeText={(value) => {
                    const digits = value.replace(/[^0-9]/g, '').slice(0, 7);
                    setOdometerText(digits);
                    setOdometer(Number(digits) || 0);
                  }}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  style={styles.odometerInput}
                />
                <View style={styles.odometerUnit}>
                  <Text variant="labelMd" color="onSurfaceVariant">
                    km
                  </Text>
                </View>
              </View>
              {vehicle && deltaKm > 0 ? (
                <View style={styles.deltaRow}>
                  <Icon name="arrowUp" size={16} color={colors.success} />
                  <Text variant="labelMd" color="success">
                    Naik dari {formatNumber(vehicle.odometerKm)} km (+{formatNumber(deltaKm)} km)
                  </Text>
                </View>
              ) : null}
            </Card>
          ) : null}

          <Card>
            <View style={styles.rowBetween}>
              <Text variant="labelMd">{answeredCount} dari {totalCount} item diperiksa</Text>
              <View style={[styles.tallyChip, failureCount > 0 ? styles.tallyFail : styles.tallyPass]}>
                <View
                  style={[
                    styles.tallyDot,
                    { backgroundColor: failureCount > 0 ? colors.critical : colors.success },
                  ]}
                />
                <Text variant="labelMd" color={failureCount > 0 ? 'critical' : 'success'}>
                  {failureCount > 0 ? `${failureCount} gagal` : 'Semua lolos'}
                </Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
            </View>
          </Card>

          {groups.map((group) => (
            <View key={group.group} style={styles.group}>
              <Text variant="labelMd" color="textSecondary" style={styles.groupTitle}>
                {group.group.toUpperCase()}
              </Text>
              {group.items.map((item) => (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  onResult={setResult}
                  onNote={setNote}
                  onPhoto={setPhoto}
                />
              ))}
            </View>
          ))}

          {isPre ? (
            <View style={styles.hint}>
              <Icon name="info" size={18} color={colors.primaryContainer} />
              <Text variant="caption" color="onSurfaceVariant" style={styles.flex}>
                Periksa seluruh ban, rem, dan lampu sebelum memulai perjalanan demi keselamatan
                bersama.
              </Text>
            </View>
          ) : null}
        </View>
      </ScreenBody>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.footerHint}>
          <Icon name="send" size={16} color={colors.primaryContainer} />
          <Text variant="caption" color="textSecondary">
            Laporan DVIR terkirim untuk ditinjau.
          </Text>
        </View>
        {submitError ? (
          <View style={styles.errorBanner} accessibilityLiveRegion="polite">
            <Icon name="error" size={18} color={colors.critical} />
            <Text variant="caption" color="critical" style={styles.flex}>
              {submitError}
            </Text>
          </View>
        ) : null}
        <View style={styles.footerRow}>
          <Button
            label="Simpan Draft"
            variant="secondary"
            icon="save"
            style={styles.flex}
            onPress={() => router.back()}
          />
          <Button
            label={submitting ? 'Mengirim…' : 'Kirim Laporan'}
            iconAfter="forward"
            disabled={!canSubmit || submitting}
            style={styles.flex}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </Screen>
  );
}

function VehicleCard({ plate, model }: { plate: string; model: string }) {
  return (
    <Card>
      <View style={styles.rowBetween}>
        <View style={styles.vehicleIdentity}>
          <View style={styles.vehicleIcon}>
            <Icon name="truck" size={22} color={colors.primaryContainer} />
          </View>
          <View>
            <Text variant="labelSm" color="textSecondary" style={styles.tracked}>
              UNIT ARMADA
            </Text>
            <Text variant="headlineSm">{plate}</Text>
          </View>
        </View>
        <View style={styles.modelChip}>
          <Text variant="labelMd" color="onSurfaceVariant">
            {model}
          </Text>
        </View>
      </View>
    </Card>
  );
}

function ChecklistRow({
  item,
  onResult,
  onNote,
  onPhoto,
}: {
  item: DvirItem;
  onResult: (itemId: string, result: DvirResult) => void;
  onNote: (itemId: string, note: string) => void;
  onPhoto: (itemId: string, photoUri: string) => void;
}) {
  const failed = item.result === 'fail';

  return (
    <Card style={failed ? styles.rowFailed : undefined}>
      <View style={styles.rowHeader}>
        <View style={styles.rowLabel}>
          {failed ? (
            <Icon name="error" size={20} color={colors.critical} />
          ) : (
            <View style={styles.rowBullet} />
          )}
          <Text variant={failed ? 'bodyBold' : 'titleMd'} numberOfLines={1} style={styles.flex}>
            {item.label}
          </Text>
        </View>
        <View style={styles.toggle}>
          {RESULTS.map((option) => {
            const active = item.result === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => onResult(item.id, option.value)}
                style={[
                  styles.toggleOption,
                  active && { backgroundColor: TONE[option.value].bg },
                ]}
              >
                {active && option.icon ? (
                  <Icon name={option.icon} size={15} color={colors.onPrimary} />
                ) : null}
                <Text
                  variant="labelMd"
                  color={active ? colors.onPrimary : colors.textSecondary}
                  style={styles.toggleLabel}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {failed ? (
        <View style={styles.failArea}>
          <View style={styles.rowBetween}>
            <Text variant="labelMd" color="critical">
              Temuan Masalah Dideteksi
            </Text>
            <View style={styles.mandatoryChip}>
              <Text variant="labelSm" color="critical">
                Wajib Foto &amp; Catatan
              </Text>
            </View>
          </View>

          <PhotoTile
            uri={item.photoUri}
            onCapture={async () => {
              const uri = await capturePhoto();
              if (uri) onPhoto(item.id, uri);
            }}
          />

          <View>
            <Text variant="caption" color="onSurfaceVariant" style={styles.noteLabel}>
              Catatan Kerusakan
            </Text>
            <View style={styles.noteWrap}>
              <TextInput
                value={item.note ?? ''}
                onChangeText={(value) => onNote(item.id, value.slice(0, NOTE_LIMIT))}
                placeholder="Tambahkan catatan"
                placeholderTextColor={colors.textMuted}
                style={styles.noteInput}
              />
              {item.note ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Hapus catatan"
                  hitSlop={8}
                  onPress={() => onNote(item.id, '')}
                  style={styles.noteClear}
                >
                  <Icon name="cancel" size={18} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}
    </Card>
  );
}

function PhotoTile({ uri, onCapture }: { uri?: string; onCapture: () => void }) {
  if (uri) {
    return (
      <Pressable onPress={onCapture} accessibilityRole="button" style={styles.photoPreview}>
        <Image source={{ uri }} style={styles.photoImage} resizeMode="cover" />
        <View style={styles.photoBadge}>
          <Icon name="camera" size={14} color={colors.onPrimary} />
          <Text variant="labelSm" color="onPrimary">
            Ganti
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onCapture}
      accessibilityRole="button"
      style={({ pressed }) => [styles.photoTile, pressed && styles.pressed]}
    >
      <View style={styles.photoIcon}>
        <Icon name="camera" size={22} color={colors.critical} />
      </View>
      <Text variant="titleMd">Foto kondisi wajib diunggah</Text>
      <Text variant="labelSm" color="textMuted" style={styles.photoHint}>
        Ketuk untuk buka kamera (kualitas tinggi &amp; geotag)
      </Text>
    </Pressable>
  );
}

const TONE: Record<DvirResult, { bg: string }> = {
  pass: { bg: colors.success },
  fail: { bg: colors.critical },
  na: { bg: colors.neutral },
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  stack: { gap: spacing.md, paddingTop: spacing.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  tracked: { letterSpacing: 0.8 },
  pressed: { opacity: 0.85 },

  online: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: colors.successContainer,
  },

  contextRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  contextSub: { marginTop: 2 },
  doneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#B9E6D5',
    backgroundColor: colors.successContainer,
  },

  vehicleIdentity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoContainer,
  },
  modelChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceContainer,
  },

  odometerCard: { borderWidth: 2, borderColor: '#B9C3FF' },
  requiredRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  odometerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },
  odometerInput: {
    flex: 1,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    color: colors.ink,
    padding: 0,
  },
  odometerUnit: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceHighest,
  },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },

  tallyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tallyFail: { backgroundColor: colors.criticalContainer, borderColor: '#F4B5B5' },
  tallyPass: { backgroundColor: colors.successContainer, borderColor: '#B9E6D5' },
  tallyDot: { width: 6, height: 6, borderRadius: 3 },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: colors.primaryContainer },

  group: { gap: spacing.sm },
  groupTitle: { paddingHorizontal: 2, marginTop: spacing.xs },

  rowFailed: { borderWidth: 2, borderColor: '#F4B5B5' },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  rowBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceLow,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  toggleLabel: { fontSize: 12 },

  failArea: {
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F4B5B5',
  },
  mandatoryChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.criticalContainer,
  },
  photoTile: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 140,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#F4B5B5',
    backgroundColor: colors.surface,
  },
  photoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.criticalContainer,
    marginBottom: spacing.xs,
  },
  photoHint: { textAlign: 'center' },
  photoPreview: {
    height: 160,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  photoImage: { width: '100%', height: '100%' },
  photoBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(17,24,39,0.7)',
  },
  noteLabel: { marginBottom: spacing.xs },
  noteWrap: { position: 'relative', justifyContent: 'center' },
  noteInput: {
    height: 44,
    paddingHorizontal: spacing.md,
    paddingRight: spacing.xxl,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderIdle,
    backgroundColor: colors.surface,
    fontSize: 14,
    color: colors.ink,
  },
  noteClear: { position: 'absolute', right: spacing.sm },

  hint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
  },

  footer: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  footerRow: { flexDirection: 'row', gap: spacing.md },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.critical,
    backgroundColor: colors.criticalContainer,
  },
});
