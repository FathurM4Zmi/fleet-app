import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Button, Text } from '@/components/ui';
import { useAuth } from '@/store/auth';
import { colors, radius, spacing } from '@/theme';

const RETICLE = 236;
const SCAN_TRAVEL = RETICLE - 16;

export default function ScanQrScreen() {
  const insets = useSafeAreaInsets();
  const { loginWithQr } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [detected, setDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  const [scanLine] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanLine]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (submitting.current || detected || !data) return;
    submitting.current = true;
    setDetected(true);
    setError(null);
    try {
      await loginWithQr(data);
      router.replace('/(app)');
    } catch (cause) {
      setDetected(false);
      setError(
        cause instanceof Error ? cause.message : 'QR tidak dikenali. Minta kode baru ke supervisor.',
      );
      submitting.current = false;
    }
  };

  return (
    <View style={styles.screen}>
      {permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torchOn}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={detected ? undefined : handleBarcodeScanned}
        />
      ) : null}

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Tutup"
          hitSlop={8}
          style={styles.headerButton}
        >
          <Icon name="close" size={26} color={colors.surface} />
        </Pressable>

        <Text variant="headlineSm" color="surface">
          Pindai QR
        </Text>

        <Pressable
          onPress={() => setTorchOn((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel="Nyalakan senter"
          hitSlop={8}
          style={[styles.headerButton, styles.torchButton]}
        >
          <Icon
            name="flash"
            size={24}
            color={torchOn ? '#FCD34D' : colors.outlineVariant}
          />
        </Pressable>
      </View>

      <View style={styles.viewfinder}>
        <View style={styles.reticle}>
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scanLine.interpolate({ inputRange: [0, 1], outputRange: [0, SCAN_TRAVEL] }) }] },
            ]}
          />
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
          <View style={styles.crosshair}>
            <Icon name="scan" size={30} color="rgba(255,255,255,0.5)" />
          </View>
        </View>

        <View style={styles.viewfinderFoot}>
          <Text variant="bodyMd" color="#E2E8F0" align="center">
            Arahkan kamera ke QR dari perangkat supervisor
          </Text>
          <View style={[styles.detectedPill, detected && styles.detectedPillActive]}>
            <Icon
              name={detected ? 'success' : 'pending'}
              size={18}
              color={detected ? '#34D399' : colors.outlineVariant}
            />
            <Text variant="labelSm" color={detected ? '#6EE7B7' : colors.outlineVariant}>
              {detected ? 'QR TERDETEKSI • BERLAKU SEKALI PAKAI' : 'MENUNGGU QR…'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grip} />

        <View style={styles.sheetBody}>
          <View style={styles.warningCard}>
            <View style={styles.warningIcon}>
              <Icon name="warning" size={18} color={colors.critical} />
            </View>
            <View style={styles.warningText}>
              <Text variant="labelMd" color="critical">
                Peringatan Keamanan
              </Text>
              <Text variant="caption" color="critical" style={styles.warningBody}>
                QR hanya berlaku sekali. Jangan bagikan ke siapa pun.
              </Text>
            </View>
          </View>

          <View style={styles.manualBlock}>
            <Text variant="labelMd" color="textSecondary">
              Tidak bisa memindai?
            </Text>
            <Button
              label="Masukkan kode manual"
              variant="secondary"
              size="md"
              icon="dialpad"
              onPress={() => router.replace('/(auth)/otp')}
            />
          </View>
        </View>

        <View style={[styles.sheetFoot, { paddingBottom: insets.bottom + spacing.sm }]}>
          {error ? (
            <Text variant="labelMd" color="critical" style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          {permission?.granted ? (
            <Text variant="labelMd" color="secondary" align="center">
              {detected ? 'Memverifikasi QR…' : 'Arahkan kamera ke QR supervisor'}
            </Text>
          ) : (
            <Button label="Izinkan kamera" onPress={() => requestPermission()} />
          )}
          <Button
            label="Ganti ke login PIN"
            variant="ghost"
            onPress={() => router.replace('/(auth)/login')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.sm,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchButton: {
    backgroundColor: 'rgba(30,41,59,0.8)',
    borderWidth: 1,
    borderColor: '#334155',
  },
  viewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  reticle: {
    width: RETICLE,
    height: RETICLE,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(15,23,42,0.4)',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 8,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primaryContainer,
  },
  corner: { position: 'absolute', width: 32, height: 32, borderColor: colors.surface },
  cornerTopLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: radius.card },
  cornerTopRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: radius.card },
  cornerBottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: radius.card },
  cornerBottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: radius.card },
  crosshair: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  viewfinderFoot: { alignItems: 'center', gap: spacing.sm + 2 },
  detectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  detectedPillActive: { borderColor: 'rgba(16,185,129,0.4)' },
  sheet: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  grip: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
  },
  sheetBody: { gap: spacing.lg },
  warningCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.critical,
    backgroundColor: colors.criticalContainer,
  },
  warningIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220,38,38,0.1)',
  },
  warningText: { flex: 1, gap: 2 },
  warningBody: { color: colors.critical },
  manualBlock: { gap: spacing.sm },
  errorText: { marginBottom: spacing.xs },
  sheetFoot: { gap: spacing.sm },
});
