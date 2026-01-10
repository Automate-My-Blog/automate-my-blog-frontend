import React from 'react';
import { colors, spacing, typography, borderRadius, animation } from '../tokens';

/**
 * Enhanced Button component with design system integration
 */
const Button = ({
  children,
  variant = 'default',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  style = {},
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.border.base : colors.primary,
          borderColor: disabled ? colors.border.base : colors.primary,
          color: colors.text.inverse,
          ':hover': !disabled && {
            backgroundColor: colors.primaryHover,
            borderColor: colors.primaryHover
          }
        };
      case 'success':
        return {
          backgroundColor: disabled ? colors.border.base : colors.success,
          borderColor: disabled ? colors.border.base : colors.success,
          color: colors.text.inverse
        };
      case 'danger':
        return {
          backgroundColor: disabled ? colors.border.base : colors.error,
          borderColor: disabled ? colors.border.base : colors.error,
          color: colors.text.inverse
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.border.base,
          color: colors.text.primary,
          ':hover': !disabled && {
            borderColor: colors.primary,
            color: colors.primary
          }
        };
      default:
        return {
          backgroundColor: disabled ? colors.background.container : colors.background.elevated,
          borderColor: colors.border.base,
          color: disabled ? colors.text.disabled : colors.text.primary,
          ':hover': !disabled && {
            borderColor: colors.primary,
            color: colors.primary
          }
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: `${spacing.xs} ${spacing.md}`,
          fontSize: typography.fontSize.sm,
          height: '28px'
        };
      case 'large':
        return {
          padding: `${spacing.md} ${spacing.xl}`,
          fontSize: typography.fontSize.lg,
          height: '48px'
        };
      default:
        return {
          padding: `${spacing.sm} ${spacing.lg}`,
          fontSize: typography.fontSize.base,
          height: '36px'
        };
    }
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    border: '1px solid',
    borderRadius: borderRadius.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: animation.transition.fast,
    userSelect: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style
  };

  return (
    <button
      style={baseStyles}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      {icon && !loading && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;