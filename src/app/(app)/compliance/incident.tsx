import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  BottomBar,
  Button,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { INCIDENT_CATEGORIES, INCIDENT_SEVERITIES } from '@/data/fixtures';
import { capturePhoto } from '@/lib/photo';
import { useAppStore } from '@/store/app';
import { colors, radius, shadows, spacing, typography } from '@/theme';

const MAX_CHRONOLOGY = 500;
const MAX_DESCRIPTION = 300;
const MAX_PHOTOS = 3;

type Severity = (typeof INCIDENT_SEVERITIES)[number];

const SEVERITY_TONE: Record<Severity, { bg: string; border: string; fg: string }> = {
  Ringan: { bg: colors.successContainer, border: colors.success, fg: colors.success },
  Sedang: { bg: colors.warningContainer, border: colors.warning, fg: colors.warning },
  Berat: { bg: colors.criticalContainer, border: colors.critical, fg: colors.critical },
};

export default function IncidentReportScreen() {
  const { dispatch } = useAppStore();

  const [category, setCategory] = useState<string>(INCIDENT_CATEGORIES[0]);
  const [severity, setSeverity] = useState<Severity>('Ringan');
  const [location, setLocation] = useState('');
  const [chronology, setChronology] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Photo evidence is mandatory (FRD-MOB-CMP-04), as is the narrative.
  const canSubmit =
    location.trim().length > 0 &&
    chronology.trim().length > 0 &&
    description.trim().length > 0 &&
    photos.length > 0;

  const addPhoto = async () => {
    if (photos.length >= MAX_PHOTOS) return;
    const uri = await capturePhoto();
    if (uri) setPhotos((current) => [...current, uri]);
  };

  const submit = () => {
    if (!canSubmit) return;
    dispatch({
      type: 'incident/report',
      report: {
        category,
        severity,
        location: location.trim(),
        chronology: chronology.trim(),
        description: description.trim(),
        photoUris: photos,
      },
    });
    setSubmitted(true);
  };

  return (
    <Screen>
      <ScreenHeader
        title="Laporkan Insiden"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Bantuan" hitSlop={8}>
            <Icon name="help" size={22} color={colors.secondary} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={150}>
        {/* Immutable notice (FRD-MOB-CMP-03) */}
        <View style={styles.lockPanel}>
          <Icon name="lock" size={20} color={colors.warning} />
          <Text variant="caption" color="#92400E" style={styles.flex}>
            Laporan bersifat permanen setelah dikirim dan tidak dapat diubah. Perbaikan dilakukan
            melalui laporan tambahan.
          </Text>
        </View>

        {/* Online banner */}
        <View style={styles.online}>
          <Icon name="online" size={20} color={colors.success} />
          <Text variant="labelLg" color={colors.success} style={styles.flex}>
            Terhubung online. Laporan langsung diteruskan ke dispatcher.
          </Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            KATEGORI INSIDEN
          </Text>
          <View style={styles.chipWrap}>
            {INCIDENT_CATEGORIES.map((item) => {
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
            TINGKAT KEPARAHAN
          </Text>
          <View style={styles.severityGrid}>
            {INCIDENT_SEVERITIES.map((item) => {
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
                    variant={active ? 'titleMd' : 'bodyMd'}
                    color={active ? tone.fg : 'ink'}
                    align="center"
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text variant="labelMd" color="textSecondary" style={styles.upper}>
            LOKASI KEJADIAN
          </Text>
          <View style={styles.inputRow}>
            <Icon name="location" size={20} color={colors.secondary} />
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Jalan, KM, atau nama lokasi"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setLocation('Jl. Tol Cipali KM 102, Subang')}
            style={styles.geoRow}
          >
            <Icon name="gps" size={18} color={colors.primaryContainer} />
            <Text variant="labelLg" color="primaryContainer">
              Gunakan lokasi saat ini
            </Text>
          </Pressable>
        </View>

        {/* Chronology */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text variant="labelMd" color="textSecondary" style={styles.upper}>
              KRONOLOGI
            </Text>
            <Text variant="labelMd" color="textMuted">
              {chronology.length}/{MAX_CHRONOLOGY}
            </Text>
          </View>
          <View style={styles.textarea}>
            <TextInput
              value={chronology}
              onChangeText={(value) => setChronology(value.slice(0, MAX_CHRONOLOGY))}
              placeholder="Urutkan kejadian dari awal hingga akhir"
              placeholderTextColor={colors.textMuted}
              multiline
              style={styles.textareaInput}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text variant="labelMd" color="textSecondary" style={styles.upper}>
              DESKRIPSI
            </Text>
            <Text variant="labelMd" color="textMuted">
              {description.length}/{MAX_DESCRIPTION}
            </Text>
          </View>
          <View style={styles.textarea}>
            <TextInput
              value={description}
              onChangeText={(value) => setDescription(value.slice(0, MAX_DESCRIPTION))}
              placeholder="Jelaskan kondisi, dampak, dan pihak yang terlibat"
              placeholderTextColor={colors.textMuted}
              multiline
              style={styles.textareaInput}
            />
          </View>
        </View>

        {/* Photos (mandatory) */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text variant="labelMd" color="textSecondary" style={styles.upper}>
              FOTO BUKTI
            </Text>
            <Text variant="labelMd" color={photos.length > 0 ? 'success' : 'critical'}>
              {photos.length > 0 ? `${photos.length} terlampir` : 'Wajib dilampirkan'}
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
                <Icon
                  name={photos.length === 0 ? 'camera' : 'add'}
                  size={24}
                  color={colors.primaryContainer}
                />
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
          <>
            <View style={styles.savedRow}>
              <Icon name="cloudDone" size={20} color={colors.success} />
              <Text variant="labelLg" color="success">
                Laporan terkirim ke dispatcher
              </Text>
            </View>
            <Button
              label="Kembali ke Kepatuhan"
              variant="secondary"
              size="md"
              onPress={() => router.replace('/compliance')}
            />
          </>
        ) : (
          <Button
            label="Kirim Laporan"
            iconAfter="send"
            disabled={!canSubmit}
            onPress={submit}
          />
        )}
      </BottomBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },

  lockPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.warningContainer,
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.25)',
  },

  online: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.successContainer,
    borderWidth: 1,
    borderColor: 'rgba(18,128,92,0.25)',
  },

  section: { marginTop: spacing.lg, gap: spacing.sm },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

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

  severityGrid: { flexDirection: 'row', gap: spacing.sm },
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

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  input: { ...typography.bodyMd, flex: 1, color: colors.ink, padding: 0 },
  geoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 40,
  },

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
