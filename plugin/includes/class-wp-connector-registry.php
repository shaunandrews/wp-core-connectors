<?php
/**
 * Connector Registry.
 *
 * Manages the collection of registered connectors. Plugins use
 * wp_register_connector() to add their own entries.
 *
 * @package WP_Connectors
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_Connector_Registry {

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static $instance = null;

	/**
	 * Registered connectors keyed by slug.
	 *
	 * @var array
	 */
	private $connectors = array();

	/**
	 * Get the singleton instance.
	 *
	 * @return self
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {}

	/**
	 * Register a connector.
	 *
	 * @param string $slug Unique identifier.
	 * @param array  $args {
	 *     Connector definition.
	 *
	 *     @type string   $name          Display name.
	 *     @type string   $description   Short description shown on the settings page.
	 *     @type string   $icon          URL to an SVG/PNG icon (optional).
	 *     @type string   $auth_type     'api_key', 'oauth', or 'custom'. Default 'api_key'.
	 *     @type array    $fields        Array of field definitions. Each field:
	 *                                     - name        (string) Field key.
	 *                                     - label       (string) Human label.
	 *                                     - type        (string) 'text' or 'password'. Default 'password'.
	 *                                     - description (string) Help text.
	 *     @type string   $help_url      Link to provider docs or key signup page.
	 *     @type callable $test_callback Optional callback to verify credentials.
	 *     @type string   $category      Grouping label, e.g. 'AI', 'Email', 'Analytics'.
	 * }
	 * @return bool True on success, false if slug already exists.
	 */
	public function register( $slug, $args ) {
		$slug = sanitize_key( $slug );

		if ( isset( $this->connectors[ $slug ] ) ) {
			return false;
		}

		$defaults = array(
			'name'          => '',
			'description'   => '',
			'icon'          => '',
			'auth_type'     => 'api_key',
			'fields'        => array(),
			'help_url'      => '',
			'test_callback' => null,
			'category'      => 'General',
		);

		$connector = wp_parse_args( $args, $defaults );

		// Ensure each field has sensible defaults.
		foreach ( $connector['fields'] as $i => $field ) {
			$connector['fields'][ $i ] = wp_parse_args( $field, array(
				'name'        => '',
				'label'       => '',
				'type'        => 'password',
				'description' => '',
			) );
		}

		$this->connectors[ $slug ] = $connector;
		return true;
	}

	/**
	 * Get a connector by slug.
	 *
	 * @param string $slug Connector slug.
	 * @return array|null
	 */
	public function get( $slug ) {
		return isset( $this->connectors[ $slug ] ) ? $this->connectors[ $slug ] : null;
	}

	/**
	 * Get all registered connectors.
	 *
	 * @return array
	 */
	public function get_all() {
		return $this->connectors;
	}

	/**
	 * Check if a connector has stored credentials.
	 *
	 * @param string $slug Connector slug.
	 * @return bool
	 */
	public function is_connected( $slug ) {
		$connector = $this->get( $slug );
		if ( ! $connector ) {
			return false;
		}

		foreach ( $connector['fields'] as $field ) {
			$value = get_option( "wp_connector_{$slug}_{$field['name']}", '' );
			if ( ! empty( $value ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Get the stored value for a connector field.
	 *
	 * @param string $slug       Connector slug.
	 * @param string $field_name Field name.
	 * @return string
	 */
	public function get_field_value( $slug, $field_name ) {
		return get_option( "wp_connector_{$slug}_{$field_name}", '' );
	}

	/**
	 * Mask a sensitive string for display.
	 *
	 * Shows the first 4 and last 4 characters with bullets in between.
	 *
	 * @param string $value The value to mask.
	 * @return string
	 */
	public static function mask_value( $value ) {
		$len = strlen( $value );
		if ( $len <= 8 ) {
			return str_repeat( '&bull;', $len );
		}
		return substr( $value, 0, 4 ) . str_repeat( '&bull;', min( $len - 8, 20 ) ) . substr( $value, -4 );
	}
}
