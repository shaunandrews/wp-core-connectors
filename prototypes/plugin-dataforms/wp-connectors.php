<?php
/**
 * Plugin Name: WP Connectors
 * Plugin URI:  https://wordpress.org/plugins/wp-connectors
 * Description: Dataforms accordion prototype — a centralized keychain and connection manager for API keys, OAuth flows, and external service integrations.
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

if ( ! defined( 'WP_CONNECTORS_VERSION' ) ) {
	define( 'WP_CONNECTORS_VERSION', '0.1.0-alpha' );
}
if ( ! defined( 'WP_CONNECTORS_FILE' ) ) {
	define( 'WP_CONNECTORS_FILE', __FILE__ );
}
if ( ! defined( 'WP_CONNECTORS_DIR' ) ) {
	define( 'WP_CONNECTORS_DIR', plugin_dir_path( __FILE__ ) );
}
if ( ! defined( 'WP_CONNECTORS_URL' ) ) {
	define( 'WP_CONNECTORS_URL', plugin_dir_url( __FILE__ ) );
}

// Load classes.
if ( ! class_exists( 'WP_Connector_Registry' ) ) {
	require_once WP_CONNECTORS_DIR . 'includes/class-wp-connector-registry.php';
}
require_once WP_CONNECTORS_DIR . 'includes/class-wp-connectors-admin.php';

if ( ! function_exists( 'wp_register_connector' ) ) {
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
}

if ( ! function_exists( 'wp_get_connectors' ) ) {
	/**
	 * Get all registered connectors.
	 *
	 * @return array Registered connectors keyed by slug.
	 */
	function wp_get_connectors() {
		return WP_Connector_Registry::get_instance()->get_all();
	}
}

if ( ! function_exists( 'wp_get_connector' ) ) {
	/**
	 * Get a single connector by slug.
	 *
	 * @param string $slug Connector slug.
	 * @return array|null Connector definition or null.
	 */
	function wp_get_connector( $slug ) {
		return WP_Connector_Registry::get_instance()->get( $slug );
	}
}

// Boot admin page.
add_action( 'plugins_loaded', array( 'WP_Connectors_Dataforms_Admin', 'init' ) );

// Register default connectors after all plugins have loaded.
add_action( 'init', function () {
	if ( ! did_action( 'wp_connectors_defaults_loaded' ) ) {
		require_once WP_CONNECTORS_DIR . 'includes/default-connectors.php';
		do_action( 'wp_connectors_defaults_loaded' );
	}
}, 5 );
