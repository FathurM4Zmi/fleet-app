import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Button, Card, Text } from '@/components/ui';
import { useApiQuery } from '@/hooks/api/useApiQuery';
import { ApiError } from '@/lib/api/client';
import { shiftApi } from '@/lib/api/endpoints';
import { notify } from '@/lib/notify';
import { pickShift, shiftAction } from '@/lib/shift';
import { colors, spacing } from '@/theme';

const time = (iso: string) => new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
const day = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });

/**
 * FRD-M20-05 — kartu "Shift" di beranda: satu tombol besar clock-in/clock-out.
 * Tidak tampil bila driver tidak punya shift dalam waktu dekat (perusahaan yang belum memakai shift).
 */
export function ShiftCard() {
  const query = useApiQuery(shiftApi.mine, []);
  const [busy, setBusy] = useState(false);
  const now = new Date();
  const shift = query.data ? pickShift(query.data, now) : null;
  if (!shift) return null;

  const action = shiftAction(shift, now);
  const onDuty = Boolean(shift.clockInAt && !shift.clockOutAt);
  const late = shift.attendance.includes('terlambat') || shift.attendance === 'Belum clock-in';

  const press = async () => {
    if (!action) return;
    setBusy(true);
    try {
      await (action === 'clockIn' ? shiftApi.clockIn(shift.id) : shiftApi.clockOut(shift.id));
      notify(action === 'clockIn' ? 'Clock-in tercatat' : 'Clock-out tercatat', `Jam ${time(new Date().toISOString())}`);
      await query.refetch();
    } catch (error) {
      notify('Gagal', error instanceof ApiError ? (error.detail ?? error.message) : 'Periksa koneksi lalu coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Icon name="schedule" size={22} color={onDuty ? colors.success : late ? colors.warning : colors.textSecondary} />
        <View style={styles.flex}>
          <Text variant="labelMd" color="textMuted">{onDuty ? 'SEDANG BERTUGAS' : 'SHIFT BERIKUTNYA'}</Text>
          <Text variant="bodyBold">{`${day(shift.startAt)} · ${time(shift.startAt)}–${time(shift.endAt)}`}</Text>
          <Text variant="labelSm" color={late ? colors.warning : colors.textSecondary}>
            {onDuty && shift.clockInAt ? `Clock-in ${time(shift.clockInAt)} · ${shift.attendance}` : shift.attendance}
          </Text>
        </View>
      </View>
      {action ? (
        <Button
          label={action === 'clockIn' ? 'Clock-in sekarang' : 'Clock-out'}
          variant={action === 'clockIn' ? 'primary' : 'secondary'}
          icon={action === 'clockIn' ? 'check' : 'logout'}
          fullWidth
          loading={busy}
          onPress={() => void press()}
        />
      ) : (
        <Text variant="labelSm" color="textSecondary">Tombol clock-in aktif 60 menit sebelum shift dimulai.</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: 2 },
});
