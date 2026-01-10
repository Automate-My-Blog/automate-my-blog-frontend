import React, { useState } from 'react';
import { colors, spacing, borderRadius, shadows, animation } from '../tokens';

/**
 * Flexible Panel component for organizing content
 */
const Panel = ({
  children,
  title,
  collapsible = false,
  defaultCollapsed = false,
  padding = 'default',
  bordered = true,
  shadow = false,
  className = '',
  style = {},
  headerActions = null,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: spacing.md };
      case 'large':
        return { padding: spacing.xl };
      default:
        return { padding: spacing.lg };
    }
  };

  const panelStyles = {
    backgroundColor: colors.background.elevated,
    border: bordered ? `1px solid ${colors.border.light}` : 'none',
    borderRadius: borderRadius.md,
    boxShadow: shadow ? shadows.base : 'none',
    overflow: 'hidden',
    ...style
  };

  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.md} ${spacing.lg}`,
    backgroundColor: colors.background.container,
    borderBottom: `1px solid ${colors.border.light}`,
    fontSize: '16px',
    fontWeight: '600',
    color: colors.text.primary
  };

  const contentStyles = {
    ...getPaddingStyles(),
    transition: animation.transition.normal,
    overflow: 'hidden',
    ...(isCollapsed && { display: 'none' })
  };

  const collapseButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    color: colors.text.secondary,
    transition: animation.transition.fast,
    ':hover': {
      backgroundColor: colors.background.body,
      color: colors.text.primary
    }
  };

  return (
    <div style={panelStyles} className={className} {...props}>
      {title && (
        <div style={headerStyles}>
          <span>{title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            {headerActions}
            {collapsible && (
              <button
                style={collapseButtonStyles}
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  style={{
                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    transition: animation.transition.fast
                  }}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      <div style={contentStyles}>
        {children}
      </div>
    </div>
  );
};

export default Panel;