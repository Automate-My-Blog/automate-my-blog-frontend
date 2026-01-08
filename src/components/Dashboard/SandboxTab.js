import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, Tag, Dropdown, Space, Switch, Divider, Input, Select, Row, Col, Typography, message, Alert } from 'antd';
import { 
  SearchOutlined,
  RobotOutlined,
  PlayCircleOutlined,
  RiseOutlined,
  UserOutlined,
  GlobalOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

// DUMMY DATA - Content Discovery automation settings
const dummyAutomationSettings = {
  enabled: true,
  frequency: 'weekly',
  focusAreas: ['keywords', 'customer-segments', 'industry-news'],
  lastRun: '2024-01-10T14:30:00Z',
  nextRun: '2024-01-17T14:30:00Z',
  successfulRuns: 12,
  failedRuns: 1,
  isDummy: true
};

// DUMMY DATA - Recent discovery results
const dummyDiscoveries = [
  {
    id: 'dummy_discovery_1',
    type: 'keyword',
    title: 'AI productivity tools',
    description: 'Trending keyword with 40% search volume increase over last 30 days',
    impact: 'High potential for traffic growth',
    date: '2024-01-10T00:00:00Z',
    confidence: 85,
    actionTaken: false,
    isDummy: true
  },
  {
    id: 'dummy_discovery_2',
    type: 'customer-segment',
    title: 'Remote team managers',
    description: 'New customer segment identified through social media analysis',
    impact: 'Untapped audience with high conversion potential',
    date: '2024-01-09T00:00:00Z',
    confidence: 92,
    actionTaken: true,
    isDummy: true
  },
  {
    id: 'dummy_discovery_3',
    type: 'industry-news',
    title: 'New AI regulations announced',
    description: 'Government announces new AI compliance requirements affecting businesses',
    impact: 'Content opportunity for compliance-focused content',
    date: '2024-01-08T00:00:00Z',
    confidence: 78,
    actionTaken: false,
    isDummy: true
  },
  {
    id: 'dummy_discovery_4',
    type: 'competitor',
    title: 'Competitor launches new feature',
    description: 'Major competitor released similar automation tools',
    impact: 'Differentiation opportunity in marketing messaging',
    date: '2024-01-07T00:00:00Z',
    confidence: 88,
    actionTaken: false,
    isDummy: true
  }
];

const SandboxTab = () => {
  const { user, isSuperAdmin } = useAuth();
  const [automationSettings, setAutomationSettings] = useState(dummyAutomationSettings);
  const [discoveries, setDiscoveries] = useState(dummyDiscoveries);
  const [selectedDiscoveryType, setSelectedDiscoveryType] = useState('all');
  
  // Check if user has access to sandbox features
  const hasAccess = isSuperAdmin;
  
  // Content Discovery helper functions
  const getDiscoveryIcon = (type) => {
    switch (type) {
      case 'keyword': return <RiseOutlined style={{ color: '#1890ff' }} />;
      case 'customer-segment': return <UserOutlined style={{ color: '#52c41a' }} />;
      case 'industry-news': return <GlobalOutlined style={{ color: '#fa8c16' }} />;
      case 'competitor': return <SearchOutlined style={{ color: '#722ed1' }} />;
      default: return <RobotOutlined style={{ color: '#666' }} />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'green';
    if (confidence >= 60) return 'orange';
    return 'red';
  };

  const handleGenerateContent = (discovery) => {
    message.info(`Content generation for "${discovery.title}" would be integrated with OpenAI API here`);
  };

  const handleMarkActionTaken = (discoveryId) => {
    setDiscoveries(discoveries.map(d => 
      d.id === discoveryId ? { ...d, actionTaken: !d.actionTaken } : d
    ));
    message.success('Discovery status updated');
  };

  const handleToggleAutomation = () => {
    setAutomationSettings({
      ...automationSettings,
      enabled: !automationSettings.enabled
    });
    message.success(`Content discovery ${automationSettings.enabled ? 'disabled' : 'enabled'}`);
  };

  const handleRunDiscovery = () => {
    message.success('Discovery process started! This would integrate with multiple AI services.');
  };

  // Filter discoveries based on selected type
  const filteredDiscoveries = selectedDiscoveryType === 'all' 
    ? discoveries 
    : discoveries.filter(d => d.type === selectedDiscoveryType);

  // Access control
  if (!hasAccess) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Empty
            description={
              <div>
                <Title level={4}>Sandbox Access Required</Title>
                <Text type="secondary">
                  This tab contains experimental features and is only available to super administrators.
                </Text>
              </div>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <RobotOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
          Sandbox
        </Title>
        <Text type="secondary">
          Experimental features for super administrators. These features are in development and may use placeholder data.
        </Text>
      </div>

      {/* Sandbox Warning */}
      <Alert
        message="🧪 Experimental Environment"
        description="These features are in active development. Data shown may be simulated and APIs may not be fully integrated."
        type="warning"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Content Discovery Section */}
      <Card 
        title={
          <Space>
            <SearchOutlined style={{ color: '#1890ff' }} />
            Content Discovery Automation
            <Tag color="purple">EXPERIMENTAL</Tag>
          </Space>
        }
        extra={
          <Button 
            type="link" 
            size="small"
            icon={<SettingOutlined />}
            onClick={() => message.info('Advanced discovery settings would open here')}
          >
            Configure
          </Button>
        }
      >
        {/* Automation Status */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Automation Status</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Tag color={automationSettings.enabled ? 'green' : 'default'}>
                      {automationSettings.enabled ? 'Active' : 'Paused'}
                    </Tag>
                  </div>
                </div>
                <Switch 
                  checked={automationSettings.enabled}
                  onChange={handleToggleAutomation}
                />
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f0f8ff', 
              border: '1px solid #d6e7ff',
              borderRadius: '8px'
            }}>
              <Text strong>Discovery Stats</Text>
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                <div>Successful runs: {automationSettings.successfulRuns}</div>
                <div>Failed runs: {automationSettings.failedRuns}</div>
                <div>Next run: {new Date(automationSettings.nextRun).toLocaleDateString()}</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Discovery Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <Select
              value={selectedDiscoveryType}
              onChange={setSelectedDiscoveryType}
              style={{ width: '100%' }}
              placeholder="Filter by discovery type"
            >
              <Select.Option value="all">All Types</Select.Option>
              <Select.Option value="keyword">Keywords</Select.Option>
              <Select.Option value="customer-segment">Customer Segments</Select.Option>
              <Select.Option value="industry-news">Industry News</Select.Option>
              <Select.Option value="competitor">Competitors</Select.Option>
            </Select>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleRunDiscovery}
              style={{ width: '100%' }}
            >
              Run Manual Discovery
            </Button>
          </Col>
        </Row>

        <Divider />

        {/* Recent Discoveries */}
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ fontSize: '16px' }}>Recent Discoveries</Text>
          <Text style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
            ({filteredDiscoveries.length} results)
          </Text>
        </div>

        {filteredDiscoveries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <SearchOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <div>
              <Text type="secondary">No discoveries found</Text>
              <div style={{ marginTop: '8px' }}>
                <Button type="link" onClick={handleRunDiscovery}>
                  Run discovery to find new opportunities
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {filteredDiscoveries.map((discovery) => (
              <div
                key={discovery.id}
                style={{ 
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor: discovery.actionTaken ? '#f6ffed' : '#fafafa'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                    <div style={{ marginRight: '16px', marginTop: '4px' }}>
                      {getDiscoveryIcon(discovery.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Space>
                          <span style={{ fontSize: '16px', fontWeight: 500 }}>
                            {discovery.title}
                          </span>
                          <Tag size="small" color={getConfidenceColor(discovery.confidence)}>
                            {discovery.confidence}% confidence
                          </Tag>
                          <Tag size="small" color="blue">
                            {discovery.type.replace('-', ' ')}
                          </Tag>
                          {discovery.actionTaken && (
                            <Tag size="small" color="green">
                              Action Taken
                            </Tag>
                          )}
                        </Space>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Text style={{ fontSize: '14px', color: '#666' }}>
                          {discovery.description}
                        </Text>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                          💡 {discovery.impact}
                        </Text>
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        Discovered: {new Date(discovery.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleGenerateContent(discovery)}
                    >
                      Generate Content
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleMarkActionTaken(discovery.id)}
                    >
                      {discovery.actionTaken ? 'Mark Pending' : 'Mark Done'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Future Features Preview */}
        <Divider />
        
        <div style={{ 
          padding: '16px',
          backgroundColor: '#f0f2ff',
          border: '1px solid #d6e3ff',
          borderRadius: '8px'
        }}>
          <Text strong style={{ color: '#1d39c4' }}>🚀 Coming Soon</Text>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#4f4f4f' }}>
            <ul style={{ marginBottom: 0, paddingLeft: '16px' }}>
              <li>Integration with OpenAI API for content generation</li>
              <li>Real-time web scraping for trend discovery</li>
              <li>Social media sentiment analysis</li>
              <li>Competitor content gap analysis</li>
              <li>Automated content calendar suggestions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SandboxTab;