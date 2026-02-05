/**
 * Budgeify v2.0 "Sovereign" - Theme Configuration
 *
 * 🎓 MENTOR NOTU - Design Tokens:
 * ------------------------------
 * Design tokens, tasarım sisteminin "tek kaynak"ıdır (single source of truth).
 *
 * Neden önemli?
 * 1. Tutarlılık: Tüm renkler, gölgeler, animasyonlar tek yerden yönetilir
 * 2. Değiştirilebilirlik: Bir değeri değiştirince tüm uygulama güncellenir
 * 3. Tema Desteği: Dark/Light mode geçişi kolaylaşır
 * 4. Dokümantasyon: Tasarım sistemi kod içinde belgelenir
 *
 * Bu dosya, globals.css'teki CSS değişkenleriyle senkron çalışır.
 */

// ========================================
// COLOR PALETTE
// ========================================

export const colors = {
  // Cosmic Indigo - Deep Space Background
  cosmic: {
    950: '#040608', // Deepest void
    900: '#080B14', // Primary background
    800: '#0D1321', // Elevated surfaces
    700: '#151E31', // Cards, modals
    600: '#1E293B', // Interactive elements
    500: '#334155', // Subtle borders
    400: '#475569', // Muted text
    300: '#64748B', // Secondary text
    200: '#94A3B8', // Primary text (muted)
    100: '#CBD5E1', // Primary text
    50: '#E2E8F0', // High contrast text
  },

  // Accent - Kral İndigo (Royal Indigo)
  accent: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Primary accent
    600: '#2563EB', // Hover state
    700: '#1D4ED8', // Active state
    800: '#1E40AF', // Deep accent
    900: '#1E3A8A', // Darkest accent
  },

  // Semantic Colors
  success: {
    light: '#34D399',
    DEFAULT: '#10B981',
    dark: '#059669',
  },
  error: {
    light: '#FB7185',
    DEFAULT: '#F43F5E',
    dark: '#E11D48',
  },
  warning: {
    light: '#FCD34D',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
  },
  info: {
    light: '#7DD3FC',
    DEFAULT: '#0EA5E9',
    dark: '#0284C7',
  },

  // Glass Effects
  glass: {
    white: {
      subtle: 'rgba(255, 255, 255, 0.02)',
      soft: 'rgba(255, 255, 255, 0.04)',
      medium: 'rgba(255, 255, 255, 0.06)',
      strong: 'rgba(255, 255, 255, 0.10)',
      bright: 'rgba(255, 255, 255, 0.15)',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      visible: 'rgba(255, 255, 255, 0.10)',
      bright: 'rgba(255, 255, 255, 0.15)',
    },
  },
} as const;

// ========================================
// SHADOWS
// ========================================

export const shadows = {
  // Elevation shadows
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

  // Dark theme shadows
  dark: {
    card: '0 8px 32px rgba(0, 0, 0, 0.4)',
    elevated: '0 16px 48px rgba(0, 0, 0, 0.5)',
    float: '0 24px 64px rgba(0, 0, 0, 0.6)',
  },

  // Glow effects
  glow: {
    sm: '0 0 20px rgba(59, 130, 246, 0.15)',
    md: '0 0 30px rgba(59, 130, 246, 0.20)',
    lg: '0 0 50px rgba(59, 130, 246, 0.25)',
    accent: '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2)',
  },
} as const;

// ========================================
// GRADIENTS
// ========================================

export const gradients = {
  // Background gradient
  cosmic: 'linear-gradient(180deg, #080B14 0%, #0D1321 30%, #151E31 70%, #1E293B 100%)',

  // Accent gradients
  accent: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)',
  accentVibrant: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #2563EB 100%)',

  // AI gradient (for Oracle)
  ai: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #6366F1 100%)',
  aiGlow: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #818CF8 100%)',

  // Glass gradient
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',

  // Card highlight
  cardHighlight: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
} as const;

// ========================================
// ANIMATION
// ========================================

export const animation = {
  // Durations (in ms)
  duration: {
    instant: 100,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 400,
    slowest: 500,
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Premium easings
    easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// ========================================
// TYPOGRAPHY
// ========================================

export const typography = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
    base: ['1rem', { lineHeight: '1.5rem' }], // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }], // 48px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const;

// ========================================
// SPACING & LAYOUT
// ========================================

export const spacing = {
  // Based on 4px grid
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// ========================================
// BREAKPOINTS
// ========================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ========================================
// Z-INDEX
// ========================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ========================================
// EXPORT ALL
// ========================================

export const theme = {
  colors,
  shadows,
  gradients,
  animation,
  typography,
  spacing,
  borderRadius,
  breakpoints,
  zIndex,
} as const;

export default theme;
