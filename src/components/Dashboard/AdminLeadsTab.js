import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Statistic, 
  Row, 
  Col, 
  Select, 
  Input, 
  Button, 
  Tag, 
  Modal, 
  Descriptions, 
  Timeline, 
  Space,
  DatePicker,
  Progress,
  Typography,
  message,
  Drawer,
  Form,
  Radio,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
  DownloadOutlined,
  TrophyOutlined,
  UserOutlined,
  GlobalOutlined,
  CalendarOutlined,
  LineChartOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import autoBlogAPI from '../../services/api';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminLeadsTab = () => {
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    dateRange: 'month',
    search: '',
    minScore: 0,
    maxScore: 100,
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });

  // UI State
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Lead status update
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusForm] = Form.useForm();

  // Only render if user is super admin
  if (!isSuperAdmin) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={4}>Access Denied</Title>
          <Text>This feature is only available to super administrators.</Text>
        </div>
      </Card>
    );
  }

  useEffect(() => {
    loadLeads();
    loadAnalytics();
  }, [filters, pagination.current, pagination.pageSize]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const options = {
        ...filters,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      };

      const result = await autoBlogAPI.getLeads(options);
      setLeads(result.leads || []);
      setPagination(prev => ({
        ...prev,
        total: result.pagination?.total || 0
      }));
    } catch (error) {
      message.error('Failed to load leads: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const analyticsData = await autoBlogAPI.getLeadAnalytics(filters.dateRange);
      setAnalytics(analyticsData);
    } catch (error) {
      message.error('Failed to load analytics: ' + error.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  };

  const handleTableChange = (paginationData, tableFilters, sorter) => {
    setPagination(paginationData);
    
    if (sorter.field) {
      setFilters(prev => ({
        ...prev,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'ascend' ? 'ASC' : 'DESC'
      }));
    }
  };

  const showLeadDetailsModal = async (lead) => {
    try {
      const leadDetails = await autoBlogAPI.getLeadDetails(lead.id);
      setSelectedLead(leadDetails);
      setShowLeadDetails(true);
    } catch (error) {
      message.error('Failed to load lead details: ' + error.message);
    }
  };

  const handleStatusUpdate = async (values) => {
    try {
      await autoBlogAPI.updateLeadStatus(editingStatus.id, values.status, values.notes);
      message.success('Lead status updated successfully');
      setEditingStatus(null);
      statusForm.resetFields();
      loadLeads(); // Refresh the table
    } catch (error) {
      message.error('Failed to update lead status: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'blue',
      'qualified': 'green',
      'nurturing': 'orange',
      'converted': 'purple',
      'lost': 'red'
    };
    return colors[status] || 'default';
  };

  const getSourceColor = (source) => {
    const colors = {
      'website_analysis': 'cyan',
      'organic_search': 'green',
      'referral': 'purple',
      'direct': 'blue',
      'social': 'magenta'
    };
    return colors[source] || 'default';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a'; // Green
    if (score >= 60) return '#faad14'; // Orange  
    if (score >= 40) return '#fa8c16'; // Light red
    return '#ff4d4f'; // Red
  };

  const columns = [
    {
      title: 'Business',
      dataIndex: 'businessName',
      key: 'businessName',
      render: (name, record) => (
        <div>
          <Text strong style={{ display: 'block' }}>{name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <GlobalOutlined /> {new URL(record.websiteUrl).hostname}
          </Text>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
      render: (industry) => (
        <Tag style={{ margin: 0 }}>{industry || 'Unknown'}</Tag>
      ),
      width: 120
    },
    {
      title: 'Lead Score',
      dataIndex: 'leadScore',
      key: 'leadScore',
      render: (score) => (
        <div style={{ textAlign: 'center' }}>
          <Text strong style={{ color: getScoreColor(score) }}>
            {score}
          </Text>
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={getScoreColor(score)}
            showInfo={false}
            style={{ width: '60px', marginTop: '4px' }}
          />
        </div>
      ),
      sorter: true,
      width: 100
    },
    {
      title: 'Source',
      dataIndex: 'leadSource',
      key: 'leadSource',
      render: (source) => (
        <Tag color={getSourceColor(source)} style={{ margin: 0 }}>
          {source.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      width: 130
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div>
          <Tag color={getStatusColor(status)} style={{ margin: 0 }}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
          {record.isConverted && (
            <div style={{ marginTop: '4px' }}>
              <Tag color="success" size="small">
                <TrophyOutlined /> CONVERTED
              </Tag>
            </div>
          )}
        </div>
      ),
      width: 120
    },
    {
      title: 'Funnel Progress',
      key: 'funnelProgress',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: '12px', color: '#666' }}>
            {record.daysInFunnel} days
          </Text>
          <div style={{ marginTop: '4px' }}>
            <Text style={{ fontSize: '10px', color: '#999' }}>
              {record.conversionStepsCount} steps
            </Text>
          </div>
        </div>
      ),
      width: 100
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Text style={{ fontSize: '12px' }}>
          {moment(date).format('MMM DD')}
          <br />
          <Text type="secondary" style={{ fontSize: '10px' }}>
            {moment(date).fromNow()}
          </Text>
        </Text>
      ),
      sorter: true,
      width: 80
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => showLeadDetailsModal(record)}
            />
          </Tooltip>
          <Tooltip title="Update Status">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => {
                setEditingStatus(record);
                statusForm.setFieldsValue({ 
                  status: record.status,
                  notes: ''
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
      width: 100
    }
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Analytics Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card loading={loadingAnalytics}>
            <Statistic
              title="Total Leads"
              value={analytics?.overview?.totalLeads || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card loading={loadingAnalytics}>
            <Statistic
              title="Conversion Rate"
              value={analytics?.overview?.conversionRate || 0}
              precision={1}
              suffix="%"
              valueStyle={{ color: analytics?.overview?.conversionRate > 5 ? '#52c41a' : '#fa8c16' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card loading={loadingAnalytics}>
            <Statistic
              title="Avg Lead Score"
              value={analytics?.overview?.averageLeadScore || 0}
              precision={1}
              prefix={<StarOutlined />}
              valueStyle={{ color: getScoreColor(analytics?.overview?.averageLeadScore || 0) }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card loading={loadingAnalytics}>
            <Statistic
              title="High Quality Leads"
              value={analytics?.overview?.highQualityLeads || 0}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Controls */}
      <Card size="small" style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Search
              placeholder="Search leads..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onSearch={() => loadLeads()}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: '100%' }}
            >
              <Option value="all">All Status</Option>
              <Option value="new">New</Option>
              <Option value="qualified">Qualified</Option>
              <Option value="nurturing">Nurturing</Option>
              <Option value="converted">Converted</Option>
              <Option value="lost">Lost</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Source"
              value={filters.source}
              onChange={(value) => handleFilterChange('source', value)}
              style={{ width: '100%' }}
            >
              <Option value="all">All Sources</Option>
              <Option value="website_analysis">Website Analysis</Option>
              <Option value="organic_search">Organic Search</Option>
              <Option value="referral">Referral</Option>
              <Option value="direct">Direct</Option>
              <Option value="social">Social Media</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Date Range"
              value={filters.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              style={{ width: '100%' }}
            >
              <Option value="today">Today</Option>
              <Option value="week">This Week</Option>
              <Option value="month">This Month</Option>
              <Option value="quarter">This Quarter</Option>
              <Option value="all">All Time</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6}>
            <Space>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(true)}
              >
                Advanced
              </Button>
              <Button 
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => message.info('Export functionality coming soon')}
              >
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Leads Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={leads}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leads`,
            pageSizeOptions: ['10', '25', '50', '100']
          }}
          onChange={handleTableChange}
          rowKey="id"
          size="small"
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Lead Details Modal */}
      <Modal
        title={
          <div>
            <GlobalOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Lead Details
          </div>
        }
        open={showLeadDetails}
        onCancel={() => setShowLeadDetails(false)}
        footer={null}
        width={800}
      >
        {selectedLead && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Business Name">
                    {selectedLead.businessName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Website">
                    <a href={selectedLead.websiteUrl} target="_blank" rel="noopener noreferrer">
                      {selectedLead.websiteUrl}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Industry">
                    {selectedLead.industry || 'Unknown'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Company Size">
                    {selectedLead.estimatedCompanySize || 'Unknown'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lead Source">
                    <Tag color={getSourceColor(selectedLead.leadSource)}>
                      {selectedLead.leadSourceDisplay}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {moment(selectedLead.createdAt).format('MMMM DD, YYYY [at] HH:mm')}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Lead Score"
                    value={selectedLead.leadScore}
                    valueStyle={{ color: getScoreColor(selectedLead.leadScore) }}
                  />
                  <Progress 
                    percent={selectedLead.leadScore} 
                    strokeColor={getScoreColor(selectedLead.leadScore)}
                    style={{ marginTop: '8px' }}
                  />
                  <div style={{ marginTop: '16px' }}>
                    <Tag color={getStatusColor(selectedLead.status)}>
                      {selectedLead.statusDisplay}
                    </Tag>
                    {selectedLead.isConverted && (
                      <div style={{ marginTop: '8px' }}>
                        <Tag color="success">
                          <TrophyOutlined /> Converted
                        </Tag>
                        <div style={{ marginTop: '8px', fontSize: '12px' }}>
                          <Text type="secondary">
                            {moment(selectedLead.convertedAt).format('MMM DD, YYYY')}
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Conversion Timeline */}
            {selectedLead.conversionSteps && selectedLead.conversionSteps.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <Title level={5}>Activity Timeline</Title>
                <Timeline>
                  {selectedLead.conversionSteps.map((step, index) => (
                    <Timeline.Item 
                      key={index}
                      color={step.step === 'website_analysis' ? 'blue' : step.step === 'registration' ? 'green' : 'gray'}
                    >
                      <div>
                        <Text strong>{step.step.replace('_', ' ').toUpperCase()}</Text>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                          {moment(step.completedAt).format('MMM DD, YYYY [at] HH:mm')}
                        </div>
                        {step.data && (
                          <div style={{ marginTop: '4px' }}>
                            <Text style={{ fontSize: '12px' }}>
                              {typeof step.data === 'string' ? step.data : JSON.stringify(step.data, null, 2)}
                            </Text>
                          </div>
                        )}
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        title="Update Lead Status"
        open={!!editingStatus}
        onCancel={() => {
          setEditingStatus(null);
          statusForm.resetFields();
        }}
        onOk={() => statusForm.submit()}
        confirmLoading={loading}
      >
        <Form
          form={statusForm}
          layout="vertical"
          onFinish={handleStatusUpdate}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Radio.Group>
              <Radio value="new">New</Radio>
              <Radio value="qualified">Qualified</Radio>
              <Radio value="nurturing">Nurturing</Radio>
              <Radio value="lost">Lost</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea 
              placeholder="Add notes about this status change..."
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminLeadsTab;