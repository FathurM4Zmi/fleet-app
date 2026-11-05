import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { Badge, Button, Card, Screen, Sheet, Text, TextField } from '@/components/ui';
import { toDriver, toProfileDocument, toVehicle } from '@/data/adapters';
import type { DocumentStatus } from '@/data/types';
import { useDna, useDocuments, useHome, useVehicle } from '@/hooks/api/useDriverData';
import { profileApi } from '@/lib/api/endpoints';
import { formatDate, scoreTone } from '@/lib/format';
import { emptyDriver } from '@/store/app';
import { useAuth } from '@/store/auth';
import { colors, radius, shadows, spacing } from '@/theme';

interface MenuEntry {
  key: string;
  icon: IconName;
  iconColor: string;
  label: string;
  value: string;
  tone?: 'neutral' | 'primary' | 'warning';
  badge?: { label: string; tone: 'warning' | 'success' };
  /** Route opened by the row. */
  href: Href;
}

/** Document types seeded by the API (FRD-MOB-PROFILE-02). */
const DOC_ICON: Record<string, IconName> = {
  SIM: 'idCard',
  KTP: 'contactCard',
  'Sertifikat Homolog': 'verified',
  STNK: 'document',
  SKCK: 'shield',
  KIR: 'verified',
  'Foto Kendaraan': 'truck',
};

