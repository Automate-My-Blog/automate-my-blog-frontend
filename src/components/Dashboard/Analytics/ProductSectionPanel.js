import React from 'react';
import { Card, List, Tag, Alert, Statistic, Row, Col } from 'antd';
import { BulbOutlined, TeamOutlined } from '@ant-design/icons';

const ProductSectionPanel = ({ productData, loading }) => {
  if (!productData) return null;

  const { title, insights = [], impactedUserCount, priority } = productData;

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BulbOutlined style={{ fontSize: 24, color: '#faad14' }} />
          <span>{title}</span>
          {priority === 'backlog' && (
            <Tag color="blue">PRODUCT BACKLOG</Tag>
          )}
        </div>
      }
      loading={loading}
      style={{ marginTop: 16 }}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Statistic
            title="Product Improvement Ideas"
            value={insights.length}
            prefix={<BulbOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Potentially Impacted Users"
            value={impactedUserCount || 0}
            prefix={<TeamOutlined />}
          />
        </Col>
      </Row>

      {insights.length === 0 ? (
        <Alert
          message="No product improvements needed"
          description="Current product adoption and feature usage are healthy. Continue monitoring engagement metrics."
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
                    <Tag color={insight.priority === 'Medium' ? 'orange' : 'blue'}>
                      {insight.priority}
                    </Tag>
                    <strong>#{index + 1}: {insight.title}</strong>
                  </div>
                }
                description={
                  <div style={{ marginTop: 8 }}>
                    <p>
                      <strong style={{ color: '#722ed1' }}>👥 User/Segment:</strong><br />
                      {insight.userSegment}
                    </p>
                    <p>
                      <strong style={{ color: '#1890ff' }}>🛠️ Action:</strong><br />
                      {insight.action}
                    </p>
                    <p>
                      <strong style={{ color: '#52c41a' }}>📊 Expected Result:</strong><br />
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

export default ProductSectionPanel;
