# Display Logic Rules & State Management

## 🎯 **Overview**
Comprehensive rules for when UI elements show/hide, data source indicators, loading states, and error handling across all components.

---

## 🚦 **Border Color System (Development Indicators)**

### **Color Coding for Data Sources**
```javascript
// Visual development indicators for data implementation status
const BorderColors = {
  RED: '#ff4d4f',      // Mock data / No database connection
  YELLOW: '#faad14',   // Hybrid data / Partial implementation  
  GREEN: '#52c41a',    // Real database data / Full implementation
  BLUE: '#1890ff',     // Loading state
  GRAY: '#d9d9d9'      // Disabled / Not applicable
};

// CSS Classes for consistent styling
.dev-border-red { border: 2px solid #ff4d4f; }
.dev-border-yellow { border: 2px solid #faad14; }  
.dev-border-green { border: 2px solid #52c41a; }
.dev-border-blue { border: 2px solid #1890ff; }
.dev-border-gray { border: 2px solid #d9d9d9; }
```

### **Component-Specific Border Rules**

#### **Dashboard Tabs**
```javascript
// OverviewTab.js
const OverviewDisplayRules = {
  // Stats Cards
  "Blog Posts Generated": {
    color: () => user && blogPosts.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => true,
    hideWhen: () => false
  },
  
  "Posts Remaining": {
    color: () => user && billingData.source === 'database' ? 'GREEN' : 'YELLOW',
    showWhen: () => user?.planTier && user.planTier !== 'unlimited',
    hideWhen: () => !user || user.planTier === 'unlimited'
  },
  
  "Recent Activity": {
    color: () => recentActivity.length > 0 && recentActivity.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user && recentActivity.length > 0,
    hideWhen: () => !user || recentActivity.length === 0
  },
  
  // Welcome Message
  "Welcome Card": {
    color: () => user ? 'GREEN' : 'RED',
    showWhen: () => !user || user.firstLogin,
    hideWhen: () => user && !user.firstLogin && blogPosts.length > 3
  }
};

// NewPostTab.js  
const NewPostDisplayRules = {
  "Website Analysis Step": {
    color: () => 'GREEN', // Uses existing API
    showWhen: () => currentStep === 'website',
    hideWhen: () => currentStep !== 'website'
  },
  
  "Strategy Selection": {
    color: () => websiteAnalysis ? 'GREEN' : 'GRAY',
    showWhen: () => currentStep === 'strategy' && websiteAnalysis,
    hideWhen: () => currentStep !== 'strategy' || !websiteAnalysis
  },
  
  "Topic Generation": {
    color: () => selectedStrategy ? 'GREEN' : 'GRAY',
    showWhen: () => currentStep === 'topics' && selectedStrategy,
    hideWhen: () => currentStep !== 'topics' || !selectedStrategy
  },
  
  "Content Generation": {
    color: () => selectedTopic ? 'GREEN' : 'GRAY', 
    showWhen: () => currentStep === 'content' && selectedTopic,
    hideWhen: () => currentStep !== 'content' || !selectedTopic
  },
  
  "Content Editing": {
    color: () => generatedContent ? 'GREEN' : 'GRAY',
    showWhen: () => currentStep === 'editing' && generatedContent,
    hideWhen: () => currentStep !== 'editing' || !generatedContent
  },
  
  "Export Options": {
    color: () => editedContent ? 'GREEN' : 'GRAY',
    showWhen: () => currentStep === 'export' && editedContent,
    hideWhen: () => currentStep !== 'export' || !editedContent
  }
};

// PostsTab.js
const PostsDisplayRules = {
  "Posts List": {
    color: () => blogPosts.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => true,
    hideWhen: () => false
  },
  
  "Empty State": {
    color: () => 'GREEN',
    showWhen: () => blogPosts.length === 0 && !isLoading,
    hideWhen: () => blogPosts.length > 0 || isLoading
  },
  
  "Pagination": {
    color: () => blogPosts.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => blogPosts.length > 0 && totalPosts > pageSize,
    hideWhen: () => blogPosts.length === 0 || totalPosts <= pageSize
  },
  
  "Export Button": {
    color: () => 'GREEN', // Uses existing export API
    showWhen: () => selectedPost && selectedPost.status === 'published',
    hideWhen: () => !selectedPost || selectedPost.status !== 'published'
  }
};

// AnalyticsTab.js
const AnalyticsDisplayRules = {
  "Usage Chart": {
    color: () => analyticsData.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user && analyticsData.totalPosts > 0,
    hideWhen: () => !user || analyticsData.totalPosts === 0
  },
  
  "Revenue Metrics": {
    color: () => user?.planTier !== 'free' && billingData.source === 'database' ? 'GREEN' : 'YELLOW',
    showWhen: () => user?.planTier !== 'free',
    hideWhen: () => !user || user.planTier === 'free'
  },
  
  "Export Analytics": {
    color: () => exportData.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user && totalExports > 0,
    hideWhen: () => !user || totalExports === 0
  },
  
  "Performance Metrics": {
    color: () => performanceData.source === 'database' ? 'GREEN' : 'YELLOW',
    showWhen: () => user && generationHistory.length > 5,
    hideWhen: () => !user || generationHistory.length <= 5
  }
};

// SettingsTab.js
const SettingsDisplayRules = {
  "Profile Settings": {
    color: () => user ? 'GREEN' : 'RED',
    showWhen: () => true,
    hideWhen: () => false
  },
  
  "Billing Section": {
    color: () => billingData.source === 'database' ? 'GREEN' : 'YELLOW',
    showWhen: () => user?.planTier !== 'free',
    hideWhen: () => !user || user.planTier === 'free'
  },
  
  "Referral System": {
    color: () => referralData.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user && featureFlags.enableReferrals,
    hideWhen: () => !user || !featureFlags.enableReferrals
  },
  
  "Referral Stats": {
    color: () => referralStats.totalReferrals > 0 ? 'GREEN' : 'YELLOW',
    showWhen: () => user && referralStats.totalReferrals > 0,
    hideWhen: () => !user || referralStats.totalReferrals === 0
  },
  
  "Preferences": {
    color: () => userPreferences.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user,
    hideWhen: () => !user
  }
};
```

