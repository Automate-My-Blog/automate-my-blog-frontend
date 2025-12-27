# UI Component Data Architecture Mapping

## 🎯 **Purpose**
Map every UI component to its exact data requirements, database tables, and API endpoints needed for full functionality.

---

## 📱 **Authentication & Routing Components**

### **App.js**
**Current State**: Basic routing logic ✅
**Needs Implementation**:
```javascript
// State Management Required
const [user, setUser] = useState(null);           // From users table
const [userProfile, setUserProfile] = useState(null); // Extended user data
const [isLoading, setIsLoading] = useState(true); // Auth loading state

// Database Tables Required
users: id, email, first_name, last_name, organization_name, plan_tier, created_at
user_sessions: user_id, session_id, started_at, ended_at
billing_accounts: user_id, stripe_customer_id, current_plan, billing_status

// API Endpoints Required
GET  /api/v1/auth/me                    // Current user data
POST /api/v1/auth/refresh               // Token refresh
POST /api/v1/auth/logout                // Session cleanup
GET  /api/v1/user/profile               // Extended profile data
```

### **AuthContext.js**
**Current State**: Basic auth structure ✅
**Needs Implementation**:
```javascript
// Enhanced Context State
{
  user: { id, email, firstName, lastName, organizationName, planTier },
  profile: { blogPostsGenerated, blogPostsRemaining, billingStatus },
  permissions: { isAdmin, canAccessAdminTabs },
  loading: boolean,
  error: string | null
}

// Database Integration Required
- Real user authentication against users table
- Session tracking in user_sessions table  
- Permission checking for admin access
- Profile data aggregation from multiple tables
```

---

## 🏠 **Main Dashboard Tabs**

### **1. OverviewTab.js**
**Current State**: Static mockup ❌
**Full Implementation Required**:

```javascript
// Component State Needed
const [dashboardStats, setDashboardStats] = useState({
  blogPostsGenerated: 0,      // COUNT from blog_posts WHERE user_id = X
  blogPostsRemaining: 0,      // billing_accounts.usage_limit - current_usage
  totalProjects: 0,           // COUNT from projects WHERE user_id = X  
  scheduledPosts: 0          // COUNT from scheduled_posts WHERE user_id = X AND status = 'pending'
});

const [recentActivity, setRecentActivity] = useState([]); // FROM user_activity_events
const [quickStats, setQuickStats] = useState({});         // Aggregated metrics
const [isLoading, setIsLoading] = useState(true);

// Database Tables Required
blog_posts: id, user_id, title, status, created_at, export_count
projects: id, user_id, name, description, created_at
scheduled_posts: id, user_id, post_id, scheduled_for, status
user_activity_events: user_id, event_type, event_data, timestamp
billing_accounts: user_id, usage_limit, current_usage, plan_tier

// API Endpoints Required
GET /api/v1/dashboard/overview          // All overview stats
GET /api/v1/dashboard/recent-activity   // Recent user actions
GET /api/v1/user/usage-stats           // Usage and limits
```

### **2. NewPostTab.js** 
**Current State**: UI skeleton ❌
**Full Implementation Required**:

```javascript
// Component State Needed
const [websiteUrl, setWebsiteUrl] = useState('');
const [businessAnalysis, setBusinessAnalysis] = useState(null);    // From website analysis API
const [selectedStrategy, setSelectedStrategy] = useState(null);     // User's strategy choice
const [topicOptions, setTopicOptions] = useState([]);             // Generated topics
const [selectedTopic, setSelectedTopic] = useState(null);
const [generatedContent, setGeneratedContent] = useState(null);    // Blog post content
const [editedContent, setEditedContent] = useState('');           // User edits
const [generationStep, setGenerationStep] = useState('website');  // Workflow state
const [isGenerating, setIsGenerating] = useState(false);

// Database Tables Required
blog_posts: id, user_id, title, content, topic_data, business_context, status
generation_history: user_id, type, input_data, output_data, tokens_used, success_status
user_activity_events: user_id, event_type, event_data, timestamp

// API Endpoints Required
POST /api/v1/analyze-website           // Website analysis (existing)
POST /api/v1/generate-topics          // Topic generation (existing) 
POST /api/v1/generate-content         // Content generation (existing)
POST /api/v1/blog-posts               // Save blog post
PUT  /api/v1/blog-posts/:id          // Update blog post
GET  /api/v1/user/generation-history  // User's generation history
```

