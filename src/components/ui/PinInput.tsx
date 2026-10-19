import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, sizes, spacing } from '@/theme';

export interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Number of boxes. Defaults to 6, matching the driver PIN. */
  length?: number;
  autoFocus?: boolean;
  /** Paints the boxes with the error palette. */
  hasError?: boolean;
  onComplete?: (value: string) => void;
}

/**
 * Six 48×52 boxes backed by a single invisible input, so the native numeric
 * keypad and paste both behave normally.
 */
export function PinInput({
  value,
  onChange,
  length = 6,
  autoFocus = false,
  hasError = false,
  onComplete,
}: PinInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.split('');
  const focusIndex = Math.min(value.length, length - 1);

  const handleChange = (next: string) => {
    const cleaned = next.replace(/\D/g, '').slice(0, length);
    onChange(cleaned);
    if (cleaned.length === length) onComplete?.(cleaned);
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => inputRef.current?.focus()}
      accessibilityRole="none"
    >
      {Array.from({ length }, (_, index) => {
        const filled = index < digits.length;
        const isActive = index === focusIndex && value.length < length;
        return (
          <View
            key={index}
            style={[
              styles.box,
              isActive && styles.boxActive,
              hasError && styles.boxError,
            ]}
          >
            {filled ? <View style={styles.dot} /> : <View style={styles.caret} />}
          </View>
        );
      })}

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        textContentType="oneTimeCode"
        style={styles.hiddenInput}
        accessibilityLabel="Masukkan PIN"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    position: 'relative',
  },
  box: {
    flex: 1,
    height: sizes.pinBoxHeight,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderIdle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderWidth: 2, borderColor: colors.primaryContainer },
  boxError: { borderColor: colors.error },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.ink },
  caret: { width: 12, height: 2, backgroundColor: colors.outlineVariant },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    color: 'transparent',
  },
});