#### **Admin Tabs**
```javascript
// AdminAnalyticsTab.js
const AdminAnalyticsDisplayRules = {
  "Platform Overview": {
    color: () => platformStats.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user?.isAdmin,
    hideWhen: () => !user?.isAdmin
  },
  
  "Revenue Chart": {
    color: () => revenueData.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user?.canViewFinancials && revenueData.length > 0,
    hideWhen: () => !user?.canViewFinancials || revenueData.length === 0
  },
  
  "User Growth": {
    color: () => userGrowthData.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user?.isAdmin,
    hideWhen: () => !user?.isAdmin
  },
  
  "Content Metrics": {
    color: () => contentMetrics.source === 'database' ? 'GREEN' : 'YELLOW',
    showWhen: () => user?.isAdmin && contentMetrics.totalPosts > 0,
    hideWhen: () => !user?.isAdmin || contentMetrics.totalPosts === 0
  }
};

// AdminUsersTab.js  
const AdminUsersDisplayRules = {
  "Users List": {
    color: () => usersData.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user?.canManageUsers,
    hideWhen: () => !user?.canManageUsers
  },
  
  "User Actions": {
    color: () => 'GREEN',
    showWhen: () => selectedUser && user?.canManageUsers,
    hideWhen: () => !selectedUser || !user?.canManageUsers
  },
  
  "Billing Information": {
    color: () => billingData.source === 'database' ? 'GREEN' : 'YELLOW',
    showWhen: () => selectedUser?.planTier !== 'free' && user?.canViewFinancials,
    hideWhen: () => !selectedUser || selectedUser.planTier === 'free' || !user?.canViewFinancials
  },
  
  "Activity History": {
    color: () => activityData.source === 'database' ? 'GREEN' : 'YELLOW',
    showWhen: () => selectedUser && activityData.length > 0,
    hideWhen: () => !selectedUser || activityData.length === 0
  }
};

// AdminContentTab.js
const AdminContentDisplayRules = {
  "Content List": {
    color: () => contentData.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user?.canModerateContent,
    hideWhen: () => !user?.canModerateContent
  },
  
  "Moderation Queue": {
    color: () => moderationQueue.source === 'database' ? 'GREEN' : 'YELLOW',
    showWhen: () => user?.canModerateContent && moderationQueue.length > 0,
    hideWhen: () => !user?.canModerateContent || moderationQueue.length === 0
  },
  
  "Quality Scores": {
    color: () => qualityMetrics.source === 'calculated' ? 'YELLOW' : 'RED',
    showWhen: () => selectedContent && qualityMetrics.score > 0,
    hideWhen: () => !selectedContent || qualityMetrics.score === 0
  },
  
  "Moderation Actions": {
    color: () => 'GREEN',
    showWhen: () => selectedContent && user?.canModerateContent,
    hideWhen: () => !selectedContent || !user?.canModerateContent
  }
};

// AdminSystemTab.js
const AdminSystemDisplayRules = {
  "System Health": {
    color: () => systemHealth.api.source === 'database' ? 'YELLOW' : 'RED',
    showWhen: () => user?.canViewSystemHealth,
    hideWhen: () => !user?.canViewSystemHealth
  },
  
  "Database Metrics": {
    color: () => dbMetrics.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user?.canViewSystemHealth,
    hideWhen: () => !user?.canViewSystemHealth
  },
  
  "Feature Flags": {
    color: () => featureFlags.source === 'database' ? 'GREEN' : 'RED',
    showWhen: () => user?.canManageFeatures,
    hideWhen: () => !user?.canManageFeatures
  },
  
  "Performance Charts": {
    color: () => performanceData.source === 'database' ? 'YELLOW' : 'RED',
    showWhen: () => user?.canViewSystemHealth && performanceData.length > 0,
    hideWhen: () => !user?.canViewSystemHealth || performanceData.length === 0
  }
};
```

