import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { Button, Card, EmptyState, Screen, ScreenHeader, Text } from '@/components/ui';
import { usePodForm } from '@/hooks/usePodForm';
import { useTrip } from '@/hooks/useTrip';
import { capturePhoto } from '@/lib/photo';
import { colors, radius, spacing } from '@/theme';

const MAX_PHOTOS = 5;

const PHOTO_LABELS = ['Kargo', 'Manifest', 'Segel', 'Kondisi', 'Lainnya'];

export default function PodCaptureScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);
  const { geo, save } = usePodForm(tripId);
  const insets = useSafeAreaInsets();

  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [hasSignature, setHasSignature] = useState(false);
  const [recipientName, setRecipientName] = useState(trip?.recipient.name ?? '');
  const [scannedCode, setScannedCode] = useState(trip?.code ?? '');
  const [capturedAt] = useState(() => new Date().toISOString());

  if (!trip) {
    return (
      <Screen>
        <ScreenHeader title="Bukti Pengiriman" onBack />
        <EmptyState icon="error" title="Trip tidak ditemukan" description="Kembali dan pilih trip." />
      </Screen>
    );
  }

  // Validate the local draft, not the stored POD (which does not exist yet).
  const ready = (photoUris.length > 0 || hasSignature) && recipientName.trim().length > 0;

  const addPhoto = async () => {
    if (photoUris.length >= MAX_PHOTOS) return;
    const uri = await capturePhoto();
    if (uri) setPhotoUris((current) => [...current, uri]);
  };

  const handleSave = () => {
    if (!ready) return;
    save({ photoUris, hasSignature, recipientName: recipientName.trim(), scannedCode });
    router.replace(`/pod/${trip.id}/success`);
  };

  return (
    <Screen>
      <ScreenHeader
        title="Bukti Pengiriman"
        onBack
        right={
          <View style={styles.immutable}>
            <Icon name="lock" size={15} color={colors.success} />
            <Text variant="labelMd" color="success">
              Immutable
            </Text>
          </View>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Auto-captured metadata */}
        <Card>
          <View style={styles.metaHeader}>
            <Icon name="verified" size={16} color={colors.primaryContainer} />
            <Text variant="labelMd" color="textSecondary" style={styles.tracked}>
              METADATA OTOMATIS (ANTI-TAMPER)
            </Text>
          </View>
          <MetaRow
            icon="schedule"
            label="Waktu"
            value={`${new Date(capturedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`}
          />
          <MetaRow
            icon="location"
            label="Lokasi"
            value={`${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}`}
          />
        </Card>

        {/* Photos */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text variant="labelLg">Foto barang ({photoUris.length})</Text>
            <Text variant="labelMd" color="textSecondary">
              Maks. {MAX_PHOTOS} foto
            </Text>
          </View>
          <View style={styles.photoGrid}>
            {photoUris.map((uri, index) => (
              <View key={uri} style={styles.photoTile}>
                <Image source={{ uri }} style={styles.photoImage} resizeMode="cover" />
                <View style={styles.photoLabel}>
                  <Text variant="labelSm" color={colors.onPrimary}>
                    #{index + 1} {PHOTO_LABELS[index] ?? 'Foto'}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Hapus foto ${index + 1}`}
                  onPress={() => setPhotoUris((current) => current.filter((entry) => entry !== uri))}
                  style={styles.photoRemove}
                >
                  <Icon name="close" size={14} color={colors.onPrimary} />
                </Pressable>
              </View>
            ))}
            {photoUris.length < MAX_PHOTOS ? (
              <Pressable
                accessibilityRole="button"
                onPress={addPhoto}
                style={({ pressed }) => [styles.addTile, pressed && styles.pressed]}
              >
                <View style={styles.addIcon}>
                  <Icon name="camera" size={22} color={colors.primaryContainer} />
                </View>
                <Text variant="labelMd" color="primaryContainer">
                  Tambah
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Signature */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text variant="labelLg">Tanda tangan penerima</Text>
            {hasSignature ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setHasSignature(false)}
                style={styles.resetRow}
              >
                <Icon name="refresh" size={15} color={colors.primaryContainer} />
                <Text variant="labelMd" color="primaryContainer">
                  Ulangi
                </Text>
              </Pressable>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Area tanda tangan"
            onPress={() => setHasSignature(true)}
            style={[styles.signature, hasSignature && styles.signatureActive]}
          >
            {hasSignature ? (
              <Svg viewBox="0 0 260 70" width="100%" height={80}>
                <Path
                  d="M12 48C34 22 55 12 68 28C76 38 78 52 92 46C108 40 120 18 135 24C148 30 144 54 162 48C182 42 205 20 220 32C232 42 238 48 248 45"
                  stroke="#141B2B"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <Path d="M50 44L110 44" stroke="#141B2B" strokeWidth="2.2" strokeLinecap="round" />
                <Path
                  d="M152 26C158 14 170 12 172 24C174 34 164 42 168 50"
                  stroke="#141B2B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>
            ) : (
              <Text variant="micro" color="textMuted">
                Ketuk untuk tanda tangan di area ini
              </Text>
            )}
            <View style={styles.signatureBaseline} />
            <View style={styles.signatureGlyph}>
              <Icon name="signature" size={18} color={colors.textMuted} />
            </View>
          </Pressable>
        </View>

        {/* Inputs */}
        <View style={styles.section}>
          <View style={styles.field}>
            <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
              Nama penerima
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="Nama penerima"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.inputPadded]}
              />
              <View style={styles.inputIcon}>
                <Icon name="idCard" size={22} color={colors.textSecondary} />
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
              Kode pengiriman
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={scannedCode}
                onChangeText={setScannedCode}
                placeholder="Kode pengiriman"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.inputPadded, styles.inputCode]}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pindai barcode"
                onPress={() => undefined}
                style={styles.inputIcon}
              >
                <Icon name="barcode" size={22} color={colors.primaryContainer} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Online notice */}
        <View style={styles.online}>
          <Icon name="online" size={20} color={colors.success} />
          <Text variant="caption" color="#2E6855" style={styles.flex}>
            Terhubung online. Bukti pengiriman langsung diunggah ke server.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label="Simpan Bukti"
          icon="success"
          disabled={!ready}
          onPress={handleSave}
        />
      </View>
    </Screen>
  );
}

