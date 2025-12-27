# Referral System Implementation Guide

## 🎯 **Feature Overview**

**Scope**: Complete referral/invite system allowing users to generate unique links, send invitations, and earn rewards.

**Priority**: **HIGH** (Week 1 - Low Risk, High Value)

**Current Status**: UI Complete ✅ | Database Complete ✅ | Middleware Missing ❌

## 📋 **Requirements Summary**

### **User Workflow**
1. User generates unique referral link in Settings → Referrals tab
2. User copies link or sends email invitations
3. Friend clicks link and signs up
4. Both users receive 1 free blog post generation
5. User tracks referral statistics and rewards

### **Business Rules**
- Each user gets unique referral code (auto-generated)
- $15 value per successful referral (1 blog post each)
- Unlimited referral capacity
- Rewards granted immediately upon friend signup
- Full analytics and tracking for both users

## 💾 **Database Integration**

### **Required Tables** (All Exist ✅)
```sql
-- User referral codes (auto-generated)
users.referral_code VARCHAR(20)

-- Invitation tracking  
user_invites (
  inviter_user_id,
  email,
  invite_code,
  status,
  expires_at,
  accepted_by_user_id
)

-- Reward management
referral_rewards (
  user_id,
  earned_from_invite_id, 
  reward_type,
  reward_value,
  status
)

-- Activity tracking
user_activity_events (
  user_id,
  event_type,
  event_data
)
```

### **Required Database Functions** (All Exist ✅)
- `generate_referral_code()` - Auto-generates unique codes
- `generate_invite_code()` - Creates unique invite codes
- View: `referral_program_summary` - Complete analytics

## 🔌 **Required API Endpoints**

### **Backend Routes to Implement**
```javascript
// Referral Management
GET    /api/v1/referrals/my-code           // Get user's referral code
POST   /api/v1/referrals/send-invite      // Send email invitation
GET    /api/v1/referrals/statistics       // Get user's referral stats
GET    /api/v1/referrals/rewards          // Get user's earned rewards

// Referral Processing  
POST   /api/v1/referrals/validate-code    // Validate referral code during signup
POST   /api/v1/referrals/process-signup   // Process new user from referral
POST   /api/v1/referrals/grant-reward     // Grant rewards to both users

// Admin Analytics
GET    /api/v1/admin/referrals/overview   // Platform referral metrics
GET    /api/v1/admin/referrals/users      // Top referrers list
```

### **Endpoint Specifications**

#### **GET /api/v1/referrals/my-code**
```javascript
// Response
{
  "success": true,
  "referralCode": "AMB123ABC",
  "referralLink": "https://automate.ly/r/AMB123ABC",
  "totalInvitesSent": 5,
  "successfulReferrals": 2,
  "totalRewardsEarned": 30.00
}
```

#### **POST /api/v1/referrals/send-invite**
```javascript
// Request
{
  "emails": ["friend@email.com", "colleague@company.com"],
  "personalMessage": "Check out this amazing tool!"
}

// Response  
{
  "success": true,
  "invitesSent": 2,
  "inviteCodes": ["INV123", "INV456"]
}
```

#### **GET /api/v1/referrals/statistics**
```javascript
// Response
{
  "success": true,
  "stats": {
    "totalInvitesSent": 10,
    "pendingInvites": 3,
    "acceptedInvites": 5,
    "expiredInvites": 2,
    "totalRewardsEarned": 5,
    "rewardsValue": 75.00,
    "conversionRate": 50.0
  }
}
```

## 🎨 **Frontend Integration**

### **Components Requiring Database Connection**

#### **ReferralSettings.js** (Currently showing red borders)
**Status Update**: All red borders → green borders

**Database Connections Needed**:
```javascript
// Replace mock data with API calls
const fetchReferralData = async () => {
  const response = await api.getReferralCode();
  setReferralCode(response.referralCode);
  setReferralLink(response.referralLink);
  setReferralStats(response.stats);
};

const handleSendInvites = async (emails) => {
  const response = await api.sendReferralInvites(emails);
  // Update UI with success/failure
};
```

#### **SubscriptionSettings.js** (Add referral posts display)
```javascript
// Add referral posts earned to usage display  
const fetchReferralRewards = async () => {
  const response = await api.getReferralRewards();
  setReferralPostsEarned(response.totalPosts);
};
```

## 📧 **External Service Integration**

### **Email Service** (SendGrid/Mailgun)
**Required for**: Referral invitation emails

