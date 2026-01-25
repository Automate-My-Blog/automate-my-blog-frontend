import React from 'react';
import { Card, List, Tag, Alert, Statistic, Row, Col } from 'antd';
import { FunnelPlotOutlined, WarningOutlined } from '@ant-design/icons';

const FunnelSectionPanel = ({ funnelData, loading }) => {
  if (!funnelData) return null;

  const { title, insights = [], atRiskCount, potentialChurnCost, priority } = funnelData;

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FunnelPlotOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <span>{title}</span>
          {priority === 'monitor' && (
            <Tag color="orange">REQUIRES MONITORING</Tag>
          )}
        </div>
      }
      loading={loading}
      style={{ marginTop: 16 }}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Statistic
            title="At-Risk Users"
            value={atRiskCount || 0}
            prefix={atRiskCount > 5 ? <WarningOutlined style={{ color: '#faad14' }} /> : null}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Potential Monthly Churn Cost"
            value={potentialChurnCost || 0}
            prefix="$"
            suffix="/mo"
          />
        </Col>
      </Row>

      {insights.length === 0 ? (
        <Alert
          message="Funnel is healthy"
          description="No immediate funnel or retention issues detected. Continue monitoring user activation rates."
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
                      <strong style={{ color: '#52c41a' }}>📈 Expected Result:</strong><br />
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

export default FunnelSectionPanel;
