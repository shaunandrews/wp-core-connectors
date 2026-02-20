<?php
/**
 * Plugin Name: WP Connectors
 * Plugin URI:  https://wordpress.org/plugins/wp-connectors
 * Description: A centralized keychain and connection manager for API keys, OAuth flows, and external service integrations.
 * Version:     0.1.0-alpha
 * Requires at least: 6.7
 * Requires PHP: 7.4
 * Author:      WordPress Contributors
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wp-connectors
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WP_CONNECTORS_VERSION', '0.1.0-alpha' );
define( 'WP_CONNECTORS_FILE', __FILE__ );
define( 'WP_CONNECTORS_DIR', plugin_dir_path( __FILE__ ) );
define( 'WP_CONNECTORS_URL', plugin_dir_url( __FILE__ ) );

// Load classes.
require_once WP_CONNECTORS_DIR . 'includes/class-wp-connector-registry.php';
require_once WP_CONNECTORS_DIR . 'includes/class-wp-connectors-admin.php';

/**
 * Register a connector with the global registry.
 *
 * @param string $slug    Unique connector identifier.
 * @param array  $args    Connector definition.
 * @return bool True on success, false if slug already registered.
 */
function wp_register_connector( $slug, $args ) {
	return WP_Connector_Registry::get_instance()->register( $slug, $args );
}

/**
 * Get all registered connectors.
 *
 * @return array Registered connectors keyed by slug.
 */
function wp_get_connectors() {
	return WP_Connector_Registry::get_instance()->get_all();
}

/**
 * Get a single connector by slug.
 *
 * @param string $slug Connector slug.
 * @return array|null Connector definition or null.
 */
function wp_get_connector( $slug ) {
	return WP_Connector_Registry::get_instance()->get( $slug );
}

// Boot admin page.
add_action( 'plugins_loaded', array( 'WP_Connectors_Admin', 'init' ) );

// Register default connectors after all plugins have loaded.
add_action( 'init', function () {
	require_once WP_CONNECTORS_DIR . 'includes/default-connectors.php';
}, 5 );