**Implementation**:
```javascript
// backend/services/email.js
class EmailService {
  async sendReferralInvite(inviterName, inviterEmail, friendEmail, referralLink) {
    const template = {
      to: friendEmail,
      from: 'invites@automatemyblog.com',
      subject: `${inviterName} invited you to try Automate My Blog`,
      template: 'referral-invitation',
      data: {
        inviterName,
        referralLink,
        ctaUrl: referralLink
      }
    };
    
    return await this.sendEmail(template);
  }
}
```

## 🧪 **Test Scenarios**

### **Complete Workflow Testing**

#### **Test 1: Generate Referral Link**
1. Navigate to Settings → Referrals
2. Verify unique referral code displays
3. Verify referral link format: `automate.ly/r/{code}`
4. Test copy-to-clipboard functionality
5. Verify QR code generates correctly

#### **Test 2: Send Email Invitations**
1. Enter email addresses in invitation form
2. Click "Send Invitations" 
3. Verify emails are sent via email service
4. Check `user_invites` table for records
5. Verify expiration dates set correctly (30 days)

#### **Test 3: Process Referral Signup**
1. Friend clicks referral link
2. Complete signup process with referral code
3. Verify both users receive rewards
4. Check `referral_rewards` table updates
5. Verify activity tracking records events

#### **Test 4: View Referral Statistics**
1. Check referral dashboard shows correct stats
2. Verify invite status tracking (pending/accepted/expired)
3. Test conversion rate calculations
4. Verify reward balance displays correctly

### **Database Validation Tests**
```sql
-- Verify referral code generation
SELECT referral_code FROM users WHERE email = 'test@example.com';

-- Check invite tracking
SELECT * FROM user_invites WHERE inviter_user_id = ?;

-- Verify rewards granted
SELECT * FROM referral_rewards WHERE user_id = ?;

-- Check activity logging
SELECT * FROM user_activity_events WHERE event_type = 'referral_sent';
```

## 🛡️ **Rollback Plan**

### **Environment Control**
```javascript
// .env configuration
ENABLE_REFERRAL_SYSTEM=true    // Set to false for rollback
USE_EMAIL_SERVICE=true         // Set to false to disable emails
```

### **Fallback Behavior**
```javascript
// Graceful degradation
if (!process.env.ENABLE_REFERRAL_SYSTEM) {
  // Show "Coming Soon" message in Referrals tab
  // Keep existing localStorage simulation
  return <ReferralComingSoon />;
}
```

### **Quick Rollback Steps**
1. Set `ENABLE_REFERRAL_SYSTEM=false` in environment
2. Restart application servers
3. Verify Referrals tab shows "Coming Soon"
4. Existing users unaffected

## 📈 **Success Criteria**

### **Functional Requirements**
- [ ] Users can generate unique referral links
- [ ] Email invitations send successfully
- [ ] Referral signup process grants rewards to both users
- [ ] Referral statistics display accurately
- [ ] All database tables update correctly

### **Performance Requirements**
- [ ] Referral link generation < 200ms
- [ ] Email sending < 5 seconds
- [ ] Statistics loading < 500ms
- [ ] Database queries optimized with indexes

### **Business Goals**
- [ ] 20% of new signups from referrals within 30 days
- [ ] Average 3 invites sent per active user
- [ ] 40%+ referral link click-through rate
- [ ] 25%+ invite-to-signup conversion rate

## 🚀 **Implementation Checklist**

### **Phase 1: Database Connection (Day 1-2)**
- [ ] Install PostgreSQL client library
- [ ] Create database connection service
- [ ] Implement user referral code API endpoints
- [ ] Test referral code generation and retrieval

### **Phase 2: Basic Referral Functionality (Day 3-4)**  
- [ ] Connect ReferralSettings component to database
- [ ] Implement referral statistics API
- [ ] Update UI to show real data (change borders to green)
- [ ] Test complete referral link workflow

### **Phase 3: Email Integration (Day 5-6)**
- [ ] Set up email service (SendGrid/Mailgun)
- [ ] Create email templates for invitations
- [ ] Implement send invitation API endpoint
- [ ] Test email delivery and tracking

### **Phase 4: Reward Processing (Day 7)**
- [ ] Implement referral signup validation
- [ ] Create reward granting system
- [ ] Test complete referral reward workflow
- [ ] Validate all database operations

### **Phase 5: Testing & Deployment (Day 8)**
- [ ] Complete end-to-end testing
- [ ] Performance testing and optimization
- [ ] Deploy with feature flags
- [ ] Monitor and validate in production

---

**Next Steps**: Begin with Phase 1 - Database Connection setup and referral code API implementation.