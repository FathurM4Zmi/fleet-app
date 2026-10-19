/**
 * Design tokens for FleetOps Driver.
 *
 * Source of truth: Google Stitch project 10337307985651430571
 * ("GenZys FleetOps Driver App") — its `designMd` plus the per-screen Tailwind
 * configs embedded in each exported screen HTML.
 *
 * Keep this file dependency-free: it is imported by everything.
 */

/** Font family names as exported by `@expo-google-fonts/inter`. */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const colors = {
  /** Screen background behind cards. */
  canvas: '#F7F8FA',
  /** Card / sheet / input background. */
  surface: '#FFFFFF',
  surfaceLow: '#F1F3FF',
  surfaceContainer: '#E9EDFF',
  surfaceHigh: '#E1E8FD',
  surfaceHighest: '#DCE2F7',

  /** Primary ink for titles and high-priority metrics. */
  ink: '#111827',
  onSurface: '#141B2B',
  onSurfaceVariant: '#434656',
  /** Secondary metadata, timestamps, placeholders. */
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',

  outline: '#747688',
  outlineVariant: '#C4C5D9',
  /** 1px structural border on cards, inputs, dividers. */
  divider: '#E5E7EB',
  /** Border of an idle input / PIN box. */
  borderIdle: '#D1D5DB',

  primary: '#0037D0',
  /** Brand action colour — reserved for primary operational steps. */
  primaryContainer: '#1B4DFF',
  primaryFixed: '#DEE1FF',
  onPrimary: '#FFFFFF',

  secondary: '#555F6D',
  secondaryContainer: '#D6E0F1',

  tertiary: '#00583D',

  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',

  /** Status anchors. */
  success: '#12805C',
  successContainer: '#E7F5EF',
  warning: '#B45309',
  warningContainer: '#FDF3E7',
  critical: '#DC2626',
  criticalContainer: '#FCE8E8',
  info: '#1B4DFF',
  infoContainer: '#E9EDFF',
  neutral: '#555F6D',
  neutralContainer: '#EEF2F6',

  /** Pinned bottom bars and tab bars. */
  barBackground: '#FFFFFF',
  /** Scrim behind modals and sheets. */
  scrim: 'rgba(17, 24, 39, 0.45)',
} as const;

/** 4/8px rhythm. Screen gutter and card padding are both 16. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  /** Screen horizontal gutter. */
  gutter: 16,
  /** Inner padding of a card. */
  cardPadding: 16,
} as const;

export const radius = {
  sm: 4,
  /** Buttons and inputs. */
  input: 8,
  /** Cards and containers. */
  card: 12,
  /** Sheets. */
  sheet: 16,
  pill: 9999,
} as const;

export const sizes = {
  /** Primary full-width action. */
  buttonPrimary: 56,
  buttonSecondary: 52,
  /** Minimum touch target. */
  touchTarget: 48,
  input: 48,
  header: 56,
  tabBar: 64,
  pinBoxWidth: 48,
  pinBoxHeight: 52,
  badge: 28,
  /** Center "+" action in the tab bar. */
  fab: 52,
} as const;

type TextStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
};

/**
 * Type scale. `letterSpacing` is converted from the design's `em` values to
 * points (em * fontSize) because React Native expects absolute values.
 *
 * Note: Android ignores `fontWeight` when a custom `fontFamily` is set, so each
 * weight maps to its own family instead of relying on fontWeight.
 */
export const typography = {
  displayLg: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 40, letterSpacing: -0.64 },
  headlineLg: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 36, letterSpacing: -0.28 },
  headlineMd: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.22 },
  headlineSm: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  /** 16/24 semibold — card titles, values. */
  titleMd: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 24 },
  bodyLg: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 26 },
  /** 16/24 regular — paragraph copy. */
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  /** 16/24 medium — the design's `body-md`. */
  bodyMd: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  bodyBold: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 24 },
  /** 14/20 semibold, tracked — button labels. */
  labelLg: { fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 20, letterSpacing: 0.7 },
  /** 12/16 semibold, tracked — badge and section labels. */
  labelMd: { fontFamily: fonts.semiBold, fontSize: 12, lineHeight: 16, letterSpacing: 0.6 },
  /** 11/16 semibold, tracked — micro labels. */
  labelSm: { fontFamily: fonts.semiBold, fontSize: 11, lineHeight: 16, letterSpacing: 0.44 },
  /** 13/18 regular — helper text, timestamps. */
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  /** 11/16 regular — footer microcopy. */
  micro: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 16 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
export type ColorName = keyof typeof colors;

export const shadows = {
  /** Restrained ambient shadow under flat cards. */
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  /** Pinned bottom bars and sheets. No backdrop blur. */
  bar: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 4,
  },
  /** Raised elements such as the tab bar. */
  raised: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 3,
  },
} as const;

export const theme = { fonts, colors, spacing, radius, sizes, typography, shadows } as const;

export type Theme = typeof theme;
