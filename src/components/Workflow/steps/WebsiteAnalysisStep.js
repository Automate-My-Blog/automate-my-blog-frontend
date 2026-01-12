import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Typography, Input, Form, Space, Tag, Divider, Statistic } from 'antd';
import { GlobalOutlined, ScanOutlined, LoginOutlined, UserAddOutlined, BookOutlined, AimOutlined, LinkOutlined, BarChartOutlined } from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import autoBlogAPI from '../../../services/api';

const { Title, Text, Paragraph } = Typography;

const WebsiteAnalysisStep = ({
  currentStep,
  setCurrentStep,
  websiteUrl,
  setWebsiteUrl,
  isLoading,
  scanningMessage,
  analysisCompleted,
  user,
  requireAuth,
  setNavContext
}) => {
  const { currentOrganization } = useAuth();
  const [comprehensiveResults, setComprehensiveResults] = useState(null);
  const [blogContent, setBlogContent] = useState([]);
  const [ctaAnalysis, setCtaAnalysis] = useState([]);
  const [linkingAnalysis, setLinkingAnalysis] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // EXTRACTED FROM APP.JS: Website URL handler
  const handleWebsiteSubmit = async () => {
    if (websiteUrl.trim()) {
      setCurrentStep(1);
      
      // Trigger comprehensive analysis if user is authenticated
      if (user && currentOrganization) {
        try {
          await autoBlogAPI.discoverWebsiteContent(websiteUrl);
        } catch (error) {
          console.error('Failed to trigger comprehensive analysis:', error);
        }
      }
    }
  };

  // Load comprehensive analysis results when analysis is complete
  useEffect(() => {
    if (analysisCompleted && user && currentOrganization) {
      loadComprehensiveResults();
    }
  }, [analysisCompleted, user, currentOrganization]);

  const loadComprehensiveResults = async () => {
    if (!currentOrganization?.id) return;
    
    setLoadingResults(true);
    try {
      // Load all Phase 1A analysis results
      const [blogData, ctaData, linkData, comprehensiveData] = await Promise.allSettled([
        autoBlogAPI.getBlogContent(currentOrganization.id),
        autoBlogAPI.getCTAAnalysis(currentOrganization.id),
        autoBlogAPI.getInternalLinkingAnalysis(currentOrganization.id),
        autoBlogAPI.getComprehensiveAnalysis(currentOrganization.id)
      ]);

      if (blogData.status === 'fulfilled') {
        setBlogContent(blogData.value.contentPieces || []);
      }
      if (ctaData.status === 'fulfilled') {
        setCtaAnalysis(ctaData.value.ctas || []);
      }
      if (linkData.status === 'fulfilled') {
        setLinkingAnalysis(linkData.value.internalLinks || []);
      }
      if (comprehensiveData.status === 'fulfilled') {
        setComprehensiveResults(comprehensiveData.value);
      }
    } catch (error) {
      console.error('Failed to load comprehensive results:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  // EXTRACTED FROM APP.JS: Continue to strategy handler
  const continueToStrategy = () => {
    if (!requireAuth('Continue to strategy selection', 'gate')) {
      return;
    }
    setCurrentStep(2);
  };

  // EXTRACTED FROM APP.JS: Go to dashboard handler
  const goToDashboard = () => {
    if (user) {
      setNavContext('workflow-transition');
    }
  };

  return (
    <>
      {/* EXTRACTED FROM APP.JS: Step 0 - Website URL Input */}
      {currentStep === 0 && (
        <Card>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <ScanOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={2} style={{ margin: '0 0 8px 0' }}>
                Let's analyze your website
              </Title>
              <Text style={{ color: '#666', fontSize: '16px' }}>
                We'll scan your site to understand your business and create personalized blog content
              </Text>
            </div>
            
            <Form layout="vertical" onFinish={handleWebsiteSubmit}>
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
                  onPressEnter={handleWebsiteSubmit}
                />
              </Form.Item>
              
              <Button 
                type="primary" 
                size="large"
                htmlType="submit"
                disabled={!websiteUrl.trim()}
                style={{ minWidth: '200px' }}
              >
                Analyze Website
              </Button>
            </Form>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                ✓ Comprehensive blog discovery  ✓ CTA effectiveness analysis  ✓ Internal linking insights  ✓ Content pattern analysis
              </Text>
            </div>
          </div>
        </Card>
      )}

      {/* EXTRACTED FROM APP.JS: Step 1 - Website Analysis in Progress */}
      {currentStep === 1 && !analysisCompleted && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <ScanOutlined 
              style={{ 
                fontSize: '64px', 
                color: '#1890ff', 
                marginBottom: '24px',
                animation: 'pulse 2s infinite'
              }} 
            />
            
            <Title level={2} style={{ marginBottom: '16px' }}>
              Analyzing Your Website
            </Title>
            
            <div style={{ marginBottom: '32px' }}>
              <Text style={{ fontSize: '16px', color: '#666', display: 'block', marginBottom: '16px' }}>
                {scanningMessage}
              </Text>
            </div>

            <div style={{ 
              background: 'linear-gradient(90deg, #1890ff 0%, #40a9ff 50%, #69c0ff 100%)', 
              height: '4px', 
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '30%',
                height: '100%',
                background: 'rgba(255,255,255,0.8)',
                animation: 'loading 2s ease-in-out infinite'
              }} />
            </div>

            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                🔍 Reading content  •  🎨 Analyzing design  •  👥 Understanding audience  •  📊 Research insights
              </Text>
            </div>
          </div>
        </Card>
      )}

      {/* EXTRACTED FROM APP.JS: Step 1 - Analysis Complete */}
      {currentStep === 1 && analysisCompleted && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#52c41a', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px auto'
            }}>
              <span style={{ fontSize: '32px', color: 'white' }}>✓</span>
            </div>
            
            <Title level={2} style={{ color: '#52c41a', marginBottom: '16px' }}>
              Website Analysis Complete!
            </Title>
            
            <Paragraph style={{ fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px auto' }}>
              We've completed a comprehensive analysis of your website, including blog discovery, CTA analysis, and content patterns. 
              Ready to create targeted content for your audience?
            </Paragraph>

            {/* Phase 1A: Comprehensive Analysis Results */}
            {user && currentOrganization && (
              <div style={{ marginBottom: '32px' }}>
                <Row gutter={16} justify="center" style={{ marginBottom: '24px' }}>
                  <Col xs={12} sm={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic
                        title="Blog Posts Found"
                        value={blogContent.length}
                        prefix={<BookOutlined style={{ color: '#52c41a' }} />}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic
                        title="CTAs Analyzed"
                        value={ctaAnalysis.length}
                        prefix={<AimOutlined style={{ color: '#1890ff' }} />}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic
                        title="Internal Links"
                        value={linkingAnalysis.length}
                        prefix={<LinkOutlined style={{ color: '#722ed1' }} />}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic
                        title="Analysis Quality"
                        value={comprehensiveResults?.analysisQuality || 85}
                        suffix="%"
                        prefix={<BarChartOutlined style={{ color: '#fa8c16' }} />}
                      />
                    </Card>
                  </Col>
                </Row>

                {comprehensiveResults && (
                  <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                    <Divider orientation="left">
                      <Text strong>Key Insights Discovered</Text>
                    </Divider>
                    
                    {comprehensiveResults.contentPatterns && (
                      <div style={{ marginBottom: '16px' }}>
                        <Text strong style={{ color: '#52c41a' }}>Content Patterns:</Text>
                        <br />
                        <Text style={{ fontSize: '14px' }}>
                          {comprehensiveResults.contentPatterns.tone || 'Professional'} tone with focus on {comprehensiveResults.contentPatterns.topics?.join(', ') || 'industry expertise'}
                        </Text>
                      </div>
                    )}
                    
                    {comprehensiveResults.ctaStrategy && (
                      <div style={{ marginBottom: '16px' }}>
                        <Text strong style={{ color: '#1890ff' }}>CTA Strategy:</Text>
                        <br />
                        <Text style={{ fontSize: '14px' }}>
                          {comprehensiveResults.ctaStrategy.primaryGoal || 'Lead generation'} with {comprehensiveResults.ctaStrategy.placement || 'strategic'} placement
                        </Text>
                      </div>
                    )}
                    
                    {comprehensiveResults.linkingStrategy && (
                      <div style={{ marginBottom: '16px' }}>
                        <Text strong style={{ color: '#722ed1' }}>Linking Strategy:</Text>
                        <br />
                        <Text style={{ fontSize: '14px' }}>
                          {comprehensiveResults.linkingStrategy.structure || 'Hub and spoke'} structure with focus on {comprehensiveResults.linkingStrategy.focus || 'product pages'}
                        </Text>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {user ? (
                <Row gutter={16} justify="center">
                  <Col>
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={continueToStrategy}
                      style={{ minWidth: '200px' }}
                    >
                      Continue to Strategy
                    </Button>
                  </Col>
                  <Col>
                    <Button 
                      size="large"
                      onClick={goToDashboard}
                    >
                      Go to Dashboard
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Row gutter={16} justify="center">
                  <Col>
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={continueToStrategy}
                      style={{ minWidth: '200px' }}
                      icon={<LoginOutlined />}
                    >
                      Continue with Account
                    </Button>
                  </Col>
                </Row>
              )}

              <div style={{ marginTop: '24px' }}>
                <Tag color="green">Blog Content Discovered</Tag>
                <Tag color="blue">CTA Strategy Analyzed</Tag>
                <Tag color="purple">Linking Patterns Mapped</Tag>
                <Tag color="orange">Content Strategy Ready</Tag>
              </div>
            </Space>
          </div>
        </Card>
      )}
    </>
  );
};

export default WebsiteAnalysisStep;