---

## ⚡ **Loading States & Skeleton Patterns**

### **Loading State Hierarchy**
```javascript
// Loading state priority (highest to lowest)
const LoadingStates = {
  APP_INITIALIZING: {
    priority: 1,
    component: 'AppLoadingScreen',
    showWhen: () => !authInitialized,
    hideOtherLoading: true
  },
  
  AUTHENTICATION: {
    priority: 2, 
    component: 'AuthLoadingSpinner',
    showWhen: () => authInitialized && authLoading,
    hideOtherLoading: true
  },
  
  PAGE_LOADING: {
    priority: 3,
    component: 'PageSkeleton', 
    showWhen: () => authenticated && pageLoading,
    hideOtherLoading: false
  },
  
  COMPONENT_LOADING: {
    priority: 4,
    component: 'ComponentSkeleton',
    showWhen: () => componentLoading,
    hideOtherLoading: false
  },
  
  ACTION_LOADING: {
    priority: 5,
    component: 'ActionSpinner',
    showWhen: () => actionInProgress,
    hideOtherLoading: false
  }
};

// Skeleton Components for Different Content Types
const SkeletonPatterns = {
  // Dashboard overview cards
  STATS_CARD: () => (
    <Card>
      <Skeleton active paragraph={{ rows: 2 }} title={{ width: '60%' }} />
    </Card>
  ),
  
  // Blog post list items
  BLOG_POST_LIST: () => (
    <List
      dataSource={Array(5).fill({})}
      renderItem={() => (
        <List.Item>
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </List.Item>
      )}
    />
  ),
  
  // Analytics charts
  ANALYTICS_CHART: () => (
    <Card>
      <Skeleton.Input style={{ width: '100%', height: '300px' }} active />
    </Card>
  ),
  
  // User profile form
  PROFILE_FORM: () => (
    <Form layout="vertical">
      <Skeleton active paragraph={{ rows: 6 }} />
    </Form>
  ),
  
  // Admin table
  ADMIN_TABLE: () => (
    <Table
      dataSource={Array(10).fill({})}
      columns={Array(5).fill({}).map((_, i) => ({
        key: i,
        title: <Skeleton.Input style={{ width: '80px' }} />,
        dataIndex: i,
        render: () => <Skeleton.Input style={{ width: '100px' }} />
      }))}
      loading={false}
    />
  )
};
```

### **Progressive Loading Pattern**
```javascript
// Load data in stages for better UX
const useProgressiveDataLoading = () => {
  const [loadingStages, setLoadingStages] = useState({
    essential: true,    // Auth, basic user data
    primary: true,      // Main content for current tab
    secondary: true,    // Secondary features, analytics
    background: true    // Background refresh, non-critical data
  });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Stage 1: Essential data (required for app function)
        const userData = await loadUserData();
        setLoadingStages(prev => ({ ...prev, essential: false }));
        
        // Stage 2: Primary data (main content)
        const primaryData = await loadPrimaryContent();
        setLoadingStages(prev => ({ ...prev, primary: false }));
        
        // Stage 3: Secondary data (nice-to-have)
        const secondaryData = await loadSecondaryContent();
        setLoadingStages(prev => ({ ...prev, secondary: false }));
        
        // Stage 4: Background data (analytics, etc.)
        const backgroundData = await loadBackgroundData();
        setLoadingStages(prev => ({ ...prev, background: false }));
        
      } catch (error) {
        console.error('Progressive loading error:', error);
      }
    };
    
    loadData();
  }, []);
  
  return loadingStages;
};
```

