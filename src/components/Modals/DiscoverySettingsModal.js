import React, { useState } from 'react';
import { 
  Modal, 
  Button, 
  Form, 
  Radio, 
  Checkbox, 
  Space, 
  Typography, 
  Divider,
  Row,
  Col,
  InputNumber,
  Alert
} from 'antd';
import { 
  SettingOutlined, 
  SearchOutlined, 
  ClockCircleOutlined,
  RiseOutlined,
  UserOutlined,
  GlobalOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

/**
 * DiscoverySettingsModal component
 * Configure automated discovery preferences and frequency
 */
const DiscoverySettingsModal = ({ 
  open, 
  settings,
  onClose, 
  onSave
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // DUMMY DATA - Focus area options
  const focusAreaOptions = [
    {
      value: 'keywords',
      label: 'Trending Keywords',
      description: 'Monitor search volume trends and emerging keywords in your industry',
      icon: <RiseOutlined style={{ color: '#1890ff' }} />
    },
    {
      value: 'customer-segments',
      label: 'Customer Segments',
      description: 'Identify new customer segments and audience opportunities',
      icon: <UserOutlined style={{ color: '#52c41a' }} />
    },
    {
      value: 'industry-news',
      label: 'Industry News',
      description: 'Track relevant industry news and regulatory changes',
      icon: <GlobalOutlined style={{ color: '#fa8c16' }} />
    },
    {
      value: 'competitor-analysis',
      label: 'Competitor Analysis',
      description: 'Monitor competitor content and identify content gaps',
      icon: <EyeOutlined style={{ color: '#722ed1' }} />
    },
    {
      value: 'social-trends',
      label: 'Social Media Trends',
      description: 'Track viral topics and social media conversations',
      icon: <SearchOutlined style={{ color: '#eb2f96' }} />
    }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    
    // DUMMY DATA - Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedSettings = {
      ...settings,
      frequency: values.frequency,
      focusAreas: values.focusAreas || [],
      notificationsEnabled: values.notificationsEnabled || false,
      maxDiscoveriesPerRun: values.maxDiscoveriesPerRun || 5,
      confidenceThreshold: values.confidenceThreshold || 70
    };
    
    onSave(updatedSettings);
    setLoading(false);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingOutlined style={{ color: '#1890ff' }} />
          <span>Discovery Settings</span>
        </div>
      }
      width={700}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        <Alert
          message="Configuration Demo"
          description="These settings control how the automated discovery system finds new content opportunities. All data is stored locally for demonstration."
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            frequency: settings?.frequency || 'weekly',
            focusAreas: settings?.focusAreas || ['keywords', 'customer-segments'],
            notificationsEnabled: settings?.notificationsEnabled !== false,
            maxDiscoveriesPerRun: settings?.maxDiscoveriesPerRun || 5,
            confidenceThreshold: settings?.confidenceThreshold || 70
          }}
        >
          {/* Discovery Frequency */}
          <Form.Item
            label={
              <span>
                <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Discovery Frequency
              </span>
            }
            name="frequency"
            extra="How often should the system run automated discovery?"
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="daily">
                  <strong>Daily</strong> - Run discovery every day (recommended for fast-moving industries)
                </Radio>
                <Radio value="weekly">
                  <strong>Weekly</strong> - Run discovery every week (balanced approach)
                </Radio>
                <Radio value="monthly">
                  <strong>Monthly</strong> - Run discovery monthly (for stable industries)
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Divider />

          {/* Focus Areas */}
          <Form.Item
            label={
              <span>
                <SearchOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Focus Areas
              </span>
            }
            name="focusAreas"
            extra="Select which types of opportunities to monitor (choose 2-4 for best results)"
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                {focusAreaOptions.map(option => (
                  <Col key={option.value} xs={24} md={12}>
                    <Checkbox 
                      value={option.value}
                      style={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '12px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        margin: 0
                      }}
                    >
                      <div style={{ marginLeft: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          {option.icon}
                          <Text strong>{option.label}</Text>
                        </div>
                        <Text style={{ fontSize: '12px', color: '#666' }}>
                          {option.description}
                        </Text>
                      </div>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Divider />

          {/* Advanced Settings */}
          <Title level={5}>Advanced Settings</Title>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Max Discoveries per Run"
                name="maxDiscoveriesPerRun"
                extra="Limit discoveries to prevent information overload"
              >
                <InputNumber
                  min={1}
                  max={20}
                  style={{ width: '100%' }}
                  addonAfter="discoveries"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Confidence Threshold"
                name="confidenceThreshold"
                extra="Minimum confidence level for discoveries"
              >
                <InputNumber
                  min={50}
                  max={95}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Notifications */}
          <Form.Item name="notificationsEnabled" valuePropName="checked">
            <Checkbox>
              <span>
                <span style={{ marginLeft: '8px' }}>
                  📧 Send email notifications when new opportunities are found
                </span>
              </span>
            </Checkbox>
          </Form.Item>

          <Divider />

          {/* Information Panel */}
          <div style={{
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <Title level={5} style={{ color: '#389e0d', margin: '0 0 8px 0' }}>
              🎯 How Discovery Works
            </Title>
            <Paragraph style={{ fontSize: '14px', color: '#333', margin: 0 }}>
              The automated discovery system analyzes trends, monitors competitor content, 
              tracks industry news, and identifies emerging customer segments. When opportunities 
              are found, you can instantly generate targeted content or create new marketing strategies.
            </Paragraph>
          </div>

          {/* Action Buttons */}
          <Form.Item style={{ margin: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SettingOutlined />}
              >
                Save Settings
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default DiscoverySettingsModal;