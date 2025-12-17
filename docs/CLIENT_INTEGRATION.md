# AutoBlog Client Integration Guide

## 🎯 Integration Overview

This guide provides comprehensive instructions for integrating AutoBlog's AI-powered content generation into your website or application. AutoBlog supports multiple integration patterns to fit various technical architectures and workflows.

## 🚀 Quick Start

### 1. Account Setup
1. **Sign up** at [app.autoblog.com](https://app.autoblog.com)
2. **Complete brand configuration** (voice, topics, visual style)
3. **Obtain API credentials** from the dashboard
4. **Configure webhook endpoint** for content delivery

### 2. Basic Integration (5 minutes)
```bash
# Install the SDK
npm install @autoblog/client

# Set up environment variables
export AUTOBLOG_API_KEY="your-api-key-here"
export AUTOBLOG_WEBHOOK_SECRET="your-webhook-secret"
```

### 3. First Content Generation
```javascript
import { AutoBlogClient } from '@autoblog/client';

const client = new AutoBlogClient({
  apiKey: process.env.AUTOBLOG_API_KEY
});

// Generate your first blog post
const pipeline = await client.content.create({
  topic: 'Latest trends in your industry',
  priority: 'high'
});

console.log('Content generation started:', pipeline.id);
```

## 🏗️ Integration Patterns

### Pattern 1: Webhook Integration (Recommended)
**Best for**: Most websites, real-time content delivery, automated publishing

AutoBlog generates content and pushes it to your webhook endpoint when ready.

```javascript
// Express.js webhook handler
app.post('/webhook/autoblog', express.json(), async (req, res) => {
  const { event, data, pipeline_id } = req.body;
  
  if (event === 'content.ready') {
    await publishToCMS({
      title: data.title,
      content: data.content,
      slug: data.slug,
      meta_description: data.meta_description,
      featured_image: data.featured_image,
      tags: data.tags
    });
    
    console.log(`Published: ${data.title}`);
  }
  
  res.status(200).send('OK');
});
```

### Pattern 2: Polling Integration
**Best for**: Static sites, batch processing, build-time integration

Your application polls AutoBlog API for ready content at regular intervals.

```javascript
// Check for ready content every 30 minutes
setInterval(async () => {
  const readyContent = await client.content.list({
    status: 'ready',
    limit: 10
  });
  
  for (const content of readyContent.data) {
    await publishToCMS(content);
    await client.content.markAsPublished(content.id);
  }
}, 30 * 60 * 1000);
```

### Pattern 3: Build-Time Integration
**Best for**: Static site generators (Gatsby, Next.js, Hugo), scheduled deployments

Generate content as part of your build process.

```javascript
// gatsby-node.js or next.js build script
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  
  const readyContent = await client.content.list({
    status: 'ready',
    limit: 50
  });
  
  readyContent.data.forEach(post => {
    createNode({
      ...post,
      id: createNodeId(`AutoBlog-${post.id}`),
      internal: {
        type: 'AutoBlogPost',
        contentDigest: createContentDigest(post)
      }
    });
  });
};
```

## 🔧 Platform-Specific Integrations

### WordPress Integration

#### Plugin Installation
```bash
# Download and install AutoBlog WordPress plugin
wget https://releases.autoblog.com/wordpress/autoblog-wp.zip
wp plugin install autoblog-wp.zip --activate
```

#### Configuration
```php
// wp-config.php
define('AUTOBLOG_API_KEY', 'your-api-key');
define('AUTOBLOG_AUTO_PUBLISH', false); // Set to true for auto-publishing

// functions.php
add_action('autoblog_content_received', function($content) {
    $post_id = wp_insert_post([
        'post_title' => $content['title'],
        'post_content' => $content['content'],
        'post_excerpt' => $content['meta_description'],
        'post_status' => 'draft', // or 'publish' if auto-publishing
        'post_type' => 'post'
    ]);
    
    // Set featured image
    if ($content['featured_image']) {
        $attachment_id = media_sideload_image($content['featured_image']['url'], $post_id, '', 'id');
        set_post_thumbnail($post_id, $attachment_id);
    }
    
    // Add tags
    wp_set_post_tags($post_id, $content['tags']);
});
```

### Shopify Integration

#### Theme Modification
```liquid
<!-- blog-post.liquid template -->
<article class="blog-post">
  <header>
    <h1>{{ blog.title }}</h1>
    {% if article.image %}
      <img src="{{ article.image | img_url: '1200x600' }}" alt="{{ article.image.alt }}">
    {% endif %}
  </header>
  
  <div class="blog-content">
    {{ article.content }}
  </div>
  
  <footer>
    <p>Published: {{ article.published_at | date: '%B %d, %Y' }}</p>
    {% if article.tags.size > 0 %}
      <div class="tags">
        {% for tag in article.tags %}
          <span class="tag">{{ tag }}</span>
        {% endfor %}
      </div>
    {% endif %}
  </footer>
</article>
```

#### Webhook Handler (Node.js backend)
```javascript
app.post('/shopify/autoblog-webhook', async (req, res) => {
  const content = req.body.data;
  
  // Create blog post in Shopify via Admin API
  const blogPost = await shopify.rest.Article.save({
    session,
    blog_id: BLOG_ID,
    title: content.title,
    content: content.content,
    summary: content.meta_description,
    tags: content.tags.join(', '),
    published: false // Set to true for auto-publishing
  });
  
  console.log('Shopify blog post created:', blogPost.id);
  res.status(200).send('OK');
});
```

### Ghost CMS Integration

#### Admin API Integration
```javascript
const GhostAdminAPI = require('@tryghost/admin-api');

const api = new GhostAdminAPI({
  url: 'https://yourblog.ghost.io',
  key: process.env.GHOST_ADMIN_API_KEY,
  version: 'v4'
});

app.post('/webhook/autoblog', async (req, res) => {
  const content = req.body.data;
  
  try {
    const post = await api.posts.add({
      title: content.title,
      html: content.content,
      meta_description: content.meta_description,
      tags: content.tags.map(tag => ({ name: tag })),
      feature_image: content.featured_image?.url,
      status: 'draft' // or 'published'
    });
    
    console.log('Ghost post created:', post.id);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Ghost integration error:', error);
    res.status(500).send('Error');
  }
});
```

### Static Site Generators

#### Next.js Integration
```javascript
// lib/autoblog.js
import { AutoBlogClient } from '@autoblog/client';
import fs from 'fs/promises';
import path from 'path';

export async function syncAutoBlogContent() {
  const client = new AutoBlogClient({
    apiKey: process.env.AUTOBLOG_API_KEY
  });
  
  const readyContent = await client.content.list({
    status: 'ready',
    limit: 50
  });
  
  for (const post of readyContent.data) {
    const frontMatter = `---
title: "${post.title}"
description: "${post.meta_description}"
date: "${post.created_at}"
tags: [${post.tags.map(tag => `"${tag}"`).join(', ')}]
image: "${post.featured_image?.url || ''}"
---

${post.content}`;
    
    const filename = `${post.slug}.md`;
    const filepath = path.join(process.cwd(), 'content/blog', filename);
    
    await fs.writeFile(filepath, frontMatter);
    await client.content.markAsPublished(post.id);
    
    console.log(`Synced: ${filename}`);
  }
}

// Run during build
// package.json scripts: "prebuild": "node scripts/sync-autoblog.js"
```

#### Gatsby Integration
```javascript
// gatsby-source-autoblog/gatsby-node.js
const { AutoBlogClient } = require('@autoblog/client');

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  
  const client = new AutoBlogClient({
    apiKey: process.env.AUTOBLOG_API_KEY
  });
  
  const content = await client.content.list({
    status: 'published',
    limit: 100
  });
  
  content.data.forEach(post => {
    const nodeId = createNodeId(`autoblog-post-${post.id}`);
    const nodeData = {
      ...post,
      id: nodeId,
      internal: {
        type: 'AutoBlogPost',
        content: post.content,
        contentDigest: createContentDigest(post)
      }
    };
    
    createNode(nodeData);
  });
};
```

## 🎨 Brand Configuration

### Initial Setup
```javascript
// Configure your brand voice and style
await client.brand.updateConfig({
  voice_tone: {
    warmth: 8,        // 1-10 scale
    expertise: 9,     // Professional authority level
    formality: 4,     // Casual to formal spectrum
    enthusiasm: 7     // Energy and excitement level
  },
  topics: [
    'industry trends',
    'product guides', 
    'best practices',
    'case studies'
  ],
  visual_style: {
    color_palette: ['#primary-color', '#secondary-color'],
    image_style: 'professional, clean, modern',
    avoid_elements: ['stock photos', 'overly corporate']
  },
  seo_strategy: {
    primary_keywords: ['your main keywords'],
    content_length: '800-1200',
    target_audience: 'description of your audience'
  }
});
```

### Advanced Brand Customization
```javascript
// Industry-specific templates
const brandTemplates = {
  ecommerce: {
    content_types: ['product_guides', 'buying_guides', 'comparisons'],
    call_to_action_style: 'soft_sell',
    product_integration: 'natural'
  },
  
  saas: {
    content_types: ['how_to_guides', 'best_practices', 'case_studies'],
    technical_depth: 'intermediate',
    feature_highlighting: 'benefit_focused'
  },
  
  healthcare: {
    content_types: ['educational', 'research_summaries', 'patient_guides'],
    compliance: 'hipaa_aware',
    citation_style: 'medical_journals'
  }
};

await client.brand.applyTemplate(brandTemplates.ecommerce);
```

## 🔄 Content Workflow Management

### Approval Workflow
```javascript
// Get content pending review
const pendingContent = await client.content.list({
  status: 'ready',
  limit: 10
});

// Review and approve content
for (const content of pendingContent.data) {
  const qualityScore = content.quality_scores.overall_score;
  
  if (qualityScore >= 85) {
    // Auto-approve high-quality content
    await client.content.approve(content.id, {
      publish_immediately: true
    });
  } else {
    // Send for human review
    await notifyContentTeam(content);
  }
}
```

### Custom Modifications
```javascript
// Approve with modifications
await client.content.approve(pipeline.id, {
  modifications: {
    title: 'Custom title override',
    meta_description: 'Custom meta description',
    add_paragraph: {
      position: 'before_conclusion',
      content: 'Don\'t forget to check out our related products...'
    }
  },
  publish_immediately: false,
  scheduled_publish_date: '2024-12-20T09:00:00Z'
});
```

### Rejection and Regeneration
```javascript
// Provide feedback for regeneration
await client.content.reject(pipeline.id, {
  feedback: 'Content needs more specific examples and actionable advice',
  regenerate_sections: ['introduction', 'main_content'],
  maintain_sections: ['conclusion'], // Keep conclusion as-is
  priority: 'high'
});
```

## 📊 Performance Tracking

### Analytics Integration
```javascript
// Track content performance
const performance = await client.analytics.getPerformance({
  date_range: '30d',
  metrics: ['traffic', 'engagement', 'conversions']
});

// Integrate with Google Analytics
const ga = new GoogleAnalytics(GA_TRACKING_ID);

performance.posts.forEach(post => {
  ga.event('autoblog_performance', {
    pipeline_id: post.pipeline_id,
    page_views: post.metrics.page_views,
    engagement_rate: post.metrics.engagement_rate
  });
});
```

### A/B Testing
```javascript
// Set up A/B test for titles
await client.content.createABTest(pipeline.id, {
  test_elements: ['title', 'meta_description'],
  variants: {
    title_b: 'Alternative title for testing',
    meta_description_b: 'Alternative meta description'
  },
  test_duration_days: 14,
  success_metric: 'click_through_rate'
});

// Check test results
const testResults = await client.content.getABTestResults(test.id);
if (testResults.winner) {
  console.log('Winning variant:', testResults.winner.variant);
}
```

## 🛠️ Advanced Integrations

### Multi-Site Management
```javascript
// Manage multiple sites with one AutoBlog account
const sites = [
  { domain: 'site1.com', webhook: 'https://site1.com/webhook' },
  { domain: 'site2.com', webhook: 'https://site2.com/webhook' }
];

sites.forEach(async site => {
  const siteClient = new AutoBlogClient({
    apiKey: process.env.AUTOBLOG_API_KEY,
    defaultWebhook: site.webhook
  });
  
  await siteClient.content.create({
    topic: `Industry news for ${site.domain}`,
    target_domain: site.domain
  });
});
```

### Custom Content Templates
```javascript
// Define custom content templates
const templates = {
  product_launch: {
    structure: [
      'problem_statement',
      'solution_introduction', 
      'key_features',
      'benefits',
      'call_to_action'
    ],
    tone: 'exciting',
    length: 800
  },
  
  how_to_guide: {
    structure: [
      'introduction',
      'prerequisites',
      'step_by_step',
      'troubleshooting',
      'conclusion'
    ],
    tone: 'helpful',
    length: 1200
  }
};

await client.content.create({
  template: 'product_launch',
  topic: 'Launching our new wellness companion',
  custom_variables: {
    product_name: 'Lumi Pro',
    key_feature: 'Advanced emotional recognition',
    target_audience: 'parents of school-age children'
  }
});
```

### Headless CMS Integration
```javascript
// Contentful integration
const contentful = require('contentful-management');
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

app.post('/webhook/autoblog', async (req, res) => {
  const content = req.body.data;
  
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment('master');
  
  const entry = await environment.createEntry('blogPost', {
    fields: {
      title: { 'en-US': content.title },
      content: { 'en-US': content.content },
      metaDescription: { 'en-US': content.meta_description },
      tags: { 'en-US': content.tags },
      publishedDate: { 'en-US': new Date().toISOString() }
    }
  });
  
  // Publish the entry
  await entry.publish();
  
  res.status(200).send('OK');
});
```

## 🔐 Security Best Practices

### Webhook Verification
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhook/autoblog', (req, res) => {
  const signature = req.headers['x-autoblog-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, process.env.AUTOBLOG_WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
});
```

### API Key Management
```javascript
// Environment-specific API keys
const config = {
  development: {
    apiKey: process.env.AUTOBLOG_DEV_API_KEY,
    baseURL: 'https://api-dev.autoblog.com/v1'
  },
  production: {
    apiKey: process.env.AUTOBLOG_PROD_API_KEY,
    baseURL: 'https://api.autoblog.com/v1'
  }
};