const DOC_TONE: Record<DocumentStatus, 'success' | 'warning' | 'critical'> = {
  valid: 'success',
  expiring: 'warning',
  expired: 'critical',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const home = useHome();
  const dna = useDna();
  const vehicleQuery = useVehicle();
  const documentsQuery = useDocuments();
  const { logout } = useAuth();
  const driver = home.data ? toDriver(home.data.profile, dna.data?.score ?? 0) : emptyDriver;

  const vehicle = vehicleQuery.data ? toVehicle(vehicleQuery.data) : undefined;

  const [editOpen, setEditOpen] = useState(false);
  const [draftName, setDraftName] = useState(driver.name);
  const [draftPhone, setDraftPhone] = useState(driver.phone);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const canSaveEdit = draftName.trim().length > 1 && draftPhone.trim().length >= 8;

  const openEdit = () => {
    setDraftName(driver.name);
    setDraftPhone(driver.phone);
    setSaveError(null);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!canSaveEdit || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await profileApi.updateContact({ name: draftName.trim(), phone: draftPhone.trim() });
      await home.refetch();
      setEditOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };
  const dnaTone = scoreTone(driver.dnaScore);

  const features: MenuEntry[] = [
    {
      key: 'performance',
      icon: 'performance',
      iconColor: colors.primary,
      label: 'Kinerja Saya',
      value: `Skor ${driver.dnaScore}`,
      tone: 'primary',
      href: '/performance',
    },
    {
      key: 'dna',
      icon: 'health',
      iconColor: colors.success,
      label: 'DNA Kesehatan',
      value: String(driver.dnaScore),
      href: '/dna',
    },
    {
      key: 'coaching',
      icon: 'school',
      iconColor: colors.onSurfaceVariant,
      label: 'Coaching dan Sertifikasi',
      value: '2 aktif',
      href: '/coaching',
    },
    {
      key: 'compliance',
      icon: 'verified',
      iconColor: colors.warning,
      label: 'Kepatuhan',
      value: '',
      badge: { label: '1 kedaluwarsa', tone: 'warning' },
      href: '/compliance',
    },
    {
      key: 'activity',
      icon: 'history',
      iconColor: colors.onSurfaceVariant,
      label: 'Aktivitas Saya',
      value: 'Riwayat',
      href: '/activity',
    },
    {
      key: 'settlement',
      icon: 'payments',
      iconColor: colors.primary,
      label: 'Settlement',
      value: 'Rp 8.450.000',
      tone: 'neutral',
      href: '/settlement',
    },
    {
      key: 'fuelCard',
      icon: 'fuelCard',
      iconColor: colors.primary,
      label: 'Kartu BBM',
      value: 'Lihat kartu',
      href: '/fuel-card',
    },
    {
      key: 'vehicle',
      icon: 'truck',
      iconColor: colors.onSurfaceVariant,
      label: 'Kendaraan Saya',
      value: vehicle?.plate ?? 'Lihat kendaraan',
      href: '/vehicle',
    },
    {
      key: 'safety',
      icon: 'shield',
      iconColor: colors.success,
      label: 'Peristiwa Safety',
      value: 'Lihat riwayat',
      href: '/safety',
    },
  ];

  const documents = (documentsQuery.data ?? []).map(toProfileDocument);


  return (
    <Screen>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.topBarRow}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            hitSlop={8}
            style={styles.topBarButton}
          >
            <Icon name="back" size={24} color={colors.onSurface} />
          </Pressable>
          <Text variant="headlineSm">Profil Driver</Text>
          <View style={styles.topBarButton} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity */}
        <Card shadow>
          <View style={styles.identityRow}>
            <View style={styles.identityLeft}>
              <View style={styles.avatar}>
                <Text variant="headlineSm" color="onPrimary">
                  {driver.initials}
                </Text>
              </View>
              <View style={styles.identityText}>
                <Text variant="headlineSm">{driver.name}</Text>
                <Text variant="labelMd" color="secondary">
                  Driver • ID {driver.employeeId} • {driver.site}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={openEdit}
              accessibilityRole="button"
              accessibilityLabel="Edit profil"
              style={({ pressed }) => [styles.editButton, pressed && styles.menuRowPressed]}
            >
              <Icon name="edit" size={14} color={colors.onSurface} />
              <Text variant="labelMd">Edit</Text>
            </Pressable>
          </View>

          <View style={styles.chips}>
            <View style={styles.chip}>
              <Icon name="phone" size={15} color={colors.primary} />
              <Text variant="labelMd" color="onSurfaceVariant">
                {driver.phone}
              </Text>
            </View>
          </View>
        </Card>

        {/* DNA + vehicle strip */}
        <View style={styles.strip}>
          <Card padded={false} shadow style={styles.stripCard}>
            <View style={styles.stripInner}>
              <View style={styles.stripHead}>
                <Text variant="labelMd" color="secondary" style={styles.upper}>
                  Skor DNA
                </Text>
              </View>
              <View style={styles.stripValue}>
                <Text variant="headlineMd" numberOfLines={1}>
                  DNA {driver.dnaScore}
                </Text>
                <Text
                  variant="labelSm"
                  numberOfLines={1}
                  color={dnaTone === 'success' ? 'success' : 'warning'}
                >
                  {dnaTone === 'success' ? 'Baik' : 'Perlu perhatian'}
                </Text>
              </View>
            </View>
          </Card>

          <Card padded={false} shadow style={styles.stripCard}>
            <View style={styles.stripInner}>
              <View style={styles.stripHead}>
                <Text variant="labelMd" color="secondary" style={styles.upper}>
                  Unit Armada
                </Text>
              </View>
              <View style={styles.stripValueRow}>
                <Text variant="titleMd" numberOfLines={1} style={styles.flexShrink}>
                  {vehicle?.plate ?? '—'}
                </Text>
                <Icon name="truck" size={18} color={colors.secondary} />
              </View>
            </View>
          </Card>
        </View>

        {/* Feature hub */}
        <View style={styles.section}>
          <Text variant="labelMd" color="secondary" style={[styles.upper, styles.sectionTitle]}>
            FITUR SAYA
          </Text>
          <Card padded={false} shadow>
            {features.map((entry, index) => (
              <View key={entry.key}>
                <Pressable
                  onPress={() => router.push(entry.href)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                >
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIcon}>
                      <Icon name={entry.icon} size={20} color={entry.iconColor} />
                    </View>
                    <Text variant="bodyBold">{entry.label}</Text>
                  </View>
                  <View style={styles.menuRight}>
                    {entry.badge ? (
                      <Badge label={entry.badge.label} tone={entry.badge.tone} />
                    ) : (
                      <Text
                        variant="labelMd"
                        color={entry.tone === 'primary' ? 'primary' : 'textSecondary'}
                      >
                        {entry.value}
                      </Text>
                    )}
                    <Icon name="forward" size={18} color={colors.secondary} />
                  </View>
                </Pressable>
                {index < features.length - 1 ? <View style={styles.rowDivider} /> : null}
              </View>
            ))}
          </Card>
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text variant="labelMd" color="secondary" style={[styles.upper, styles.sectionTitle]}>
            DOKUMEN
          </Text>
          <Card padded={false} shadow>
            {documents.length === 0 ? (
              <View style={styles.docRow}>
                <Text variant="bodyMd" color="textSecondary">
                  {documentsQuery.loading ? 'Memuat dokumen…' : 'Belum ada dokumen terdaftar.'}
                </Text>
              </View>
            ) : null}
            {documents.map((document, index) => (
              <View key={document.key}>
                <Pressable
                  onPress={() => router.push(`/documents/${document.key}` as Href)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.docRow, pressed && styles.menuRowPressed]}
                >
                  <View style={styles.docLeft}>
                    <Icon
                      name={DOC_ICON[document.documentType] ?? 'document'}
                      size={20}
                      color={colors.secondary}
                    />
                    <Text variant="bodyBold">{document.documentType}</Text>
                  </View>
                  <View style={styles.menuRight}>
                    <Badge label={document.statusLabel} tone={DOC_TONE[document.status]} />
                    <Icon name="forward" size={18} color={colors.secondary} />
                  </View>
                </Pressable>
                {index < documents.length - 1 ? <View style={styles.rowDivider} /> : null}
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.note}>
          <Icon name="lock" size={18} color={colors.secondary} />
          <Text variant="caption" color="secondary" style={styles.noteText}>
            Nama dan nomor HP dapat Anda perbarui sendiri. Data lain hanya dapat diubah
            administrator. SIM berlaku sampai{' '}
            {driver.licenseExpiry ? formatDate(driver.licenseExpiry) : '—'}.
          </Text>
        </View>

        <Pressable
          onPress={() => {
            const message =
              'Data yang belum terkirim tetap disimpan di perangkat dan akan dikirim saat Anda masuk kembali.';
            // react-native-web ships a no-op Alert (dist/exports/Alert is an
            // empty class), so a confirmation dialog on web silently did
            // nothing and the logout button never fired.
            if (Platform.OS === 'web') {
              if (globalThis.confirm?.(`Keluar dari akun?\n\n${message}`)) void logout();
              return;
            }
            Alert.alert('Keluar dari akun?', message, [
              { text: 'Batal', style: 'cancel' },
              { text: 'Keluar', style: 'destructive', onPress: () => void logout() },
            ]);
          }}
          accessibilityRole="button"
          style={styles.logout}
        >
          <Icon name="logout" size={18} color={colors.critical} />
          <Text variant="labelLg" color="critical">
            Keluar dari akun
          </Text>
        </Pressable>
      </ScrollView>

      <Sheet
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profil"
        description="Perbarui data yang tampil di akun Anda."
      >
        <TextField
          label="Nama lengkap"
          value={draftName}
          onChangeText={setDraftName}
          leftIcon="idCard"
          placeholder="Nama lengkap"
        />
        <TextField
          label="Nomor HP"
          value={draftPhone}
          onChangeText={setDraftPhone}
          leftIcon="phone"
          keyboardType="phone-pad"
          placeholder="08xx-xxxx-xxxx"
        />
        {saveError ? (
          <Text variant="labelMd" color="critical">
            {saveError}
          </Text>
        ) : null}
        <Button
          label={saving ? 'Menyimpan…' : 'Simpan Perubahan'}
          icon="save"
          disabled={!canSaveEdit || saving}
          onPress={() => {
            void saveEdit();
          }}
        />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingBottom: spacing.sm,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: { gap: spacing.lg, paddingHorizontal: spacing.gutter, paddingTop: spacing.lg },
  identityRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  identityLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1 },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLow,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
  },
  strip: { flexDirection: 'row', gap: spacing.sm + 2 },
  stripCard: { flex: 1 },
  stripInner: { padding: spacing.md, justifyContent: 'space-between', flex: 1 },
  stripHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  stripValue: { gap: 2 },
  stripValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  flexShrink: { flexShrink: 1 },
  upper: { textTransform: 'uppercase' },
  section: { gap: spacing.sm },
  sectionTitle: { paddingHorizontal: 2 },
  menuRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  menuRowPressed: { backgroundColor: colors.surfaceLow },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowDivider: { height: 1, backgroundColor: colors.surfaceLow, marginLeft: spacing.md },
  docRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  docLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: '#F3F4F6',
    ...shadows.card,
  },
  noteText: { flex: 1 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.critical,
    backgroundColor: colors.surface,
  },
});
