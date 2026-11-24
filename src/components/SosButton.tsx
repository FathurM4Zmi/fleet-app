import * as Location from 'expo-location';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/ui/Text';
import { sosApi } from '@/lib/api/endpoints';
import { colors, radius, spacing } from '@/theme';

/** Tahan 1,5 detik agar tidak terpencet tidak sengaja di saku/dasbor. */
const HOLD_MS = 1500;

async function currentCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const permission = await Location.getForegroundPermissionsAsync();
    if (!permission.granted) return null;
    const last = await Location.getLastKnownPositionAsync();
    const position = last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch {
    // Lokasi gagal tidak boleh menahan SOS — kirim tanpa koordinat.
    return null;
  }
}

/**
 * Tombol darurat driver (riset FMS 2026-11-24: Samsara/Verizon Connect menyediakan SOS di
 * aplikasi driver). Tekan lama → kirim alert Critical berikut lokasi terakhir ke Fleet Manager
 * dan Dispatcher. Gagal kirim ditampilkan jelas agar driver menelepon langsung.
 */
export function SosButton() {
  const [sending, setSending] = useState(false);

  async function send() {
    if (sending) return;
    setSending(true);
    try {
      const coords = await currentCoordinates();
      await sosApi.trigger({ latitude: coords?.latitude ?? null, longitude: coords?.longitude ?? null });
      Alert.alert(
        'SOS terkirim',
        coords
          ? 'Fleet Manager dan Dispatcher sudah menerima lokasi Anda. Tetap di tempat aman.'
          : 'Fleet Manager dan Dispatcher sudah diberi tahu, tetapi lokasi tidak terbaca. Sebutkan lokasi saat dihubungi.',
      );
    } catch {
      Alert.alert('SOS gagal terkirim', 'Periksa sinyal lalu coba lagi, atau telepon supervisor/112 sekarang.');
    } finally {
      setSending(false);
    }
  }

  return (
    <Pressable
      onLongPress={() => void send()}
      delayLongPress={HOLD_MS}
      onPress={() => Alert.alert('Tombol darurat', 'Tahan tombol SOS selama 1,5 detik untuk mengirim tanda darurat.')}
      accessibilityRole="button"
      accessibilityLabel="SOS darurat, tahan untuk mengirim"
      accessibilityHint="Tahan 1,5 detik untuk mengirim lokasi ke supervisor"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {sending ? (
        <ActivityIndicator size="small" color={colors.onPrimary} />
      ) : (
        <>
          <Icon name="emergency" size={16} color={colors.onPrimary} />
          <Text variant="labelMd" style={styles.label}>
            SOS
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 40,
    minWidth: 64,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.critical,
  },
  pressed: { opacity: 0.85 },
  label: { color: colors.onPrimary, fontWeight: '700' },
});
