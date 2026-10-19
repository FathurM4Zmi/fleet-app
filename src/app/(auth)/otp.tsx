import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Button, PinInput, Screen, ScreenBody, Text } from '@/components/ui';
import { ApiError } from '@/lib/api/client';
import { authApi } from '@/lib/api/endpoints';
import { formatCountdown } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { colors, radius, spacing } from '@/theme';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 42;

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const { identifier = '' } = useLocalSearchParams<{ identifier?: string }>();
  const { loginWithOtp } = useAuth();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const requestCode = useCallback(async () => {
    try {
      await authApi.requestOtp(identifier);
      setSecondsLeft(RESEND_SECONDS);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Gagal mengirim kode OTP.');
    }
  }, [identifier]);

  useEffect(() => {
    // Kirim kode sekali saat layar dibuka; state baru berubah setelah request selesai.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void requestCode();
  }, [requestCode]);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const canSubmit = code.length === OTP_LENGTH && !busy;

  /**
   * `candidate` comes straight from `PinInput.onComplete`, which fires inside the
   * same text-change handler that queued `setCode`. Reading the `code` state there
   * would still yield the pre-keystroke value, so the completed code is passed in.
   */
  const handleVerify = async (candidate: string = code) => {
    if (busy) return;
    setBusy(true);
    try {
      await loginWithOtp(identifier, candidate);
    } catch (caught) {
      setCode('');
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Kode salah atau kedaluwarsa. Silakan minta kode baru.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen style={{ backgroundColor: colors.surface }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          hitSlop={8}
          style={styles.headerButton}
        >
          <Icon name="back" size={22} color={colors.onSurface} />
        </Pressable>

        <Text variant="titleMd">Verifikasi OTP</Text>

        <Pressable accessibilityRole="button" accessibilityLabel="Bantuan login" hitSlop={8} style={styles.headerButton}>
          <Icon name="help" size={20} color={colors.secondary} />
        </Pressable>
      </View>

      <ScreenBody bottomPadding={spacing.md} style={styles.body}>
        <View style={styles.hero}>
          <View style={styles.heroCircle}>
            <Icon name="messageUnread" size={36} color={colors.primaryContainer} />
          </View>
        </View>

        <View style={styles.heading}>
          <Text variant="headlineMd" align="center">
            Masukkan kode OTP
          </Text>
          <Text variant="bodyMd" color="textSecondary" align="center" style={styles.headingBody}>
            Kami kirimkan 6 digit kode ke akun{' '}
            <Text variant="bodyBold">{identifier || 'terdaftar'}</Text>
          </Text>
          <Pressable style={styles.waChip} accessibilityRole="button">
            <Icon name="chat" size={16} color={colors.primaryContainer} />
            <Text variant="labelSm" color="primaryContainer">
              Kirim via WhatsApp?
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputWrap}>
          <PinInput
            value={code}
            onChange={(next) => {
              setCode(next);
              if (error) setError(null);
            }}
            onComplete={handleVerify}
            autoFocus
            hasError={Boolean(error)}
          />
        </View>

        {error ? (
          <View style={styles.alert} accessibilityLiveRegion="polite">
            <Icon name="error" size={20} color={colors.critical} />
            <View style={styles.alertBody}>
              <Text variant="labelMd" color="critical">
                Kode tidak sesuai
              </Text>
              <Text variant="caption" color="onErrorContainer">
                {error}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.resendRow}>
          <Text variant="caption" color="textSecondary">
            Belum menerima kode?
          </Text>
          <Pressable
            onPress={() => void requestCode()}
            disabled={secondsLeft > 0}
            accessibilityRole="button"
          >
            <Text
              variant="labelLg"
              color={secondsLeft > 0 ? 'textMuted' : 'primaryContainer'}
            >
              Kirim ulang
            </Text>
          </Pressable>
          <View style={styles.timerChip}>
            <Text variant="labelSm" color="textSecondary">
              {formatCountdown(secondsLeft)}
            </Text>
          </View>
        </View>

        <View style={styles.trustCard}>
          <Icon name="verified" size={20} color={colors.textSecondary} />
          <Text variant="micro" color="textSecondary" style={styles.trustText}>
            Kode berlaku 15 menit dan hanya dapat dipakai sekali demi keamanan akun pengemudi.
          </Text>
        </View>

        <Text variant="micro" color="textMuted" align="center" style={styles.demoHint}>
          Kode dikirim ke akun terdaftar. Hubungi dispatcher bila tidak diterima.
        </Text>
      </ScreenBody>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label="Verifikasi"
          iconAfter="forward"
          disabled={!canSubmit}
          onPress={() => handleVerify()}
        />
        <Pressable accessibilityRole="button" style={styles.supportLink}>
          <Icon name="support" size={14} color={colors.textSecondary} />
          <Text variant="caption" color="textSecondary">
            Butuh bantuan login? <Text variant="labelMd" color="primaryContainer">Hubungi Dispatcher</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: spacing.xl },
  hero: { alignItems: 'center', marginTop: spacing.xl },
  heroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.infoContainer,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: { alignItems: 'center', marginTop: spacing.lg },
  headingBody: { marginTop: 6 },
  waChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  inputWrap: { marginVertical: spacing.lg },
  alert: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  alertBody: { flex: 1, gap: 2 },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  timerChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.neutralContainer,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  trustText: { flex: 1 },
  demoHint: { marginTop: spacing.md },
  footer: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
