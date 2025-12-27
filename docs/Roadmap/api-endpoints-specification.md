# API Endpoints Specification

## 🎯 **Overview**
Complete REST API specification for connecting frontend components to PostgreSQL database functionality.

---

## 🔐 **Authentication & Authorization**

### **Base URL Structure**
```
Production:  https://api.automatemyblog.com/api/v1
Development: http://localhost:3001/api/v1
```

### **Authentication Headers**
```javascript
// All authenticated requests require:
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

### **Permission Levels**
```javascript
// User Permissions
'user':         // Basic user access
'admin':        // Admin dashboard access  
'super_admin':  // Full system access
```

---

## 🔑 **Authentication Endpoints**

### **POST /auth/register**
**Purpose**: Create new user account
```javascript
// Request
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe", 
  "organizationName": "Acme Corp"
}

// Response (201)
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "organizationName": "Acme Corp",
    "planTier": "free",
    "referralCode": "AMBJOHN123",
    "createdAt": "2024-01-26T10:00:00Z"
  },
  "session": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token", 
    "expiresIn": 3600
  }
}

// Database Operations
INSERT INTO users (id, email, first_name, last_name, organization_name, password_hash, referral_code, created_at)
INSERT INTO billing_accounts (user_id, current_plan, billing_status, created_at)
```

### **POST /auth/login**
**Purpose**: Authenticate existing user
```javascript
// Request
{
  "email": "user@example.com",
  "password": "securePassword123"
}

// Response (200)
{
  "success": true,
  "user": { /* user object */ },
  "session": { /* session tokens */ }
}

// Database Operations
SELECT * FROM users WHERE email = $1
UPDATE user_sessions SET ended_at = NOW() WHERE user_id = $1 AND ended_at IS NULL
INSERT INTO user_sessions (user_id, session_id, started_at, ip_address, user_agent)
```

### **GET /auth/me**
**Purpose**: Get current user information
**Auth**: Required
```javascript
// Response (200)
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com", 
    "firstName": "John",
    "lastName": "Doe",
    "organizationName": "Acme Corp",
    "planTier": "starter",
    "referralCode": "AMBJOHN123",
    "isAdmin": false,
    "createdAt": "2024-01-26T10:00:00Z",
    "lastLoginAt": "2024-01-26T14:30:00Z"
  },
  "profile": {
    "blogPostsGenerated": 12,
    "blogPostsRemaining": 38,
    "billingStatus": "active"
  },
  "permissions": {
    "canAccessAdmin": false,
    "canModerateContent": false,
    "canViewAnalytics": true
  }
}

// Database Operations
SELECT u.*, ba.current_plan, ba.billing_status 
FROM users u 
LEFT JOIN billing_accounts ba ON u.id = ba.user_id 
WHERE u.id = $1

SELECT COUNT(*) FROM blog_posts WHERE user_id = $1
```

### **POST /auth/refresh**
**Purpose**: Refresh access token
```javascript
// Request
{
  "refreshToken": "refresh_token_here"
}

// Response (200)
{
  "success": true,
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 3600
}
```

### **POST /auth/logout**
**Purpose**: End user session
**Auth**: Required
```javascript
// Response (200)
{
  "success": true,
  "message": "Logout successful"
}

// Database Operations
UPDATE user_sessions SET ended_at = NOW() 
WHERE user_id = $1 AND session_id = $2 AND ended_at IS NULL
```

---

## 📊 **Dashboard Endpoints**

### **GET /dashboard/overview**
**Purpose**: User dashboard summary statistics
**Auth**: Required
```javascript
// Response (200)
{
  "success": true,
  "data": {
    "stats": {
      "blogPostsGenerated": 15,
      "blogPostsRemaining": 35, 
      "totalProjects": 3,
      "scheduledPosts": 2,
      "totalExports": 45,
      "avgWordsPerPost": 1250
    },
    "recentActivity": [
      {
        "id": "uuid",
        "type": "blog_post_created",
        "title": "AI Marketing Trends 2024",
        "timestamp": "2024-01-26T14:30:00Z"
      }
    ],
    "usageMetrics": {
      "currentPeriod": {
        "postsGenerated": 8,
        "tokensUsed": 25000,
        "successRate": 96.5
      },
      "trends": {
        "postsThisWeek": 8,
        "postsLastWeek": 5,
        "growthPercentage": 60
      }
    }
  }
}

