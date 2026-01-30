/**
 * Design tokens for consistent styling across the application
 * Stripe-inspired enterprise aesthetic
 */

export const colors = {
  // Primary colors - Stripe purple
  primary: '#635BFF',
  primaryHover: '#0A2540',  // Stripe navy
  primaryActive: '#5847E5',

  // Status colors - Stripe-inspired
  success: '#00D924',  // Stripe green
  warning: '#FFB020',  // Stripe amber
  error: '#DF1B41',    // Stripe red

  // Text colors - Navy-based hierarchy
  text: {
    primary: '#0A2540',    // Stripe navy (dark)
    secondary: '#425466',  // Medium gray
    tertiary: '#6B7C8E',   // Light gray
    disabled: '#97A6BA',   // Disabled state
    inverse: '#ffffff'
  },

  // Background colors - Minimal
  background: {
    body: '#ffffff',       // White
    container: '#FAFBFC',  // Subtle gray
    elevated: '#ffffff',
    overlay: 'rgba(10, 37, 64, 0.45)'
  },

  // Border colors - Subtle
  border: {
    light: '#F6F9FC',   // Very subtle
    base: '#E3E8EF',    // Subtle border
    dark: '#CDD7E6'     // Visible border
  },

  // Gray scale - Expanded Stripe palette
  gray: {
    50: '#FAFBFC',
    100: '#F6F9FC',
    200: '#E3E8EF',
    300: '#CDD7E6',
    400: '#97A6BA',
    500: '#6B7C8E',
    600: '#425466',
    700: '#283D54',
    800: '#0A2540',
    900: '#0A1929'
  }
};

export const spacing = {
  xs: '4px',    // 1 unit (half of base)
  sm: '8px',    // 2 units (base)
  md: '12px',   // 3 units
  lg: '16px',   // 4 units
  xl: '24px',   // 6 units
  xxl: '32px',  // 8 units
  xxxl: '48px'  // 12 units
};

export const typography = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace'
  },

  fontSize: {
    xs: '12px',   // Captions
    sm: '14px',   // Secondary body
    base: '16px', // Primary body
    lg: '18px',   // Subheadings
    xl: '20px',   // Section headers
    '2xl': '24px', // Page titles
    '3xl': '32px', // Hero headings
    '4xl': '40px'  // Display
  },

  fontWeight: {
    normal: '400',
    medium: '500',    // Emphasis
    semibold: '600',  // Headings
    bold: '700'       // Strong emphasis
  },

  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }
};

export const shadows = {
  xs: '0 1px 1px rgba(10, 37, 64, 0.03)',
  sm: '0 1px 2px rgba(10, 37, 64, 0.05)',
  base: '0 1px 2px rgba(10, 37, 64, 0.05)',
  md: '0 2px 4px rgba(10, 37, 64, 0.08)',    // Max for most UI
  lg: '0 4px 8px rgba(10, 37, 64, 0.08)',    // Modals only
  xl: '0 8px 16px rgba(10, 37, 64, 0.08)',   // Rare
  focus: '0 0 0 3px rgba(99, 91, 255, 0.1)'  // Focus ring
};

export const borderRadius = {
  none: '0',
  sm: '3px',    // Tight corners
  base: '4px',  // Default
  md: '6px',    // Larger components
  lg: '8px',    // Rare, large panels
  xl: '12px',   // Very rare
  full: '9999px' // Pills, avatars only
};

export const animation = {
  transition: {
    fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
  },

  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
  }
};
