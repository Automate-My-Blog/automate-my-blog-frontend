<?php
/**
 * Plugin Name: AutoBlog Content Integration
 * Description: Integrates AutoBlog AI-generated content with WordPress
 * Version: 1.0.0
 * Author: AutoBlog Team
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class AutoBlogWordPressIntegration {
    
    private $webhook_secret;
    private $api_key;
    
    public function __construct() {
        $this->webhook_secret = get_option('autoblog_webhook_secret');
        $this->api_key = get_option('autoblog_api_key');
        
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'settings_init'));
        add_action('rest_api_init', array($this, 'register_webhook_endpoint'));
    }
    
    public function init() {
        // Plugin initialization
        if (!$this->webhook_secret) {
            add_action('admin_notices', array($this, 'configuration_notice'));
        }
    }
    
    /**
     * Register webhook endpoint for AutoBlog content delivery
     */
    public function register_webhook_endpoint() {
        register_rest_route('autoblog/v1', '/webhook', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_webhook'),
            'permission_callback' => array($this, 'verify_webhook_signature'),
        ));
    }
    
    /**
     * Verify webhook signature for security
     */
    public function verify_webhook_signature($request) {
        $signature = $request->get_header('x-autoblog-signature');
        $body = $request->get_body();
        
        if (!$signature || !$this->webhook_secret) {
            return new WP_Error('unauthorized', 'Invalid signature', array('status' => 401));
        }
        
        $expected_signature = 'sha256=' . hash_hmac('sha256', $body, $this->webhook_secret);
        
        if (!hash_equals($expected_signature, $signature)) {
            return new WP_Error('unauthorized', 'Invalid signature', array('status' => 401));
        }
        
        return true;
    }
    
    /**
     * Handle incoming webhook from AutoBlog
     */
    public function handle_webhook($request) {
        $data = $request->get_json_params();
        
        // Validate required fields
        if (!isset($data['event']) || !isset($data['data']) || !isset($data['pipeline_id'])) {
            return new WP_Error('invalid_data', 'Missing required fields', array('status' => 400));
        }
        
        $event = sanitize_text_field($data['event']);
        $pipeline_id = sanitize_text_field($data['pipeline_id']);
        $content_data = $data['data'];
        
        switch ($event) {
            case 'content.ready':
                $result = $this->process_content_ready($content_data, $pipeline_id);
                break;
                
            case 'content.published':
                $result = $this->process_content_published($content_data, $pipeline_id);
                break;
                
            case 'content.failed':
                $result = $this->process_content_failed($content_data, $pipeline_id);
                break;
                
            default:
                return new WP_Error('invalid_event', 'Unknown event type', array('status' => 400));
        }
        
        if (is_wp_error($result)) {
            return $result;
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Webhook processed successfully',
            'post_id' => $result
        ));
    }
    
    /**
     * Process content ready for publication
     */
    private function process_content_ready($content_data, $pipeline_id) {
        // Extract content data
        $title = sanitize_text_field($content_data['title']);
        $content = wp_kses_post($content_data['content']);
        $excerpt = sanitize_textarea_field($content_data['meta_description']);
        $slug = sanitize_title($content_data['slug']);
        $tags = array_map('sanitize_text_field', $content_data['tags'] ?? array());
        
        // Check quality scores
        $quality_scores = $content_data['quality_scores'];
        $minimum_score = get_option('autoblog_minimum_quality_score', 85);
        
        if ($quality_scores['overall_score'] < $minimum_score) {
            // Request regeneration if quality is too low
            $this->request_content_regeneration($pipeline_id, 'Quality score below threshold');
            return new WP_Error('low_quality', 'Content quality below minimum threshold');
        }
        
        // Check for duplicate content
        $existing_post = get_page_by_title($title, OBJECT, 'post');
        if ($existing_post) {
            $slug = $slug . '-' . time();
        }
        
        // Process featured image
        $featured_image_id = null;
        if (isset($content_data['featured_image']['url'])) {
            $featured_image_id = $this->process_featured_image(
                $content_data['featured_image']['url'],
                $content_data['featured_image']['alt_text'] ?? $title
            );
        }
        
        // Determine post status
        $auto_publish = get_option('autoblog_auto_publish', false);
        $post_status = $auto_publish ? 'publish' : 'draft';
        
        // Create WordPress post
        $post_data = array(
            'post_title' => $title,
            'post_content' => $this->process_content_for_wordpress($content),
            'post_excerpt' => $excerpt,
            'post_status' => $post_status,
            'post_type' => 'post',
            'post_name' => $slug,
            'post_author' => get_option('autoblog_author_id', 1),
            'meta_input' => array(
                'autoblog_pipeline_id' => $pipeline_id,
                'autoblog_generated' => true,
                'autoblog_quality_scores' => json_encode($quality_scores),
                'autoblog_generation_date' => current_time('mysql'),
                '_yoast_wpseo_metadesc' => $excerpt, // Yoast SEO compatibility
                '_yoast_wpseo_title' => $title
            )
        );
        
        $post_id = wp_insert_post($post_data);
        
        if (is_wp_error($post_id)) {
            return $post_id;
        }
        
        // Set featured image
        if ($featured_image_id) {
            set_post_thumbnail($post_id, $featured_image_id);
        }
        
        // Set tags
        if (!empty($tags)) {
            wp_set_post_tags($post_id, $tags);
        }
        
        // Set category (if configured)
        $default_category = get_option('autoblog_default_category');
        if ($default_category) {
            wp_set_post_categories($post_id, array($default_category));
        }
        
        // Add custom taxonomies if needed
        $this->set_custom_taxonomies($post_id, $content_data);
        
        // Send notification
        $this->send_content_notification($post_id, $title, $post_status);
        
        // Notify AutoBlog of success
        $this->notify_autoblog_success($pipeline_id, array(
            'wordpress_post_id' => $post_id,
            'post_url' => get_permalink($post_id),
            'status' => $post_status
        ));
        
        return $post_id;
    }
    
    /**
     * Process content for WordPress compatibility
     */
    private function process_content_for_wordpress($content) {
        // Convert markdown to HTML if needed
        if (function_exists('Parsedown')) {
            $parsedown = new Parsedown();
            $content = $parsedown->text($content);
        }
        
        // Add internal links
        $content = $this->add_internal_links($content);
        
        // Process images and media
        $content = $this->process_content_images($content);
        
        return $content;
    }
    
    /**
     * Process featured image from AutoBlog
     */
    private function process_featured_image($image_url, $alt_text) {
        // Download image
        $image_data = wp_remote_get($image_url);
        
        if (is_wp_error($image_data)) {
            return null;
        }
        
        $image_body = wp_remote_retrieve_body($image_data);
        $filename = 'autoblog-' . time() . '.jpg';
        
        // Upload to WordPress media library
        $upload = wp_upload_bits($filename, null, $image_body);
        
        if ($upload['error']) {
            return null;
        }
        
        // Create attachment
        $attachment = array(
            'guid' => $upload['url'],
            'post_mime_type' => 'image/jpeg',
            'post_title' => $alt_text,
            'post_content' => '',
            'post_status' => 'inherit'
        );
        
        $attachment_id = wp_insert_attachment($attachment, $upload['file']);
        
        if (!is_wp_error($attachment_id)) {
            require_once(ABSPATH . 'wp-admin/includes/image.php');
            $attachment_data = wp_generate_attachment_metadata($attachment_id, $upload['file']);
            wp_update_attachment_metadata($attachment_id, $attachment_data);
            
            // Set alt text
            update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt_text);
        }
        
        return $attachment_id;
    }
    
    /**
     * Add internal links to content
     */
    private function add_internal_links($content) {
        // Get related posts
        $related_posts = $this->find_related_posts($content);
        
        foreach ($related_posts as $post) {
            $link = '<a href=\"' . get_permalink($post->ID) . '\">' . $post->post_title . '</a>';
            $content = str_replace($post->post_title, $link, $content);
        }
        
        return $content;
    }
    
    /**
     * Find related posts for internal linking
     */
    private function find_related_posts($content, $limit = 3) {
        // Extract keywords from content
        $words = str_word_count($content, 1);
        $keywords = array_slice(array_unique($words), 0, 10);
        
        // Search for related posts
        $args = array(
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => $limit,
            's' => implode(' ', $keywords),
            'meta_query' => array(
                array(
                    'key' => 'autoblog_generated',
                    'compare' => 'NOT EXISTS'
                )
            )
        );
        
        return get_posts($args);
    }
    
    /**
     * Set custom taxonomies
     */
    private function set_custom_taxonomies($post_id, $content_data) {
        // Set custom taxonomies based on content data
        if (isset($content_data['categories'])) {
            foreach ($content_data['categories'] as $category) {
                wp_set_object_terms($post_id, $category, 'category', true);
            }
        }
        
        // Add any custom taxonomy handling here
    }
    
    /**
     * Send notification about new content
     */
    private function send_content_notification($post_id, $title, $status) {
        $notification_emails = get_option('autoblog_notification_emails');
        
        if (!$notification_emails) {
            return;
        }
        
        $subject = sprintf('[AutoBlog] New content %s: %s', $status, $title);
        $message = sprintf(
            \"A new blog post has been automatically generated:\\n\\n\" .
            \"Title: %s\\n\" .
            \"Status: %s\\n\" .
            \"Edit URL: %s\\n\" .
            \"View URL: %s\\n\\n\" .
            \"This content was generated by AutoBlog AI.\",
            $title,
            $status,
            admin_url('post.php?action=edit&post=' . $post_id),
            get_permalink($post_id)
        );
        
        wp_mail(explode(',', $notification_emails), $subject, $message);
    }
    
    /**
     * Notify AutoBlog of successful processing
     */
    private function notify_autoblog_success($pipeline_id, $data) {
        if (!$this->api_key) {
            return;
        }
        
        wp_remote_post('https://api.autoblog.com/v1/webhooks/confirm/' . $pipeline_id, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode(array(
                'status' => 'success',
                'data' => $data
            ))
        ));
    }
    
    /**
     * Request content regeneration
     */
    private function request_content_regeneration($pipeline_id, $reason) {
        if (!$this->api_key) {
            return;
        }
        
        wp_remote_post('https://api.autoblog.com/v1/content/regenerate/' . $pipeline_id, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode(array(
                'reason' => $reason,
                'priority' => 'high'
            ))
        ));
    }
    
    /**
     * Process content published notification
     */
    private function process_content_published($content_data, $pipeline_id) {
        // Find the WordPress post
        $posts = get_posts(array(
            'meta_key' => 'autoblog_pipeline_id',
            'meta_value' => $pipeline_id,
            'post_status' => 'any'
        ));
        
        if (empty($posts)) {
            return new WP_Error('post_not_found', 'WordPress post not found');
        }
        
        $post_id = $posts[0]->ID;
        
        // Update post meta with published data
        update_post_meta($post_id, 'autoblog_published_date', current_time('mysql'));
        update_post_meta($post_id, 'autoblog_performance_data', json_encode($content_data));
        
        return $post_id;
    }
    
    /**
     * Process content failed notification
     */
    private function process_content_failed($content_data, $pipeline_id) {
        // Log the failure
        error_log(sprintf(
            'AutoBlog content generation failed for pipeline %s: %s',
            $pipeline_id,
            $content_data['error_message'] ?? 'Unknown error'
        ));
        
        // Send notification to admins
        $admin_email = get_option('admin_email');
        $subject = '[AutoBlog] Content Generation Failed';
        $message = sprintf(
            \"Content generation failed for pipeline: %s\\n\\n\" .
            \"Error: %s\\n\\n\" .
            \"Time: %s\",
            $pipeline_id,
            $content_data['error_message'] ?? 'Unknown error',
            current_time('mysql')
        );
        
        wp_mail($admin_email, $subject, $message);
        
        return true;
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            'AutoBlog Settings',
            'AutoBlog',
            'manage_options',
            'autoblog-settings',
            array($this, 'settings_page')
        );
    }
    
    /**
     * Initialize settings
     */
    public function settings_init() {
        register_setting('autoblog_settings', 'autoblog_api_key');
        register_setting('autoblog_settings', 'autoblog_webhook_secret');
        register_setting('autoblog_settings', 'autoblog_auto_publish');
        register_setting('autoblog_settings', 'autoblog_minimum_quality_score');
        register_setting('autoblog_settings', 'autoblog_author_id');
        register_setting('autoblog_settings', 'autoblog_default_category');
        register_setting('autoblog_settings', 'autoblog_notification_emails');
    }
    
    /**
     * Settings page HTML
     */
    public function settings_page() {
        ?>
        <div class=\"wrap\">
            <h1>AutoBlog Settings</h1>
            <form method=\"post\" action=\"options.php\">
                <?php settings_fields('autoblog_settings'); ?>
                <table class=\"form-table\">
                    <tr>
                        <th scope=\"row\">API Key</th>
                        <td>
                            <input type=\"password\" name=\"autoblog_api_key\" value=\"<?php echo esc_attr(get_option('autoblog_api_key')); ?>\" class=\"regular-text\" />
                            <p class=\"description\">Your AutoBlog API key</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope=\"row\">Webhook Secret</th>
                        <td>
                            <input type=\"password\" name=\"autoblog_webhook_secret\" value=\"<?php echo esc_attr(get_option('autoblog_webhook_secret')); ?>\" class=\"regular-text\" />
                            <p class=\"description\">Webhook secret for signature verification</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope=\"row\">Auto Publish</th>
                        <td>
                            <input type=\"checkbox\" name=\"autoblog_auto_publish\" value=\"1\" <?php checked(get_option('autoblog_auto_publish'), 1); ?> />
                            <p class=\"description\">Automatically publish content or save as draft</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope=\"row\">Minimum Quality Score</th>
                        <td>
                            <input type=\"number\" name=\"autoblog_minimum_quality_score\" value=\"<?php echo esc_attr(get_option('autoblog_minimum_quality_score', 85)); ?>\" min=\"0\" max=\"100\" />
                            <p class=\"description\">Minimum quality score to accept content (0-100)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope=\"row\">Default Author</th>
                        <td>
                            <?php wp_dropdown_users(array(
                                'name' => 'autoblog_author_id',
                                'selected' => get_option('autoblog_author_id', 1),
                                'show_option_none' => 'Select Author'
                            )); ?>
                            <p class=\"description\">Default author for AutoBlog posts</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope=\"row\">Notification Emails</th>
                        <td>
                            <input type=\"text\" name=\"autoblog_notification_emails\" value=\"<?php echo esc_attr(get_option('autoblog_notification_emails')); ?>\" class=\"regular-text\" />
                            <p class=\"description\">Comma-separated email addresses for notifications</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            
            <h2>Webhook URL</h2>
            <p>Configure this URL in your AutoBlog dashboard:</p>
            <code><?php echo home_url('/wp-json/autoblog/v1/webhook'); ?></code>
        </div>
        <?php
    }
    
    /**
     * Configuration notice
     */
    public function configuration_notice() {
        ?>
        <div class=\"notice notice-warning is-dismissible\">
            <p><strong>AutoBlog:</strong> Please configure your API key and webhook secret in the <a href=\"<?php echo admin_url('options-general.php?page=autoblog-settings'); ?>\">settings page</a>.</p>
        </div>
        <?php
    }
}

// Initialize the plugin
new AutoBlogWordPressIntegration();

?>