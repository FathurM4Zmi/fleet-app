import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, radius, sizes, spacing } from '@/theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'lg' | 'md';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  /** Renders the icon after the label. */
  iconAfter?: IconName;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const HEIGHTS: Record<ButtonSize, number> = {
  lg: sizes.buttonPrimary,
  md: sizes.touchTarget,
};

interface VariantStyle {
  container: ViewStyle;
  label: string;
  icon: string;
  spinner: string;
}

const VARIANTS: Record<ButtonVariant, VariantStyle> = {
  primary: {
    container: { backgroundColor: colors.primaryContainer },
    label: colors.onPrimary,
    icon: colors.onPrimary,
    spinner: colors.onPrimary,
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    label: colors.ink,
    icon: colors.ink,
    spinner: colors.ink,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: colors.primaryContainer,
    icon: colors.primaryContainer,
    spinner: colors.primaryContainer,
  },
  destructive: {
    container: { backgroundColor: colors.critical },
    label: colors.onPrimary,
    icon: colors.onPrimary,
    spinner: colors.onPrimary,
  },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  disabled = false,
  loading = false,
  icon,
  iconAfter,
  style,
  testID,
}: ButtonProps) {
  const tone = VARIANTS[variant];
  const inactive = disabled || loading;
  const iconColor = tone.icon;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { height: HEIGHTS[size] },
        tone.container,
        fullWidth && styles.fullWidth,
        inactive && styles.inactive,
        pressed && !inactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={tone.spinner} />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={20} color={iconColor} /> : null}
          <Text variant="labelLg" style={{ color: tone.label }}>
            {label}
          </Text>
          {iconAfter ? <Icon name={iconAfter} size={20} color={iconColor} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  fullWidth: { width: '100%' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inactive: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
});
