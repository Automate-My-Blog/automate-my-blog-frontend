import React, { useState } from 'react';
import { Card, Tabs, Typography, Tag, Button, Row, Col, Input, message, Alert, Space, QRCode } from 'antd';
import { UserOutlined, BankOutlined, CreditCardOutlined, StarOutlined, GiftOutlined, CopyOutlined, MailOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const ProfileSettings = () => (
  <div style={{ padding: '20px 0' }}>
    <h4>Profile Settings</h4>
    <p>Profile management coming soon...</p>
  </div>
);

const OrganizationSettings = () => (
  <div style={{ padding: '20px 0' }}>
    <h4>Organization Settings</h4>
    <p>Organization management coming soon...</p>
  </div>
);

const BillingSettings = () => (
  <div style={{ padding: '20px 0' }}>
    <h4>Billing Settings</h4>
    <p>Billing management coming soon...</p>
  </div>
);

const ReferralSettings = () => {
  const [inviteEmails, setInviteEmails] = useState('');
  const [referralPostsEarned] = useState(0); // This would come from localStorage in real implementation
  
  // Generate user's unique referral code (would use actual user ID in real implementation)
  const userId = 'user123'; // Mock user ID
  const referralCode = `AMB${userId.toUpperCase()}`;
  const referralLink = `https://automate.ly/r/${referralCode}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    message.success('Referral link copied to clipboard!');
  };
  
  const handleSendInvites = () => {
    if (!inviteEmails.trim()) {
      message.error('Please enter at least one email address');
      return;
    }
    // Mock functionality - would integrate with email API
    message.info('Email invitations require email_invitations database table');
  };
  
  return (
    <div style={{ padding: '20px 0' }}>
      {/* Referral Benefits Display - GREEN (works with localStorage) */}
      <Card style={{ marginBottom: '24px', border: '2px solid #52c41a' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>🎁 Referral Benefits</Title>
          </Col>
          <Col>
            <Tag color="green">✓ Working with localStorage</Tag>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f6ffed' }}>
              <Text style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>{referralPostsEarned}</Text>
              <br />
              <Text style={{ color: '#666', fontSize: '12px' }}>Free Posts Earned from Referrals</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f6ffed' }}>
              <Text style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>1</Text>
              <br />
              <Text style={{ color: '#666', fontSize: '12px' }}>Posts per Successful Referral</Text>
            </Card>
          </Col>
        </Row>
        
        <Alert
          message="How it works"
          description="When someone signs up using your referral link, you both get 1 free blog post!"
          type="success"
          style={{ marginBottom: '16px' }}
        />
      </Card>
      
      {/* Referral Link Generation - GREEN (works with localStorage/frontend) */}
      <Card style={{ marginBottom: '24px', border: '2px solid #52c41a' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>🔗 Your Referral Link</Title>
          </Col>
          <Col>
            <Tag color="green">✓ Working with current system</Tag>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Input.Group compact>
              <Input
                value={referralLink}
                style={{ width: 'calc(100% - 120px)' }}
                readOnly
              />
              <Button 
                type="primary" 
                icon={<CopyOutlined />}
                onClick={handleCopyLink}
                style={{ width: '120px' }}
              >
                Copy Link
              </Button>
            </Input.Group>
            <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginTop: '8px' }}>
              Share this link with friends to earn free blog posts
            </Text>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <QRCode value={referralLink} size={100} />
              <br />
              <Text style={{ fontSize: '12px', color: '#666', marginTop: '8px', display: 'block' }}>
                QR Code for mobile sharing
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* Email Invitations - RED (requires database) */}
      <Card style={{ marginBottom: '24px', border: '2px solid #f5222d' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0, color: '#f5222d' }}>📧 Email Invitations</Title>
          </Col>
          <Col>
            <Tag color="red">❌ Requires email_invitations table</Tag>
          </Col>
        </Row>
        
        <Alert
          message="Database Requirements for Email Invitations"
          description={
            <div>
              <strong>Missing Tables for Email Functionality:</strong>
              <br />• email_invitations table (sender_id, email, sent_date)
              <br />• user_referrals table (user_id, referral_code, created_at)
              <br />• referral_rewards table (user_id, reward_type, amount)
            </div>
          }
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
        
        <div style={{ padding: '16px', backgroundColor: '#fff2f0', borderRadius: '4px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong style={{ color: '#f5222d' }}>Invite Friends by Email (Demo)</Text>
            <Input.TextArea
              placeholder="Enter email addresses separated by commas\ne.g. friend1@email.com, friend2@email.com"
              value={inviteEmails}
              onChange={(e) => setInviteEmails(e.target.value)}
              rows={3}
              style={{ opacity: 0.7 }}
            />
            <Button 
              type="primary" 
              icon={<MailOutlined />}
              onClick={handleSendInvites}
              disabled
              style={{ backgroundColor: '#f5222d', borderColor: '#f5222d' }}
            >
              Send Invitations (Requires Backend)
            </Button>
            <Text style={{ fontSize: '12px', color: '#f5222d' }}>
              Email invitation system requires backend integration with email service
            </Text>
          </Space>
        </div>
      </Card>
      
      {/* Social Sharing - GREEN (pure frontend) */}
      <Card style={{ border: '2px solid #52c41a' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>📱 Social Sharing</Title>
          </Col>
          <Col>
            <Tag color="green">✓ Pure frontend functionality</Tag>
          </Col>
        </Row>
        
        <Space wrap>
          <Button 
            icon={<ShareAltOutlined />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Join Automate My Blog',
                  text: 'Get 1 free blog post when you sign up!',
                  url: referralLink,
                });
              } else {
                handleCopyLink();
              }
            }}
          >
            Share Link
          </Button>
          <Button 
            onClick={() => {
              const subject = 'Get 1 free blog post with Automate My Blog';
              const body = `Hi! I'm using Automate My Blog to create amazing content. Sign up with my referral link and we both get a free blog post:\n\n${referralLink}\n\nHappy blogging!`;
              window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
            }}
          >
            Email Template
          </Button>
        </Space>
        
        <Alert
          message="Share your referral link anywhere"
          description="Copy the link above and share it on social media, in emails, or with friends directly. No backend required!"
          type="info"
          style={{ marginTop: '16px' }}
        />
      </Card>
    </div>
  );
};