// Database Operations
SELECT COUNT(*) as total_posts FROM blog_posts WHERE user_id = $1
SELECT COUNT(*) as scheduled_posts FROM scheduled_posts WHERE user_id = $1 AND status = 'pending'
SELECT SUM(export_count) as total_exports FROM blog_posts WHERE user_id = $1
SELECT AVG(LENGTH(content)) as avg_words FROM blog_posts WHERE user_id = $1
SELECT * FROM user_activity_events WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 10
```

---

## 📝 **Blog Posts Endpoints**

### **GET /blog-posts**
**Purpose**: Get user's blog posts with pagination and filtering
**Auth**: Required
```javascript
// Query Parameters
?limit=25&offset=0&status=all&sortBy=created_at&order=desc&search=keyword

// Response (200)
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "AI-Powered Marketing Strategies for 2024",
        "contentPreview": "In today's digital landscape...", // First 200 chars
        "status": "published",
        "wordCount": 1250,
        "exportCount": 12,
        "topicData": {
          "category": "Marketing",
          "targetAudience": "Small Business Owners"
        },
        "createdAt": "2024-01-25T10:00:00Z",
        "updatedAt": "2024-01-25T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 156,
      "limit": 25,
      "offset": 0,
      "hasMore": true
    }
  }
}

// Database Operations  
SELECT bp.*, 
       LENGTH(bp.content) as word_count,
       LEFT(bp.content, 200) as content_preview
FROM blog_posts bp 
WHERE bp.user_id = $1 
  AND ($2 = 'all' OR bp.status = $2)
  AND ($3 = '' OR bp.title ILIKE '%' || $3 || '%')
ORDER BY ${sortBy} ${order}
LIMIT $4 OFFSET $5
```

### **POST /blog-posts**
**Purpose**: Create new blog post
**Auth**: Required
```javascript
// Request
{
  "title": "AI Marketing Trends 2024",
  "content": "Full blog post content here...",
  "topicData": {
    "category": "Marketing", 
    "targetAudience": "Small Business Owners",
    "keywords": ["AI", "Marketing", "2024"]
  },
  "businessContext": {
    "businessType": "Marketing Agency",
    "targetMarket": "Small Businesses"
  },
  "generationMetadata": {
    "tokensUsed": 2340,
    "generationTime": 15.2,
    "aiModel": "gpt-4"
  }
}

// Response (201)
{
  "success": true,
  "post": {
    "id": "uuid",
    "title": "AI Marketing Trends 2024",
    "status": "draft",
    "createdAt": "2024-01-26T15:00:00Z"
  }
}

// Database Operations
INSERT INTO blog_posts (id, user_id, title, content, topic_data, business_context, status, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, 'draft', NOW(), NOW())

INSERT INTO generation_history (id, user_id, type, input_data, output_data, tokens_used, duration_ms, success_status, created_at)
VALUES ($1, $2, 'blog_post', $3, $4, $5, $6, true, NOW())
```

### **GET /blog-posts/:id**
**Purpose**: Get specific blog post details
**Auth**: Required, must own post
```javascript
// Response (200)
{
  "success": true,
  "post": {
    "id": "uuid",
    "title": "Complete Blog Post Title",
    "content": "Full blog post content...",
    "status": "published",
    "wordCount": 1250,
    "exportCount": 12,
    "topicData": { /* topic information */ },
    "businessContext": { /* business context */ },
    "generationHistory": {
      "tokensUsed": 2340,
      "generationTime": 15.2,
      "aiModel": "gpt-4",
      "prompt": "Original generation prompt"
    },
    "exports": [
      {
        "id": "uuid",
        "format": "markdown",
        "exportedAt": "2024-01-26T12:00:00Z"
      }
    ],
    "createdAt": "2024-01-25T10:00:00Z",
    "updatedAt": "2024-01-25T10:00:00Z"
  }
}

// Database Operations
SELECT bp.*, 
       LENGTH(bp.content) as word_count,
       gh.tokens_used, gh.duration_ms, gh.input_data