### **3. PostsTab.js**
**Current State**: Empty component ❌  
**Full Implementation Required**:

```javascript
// Component State Needed
const [blogPosts, setBlogPosts] = useState([]);          // User's blog posts from DB
const [filteredPosts, setFilteredPosts] = useState([]); // Filtered/searched posts
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('all'); // all, draft, published
const [sortBy, setSortBy] = useState('created_at');
const [isLoading, setIsLoading] = useState(true);
const [selectedPost, setSelectedPost] = useState(null);  // For preview modal

// Database Tables Required
blog_posts: id, user_id, title, content, status, created_at, updated_at, export_count
generation_history: user_id, type, input_data, output_data, created_at

// API Endpoints Required  
GET /api/v1/blog-posts                 // User's blog posts (paginated)
GET /api/v1/blog-posts/:id            // Individual post details
PUT /api/v1/blog-posts/:id            // Update post
DELETE /api/v1/blog-posts/:id         // Delete post
POST /api/v1/blog-posts/:id/export    // Export post (track in export_count)
```

### **4. ProjectsTab.js**
**Current State**: Empty component ❌
**Full Implementation Required**:

```javascript
// Component State Needed  
const [projects, setProjects] = useState([]);           // User's projects
const [isCreatingProject, setIsCreatingProject] = useState(false);
const [newProjectData, setNewProjectData] = useState({
  name: '',
  description: '',
  businessContext: null,
  defaultStrategy: null
});

// Database Tables Required
projects: id, user_id, name, description, business_context, default_strategy, created_at
project_blog_posts: project_id, blog_post_id, created_at

// API Endpoints Required
GET  /api/v1/projects                  // User's projects
POST /api/v1/projects                  // Create project  
PUT  /api/v1/projects/:id             // Update project
DELETE /api/v1/projects/:id           // Delete project
GET  /api/v1/projects/:id/posts       // Posts in project
```

### **5. AnalyticsTab.js**
**Current State**: Basic chart mockup ❌
**Full Implementation Required**:

```javascript
// Component State Needed
const [analyticsData, setAnalyticsData] = useState({
  contentGeneration: {
    totalPosts: 0,          // COUNT from blog_posts WHERE user_id = X
    thisMonth: 0,           // COUNT with date filter
    avgWordCount: 0,        // AVG(LENGTH(content))
    topTopics: []           // Most used topics
  },
  engagement: {
    totalExports: 0,        // SUM(export_count) 
    avgExportsPerPost: 0,   // AVG(export_count)
    popularPosts: []        // ORDER BY export_count DESC
  },
  usage: {
    tokensUsed: 0,          // SUM from generation_history
    generationTime: 0,      // AVG(duration_ms)
    successRate: 0          // % success_status = true
  }
});

const [dateRange, setDateRange] = useState([lastWeek, today]);
const [isLoading, setIsLoading] = useState(true);

// Database Tables Required
blog_posts: user_id, title, content, export_count, created_at
generation_history: user_id, tokens_used, duration_ms, success_status, created_at
user_activity_events: user_id, event_type, event_data, timestamp

// API Endpoints Required
GET /api/v1/analytics/overview         // All analytics data
GET /api/v1/analytics/content-stats    // Content generation metrics  
GET /api/v1/analytics/engagement       // Export and engagement data
GET /api/v1/analytics/usage           // Token usage and performance
```

