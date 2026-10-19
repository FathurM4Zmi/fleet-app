import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  Badge,
  BottomBar,
  Button,
  Card,
  EmptyState,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { toDocumentDetail } from '@/data/adapters';
import { useDocument } from '@/hooks/api/useDriverData';
import { colors, radius, spacing } from '@/theme';
import type { DocumentStatus } from '@/data/types';

const STATUS_TONE: Record<DocumentStatus, 'success' | 'warning' | 'critical'> = {
  valid: 'success',
  expiring: 'warning',
  expired: 'critical',
};

export default function DocumentDetailScreen() {
  const { documentKey } = useLocalSearchParams<{ documentKey: string }>();
  const query = useDocument(documentKey);
  const document = query.data ? toDocumentDetail(query.data) : undefined;

  if (!document) {
    return (
      <Screen>
        <ScreenHeader title="Detail Dokumen" onBack />
        <EmptyState
          icon="document"
          title="Dokumen tidak ditemukan"
          description={query.error?.message ?? 'Dokumen ini mungkin sudah tidak terdaftar.'}
        />
      </Screen>
    );
  }

  const tone = STATUS_TONE[document.status];
  const expiring = document.status !== 'valid';

  return (
    <Screen>
      <ScreenHeader
        title="Detail Dokumen"
        onBack
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Menu opsi" hitSlop={8}>
            <Icon name="more" size={22} color={colors.onSurface} />
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={160}>
        {/* Card preview */}
        <Card shadow>
          <View style={styles.previewHead}>
            <View style={styles.previewLabel}>
              <Icon name="idCard" size={16} color={colors.primaryContainer} />
              <Text variant="labelSm" color="onSurface" style={styles.upper}>
                {document.cardLabel}
              </Text>
            </View>
            <Text variant="labelSm" color="textMuted" style={styles.mono}>
              ID-IND
            </Text>
          </View>

          <View style={styles.previewBody}>
            <View style={styles.photoTile}>
              <Icon name="profile" size={30} color={colors.textMuted} />
              <Text variant="labelSm" color="textMuted" style={styles.upper}>
                FOTO
              </Text>
            </View>
            <View style={styles.lines}>
              <View style={[styles.line, styles.lineW80]} />
              <View style={[styles.line, styles.lineW100]} />
              <View style={[styles.line, styles.lineW60]} />
              <View style={[styles.line, styles.lineW40]} />
            </View>
          </View>

          <View style={styles.previewFoot}>
            <View style={styles.authenticated}>
              <Icon name="verified" size={13} color={colors.textMuted} />
              <Text variant="labelSm" color="textMuted">
                Terotentikasi
              </Text>
            </View>
            <Badge label={document.statusLabel} tone={tone} dot />
          </View>
        </Card>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text variant="headlineMd">{document.title}</Text>
          <Text variant="bodyMd" color="textSecondary">
            {document.subtitle}
          </Text>
          <View style={styles.updatedRow}>
            <Icon name="schedule" size={14} color={colors.textMuted} />
            <Text variant="labelSm" color="textMuted">
              {document.updatedNote}
            </Text>
          </View>
        </View>

        {/* Warning */}
        {document.warning ? (
          <View style={styles.warning}>
            <Icon name="warning" size={20} color={colors.warning} />
            <View style={styles.flex}>
              <Text variant="bodyBold" color="#451A03">
                {document.warning.title}
              </Text>
              <Text variant="labelMd" color="#92400E" style={styles.warningBody}>
                {document.warning.body}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Rows */}
        <Card padded={false} shadow style={styles.rowsCard}>
          {document.rows.map((row, index) => (
            <View key={row.key}>
              <View style={styles.row}>
                <Text variant="bodyMd" color="textSecondary">
                  {row.label}
                </Text>
                {row.badge ? (
                  <View style={styles.rowBadge}>
                    <Text variant="labelMd" color={colors.primaryContainer}>
                      {row.value}
                    </Text>
                  </View>
                ) : (
                  <Text
                    variant={row.mono ? 'labelLg' : 'bodyBold'}
                    style={row.mono ? styles.mono : undefined}
                  >
                    {row.value}
                  </Text>
                )}
              </View>
              {index < document.rows.length - 1 ? <View style={styles.rowDivider} /> : null}
            </View>
          ))}
        </Card>

        {/* Notice */}
        <View style={styles.notice}>
          <Icon name="lock" size={18} color={colors.textSecondary} />
          <Text variant="caption" color="textSecondary" style={styles.flex}>
            Hanya administrator yang dapat memperbarui dokumen ini.
          </Text>
        </View>
      </ScreenBody>

      <BottomBar>
        <Button label="Unggah Foto Baru" icon="upload" />
        {expiring ? (
          <Button label="Hubungi Supervisor" icon="headset" variant="secondary" size="md" />
        ) : null}
      </BottomBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },
  mono: { fontVariant: ['tabular-nums'] },

  previewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  previewLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  previewBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.md + 2 },
  photoTile: {
    width: 64,
    height: 80,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.divider,
    gap: spacing.xs,
  },
  lines: { flex: 1, gap: spacing.sm },
  line: { height: 10, borderRadius: radius.pill, backgroundColor: '#F1F5F9' },
  lineW80: { width: '80%', backgroundColor: '#E2E8F0' },
  lineW100: { width: '100%' },
  lineW60: { width: '60%' },
  lineW40: { width: '40%' },
  previewFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  authenticated: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },

  titleBlock: { marginTop: spacing.lg, gap: 2 },
  updatedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2, marginTop: spacing.xs },

  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md + 2,
    borderRadius: radius.card,
    backgroundColor: '#FDF1E3',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningBody: { marginTop: 2 },

  rowsCard: { marginTop: spacing.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.md + 2,
  },
  rowDivider: { height: 1, backgroundColor: '#F1F5F9' },
  rowBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
