import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from 'antd';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WorkflowModeProvider } from './contexts/WorkflowModeContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { SystemHintProvider } from './contexts/SystemHintContext';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import SEOHead from './components/SEOHead';
import { storeReferralInfo } from './utils/referralUtils';
import './styles/design-system.css';
import './styles/mobile.css';

// Ant Design theme configuration - Stripe-inspired enterprise aesthetic
const antdTheme = {
  token: {
    // Color tokens - Stripe palette
    colorPrimary: '#635BFF',        // Stripe purple - strategic accent
    colorSuccess: '#00D924',        // Stripe green
    colorWarning: '#FFB020',        // Stripe amber
    colorError: '#DF1B41',          // Stripe red
    colorInfo: '#635BFF',           // Match primary
    colorTextBase: '#0A2540',       // Stripe navy (dark text)
    colorTextSecondary: '#425466',  // Medium gray
    colorTextTertiary: '#6B7C8E',   // Light gray
    colorBgBase: '#ffffff',         // White background
    colorBgContainer: '#FAFBFC',    // Subtle gray container
    colorBorder: '#E3E8EF',         // Subtle border
    colorBorderSecondary: '#F6F9FC', // Very subtle border

    // Typography - Clear hierarchy
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
    fontSize: 16,                   // --font-size-base (16px body)
    fontSizeHeading1: 32,           // --font-size-3xl (page titles)
    fontSizeHeading2: 24,           // --font-size-2xl (section headers)
    fontSizeHeading3: 20,           // --font-size-xl (subsection headers)
    fontSizeHeading4: 18,           // --font-size-lg (subheadings)
    fontSizeHeading5: 16,           // --font-size-base (emphasized body)
    fontWeightStrong: 600,          // --font-weight-semibold

    // Border radius - Reduced for professional look
    borderRadius: 4,                // --radius-base (default)
    borderRadiusLG: 6,              // --radius-md (larger components)
    borderRadiusSM: 3,              // --radius-sm (tight corners)
    borderRadiusXS: 3,              // --radius-sm

    // Spacing - 8px grid system
    padding: 16,                    // --space-4
    paddingLG: 24,                  // --space-6
    paddingXL: 32,                  // --space-8
    paddingSM: 12,                  // --space-3
    paddingXS: 8,                   // --space-2
    margin: 16,                     // --space-4
    marginLG: 24,                   // --space-6
    marginXL: 32,                   // --space-8
    marginSM: 12,                   // --space-3
    marginXS: 8,                    // --space-2

    // Shadows - Minimal, Stripe-inspired (very subtle)
    boxShadow: '0 1px 2px rgba(10, 37, 64, 0.05)',           // --shadow-sm (default)
    boxShadowSecondary: '0 2px 4px rgba(10, 37, 64, 0.08)', // --shadow-md (elevated)
    boxShadowTertiary: '0 4px 8px rgba(10, 37, 64, 0.08)',  // --shadow-lg (modals)

    // Line height - Generous for readability
    lineHeight: 1.5,                // --line-height-normal
    lineHeightHeading: 1.25,        // --line-height-tight

    // Motion - Subtle, professional (faster)
    motionDurationFast: '0.1s',     // --transition-fast (100ms)
    motionDurationMid: '0.15s',     // --transition-base (150ms)
    motionDurationSlow: '0.2s',     // --transition-normal (200ms)
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',

    // Control heights
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      primaryShadow: 'none',        // No shadow on buttons (Stripe style)
      fontWeight: 500,              // Medium weight for buttons
      borderRadius: 4,              // Consistent with token
      controlHeight: 40,
      paddingContentHorizontal: 16,
    },
    Card: {
      boxShadow: '0 1px 2px rgba(10, 37, 64, 0.05)', // Minimal shadow
      borderRadius: 6,              // --radius-md
      paddingLG: 24,
      headerBg: 'transparent',
    },
    Table: {
      headerBg: '#FAFBFC',          // Subtle gray header
      headerColor: '#425466',       // Medium gray text
      borderColor: '#E3E8EF',       // Subtle borders
      cellPaddingBlock: 16,         // Generous padding
      cellPaddingInline: 16,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 4,
      paddingBlock: 8,
      paddingInline: 12,
    },
    Select: {
      controlHeight: 40,
      borderRadius: 4,
    },
    Modal: {
      borderRadius: 8,              // --radius-lg (larger for modals)
      boxShadow: '0 4px 8px rgba(10, 37, 64, 0.08)', // --shadow-lg
      headerBg: 'transparent',
      contentBg: '#ffffff',
    },
    Drawer: {
      borderRadius: 0,              // No radius for drawers
      boxShadow: '0 4px 8px rgba(10, 37, 64, 0.08)',
    },
    Menu: {
      itemBg: 'transparent',
      itemHoverBg: '#F6F9FC',       // Subtle hover
      itemActiveBg: '#F6F9FC',
      itemSelectedBg: '#F6F9FC',
      itemBorderRadius: 4,
    },
    Typography: {
      fontWeightStrong: 600,        // --font-weight-semibold
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
    Tabs: {
      itemActiveColor: '#0A2540',   // Navy for active
      itemHoverColor: '#425466',    // Medium gray for hover
      itemSelectedColor: '#0A2540',
      inkBarColor: '#635BFF',       // Purple accent for indicator
    },
    Tag: {
      borderRadiusSM: 3,
      defaultBg: '#F6F9FC',
      defaultColor: '#425466',
    },
    Alert: {
      borderRadiusLG: 6,
      paddingContentVerticalLG: 12,
    },
    Badge: {
      dotSize: 6,
    },
    Tooltip: {
      borderRadius: 4,
      boxShadow: '0 2px 4px rgba(10, 37, 64, 0.08)',
    },
  },
};

const AppContent = () => {
  const { user, loading, loginContext } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [, setActiveTab] = useState('newpost');

  // Store referral information on app load
  useEffect(() => {
    storeReferralInfo();
  }, []);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Use DashboardLayout for both logged-in and logged-out users
  // This creates seamless transitions where login only affects layout/spacing

  return (
    <SystemHintProvider>
      <SEOHead />
      <DashboardLayout 
        workflowContent={true}
        showDashboard={user && loginContext === 'nav'} // Show dashboard UI when logged in with nav context
        isMobile={isMobile}
        onActiveTabChange={setActiveTab}
        forceWorkflowMode={!user} // Force workflow mode for logged-out users
      />
    </SystemHintProvider>
  );
};

// Main App wrapper with HelmetProvider, AuthProvider, AnalyticsProvider, and WorkflowModeProvider
const App = () => {
  return (
    <ConfigProvider theme={antdTheme}>
      <HelmetProvider>
        <AuthProvider>
          <AnalyticsProvider>
            <WorkflowModeProvider>
              <AppContent />
            </WorkflowModeProvider>
          </AnalyticsProvider>
        </AuthProvider>
      </HelmetProvider>
    </ConfigProvider>
  );
};

export default App;