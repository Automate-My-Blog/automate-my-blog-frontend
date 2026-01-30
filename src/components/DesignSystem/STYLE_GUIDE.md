# Style Guide - Automate My Blog

Practical patterns and examples for implementing the Stripe-inspired design system.

## Table of Contents

1. [Color Usage](#color-usage)
2. [Typography Patterns](#typography-patterns)
3. [Spacing Examples](#spacing-examples)
4. [Component Patterns](#component-patterns)
5. [Layout Examples](#layout-examples)
6. [Animation Patterns](#animation-patterns)
7. [Common Mistakes](#common-mistakes)

## Color Usage

### Primary Actions

Use Stripe purple sparingly for primary actions only:

```jsx
// ✅ Good - Primary action
<Button type="primary">Create Post</Button>
<Button type="primary">Save Changes</Button>

// ❌ Avoid - Too many primary buttons
<Space>
  <Button type="primary">Action 1</Button>
  <Button type="primary">Action 2</Button>  {/* Should be default */}
  <Button type="primary">Action 3</Button>  {/* Should be default */}
</Space>

// ✅ Better - One primary, others default
<Space>
  <Button type="primary">Create Post</Button>
  <Button>Save Draft</Button>
  <Button>Cancel</Button>
</Space>
```

### Text Hierarchy

```jsx
// Page Title
<h1 style={{
  fontSize: 'var(--font-size-3xl)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-primary)',
  marginBottom: 'var(--space-2)'
}}>
  Dashboard
</h1>

// Section Header
<h2 style={{
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-primary)',
  marginBottom: 'var(--space-4)'
}}>
  Recent Posts
</h2>

// Body Text
<p style={{
  fontSize: 'var(--font-size-base)',
  color: 'var(--color-text-primary)',
  lineHeight: 'var(--line-height-normal)',
  marginBottom: 'var(--space-4)'
}}>
  Main content goes here.
</p>

// Secondary Text
<p style={{
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  lineHeight: 'var(--line-height-normal)'
}}>
  Supplementary information or metadata.
</p>

// Caption
<span style={{
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-tertiary)'
}}>
  Last updated 2 hours ago
</span>
```

### Background Colors

```jsx
// Main container
<div style={{
  background: 'var(--color-background-body)',  // White
  padding: 'var(--space-6)'
}}>
  Main content area
</div>

// Subtle container
<div style={{
  background: 'var(--color-background-container)',  // Very light gray
  padding: 'var(--space-6)',
  borderRadius: 'var(--radius-md)'
}}>
  Subtle gray background for grouping
</div>

// Card/Elevated
<Card style={{
  background: 'var(--color-background-elevated)',  // White
  boxShadow: 'var(--shadow-sm)'
}}>
  Card content
</Card>
```

## Typography Patterns

### Page Structure

```jsx
<div style={{ padding: 'var(--space-6)' }}>
  {/* Page Title */}
  <h1 className="heading-page" style={{ marginBottom: 'var(--space-2)' }}>
    Analytics Dashboard
  </h1>

  {/* Page Description */}
  <p style={{
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-8)'
  }}>
    Track your blog performance and engagement metrics.
  </p>

  {/* Section */}
  <div style={{ marginBottom: 'var(--space-8)' }}>
    <h2 className="heading-section" style={{ marginBottom: 'var(--space-4)' }}>
      Overview
    </h2>
    {/* Section content */}
  </div>

  {/* Subsection */}
  <div style={{ marginBottom: 'var(--space-6)' }}>
    <h3 className="heading-subsection" style={{ marginBottom: 'var(--space-3)' }}>
      Traffic Sources
    </h3>
    {/* Subsection content */}
  </div>
</div>
```

### List Styling

```jsx
// Unordered list with proper spacing
<ul style={{
  listStyle: 'none',
  padding: 0,
  margin: 0
}}>
  {items.map((item) => (
    <li
      key={item.id}
      style={{
        padding: 'var(--space-3) 0',
        borderBottom: '1px solid var(--color-border-base)',
        fontSize: 'var(--font-size-base)',
        color: 'var(--color-text-primary)'
      }}
    >
      {item.name}
    </li>
  ))}
</ul>
```

### Link Styling

```jsx
// Inline link
<a
  href="/path"
  style={{
    color: 'var(--color-primary)',
    textDecoration: 'none',
    fontWeight: 'var(--font-weight-medium)',
    transition: 'var(--transition-fast)'
  }}
  onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-hover)'}
  onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
>
  Learn more
</a>

// Navigation link
<a
  href="/dashboard"
  style={{
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    transition: 'var(--transition-fast)'
  }}
  onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
  onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
>
  Dashboard
</a>
```

## Spacing Examples

### Component Spacing

```jsx
// Tight spacing (related elements)
<Space size={8} direction="vertical">  {/* var(--space-2) */}
  <Input placeholder="Email" />
  <Input.Password placeholder="Password" />
</Space>

// Standard spacing (form fields)
<Space size={16} direction="vertical" style={{ width: '100%' }}>  {/* var(--space-4) */}
  <FormField label="Name" />
  <FormField label="Email" />
  <FormField label="Phone" />
</Space>

// Generous spacing (sections)
<Space size={24} direction="vertical" style={{ width: '100%' }}>  {/* var(--space-6) */}
  <Section title="Personal Info" />
  <Section title="Preferences" />
  <Section title="Security" />
</Space>
```

### Section Spacing

```jsx
// Page with proper section spacing
<div style={{ padding: 'var(--space-6)' }}>
  {/* Hero section */}
  <section style={{
    marginBottom: 'var(--space-12)'  // 48px between hero and content
  }}>
    <h1 className="heading-display">Welcome</h1>
  </section>

  {/* Main sections */}
  <section style={{
    marginBottom: 'var(--space-8)'  // 32px between sections
  }}>
    <h2 className="heading-section">Recent Activity</h2>
    {/* Content */}
  </section>

  <section style={{
    marginBottom: 'var(--space-8)'
  }}>
    <h2 className="heading-section">Statistics</h2>
    {/* Content */}
  </section>
</div>
```

### Card Grid Spacing

```jsx
<Row gutter={[24, 24]}>  {/* var(--space-6) horizontal & vertical */}
  <Col xs={24} sm={12} lg={8}>
    <Card>Card 1</Card>
  </Col>
  <Col xs={24} sm={12} lg={8}>
    <Card>Card 2</Card>
  </Col>
  <Col xs={24} sm={12} lg={8}>
    <Card>Card 3</Card>
  </Col>
</Row>
```

## Component Patterns

### Info Card Pattern

```jsx
<Card
  style={{
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-base)',
    boxShadow: 'var(--shadow-sm)'
  }}
  bodyStyle={{ padding: 'var(--space-6)' }}
>
  <div style={{ marginBottom: 'var(--space-4)' }}>
    <h3 style={{
      fontSize: 'var(--font-size-lg)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-2)'
    }}>
      Card Title
    </h3>
    <p style={{
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-secondary)',
      marginBottom: 0
    }}>
      Card description or metadata
    </p>
  </div>

  <div>
    {/* Card content */}
  </div>
</Card>
```

### Stat Card Pattern

```jsx
<Card
  style={{
    textAlign: 'center',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-base)',
    boxShadow: 'var(--shadow-sm)'
  }}
  bodyStyle={{ padding: 'var(--space-6)' }}
>
  {/* Large number */}
  <div style={{
    fontSize: 'var(--font-size-3xl)',  // 32px
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)'
  }}>
    1,234
  </div>

  {/* Label */}
  <div style={{
    fontSize: 'var(--font-size-sm)',  // 14px
    color: 'var(--color-text-secondary)',
    fontWeight: 'var(--font-weight-medium)',
    marginBottom: 'var(--space-2)'
  }}>
    Total Users
  </div>

  {/* Change indicator */}
  <div style={{
    fontSize: 'var(--font-size-xs)',  // 12px
    color: 'var(--color-success)',
    fontWeight: 'var(--font-weight-medium)'
  }}>
    ↑ 12% from last month
  </div>
</Card>
```

### Form Pattern

```jsx
<Form layout="vertical">
  <Form.Item
    label={
      <span style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        color: 'var(--color-text-secondary)'
      }}>
        Email Address
      </span>
    }
    name="email"
    rules={[{ required: true, message: 'Please enter your email' }]}
  >
    <Input
      placeholder="you@example.com"
      size="large"
      style={{
        borderRadius: 'var(--radius-base)',
        fontSize: 'var(--font-size-base)'
      }}
    />
  </Form.Item>

  <Form.Item style={{ marginBottom: 0 }}>
    <Space>
      <Button type="primary" htmlType="submit" size="large">
        Submit
      </Button>
      <Button size="large">
        Cancel
      </Button>
    </Space>
  </Form.Item>
</Form>
```

### Empty State Pattern

```jsx
<div style={{
  textAlign: 'center',
  padding: 'var(--space-16)',  // 64px vertical
  background: 'var(--color-background-container)',
  borderRadius: 'var(--radius-md)'
}}>
  {/* Icon or illustration */}
  <div style={{
    fontSize: '48px',
    color: 'var(--color-text-tertiary)',
    marginBottom: 'var(--space-4)'
  }}>
    📭
  </div>

  {/* Title */}
  <h3 style={{
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)'
  }}>
    No posts yet
  </h3>

  {/* Description */}
  <p style={{
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-6)',
    maxWidth: '400px',
    margin: '0 auto var(--space-6)'
  }}>
    Get started by creating your first blog post.
  </p>

  {/* Action */}
  <Button type="primary" size="large">
    Create First Post
  </Button>
</div>
```

### Alert Pattern

```jsx
// Success message
<Alert
  message="Post published successfully"
  type="success"
  showIcon
  style={{
    marginBottom: 'var(--space-4)',
    borderRadius: 'var(--radius-md)'
  }}
/>

// Info message
<Alert
  message={
    <span style={{
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-primary)'
    }}>
      You have 5 draft posts. <a href="/drafts">View drafts →</a>
    </span>
  }
  type="info"
  showIcon
  closable
  style={{
    marginBottom: 'var(--space-4)',
    borderRadius: 'var(--radius-md)'
  }}
/>
```

## Layout Examples

### Two-Column Layout

```jsx
<Row gutter={24}>
  {/* Main content - 2/3 width */}
  <Col xs={24} lg={16}>
    <div style={{
      background: 'var(--color-background-body)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-6)',
      marginBottom: 'var(--space-6)'
    }}>
      {/* Main content */}
    </div>
  </Col>

  {/* Sidebar - 1/3 width */}
  <Col xs={24} lg={8}>
    <div style={{
      background: 'var(--color-background-container)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-6)',
      position: 'sticky',
      top: 'var(--space-6)'
    }}>
      {/* Sidebar content */}
    </div>
  </Col>
</Row>
```

### Dashboard Grid

```jsx
<div style={{ padding: 'var(--space-6)' }}>
  {/* Stats row */}
  <Row gutter={[24, 24]} style={{ marginBottom: 'var(--space-8)' }}>
    <Col xs={24} sm={12} lg={6}>
      <StatCard title="Total Posts" value="124" change="+12%" />
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <StatCard title="Views" value="12.5K" change="+8%" />
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <StatCard title="Subscribers" value="1,234" change="+5%" />
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <StatCard title="Revenue" value="$4,567" change="+15%" />
    </Col>
  </Row>

  {/* Chart row */}
  <Row gutter={[24, 24]}>
    <Col xs={24} lg={16}>
      <Card title="Traffic Overview">
        {/* Chart component */}
      </Card>
    </Col>
    <Col xs={24} lg={8}>
      <Card title="Top Posts">
        {/* List component */}
      </Card>
    </Col>
  </Row>
</div>
```

### Modal Pattern

```jsx
<Modal
  title={
    <span style={{
      fontSize: 'var(--font-size-xl)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)'
    }}>
      Delete Post
    </span>
  }
  open={visible}
  onCancel={onCancel}
  footer={
    <Space>
      <Button onClick={onCancel}>
        Cancel
      </Button>
      <Button type="primary" danger onClick={onConfirm}>
        Delete
      </Button>
    </Space>
  }
  centered
  width={480}
>
  <p style={{
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-secondary)',
    lineHeight: 'var(--line-height-relaxed)'
  }}>
    Are you sure you want to delete this post? This action cannot be undone.
  </p>
</Modal>
```

## Animation Patterns

### Fade-In Content

```jsx
<div
  className="fade-in"
  style={{
    opacity: 0,
    animation: 'fadeIn var(--transition-normal) ease-out forwards'
  }}
>
  Content that fades in
</div>
```

### Slide-In Section

```jsx
<section
  className="slide-in-up"
  style={{
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'slideInUp var(--transition-normal) ease-out forwards'
  }}
>
  Section content
</section>
```

### Hover Effects

```jsx
// Card hover (subtle)
<Card
  style={{
    transition: 'var(--transition-fast)',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  Hover over me
</Card>

// Button hover (automatic via theme)
<Button type="primary">
  Hover automatically styled
</Button>
```

### Loading State

```jsx
// Skeleton loading
<div
  className="skeleton"
  style={{
    height: '100px',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-4)'
  }}
/>

// Spinner
<Spin
  size="large"
  style={{
    display: 'flex',
    justifyContent: 'center',
    padding: 'var(--space-16)'
  }}
/>
```

## Common Mistakes

### ❌ Too Many Primary Actions

```jsx
// Bad - Multiple primary buttons compete for attention
<Space>
  <Button type="primary">Save</Button>
  <Button type="primary">Publish</Button>
  <Button type="primary">Share</Button>
</Space>

// Good - One primary action, others secondary
<Space>
  <Button type="primary">Publish</Button>
  <Button>Save Draft</Button>
  <Button type="text">Cancel</Button>
</Space>
```

### ❌ Hardcoded Values

```jsx
// Bad - Hardcoded colors and spacing
<div style={{
  padding: '24px',
  background: '#fff',
  borderRadius: '8px',
  color: '#333'
}}>
  Content
</div>

// Good - Using design tokens
<div style={{
  padding: 'var(--space-6)',
  background: 'var(--color-background-body)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)'
}}>
  Content
</div>
```

### ❌ Excessive Shadows

```jsx
// Bad - Too heavy
<Card style={{
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
}}>
  Card
</Card>

// Good - Subtle Stripe-style shadow
<Card style={{
  boxShadow: 'var(--shadow-sm)'
}}>
  Card
</Card>
```

### ❌ Large Border Radius

```jsx
// Bad - Too rounded for professional look
<Button style={{
  borderRadius: '24px'
}}>
  Button
</Button>

// Good - Subtle radius
<Button style={{
  borderRadius: 'var(--radius-base)'  // 4px
}}>
  Button
</Button>
```

### ❌ Inconsistent Spacing

```jsx
// Bad - Random spacing values
<div style={{ marginBottom: '15px' }}>Item 1</div>
<div style={{ marginBottom: '22px' }}>Item 2</div>
<div style={{ marginBottom: '18px' }}>Item 3</div>

// Good - Consistent 8px grid
<div style={{ marginBottom: 'var(--space-4)' }}>Item 1</div>
<div style={{ marginBottom: 'var(--space-4)' }}>Item 2</div>
<div style={{ marginBottom: 'var(--space-4)' }}>Item 3</div>
```

### ❌ Poor Typography Hierarchy

```jsx
// Bad - No clear hierarchy
<div>
  <h2 style={{ fontSize: '18px' }}>Section Title</h2>
  <p style={{ fontSize: '16px' }}>Body text</p>
  <span style={{ fontSize: '15px' }}>Caption</span>
</div>

// Good - Clear hierarchy
<div>
  <h2 className="heading-section">Section Title</h2>  {/* 24px, semibold */}
  <p style={{
    fontSize: 'var(--font-size-base)',  {/* 16px */}
    color: 'var(--color-text-primary)'
  }}>
    Body text
  </p>
  <span style={{
    fontSize: 'var(--font-size-xs)',  {/* 12px */}
    color: 'var(--color-text-tertiary)'
  }}>
    Caption
  </span>
</div>
```

### ❌ Slow Animations

```jsx
// Bad - Too slow, feels sluggish
<div style={{
  transition: 'all 0.5s ease'
}}>
  Content
</div>

// Good - Fast, responsive
<div style={{
  transition: 'all var(--transition-fast)'  // 100ms
}}>
  Content
</div>
```

## Quick Reference

### Most Common Patterns

```jsx
// Page container
<div style={{ padding: 'var(--space-6)', background: 'var(--color-gray-50)' }}>

// Card
<Card style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>

// Heading
<h2 className="heading-section" style={{ marginBottom: 'var(--space-4)' }}>

// Body text
<p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-base)' }}>

// Secondary text
<span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>

// Primary button
<Button type="primary" size="large">

// Section spacing
<div style={{ marginBottom: 'var(--space-8)' }}>

// Grid
<Row gutter={[24, 24]}>
```

---

**Pro Tip**: When in doubt, check Stripe's website for inspiration. Our design system mirrors their aesthetic: minimal, professional, and data-focused.

**Last Updated**: January 2026
