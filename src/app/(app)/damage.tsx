import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  BottomBar,
  Button,
  Card,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { capturePhoto } from '@/lib/photo';
import { useAppStore } from '@/store/app';
import { colors, radius, shadows, spacing, typography } from '@/theme';

const CATEGORIES = ['Mesin', 'Rem', 'Ban', 'Kelistrikan', 'Body', 'Lainnya'] as const;
const SEVERITIES = ['Rendah', 'Sedang', 'Tinggi', 'Berhenti Layanan'] as const;
const MAX_DESCRIPTION = 300;
const MAX_PHOTOS = 3;

const SEVERITY_TONE: Record<(typeof SEVERITIES)[number], { bg: string; border: string; fg: string }> = {
  Rendah: { bg: colors.successContainer, border: colors.success, fg: colors.success },
  Sedang: { bg: colors.warningContainer, border: colors.warning, fg: colors.warning },
  Tinggi: { bg: colors.criticalContainer, border: colors.critical, fg: colors.critical },
  'Berhenti Layanan': { bg: colors.criticalContainer, border: colors.critical, fg: colors.critical },
};

export default function DamageReportScreen() {
  const { state, dispatch } = useAppStore();
  const vehicle = state.vehicles[0];

  const [category, setCategory] = useState<string>('Mesin');
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>('Rendah');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const requiresPhoto = severity === 'Tinggi' || severity === 'Berhenti Layanan';
  const canSubmit = description.trim().length > 0 && (!requiresPhoto || photos.length > 0);

  const addPhoto = async () => {
    if (photos.length >= MAX_PHOTOS) return;
    const uri = await capturePhoto();
    if (uri) setPhotos((current) => [...current, uri]);
  };

  const submit = () => {
    if (!canSubmit) return;
    dispatch({
      type: 'damage/report',
      report: {
        vehicleId: vehicle?.id ?? 'veh-001',
        category,
        severity,
        description: description.trim(),
        photoUris: photos,
      },
    });
    setSubmitted(true);
  };

  return (
    <Screen>
      <ScreenHeader
        title="Laporkan Kerusakan"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Bantuan" hitSlop={8}>
            <Icon name="help" size={22} color={colors.secondary} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={140}>
        {/* Unit */}
        <Card shadow>
          <View style={styles.unitRow}>
            <View style={styles.unitIcon}>
              <Icon name="truck" size={26} color={colors.primaryContainer} />
            </View>
            <View style={styles.flex}>
              <Text variant="bodyBold">{vehicle?.plate ?? '—'}</Text>
              <Text variant="labelMd" color="secondary">
                {vehicle?.model ?? '—'} • CDD Box
              </Text>
            </View>
            <View style={styles.unitBadge}>
              <Text variant="labelMd" color={colors.success}>
                Unit Aktif
              </Text>
            </View>
          </View>
        </Card>

        {/* Online banner */}
        <View style={styles.online}>
          <Icon name="online" size={20} color={colors.success} />
          <Text variant="labelLg" color={colors.success} style={styles.flex}>
            Terhubung online. Laporan langsung dikirim ke tim teknis.
          </Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            KATEGORI KERUSAKAN
          </Text>
          <View style={styles.chipWrap}>
            {CATEGORIES.map((item) => {
              const active = item === category;
              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text variant="bodyMd" color={active ? 'onPrimary' : 'ink'}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Severity */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            SEVERITY
          </Text>
          <View style={styles.severityGrid}>
            {SEVERITIES.map((item) => {
              const active = item === severity;
              const tone = SEVERITY_TONE[item];
              return (
                <Pressable
                  key={item}
                  onPress={() => setSeverity(item)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.severityCell,
                    active && { backgroundColor: tone.bg, borderColor: tone.border, borderWidth: 2 },
                  ]}
                >
                  <Text
                    variant={active ? 'headlineSm' : 'bodyMd'}
                    color={active ? tone.fg : 'ink'}
                    align="center"
                    style={styles.severityLabel}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            DESKRIPSI
          </Text>
          <View style={styles.textarea}>
            <TextInput
              value={description}
              onChangeText={(value) => setDescription(value.slice(0, MAX_DESCRIPTION))}
              placeholder="Jelaskan kerusakan yang Anda temukan"
              placeholderTextColor={colors.textMuted}
              multiline
              style={styles.textareaInput}
            />
            <Text variant="labelMd" color="textMuted" align="right" style={styles.counter}>
              {description.length}/{MAX_DESCRIPTION}
            </Text>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <View style={styles.photoHead}>
            <Text variant="labelMd" color="textSecondary" style={styles.upper}>
              FOTO DEFECT
            </Text>
            <Text variant="labelMd" color={requiresPhoto ? 'critical' : 'secondary'}>
              {requiresPhoto ? 'Wajib untuk severity ini' : 'Opsional'}
            </Text>
          </View>
          <View style={styles.photoRow}>
            {photos.map((uri, index) => (
              <View key={uri} style={styles.photoTile}>
                <Image source={{ uri }} style={styles.photoImage} resizeMode="cover" />
                <Pressable
                  onPress={() => setPhotos((current) => current.filter((item) => item !== uri))}
                  accessibilityRole="button"
                  accessibilityLabel={`Hapus foto ${index + 1}`}
                  style={styles.photoDelete}
                >
                  <Icon name="delete" size={14} color={colors.onPrimary} />
                </Pressable>
              </View>
            ))}
            {photos.length < MAX_PHOTOS ? (
              <Pressable onPress={addPhoto} accessibilityRole="button" style={styles.photoAdd}>
                <Icon name={photos.length === 0 ? 'camera' : 'add'} size={24} color={colors.primaryContainer} />
                <Text variant="labelMd" color="primaryContainer" align="center">
                  {photos.length === 0 ? 'Ambil Foto' : `Foto ${photos.length + 1}`}
                </Text>
              </Pressable>
            ) : null}
          </View>
          <Text variant="labelMd" color="textMuted">
            Maksimal {MAX_PHOTOS} foto (geotag &amp; waktu otomatis)
          </Text>
        </View>
      </ScreenBody>

      <BottomBar>
        {submitted ? (
          <View style={styles.savedRow}>
            <Icon name="cloudDone" size={20} color={colors.success} />
            <Text variant="labelLg" color="success">
              Laporan terkirim ke tim teknis
            </Text>
          </View>
        ) : (
          <Button
            label="Kirim Laporan"
            iconAfter="send"
            disabled={!canSubmit}
            onPress={submit}
          />
        )}
        {submitted ? (
          <Button
            label="Lihat Kendaraan Saya"
            variant="secondary"
            size="md"
            onPress={() => router.replace('/vehicle')}
          />
        ) : null}
      </BottomBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },

  unitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  unitIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  unitBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.successContainer,
    borderWidth: 1,
    borderColor: 'rgba(18,128,92,0.3)',
  },

  online: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.successContainer,
    borderWidth: 1,
    borderColor: 'rgba(18,128,92,0.25)',
  },

  section: { marginTop: spacing.lg, gap: spacing.sm },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },

  severityGrid: { flexDirection: 'row', gap: spacing.xs + 2 },
  severityCell: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  severityLabel: { fontSize: 11, lineHeight: 14 },

  textarea: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    padding: spacing.md + 2,
    ...shadows.card,
  },
  textareaInput: {
    ...typography.bodyMd,
    color: colors.ink,
    minHeight: 72,
    textAlignVertical: 'top',
    padding: 0,
  },
  counter: { marginTop: spacing.sm },

  photoHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  photoRow: { flexDirection: 'row', gap: spacing.md },
  photoTile: { width: 96, height: 96, borderRadius: radius.card, overflow: 'hidden' },
  photoImage: { width: '100%', height: '100%', backgroundColor: colors.surfaceContainer },
  photoDelete: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,24,39,0.6)',
  },
  photoAdd: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(27,77,255,0.6)',
    backgroundColor: 'rgba(239,246,255,0.6)',
  },

  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
  },
});
