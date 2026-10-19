import { useMemo, useState } from 'react';
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
import { toVehicle } from '@/data/adapters';
import { useVehicle } from '@/hooks/api/useDriverData';
import { useTrips } from '@/hooks/useTrips';
import { ApiError } from '@/lib/api/client';
import { fuelApi } from '@/lib/api/endpoints';
import { formatKm, formatNumber } from '@/lib/format';
import { enqueue } from '@/lib/offline/queue';
import { capturePhoto } from '@/lib/photo';
import { uploadImage } from '@/lib/upload';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export default function FuelLogScreen() {
  const { nextTrip } = useTrips();
  const vehicleQuery = useVehicle();
  const vehicle = useMemo(
    () => (vehicleQuery.data ? toVehicle(vehicleQuery.data) : undefined),
    [vehicleQuery.data],
  );
  const vehicleId = vehicle?.id ?? nextTrip?.vehicleId ?? '';

  const [liters, setLiters] = useState('45');
  const [odometer, setOdometer] = useState(() => String(vehicle?.odometerKm ?? 0));
  const [price, setPrice] = useState('14500');
  const [station, setStation] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastOdometer = vehicle?.odometerKm ?? 0;
  const litersValue = Number(liters) || 0;
  const odometerValue = Number(odometer) || 0;
  const priceValue = Number(price) || 0;

  const total = litersValue * priceValue;
  const litersInvalid = litersValue <= 0;
  const odometerDecreased = lastOdometer > 0 && odometerValue > 0 && odometerValue < lastOdometer;
  const canSubmit =
    !litersInvalid &&
    odometerValue > 0 &&
    priceValue > 0 &&
    !odometerDecreased &&
    Boolean(receiptUri) &&
    Boolean(vehicleId);

  const takeReceipt = async () => {
    const uri = await capturePhoto();
    if (uri) setReceiptUri(uri);
  };

  const handleSave = async () => {
    if (!canSubmit || !receiptUri || saving) return;
    setSaving(true);
    setError(null);
    try {
      const receiptPath = await uploadImage(receiptUri, 'bbm');
      const payload = {
        vehicleId,
        liters: litersValue,
        amount: total,
        odometerKm: odometerValue,
        station: station.trim() || null,
        receiptPath,
        tripId: nextTrip?.id ?? null,
        notes: null,
      };

      try {
        await fuelApi.submit(payload);
      } catch (caught) {
        if (caught instanceof ApiError && caught.isNetworkError) {
          await enqueue({
            kind: 'fuel',
            label: `BBM ${litersValue} L`,
            path: '/api/driver/fuel',
            method: 'POST',
            body: payload,
          });
        } else {
          throw caught;
        }
      }

      setSubmitted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Gagal menyimpan catatan BBM.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader
        title="Catat BBM"
        onBack
        right={
          <View style={styles.modeChip}>
            <View style={styles.modeDot} />
            <Text variant="labelMd" color="onSurfaceVariant">
              Mode Manual
            </Text>
          </View>
        }
      />

      <ScreenBody bottomPadding={140}>
        {/* Vehicle selector */}
        <Card padded={false} shadow>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleIcon}>
              <Icon name="truck" size={26} color={colors.primary} />
            </View>
            <View style={styles.vehicleText}>
              <View style={styles.vehicleTitleRow}>
                <Text variant="headlineSm">{vehicle?.plate ?? '—'}</Text>
                <View style={styles.typeChip}>
                  <Text variant="labelMd" color={colors.onSurfaceVariant}>
                    {vehicle?.type === 'Light Truck' ? 'CDD BOX' : (vehicle?.type ?? 'CDD BOX')}
                  </Text>
                </View>
              </View>
              <Text variant="labelMd" color="secondary" numberOfLines={1}>
                Terisi otomatis dari trip aktif
              </Text>
            </View>
            <Icon name="expand" size={22} color={colors.secondary} />
          </View>
        </Card>

        {/* Volume */}
        <View style={styles.fieldGroup}>
          <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
            VOLUME (LITER) <Text color="critical">*</Text>
          </Text>
          <View style={[styles.inputShell, litersInvalid && styles.inputShellError]}>
            <TextInput
              value={liters}
              onChangeText={setLiters}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Text variant="bodyMd" color="secondary" style={styles.suffix}>
              Liter
            </Text>
          </View>
          {litersInvalid ? (
            <View style={styles.errorBanner}>
              <Icon name="error" size={18} color={colors.critical} />
              <Text variant="labelLg" color="critical" style={styles.bannerText}>
                Volume BBM harus lebih dari 0 liter.
              </Text>
            </View>
          ) : null}
        </View>

        {/* Odometer */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
              ODOMETER (KM) <Text color="critical">*</Text>
            </Text>
            <Text variant="labelMd" color="secondary">
              Terakhir: {formatKm(lastOdometer)}
            </Text>
          </View>
          <View style={[styles.inputShell, odometerDecreased && styles.inputShellWarning]}>
            <TextInput
              value={odometer}
              onChangeText={setOdometer}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Text variant="bodyMd" color="secondary" style={styles.suffix}>
              KM
            </Text>
          </View>
          {odometerDecreased ? (
            <View style={styles.warningBanner}>
              <View style={styles.bannerRow}>
                <Icon name="warning" size={18} color={colors.warning} />
                <Text variant="labelLg" color={colors.warning} style={styles.bannerText}>
                  Odometer tidak boleh berkurang. Ajukan koreksi dengan alasan.
                </Text>
              </View>
              <View style={styles.bannerActionRow}>
                <Pressable
                  onPress={() => setOdometer(String(lastOdometer))}
                  accessibilityRole="button"
                  style={styles.bannerAction}
                >
                  <Icon name="note" size={15} color={colors.warning} />
                  <Text variant="labelMd" color={colors.warning}>
                    Ajukan Koreksi
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>

        {/* Unit price */}
        <View style={styles.fieldGroup}>
          <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
            HARGA PER LITER <Text color="critical">*</Text>
          </Text>
          <View style={styles.inputShell}>
            <Text variant="bodyMd" color="secondary" style={styles.prefix}>
              Rp
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.inputWithPrefix]}
            />
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <View>
            <Text variant="labelMd" color="secondary" style={styles.upper}>
              Ringkasan Biaya
            </Text>
            <Text variant="headlineSm" style={styles.totalTitle}>
              Total Biaya
            </Text>
          </View>
          <View style={styles.totalRight}>
            <Text variant="labelMd" color="primaryContainer">
              {litersValue || 0} L × Rp {formatNumber(priceValue)}
            </Text>
            <Text variant="headlineMd" color={colors.primaryContainer}>
              Rp {formatNumber(total)}
            </Text>
          </View>
        </View>

        {/* Station */}
        <View style={styles.fieldGroup}>
          <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
            STASIUN SPBU <Text color="critical">*</Text>
          </Text>
          <View style={styles.inputShell}>
            <Icon name="location" size={22} color={colors.primary} />
            <TextInput
              value={station}
              onChangeText={setStation}
              placeholder="Pilih lokasi SPBU"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.inputWithPrefix]}
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Cari SPBU terdekat" hitSlop={8}>
              <Icon name="recenter" size={20} color={colors.secondary} />
            </Pressable>
          </View>
        </View>

        {/* Receipt */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
              FOTO STRUK PEMBELIAN
            </Text>
            <Text variant="labelMd" color="secondary">
              Wajib untuk audit
            </Text>
          </View>

          {receiptUri ? (
            <View style={styles.receiptWrap}>
              <Image source={{ uri: receiptUri }} style={styles.receiptImage} resizeMode="cover" />
              <Pressable
                onPress={() => setReceiptUri(undefined)}
                accessibilityRole="button"
                accessibilityLabel="Hapus foto struk"
                style={styles.receiptDelete}
              >
                <Icon name="delete" size={18} color={colors.onPrimary} />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={takeReceipt} accessibilityRole="button" style={styles.captureTile}>
              <View style={styles.captureIcon}>
                <Icon name="camera" size={28} color={colors.primary} />
              </View>
              <Text variant="bodyBold">Ketuk untuk Ambil Foto</Text>
              <Text variant="labelMd" color="secondary" style={styles.captureHint}>
                Foto struk membantu rekonsiliasi
              </Text>
            </Pressable>
          )}
        </View>

      </ScreenBody>

      <BottomBar>
        {error ? (
          <Text variant="caption" color="critical" align="center">
            {error}
          </Text>
        ) : null}
        {submitted ? (
          <View style={styles.savedRow}>
            <Icon name="cloudDone" size={20} color={colors.success} />
            <Text variant="labelLg" color="success">
              Catatan BBM tersimpan
            </Text>
          </View>
        ) : (
          <Button
            label={saving ? 'Menyimpan…' : 'Simpan Catatan'}
            icon="save"
            disabled={!canSubmit || saving}
            onPress={handleSave}
          />
        )}
      </BottomBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainer,
  },
  modeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.outline },

  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.secondaryContainer,
  },
  vehicleText: { flex: 1, gap: 2 },
  vehicleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  typeChip: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.secondaryContainer,
  },

  fieldGroup: { gap: spacing.sm, marginTop: spacing.lg },
  fieldLabel: { textTransform: 'uppercase' },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  inputShellError: { borderColor: colors.critical },
  inputShellWarning: { borderColor: '#FDE68A' },
  input: {
    flex: 1,
    ...typography.headlineSm,
    color: colors.ink,
    paddingVertical: 0,
  },
  inputWithPrefix: { flex: 1 },
  prefix: { minWidth: 22 },
  suffix: { position: 'absolute', right: spacing.lg },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  warningBanner: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  bannerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm + 2 },
  bannerText: { flex: 1, lineHeight: 19 },
  bannerActionRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  bannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.3)',
    backgroundColor: colors.surface,
  },

  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    ...shadows.card,
  },
  upper: { textTransform: 'uppercase' },
  totalTitle: { marginTop: 2 },
  totalRight: { alignItems: 'flex-end', gap: 2 },

  captureTile: {
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    gap: 2,
  },
  captureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
    marginBottom: spacing.sm,
  },
  captureHint: { marginTop: spacing.xs },
  receiptWrap: { borderRadius: radius.card, overflow: 'hidden' },
  receiptImage: { width: '100%', height: 160, backgroundColor: colors.surfaceContainer },
  receiptBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(17,24,39,0.8)',
  },
  receiptDelete: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,24,39,0.6)',
  },

  syncChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.successContainer,
    borderWidth: 1,
    borderColor: 'rgba(18,128,92,0.25)',
  },
  syncIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  syncTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  syncDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  syncNote: { marginTop: 2 },

  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
  },
});
