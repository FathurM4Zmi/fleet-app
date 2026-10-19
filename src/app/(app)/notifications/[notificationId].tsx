import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import {
  BottomBar,
  Button,
  Card,
  EmptyState,
  Screen,
  ScreenBody,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { vehicleById } from '@/data/fixtures';
import { formatRelative } from '@/lib/format';
import { useNotifications } from '@/hooks/useNotifications';
import { colors, radius, spacing } from '@/theme';
import type { NotificationSeverity, NotificationTone } from '@/data/types';

const SEVERITY: Record<NotificationSeverity, { hero: string; icon: IconName; headline: string }> = {
  critical: { hero: colors.critical, icon: 'warning', headline: 'Keputusan otomatis' },
  warning: { hero: colors.warning, icon: 'warning', headline: 'Perlu tindakan' },
  info: { hero: colors.primaryContainer, icon: 'info', headline: 'Informasi' },
};

const NODE_TONE: Record<NotificationTone, string> = {
  critical: colors.critical,
  warning: colors.warning,
  info: colors.primaryContainer,
  success: colors.success,
};

export default function NotificationDetailScreen() {
  const { notificationId } = useLocalSearchParams<{ notificationId: string }>();
  const { notifications, detailFor, markRead } = useNotifications();

  const notification = useMemo(
    () => notifications.find((entry) => entry.id === notificationId),
    [notifications, notificationId],
  );
  const detail = useMemo(() => detailFor(notificationId), [detailFor, notificationId]);

  useEffect(() => {
    if (notification && !notification.readAt) markRead(notification.id);
  }, [notification, markRead]);

  if (!notification) {
    return (
      <Screen>
        <ScreenHeader title="Detail Notifikasi" onBack />
        <EmptyState
          icon="notifications"
          title="Notifikasi tidak ditemukan"
          description="Pesan ini mungkin sudah tidak tersedia."
        />
      </Screen>
    );
  }

  const vehicle = detail?.vehicleId ? vehicleById(detail.vehicleId) : undefined;
  const tone = SEVERITY[notification.severity];
  const timeline = detail?.timeline ?? [];

  return (
    <Screen>
      <ScreenHeader
        title="Detail Notifikasi"
        onBack
        right={
          <Pressable
            onPress={() => markRead(notification.id)}
            disabled={Boolean(notification.readAt)}
            accessibilityRole="button"
            style={styles.markRead}
          >
            <Text variant="labelMd" color={notification.readAt ? 'textMuted' : 'primaryContainer'}>
              Tandai dibaca
            </Text>
          </Pressable>
        }
      />

      <ScreenBody bottomPadding={160}>
        {/* Hero banner */}
        <View style={[styles.hero, { backgroundColor: tone.hero }]}>
          <View style={styles.heroIcon}>
            <Icon name={tone.icon} size={24} color={colors.onPrimary} />
          </View>
          <View style={styles.flex}>
            <Text variant="headlineSm" color={colors.onPrimary}>
              {notification.title}
            </Text>
            <Text variant="labelMd" color="rgba(255,255,255,0.9)" style={styles.heroSub}>
              {tone.headline} • {formatRelative(notification.createdAt)}
            </Text>
          </View>
        </View>

        {/* Vehicle */}
        {vehicle ? (
          <Card shadow style={styles.vehicleCard}>
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleIcon}>
                <Icon name="truck" size={26} color={colors.secondary} />
              </View>
              <View style={styles.flex}>
                <Text variant="headlineSm">{vehicle.plate}</Text>
                <Text variant="labelMd" color="secondary" numberOfLines={1}>
                  {vehicle.model} • {vehicle.type} • Depo Site Jkt 1
                </Text>
              </View>
              <View style={styles.blockedBadge}>
                <View style={styles.blockedDot} />
                <Text variant="labelSm" color="onErrorContainer">
                  Diblokir
                </Text>
              </View>
            </View>
          </Card>
        ) : null}

        {/* Explanation */}
        <Card shadow style={styles.section}>
          <Text variant="bodyBold">
            {detail?.impact
              ? 'Kendaraan Anda dinonaktifkan dari assignment sampai defect diperbaiki.'
              : notification.body}
          </Text>

          {detail?.detectedNote || detail?.defect ? (
            <View style={styles.explanationBody}>
              {detail.detectedNote ? (
                <View style={styles.detectedRow}>
                  <Icon name="schedule" size={20} color={colors.secondary} />
                  <Text variant="labelLg" color="secondary" style={styles.flex}>
                    {detail.detectedNote}
                  </Text>
                </View>
              ) : null}

              {detail.defect ? (
                <View style={styles.defectRow}>
                  <Icon name="cancel" size={20} color={colors.critical} />
                  <Text variant="labelLg" color="critical" style={styles.flex}>
                    Defect: {detail.defect}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </Card>

        {/* Work order */}
        {detail?.workOrder ? (
          <View style={styles.section}>
            <Text variant="labelMd" color="textSecondary" style={[styles.upper, styles.sectionTitle]}>
              WORK ORDER
            </Text>
            <Card shadow>
              <View style={styles.woRow}>
                <View style={styles.woIcon}>
                  <Icon name="workOrder" size={22} color={colors.warning} />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyBold">{detail.workOrder.code}</Text>
                  <Text variant="labelMd" color="secondary" style={styles.woNote}>
                    {detail.workOrder.note}
                  </Text>
                </View>
              </View>
              <View style={styles.woFoot}>
                <Text variant="labelMd" color="secondary">
                  Status Tiket
                </Text>
                <View style={styles.woStatus}>
                  <Text variant="labelMd" color={colors.warning}>
                    {detail.workOrder.statusLabel}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        ) : null}

        {/* Impact */}
        {detail?.impact ? (
          <View style={styles.impact}>
            <Icon name="warning" size={22} color="#B45309" />
            <Text variant="labelLg" color="#78350F" style={styles.flex}>
              {detail.impact}
            </Text>
          </View>
        ) : null}

        {/* Timeline */}
        {timeline.length > 0 ? (
          <View style={styles.section}>
            <Text variant="labelMd" color="textSecondary" style={[styles.upper, styles.sectionTitle]}>
              AKTIVITAS
            </Text>
            <Card shadow>
              <View style={styles.timeline}>
                <View style={styles.timelineRail} />
                {timeline.map((node) => (
                  <View key={node.key} style={styles.nodeRow}>
                    <View
                      style={[styles.nodeDot, { borderColor: NODE_TONE[node.tone] }]}
                    >
                      <View style={[styles.nodeDotFill, { backgroundColor: NODE_TONE[node.tone] }]} />
                    </View>
                    <View style={styles.flex}>
                      <Text variant="labelLg">{node.label}</Text>
                      <Text variant="labelMd" color="secondary">
                        {node.note}
                      </Text>
                    </View>
                    <Text variant="labelMd" color="secondary">
                      {node.time}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        ) : null}
      </ScreenBody>

      <BottomBar>
        {detail?.workOrder ? (
          <Button label="Lihat Work Order" iconAfter="forward" onPress={() => router.push('/vehicle')} />
        ) : detail?.documentKey ? (
          <Button
            label="Lihat Dokumen"
            iconAfter="forward"
            onPress={() => router.push(`/documents/${detail.documentKey}`)}
          />
        ) : null}
        <Pressable
          onPress={() => Linking.openURL('tel:+622150001234')}
          accessibilityRole="button"
          style={styles.ghostAction}
        >
          <Icon name="phone" size={18} color={colors.secondary} />
          <Text variant="labelLg" color="secondary">
            Hubungi Supervisor
          </Text>
        </Pressable>
      </BottomBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  markRead: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },

  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    marginTop: spacing.sm,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroSub: { marginTop: 2 },

  section: { marginTop: spacing.lg, gap: spacing.md },
  sectionTitle: { paddingHorizontal: 2, marginBottom: spacing.sm },
  upper: { textTransform: 'uppercase' },

  vehicleCard: { marginTop: spacing.lg },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  blockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.errorContainer,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.2)',
  },
  blockedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.critical },

  explanationBody: {
    gap: spacing.sm + 2,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detectedRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm + 2 },
  defectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    padding: spacing.sm + 2,
    borderRadius: radius.input,
    backgroundColor: 'rgba(255,218,214,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.2)',
  },

  woRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  woIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
  },
  woNote: { marginTop: 2 },
  woFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  woStatus: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.warningContainer,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },

  impact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md + 2,
    borderRadius: radius.input,
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },

  timeline: { gap: spacing.lg, paddingLeft: spacing.xs },
  timelineRail: {
    position: 'absolute',
    left: 6,
    top: 6,
    bottom: 6,
    width: 2,
    backgroundColor: colors.divider,
  },
  nodeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  nodeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  nodeDotFill: { width: 6, height: 6, borderRadius: 3 },

  ghostAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 44,
  },
});
