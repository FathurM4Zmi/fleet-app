import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { colors, radius, shadows, spacing } from '@/theme';
import { Text } from './Text';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  /** Hides the grabber handle. */
  handleless?: boolean;
}

/** Slide-up sheet built on the core `Modal` — no extra dependency required. */
export function Sheet({ visible, onClose, title, description, children, handleless = false }: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Tutup" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        {handleless ? null : <View style={styles.handle} />}

        {title ? (
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text variant="headlineSm">{title}</Text>
              {description ? (
                <Text variant="bodyMd" color="textSecondary">
                  {description}
                </Text>
              ) : null}
            </View>
            <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel="Tutup">
              <Icon name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
        ) : null}

        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: colors.scrim },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    gap: spacing.lg,
    ...shadows.bar,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  headerText: { flex: 1, gap: spacing.xs },
});