FROM blog_posts bp
LEFT JOIN generation_history gh ON bp.id = gh.output_data->>'blog_post_id'  
WHERE bp.id = $1 AND bp.user_id = $2
```

### **PUT /blog-posts/:id**
**Purpose**: Update blog post
**Auth**: Required, must own post
```javascript
// Request  
{
  "title": "Updated Blog Post Title",
  "content": "Updated content...",
  "status": "published"
}

// Response (200)
{
  "success": true,
  "post": { /* updated post */ }
}

// Database Operations
UPDATE blog_posts 
SET title = $1, content = $2, status = $3, updated_at = NOW()
WHERE id = $4 AND user_id = $5
```

### **DELETE /blog-posts/:id**
**Purpose**: Delete blog post (soft delete)
**Auth**: Required, must own post
```javascript
// Response (200)  
{
  "success": true,
  "message": "Blog post deleted successfully"
}

// Database Operations
UPDATE blog_posts SET status = 'deleted', deleted_at = NOW() 
WHERE id = $1 AND user_id = $2
```

### **POST /blog-posts/:id/export**
**Purpose**: Export blog post and track usage
**Auth**: Required, must own post
```javascript
// Request
{
  "format": "markdown" // markdown, html, docx, pdf
}

// Response (200)
{
  "success": true,
  "export": {
    "id": "uuid",
    "downloadUrl": "https://exports.automatemyblog.com/uuid.md",
    "format": "markdown",
    "expiresAt": "2024-01-26T18:00:00Z" // 1 hour expiry
  }
}

// Database Operations
UPDATE blog_posts SET export_count = export_count + 1 WHERE id = $1
INSERT INTO export_history (user_id, blog_post_id, format, created_at) VALUES ($1, $2, $3, NOW())
```

---

## 📈 **Analytics Endpoints**

### **GET /analytics/overview**
**Purpose**: User analytics overview
**Auth**: Required
```javascript
// Query Parameters
?dateFrom=2024-01-01&dateTo=2024-01-26

// Response (200)
{
  "success": true,
  "data": {
    "summary": {
      "totalPosts": 45,
      "totalExports": 156,
      "totalTokensUsed": 125000,
      "avgGenerationTime": 12.5,
      "successRate": 96.8
    },
    "trends": {
      "contentGeneration": [
        {
          "date": "2024-01-20",
          "posts": 3,
          "tokens": 8500
        }
      ],
      "exportActivity": [
        {
          "date": "2024-01-20", 
          "exports": 12,
          "formats": { "markdown": 8, "html": 4 }
        }
      ]
    },
    "topPerformers": {
      "mostExported": [
        {
          "postId": "uuid",
          "title": "AI Marketing Guide",
          "exports": 25
        }
      ],
      "topTopics": [
        {
          "topic": "AI Marketing",
          "posts": 8,
          "avgExports": 15.2
        }
      ]
    }
  }
}

// Database Operations
SELECT COUNT(*) as total_posts, 
       SUM(export_count) as total_exports,
       AVG(export_count) as avg_exports
FROM blog_posts 
WHERE user_id = $1 AND created_at BETWEEN $2 AND $3

SELECT DATE(created_at) as date, COUNT(*) as posts
FROM blog_posts 
WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
GROUP BY DATE(created_at)
ORDER BY date

SELECT SUM(tokens_used) as total_tokens,
       AVG(duration_ms) as avg_duration,
       COUNT(CASE WHEN success_status = true THEN 1 END)::float / COUNT(*) * 100 as success_rate
FROM generation_history
WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
```

---

## 👥 **User Management Endpoints**

### **GET /user/profile**
**Purpose**: Get detailed user profile
**Auth**: Required
```javascript
// Response (200)
{
  "success": true,
  "profile": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John", 
      "lastName": "Doe",
      "organizationName": "Acme Corp",
      "referralCode": "AMBJOHN123"
    },
    "billing": {
      "planTier": "starter",
      "billingStatus": "active",
      "currentUsage": 15,
      "usageLimit": 50,
      "nextBillingDate": "2024-02-26",
      "mrrAmount": 29.00
    },
    "preferences": {
      "defaultStrategy": "thought_leadership",
      "preferredContentLength": "medium",
      "defaultTone": "professional",
      "emailNotifications": true,
      "weeklyDigest": true
    }
  }
}

