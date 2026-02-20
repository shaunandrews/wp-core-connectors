/**
 * WP Connectors — Admin UI
 *
 * Renders connector cards and manages state transitions.
 * States: idle → setup → connecting → connected ⇄ disabled
 *
 * This is a UI prototype — nothing persists to the database yet.
 */
( function() {
	'use strict';

	var connectors = window.wpConnectors || {};
	var state = {};   // { slug: 'idle' | 'setup' | 'connecting' | 'connected' | 'disabled' }
	var grid;
	var openMenu = null; // slug of currently open kebab menu

	function init() {
		grid = document.getElementById( 'wp-connectors-grid' );
		if ( ! grid ) {
			return;
		}

		for ( var slug in connectors ) {
			state[ slug ] = 'idle';
		}

		renderAll();
		grid.addEventListener( 'click', handleClick );

		// Close kebab menu on outside click.
		document.addEventListener( 'click', function( e ) {
			if ( openMenu && ! e.target.closest( '.wp-connector-menu' ) ) {
				closeMenu();
			}
		} );
	}

	// -------------------------------------------------------------------------
	// Rendering
	// -------------------------------------------------------------------------

	function renderAll() {
		var html = '';
		for ( var slug in connectors ) {
			html += renderCard( slug );
		}
		grid.innerHTML = html;
	}

	function renderCard( slug ) {
		var c = connectors[ slug ];
		var s = state[ slug ];

		var cls = 'wp-connector-card wp-connector-card--' + s;
		var html = '<div class="' + cls + '" data-connector="' + slug + '">';

		switch ( s ) {
			case 'idle':
				html += renderIdle( slug, c );
				break;
			case 'setup':
				html += renderSetup( slug, c );
				break;
			case 'connecting':
				html += renderConnecting( slug, c );
				break;
			case 'connected':
			case 'disabled':
				html += renderConnected( slug, c, s );
				break;
		}

		html += '</div>';
		return html;
	}

	function renderIdle( slug, c ) {
		return '' +
			'<div class="wp-connector-card__header">' +
				renderIcon( c ) +
				'<div class="wp-connector-card__info">' +
					'<div class="wp-connector-card__name">' + esc( c.name ) + '</div>' +
					'<p class="wp-connector-card__desc">' + esc( c.description ) + '</p>' +
				'</div>' +
			'</div>' +
			'<div class="wp-connector-card__footer">' +
				'<button type="button" class="button wp-connector-connect-btn">Connect</button>' +
			'</div>';
	}

	function renderSetup( slug, c ) {
		var field = c.fields[0] || {};
		return '' +
			'<div class="wp-connector-card__header">' +
				renderIcon( c ) +
				'<div class="wp-connector-card__info">' +
					'<div class="wp-connector-card__name">' + esc( c.name ) + '</div>' +
				'</div>' +
			'</div>' +
			'<div class="wp-connector-card__setup">' +
				'<label class="wp-connector-setup__label" for="wp-connector-input-' + slug + '">' + esc( field.label || 'API Key' ) + '</label>' +
				'<input type="password" id="wp-connector-input-' + slug + '" class="wp-connector-setup__input" placeholder="sk-..." autocomplete="off" />' +
				( field.description ? '<p class="wp-connector-setup__help">' + field.description + '</p>' : '' ) +
				'<div class="wp-connector-setup__actions">' +
					'<button type="button" class="button button-primary wp-connector-save-btn">Save</button>' +
					'<button type="button" class="button wp-connector-cancel-btn">Cancel</button>' +
				'</div>' +
			'</div>';
	}

	function renderConnecting( slug, c ) {
		return '' +
			'<div class="wp-connector-card__header">' +
				renderIcon( c ) +
				'<div class="wp-connector-card__info">' +
					'<div class="wp-connector-card__name">' + esc( c.name ) + '</div>' +
					'<p class="wp-connector-card__desc wp-connector-card__desc--muted">Verifying connection&hellip;</p>' +
				'</div>' +
			'</div>' +
			'<div class="wp-connector-card__loading">' +
				'<span class="spinner is-active"></span>' +
			'</div>';
	}

	function renderConnected( slug, c, s ) {
		var enabled = ( s === 'connected' );
		var menuOpen = ( openMenu === slug );

		return '' +
			'<div class="wp-connector-card__header">' +
				renderIcon( c ) +
				'<div class="wp-connector-card__info">' +
					'<div class="wp-connector-card__name">' + esc( c.name ) + '</div>' +
					( enabled
						? '<span class="wp-connector-badge wp-connector-badge--connected">Connected</span>'
						: '<span class="wp-connector-badge wp-connector-badge--disabled">Disabled</span>'
					) +
				'</div>' +
				'<div class="wp-connector-card__controls">' +
					'<label class="wp-connector-toggle">' +
						'<input type="checkbox" class="wp-connector-toggle__input"' + ( enabled ? ' checked' : '' ) + ' />' +
						'<span class="wp-connector-toggle__slider"></span>' +
					'</label>' +
					'<div class="wp-connector-menu">' +
						'<button type="button" class="wp-connector-menu__trigger" aria-label="Options">&bull;&bull;&bull;</button>' +
						'<div class="wp-connector-menu__dropdown' + ( menuOpen ? ' wp-connector-menu__dropdown--open' : '' ) + '">' +
							'<button type="button" class="wp-connector-menu__item wp-connector-replace-btn">Replace API key</button>' +
							'<button type="button" class="wp-connector-menu__item wp-connector-menu__item--danger wp-connector-disconnect-btn">Disconnect</button>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';
	}

	function renderIcon( c ) {
		if ( c.icon ) {
			return '<img src="' + esc( c.icon ) + '" alt="" class="wp-connector-card__icon" width="36" height="36" />';
		}
		return '<div class="wp-connector-card__icon wp-connector-card__icon--placeholder"></div>';
	}

	// -------------------------------------------------------------------------
	// Event handling
	// -------------------------------------------------------------------------

	function handleClick( e ) {
		var card = e.target.closest( '.wp-connector-card' );
		if ( ! card ) {
			return;
		}

		var slug = card.dataset.connector;

		// Connect button (idle → setup).
		if ( e.target.closest( '.wp-connector-connect-btn' ) ) {
			setState( slug, 'setup' );
			// Focus the input after render.
			setTimeout( function() {
				var input = grid.querySelector( '[data-connector="' + slug + '"] .wp-connector-setup__input' );
				if ( input ) {
					input.focus();
				}
			}, 50 );
			return;
		}

		// Save button (setup → connecting → connected).
		if ( e.target.closest( '.wp-connector-save-btn' ) ) {
			var input = card.querySelector( '.wp-connector-setup__input' );
			if ( input && input.value.trim() === '' ) {
				input.focus();
				input.classList.add( 'wp-connector-setup__input--error' );
				return;
			}
			setState( slug, 'connecting' );
			setTimeout( function() {
				setState( slug, 'connected' );
			}, 1500 );
			return;
		}

		// Cancel button (setup → idle).
		if ( e.target.closest( '.wp-connector-cancel-btn' ) ) {
			setState( slug, 'idle' );
			return;
		}

		// Toggle switch (connected ⇄ disabled).
		if ( e.target.closest( '.wp-connector-toggle__input' ) ) {
			var isEnabled = e.target.checked;
			setState( slug, isEnabled ? 'connected' : 'disabled' );
			return;
		}

		// Kebab menu trigger.
		if ( e.target.closest( '.wp-connector-menu__trigger' ) ) {
			e.stopPropagation();
			if ( openMenu === slug ) {
				closeMenu();
			} else {
				openMenu = slug;
				rerenderCard( slug );
			}
			return;
		}

		// Replace API key (connected → setup).
		if ( e.target.closest( '.wp-connector-replace-btn' ) ) {
			openMenu = null;
			setState( slug, 'setup' );
			return;
		}

		// Disconnect (connected → idle).
		if ( e.target.closest( '.wp-connector-disconnect-btn' ) ) {
			openMenu = null;
			setState( slug, 'idle' );
			return;
		}
	}

	// -------------------------------------------------------------------------
	// State management
	// -------------------------------------------------------------------------

	function setState( slug, newState ) {
		state[ slug ] = newState;
		rerenderCard( slug );
	}

	function rerenderCard( slug ) {
		var oldCard = grid.querySelector( '[data-connector="' + slug + '"]' );
		if ( ! oldCard ) {
			return;
		}
		var temp = document.createElement( 'div' );
		temp.innerHTML = renderCard( slug );
		oldCard.replaceWith( temp.firstElementChild );
	}

	function closeMenu() {
		if ( openMenu ) {
			var slug = openMenu;
			openMenu = null;
			rerenderCard( slug );
		}
	}

	// -------------------------------------------------------------------------
	// Utility
	// -------------------------------------------------------------------------

	function esc( str ) {
		var el = document.createElement( 'span' );
		el.textContent = str || '';
		return el.innerHTML;
	}

	// -------------------------------------------------------------------------
	// Boot
	// -------------------------------------------------------------------------

	document.addEventListener( 'DOMContentLoaded', init );
} )();