---

## 🔥 **Error State Patterns**

### **Error Types and Display Rules**
```javascript
const ErrorDisplayRules = {
  // Authentication errors
  AUTH_ERROR: {
    component: 'AuthErrorBoundary',
    action: 'redirect_to_login',
    showWhen: () => authError || tokenExpired,
    autoRetry: false,
    userMessage: "Please log in to continue"
  },
  
  // Permission errors  
  PERMISSION_ERROR: {
    component: 'PermissionDeniedMessage',
    action: 'show_contact_admin',
    showWhen: () => !user?.hasRequiredPermission,
    autoRetry: false,
    userMessage: "You don't have permission to access this feature"
  },
  
  // Network errors
  NETWORK_ERROR: {
    component: 'NetworkErrorRetry',
    action: 'show_retry_button',
    showWhen: () => networkError || apiTimeout,
    autoRetry: true,
    retryDelay: 3000,
    maxRetries: 3,
    userMessage: "Connection issue. Retrying..."
  },
  
  // Data loading errors
  DATA_ERROR: {
    component: 'DataErrorFallback',
    action: 'show_fallback_data',
    showWhen: () => dataFetchError,
    autoRetry: true,
    retryDelay: 5000,
    maxRetries: 2,
    userMessage: "Unable to load data. Using cached version."
  },
  
  // Validation errors
  VALIDATION_ERROR: {
    component: 'FormValidationErrors',
    action: 'highlight_fields',
    showWhen: () => formErrors && Object.keys(formErrors).length > 0,
    autoRetry: false,
    userMessage: "Please correct the highlighted fields"
  },
  
  // Rate limit errors
  RATE_LIMIT_ERROR: {
    component: 'RateLimitMessage',
    action: 'disable_actions_temporarily',
    showWhen: () => rateLimited,
    autoRetry: true,
    retryDelay: 60000, // 1 minute
    maxRetries: 1,
    userMessage: "Rate limit exceeded. Please wait before trying again."
  }
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to monitoring service
    console.error('Error boundary caught:', error, errorInfo);
  }
  
  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };
  
  render() {
    if (this.state.hasError) {
      const errorRule = this.getErrorRule(this.state.error);
      
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle={errorRule.userMessage}
          extra={
            errorRule.action === 'show_retry_button' && 
            this.state.retryCount < errorRule.maxRetries && (
              <Button type="primary" onClick={this.handleRetry}>
                Try Again
              </Button>
            )
          }
        />
      );
    }
    
    return this.props.children;
  }
}
```

---

## 📱 **Responsive Display Rules**

### **Breakpoint-Based Visibility**
```javascript
const ResponsiveDisplayRules = {
  // Mobile (< 768px)
  MOBILE: {
    hide: [
      'sidebar_expanded',
      'detailed_tooltips', 
      'advanced_filters',
      'bulk_actions_toolbar',
      'secondary_navigation'
    ],
    show: [
      'hamburger_menu',
      'bottom_navigation',
      'swipe_gestures',
      'simplified_forms'
    ],
    modify: {
      'table_view': 'card_view',
      'multi_column_layout': 'single_column',
      'detailed_analytics': 'summary_metrics'
    }
  },
  
  // Tablet (768px - 1024px) 
  TABLET: {
    hide: [
      'detailed_tooltips',
      'advanced_filters_expanded'
    ],
    show: [
      'sidebar_collapsed',
      'touch_optimized_controls',
      'medium_complexity_features'
    ],
    modify: {
      'grid_layout': '2_column_max',
      'form_layout': 'stacked'
    }
  },
  
  // Desktop (> 1024px)
  DESKTOP: {
    hide: [
      'mobile_optimizations',
      'touch_specific_controls'
    ],
    show: [
      'sidebar_expanded', 
      'advanced_features',
      'detailed_analytics',
      'keyboard_shortcuts',
      'hover_interactions'
    ],
    modify: {
      'grid_layout': 'full_width',
      'form_layout': 'horizontal'
    }
  }
};

// Usage in components
const useResponsiveDisplay = () => {
  const [screenSize, setScreenSize] = useState('desktop');
  
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize('mobile');
      else if (width < 1024) setScreenSize('tablet'); 
      else setScreenSize('desktop');
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);
  
  const shouldShow = (element) => {
    const rules = ResponsiveDisplayRules[screenSize.toUpperCase()];
    return !rules.hide.includes(element) && 
           (rules.show.includes(element) || !rules.show.length);
  };
  
  const getModifiedVersion = (element) => {
    const rules = ResponsiveDisplayRules[screenSize.toUpperCase()];
    return rules.modify[element] || element;
  };
  
  return { screenSize, shouldShow, getModifiedVersion };
};
```

