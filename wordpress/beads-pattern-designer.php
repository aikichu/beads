<?php
/**
 * Plugin Name: Beads Pattern Designer
 * Plugin URI: https://github.com/yourusername/beads-pattern-designer
 * Description: Interactive bead pattern designer for peyote, brick, and square stitch patterns
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: beads-pattern-designer
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('BPD_VERSION', '1.0.0');
define('BPD_PLUGIN_URL', plugin_dir_url(__FILE__));
define('BPD_PLUGIN_PATH', plugin_dir_path(__FILE__));

/**
 * Enqueue plugin scripts and styles
 */
function bpd_enqueue_assets() {
    // Only load on pages/posts that have our shortcode
    global $post;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'beads-designer')) {
        // Enqueue the bundled JavaScript
        wp_enqueue_script(
            'bpd-bundle',
            BPD_PLUGIN_URL . 'build/bundle.js',
            array(),
            BPD_VERSION,
            true
        );

        // Enqueue the bundled CSS
        wp_enqueue_style(
            'bpd-bundle',
            BPD_PLUGIN_URL . 'build/bundle.css',
            array(),
            BPD_VERSION
        );

        // Add inline script to initialize the app with WordPress-specific settings
        wp_add_inline_script('bpd-bundle', 'window.BPD_WP = { ajaxurl: "' . admin_url('admin-ajax.php') . '", nonce: "' . wp_create_nonce('bpd_nonce') . '" };', 'before');
    }
}
add_action('wp_enqueue_scripts', 'bpd_enqueue_assets');

/**
 * Register the shortcode
 */
function bpd_shortcode($atts) {
    // Parse shortcode attributes
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '600px',
        'grid-size' => '20',
        'stitch-type' => 'peyote',
        'layout-rotation' => '90',
        'id' => 'beads-designer-' . uniqid()
    ), $atts, 'beads-designer');

    // Generate unique container ID
    $container_id = esc_attr($atts['id']);

    // Build inline styles
    $styles = sprintf(
        'width: %s; height: %s; position: relative; overflow: hidden;',
        esc_attr($atts['width']),
        esc_attr($atts['height'])
    );

    // Build data attributes for the app
    $data_attrs = sprintf(
        'data-grid-size="%s" data-stitch-type="%s" data-layout-rotation="%s"',
        esc_attr($atts['grid-size']),
        esc_attr($atts['stitch-type']),
        esc_attr($atts['layout-rotation'])
    );

    // Return the container HTML
    $html = sprintf(
        '<div id="%s" class="beads-pattern-designer-container" style="%s" %s></div>',
        $container_id,
        $styles,
        $data_attrs
    );

    // Add initialization script for this specific instance
    $html .= sprintf(
        '<script>
            document.addEventListener("DOMContentLoaded", function() {
                if (typeof BeadApp !== "undefined" && BeadApp.init) {
                    BeadApp.init("%s");
                }
            });
        </script>',
        $container_id
    );

    return $html;
}
add_shortcode('beads-designer', 'bpd_shortcode');

/**
 * Admin menu for plugin settings (optional)
 */
function bpd_admin_menu() {
    add_menu_page(
        'Beads Pattern Designer',
        'Beads Designer',
        'manage_options',
        'beads-pattern-designer',
        'bpd_admin_page',
        'dashicons-art',
        30
    );
}
add_action('admin_menu', 'bpd_admin_menu');

/**
 * Admin settings page
 */
function bpd_admin_page() {
    ?>
    <div class="wrap">
        <h1>Beads Pattern Designer</h1>
        <p>Use the shortcode <code>[beads-designer]</code> to add the bead pattern designer to any page or post.</p>

        <h2>Shortcode Options</h2>
        <table class="form-table">
            <tr>
                <th>Attribute</th>
                <th>Default Value</th>
                <th>Description</th>
            </tr>
            <tr>
                <td><code>width</code></td>
                <td>100%</td>
                <td>Width of the designer container</td>
            </tr>
            <tr>
                <td><code>height</code></td>
                <td>600px</td>
                <td>Height of the designer container</td>
            </tr>
            <tr>
                <td><code>grid-size</code></td>
                <td>20</td>
                <td>Initial grid size (number of beads)</td>
            </tr>
            <tr>
                <td><code>stitch-type</code></td>
                <td>peyote</td>
                <td>Stitch type: peyote, brick, or square</td>
            </tr>
            <tr>
                <td><code>layout-rotation</code></td>
                <td>90</td>
                <td>Layout rotation in degrees (0, 90, 180, 270)</td>
            </tr>
        </table>

        <h3>Example Usage</h3>
        <pre><code>[beads-designer width="800px" height="500px" grid-size="30" stitch-type="brick"]</code></pre>
    </div>
    <?php
}

/**
 * Activation hook
 */
function bpd_activate() {
    // Create build directory if it doesn't exist
    $build_dir = BPD_PLUGIN_PATH . 'build';
    if (!file_exists($build_dir)) {
        wp_mkdir_p($build_dir);
    }
}
register_activation_hook(__FILE__, 'bpd_activate');

/**
 * Deactivation hook
 */
function bpd_deactivate() {
    // Clean up if needed
}
register_deactivation_hook(__FILE__, 'bpd_deactivate');