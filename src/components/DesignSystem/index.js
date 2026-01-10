/**
 * Design System Component Library
 * Exports all reusable components and design tokens
 */

// Design tokens
export * from './tokens';

// UI Components
export { default as Button } from './UI/Button';
export { default as Input } from './UI/Input';

// Layout Components  
export { default as Panel } from './Layout/Panel';

// Re-export for convenience
export const DesignSystem = {
  Button: require('./UI/Button').default,
  Input: require('./UI/Input').default,
  Panel: require('./Layout/Panel').default
};