import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
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
  TextField,
} from '@/components/ui';
import { ApiError } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/api/config';
import { useAuth } from '@/store/auth';
import { colors, radius, spacing } from '@/theme';

/** Wrong-PIN attempts allowed before the account locks (FRD-MOB-LOGIN-03). */
const MAX_ATTEMPTS = 5;

type Method = 'pin' | 'otp' | 'qr';

const METHODS = [
  { label: 'PIN', value: 'pin' as const },
  { label: 'OTP', value: 'otp' as const },
  { label: 'QR', value: 'qr' as const },
];

export default function LoginScreen() {
  const { loginWithPin } = useAuth();
  const [method, setMethod] = useState<Method>('pin');
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [busy, setBusy] = useState(false);
  // Guards against a second auto-submit landing before `busy` re-renders, which
  // would send two login requests and burn two attempts on one wrong PIN.
  const submitting = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<'network' | 'auth' | 'locked' | 'server' | 'input' | null>(null);

  const locked = attemptsLeft === 0;
  const canSubmit = identifier.trim().length >= 3 && pin.length === 6 && !locked && !busy;

  /**
   * `candidate` comes straight from `PinInput.onComplete`, which fires inside the
   * same text-change handler that queued `setPin`. Reading the `pin` state there
   * would still yield the pre-keystroke value, so the completed PIN is passed in.
   */
  const handleSubmit = async (candidate: string = pin) => {
    if (locked || busy || submitting.current) return;

    // Auto-submit from `PinInput` can fire before the identifier is filled in.
    // Validate here so the button and the auto-submit share one rule set.
    if (identifier.trim().length < 3) {
      setErrorKind('input');
      setError('Isi nomor lisensi atau telepon terlebih dahulu.');
      return;
    }
    if (candidate.length !== 6) return;

    submitting.current = true;
    setBusy(true);
    setError(null);
    try {
      // Fail instantly in airplane mode instead of waiting for the timeout.
      const net = await NetInfo.fetch();
      if (net.isConnected === false) {
        throw new ApiError(0, 'Tidak ada koneksi internet. Sambungkan perangkat lalu coba lagi.');
      }
      await loginWithPin(identifier, candidate);
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : null;

      // Status 0 means the request never reached the server (offline, timeout).
      // That is not a wrong PIN, so the attempt counter must not move and the
      // entered PIN is kept so the driver can retry with one tap.
      if (!apiError || apiError.isNetworkError) {
        setErrorKind('network');
        setError(apiError?.message ?? 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.');
        return;
      }

      // 423 = the server has locked the account (FRD-MOB-LOGIN-03).
      if (apiError.status === 423) {
        setPin('');
        setAttemptsLeft(0);
        setErrorKind('locked');
        setError(apiError.message);
        return;
      }

      // Only a real 401 is a rejected credential. Other statuses (400/500) are
      // server-side problems and should not lock the driver out. Keep the PIN
      // for a retry; it is only wiped when the server rejects it.
      if (apiError.status !== 401) {
        setErrorKind('server');
        setError(apiError.message);
        return;
      }

      setPin('');
      const remaining = Math.max(0, attemptsLeft - 1);
      setAttemptsLeft(remaining);
      setErrorKind(remaining === 0 ? 'locked' : 'auth');
      setError(
        remaining === 0
          ? 'Akun terkunci sementara. Hubungi supervisor untuk membuka.'
          : `PIN salah. Sisa ${remaining} kesempatan sebelum akun terkunci sementara.`,
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
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
              <Text variant="titleMd">Masuk dengan PIN</Text>
            </View>

            <TextField
              label="Nomor lisensi atau telepon"
              placeholder="Masukkan nomor lisensi atau telepon"
              value={identifier}
              onChangeText={(next) => {
                setIdentifier(next);
                if (error) {
                  setError(null);
                  setErrorKind(null);
                }
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              leftIcon="profile"
              returnKeyType="next"
            />

            <Text variant="labelMd" color="textSecondary">
              PIN 6 digit
            </Text>

            <PinInput
              value={pin}
              onChange={(next) => {
                setPin(next);
                if (error) {
                  setError(null);
                  setErrorKind(null);
                }
              }}
              onComplete={handleSubmit}
              autoFocus
              hasError={errorKind === 'auth' || errorKind === 'locked'}
            />

            <View style={styles.panelMeta}>
              <Pressable onPress={() => router.push('/(auth)/reset-pin')} hitSlop={8}>
                <Text variant="labelLg" color="primaryContainer">
                  Lupa PIN?
                </Text>
              </Pressable>
              <Text variant="caption" color="textSecondary">
                Sisa {attemptsLeft} kesempatan
              </Text>
            </View>
          </Card>
        ) : null}

        {method === 'otp' ? (
          <Card style={styles.panel}>
            <Text variant="titleMd">Masuk dengan kode OTP</Text>
            <Text variant="bodyMd" color="textSecondary" style={styles.panelBody}>
              Kami akan mengirim 6 digit kode ke nomor terdaftar. Kode berlaku 15 menit dan hanya
              dapat dipakai sekali.
            </Text>
            <TextField
              label="Nomor lisensi atau telepon"
              placeholder="Masukkan nomor lisensi atau telepon"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="characters"
              autoCorrect={false}
              leftIcon="profile"
            />
            <Button
              label="Kirim kode OTP"
              icon="chat"
              onPress={() => {
                if (!identifier.trim()) {
                  setError('Isi nomor lisensi atau telepon terlebih dahulu.');
                  return;
                }
                router.push({ pathname: '/(auth)/otp', params: { identifier: identifier.trim() } });
              }}
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
                {errorKind === 'network'
                  ? 'Koneksi gagal'
                  : errorKind === 'locked'
                    ? 'Akun terkunci'
                    : errorKind === 'server'
                      ? 'Tidak dapat masuk'
                      : errorKind === 'input'
                        ? 'Data belum lengkap'
                        : 'PIN salah'}
              </Text>
              <Text variant="caption" color="onErrorContainer">
                {error}
              </Text>
              {__DEV__ && errorKind === 'network' ? (
                <Text variant="micro" color="textSecondary">
                  Server: {API_BASE_URL}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </ScreenBody>

      <View style={styles.footer}>
        <Button
          label="Masuk"
          iconAfter="forward"
          loading={busy}
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
