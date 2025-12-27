import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, Table, Tag, Dropdown, Space, Switch, Divider } from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  UnorderedListOutlined, 
  ScheduleOutlined,
  EditOutlined,
  ExportOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import SchedulingModal from '../Modals/SchedulingModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// DUMMY DATA - Remove when backend integration complete
const dummyPosts = [
  {
    id: 'dummy_1',
    title: 'How to Improve Team Productivity with AI Tools',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    status: 'draft',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    exportCount: 0,
    isDummy: true
  },
  {
    id: 'dummy_2', 
    title: 'Complete Guide to Remote Team Management',
    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    status: 'scheduled', // DUMMY DATA
    scheduledDate: '2024-01-15T14:00:00Z', // DUMMY DATA
    scheduledPlatform: 'wordpress', // DUMMY DATA
    notifyOnPublish: true, // DUMMY DATA
    createdAt: '2023-12-28T10:00:00Z',
    updatedAt: '2023-12-28T10:00:00Z',
    exportCount: 1,
    isDummy: true
  },
  {
    id: 'dummy_3',
    title: 'Marketing Automation Best Practices for 2024',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation...',
    status: 'published', // DUMMY DATA
    publishedDate: '2023-12-20T09:00:00Z', // DUMMY DATA
    publishedPlatform: 'medium', // DUMMY DATA
    createdAt: '2023-12-19T15:30:00Z',
    updatedAt: '2023-12-20T09:00:00Z',
    exportCount: 3,
    isDummy: true
  }
];

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

const PostsTab = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Check if user can schedule (Creator, Professional, Enterprise)
  const canSchedule = user && user.plan && !['payasyougo', 'free'].includes(user.plan);

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const result = await api.getBlogPosts(user?.id);
      
      if (result.success && result.posts.length > 0) {
        setPosts(result.posts);
      } else {
        // Show dummy data if no real posts exist
        setPosts(dummyPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts(dummyPosts); // Fallback to dummy data
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'green';
      case 'scheduled': return 'orange';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (post) => {
    if (post.status === 'scheduled' && post.scheduledDate) {
      return `Scheduled for ${format(new Date(post.scheduledDate), 'MMM dd, yyyy HH:mm')}`;
    }
    if (post.status === 'published' && post.publishedDate) {
      return `Published on ${format(new Date(post.publishedDate), 'MMM dd, yyyy')}`;
    }
    return post.status.charAt(0).toUpperCase() + post.status.slice(1);
  };

  const handleSchedulePost = (post) => {
    setSelectedPost(post);
    setShowSchedulingModal(true);
  };

  const handleScheduleSave = (scheduleData) => {
    // DUMMY DATA - Save scheduling info to localStorage temporarily
    const updatedPosts = posts.map(post => 
      post.id === selectedPost.id 
        ? { 
            ...post, 
            status: 'scheduled',
            scheduledDate: scheduleData.date,
            scheduledPlatform: scheduleData.platform,
            notifyOnPublish: scheduleData.notify
          }
        : post
    );
    setPosts(updatedPosts);
    setShowSchedulingModal(false);
    setSelectedPost(null);
  };

  const getPostActions = (post) => {
    const actions = [
      {
        key: 'edit',
        label: 'Edit',
        icon: <EditOutlined />,
        onClick: () => console.log('Edit post:', post.id)
      },
      {
        key: 'export',
        label: 'Export',
        icon: <ExportOutlined />,
        onClick: () => console.log('Export post:', post.id)
      }
    ];

    if (canSchedule && post.status !== 'published') {
      actions.unshift({
        key: 'schedule',
        label: post.status === 'scheduled' ? 'Reschedule' : 'Schedule',
        icon: <ScheduleOutlined />,
        onClick: () => handleSchedulePost(post)
      });
    }

    return actions;
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>{title}</div>
          {record.isDummy && (
            <Tag size="small" color="blue">DUMMY DATA</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(record)}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => format(new Date(date), 'MMM dd, yyyy')
    },
    {
      title: 'Exports',
      dataIndex: 'exportCount',
      key: 'exportCount'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          menu={{ 
            items: getPostActions(record).map(action => ({
              ...action,
              onClick: () => action.onClick(record)
            }))
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  // Calendar events from scheduled posts
  const calendarEvents = posts
    .filter(post => post.status === 'scheduled' && post.scheduledDate)
    .map(post => ({
      id: post.id,
      title: post.title,
      start: new Date(post.scheduledDate),
      end: new Date(post.scheduledDate),
      resource: post
    }));

  if (posts.length === 0 && !loading) {
    return (
      <div style={{ padding: '24px' }}>
        <Card 
          title="Blog Posts" 
          extra={
            <Button type="primary" icon={<PlusOutlined />}>
              New Post
            </Button>
          }
        >
          <Empty
            description="No blog posts yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              Create Your First Post
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Blog Posts" 
        extra={
          <Space>
            <Switch
              checkedChildren={<CalendarOutlined />}
              unCheckedChildren={<UnorderedListOutlined />}
              checked={viewMode === 'calendar'}
              onChange={(checked) => setViewMode(checked ? 'calendar' : 'list')}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              New Post
            </Button>
          </Space>
        }
      >
        {!canSchedule && (
          <>
            <div style={{
              background: '#f0f2ff',
              border: '1px solid #d6e3ff',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: 500, color: '#1d39c4', marginBottom: '4px' }}>
                Scheduling Available for Subscribers
              </div>
              <div style={{ fontSize: '14px', color: '#4f4f4f' }}>
                Upgrade to Creator, Professional, or Enterprise plan to schedule your blog posts.
              </div>
            </div>
          </>
        )}

        {viewMode === 'list' ? (
          <Table
            columns={columns}
            dataSource={posts}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <div style={{ height: '500px' }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={(event) => {
                if (canSchedule) {
                  handleSchedulePost(event.resource);
                }
              }}
              views={['month', 'week', 'day']}
              defaultView="month"
              popup
              style={{ height: '100%' }}
            />
          </div>
        )}
      </Card>

      {showSchedulingModal && (
        <SchedulingModal
          open={showSchedulingModal}
          post={selectedPost}
          onClose={() => setShowSchedulingModal(false)}
          onSave={handleScheduleSave}
        />
      )}
    </div>
  );
};

export default PostsTab;