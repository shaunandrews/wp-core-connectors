/**
 * WP Connectors — Accordion / Dataforms UI.
 *
 * Renders connectors as a vertical list of expandable sections.
 * Only one section open at a time; all state is client-side (prototype).
 */
( function () {
	'use strict';

	if ( typeof wpConnectors === 'undefined' ) {
		return;
	}

	/** Track which connector slug is currently expanded (or null). */
	var expandedSlug = null;

	/** Map of slug → { connected: bool, value: string }. */
	var state = {};

	/**
	 * Escape HTML for safe insertion.
	 */
	function esc( str ) {
		var el = document.createElement( 'div' );
		el.appendChild( document.createTextNode( str ) );
		return el.innerHTML;
	}

	/**
	 * Create a masked key string.
	 */
	function maskKey( value ) {
		if ( ! value ) {
			return '';
		}
		return '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';
	}

	/**
	 * Build the HTML for a single accordion row.
	 */
	function renderRow( slug, connector ) {
		var s          = state[ slug ] || { connected: false, value: '' };
		var isExpanded = expandedSlug === slug;
		var statusClass = s.connected ? 'connected' : 'disconnected';
		var statusText  = s.connected ? 'Connected' : 'Not connected';

		var html = '';

		// Row header (always visible).
		html += '<div class="wp-connector-row' + ( isExpanded ? ' is-expanded' : '' ) + '" data-slug="' + esc( slug ) + '">';
		html += '<button type="button" class="wp-connector-row__header" aria-expanded="' + ( isExpanded ? 'true' : 'false' ) + '">';
		html += '<span class="wp-connector-row__icon">';
		if ( connector.icon ) {
			html += '<img src="' + esc( connector.icon ) + '" alt="" width="24" height="24" />';
		}
		html += '</span>';
		html += '<span class="wp-connector-row__name">' + esc( connector.name ) + '</span>';
		html += '<span class="wp-connector-row__status ' + statusClass + '">';
		html += '<span class="wp-connector-row__status-dot"></span>';
		html += '<span class="wp-connector-row__status-text">' + esc( statusText ) + '</span>';
		html += '</span>';
		html += '<span class="wp-connector-row__chevron" aria-hidden="true"></span>';
		html += '</button>';

		// Expandable body.
		html += '<div class="wp-connector-row__body">';
		html += '<div class="wp-connector-row__body-inner">';

		// Description.
		html += '<p class="wp-connector-row__description">' + esc( connector.description ) + '</p>';

		if ( s.connected ) {
			// Connected state: show masked key + replace / disconnect.
			html += '<div class="wp-connector-row__connected-info">';
			html += '<div class="wp-connector-row__field-group">';
			html += '<label class="wp-connector-row__label">' + esc( connector.fields[0].label ) + '</label>';
			html += '<div class="wp-connector-row__masked-key">' + maskKey( s.value ) + '</div>';
			html += '</div>';
			html += '<div class="wp-connector-row__actions">';
			html += '<a href="#" class="wp-connector-row__replace" data-slug="' + esc( slug ) + '">Replace</a>';
			html += '<a href="#" class="wp-connector-row__disconnect" data-slug="' + esc( slug ) + '">Disconnect</a>';
			html += '</div>';
			html += '</div>';
		} else {
			// Disconnected state: show input + help + save.
			var field = connector.fields[0];

			html += '<div class="wp-connector-row__field-group">';
			html += '<label class="wp-connector-row__label" for="wp-connector-field-' + esc( slug ) + '">' + esc( field.label ) + '</label>';
			html += '<input type="password" id="wp-connector-field-' + esc( slug ) + '" class="wp-connector-row__input" placeholder="Enter your API key" data-slug="' + esc( slug ) + '" autocomplete="off" />';
			if ( field.description ) {
				html += '<p class="wp-connector-row__help">' + field.description + '</p>';
			}
			html += '</div>';
			html += '<div class="wp-connector-row__actions">';
			html += '<button type="button" class="button button-primary wp-connector-row__save" data-slug="' + esc( slug ) + '">Save</button>';
			html += '<span class="spinner wp-connector-row__spinner"></span>';
			html += '</div>';
		}

		html += '</div>'; // __body-inner
		html += '</div>'; // __body
		html += '</div>'; // __row

		return html;
	}

	/**
	 * Render the full accordion into the container.
	 */
	function render() {
		var container = document.getElementById( 'wp-connectors-accordion' );
		if ( ! container ) {
			return;
		}

		var html = '';
		for ( var slug in wpConnectors ) {
			if ( wpConnectors.hasOwnProperty( slug ) ) {
				html += renderRow( slug, wpConnectors[ slug ] );
			}
		}

		container.innerHTML = html;
		bindEvents( container );
	}

	/**
	 * Bind click/interaction events after render.
	 */
	function bindEvents( container ) {
		// Header clicks — toggle accordion.
		var headers = container.querySelectorAll( '.wp-connector-row__header' );
		for ( var i = 0; i < headers.length; i++ ) {
			headers[ i ].addEventListener( 'click', onHeaderClick );
		}

		// Save buttons.
		var saveButtons = container.querySelectorAll( '.wp-connector-row__save' );
		for ( var j = 0; j < saveButtons.length; j++ ) {
			saveButtons[ j ].addEventListener( 'click', onSave );
		}

		// Replace links.
		var replaceLinks = container.querySelectorAll( '.wp-connector-row__replace' );
		for ( var k = 0; k < replaceLinks.length; k++ ) {
			replaceLinks[ k ].addEventListener( 'click', onReplace );
		}

		// Disconnect links.
		var disconnectLinks = container.querySelectorAll( '.wp-connector-row__disconnect' );
		for ( var m = 0; m < disconnectLinks.length; m++ ) {
			disconnectLinks[ m ].addEventListener( 'click', onDisconnect );
		}

		// Allow Enter in input fields to trigger save.
		var inputs = container.querySelectorAll( '.wp-connector-row__input' );
		for ( var n = 0; n < inputs.length; n++ ) {
			inputs[ n ].addEventListener( 'keydown', function ( e ) {
				if ( e.key === 'Enter' ) {
					e.preventDefault();
					var slug = this.getAttribute( 'data-slug' );
					var btn  = container.querySelector( '.wp-connector-row__save[data-slug="' + slug + '"]' );
					if ( btn ) {
						btn.click();
					}
				}
			} );
		}
	}

	/**
	 * Toggle accordion section.
	 */
	function onHeaderClick( e ) {
		var row  = e.currentTarget.closest( '.wp-connector-row' );
		var slug = row.getAttribute( 'data-slug' );

		if ( expandedSlug === slug ) {
			expandedSlug = null;
		} else {
			expandedSlug = slug;
		}

		render();
	}

	/**
	 * Handle Save button click.
	 */
	function onSave( e ) {
		e.preventDefault();
		var slug     = this.getAttribute( 'data-slug' );
		var input    = document.getElementById( 'wp-connector-field-' + slug );
		var value    = input ? input.value.trim() : '';
		var spinner  = this.parentNode.querySelector( '.wp-connector-row__spinner' );
		var button   = this;

		if ( ! value ) {
			input.focus();
			return;
		}

		// Show loading state.
		button.disabled = true;
		button.textContent = 'Saving\u2026';
		if ( spinner ) {
			spinner.classList.add( 'is-active' );
		}

		// Simulate async save.
		setTimeout( function () {
			state[ slug ] = { connected: true, value: value };
			render();
		}, 800 );
	}

	/**
	 * Handle Replace link click.
	 */
	function onReplace( e ) {
		e.preventDefault();
		var slug = this.getAttribute( 'data-slug' );

		// Set to disconnected so the input appears, but keep the section expanded.
		state[ slug ] = { connected: false, value: '' };
		expandedSlug  = slug;
		render();

		// Focus the input after render.
		var input = document.getElementById( 'wp-connector-field-' + slug );
		if ( input ) {
			input.focus();
		}
	}

	/**
	 * Handle Disconnect link click.
	 */
	function onDisconnect( e ) {
		e.preventDefault();
		var slug = this.getAttribute( 'data-slug' );

		state[ slug ] = { connected: false, value: '' };
		render();
	}

	/**
	 * Initialize state and render.
	 */
	function init() {
		for ( var slug in wpConnectors ) {
			if ( wpConnectors.hasOwnProperty( slug ) ) {
				state[ slug ] = { connected: false, value: '' };
			}
		}
		render();
	}

	// Boot on DOM ready.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
