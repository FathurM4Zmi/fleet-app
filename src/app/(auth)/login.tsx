import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  Button,
  Card,
  PinInput,
  Screen,
  ScreenBody,
  SegmentedControl,
  Text,
} from '@/components/ui';
import { useAuth } from '@/store/app';
import { colors, radius, spacing } from '@/theme';

/** Wrong-PIN attempts allowed before the account locks (FRD-MOB-LOGIN-03). */
const MAX_ATTEMPTS = 5;
/** Prototype credential — the real flow validates against the backend. */
const DEMO_PIN = '123456';

type Method = 'pin' | 'otp' | 'qr';

const METHODS = [
  { label: 'PIN', value: 'pin' as const },
  { label: 'OTP', value: 'otp' as const },
  { label: 'QR', value: 'qr' as const },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const [method, setMethod] = useState<Method>('pin');
  const [pin, setPin] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [error, setError] = useState<string | null>(null);

  const locked = attemptsLeft === 0;
  const canSubmit = pin.length === 6 && !locked;

  /**
   * `candidate` comes straight from `PinInput.onComplete`, which fires inside the
   * same text-change handler that queued `setPin`. Reading the `pin` state there
   * would still yield the pre-keystroke value, so the completed PIN is passed in.
   */
  const handleSubmit = (candidate: string = pin) => {
    if (locked) return;

    if (candidate === DEMO_PIN) {
      setError(null);
      login('drv-001');
      return;
    }

    const remaining = attemptsLeft - 1;
    setAttemptsLeft(remaining);
    setPin('');
    setError(
      remaining === 0
        ? 'Akun terkunci sementara. Hubungi supervisor untuk membuka.'
        : `PIN atau kode salah. Sisa ${remaining} kesempatan sebelum sistem terkunci otomatis.`,
    );
  };

  return (
    <Screen>
      <View style={styles.accent} />

      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.logoTile}>
            <Icon name="truck" size={20} color={colors.onPrimary} />
          </View>
          <View style={styles.brandText}>
            <Text variant="headlineSm">FleetOps</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bantuan"
          style={styles.iconButton}
        >
          <Icon name="help" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScreenBody bottomPadding={spacing.md}>
        <View style={styles.headline}>
          <Text variant="headlineLg">Masuk sebagai Driver</Text>
          <Text variant="bodyMd" color="textSecondary" style={styles.headlineBody}>
            Gunakan PIN, kode OTP, atau pindai QR dari perangkat terdaftar.
          </Text>
        </View>

        <SegmentedControl options={METHODS} value={method} onChange={setMethod} />

        {method === 'pin' ? (
          <Card style={styles.panel}>
            <View style={styles.panelHead}>
              <Text variant="titleMd">Masukkan PIN 6 digit</Text>
            </View>

            <PinInput
              value={pin}
              onChange={(next) => {
                setPin(next);
                if (error) setError(null);
              }}
              onComplete={handleSubmit}
              autoFocus
              hasError={Boolean(error)}
            />

            <View style={styles.panelMeta}>
              <Pressable onPress={() => router.push('/(auth)/reset-pin')} hitSlop={8}>
                <Text variant="labelLg" color="primaryContainer">
                  Lupa PIN?
                </Text>
              </Pressable>
              <Text variant="caption" color="textSecondary">
                Kirim ulang dalam <Text variant="labelLg">0:42</Text>
              </Text>
            </View>

            <Text variant="micro" color="textMuted" style={styles.demoHint}>
              PIN demo untuk prototipe: {DEMO_PIN}
            </Text>
          </Card>
        ) : null}

        {method === 'otp' ? (
          <Card style={styles.panel}>
            <Text variant="titleMd">Masuk dengan kode OTP</Text>
            <Text variant="bodyMd" color="textSecondary" style={styles.panelBody}>
              Kami akan mengirim 6 digit kode ke nomor terdaftar +62 812-••••-7890. Kode berlaku
              15 menit dan hanya dapat dipakai sekali.
            </Text>
            <Button
              label="Kirim kode OTP"
              icon="chat"
              onPress={() => router.push('/(auth)/otp')}
            />
          </Card>
        ) : null}

        {method === 'qr' ? (
          <Card style={styles.panel}>
            <Text variant="titleMd">Masuk dengan pemindaian QR</Text>
            <Text variant="bodyMd" color="textSecondary" style={styles.panelBody}>
              Minta supervisor menampilkan QR login dari perangkat terdaftar. QR hanya berlaku
              sekali pakai.
            </Text>
            <Button
              label="Buka pemindai QR"
              icon="qr"
              variant="secondary"
              onPress={() => router.push('/(auth)/scan-qr')}
            />
          </Card>
        ) : null}

        {error ? (
          <View style={styles.alert} accessibilityLiveRegion="polite">
            <Icon name="error" size={20} color={colors.critical} />
            <View style={styles.alertBody}>
              <Text variant="labelMd" color="critical">
                {locked ? 'Akun terkunci' : 'PIN atau kode salah'}
              </Text>
              <Text variant="caption" color="onErrorContainer">
                {error}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.telemetry}>
          <View style={styles.telemetryLeft}>
            <Icon name="sync" size={20} color={colors.secondary} />
            <View>
              <Text variant="labelSm" color="textSecondary">
                STATUS TELEMATIKA
              </Text>
              <Text variant="labelMd">Terminal Truk JKT-04 • Daring</Text>
            </View>
          </View>
          <View style={styles.onlineDot} />
        </View>
      </ScreenBody>

      <View style={styles.footer}>
        <Button
          label="Masuk"
          iconAfter="forward"
          disabled={!canSubmit}
          onPress={() => handleSubmit()}
        />
        <Button
          label="Gunakan pemindaian QR"
          variant="ghost"
          icon="qr"
          onPress={() => router.push('/(auth)/scan-qr')}
        />
        <Text variant="micro" color="textMuted" align="center">
          Hubungi supervisor bila akun terkunci.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  accent: { height: 3, backgroundColor: colors.primaryContainer },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  logoTile: {
    width: 36,
    height: 36,
    borderRadius: radius.input,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: { marginTop: spacing.sm, marginBottom: spacing.xl },
  headlineBody: { marginTop: 6 },
  panel: { marginTop: spacing.xl, gap: spacing.lg },
  panelHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  panelBody: { marginTop: spacing.xs },
  panelMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  demoHint: { marginTop: -spacing.sm },
  alert: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.critical,
    backgroundColor: colors.criticalContainer,
  },
  alertBody: { flex: 1, gap: 2 },
  telemetry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
  },
  telemetryLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.successContainer,
  },
  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
