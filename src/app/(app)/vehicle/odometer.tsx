import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Button, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { toVehicle } from '@/data/adapters';
import { useVehicle } from '@/hooks/api/useDriverData';
import { ApiError } from '@/lib/api/client';
import { vehicleApi } from '@/lib/api/endpoints';
import { formatKm } from '@/lib/format';
import { enqueue } from '@/lib/offline/queue';
import { capturePhoto } from '@/lib/photo';
import { uploadImage } from '@/lib/upload';
import { colors, radius, shadows, spacing, typography } from '@/theme';

const MAX_REASON = 200;

export default function OdometerCorrectionScreen() {
  const insets = useSafeAreaInsets();
  const vehicleQuery = useVehicle();
  const vehicle = vehicleQuery.data ? toVehicle(vehicleQuery.data) : undefined;
  const recordedKm = vehicle?.odometerKm ?? 0;

  const [requested, setRequested] = useState('');
  const [reason, setReason] = useState('');
  const [odometerPhoto, setOdometerPhoto] = useState<string | undefined>();
  const [supportPhoto, setSupportPhoto] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestedKm = Number(requested) || 0;
  const canSubmit =
    Boolean(vehicle) &&
    requestedKm > 0 &&
    requestedKm !== recordedKm &&
    reason.trim().length >= 5 &&
    Boolean(odometerPhoto) &&
    !saving;

  const pickOdometer = async () => {
    const uri = await capturePhoto();
    if (uri) setOdometerPhoto(uri);
  };

  const pickSupport = async () => {
    const uri = await capturePhoto();
    if (uri) setSupportPhoto(uri);
  };

  const submit = async () => {
    if (!canSubmit || !vehicle) return;
    setSaving(true);
    setError(null);
    try {
      const photoPaths: string[] = [];
      for (const uri of [odometerPhoto, supportPhoto]) {
        if (!uri) continue;
        try {
          photoPaths.push(await uploadImage(uri, 'odometer'));
        } catch {
          photoPaths.push(uri);
        }
      }

      const payload = { requestedKm, reason: reason.trim(), photoPaths };
      try {
        await vehicleApi.submitOdometerCorrection(payload);
      } catch (caught) {
        if (caught instanceof ApiError && caught.isNetworkError) {
          await enqueue({
            kind: 'odometer',
            label: 'Koreksi odometer',
            path: '/api/driver/vehicle/odometer-correction',
            method: 'POST',
            body: payload,
          });
        } else {
          throw caught;
        }
      }

      router.replace('/vehicle/odometer/submitted');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Gagal mengajukan koreksi.');
    } finally {
      setSaving(false);
    }
  };

  if (!vehicle) {
    return (
      <Screen>
        <ScreenHeader title="Koreksi Odometer" onBack />
        <EmptyState
          icon="truck"
          title="Kendaraan tidak ditemukan"
          description={vehicleQuery.error?.message ?? 'Belum ada unit yang ditugaskan.'}
        />
      </Screen>
    );
  }

  return (
    <View style={styles.root}>
      <Pressable
        style={styles.scrim}
        onPress={() => router.back()}
        accessibilityLabel="Tutup"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.handle} />

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Icon name="warning" size={28} color={colors.warning} />
              </View>
              <Text variant="headlineSm" align="center">
                Odometer Tidak Boleh Berkurang
              </Text>
              <Text variant="caption" color="secondary" align="center" style={styles.headerNote}>
                Nilai odometer saat ini lebih rendah dari catatan sebelumnya
              </Text>
            </View>

            {/* Comparison */}
            <View style={styles.compare}>
              <View style={styles.compareSide}>
                <Text variant="labelMd" color="secondary" style={styles.upper}>
                  TERAKHIR
                </Text>
                <Text variant="headlineSm">{formatKm(recordedKm)}</Text>
              </View>
              <View style={styles.compareArrow}>
                <Icon name="forward" size={18} color={colors.secondary} />
              </View>
              <View style={[styles.compareSide, styles.compareRight]}>
                <Text variant="labelMd" color="critical" style={styles.upper}>
                  DIINPUTKAN
                </Text>
                <Text variant="headlineSm" color="critical">
                  {requestedKm > 0 ? formatKm(requestedKm) : '—'}
                </Text>
              </View>
            </View>

            {/* Corrected value */}
            <View style={styles.fieldGroup}>
              <Text variant="labelMd" color="onSurfaceVariant" style={styles.upper}>
                ODOMETER YANG BENAR (KM)
              </Text>
              <TextInput
                value={requested}
                onChangeText={(value) => setRequested(value.replace(/[^0-9]/g, ''))}
                placeholder="Contoh: 147900"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                style={styles.kmInput}
              />
            </View>

            {/* Amber alert */}
            <View style={styles.alert}>
              <Icon name="info" size={20} color={colors.warning} />
              <Text variant="caption" color={colors.warning} style={styles.flex}>
                Ajukan koreksi dengan alasan. Data akan ditinjau supervisor.
              </Text>
            </View>

            {/* Reason */}
            <View style={styles.fieldGroup}>
              <Text variant="labelMd" color="onSurfaceVariant" style={styles.upper}>
                ALASAN KOREKSI
              </Text>
              <View style={styles.textarea}>
                <TextInput
                  value={reason}
                  onChangeText={(value) => setReason(value.slice(0, MAX_REASON))}
                  placeholder="Contoh: salah baca odometer"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  style={styles.textareaInput}
                />
              </View>
              <Text variant="labelMd" color="textMuted" align="right">
                {reason.length}/{MAX_REASON}
              </Text>
            </View>

            {/* Evidence */}
            <View style={styles.fieldGroup}>
              <View style={styles.evidenceHead}>
                <Text variant="labelMd" color="onSurfaceVariant" style={styles.upper}>
                  FOTO BUKTI
                </Text>
                <View style={styles.requiredChip}>
                  <Text variant="labelMd" color="onErrorContainer">
                    Wajib
                  </Text>
                </View>
              </View>
              <View style={styles.evidenceGrid}>
                <EvidenceTile
                  label="Foto odometer"
                  hint="*Wajib"
                  uri={odometerPhoto}
                  required
                  onPress={pickOdometer}
                  onClear={() => setOdometerPhoto(undefined)}
                />
                <EvidenceTile
                  label="Foto pendukung"
                  hint="Struk / Surat (Opsional)"
                  uri={supportPhoto}
                  onPress={pickSupport}
                  onClear={() => setSupportPhoto(undefined)}
                />
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <Icon name="shield" size={20} color={colors.secondary} />
              <Text variant="labelMd" color="secondary" style={styles.flex}>
                Koreksi tidak akan diproses tanpa foto bukti odometer.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {error ? (
              <Text variant="caption" color="critical" align="center">
                {error}
              </Text>
            ) : null}
            <Button
              label={saving ? 'Mengirim…' : 'Ajukan Koreksi'}
              icon="send"
              disabled={!canSubmit}
              onPress={submit}
            />
            <Button label="Batal" variant="secondary" onPress={() => router.back()} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function EvidenceTile({
  label,
  hint,
  uri,
  required = false,
  onPress,
  onClear,
}: {
  label: string;
  hint: string;
  uri?: string;
  required?: boolean;
  onPress: () => void;
  onClear: () => void;
}) {
  if (uri) {
    return (
      <View style={styles.evidenceFilled}>
        <Image source={{ uri }} style={styles.evidenceImage} resizeMode="cover" />
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel={`Hapus ${label}`}
          style={styles.evidenceDelete}
        >
          <Icon name="delete" size={16} color={colors.onPrimary} />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.evidenceTile, required && styles.evidenceTileRequired]}
    >
      <View style={[styles.evidenceIcon, required && styles.evidenceIconRequired]}>
        <Icon name={required ? 'camera' : 'add'} size={26} color={required ? colors.primary : colors.secondary} />
      </View>
      <Text variant="labelMd" color={required ? 'primaryContainer' : 'onSurfaceVariant'}>
        {label}
      </Text>
      <Text variant="labelSm" color={required ? 'critical' : 'secondary'} align="center">
        {hint}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.scrim },
  sheetWrap: { justifyContent: 'flex-end', maxHeight: '92%' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.sm,
    maxHeight: '92%',
    ...shadows.bar,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: spacing.md,
  },
  content: { paddingHorizontal: spacing.xl, gap: spacing.lg, paddingBottom: spacing.lg },
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },

  header: { alignItems: 'center', gap: spacing.xs },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF1E3',
    marginBottom: spacing.xs,
  },
  headerNote: { maxWidth: 300 },

  compare: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md + 2,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
  },
  compareSide: { flex: 1, gap: 2 },
  compareRight: { alignItems: 'flex-end' },
  compareArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighest,
    marginHorizontal: spacing.sm,
  },

  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: '#FDF1E3',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },

  fieldGroup: { gap: spacing.sm },
  kmInput: {
    ...typography.headlineSm,
    color: colors.ink,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  textarea: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  textareaInput: {
    ...typography.bodyMd,
    color: colors.ink,
    minHeight: 64,
    textAlignVertical: 'top',
    padding: 0,
  },

  evidenceHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  requiredChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.errorContainer,
  },
  evidenceGrid: { flexDirection: 'row', gap: spacing.md },
  evidenceTile: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
  },
  evidenceTileRequired: {
    borderColor: colors.primaryContainer,
    backgroundColor: 'rgba(233,237,255,0.6)',
  },
  evidenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighest,
    marginBottom: spacing.xs,
  },
  evidenceIconRequired: { backgroundColor: 'rgba(27,77,255,0.1)' },
  evidenceFilled: { flex: 1, aspectRatio: 1, borderRadius: radius.card, overflow: 'hidden' },
  evidenceImage: { width: '100%', height: '100%', backgroundColor: colors.surfaceContainer },
  evidenceDelete: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,24,39,0.6)',
  },

  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
  },

  footer: {
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
