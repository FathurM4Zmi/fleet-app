import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Button, Card, PinInput, Screen, ScreenBody, Text, TextField } from '@/components/ui';
import { ApiError } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/api/config';
import { useAuth } from '@/store/auth';
import { colors, radius, spacing } from '@/theme';

/** Wrong-PIN attempts allowed before the account locks (FRD-MOB-LOGIN-03). */
const MAX_ATTEMPTS = 5;

/** Nomor HP terdaftar di backend — backend hanya memangkas spasi, jadi kirim digit saja. */
const PHONE_MIN_LENGTH = 9;
const PHONE_MAX_LENGTH = 15;

export default function LoginScreen() {
  const { loginWithPin } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [busy, setBusy] = useState(false);
  // Guards against a second auto-submit landing before `busy` re-renders, which
  // would send two login requests and burn two attempts on one wrong PIN.
  const submitting = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<
    'network' | 'auth' | 'locked' | 'server' | 'rate' | 'input' | null
  >(null);

  const locked = attemptsLeft === 0;
  const phone = identifier.trim();
  const canSubmit = phone.length >= PHONE_MIN_LENGTH && pin.length === 6 && !locked && !busy;

  const clearError = () => {
    if (error) {
      setError(null);
      setErrorKind(null);
    }
  };

  const handleIdentifierChange = (next: string) => {
    // Backend membandingkan identifier apa adanya (hanya trim + lowercase), jadi
    // spasi/tanda hubung akan membuat nomor tidak ditemukan. Simpan digit saja.
    setIdentifier(next.replace(/\D/g, '').slice(0, PHONE_MAX_LENGTH));
    clearError();
  };

  /**
   * `candidate` comes straight from `PinInput.onComplete`, which fires inside the
   * same text-change handler that queued `setPin`. Reading the `pin` state there
   * would still yield the pre-keystroke value, so the completed PIN is passed in.
   */
  const handleSubmit = async (candidate: string = pin) => {
    if (locked || busy || submitting.current) return;

    // Auto-submit from `PinInput` can fire before the phone number is filled in.
    // Validate here so the button and the auto-submit share one rule set.
    if (phone.length < PHONE_MIN_LENGTH) {
      setErrorKind('input');
      setError('Isi nomor HP yang terdaftar terlebih dahulu.');
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
      await loginWithPin(phone, candidate);
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

      // The API throttles auth endpoints (10 requests/minute) — that is not a
      // wrong PIN either, so keep the counter and the entered value.
      if (apiError.status === 429) {
        setErrorKind('rate');
        setError('Terlalu banyak percobaan masuk. Tunggu satu menit lalu coba lagi.');
        return;
      }

      // The API answers a locked account with a plain 401 (anti-enumeration),
      // so 401 is the only "rejected credential" signal there is. Other
      // statuses (400/500) are server-side problems and must not lock the
      // driver out. Keep the PIN for a retry; wipe it only on a real 401.
      if (apiError.status !== 401) {
        setErrorKind('server');
        setError(apiError.message);
        return;
      }

      setPin('');
      const remaining = Math.max(0, attemptsLeft - 1);
      setAttemptsLeft(remaining);
      setErrorKind(remaining === 0 ? 'locked' : 'auth');
      // LOGIN-04 — the server is the authority on lock/licence state. Surface a
      // specific reason (e.g. SIM kedaluwarsa) when it sends one; otherwise keep
      // the anti-enumeration wording.
      const serverMessage = apiError.message?.trim();
      const specificReason =
        serverMessage && !/invalid|tidak cocok|kredensial|salah/i.test(serverMessage)
          ? serverMessage
          : null;
      setError(
        specificReason ??
          (remaining === 0
            ? 'Akun terkunci sementara. Hubungi supervisor untuk membuka.'
            : `Nomor HP atau PIN tidak cocok. Sisa ${remaining} kesempatan sebelum akun terkunci sementara.`),
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  const openOtp = () => {
    if (phone.length < PHONE_MIN_LENGTH) {
      setErrorKind('input');
      setError('Isi nomor HP yang terdaftar terlebih dahulu.');
      return;
    }
    router.push({ pathname: '/(auth)/otp', params: { identifier: phone } });
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
            Gunakan nomor HP yang terdaftar di data driver dan PIN 6 digit dari supervisor.
          </Text>
        </View>

        <Card style={styles.panel}>
          <TextField
            label="Nomor HP"
            placeholder="Nomor HP terdaftar"
            value={identifier}
            // Nomor tidak ditampilkan terang-terangan di layar; ikon mata
            // membuka sementara bila driver perlu memeriksa digitnya.
            password
            onChangeText={handleIdentifierChange}
            helper="Nomor HP yang dipakai saat akun driver dibuat."
            keyboardType="phone-pad"
            inputMode="tel"
            autoComplete="tel"
            textContentType="telephoneNumber"
            autoCorrect={false}
            maxLength={PHONE_MAX_LENGTH}
            leftIcon="profile"
            returnKeyType="next"
            autoFocus
            editable={!locked && !busy}
          />

          <View style={styles.pinHead}>
            <Text variant="labelMd" color="textSecondary">
              PIN 6 digit
            </Text>
            <Pressable onPress={() => router.push('/(auth)/reset-pin')} hitSlop={8}>
              <Text variant="labelLg" color="primaryContainer">
                Lupa PIN?
              </Text>
            </Pressable>
          </View>

          <PinInput
            value={pin}
            onChange={(next) => {
              setPin(next);
              clearError();
            }}
            onComplete={handleSubmit}
            hasError={errorKind === 'auth' || errorKind === 'locked'}
          />

          <View style={styles.panelMeta}>
            <Text variant="caption" color="textSecondary">
              PIN dikirim supervisor, bukan kata sandi.
            </Text>
            <Text variant="caption" color={locked ? 'critical' : 'textSecondary'}>
              Sisa {attemptsLeft}
            </Text>
          </View>
        </Card>

        {error ? (
          <View style={styles.alert} accessibilityLiveRegion="polite">
            <Icon name="error" size={20} color={colors.critical} />
            <View style={styles.alertBody}>
              <Text variant="labelMd" color="critical">
                {errorKind === 'network'
                  ? 'Koneksi gagal'
                  : errorKind === 'locked'
                    ? 'Akun terkunci'
                    : errorKind === 'rate'
                      ? 'Terlalu banyak percobaan'
                      : errorKind === 'server'
                        ? 'Tidak dapat masuk'
                        : errorKind === 'input'
                          ? 'Data belum lengkap'
                          : 'Login ditolak'}
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

        <View style={styles.altMethods}>
          <Text variant="caption" color="textSecondary">
            Tidak bisa memakai PIN?
          </Text>
          <View style={styles.altRow}>
            <Button label="Kirim kode OTP" variant="ghost" icon="chat" onPress={openOtp} style={styles.altButton} />
            <Button
              label="Pindai QR"
              variant="ghost"
              icon="qr"
              onPress={() => router.push('/(auth)/scan-qr')}
              style={styles.altButton}
            />
          </View>
        </View>
      </ScreenBody>

      <View style={styles.footer}>
        <Button
          label="Masuk"
          iconAfter="forward"
          loading={busy}
          disabled={!canSubmit}
          onPress={() => handleSubmit()}
        />
        <Text variant="micro" color="textMuted" align="center">
          Hubungi supervisor bila nomor HP belum terdaftar atau akun terkunci.
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
    width: 48,
    height: 48,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: { marginTop: spacing.sm, marginBottom: spacing.xl },
  headlineBody: { marginTop: 6 },
  panel: { gap: spacing.lg },
  pinHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  panelMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  altMethods: { marginTop: spacing.xl, gap: spacing.sm },
  altRow: { flexDirection: 'row', gap: spacing.sm },
  altButton: { flex: 1 },
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
