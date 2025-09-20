<?php
/**
 * Plugin Name: Bead Pattern Designer
 * Description: Interactive tool for designing bead patterns. Supports Peyote, Brick, and Square stitches.
 * Version: 1.0.0
 * Author: a sleepy creative
 * License: GPL v2 or later
 * Text Domain: bead-pattern-designer
 */

// Prevent direct access (enhanced security)
if (!defined('ABSPATH')) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

// Define plugin constants
define('BPD_PLUGIN_URL', plugin_dir_url(__FILE__));
define('BPD_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('BPD_VERSION', '1.0.0');
define('BPD_MAX_INSTANCES', 10); // Maximum instances per page

// Include additional security functions
require_once BPD_PLUGIN_PATH . 'includes/security.php';

/**
 * Register plugin scripts and styles
 */
function bpd_register_assets() {
    // Register JavaScript
    wp_register_script(
        'bpd-app',
        BPD_PLUGIN_URL . 'assets/bundle.js',
        array(),
        BPD_VERSION,
        true
    );

    // Register CSS
    wp_register_style(
        'bpd-app',
        BPD_PLUGIN_URL . 'assets/bundle.css',
        array(),
        BPD_VERSION
    );
}
add_action('init', 'bpd_register_assets');

/**
 * Add security headers
 */
function bpd_add_security_headers() {
    if (!is_admin() && !headers_sent()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
    }
}
add_action('send_headers', 'bpd_add_security_headers');

/**
 * CSS value validation function
 */
function bpd_validate_css_dimension($value, $default = '100%') {
    $value = trim(sanitize_text_field($value));

    // Strict regex validation (only number + unit allowed)
    if (!preg_match('/^(\d+(?:\.\d+)?)(px|%|em|rem|vh|vw)$/', $value, $matches)) {
        return $default;
    }

    $number = floatval($matches[1]);
    $unit = $matches[2];

    // Value range validation
    if ($number <= 0 || $number > 10000) {
        return $default;
    }

    // Percentage must be between 0-100
    if ($unit === '%' && $number > 100) {
        return $default;
    }

    return $value;
}

/**
 * Shortcode handler function
 */
function bpd_render_app($atts) {
    // Limit instances per page
    static $instance_count = 0;
    if (++$instance_count > BPD_MAX_INSTANCES) {
        return '<p>' . esc_html__('Too many bead pattern instances on this page.', 'bead-pattern-designer') . '</p>';
    }

    // Process and validate shortcode attributes
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '800px',
        'class' => 'bead-pattern-designer-container'
    ), $atts);

    // Strict CSS value validation
    $width = bpd_validate_css_dimension($atts['width'], '100%');
    $height = bpd_validate_css_dimension($atts['height'], '800px');

    // Strict class name validation (only letters, numbers, hyphens, underscores allowed)
    $class = preg_replace('/[^a-zA-Z0-9_-]/', '', sanitize_text_field($atts['class']));
    if (empty($class)) {
        $class = 'bead-pattern-designer-container';
    }

    // Load scripts and styles
    wp_enqueue_script('bpd-app');
    wp_enqueue_style('bpd-app');

    // Generate unique ID (supports multiple instances per page)
    $unique_id = 'bpd-' . wp_generate_password(12, false, false);

    // Return HTML container (double escaped)
    $output = sprintf(
        '<div id="%s" class="%s" style="width: %s; min-height: %s; position: relative;" data-nonce="%s"></div>',
        esc_attr($unique_id),
        esc_attr($class),
        esc_attr($width),
        esc_attr($height),
        esc_attr(wp_create_nonce('bpd-app-' . $unique_id))
    );

    // App initialization script (with nonce)
    $nonce = wp_create_nonce('bpd-app-nonce');
    $output .= sprintf(
        '<script>
        document.addEventListener("DOMContentLoaded", function() {
            // Svelte app auto-initializes
            // Security nonce included
            window.bpdNonce = "%s";
        });
        </script>',
        esc_js($nonce)
    );

    return $output;
}
add_shortcode('bead-pattern', 'bpd_render_app');

