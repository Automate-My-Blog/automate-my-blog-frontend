import React, { useState } from 'react';
import { Card, Button, Empty, Row, Col, Typography, Tag, Statistic, message } from 'antd';
import { PlusOutlined, UserOutlined, TeamOutlined, BulbOutlined } from '@ant-design/icons';
import { useTabMode } from '../../hooks/useTabMode';
import ModeToggle, { WorkflowGuidance } from '../Workflow/ModeToggle';

const { Title, Text, Paragraph } = Typography;

// Sample audience segments for demo
const sampleSegments = [
  {
    id: 'working-parents',
    name: 'Working Parents',
    description: 'Career-focused parents aged 25-40 seeking work-life balance',
    size: 850,
    characteristics: ['Time-constrained', 'Tech-savvy', 'Quality-focused'],
    painPoints: ['Limited time', 'Childcare challenges', 'Career advancement'],
    color: '#1890ff'
  },
  {
    id: 'remote-professionals',
    name: 'Remote Professionals',
    description: 'Distributed team members optimizing home productivity',
    size: 1200,
    characteristics: ['Location-independent', 'Self-motivated', 'Tool-oriented'],
    painPoints: ['Isolation', 'Productivity', 'Communication'],
    color: '#52c41a'
  },
  {
    id: 'startup-founders',
    name: 'Startup Founders',
    description: 'Early-stage entrepreneurs building their first company',
    size: 400,
    characteristics: ['Risk-tolerant', 'Fast-paced', 'Resource-conscious'],
    painPoints: ['Funding', 'Team building', 'Product-market fit'],
    color: '#fa8c16'
  }
];

const AudienceSegmentsTab = () => {
  const tabMode = useTabMode('audience-segments');
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [segments, setSegments] = useState(sampleSegments);
  // Handle segment selection in workflow mode
  const handleSelectSegment = (segment) => {
    setSelectedSegment(segment);
    if (tabMode.mode === 'workflow') {
      message.success(`Selected audience: ${segment.name}`);
    }
  };

  // Prepare step data for workflow progression
  const prepareStepData = () => {
    if (!selectedSegment) return null;
    return {
      selectedAudience: selectedSegment.name,
      audienceSize: selectedSegment.size,
      timestamp: new Date().toISOString()
    };
  };

  return (
    <div>
      {/* Mode Toggle */}
      <ModeToggle
        mode={tabMode.mode}
        tabKey="audience-segments"
        workflowStep={tabMode.workflowStep}
        showModeToggle={tabMode.showModeToggle}
        showWorkflowNavigation={tabMode.showWorkflowNavigation}
        showNextButton={tabMode.showNextButton && selectedSegment}
        showPreviousButton={tabMode.showPreviousButton}
        nextButtonText={tabMode.nextButtonText}
        previousButtonText={tabMode.previousButtonText}
        canEnterWorkflow={tabMode.canEnterWorkflow}
        onEnterWorkflowMode={tabMode.enterWorkflowMode}
        onExitToFocusMode={tabMode.exitToFocusMode}
        onContinueToNextStep={tabMode.continueToNextStep}
        onGoToPreviousStep={tabMode.goToPreviousStep}
        onSaveStepData={tabMode.saveStepData}
        stepData={prepareStepData()}
      />
      
      {/* Workflow Guidance */}
      {tabMode.mode === 'workflow' && (
        <div style={{ padding: '16px 24px 0' }}>
          <WorkflowGuidance
            step={2}
            totalSteps={4}
            stepTitle="Select Your Target Audience"
            stepDescription="Choose the audience segment you want to create content for. You can create a new segment if needed."
          />
        </div>
      )}
      
      <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ marginBottom: '8px' }}>
                <TeamOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                Audience Segments
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                Define and manage your target audience segments based on customer strategies. 
                Create content that resonates with specific customer groups and their unique needs.
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Segments"
              value={segments.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Reach"
              value={segments.reduce((sum, s) => sum + s.size, 0)}
              suffix="prospects"
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Selected"
              value={selectedSegment ? 1 : 0}
              prefix={<BulbOutlined />}
              valueStyle={{ color: selectedSegment ? '#1890ff' : '#666' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card 
        title={tabMode.mode === 'workflow' ? 'Select Target Audience' : 'Customer Audience Segments'} 
        extra={
          !tabMode.mode === 'workflow' && (
            <Button type="primary" icon={<PlusOutlined />}>
              Create New Segment
            </Button>
          )
        }
      >
        {/* Segment Cards */}
        <Row gutter={[16, 16]}>
          {segments.map((segment) => (
            <Col xs={24} md={12} lg={8} key={segment.id}>
              <Card
                hoverable
                className={selectedSegment?.id === segment.id ? 'selected-segment' : ''}
                onClick={() => handleSelectSegment(segment)}
                style={{
                  border: selectedSegment?.id === segment.id ? `2px solid ${segment.color}` : '1px solid #d9d9d9',
                  cursor: 'pointer',
                  height: '200px'
                }}
                bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: segment.color,
                        borderRadius: '50%',
                        marginRight: '8px'
                      }}
                    />
                    <Title level={4} style={{ margin: 0 }}>{segment.name}</Title>
                    {selectedSegment?.id === segment.id && (
                      <Tag color={segment.color} style={{ marginLeft: 'auto' }}>Selected</Tag>
                    )}
                  </div>
                  
                  <Paragraph style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                    {segment.description}
                  </Paragraph>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong style={{ fontSize: '12px', color: '#999' }}>REACH: </Text>
                    <Text style={{ fontSize: '12px', fontWeight: 500 }}>{segment.size.toLocaleString()} prospects</Text>
                  </div>
                  
                  <div>
                    {segment.characteristics.slice(0, 2).map((char, idx) => (
                      <Tag key={idx} size="small" style={{ fontSize: '10px', marginBottom: '4px' }}>
                        {char}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
          
          {/* Create New Segment Card */}
          {tabMode.mode !== 'workflow' && (
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                style={{ 
                  height: '200px', 
                  border: '2px dashed #d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                bodyStyle={{ textAlign: 'center', padding: '24px' }}
              >
                <PlusOutlined style={{ fontSize: '32px', color: '#d9d9d9', marginBottom: '12px' }} />
                <Title level={4} style={{ color: '#666' }}>Create New Segment</Title>
                <Text style={{ color: '#999' }}>Define a custom audience</Text>
              </Card>
            </Col>
          )}
        </Row>
      </Card>

      {/* Help Section */}
      <Card title="Getting Started" style={{ marginTop: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <BulbOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px' }} />
              <Title level={4}>1. Analyze Your Website</Title>
              <Text style={{ color: '#666' }}>
                Use the Create New Post workflow to analyze your website and discover customer segments
              </Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <UserOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
              <Title level={4}>2. Define Segments</Title>
              <Text style={{ color: '#666' }}>
                Create detailed profiles for each customer segment including demographics and pain points
              </Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <TeamOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '12px' }} />
              <Title level={4}>3. Create Content</Title>
              <Text style={{ color: '#666' }}>
                Generate targeted content that speaks directly to each audience segment's needs
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
      </div>
    </div>
  );
};

export default AudienceSegmentsTab;