function MetaRow({ icon, label, value }: { icon: 'schedule' | 'location'; label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.metaLeft}>
        <Icon name={icon} size={18} color={colors.textSecondary} />
        <Text variant="bodyMd" numberOfLines={1} style={styles.flex}>
          {label}: <Text variant="bodyBold">{value}</Text>
        </Text>
      </View>
      <View style={styles.lockChip}>
        <Icon name="lock" size={12} color={colors.textSecondary} />
        <Text variant="labelSm" color="textSecondary">
          Kunci
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { gap: spacing.md, paddingHorizontal: spacing.gutter, paddingBottom: spacing.xxl },
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tracked: { letterSpacing: 0.6, fontSize: 11 },
  pressed: { opacity: 0.85 },

  immutable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#BCE4D3',
    backgroundColor: colors.successContainer,
  },

  metaHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.canvas,
    marginBottom: spacing.sm,
  },
  metaLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  lockChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },

  section: { gap: spacing.sm },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoTile: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  photoImage: { width: '100%', height: '100%' },
  photoLabel: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  photoRemove: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  addTile: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#B9C3FF',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },

  resetRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  signature: {
    height: 128,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    padding: spacing.md,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  signatureActive: { borderColor: colors.primaryContainer },
  signatureBaseline: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.xl,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
  },
  signatureGlyph: { position: 'absolute', bottom: spacing.sm, right: spacing.sm },

  field: { gap: spacing.xs },
  fieldLabel: { paddingHorizontal: 2 },
  inputWrap: { position: 'relative', justifyContent: 'center' },
  input: {
    height: 56,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.ink,
  },
  inputPadded: { paddingHorizontal: spacing.lg, paddingRight: spacing.xxl + spacing.sm },
  inputCode: { fontFamily: 'Inter_600SemiBold' },
  inputIcon: { position: 'absolute', right: spacing.md },

  online: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: colors.successContainer,
  },

  footer: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
