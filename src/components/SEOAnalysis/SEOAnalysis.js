import React, { useState } from 'react';
import { Card, Collapse, Progress, Tag, Divider, Row, Col, Typography, Alert, List, Tooltip, Button, Space } from 'antd';
import { 
  CheckOutlined, 
  WarningOutlined, 
  InfoCircleOutlined, 
  TrophyOutlined,
  EditOutlined,
  EyeOutlined,
  BulbOutlined,
  RocketOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import ComprehensiveAnalysis from './ComprehensiveAnalysis';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

/**
 * SEO Analysis Component
 * Displays comprehensive SEO metadata and content quality metrics
 */
const SEOAnalysis = ({ 
  seoAnalysis, 
  contentQuality, 
  strategicElements, 
  improvementSuggestions = [], 
  keywordOptimization,
  content, // Add content prop for comprehensive analysis
  context = {}, // Add context prop
  postId = null, // Add postId prop
  style = {},
  collapsed = false 
}) => {
  const [activePanel, setActivePanel] = useState(collapsed ? [] : ['seo', 'quality']);
  const [showComprehensive, setShowComprehensive] = useState(false);

  if (!seoAnalysis && !contentQuality && !content) {
    return null;
  }

  // If user wants comprehensive analysis and we have content
  if (showComprehensive && content && content.length >= 200) {
    return (
      <div style={style}>
        {/* Toggle Button */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                <RocketOutlined style={{ color: '#1890ff' }} /> SEO Analysis
              </Title>
              <Text type="secondary">Choose your analysis level</Text>
            </div>
            <Space>
              <Button 
                type={!showComprehensive ? 'primary' : 'default'}
                onClick={() => setShowComprehensive(false)}
                icon={<EyeOutlined />}
              >
                Basic Analysis
              </Button>
              <Button 
                type={showComprehensive ? 'primary' : 'default'}
                onClick={() => setShowComprehensive(true)}
                icon={<ThunderboltOutlined />}
              >
                Comprehensive Analysis
              </Button>
            </Space>
          </div>
        </Card>

        <ComprehensiveAnalysis
          content={content}
          context={context}
          postId={postId}
          onAnalysisComplete={(analysis) => {
            console.log('📊 Comprehensive analysis completed:', analysis);
          }}
        />
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getKeywordStatus = (status) => {
    const statusMap = {
      'Optimal': { color: 'success', icon: <CheckOutlined /> },
      'Missing': { color: 'error', icon: <WarningOutlined /> },
      'Overused': { color: 'warning', icon: <InfoCircleOutlined /> }
    };
    return statusMap[status] || { color: 'default', icon: null };
  };

  return (
    <div style={style}>
      {/* Toggle Header - show if we have content for comprehensive analysis */}
      {content && content.length >= 200 && (
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                <RocketOutlined style={{ color: '#1890ff' }} /> SEO Analysis
              </Title>
              <Text type="secondary">Choose your analysis level</Text>
            </div>
            <Space>
              <Button 
                type={!showComprehensive ? 'primary' : 'default'}
                onClick={() => setShowComprehensive(false)}
                icon={<EyeOutlined />}
              >
                Basic Analysis
              </Button>
              <Button 
                type={showComprehensive ? 'primary' : 'default'}
                onClick={() => setShowComprehensive(true)}
                icon={<ThunderboltOutlined />}
              >
                Comprehensive Analysis
              </Button>
            </Space>
          </div>
        </Card>
      )}

      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrophyOutlined style={{ color: '#1890ff' }} />
            <span>Content Analysis & SEO Report</span>
          </div>
        }
        style={{ marginBottom: '20px' }}
      >
      <Collapse 
        activeKey={activePanel}
        onChange={setActivePanel}
        ghost
      >
        {/* SEO Analysis Panel */}
        {seoAnalysis && (
          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EyeOutlined style={{ color: '#52c41a' }} />
                <span style={{ fontWeight: 500 }}>SEO Analysis</span>
                <Tag color={seoAnalysis.readabilityScore >= 70 ? 'success' : 'warning'}>
                  Readability: {seoAnalysis.readabilityScore}
                </Tag>
                {seoAnalysis.aiAnalysisComplete && (
                  <Tag color="blue">AI Enhanced</Tag>
                )}
              </div>
            } 
            key="seo"
          >
            {/* AI-Powered SEO Explanation */}
            {seoAnalysis.aiExplanation && (
              <Alert
                message="🎯 Why Your Content Will Rank Well"
                description={seoAnalysis.aiExplanation}
                type="success"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}

            {seoAnalysis.whyItRanks && (
              <Alert
                message="🚀 SEO Ranking Potential"
                description={seoAnalysis.whyItRanks}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}

            <Row gutter={[16, 16]}>
              {/* Word Count & Structure */}
              <Col xs={24} md={12}>
                <Card size="small" title="Content Metrics">
                  <div style={{ marginBottom: '12px' }}>
                    <Text strong>Word Count: </Text>
                    <Text>{seoAnalysis.wordCount} words</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Progress 
                        percent={Math.min(100, (seoAnalysis.wordCount / 1000) * 100)}
                        size="small"
                        status={seoAnalysis.wordCount >= 800 ? 'success' : 'active'}
                        format={() => `${seoAnalysis.wordCount >= 800 ? 'Good' : 'Expand'}`}
                      />
                      {seoAnalysis.wordCount >= 800 ? (
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          ✓ Google favors comprehensive content like yours!
                        </Text>
                      ) : (
                        <Text style={{ fontSize: '11px', color: '#faad14' }}>
                          💡 Consider expanding to 800+ words for better ranking
                        </Text>
                      )}
                    </div>
                  </div>

                  {seoAnalysis.headingStructure && (
                    <div>
                      <Text strong>Heading Structure: </Text>
                      <Tag color={seoAnalysis.headingStructure.hierarchy === 'Good' ? 'success' : 'warning'}>
                        {seoAnalysis.headingStructure.hierarchy}
                      </Tag>
                      <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                        H2: {seoAnalysis.headingStructure.h2}, H3: {seoAnalysis.headingStructure.h3}
                      </div>
                      {seoAnalysis.headingStructure.h2 > 0 && (
                        <Text style={{ fontSize: '11px', color: '#52c41a', display: 'block', marginTop: '4px' }}>
                          ✓ Great structure! Headings help Google understand your content hierarchy
                        </Text>
                      )}
                    </div>
                  )}
                </Card>
              </Col>

              {/* Keywords Analysis */}
              {seoAnalysis.keywordDensity && Object.keys(seoAnalysis.keywordDensity).length > 0 && (
                <Col xs={24} md={12}>
                  <Card size="small" title="Keyword Density">
                    {Object.entries(seoAnalysis.keywordDensity).map(([keyword, data]) => {
                      const statusInfo = getKeywordStatus(data.status);
                      return (
                        <div key={keyword} style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: '13px' }}>{keyword}</Text>
                            <Tag color={statusInfo.color} size="small">
                              {statusInfo.icon} {data.status}
                            </Tag>
                          </div>
                          <Text style={{ fontSize: '12px', color: '#666' }}>
                            {data.count} times ({data.density}%)
                          </Text>
                        </div>
                      );
                    })}
                  </Card>
                </Col>
              )}

              {/* Meta Description */}
              {seoAnalysis.metaDescription && (
                <Col span={24}>
                  <Card size="small" title="Meta Description Preview">
                    <div style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: '4px',
                      fontSize: '13px',
                      lineHeight: '1.4'
                    }}>
                      {seoAnalysis.metaDescription}
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                      Length: {seoAnalysis.metaDescription.length}/155 characters
                    </div>
                  </Card>
                </Col>
              )}
            </Row>
          </Panel>
        )}

        {/* Content Quality Panel */}
        {contentQuality && (
          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EditOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontWeight: 500 }}>Content Quality</span>
                <Tag color={getScoreColor(contentQuality.overallScore)}>
                  {contentQuality.overallScore}/100
                </Tag>
                {contentQuality.aiAnalysisComplete && (
                  <Tag color="blue">AI Enhanced</Tag>
                )}
              </div>
            } 
            key="quality"
          >
            {/* AI-Powered Content Quality Explanation */}
            {contentQuality.aiExplanation && (
              <Alert
                message="✨ What Makes Your Content Engaging"
                description={contentQuality.aiExplanation}
                type="success"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Overall Quality Score">
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Progress
                      type="circle"
                      percent={contentQuality.overallScore}
                      strokeColor={getScoreColor(contentQuality.overallScore)}
                      size={80}
                    />
                    <div style={{ marginTop: '8px', fontWeight: 500 }}>
                      {getScoreStatus(contentQuality.overallScore)}
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card size="small" title="Quality Breakdown">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { label: 'Structure', score: contentQuality.structureScore },
                      { label: 'Engagement', score: contentQuality.engagementScore },
                      { label: 'Clarity', score: contentQuality.clarityScore },
                      { label: 'Actionability', score: contentQuality.actionabilityScore }
                    ].map((item) => (
                      <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <Text style={{ fontSize: '12px' }}>{item.label}</Text>
                          <Text style={{ fontSize: '12px', fontWeight: 500 }}>{item.score}%</Text>
                        </div>
                        <Progress 
                          percent={item.score} 
                          size="small" 
                          strokeColor={getScoreColor(item.score)}
                          showInfo={false}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </Panel>
        )}

        {/* Strategic Elements Panel */}
        {strategicElements && (
          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BulbOutlined style={{ color: '#52c41a' }} />
                <span style={{ fontWeight: 500 }}>Strategic Elements</span>
                <Tag color={strategicElements.ctaPresence ? 'success' : 'warning'}>
                  CTA: {strategicElements.ctaPresence ? 'Present' : 'Missing'}
                </Tag>
                {strategicElements.aiAnalysisComplete && (
                  <Tag color="blue">AI Enhanced</Tag>
                )}
              </div>
            } 
            key="strategic"
          >
            {/* AI-Powered Strategic Elements Explanation */}
            {strategicElements.aiExplanation && (
              <Alert
                message="🎯 Strategic Elements Found"
                description={strategicElements.aiExplanation}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" title="Call-to-Actions">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {strategicElements.ctaPresence ? (
                      <Tag color="success" icon={<CheckOutlined />}>Present</Tag>
                    ) : (
                      <Tag color="warning" icon={<WarningOutlined />}>Missing</Tag>
                    )}
                  </div>
                </Card>
              </Col>

              {strategicElements.credibilitySignals && strategicElements.credibilitySignals.length > 0 && (
                <Col xs={24} md={8}>
                  <Card size="small" title="Credibility Signals">
                    {strategicElements.credibilitySignals.map((signal, index) => (
                      <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                        {signal}
                      </Tag>
                    ))}
                  </Card>
                </Col>
              )}

              {strategicElements.emotionalHooks && strategicElements.emotionalHooks.length > 0 && (
                <Col xs={24} md={8}>
                  <Card size="small" title="Emotional Hooks">
                    {strategicElements.emotionalHooks.map((hook, index) => (
                      <Tag key={index} color="purple" style={{ marginBottom: '4px' }}>
                        {hook}
                      </Tag>
                    ))}
                  </Card>
                </Col>
              )}
            </Row>
          </Panel>
        )}

        {/* Improvements Panel */}
        {improvementSuggestions && improvementSuggestions.length > 0 && (
          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BulbOutlined style={{ color: '#faad14' }} />
                <span style={{ fontWeight: 500 }}>Improvement Suggestions</span>
                <Tag color="processing">{improvementSuggestions.length} tips</Tag>
              </div>
            } 
            key="improvements"
          >
            <List
              size="small"
              dataSource={improvementSuggestions}
              renderItem={(suggestion, index) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ 
                      minWidth: '20px', 
                      height: '20px', 
                      backgroundColor: '#1890ff', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginTop: '2px'
                    }}>
                      <Text style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                        {index + 1}
                      </Text>
                    </div>
                    <Text style={{ flex: 1, lineHeight: '1.5' }}>{suggestion}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Panel>
        )}
      </Collapse>
    </Card>
    </div>
  );
};

export default SEOAnalysis;