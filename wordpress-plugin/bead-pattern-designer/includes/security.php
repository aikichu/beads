<?php
/**
 * Bead Pattern Designer - Security Functions
 *
 * Additional security utility functions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

/**
 * Deep sanitization of input data
 */
function bpd_deep_sanitize($data) {
    if (is_array($data)) {
        return array_map('bpd_deep_sanitize', $data);
    } elseif (is_object($data)) {
        $sanitized = new stdClass();
        foreach ($data as $key => $value) {
            $sanitized->$key = bpd_deep_sanitize($value);
        }
        return $sanitized;
    } else {
        // Remove HTML tags and escape special characters
        $data = wp_strip_all_tags($data);
        $data = sanitize_text_field($data);

        // Remove JavaScript event handler patterns
        $data = preg_replace('/on\w+\s*=\s*["\'].*?["\']/i', '', $data);

        // Remove JavaScript URLs
        $data = str_ireplace('javascript:', '', $data);
        $data = str_ireplace('data:', '', $data);
        $data = str_ireplace('vbscript:', '', $data);

        return $data;
    }
}

/**
 * Generate security token (enhanced version)
 */
function bpd_create_secure_token($action = '') {
    $user_id = get_current_user_id();
    $session_token = wp_get_session_token();
    $site_url = get_site_url();

    return wp_hash($action . $user_id . $session_token . $site_url);
}

/**
 * Verify security token
 */
function bpd_verify_secure_token($token, $action = '') {
    $expected_token = bpd_create_secure_token($action);

    return hash_equals($expected_token, $token);
}

/**
 * IP address based rate limiting
 */
function bpd_check_rate_limit($action = 'default', $max_attempts = 60, $window = 60) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $transient_key = 'bpd_rate_' . md5($ip . $action);

    $attempts = get_transient($transient_key);

    if ($attempts === false) {
        set_transient($transient_key, 1, $window);
        return true;
    }

    if ($attempts >= $max_attempts) {
        bpd_log_error('Rate limit exceeded', array(
            'ip' => $ip,
            'action' => $action,
            'attempts' => $attempts
        ));
        return false;
    }

    set_transient($transient_key, $attempts + 1, $window);
    return true;
}

/**
 * Add Content Security Policy meta tag
 */
function bpd_add_csp_meta() {
    if (!is_admin()) {
        $csp = "default-src 'self'; ";
        $csp .= "script-src 'self' 'unsafe-inline'; ";
        $csp .= "style-src 'self' 'unsafe-inline'; ";
        $csp .= "img-src 'self' data:; ";
        $csp .= "font-src 'self'; ";
        $csp .= "connect-src 'self'; ";
        $csp .= "frame-ancestors 'none'; ";
        $csp .= "base-uri 'self'; ";
        $csp .= "form-action 'self';";

        echo '<meta http-equiv="Content-Security-Policy" content="' . esc_attr($csp) . '">' . "\n";
    }
}
add_action('wp_head', 'bpd_add_csp_meta', 1);

/**
 * File upload validation (future use)
 */
function bpd_validate_file_upload($file) {
    // Allowed MIME types
    $allowed_types = array(
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
    );

    // Maximum file size (5MB)
    $max_size = 5 * 1024 * 1024;

    // MIME type validation
    $file_info = wp_check_filetype_and_ext($file['tmp_name'], $file['name']);

    if (!in_array($file_info['type'], $allowed_types)) {
        return new WP_Error('invalid_file_type', __('File type not allowed.', 'bead-pattern-designer'));
    }

    // File size validation
    if ($file['size'] > $max_size) {
        return new WP_Error('file_too_large', __('File too large. Maximum 5MB allowed.', 'bead-pattern-designer'));
    }

    // Verify it's actually an image
    $image_data = getimagesize($file['tmp_name']);
    if ($image_data === false) {
        return new WP_Error('invalid_image', __('Not a valid image file.', 'bead-pattern-designer'));
    }

    return true;
}

/**
 * Secure SQL query wrapper (future use)
 */
function bpd_secure_query($query, $params = array()) {
    global $wpdb;

    if (empty($params)) {
        return $wpdb->query($query);
    }

    // Auto-detect and sanitize parameter types
    $sanitized_params = array();
    foreach ($params as $param) {
        if (is_int($param)) {
            $sanitized_params[] = intval($param);
        } elseif (is_float($param)) {
            $sanitized_params[] = floatval($param);
        } else {
            $sanitized_params[] = sanitize_text_field($param);
        }
    }

    $prepared_query = $wpdb->prepare($query, $sanitized_params);
    return $wpdb->query($prepared_query);
}

/**
 * Security audit log
 */
function bpd_security_audit($event, $details = array()) {
    if (!defined('BPD_SECURITY_AUDIT') || BPD_SECURITY_AUDIT !== true) {
        return;
    }

    $log_entry = array(
        'timestamp' => current_time('mysql'),
        'event' => sanitize_text_field($event),
        'user_id' => get_current_user_id(),
        'ip_address' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'],
        'details' => bpd_deep_sanitize($details)
    );

    // Save log as option (max 100 entries)
    $audit_log = get_option('bpd_security_audit_log', array());
    array_unshift($audit_log, $log_entry);
    $audit_log = array_slice($audit_log, 0, 100);

    update_option('bpd_security_audit_log', $audit_log);
}