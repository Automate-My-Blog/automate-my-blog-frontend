// Example webhook handler for receiving content from AutoBlog
// This example shows how to integrate AutoBlog content delivery with your CMS

const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuration
const AUTOBLOG_WEBHOOK_SECRET = process.env.AUTOBLOG_WEBHOOK_SECRET;
const CMS_API_ENDPOINT = process.env.CMS_API_ENDPOINT;
const CMS_AUTH_TOKEN = process.env.CMS_AUTH_TOKEN;

/**
 * Webhook signature verification
 * AutoBlog signs webhooks with HMAC SHA256
 */
function verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    const providedSignature = signature.replace('sha256=', '');
    
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(providedSignature, 'hex')
    );
}

/**
 * Input validation middleware
 */
const validateWebhookPayload = [
    body('event').isIn(['content.ready', 'content.published', 'content.failed']),
    body('pipeline_id').isUUID(),
    body('tenant_id').isUUID(),
    body('data').isObject(),
    body('timestamp').isISO8601()
];

/**
 * Main webhook endpoint
 */
app.post('/webhook/autoblog', validateWebhookPayload, async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Webhook validation failed:', errors.array());
            return res.status(400).json({ error: 'Invalid payload' });
        }

        // Verify webhook signature
        const signature = req.headers['x-autoblog-signature'];
        const payload = JSON.stringify(req.body);
        
        if (!signature || !verifyWebhookSignature(payload, signature, AUTOBLOG_WEBHOOK_SECRET)) {
            console.error('Webhook signature verification failed');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { event, pipeline_id, tenant_id, data, timestamp } = req.body;

        console.log(`Received webhook: ${event} for pipeline ${pipeline_id}`);

        // Handle different webhook events
        switch (event) {
            case 'content.ready':
                await handleContentReady(data, pipeline_id, tenant_id);
                break;
            
            case 'content.published':
                await handleContentPublished(data, pipeline_id, tenant_id);
                break;
            
            case 'content.failed':
                await handleContentFailed(data, pipeline_id, tenant_id);
                break;
            
            default:
                console.warn(`Unknown event type: ${event}`);
                return res.status(400).json({ error: 'Unknown event type' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Webhook processed successfully',
            pipeline_id 
        });

    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

/**
 * Handle content ready for review/publishing
 */
async function handleContentReady(contentData, pipelineId, tenantId) {
    console.log(`Processing ready content for pipeline: ${pipelineId}`);

    try {
        // Extract content data
        const {
            title,
            content,
            slug,
            meta_description,
            tags,
            featured_image,
            quality_scores,
            seo_data
        } = contentData;

        // Validate content quality
        if (quality_scores.overall_score < 85) {
            console.warn(`Content quality below threshold: ${quality_scores.overall_score}%`);
            await requestContentRegeneration(pipelineId, 'Quality score too low');
            return;
        }

        // Process featured image
        let processedImageUrl = null;
        if (featured_image && featured_image.url) {
            processedImageUrl = await processAndUploadImage(featured_image);
        }

        // Create blog post in CMS
        const postData = {
            title,
            content: processContentForCMS(content),
            slug: generateUniqueSlug(slug),
            excerpt: meta_description,
            tags: tags || [],
            featured_image: processedImageUrl,
            status: 'draft', // or 'published' for auto-publishing
            author: 'AutoBlog AI',
            meta: {
                description: meta_description,
                keywords: seo_data?.target_keywords?.join(', ') || '',
                pipeline_id: pipelineId,
                quality_scores
            },
            custom_fields: {
                autoblog_generated: true,
                generation_timestamp: new Date().toISOString(),
                seo_score: quality_scores.seo_score,
                brand_score: quality_scores.brand_score
            }
        };

        // Send to CMS
        const cmsResponse = await createCMSPost(postData);
        
        console.log(`Content created in CMS: ${cmsResponse.id}`);

        // Notify AutoBlog of successful processing
        await notifyAutoBlogSuccess(pipelineId, {
            cms_post_id: cmsResponse.id,
            post_url: cmsResponse.url,
            status: 'published'
        });

        // Send notifications if configured
        await sendContentNotification(contentData, cmsResponse);

    } catch (error) {
        console.error('Error processing ready content:', error);
        await notifyAutoBlogError(pipelineId, error.message);
        throw error;
    }
}

/**
 * Process content for CMS compatibility
 */
function processContentForCMS(content) {
    // Convert markdown to HTML if needed
    // Add internal linking
    // Process images and media
    // Add schema markup
    
    return content
        .replace(/#{1}\s/g, '<h1>')
        .replace(/#{2}\s/g, '<h2>')
        .replace(/#{3}\s/g, '<h3>')
        // Add more processing as needed
}

/**
 * Generate unique slug to avoid conflicts
 */
async function generateUniqueSlug(baseSlug) {
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists in CMS
    while (await slugExists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

/**
 * Check if slug already exists
 */
async function slugExists(slug) {
    try {
        const response = await fetch(`${CMS_API_ENDPOINT}/posts?slug=${slug}`, {
            headers: {
                'Authorization': `Bearer ${CMS_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return data && data.length > 0;
    } catch (error) {
        console.error('Error checking slug existence:', error);
        return false;
    }
}

/**
 * Process and upload featured image
 */
async function processAndUploadImage(imageData) {
    try {
        const { url, alt_text, dimensions } = imageData;

        // Download image from AutoBlog CDN
        const imageResponse = await fetch(url);
        const imageBuffer = await imageResponse.buffer();

        // Upload to your CDN/storage
        const uploadResponse = await uploadToCDN(imageBuffer, {
            alt_text,
            dimensions,
            filename: `autoblog-${Date.now()}.jpg`
        });

        return uploadResponse.url;
    } catch (error) {
        console.error('Error processing image:', error);
        return null;
    }
}

/**
 * Create post in CMS
 */
async function createCMSPost(postData) {
    const response = await fetch(`${CMS_API_ENDPOINT}/posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CMS_AUTH_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        throw new Error(`CMS API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Handle content published notification
 */
async function handleContentPublished(contentData, pipelineId, tenantId) {
    console.log(`Content published notification for pipeline: ${pipelineId}`);
    
    // Update analytics
    await trackContentPublication({
        pipeline_id: pipelineId,
        tenant_id: tenantId,
        title: contentData.title,
        published_at: new Date()
    });

    // Trigger social media posting if configured
    await scheduleocialMediaPosts(contentData);
}

/**
 * Handle content generation failure
 */
async function handleContentFailed(errorData, pipelineId, tenantId) {
    console.error(`Content generation failed for pipeline: ${pipelineId}`, errorData);
    
    // Send alert to content team
    await sendFailureAlert({
        pipeline_id: pipelineId,
        tenant_id: tenantId,
        error: errorData.error_message,
        timestamp: new Date()
    });
}

/**
 * Notify AutoBlog of successful processing
 */
async function notifyAutoBlogSuccess(pipelineId, data) {
    try {
        await fetch(`https://api.autoblog.com/v1/webhooks/confirm/${pipelineId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.AUTOBLOG_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'success',
                data
            })
        });
    } catch (error) {
        console.error('Failed to notify AutoBlog of success:', error);
    }
}

/**
 * Request content regeneration
 */
async function requestContentRegeneration(pipelineId, reason) {
    try {
        await fetch(`https://api.autoblog.com/v1/content/regenerate/${pipelineId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.AUTOBLOG_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason,
                priority: 'high'
            })
        });
    } catch (error) {
        console.error('Failed to request content regeneration:', error);
    }
}

/**
 * Send content notification to team
 */
async function sendContentNotification(contentData, cmsResponse) {
    const notificationData = {
        subject: `New content published: ${contentData.title}`,
        message: `
            A new blog post has been automatically generated and published:
            
            Title: ${contentData.title}
            URL: ${cmsResponse.url}
            Quality Score: ${contentData.quality_scores.overall_score}%
            
            Review the content at: ${cmsResponse.admin_url}
        `,
        recipients: ['content@yourcompany.com'],
        priority: 'normal'
    };

    // Send via your notification system (email, Slack, etc.)
    await sendNotification(notificationData);
}

// Health check endpoint
app.get('/webhook/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Webhook error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AutoBlog webhook server running on port ${PORT}`);
    console.log(`Webhook endpoint: http://localhost:${PORT}/webhook/autoblog`);
});

module.exports = app;