const client = new AutoBlogClient(config[process.env.NODE_ENV]);
```

## 🐛 Troubleshooting

### Common Integration Issues

#### Webhook Not Receiving Content
```javascript
// Test webhook connectivity
app.get('/webhook/test', (req, res) => {
  console.log('Webhook endpoint is reachable');
  res.status(200).send('OK');
});

// Check webhook logs in AutoBlog dashboard
// Verify webhook URL is publicly accessible
// Ensure HTTPS is used (HTTP not supported)
```

#### Content Quality Issues
```javascript
// Check brand configuration completeness
const brandConfig = await client.brand.getConfig();
const missingFields = [];

if (!brandConfig.voice_tone) missingFields.push('voice_tone');
if (!brandConfig.topics?.length) missingFields.push('topics');

if (missingFields.length > 0) {
  console.warn('Incomplete brand configuration:', missingFields);
}

// Request content regeneration with specific feedback
await client.content.reject(pipeline.id, {
  feedback: 'Specific issues with the generated content...',
  priority: 'high'
});
```

#### API Rate Limiting
```javascript
// Implement exponential backoff for rate limits
async function callAPIWithBackoff(apiCall, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

### Debug Mode
```javascript
// Enable debug logging
const client = new AutoBlogClient({
  apiKey: process.env.AUTOBLOG_API_KEY,
  debug: true // Logs all API requests/responses
});

// Custom logging
client.on('request', (config) => {
  console.log('API Request:', config.method, config.url);
});

client.on('response', (response) => {
  console.log('API Response:', response.status, response.statusText);
});
```

This integration guide provides everything needed to successfully implement AutoBlog into your content workflow, regardless of your technical stack or publishing platform.