---

## 🎭 **Empty State Patterns**

### **Context-Aware Empty States**
```javascript
const EmptyStateRules = {
  // No blog posts yet
  NO_BLOG_POSTS: {
    condition: () => user && blogPosts.length === 0 && !isLoading,
    component: () => (
      <Empty
        image="/images/empty-blog-posts.svg"
        description="No blog posts yet"
        extra={
          <Button 
            type="primary" 
            onClick={() => navigateToNewPost()}
          >
            Create Your First Post
          </Button>
        }
      />
    )
  },
  
  // No search results
  NO_SEARCH_RESULTS: {
    condition: () => searchQuery && filteredPosts.length === 0,
    component: () => (
      <Empty
        image="/images/empty-search.svg"
        description={`No posts found for "${searchQuery}"`}
        extra={
          <Button onClick={() => clearSearch()}>
            Clear Search
          </Button>
        }
      />
    )
  },
  
  // No referrals yet
  NO_REFERRALS: {
    condition: () => user && referralStats.totalReferrals === 0,
    component: () => (
      <Empty
        image="/images/empty-referrals.svg"
        description="No referrals yet"
        extra={
          <Button 
            type="primary"
            onClick={() => openReferralModal()}
          >
            Send Your First Invite
          </Button>
        }
      />
    )
  },
  
  // No admin data (permissions)
  NO_ADMIN_ACCESS: {
    condition: () => user && !user.isAdmin,
    component: () => (
      <Result
        status="403" 
        title="403"
        subTitle="You don't have permission to access this page"
        extra={
          <Button type="primary" onClick={() => navigateHome()}>
            Back to Dashboard
          </Button>
        }
      />
    )
  },
  
  // Feature under development
  FEATURE_COMING_SOON: {
    condition: () => !featureFlags.enableFeature,
    component: () => (
      <Result
        icon={<ClockCircleOutlined />}
        title="Feature Coming Soon"
        subTitle="This feature is currently under development"
        extra={
          <Button onClick={() => navigateBack()}>
            Go Back
          </Button>
        }
      />
    )
  }
};

// Empty State Manager
const useEmptyState = (conditions) => {
  return useMemo(() => {
    for (const [key, rule] of Object.entries(EmptyStateRules)) {
      if (conditions.includes(key) && rule.condition()) {
        return rule.component();
      }
    }
    return null;
  }, [conditions]);
};
```

---

## 🔔 **Notification & Feedback Rules**

### **Success State Patterns**
```javascript
const SuccessNotificationRules = {
  // Content operations
  BLOG_POST_CREATED: {
    message: "Blog post created successfully!",
    duration: 3000,
    action: { text: "View Post", onClick: (postId) => navigateToPost(postId) }
  },
  
  BLOG_POST_UPDATED: {
    message: "Blog post updated successfully!",
    duration: 2000
  },
  
  BLOG_POST_EXPORTED: {
    message: "Blog post exported successfully!",
    duration: 3000,
    action: { text: "Download", onClick: (url) => window.open(url) }
  },
  
  // User operations
  PROFILE_UPDATED: {
    message: "Profile updated successfully!",
    duration: 2000
  },
  
  PREFERENCES_SAVED: {
    message: "Preferences saved!",
    duration: 1500
  },
  
  // Referral operations
  REFERRAL_INVITE_SENT: {
    message: (count) => `${count} invitation(s) sent successfully!`,
    duration: 3000
  },
  
  REWARD_CLAIMED: {
    message: (amount) => `Reward of $${amount} claimed successfully!`,
    duration: 3000
  },
  
  // Admin operations
  USER_STATUS_UPDATED: {
    message: "User status updated successfully!",
    duration: 2000
  },
  
  CONTENT_MODERATED: {
    message: "Content moderation action completed!",
    duration: 2000
  },
  
  FEATURE_FLAG_UPDATED: {
    message: "Feature flag updated successfully!",
    duration: 2000
  }
};

// Auto-dismiss based on user activity
const useSmartNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (type, data = {}) => {
    const rule = SuccessNotificationRules[type];
    if (!rule) return;
    
    const notification = {
      id: Date.now().toString(),
      type,
      message: typeof rule.message === 'function' 
        ? rule.message(data) 
        : rule.message,
      duration: rule.duration,
      action: rule.action,
      createdAt: Date.now()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(notification.id);
    }, rule.duration);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return { notifications, addNotification, removeNotification };
};
```

