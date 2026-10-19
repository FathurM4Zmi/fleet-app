import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, fonts, radius, sizes, spacing, typography } from '@/theme';
import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: IconName;
  /** Shows a password reveal toggle. Implies `secureTextEntry`. */
  password?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  error,
  helper,
  leftIcon,
  password = false,
  containerStyle,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasError = Boolean(error);

  const borderColor = hasError ? colors.error : focused ? colors.primaryContainer : colors.borderIdle;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="labelMd" color="textSecondary" style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          { borderColor, borderWidth: focused && !hasError ? 2 : 1 },
        ]}
      >
        {leftIcon ? <Icon name={leftIcon} size={20} color={colors.textSecondary} /> : null}
        <TextInput
          {...inputProps}
          onFocus={(event) => {
            setFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            inputProps.onBlur?.(event);
          }}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={password && !revealed}
          style={styles.input}
        />
        {password ? (
          <Pressable
            onPress={() => setRevealed((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            hitSlop={8}
          >
            <Icon
              name={revealed ? 'hidden' : 'visible'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text variant="caption" color="error" style={styles.helper}>
          {error}
        </Text>
      ) : helper ? (
        <Text variant="caption" color="textSecondary" style={styles.helper}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.sm, textTransform: 'uppercase' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: sizes.input,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    fontFamily: fonts.medium,
    color: colors.ink,
    paddingVertical: spacing.md,
  },
  helper: { marginTop: spacing.xs + 2 },
});