/**
 * Add admin menu
 */
function bpd_admin_menu() {
    add_menu_page(
        'Bead Pattern Designer',
        'Bead Pattern',
        'manage_options',
        'bead-pattern-designer',
        'bpd_admin_page',
        'dashicons-grid-view',
        30
    );
}
add_action('admin_menu', 'bpd_admin_menu');

/**
 * Admin page content
 */
function bpd_admin_page() {
    // Recheck permissions
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have permission to access this page.', 'bead-pattern-designer'));
    }
    ?>
    <div class="wrap">
        <h1><?php echo esc_html__('Bead Pattern Designer', 'bead-pattern-designer'); ?></h1>
        <div class="card">
            <h2><?php echo esc_html__('How to Use', 'bead-pattern-designer'); ?></h2>
            <p><?php echo esc_html__('Insert the following shortcode into your page or post:', 'bead-pattern-designer'); ?></p>
            <code>[bead-pattern]</code>

            <h3><?php echo esc_html__('Options', 'bead-pattern-designer'); ?></h3>
            <ul>
                <li><code>[bead-pattern width="100%" height="600px"]</code> - <?php echo esc_html__('Adjust size', 'bead-pattern-designer'); ?></li>
                <li><code>[bead-pattern class="my-custom-class"]</code> - <?php echo esc_html__('Custom CSS class', 'bead-pattern-designer'); ?></li>
            </ul>
        </div>

        <div class="card">
            <h2><?php echo esc_html__('Test', 'bead-pattern-designer'); ?></h2>
            <p><?php echo esc_html__('Test the plugin below:', 'bead-pattern-designer'); ?></p>
            <?php echo do_shortcode('[bead-pattern height="600px"]'); ?>
        </div>
    </div>
    <?php
}

/**
 * Nonce verification for AJAX endpoints (future use)
 */
function bpd_verify_ajax_nonce() {
    if (!isset($_POST['nonce']) || !isset($_POST['instance_id'])) {
        wp_send_json_error(__('Security verification failed', 'bead-pattern-designer'), 403);
    }

    $instance_id = sanitize_text_field($_POST['instance_id']);
    if (!wp_verify_nonce($_POST['nonce'], 'bpd-app-' . $instance_id)) {
        wp_send_json_error(__('Security token is not valid', 'bead-pattern-designer'), 403);
    }

    return true;
}

/**
 * Example AJAX handler (for future expansion)
 */
function bpd_ajax_handler() {
    // Verify nonce
    bpd_verify_ajax_nonce();

    // Additional permission check
    if (!current_user_can('read')) {
        wp_send_json_error(__('Permission denied', 'bead-pattern-designer'), 403);
    }

    // AJAX processing logic
    wp_send_json_success(array('message' => 'OK'));
}
// Activate when using AJAX in the future
// add_action('wp_ajax_bpd_action', 'bpd_ajax_handler');
// add_action('wp_ajax_nopriv_bpd_action', 'bpd_ajax_handler');

/**
 * Run on plugin activation
 */
function bpd_activate() {
    // Check minimum requirements
    if (version_compare(PHP_VERSION, '7.2', '<')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die(__('This plugin requires PHP 7.2 or higher.', 'bead-pattern-designer'));
    }

    if (version_compare(get_bloginfo('version'), '5.0', '<')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die(__('This plugin requires WordPress 5.0 or higher.', 'bead-pattern-designer'));
    }

    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'bpd_activate');

/**
 * Run on plugin deactivation
 */
function bpd_deactivate() {
    // Cleanup tasks
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'bpd_deactivate');

/**
 * Error handling and logging
 */
function bpd_log_error($message, $context = array()) {
    if (defined('WP_DEBUG') && WP_DEBUG === true) {
        error_log(sprintf(
            '[Bead Pattern Designer] %s | Context: %s',
            $message,
            json_encode($context)
        ));
    }
}