### **6. DiscoveryTab.js**
**Current State**: Static layout ❌
**Full Implementation Required**:

```javascript
// Component State Needed
const [savedSearches, setSavedSearches] = useState([]);    // From discovery_searches table
const [trendingTopics, setTrendingTopics] = useState([]);  // Industry trends
const [recommendations, setRecommendations] = useState([]);// AI-generated suggestions
const [discoverySettings, setDiscoverySettings] = useState({
  industries: [],
  contentTypes: [],
  difficulty: 'medium'
});

// Database Tables Required  
discovery_searches: user_id, search_query, results_data, created_at
user_preferences: user_id, preference_type, preference_value
trending_topics: industry, topic, trend_score, date

// API Endpoints Required
GET  /api/v1/discovery/trending        // Trending topics by industry
GET  /api/v1/discovery/recommendations // Personalized suggestions
GET  /api/v1/discovery/searches        // User's saved searches
POST /api/v1/discovery/search          // Save discovery search
PUT  /api/v1/user/preferences          // Update discovery settings
```

### **7. SettingsTab.js**
**Current State**: Referral system UI ✅, other settings missing ❌
**Full Implementation Required**:

```javascript
// Component State Needed
const [userSettings, setUserSettings] = useState({
  profile: { firstName, lastName, email, organizationName },
  billing: { planTier, billingStatus, nextBillingDate },
  preferences: { defaultStrategy, contentLength, tone },
  notifications: { email, push, weekly_summary }
});

const [referralStats, setReferralStats] = useState({
  referralCode: '',           // users.referral_code
  totalReferrals: 0,          // COUNT from referrals WHERE referrer_id = user_id
  successfulReferrals: 0,     // COUNT WHERE status = 'completed'  
  totalEarned: 0,             // SUM from reward_transactions
  pendingRewards: 0          // Unclaimed rewards
});

const [securitySettings, setSecuritySettings] = useState({
  twoFactorEnabled: false,
  lastPasswordChange: null,
  activeSessions: []
});

// Database Tables Required  
users: id, email, first_name, last_name, organization_name, referral_code
billing_accounts: user_id, stripe_customer_id, current_plan, billing_status
user_preferences: user_id, preference_type, preference_value  
referrals: referrer_id, referred_user_id, status, created_at
reward_transactions: user_id, referral_id, reward_type, reward_amount, status
user_sessions: user_id, session_id, ip_address, user_agent, created_at

// API Endpoints Required
GET  /api/v1/user/profile             // User profile data
PUT  /api/v1/user/profile             // Update profile
GET  /api/v1/user/billing             // Billing information  
GET  /api/v1/user/preferences         // User preferences
PUT  /api/v1/user/preferences         // Update preferences
GET  /api/v1/referrals/my-stats       // Referral statistics
POST /api/v1/referrals/invite         // Send referral invite
GET  /api/v1/user/security            // Security settings
PUT  /api/v1/user/security            // Update security
```

---

## 👑 **Admin Dashboard Tabs**

### **8. AdminAnalyticsTab.js**  
**Current State**: Chart mockups with red borders ❌
**Full Implementation Required**:

```javascript
// Component State Needed
const [platformStats, setPlatformStats] = useState({
  totalUsers: 0,              // COUNT from users
  activeUsers: 0,             // Users with activity in last 30 days
  totalRevenue: 0,            // SUM from billing_transactions
  mrr: 0,                     // Monthly recurring revenue calculation
  totalContent: 0,            // COUNT from blog_posts
  avgContentPerUser: 0       // AVG posts per user
});

const [revenueChart, setRevenueChart] = useState([]);      // Daily/monthly revenue
const [userGrowthChart, setUserGrowthChart] = useState([]);// User signups over time  
const [contentChart, setContentChart] = useState([]);      // Content generation trends
const [dateRange, setDateRange] = useState([last30Days, today]);

// Database Tables Required
users: id, created_at, plan_tier, status
billing_transactions: user_id, amount, transaction_type, created_at
billing_accounts: user_id, current_plan, billing_status, mrr_amount
blog_posts: user_id, created_at, status
generation_history: user_id, created_at, success_status
user_activity_events: user_id, event_type, timestamp

// API Endpoints Required  
GET /api/v1/admin/analytics/overview   // Platform overview stats
GET /api/v1/admin/analytics/revenue    // Revenue analytics
GET /api/v1/admin/analytics/users      // User growth and activity
GET /api/v1/admin/analytics/content    // Content generation metrics
GET /api/v1/admin/analytics/performance // System performance metrics
```

