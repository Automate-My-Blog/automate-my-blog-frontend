/**
 * Design tokens for consistent styling across the application
 */

export const colors = {
  primary: '#1890ff',
  primaryHover: '#40a9ff',
  primaryActive: '#096dd9',
  
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  
  text: {
    primary: '#262626',
    secondary: '#8c8c8c',
    disabled: '#bfbfbf',
    inverse: '#ffffff'
  },
  
  background: {
    body: '#ffffff',
    container: '#fafafa',
    elevated: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.45)'
  },
  
  border: {
    light: '#f0f0f0',
    base: '#d9d9d9',
    dark: '#8c8c8c'
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px'
};

export const typography = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace'
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px'
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75'
  }
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

export const borderRadius = {
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  full: '9999px'
};

export const animation = {
  transition: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease'
  },
  
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
  }
};