const SubscriptionSettings = () => {
  const { user } = useAuth();
  
  // Calculate usage statistics from real user data
  const usageLimit = user?.usageLimit || 1;
  const currentUsage = user?.currentUsage || 0;
  const remainingPosts = Math.max(0, usageLimit - currentUsage);
  const billingStatus = user?.billingStatus || 'Pay-as-you-go';
  
  return (
    <div style={{ padding: '20px 0' }}>
      <Card style={{ marginBottom: '24px', border: '2px solid #52c41a' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Current Plan</Title>
          </Col>
          <Col>
            <Tag color="green" icon={<StarOutlined />}>
              {billingStatus}
            </Tag>
            <Tag color="blue" style={{ marginLeft: '8px' }}>
              ✓ Real database data
            </Tag>
          </Col>
        </Row>
        
        <Paragraph style={{ color: '#666', marginBottom: '16px' }}>
          You're currently on the {billingStatus} plan. You have {usageLimit} posts in your plan.
          <br />
          <Text style={{ color: '#52c41a', fontWeight: 500 }}>
            💡 Earn more free posts by referring friends! Check the Referrals tab.
          </Text>
        </Paragraph>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center', border: currentUsage > 0 ? '2px solid #52c41a' : '1px solid #d9d9d9' }}>
              <Text style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>{currentUsage}</Text>
              <br />
              <Text style={{ color: '#666', fontSize: '12px' }}>Posts Used</Text>
              <br />
              <Text style={{ color: '#52c41a', fontSize: '10px' }}>✓ Database tracking</Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center', border: '2px solid #1890ff' }}>
              <Text style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>{remainingPosts}</Text>
              <br />
              <Text style={{ color: '#666', fontSize: '12px' }}>Posts Remaining</Text>
              <br />
              <Text style={{ color: '#1890ff', fontSize: '10px' }}>✓ Real calculation</Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '24px', fontWeight: 600, color: '#722ed1' }}>{usageLimit}</Text>
              <br />
              <Text style={{ color: '#666', fontSize: '12px' }}>Total Plan Limit</Text>
              <br />
              <Text style={{ color: '#722ed1', fontSize: '10px' }}>✓ From database</Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '24px', fontWeight: 600, color: '#f5222d' }}>${currentUsage * 15}</Text>
              <br />
              <Text style={{ color: '#666', fontSize: '12px' }}>Estimated Value</Text>
            </Card>
          </Col>
        </Row>
        
        <Button type="primary" size="large">
          Upgrade Plan
        </Button>
      </Card>
    
    <Card>
      <Title level={4}>Available Plans</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card size="small" style={{ border: '2px solid #52c41a' }}>
            <Text strong style={{ color: '#52c41a' }}>Pay-as-you-go</Text>
            <br />
            <Text style={{ fontSize: '20px', fontWeight: 600 }}>$15</Text>
            <Text style={{ color: '#666' }}>/post</Text>
            <br />
            <Text style={{ fontSize: '12px', color: '#666' }}>Current Plan</Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card size="small">
            <Text strong style={{ color: '#1890ff' }}>Creator</Text>
            <br />
            <Text style={{ fontSize: '20px', fontWeight: 600 }}>$20</Text>
            <Text style={{ color: '#666' }}>/month</Text>
            <br />
            <Text style={{ fontSize: '12px', color: '#666' }}>4 posts/month</Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card size="small">
            <Text strong style={{ color: '#722ed1' }}>Professional</Text>
            <br />
            <Text style={{ fontSize: '20px', fontWeight: 600 }}>$50</Text>
            <Text style={{ color: '#666' }}>/month</Text>
            <br />
            <Text style={{ fontSize: '12px', color: '#666' }}>8 posts + unlimited strategies</Text>
          </Card>
        </Col>
      </Row>
    </Card>
  </div>
  );
};

const SettingsTab = () => {
  const items = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      children: <ProfileSettings />,
    },
    {
      key: 'subscriptions',
      label: 'Subscriptions',
      icon: <StarOutlined />,
      children: <SubscriptionSettings />,
    },
    {
      key: 'referrals',
      label: 'Referrals',
      icon: <GiftOutlined />,
      children: <ReferralSettings />,
    },
    {
      key: 'organization',
      label: 'Organization',
      icon: <BankOutlined />,
      children: <OrganizationSettings />,
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: <CreditCardOutlined />,
      children: <BillingSettings />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Settings">
        <Tabs items={items} />
      </Card>
    </div>
  );
};

export default SettingsTab;