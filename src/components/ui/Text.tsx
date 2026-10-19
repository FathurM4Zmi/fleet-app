import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { colors, typography, type ColorName, type TypographyVariant } from '@/theme';

export interface TextProps extends RNTextProps {
  /** Type-scale key. Defaults to `body`. */
  variant?: TypographyVariant;
  /** A token name (`ink`, `textSecondary`, …) or any raw colour. */
  color?: ColorName | string;
  align?: TextStyle['textAlign'];
}

const resolveColor = (color: ColorName | string | undefined): string => {
  if (!color) return colors.ink;
  return (colors as Record<string, string>)[color] ?? color;
};

export function Text({ variant = 'body', color, align, style, ...rest }: TextProps) {
  return (
    <RNText
      style={[typography[variant], { color: resolveColor(color) }, align ? { textAlign: align } : null, style]}
      {...rest}
    />
  );
}
