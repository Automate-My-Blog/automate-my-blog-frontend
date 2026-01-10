import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../../DesignSystem/tokens';
import { Button } from '../../DesignSystem';

/**
 * Modern Editor Layout with flexible view modes
 */
const EditorLayout = ({
  mode = 'edit', // 'edit', 'preview', 'split'
  onModeChange,
  children,
  sidebarContent = null,
  toolbarContent = null,
  className = '',
  style = {}
}) => {
  const layoutStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.background.body,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    boxShadow: shadows.base,
    ...style
  };

  const toolbarStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.md} ${spacing.lg}`,
    backgroundColor: colors.background.elevated,
    borderBottom: `1px solid ${colors.border.light}`,
    flexShrink: 0
  };

  const contentAreaStyles = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  };

  const mainContentStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: mode === 'split' ? 'row' : 'column',
    overflow: 'hidden'
  };

  const sidebarStyles = {
    width: '300px',
    backgroundColor: colors.background.container,
    borderLeft: `1px solid ${colors.border.light}`,
    flexShrink: 0,
    overflow: 'auto'
  };

  // View mode buttons
  const ViewModeButtons = () => (
    <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center' }}>
      <Button
        variant={mode === 'edit' ? 'primary' : 'ghost'}
        size="small"
        onClick={() => onModeChange?.('edit')}
      >
        Edit
      </Button>
      <Button
        variant={mode === 'preview' ? 'primary' : 'ghost'}
        size="small"
        onClick={() => onModeChange?.('preview')}
      >
        Preview
      </Button>
      <Button
        variant={mode === 'split' ? 'primary' : 'ghost'}
        size="small"
        onClick={() => onModeChange?.('split')}
      >
        🔀 Split View
      </Button>
    </div>
  );

  return (
    <div style={layoutStyles} className={className}>
      {/* Toolbar */}
      <div style={toolbarStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: colors.text.primary 
          }}>
            Content Editor
          </span>
          {toolbarContent}
        </div>
        <ViewModeButtons />
      </div>

      {/* Content Area */}
      <div style={contentAreaStyles}>
        <div style={mainContentStyles}>
          {children}
        </div>
        
        {/* Sidebar for style controls */}
        {sidebarContent && (
          <div style={sidebarStyles}>
            {sidebarContent}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Editor Pane - Wrapper for editor content
 */
export const EditorPane = ({ children, style = {} }) => {
  const paneStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: colors.background.elevated,
    ...style
  };

  return (
    <div style={paneStyles}>
      {children}
    </div>
  );
};

/**
 * Preview Pane - Wrapper for preview content
 */
export const PreviewPane = ({ children, style = {} }) => {
  const paneStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    backgroundColor: colors.background.body,
    borderLeft: `1px solid ${colors.border.light}`,
    ...style
  };

  return (
    <div style={paneStyles}>
      <div style={{ padding: spacing.lg }}>
        {children}
      </div>
    </div>
  );
};

export default EditorLayout;