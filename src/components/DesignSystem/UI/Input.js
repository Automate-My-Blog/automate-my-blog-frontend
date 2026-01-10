import React from 'react';
import { colors, spacing, typography, borderRadius, animation } from '../tokens';

/**
 * Enhanced Input component with design system integration
 */
const Input = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  error = false,
  prefix = null,
  suffix = null,
  size = 'medium',
  className = '',
  style = {},
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: '28px',
          padding: `0 ${spacing.sm}`,
          fontSize: typography.fontSize.sm
        };
      case 'large':
        return {
          height: '48px',
          padding: `0 ${spacing.lg}`,
          fontSize: typography.fontSize.lg
        };
      default:
        return {
          height: '36px',
          padding: `0 ${spacing.md}`,
          fontSize: typography.fontSize.base
        };
    }
  };

  const getBorderColor = () => {
    if (error) return colors.error;
    if (disabled) return colors.border.light;
    return colors.border.base;
  };

  const baseStyles = {
    width: '100%',
    border: `1px solid ${getBorderColor()}`,
    borderRadius: borderRadius.base,
    backgroundColor: disabled ? colors.background.container : colors.background.elevated,
    color: disabled ? colors.text.disabled : colors.text.primary,
    fontFamily: typography.fontFamily.primary,
    outline: 'none',
    transition: animation.transition.fast,
    boxSizing: 'border-box',
    ...getSizeStyles(),
    ':focus': !disabled && {
      borderColor: colors.primary,
      boxShadow: `0 0 0 2px ${colors.primary}20`
    },
    '::placeholder': {
      color: colors.text.secondary
    },
    ...style
  };

  if (prefix || suffix) {
    const containerStyles = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      width: '100%',
      ...style
    };

    const inputStyles = {
      ...baseStyles,
      paddingLeft: prefix ? '40px' : baseStyles.padding?.split(' ')[1] || spacing.md,
      paddingRight: suffix ? '40px' : baseStyles.padding?.split(' ')[1] || spacing.md,
      width: '100%'
    };

    const affixStyles = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.text.secondary,
      pointerEvents: 'none',
      zIndex: 1
    };

    const prefixStyles = {
      ...affixStyles,
      left: spacing.md
    };

    const suffixStyles = {
      ...affixStyles,
      right: spacing.md
    };

    return (
      <div style={containerStyles} className={className}>
        {prefix && <div style={prefixStyles}>{prefix}</div>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyles}
          {...props}
        />
        {suffix && <div style={suffixStyles}>{suffix}</div>}
      </div>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={baseStyles}
      className={className}
      {...props}
    />
  );
};

export default Input;