// Database Operations  
SELECT u.*, ba.current_plan, ba.billing_status, ba.mrr_amount, ba.next_billing_date
FROM users u
LEFT JOIN billing_accounts ba ON u.id = ba.user_id  
WHERE u.id = $1

SELECT preference_type, preference_value 
FROM user_preferences 
WHERE user_id = $1
```

### **PUT /user/profile**
**Purpose**: Update user profile
**Auth**: Required
```javascript
// Request
{
  "firstName": "John",
  "lastName": "Doe", 
  "organizationName": "Updated Corp"
}

// Response (200)
{
  "success": true,
  "user": { /* updated user */ }
}

// Database Operations
UPDATE users 
SET first_name = $1, last_name = $2, organization_name = $3, updated_at = NOW()
WHERE id = $4
```

### **GET /user/preferences**
**Purpose**: Get user preferences
**Auth**: Required
```javascript
// Response (200)
{
  "success": true,
  "preferences": {
    "defaultStrategy": "thought_leadership",
    "preferredContentLength": "medium",
    "defaultTone": "professional",
    "emailNotifications": true,
    "weeklyDigest": true,
    "discoveryCategories": ["Marketing", "Technology"]
  }
}
```

### **PUT /user/preferences**  
**Purpose**: Update user preferences
**Auth**: Required
```javascript
// Request
{
  "defaultStrategy": "how_to_guides",
  "preferredContentLength": "long", 
  "emailNotifications": false
}

// Response (200)
{
  "success": true,
  "preferences": { /* updated preferences */ }
}

// Database Operations
INSERT INTO user_preferences (user_id, preference_type, preference_value, updated_at)
VALUES ($1, $2, $3, NOW())
ON CONFLICT (user_id, preference_type) 
DO UPDATE SET preference_value = $3, updated_at = NOW()
```

---

## 🎁 **Referral System Endpoints**

### **GET /referrals/my-stats**
**Purpose**: Get user's referral statistics
**Auth**: Required
```javascript
// Response (200)
{
  "success": true,
  "data": {
    "referralCode": "AMBJOHN123",
    "referralLink": "https://automatemyblog.com/r/AMBJOHN123",
    "stats": {
      "totalInvites": 12,
      "pendingInvites": 3,
      "successfulReferrals": 5,
      "totalEarned": 75.00,
      "pendingRewards": 45.00,
      "claimedRewards": 30.00
    },
    "recentReferrals": [
      {
        "id": "uuid",
        "email": "friend@example.com",
        "status": "completed",
        "referredAt": "2024-01-20T10:00:00Z",
        "rewardAmount": 15.00,
        "rewardStatus": "claimed"
      }
    ],
    "invitesSent": [
      {
        "id": "uuid", 
        "email": "pending@example.com",
        "sentAt": "2024-01-25T14:00:00Z",
        "status": "pending",
        "expiresAt": "2024-02-25T14:00:00Z"
      }
    ]
  }
}

// Database Operations
SELECT COUNT(*) as total_invites,
       COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_invites,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_referrals
FROM user_invites 
WHERE inviter_user_id = $1

SELECT COALESCE(SUM(reward_amount), 0) as total_earned
FROM referral_rewards 
WHERE user_id = $1

SELECT * FROM user_invites 
WHERE inviter_user_id = $1 
ORDER BY created_at DESC
```

### **POST /referrals/invite**
**Purpose**: Send referral invitations
**Auth**: Required
```javascript
// Request
{
  "emails": ["friend1@example.com", "friend2@example.com"],
  "personalMessage": "Check out this awesome blog tool!"
}

// Response (201)
{
  "success": true,
  "data": {
    "invitesSent": 2,
    "invites": [
      {
        "id": "uuid",
        "email": "friend1@example.com", 
        "inviteCode": "INV123ABC",
        "inviteLink": "https://automatemyblog.com/r/INV123ABC",
        "expiresAt": "2024-02-26T15:00:00Z"
      }
    ]
  }
}

// Database Operations
INSERT INTO user_invites (id, inviter_user_id, email, invite_code, personal_message, status, expires_at, created_at)
VALUES ($1, $2, $3, $4, $5, 'pending', NOW() + INTERVAL '30 days', NOW())

