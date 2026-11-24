import { useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Badge, Button, Card, EmptyState, Screen, ScreenBody, ScreenHeader, Text, TextField } from '@/components/ui';
import { useApiQuery } from '@/hooks/api/useApiQuery';
import { expenseApi, tripApi, type TripExpense, type TripExpenseCategory } from '@/lib/api/endpoints';
import { formatDateTime, formatNumber } from '@/lib/format';
import { capturePhoto } from '@/lib/photo';
import { uploadImage } from '@/lib/upload';
import { colors, radius, spacing } from '@/theme';

/**
 * Biaya perjalanan (tol, parkir, bongkar muat, makan, penginapan) per trip + foto struk.
 * Riset 2026-11-24: biaya lapangan trucking sering tercecer di WhatsApp/catatan sehingga
 * biaya per rute tidak terukur. Finance meninjau di web; status kembali ke driver lewat notifikasi.
 */
const CATEGORIES: { key: TripExpenseCategory; label: string }[] = [
  { key: 'Toll', label: 'Tol' },
  { key: 'Parking', label: 'Parkir' },
  { key: 'LoadingUnloading', label: 'Bongkar muat' },
  { key: 'Meal', label: 'Makan' },
  { key: 'Lodging', label: 'Penginapan' },
  { key: 'Other', label: 'Lainnya' },
];
const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label])) as Record<TripExpenseCategory, string>;
const OPEN_STATUSES = new Set(['InProgress', 'Arrived', 'Completed']);
const STATUS: Record<TripExpense['status'], { label: string; tone: 'warning' | 'success' | 'critical' }> = {
  Submitted: { label: 'Menunggu', tone: 'warning' },
  Approved: { label: 'Disetujui', tone: 'success' },
  Rejected: { label: 'Ditolak', tone: 'critical' },
};

export default function ExpensesScreen() {
  const tripsQuery = useApiQuery(() => tripApi.list({ take: 30 }));
  const expensesQuery = useApiQuery(() => expenseApi.list());

  const trips = useMemo(
    () => (tripsQuery.data ?? []).filter((t) => OPEN_STATUSES.has(t.status)),
    [tripsQuery.data],
  );
  const [tripId, setTripId] = useState<string | undefined>();
  const selectedTrip = tripId ?? trips[0]?.id;

  const [category, setCategory] = useState<TripExpenseCategory>('Toll');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const amountValue = Number(amount.replace(/\D/g, ''));
  const canSubmit = Boolean(selectedTrip) && amountValue > 0 && Boolean(receiptUri) && !saving;

  async function takeReceipt() {
    const uri = await capturePhoto();
    if (uri) setReceiptUri(uri);
  }

  async function submit() {
    if (!canSubmit || !selectedTrip || !receiptUri) return;
    setSaving(true);
    try {
      const receiptPath = await uploadImage(receiptUri, 'biaya');
      await expenseApi.submit(selectedTrip, { category, amount: amountValue, receiptPath, note: note.trim() || null });
      setAmount('');
      setNote('');
      setReceiptUri(undefined);
      await expensesQuery.refetch();
      Alert.alert('Biaya terkirim', 'Finance akan meninjau. Status muncul di daftar dan notifikasi.');
    } catch (error) {
      Alert.alert('Biaya gagal dikirim', error instanceof Error ? error.message : 'Coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  const expenses = expensesQuery.data ?? [];

  return (
    <Screen>
      <ScreenHeader title="Biaya Perjalanan" onBack />
      <ScreenBody bottomPadding={spacing.xxl}>
        {trips.length === 0 ? (
          <EmptyState
            icon="receipt"
            title="Belum ada trip berjalan"
            description="Biaya tol, parkir, dan bongkar muat bisa dicatat setelah trip dimulai."
          />
        ) : (
          <Card style={styles.form}>
            <Text variant="labelMd" color="textSecondary">TRIP</Text>
            <View style={styles.chips}>
              {trips.map((t) => (
                <Chip key={t.id} label={t.tripCode ?? `${t.origin ?? ''} → ${t.destination ?? ''}`}
                  active={t.id === selectedTrip} onPress={() => setTripId(t.id)} />
              ))}
            </View>

            <Text variant="labelMd" color="textSecondary">JENIS BIAYA</Text>
            <View style={styles.chips}>
              {CATEGORIES.map((c) => (
                <Chip key={c.key} label={c.label} active={c.key === category} onPress={() => setCategory(c.key)} />
              ))}
            </View>

            <TextField label="Nominal (Rp)" placeholder="Contoh: 87500" keyboardType="number-pad" inputMode="numeric"
              value={amount ? formatNumber(amountValue) : ''} onChangeText={setAmount} />
            <TextField label="Catatan (opsional)" placeholder="Contoh: Tol Cikampek KM 20" value={note}
              onChangeText={setNote} maxLength={300} />

            <Pressable onPress={() => void takeReceipt()} accessibilityRole="button"
              accessibilityLabel="Foto struk" style={styles.receipt}>
              {receiptUri ? (
                <Image source={{ uri: receiptUri }} style={styles.receiptImage} />
              ) : (
                <>
                  <Icon name="camera" size={22} color={colors.primary} />
                  <Text variant="labelMd" color="primary">Foto struk (wajib)</Text>
                </>
              )}
            </Pressable>

            <Button label={saving ? 'Mengirim…' : 'Kirim ke Finance'} onPress={() => void submit()} disabled={!canSubmit} />
          </Card>
        )}

        <Text variant="labelMd" color="textSecondary" style={styles.sectionTitle}>RIWAYAT</Text>
        {expenses.length === 0 ? (
          <Text variant="bodyMd" color="textSecondary">Belum ada biaya yang diajukan.</Text>
        ) : (
          expenses.map((e) => (
            <Card key={e.id} style={styles.item}>
              <View style={styles.itemHead}>
                <Text variant="bodyBold">{LABEL[e.category] ?? e.category}</Text>
                <Badge label={STATUS[e.status].label} tone={STATUS[e.status].tone} />
              </View>
              <Text variant="headlineSm">Rp {formatNumber(e.amount)}</Text>
              <Text variant="caption" color="textSecondary">
                {formatDateTime(e.incurredAt)}{e.note ? ` · ${e.note}` : ''}
              </Text>
              {e.status === 'Rejected' && e.reviewNote ? (
                <Text variant="caption" color="critical">Alasan: {e.reviewNote}</Text>
              ) : null}
            </Card>
          ))
        )}
      </ScreenBody>
    </Screen>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}
      style={[styles.chip, active && styles.chipActive]}>
      <Text variant="labelMd" style={active ? styles.chipTextActive : undefined}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: 44, justifyContent: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTextActive: { color: colors.onPrimary },
  receipt: {
    minHeight: 96, borderRadius: radius.card, borderWidth: 1, borderStyle: 'dashed',
    borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, overflow: 'hidden',
  },
  receiptImage: { width: '100%', height: 160 },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.sm },
  item: { gap: spacing.xs, marginBottom: spacing.sm },
  itemHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
