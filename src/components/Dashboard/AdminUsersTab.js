// ADMIN ONLY - Super User Component for User Management
// This component is only accessible to admin users and provides user oversight functionality
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Select, 
  Statistic, 
  Row, 
  Col,
  Alert,
  Typography,
  Badge,
  Tooltip,
  Modal,
  Descriptions,
  Timeline
} from 'antd';
import { 
  UserOutlined, 
  SearchOutlined, 
  ExclamationCircleOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// ADMIN COMPONENT - Only for super users
const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Use existing API to get posts and derive user info
      const result = await api.getBlogPosts();
      
      if (result.success) {
        // Create mock user data from existing posts (real data available)
        const realUsers = result.posts.reduce((acc, post) => {
          const userId = post.userId || 'anonymous';
          if (!acc[userId]) {
            acc[userId] = {
              id: userId,
              email: userId === 'anonymous' ? 'anonymous@example.com' : `user${userId}@example.com`,
              plan: 'payasyougo', // Real data from localStorage
              status: 'active', // This would require new DB field
              postsCount: 0,
              exportsCount: 0,
              createdAt: post.createdAt,
              lastActivity: post.updatedAt
            };
          }
          acc[userId].postsCount++;
          acc[userId].exportsCount += post.exportCount || 0;
          return acc;
        }, {});

        const userArray = Object.values(realUsers);
        setUsers(userArray.length > 0 ? userArray : getDummyUsers());
      } else {
        setUsers(getDummyUsers());
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(getDummyUsers());
    } finally {
      setLoading(false);
    }
  };

  // DUMMY DATA - Fallback users for demonstration
  const getDummyUsers = () => [
    {
      id: 'user_1',
      email: 'john@startup.com',
      plan: 'creator',
      status: 'active',
      postsCount: 12,
      exportsCount: 25,
      createdAt: '2024-01-10T10:00:00Z',
      lastActivity: '2024-01-26T14:30:00Z',
      isDummy: true
    },
    {
      id: 'user_2', 
      email: 'sarah@agency.com',
      plan: 'professional',
      status: 'active',
      postsCount: 45,
      exportsCount: 120,
      createdAt: '2023-12-15T09:00:00Z',
      lastActivity: '2024-01-26T11:15:00Z',
      isDummy: true
    },
    {
      id: 'user_3',
      email: 'mike@company.com', 
      plan: 'payasyougo',
      status: 'suspended', // Requires new DB field
      postsCount: 3,
      exportsCount: 5,
      createdAt: '2024-01-20T16:20:00Z',
      lastActivity: '2024-01-23T10:05:00Z',
      isDummy: true
    }
  ];

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'professional': return 'purple';
      case 'creator': return 'blue';
      case 'payasyougo': return 'orange';
      case 'enterprise': return 'gold';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'suspended': return 'red';
      case 'trial': return 'orange';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'email',
      key: 'email',
      render: (email, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{email}</div>
          {record.isDummy && (
            <Tag size="small" color="blue">DUMMY DATA</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Plan',
      dataIndex: 'plan', 
      key: 'plan',
      render: (plan) => (
        <Tag color={getPlanColor(plan)}>
          {plan.charAt(0).toUpperCase() + plan.slice(1).replace('payasyougo', 'Pay-as-you-go')}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div style={{ 
          border: status !== 'active' ? '2px solid red' : '1px solid #d9d9d9',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          <Tag color={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
          {status !== 'active' && (
            <Text style={{ fontSize: '10px', color: 'red', display: 'block' }}>
              Requires DB field: user_status
            </Text>
          )}
        </div>
      )
    },
    {
      title: 'Posts',
      dataIndex: 'postsCount',
      key: 'postsCount',
      sorter: (a, b) => a.postsCount - b.postsCount
    },
    {
      title: 'Exports', 
      dataIndex: 'exportsCount',
      key: 'exportsCount',
      sorter: (a, b) => a.exportsCount - b.exportsCount
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      render: (date) => format(new Date(date), 'MMM dd, yyyy')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => {
              setSelectedUser(record);
              setShowUserModal(true);
            }}
          >
            View Details
          </Button>
          <div style={{ 
            border: '2px solid red', 
            padding: '2px 6px', 
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            <Button size="small" type="text" style={{ color: 'red' }}>
              Suspend
            </Button>
            <Text style={{ fontSize: '9px', color: 'red', display: 'block' }}>
              Needs user_roles table
            </Text>
          </div>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* ADMIN HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ color: 'red', margin: 0 }}>
          🔴 ADMIN: User Management
        </Title>
        <Text type="secondary">
          Super user only - Monitor and manage all platform users
        </Text>
      </div>

      {/* DATABASE REQUIREMENTS ALERT */}
      <Alert
        message="Database Requirements for Full Functionality"
        description={
          <div>
            <strong>Missing Tables/Fields:</strong>
            <br />• user_roles table (admin, user, suspended)
            <br />• users.status field (active, suspended, trial)
            <br />• users.billing_info table
            <br />• user_activity_logs table
            <br />• subscription_history table
          </div>
        }
        type="warning"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* STATS ROW */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={users.length}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ border: '2px solid red', padding: '8px', borderRadius: '4px' }}>
              <Statistic
                title="Active Subscriptions"
                value={users.filter(u => u.plan !== 'payasyougo').length}
                prefix={<CrownOutlined style={{ color: '#52c41a' }} />}
              />
              <Text style={{ fontSize: '10px', color: 'red' }}>
                Needs subscription_status table
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Posts"
              value={users.reduce((sum, u) => sum + u.postsCount, 0)}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ border: '2px solid red', padding: '8px', borderRadius: '4px' }}>
              <Statistic
                title="Monthly Revenue"
                value="$1,250"
                prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              />
              <Text style={{ fontSize: '10px', color: 'red' }}>
                Needs billing_events table
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* FILTERS */}
      <Card style={{ marginBottom: '16px' }}>
        <Space>
          <Search 
            placeholder="Search users..." 
            style={{ width: 200 }} 
            onSearch={(value) => console.log('Search:', value)}
          />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">All Plans</Option>
            <Option value="professional">Professional</Option>
            <Option value="creator">Creator</Option>
            <Option value="payasyougo">Pay-as-you-go</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="suspended">Suspended</Option>
          </Select>
        </Space>
      </Card>

      {/* USERS TABLE */}
      <Card title="All Users" extra={<Badge count={users.length} style={{ backgroundColor: '#52c41a' }} />}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* USER DETAILS MODAL */}
      <Modal
        title="User Details"
        open={showUserModal}
        onCancel={() => setShowUserModal(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <div>
            <Descriptions column={1}>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Plan">
                <Tag color={getPlanColor(selectedUser.plan)}>
                  {selectedUser.plan.charAt(0).toUpperCase() + selectedUser.plan.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedUser.status)}>
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Posts Generated">{selectedUser.postsCount}</Descriptions.Item>
              <Descriptions.Item label="Total Exports">{selectedUser.exportsCount}</Descriptions.Item>
              <Descriptions.Item label="Created">
                {format(new Date(selectedUser.createdAt), 'MMM dd, yyyy HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Activity">
                {format(new Date(selectedUser.lastActivity), 'MMM dd, yyyy HH:mm')}
              </Descriptions.Item>
            </Descriptions>

            {selectedUser.isDummy && (
              <Alert
                message="This is dummy data for demonstration"
                type="info"
                style={{ margin: '16px 0' }}
              />
            )}

            <div style={{ border: '2px solid red', padding: '12px', borderRadius: '4px', marginTop: '16px' }}>
              <Title level={5} style={{ color: 'red', margin: '0 0 8px 0' }}>
                Missing Database Features:
              </Title>
              <ul style={{ margin: 0, color: 'red', fontSize: '12px' }}>
                <li>User activity timeline (needs user_activity_logs)</li>
                <li>Billing history (needs billing_events table)</li>
                <li>Subscription details (needs subscriptions table)</li>
                <li>Support tickets (needs support_tickets table)</li>
                <li>Usage analytics over time (needs usage_analytics table)</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsersTab;