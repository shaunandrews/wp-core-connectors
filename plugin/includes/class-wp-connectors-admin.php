<?php
/**
 * Connectors Admin Settings Page.
 *
 * Registers the Settings » Connectors page and passes connector data to JS.
 * The UI is rendered entirely client-side for interactive card states.
 *
 * @package WP_Connectors
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_Connectors_Admin {

	const PAGE_SLUG = 'wp-connectors';

	/**
	 * Boot the admin hooks.
	 */
	public static function init() {
		$instance = new self();
		add_action( 'admin_menu', array( $instance, 'add_menu_page' ) );
		add_action( 'admin_enqueue_scripts', array( $instance, 'enqueue_assets' ) );
	}

	/**
	 * Add the Connectors page under Settings.
	 */
	public function add_menu_page() {
		add_options_page(
			__( 'Connectors', 'wp-connectors' ),
			__( 'Connectors', 'wp-connectors' ),
			'manage_options',
			self::PAGE_SLUG,
			array( $this, 'render_page' )
		);

		add_action( 'admin_menu', array( $this, 'reorder_submenu' ), 999 );
	}

	/**
	 * Place Connectors between General and Writing in the Settings submenu.
	 */
	public function reorder_submenu() {
		global $submenu;

		if ( ! isset( $submenu['options-general.php'] ) ) {
			return;
		}

		$connectors_item = null;
		$connectors_key  = null;

		foreach ( $submenu['options-general.php'] as $key => $item ) {
			if ( isset( $item[2] ) && self::PAGE_SLUG === $item[2] ) {
				$connectors_item = $item;
				$connectors_key  = $key;
				break;
			}
		}

		if ( null === $connectors_item ) {
			return;
		}

		unset( $submenu['options-general.php'][ $connectors_key ] );

		$reordered = array();
		$inserted  = false;

		foreach ( $submenu['options-general.php'] as $item ) {
			$reordered[] = $item;
			if ( ! $inserted && isset( $item[2] ) && 'options-general.php' === $item[2] ) {
				$reordered[] = $connectors_item;
				$inserted    = true;
			}
		}

		if ( ! $inserted ) {
			array_unshift( $reordered, $connectors_item );
		}

		$submenu['options-general.php'] = $reordered;
	}

	/**
	 * Enqueue styles and scripts on this page only.
	 */
	public function enqueue_assets( $hook_suffix ) {
		if ( 'settings_page_' . self::PAGE_SLUG !== $hook_suffix ) {
			return;
		}

		wp_enqueue_style(
			'wp-connectors-admin',
			WP_CONNECTORS_URL . 'assets/css/admin.css',
			array(),
			WP_CONNECTORS_VERSION
		);

		wp_enqueue_script(
			'wp-connectors-admin',
			WP_CONNECTORS_URL . 'assets/js/admin.js',
			array(),
			WP_CONNECTORS_VERSION,
			true
		);

		wp_localize_script( 'wp-connectors-admin', 'wpConnectors', $this->get_connectors_data() );
	}

	/**
	 * Build the connector data array for JS.
	 */
	private function get_connectors_data() {
		$connectors = wp_get_connectors();
		$data       = array();

		foreach ( $connectors as $slug => $connector ) {
			$data[ $slug ] = array(
				'name'        => $connector['name'],
				'description' => $connector['description'],
				'icon'        => $connector['icon'],
				'fields'      => $connector['fields'],
				'help_url'    => $connector['help_url'],
			);
		}

		return $data;
	}

	/**
	 * Render the page shell. Cards are rendered by JS.
	 */
	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap wp-connectors-wrap">
			<h1><?php esc_html_e( 'Connectors', 'wp-connectors' ); ?></h1>
			<p class="wp-connectors-intro">
				<?php esc_html_e( 'Connect WordPress to external services. API keys entered here are available to any plugin that needs them — one place for all your connections.', 'wp-connectors' ); ?>
			</p>
			<div class="wp-connectors-grid" id="wp-connectors-grid"></div>
		</div>
		<?php
	}
}