### **9. AdminUsersTab.js**
**Current State**: User list mockup with red borders ❌  
**Full Implementation Required**:

```javascript
// Component State Needed
const [users, setUsers] = useState([]);              // All users with details
const [filteredUsers, setFilteredUsers] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive, suspended
const [selectedUser, setSelectedUser] = useState(null);   // For user detail modal
const [userStats, setUserStats] = useState({});          // Per-user statistics

// Database Tables Required
users: id, email, first_name, last_name, organization_name, plan_tier, status, created_at
billing_accounts: user_id, current_plan, billing_status, mrr_amount
blog_posts: user_id, COUNT(*) as post_count
generation_history: user_id, SUM(tokens_used) as total_tokens
user_sessions: user_id, MAX(created_at) as last_login

// API Endpoints Required
GET  /api/v1/admin/users               // All users (paginated)
GET  /api/v1/admin/users/:id          // Individual user details
PUT  /api/v1/admin/users/:id/status   // Update user status
GET  /api/v1/admin/users/:id/activity // User activity history
POST /api/v1/admin/users/:id/note     // Add admin note
DELETE /api/v1/admin/users/:id        // Deactivate user (soft delete)
```

### **10. AdminContentTab.js**
**Current State**: Content list mockup with red borders ❌
**Full Implementation Required**:

```javascript
// Component State Needed
const [allContent, setAllContent] = useState([]);       // All platform content
const [filteredContent, setFilteredContent] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('all'); // published, flagged, pending
const [selectedContent, setSelectedContent] = useState(null); // For moderation modal
const [moderationQueue, setModerationQueue] = useState([]);   // Content needing review

// Database Tables Required  
blog_posts: id, user_id, title, content, status, created_at, export_count
users: id, email, first_name, last_name (for author info)
generation_history: blog_post_id, tokens_used, success_status
audit_logs: resource_type='blog_post', action, user_id, created_at

// API Endpoints Required
GET  /api/v1/admin/content             // All content (paginated)
GET  /api/v1/admin/content/:id         // Individual content details  
PUT  /api/v1/admin/content/:id/status  // Moderate content (approve/flag/reject)
DELETE /api/v1/admin/content/:id       // Delete content
GET  /api/v1/admin/content/queue       // Content moderation queue
POST /api/v1/admin/content/:id/flag    // Flag content for review
```

### **11. AdminSystemTab.js**
**Current State**: System metrics mockup with red borders ❌
**Full Implementation Required**:

```javascript
// Component State Needed
const [systemHealth, setSystemHealth] = useState({
  api: { status: 'healthy', responseTime: 0, successRate: 0 },
  database: { status: 'healthy', connectionPool: 0, queryTime: 0 },
  ai: { status: 'healthy', avgTokens: 0, successRate: 0 },
  storage: { usage: 0, available: 0 }
});

const [performanceMetrics, setPerformanceMetrics] = useState({
  requestsPerHour: 0,     // API request volume
  avgResponseTime: 0,     // Average response time
  errorRate: 0,           // Error percentage
  uptime: 99.9           // System uptime
});

const [featureFlags, setFeatureFlags] = useState([]); // From feature_flags table

// Database Tables Required
generation_history: AVG(duration_ms), COUNT(*), success_status  
audit_logs: COUNT(*) for activity tracking
user_sessions: COUNT(*) for active users
feature_flags: name, enabled, rollout_percentage, description

// API Endpoints Required
GET /api/v1/admin/system/health        // System health status
GET /api/v1/admin/system/performance   // Performance metrics
GET /api/v1/admin/system/features      // Feature flags
PUT /api/v1/admin/system/features/:id  // Update feature flag
GET /api/v1/admin/system/logs          // System logs and errors
```