-- Send email via email service
```

### **POST /referrals/claim-reward/:rewardId**
**Purpose**: Claim available referral reward
**Auth**: Required
```javascript
// Response (200)
{
  "success": true,
  "reward": {
    "id": "uuid",
    "amount": 15.00,
    "type": "blog_post_credit", 
    "claimedAt": "2024-01-26T15:00:00Z"
  },
  "newBalance": {
    "blogPostsRemaining": 51,
    "totalCredits": 51
  }
}

// Database Operations
UPDATE referral_rewards 
SET status = 'claimed', claimed_at = NOW() 
WHERE id = $1 AND user_id = $2 AND status = 'pending'

UPDATE billing_accounts 
SET usage_limit = usage_limit + 1
WHERE user_id = $2
```

---

## 🛠️ **Admin Endpoints**

### **GET /admin/analytics/overview**
**Purpose**: Platform-wide analytics overview
**Auth**: Admin required
```javascript
// Query Parameters
?dateFrom=2024-01-01&dateTo=2024-01-26

// Response (200)
{
  "success": true,
  "data": {
    "summary": {
      "totalUsers": 1247,
      "activeUsers": 892,          // Active in last 30 days
      "newUsersToday": 12,
      "totalRevenue": 45670.00,
      "mrrGrowth": 15.2,
      "totalContent": 5680,
      "contentToday": 45,
      "avgRevenuePerUser": 36.50
    },
    "trends": {
      "userGrowth": [
        {
          "date": "2024-01-20",
          "newUsers": 15,
          "totalUsers": 1240
        }
      ],
      "revenueGrowth": [
        {
          "date": "2024-01-20",
          "revenue": 1250.00,
          "mrr": 24500.00
        }
      ],
      "contentGeneration": [
        {
          "date": "2024-01-20",
          "posts": 125,
          "uniqueUsers": 89
        }
      ]
    },
    "topMetrics": {
      "highestRevenueUsers": [
        {
          "userId": "uuid",
          "email": "bigclient@example.com",
          "mrr": 99.00,
          "planTier": "enterprise"
        }
      ],
      "mostActiveUsers": [
        {
          "userId": "uuid", 
          "email": "poweruser@example.com",
          "postsGenerated": 45,
          "lastActive": "2024-01-26T14:00:00Z"
        }
      ]
    }
  }
}

// Database Operations
SELECT COUNT(*) as total_users FROM users WHERE status = 'active'
SELECT COUNT(*) as active_users FROM users WHERE last_login_at > NOW() - INTERVAL '30 days'
SELECT COUNT(*) as new_users_today FROM users WHERE created_at >= CURRENT_DATE
SELECT SUM(mrr_amount) as total_mrr FROM billing_accounts WHERE billing_status = 'active'
SELECT COUNT(*) as total_content FROM blog_posts WHERE status != 'deleted'
```

### **GET /admin/users**  
**Purpose**: Get all users for admin management
**Auth**: Admin required
```javascript
// Query Parameters  
?limit=50&offset=0&status=all&planTier=all&search=email&sortBy=created_at&order=desc

// Response (200)
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe", 
        "organizationName": "Acme Corp",
        "planTier": "starter",
        "billingStatus": "active",
        "mrrAmount": 29.00,
        "postsGenerated": 15,
        "totalSpent": 89.00,
        "lastLoginAt": "2024-01-26T14:00:00Z",
        "createdAt": "2024-01-15T10:00:00Z",
        "status": "active"
      }
    ],
    "pagination": {
      "total": 1247,
      "limit": 50, 
      "offset": 0,
      "hasMore": true
    },
    "summary": {
      "totalUsers": 1247,
      "activeUsers": 1180,
      "suspendedUsers": 15,
      "deletedUsers": 52
    }
  }
}

// Database Operations
SELECT u.*, ba.current_plan, ba.billing_status, ba.mrr_amount,
       COUNT(bp.id) as posts_generated,
       COALESCE(SUM(bt.amount), 0) as total_spent
FROM users u
LEFT JOIN billing_accounts ba ON u.id = ba.user_id
LEFT JOIN blog_posts bp ON u.id = bp.user_id AND bp.status != 'deleted' 
LEFT JOIN billing_transactions bt ON u.id = bt.user_id
WHERE ($1 = 'all' OR u.status = $1)
  AND ($2 = 'all' OR ba.current_plan = $2)
  AND ($3 = '' OR u.email ILIKE '%' || $3 || '%')
