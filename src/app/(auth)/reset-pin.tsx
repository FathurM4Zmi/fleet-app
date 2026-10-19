import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Button, PinInput, Screen, ScreenBody, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

/** Prototype credential — the real flow validates the server-issued code. */
const DEMO_CODE = '123456';

/** Scores a 6-digit PIN on repetition and ascending runs. */
const pinStrength = (pin: string): { score: 0 | 1 | 2 | 3; label: string } => {
  if (pin.length < 6) return { score: 1, label: 'Terlalu pendek' };

  const unique = new Set(pin).size;
  const isSequential = /^(?:012345|123456|234567|345678|456789|567890)$/.test(pin);
  const isRepeated = unique === 1;

  if (isRepeated || isSequential) return { score: 1, label: 'PIN terlalu mudah ditebak' };
  if (unique <= 3) return { score: 2, label: 'PIN cukup kuat' };
  return { score: 3, label: 'PIN kuat' };
};

export default function ResetPinScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const strength = pinStrength(newPin);
  const mismatch = confirmPin.length === 6 && confirmPin !== newPin;
  const canSubmit =
    code === DEMO_CODE && newPin.length === 6 && confirmPin === newPin && strength.score >= 2;

  const handleSubmit = () => {
    if (code !== DEMO_CODE) {
      setError('Kode verifikasi tidak sesuai. Minta kode baru bila sudah kedaluwarsa.');
      return;
    }
    if (confirmPin !== newPin) {
      setError('Konfirmasi PIN tidak sama dengan PIN baru.');
      return;
    }
    setError(null);
    router.replace('/(auth)/login');
  };

  return (
    <Screen style={{ backgroundColor: colors.surface }}>
      <ScreenBody bottomPadding={spacing.lg}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Icon name="key" size={24} color={colors.primaryContainer} />
          </View>
          <Text variant="headlineMd" align="center">
            Atur Ulang PIN
          </Text>
          <Text variant="labelMd" color="secondary" align="center" style={styles.headerSub}>
            Verifikasi identitas Anda untuk membuat PIN baru.
          </Text>
        </View>

        <View style={styles.field}>
          <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
            NOMOR HP
          </Text>
          <View style={styles.readonly}>
            <Icon name="chat" size={18} color={colors.textSecondary} />
            <Text variant="bodyMd">+62 812-3456-7890</Text>
          </View>
          <Text variant="micro" color="textMuted" style={styles.helper}>
            Nomor terdaftar pada akun Anda.
          </Text>
        </View>

        <View style={styles.field}>
          <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
            KODE VERIFIKASI
          </Text>
          <PinInput value={code} onChange={setCode} autoFocus />
          <View style={styles.resendRow}>
            <Text variant="micro" color="textSecondary">
              Tidak terima kode?
            </Text>
            <Text variant="labelSm" color="primaryContainer">
              Kirim ulang kode
            </Text>
          </View>
          <Text variant="micro" color="textMuted">
            Kode demo: {DEMO_CODE}
          </Text>
        </View>

        <View style={styles.field}>
          <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
            PIN BARU
          </Text>
          <PinInput value={newPin} onChange={setNewPin} />
          <View style={styles.strength}>
            <View style={styles.strengthBars}>
              {[0, 1, 2].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.strengthBar,
                    index < strength.score ? styles.strengthBarOn : null,
                  ]}
                />
              ))}
            </View>
            {newPin.length === 6 ? (
              <View style={styles.strengthLabel}>
                <Icon
                  name={strength.score >= 2 ? 'success' : 'warning'}
                  size={14}
                  color={strength.score >= 2 ? colors.success : colors.warning}
                />
                <Text
                  variant="labelSm"
                  color={strength.score >= 2 ? 'success' : 'warning'}
                >
                  {strength.label}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="labelMd" color="textSecondary" style={styles.fieldLabel}>
            KONFIRMASI PIN BARU
          </Text>
          <PinInput
            value={confirmPin}
            onChange={(value) => {
              setConfirmPin(value);
              if (error) setError(null);
            }}
            hasError={mismatch}
          />
          {mismatch ? (
            <Text variant="caption" color="error" style={styles.helper}>
              Konfirmasi PIN belum sama.
            </Text>
          ) : null}
        </View>

        {error ? (
          <View style={styles.alert} accessibilityLiveRegion="polite">
            <Icon name="error" size={20} color={colors.critical} />
            <Text variant="caption" color="onErrorContainer" style={styles.alertText}>
              {error}
            </Text>
          </View>
        ) : null}
      </ScreenBody>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Atur Ulang PIN" disabled={!canSubmit} onPress={handleSubmit} />
        <Button
          label="Kembali ke login"
          variant="ghost"
          onPress={() => router.replace('/(auth)/login')}
        />
        <View style={styles.securityNote}>
          <Icon name="lock" size={13} color={colors.textMuted} />
          <Text variant="micro" color="textMuted">
            PIN baru berlaku setelah verifikasi supervisor.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: spacing.lg, gap: spacing.xs },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  headerSub: { marginTop: spacing.xs },
  field: { marginTop: spacing.xl },
  fieldLabel: { marginBottom: spacing.sm, textTransform: 'uppercase' },
  readonly: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
  },
  helper: { marginTop: spacing.xs + 2 },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  strength: { marginTop: spacing.sm, gap: spacing.xs },
  strengthBars: { flexDirection: 'row', gap: spacing.xs + 2 },
  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceHighest,
  },
  strengthBarOn: { backgroundColor: colors.primaryContainer },
  strengthLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.critical,
    backgroundColor: colors.criticalContainer,
  },
  alertText: { flex: 1 },
  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