---

## 🎭 **Modal Components**

### **PricingModal.js**
**Current State**: Static pricing display ✅
**Needs Enhancement**:
```javascript
// Additional State Needed
const [currentPlan, setCurrentPlan] = useState(null);    // User's current plan
const [billingInterval, setBillingInterval] = useState('monthly');
const [isUpgrading, setIsUpgrading] = useState(false);

// Database Integration Required
billing_accounts: current_plan, billing_status, next_billing_date
pricing_plans: name, price, features, billing_interval

// API Endpoints Required  
GET /api/v1/pricing/plans              // Available plans
POST /api/v1/billing/upgrade           // Upgrade plan
GET /api/v1/user/current-plan          // User's current plan
```

### **SchedulingModal.js**
**Current State**: Basic form ✅
**Needs Enhancement**:
```javascript
// Additional State Needed
const [scheduledPosts, setScheduledPosts] = useState([]); // User's scheduled posts
const [selectedPost, setSelectedPost] = useState(null);

// Database Integration Required
scheduled_posts: user_id, blog_post_id, scheduled_for, status, platform_config
social_platforms: user_id, platform_name, access_token, account_id

// API Endpoints Required
POST /api/v1/scheduled-posts           // Schedule a post
GET /api/v1/scheduled-posts            // User's scheduled posts  
PUT /api/v1/scheduled-posts/:id        // Update scheduled post
DELETE /api/v1/scheduled-posts/:id     // Cancel scheduled post
```

### **DiscoverySettingsModal.js**
**Current State**: Settings form ✅
**Needs Enhancement**:  
```javascript
// Database Integration Required
user_preferences: user_id, preference_type, preference_value
discovery_searches: user_id, search_criteria, created_at

// API Endpoints Required
GET /api/v1/user/discovery-preferences // Current settings
PUT /api/v1/user/discovery-preferences // Update settings
```

---

## 🔄 **Workflow Components**

### **WorkflowContainer-v2.js**
**Current State**: Blog generation workflow ✅
**Needs Enhancement**:
```javascript
// Additional Database Integration
// Save workflow state for resume capability
workflow_sessions: user_id, step_data, current_step, created_at

// API Endpoints Required
POST /api/v1/workflow/save-state       // Save workflow progress
GET /api/v1/workflow/resume-state      // Resume interrupted workflow
```

---

## 📊 **Summary: Implementation Priority**

### **Phase 1: Core User Functionality (Week 1-2)**
1. **AuthContext**: Real database authentication
2. **NewPostTab**: Full blog generation workflow with database saving
3. **PostsTab**: User's blog posts management  
4. **OverviewTab**: User dashboard with real stats
5. **SettingsTab**: User settings + referral system

### **Phase 2: Enhanced User Features (Week 3)**  
6. **AnalyticsTab**: User analytics and insights
7. **ProjectsTab**: Project management functionality
8. **DiscoveryTab**: Content discovery features
9. **Modal enhancements**: Real billing, scheduling, settings

### **Phase 3: Admin Features (Week 4)**
10. **AdminAnalyticsTab**: Platform-wide analytics
11. **AdminUsersTab**: User management 
12. **AdminContentTab**: Content moderation
13. **AdminSystemTab**: System monitoring

Each component needs:
- ✅ **Database connections** to specific tables
- ✅ **API endpoints** for data operations  
- ✅ **State management** for loading/error/success states
- ✅ **Display logic** for different data scenarios
- ✅ **Testing plan** for validation