import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

export interface DividerProps {
  /** Horizontal inset applied on both sides. */
  inset?: number;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ inset = 0, style }: DividerProps) {
  return <View style={[styles.base, { marginHorizontal: inset }, style]} />;
}

const styles = StyleSheet.create({
  base: { height: StyleSheet.hairlineWidth * 2, backgroundColor: colors.divider },
});