---

## 🎯 **Implementation Patterns**

### **Conditional Rendering Hook**
```javascript
const useConditionalDisplay = (component, rules) => {
  const [displayState, setDisplayState] = useState({
    visible: false,
    borderColor: 'gray',
    loading: false,
    error: null
  });
  
  useEffect(() => {
    const evaluateRules = () => {
      const newState = {
        visible: rules.showWhen(),
        borderColor: rules.color(),
        loading: rules.loadingWhen ? rules.loadingWhen() : false,
        error: rules.errorWhen ? rules.errorWhen() : null
      };
      
      setDisplayState(newState);
    };
    
    evaluateRules();
    
    // Re-evaluate when dependencies change
    const interval = setInterval(evaluateRules, 1000);
    return () => clearInterval(interval);
  }, [rules]);
  
  return displayState;
};

// Usage example
const BlogPostCard = ({ post }) => {
  const { user, blogPosts } = useContext(AppContext);
  
  const displayState = useConditionalDisplay('BlogPostCard', {
    showWhen: () => post && user,
    color: () => blogPosts.source === 'database' ? 'GREEN' : 'RED',
    loadingWhen: () => blogPosts.isLoading,
    errorWhen: () => blogPosts.error
  });
  
  if (!displayState.visible) return null;
  
  return (
    <Card 
      className={`dev-border-${displayState.borderColor.toLowerCase()}`}
      loading={displayState.loading}
    >
      {displayState.error ? (
        <Alert type="error" message={displayState.error} />
      ) : (
        <BlogPostContent post={post} />
      )}
    </Card>
  );
};
```

### **Global Display State Provider**
```javascript
const DisplayStateProvider = ({ children }) => {
  const [globalDisplayState, setGlobalDisplayState] = useState({
    showDevBorders: process.env.NODE_ENV === 'development',
    showDataSources: true,
    showLoadingStates: true,
    showEmptyStates: true,
    currentTheme: 'light'
  });
  
  const toggleDevMode = () => {
    setGlobalDisplayState(prev => ({
      ...prev,
      showDevBorders: !prev.showDevBorders
    }));
  };
  
  const value = {
    ...globalDisplayState,
    toggleDevMode,
    setGlobalDisplayState
  };
  
  return (
    <DisplayStateContext.Provider value={value}>
      {children}
    </DisplayStateContext.Provider>
  );
};
```

---

## 📊 **Display Rule Testing**

### **Automated Rule Validation**
```javascript
// Test that display rules work correctly
const validateDisplayRules = async () => {
  const testScenarios = [
    {
      name: 'Unauthenticated User',
      setup: () => ({ user: null, isLoading: false }),
      expectations: {
        'Login Form': { visible: true, color: 'GREEN' },
        'Dashboard': { visible: false },
        'Admin Tabs': { visible: false }
      }
    },
    
    {
      name: 'New User (No Posts)',
      setup: () => ({ 
        user: { id: '1', planTier: 'free' }, 
        blogPosts: { items: [], source: 'database' } 
      }),
      expectations: {
        'Empty State': { visible: true, color: 'GREEN' },
        'Posts List': { visible: false },
        'Create Post Button': { visible: true, color: 'GREEN' }
      }
    },
    
    {
      name: 'Admin User',
      setup: () => ({ 
        user: { id: '1', isAdmin: true },
        platformStats: { source: 'database' }
      }),
      expectations: {
        'Admin Tabs': { visible: true, color: 'GREEN' },
        'Admin Analytics': { visible: true, color: 'GREEN' },
        'User Management': { visible: true, color: 'GREEN' }
      }
    }
  ];
  
  testScenarios.forEach(scenario => {
    console.log(`Testing: ${scenario.name}`);
    // Run assertions...
  });
};
```

This comprehensive display logic system ensures consistent, predictable UI behavior across all components while providing clear visual feedback about data sources and implementation status.