GROUP BY u.id, ba.current_plan, ba.billing_status, ba.mrr_amount
ORDER BY ${sortBy} ${order}
LIMIT $4 OFFSET $5
```

### **GET /admin/users/:id**
**Purpose**: Get detailed user information for admin
**Auth**: Admin required
```javascript
// Response (200)
{
  "success": true,
  "user": {
    "profile": { /* full user profile */ },
    "billing": { /* billing details */ },
    "activity": {
      "postsGenerated": 45,
      "totalExports": 156,
      "tokensUsed": 125000,
      "lastActive": "2024-01-26T14:00:00Z",
      "sessionsThisMonth": 23,
      "avgSessionDuration": 1845 // seconds
    },
    "referrals": {
      "totalReferrals": 8,
      "successfulReferrals": 5,
      "rewardsEarned": 75.00
    },
    "support": {
      "tickets": 2,
      "lastTicket": "2024-01-20T10:00:00Z",
      "satisfaction": "high"
    },
    "adminNotes": [
      {
        "id": "uuid",
        "note": "Premium customer - provide priority support",
        "addedBy": "admin@automatemyblog.com",
        "addedAt": "2024-01-15T09:00:00Z"
      }
    ]
  }
}
```

### **PUT /admin/users/:id/status**
**Purpose**: Update user status (activate/suspend/ban)
**Auth**: Admin required
```javascript
// Request
{
  "status": "suspended", // active, suspended, banned
  "reason": "Policy violation",
  "notes": "Suspended for 7 days due to spam content"
}

// Response (200)
{
  "success": true,
  "user": { /* updated user */ },
  "auditLog": {
    "action": "user_status_changed",
    "previousStatus": "active",
    "newStatus": "suspended",
    "reason": "Policy violation",
    "performedBy": "admin@automatemyblog.com",
    "timestamp": "2024-01-26T15:00:00Z"
  }
}

// Database Operations
UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, changes, ip_address, created_at)
VALUES ($1, 'user_status_changed', 'user', $2, $3, $4, NOW())
```

### **GET /admin/content**
**Purpose**: Get all platform content for moderation
**Auth**: Admin required  
```javascript
// Query Parameters
?limit=25&offset=0&status=all&flagged=false&author=email&search=keyword

// Response (200) 
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "title": "Blog Post Title",
        "contentPreview": "First 200 characters...",
        "status": "published",
        "author": {
          "id": "uuid",
          "email": "author@example.com",
          "name": "John Doe"
        },
        "metrics": {
          "wordCount": 1250,
          "exportCount": 12,
          "qualityScore": 85,
          "flagCount": 0
        },
        "moderation": {
          "status": "approved", // approved, pending, flagged, rejected
          "lastModerated": "2024-01-25T10:30:00Z",
          "moderatedBy": "admin@automatemyblog.com"
        },
        "createdAt": "2024-01-25T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 5680,
      "limit": 25,
      "offset": 0,
      "hasMore": true  
    },
    "summary": {
      "totalContent": 5680,
      "pendingModeration": 23,
      "flaggedContent": 5,
      "avgQualityScore": 78.5
    }
  }
}

// Database Operations
SELECT bp.id, bp.title, LEFT(bp.content, 200) as content_preview, bp.status,
       bp.export_count, LENGTH(bp.content) as word_count, bp.created_at,
       u.email, u.first_name, u.last_name,
       COUNT(CASE WHEN al.action = 'content_flagged' THEN 1 END) as flag_count
FROM blog_posts bp
LEFT JOIN users u ON bp.user_id = u.id  
LEFT JOIN audit_logs al ON bp.id = al.resource_id AND al.resource_type = 'blog_post'
WHERE bp.status != 'deleted'
  AND ($1 = 'all' OR bp.status = $1)
  AND ($2 = '' OR u.email ILIKE '%' || $2 || '%')
