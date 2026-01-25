import React from 'react';
import { Card, List, Tag, Alert, Statistic, Row, Col } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const RevenueSectionPanel = ({ revenueData, loading }) => {
  if (!revenueData) return null;

  const { title, insights = [], potentialMRRIncrease, userCount, priority } = revenueData;

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
          <span>{title}</span>
          {priority === 'immediate_action_required' && (
            <Tag color="red">ACTION REQUIRED</Tag>
          )}
        </div>
      }
      loading={loading}
      style={{ marginTop: 16 }}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Statistic
            title="Potential MRR Increase"
            value={potentialMRRIncrease || 0}
            prefix="$"
            suffix="/mo"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Revenue Opportunity Users"
            value={userCount || 0}
          />
        </Col>
      </Row>

      {insights.length === 0 ? (
        <Alert
          message="No immediate revenue opportunities"
          description="All revenue opportunities have been addressed or there are no users in the pipeline."
          type="success"
          showIcon
        />
      ) : (
        <List
          dataSource={insights}
          renderItem={(insight, index) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div>
                    <Tag color={insight.priority === 'High' ? 'red' : 'orange'}>
                      {insight.priority}
                    </Tag>
                    <strong>#{index + 1}: {insight.title}</strong>
                  </div>
                }
                description={
                  <div style={{ marginTop: 8 }}>
                    <p>
                      <strong style={{ color: '#722ed1' }}>👤 User/Segment:</strong><br />
                      {insight.userSegment}
                    </p>
                    <p>
                      <strong style={{ color: '#1890ff' }}>📌 Action:</strong><br />
                      {insight.action}
                    </p>
                    <p>
                      <strong style={{ color: '#52c41a' }}>💰 Expected Result:</strong><br />
                      {insight.expectedResult}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default RevenueSectionPanel;
