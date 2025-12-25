import React, { useState } from 'react';
import { Card, Button, Typography, Input, Form, Steps } from 'antd';
import { GlobalOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NewPostTab = () => {
  // For now, start with a fresh workflow state in dashboard mode
  const [currentStep, setCurrentStep] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState('');

  const steps = [
    { title: 'Website Analysis', icon: <SearchOutlined />, description: 'Analyzing your business and target audience' },
    { title: 'Content Strategy', icon: <EditOutlined />, description: 'Selecting the perfect content approach' },
    { title: 'Topic Selection', icon: <EditOutlined />, description: 'Choosing trending topics for your audience' },
    { title: 'Content Creation', icon: <EditOutlined />, description: 'AI is writing your personalized blog post' },
    { title: 'Content Editing', icon: <EditOutlined />, description: 'Review and customize your blog post' },
    { title: 'Export & Publish', icon: <EditOutlined />, description: 'Download and publish your content' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <Title level={2} style={{ margin: 0 }}>Create New Blog Post</Title>
        <Text style={{ color: '#666' }}>
          Generate AI-powered blog posts tailored to your audience and brand
        </Text>
      </div>

      {/* Progress Steps */}
      <Steps
        current={currentStep}
        items={steps.map((step, index) => ({
          ...step,
          status: index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait'
        }))}
        style={{ marginBottom: '40px' }}
      />

      {/* Step 0 - Website Analysis */}
      {currentStep === 0 && (
        <Card>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Title level={3}>Analyze Your Website</Title>
            <Text style={{ display: 'block', marginBottom: '24px', color: '#666' }}>
              Enter your website URL so we can analyze your business and create relevant content recommendations.
            </Text>
            
            <Form layout="vertical">
              <Form.Item
                help="Example: mystore.com, myblog.org, mycompany.net"
                style={{ marginBottom: '24px' }}
              >
                <Input
                  size="large"
                  placeholder="Enter your website URL"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  prefix={<GlobalOutlined />}
                  style={{ textAlign: 'center' }}
                />
              </Form.Item>
              
              <Button 
                type="primary" 
                size="large"
                onClick={() => setCurrentStep(1)}
                disabled={!websiteUrl.trim()}
                style={{ minWidth: '200px' }}
              >
                Analyze Website
              </Button>
            </Form>
          </div>
        </Card>
      )}

      {/* Step 1+ - Placeholder for now */}
      {currentStep > 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Title level={3}>Workflow in Progress</Title>
            <Text style={{ display: 'block', marginBottom: '24px', color: '#666' }}>
              You're at step {currentStep + 1} of the blog creation process.
              This will contain the full workflow implementation.
            </Text>
            <Button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              style={{ marginRight: '12px' }}
            >
              Previous Step
            </Button>
            <Button 
              type="primary"
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            >
              Next Step (Demo)
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NewPostTab;