GROUP BY bp.id, u.email, u.first_name, u.last_name
ORDER BY bp.created_at DESC
LIMIT $3 OFFSET $4
```

### **PUT /admin/content/:id/status**
**Purpose**: Moderate content (approve/flag/reject)
**Auth**: Admin required
```javascript
// Request
{
  "status": "flagged", // approved, flagged, rejected, deleted
  "reason": "inappropriate_content",
  "moderatorNotes": "Contains policy violations - excessive promotional content",
  "actionRequired": true
}

// Response (200)
{
  "success": true,
  "content": {
    "id": "uuid",
    "previousStatus": "published",
    "newStatus": "flagged", 
    "moderatedBy": "admin@automatemyblog.com",
    "moderatedAt": "2024-01-26T15:00:00Z"
  },
  "auditLog": {
    "id": "uuid",
    "action": "content_moderated",
    "changes": { /* moderation details */ }
  }
}

// Database Operations
UPDATE blog_posts SET status = $1, updated_at = NOW() WHERE id = $2
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, changes, created_at)
VALUES ($1, 'content_moderated', 'blog_post', $2, $3, NOW())
```

---

## ⚙️ **System Monitoring Endpoints**

### **GET /admin/system/health** 
**Purpose**: System health monitoring
**Auth**: Admin required
```javascript
// Response (200)
{
  "success": true,
  "data": {
    "status": "healthy", // healthy, degraded, down
    "uptime": 99.8,
    "lastUpdated": "2024-01-26T15:30:00Z",
    
    "database": {
      "status": "healthy",
      "connectionPool": "85%",
      "avgQueryTime": "125ms",
      "activeConnections": 12,
      "errorRate": 0.2
    },
    
    "api": {
      "status": "healthy", 
      "totalRequests": 25680,
      "successRate": 99.2,
      "errorRate": 0.8,
      "avgResponseTime": 180,
      "p95ResponseTime": 450
    },
    
    "ai": {
      "status": "healthy",
      "totalGenerations": 1240,
      "successRate": 96.5,
      "avgTokensPerGeneration": 2100,
      "avgGenerationTime": 12500
    }
  }
}

// Database Operations  
SELECT COUNT(*) as total_requests,
       AVG(duration_ms) as avg_duration,
       COUNT(CASE WHEN success_status = true THEN 1 END)::float / COUNT(*) * 100 as success_rate
FROM generation_history
WHERE created_at > NOW() - INTERVAL '24 hours'

SELECT COUNT(*) as active_connections FROM pg_stat_activity WHERE state = 'active'
```

### **GET /admin/system/features**
**Purpose**: Get feature flags for system management
**Auth**: Admin required
```javascript
// Response (200)
{
  "success": true,
  "data": {
    "featureFlags": [
      {
        "id": "uuid",
        "name": "referral_program",
        "description": "Enable referral program with $15 rewards",
        "enabled": true,
        "rolloutPercentage": 100,
        "userCriteria": {
          "planTiers": ["free", "starter"],
          "minAccountAge": 7
        },
        "updatedAt": "2024-01-20T10:00:00Z",
        "updatedBy": "admin@automatemyblog.com"
      },
      {
        "id": "uuid", 
        "name": "advanced_analytics_dashboard",
        "description": "Show advanced analytics to admin users",
        "enabled": true,
        "rolloutPercentage": 100,
        "userCriteria": {
          "roles": ["admin", "super_admin"]
        },
        "updatedAt": "2024-01-15T12:00:00Z",
        "updatedBy": "admin@automatemyblog.com"
      }
    ]
  }
}

// Database Operations
SELECT * FROM feature_flags ORDER BY updated_at DESC
```

### **PUT /admin/system/features/:name**
**Purpose**: Update feature flag
**Auth**: Admin required
```javascript
// Request  
{
  "enabled": false,
  "rolloutPercentage": 50,
  "reason": "Performance testing in progress"
}

// Response (200)
{
  "success": true,
  "featureFlag": { /* updated feature flag */ },
  "auditLog": {
    "action": "feature_flag_updated",
    "changes": { "enabled": { "from": true, "to": false } },
    "performedBy": "admin@automatemyblog.com",
    "timestamp": "2024-01-26T15:00:00Z"
  }
}

// Database Operations
UPDATE feature_flags 
SET enabled = $1, rollout_percentage = $2, updated_at = NOW(), updated_by = $3
WHERE name = $4

INSERT INTO audit_logs (user_id, action, resource_type, resource_id, changes, created_at)
VALUES ($1, 'feature_flag_updated', 'feature_flag', $2, $3, NOW())
```

---

## 🔄 **Content Generation Endpoints (Existing - Enhanced)**

### **POST /analyze-website**
**Purpose**: Analyze website for business context (existing, enhance)
**Auth**: Optional (rate limited by IP if not authenticated)
```javascript
// Database Enhancement: Save analysis for authenticated users
INSERT INTO website_analyses (user_id, url, analysis_data, created_at)
VALUES ($1, $2, $3, NOW())
```

### **POST /generate-topics**  
**Purpose**: Generate trending blog topics (existing, enhance)
**Auth**: Optional (rate limited)
```javascript
// Database Enhancement: Save topic generation
INSERT INTO topic_generations (user_id, business_type, target_audience, topics_data, created_at)
VALUES ($1, $2, $3, $4, NOW())
```

### **POST /generate-content**
**Purpose**: Generate blog post content (existing, enhance)
**Auth**: Optional (rate limited)
```javascript
// Database Enhancement: Comprehensive tracking
INSERT INTO generation_history (id, user_id, type, input_data, output_data, tokens_used, duration_ms, success_status, created_at)
VALUES ($1, $2, 'blog_post', $3, $4, $5, $6, $7, NOW())

-- If user is authenticated and wants to save
INSERT INTO blog_posts (id, user_id, title, content, topic_data, business_context, status, created_at, updated_at)  
VALUES ($1, $2, $3, $4, $5, $6, 'draft', NOW(), NOW())
```

---

## 📊 **Error Handling Standards**

### **Standard Error Response Format**
```javascript
// Error Response Structure
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR", // Error type code
    "message": "Invalid email address", // Human readable message
    "details": { // Additional error details
      "field": "email",
      "value": "invalid-email",
      "constraint": "Must be valid email format"
    },
    "timestamp": "2024-01-26T15:00:00Z",
    "requestId": "req_abc123" // For debugging
  }
}
```

### **HTTP Status Codes**
```javascript
// Success
200: OK - Request successful
201: Created - Resource created successfully  
204: No Content - Delete successful

// Client Errors
400: Bad Request - Invalid request data
401: Unauthorized - Authentication required
403: Forbidden - Insufficient permissions
404: Not Found - Resource not found
409: Conflict - Resource already exists
422: Unprocessable Entity - Validation errors
429: Too Many Requests - Rate limit exceeded

// Server Errors  
500: Internal Server Error - Unexpected server error
502: Bad Gateway - External service error
503: Service Unavailable - Maintenance mode
```

### **Rate Limiting**
```javascript
// Rate Limit Headers (all responses)
{
  "X-RateLimit-Limit": "100",      // Requests per window
  "X-RateLimit-Remaining": "87",   // Remaining requests  
  "X-RateLimit-Reset": "1643200800" // Reset timestamp
}

// Rate Limits by Endpoint Type
Authentication: 10 requests/minute/IP
Content Generation: 20 requests/hour/user (free), 100/hour (paid)
Admin Operations: 1000 requests/hour/admin
Analytics: 100 requests/hour/user
```

---

## 🎯 **Implementation Priority**

### **Phase 1: Core User APIs (Week 1)**
- [ ] Enhanced Authentication endpoints with database
- [ ] Blog Posts CRUD endpoints  
- [ ] User Profile & Preferences endpoints
- [ ] Dashboard Overview endpoint
- [ ] Referral System endpoints

### **Phase 2: User Features (Week 2)**
- [ ] Analytics endpoints with real data
- [ ] Projects management endpoints
- [ ] Enhanced content generation tracking
- [ ] User activity and session tracking

### **Phase 3: Admin APIs (Week 3-4)**
- [ ] Admin Analytics endpoints
- [ ] Admin User Management endpoints  
- [ ] Admin Content Moderation endpoints
- [ ] System Monitoring endpoints
- [ ] Feature Flag management

### **Phase 4: Optimization (Week 4)**
- [ ] Performance optimization and caching
- [ ] Advanced filtering and search
- [ ] Bulk operations for admin
- [ ] Real-time features (WebSocket endpoints)

This comprehensive API specification provides the backend foundation for transforming your UI from mockups to fully functional, database-backed application.