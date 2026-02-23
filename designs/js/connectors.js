/**
 * Connectors — State Toggle Controls + Install Flow Simulation
 *
 * Two things:
 * 1. Bottom bar lets you flip each card to any state manually.
 * 2. Clicking the actual card buttons simulates the install flow:
 *    Install → Installing (1.5s) → Setup → (Save) → Connected
 *    Connected → (Edit) → Edit → (Cancel) → Connected
 *    Setup → (Cancel) → Install
 */
( function() {
	var STORAGE_KEY = 'connectors-states';
	var VALID_STATES = [ 'install', 'installing', 'activate', 'connect', 'setup', 'connected', 'edit' ];

	/**
	 * Set a connector card to a given state and sync the control bar.
	 */
	function setState( connector, state ) {
		var card = document.querySelector( '.connector-card[data-connector="' + connector + '"]' );
		if ( card ) {
			card.dataset.state = state;
		}

		// Sync bottom bar buttons.
		var buttons = document.querySelectorAll( '.state-controls__btn[data-connector="' + connector + '"]' );
		for ( var i = 0; i < buttons.length; i++ ) {
			buttons[ i ].classList.toggle( 'is-active', buttons[ i ].dataset.state === state );
		}
	}

	/**
	 * Persist current states to localStorage.
	 */
	function saveStates() {
		var states = {};
		var cards = document.querySelectorAll( '.connector-card' );
		for ( var i = 0; i < cards.length; i++ ) {
			states[ cards[ i ].dataset.connector ] = cards[ i ].dataset.state;
		}
		try {
			localStorage.setItem( STORAGE_KEY, JSON.stringify( states ) );
		} catch ( e ) {}
	}

	/**
	 * Restore states from localStorage on page load.
	 */
	function loadStates() {
		try {
			var stored = JSON.parse( localStorage.getItem( STORAGE_KEY ) );
			if ( ! stored || typeof stored !== 'object' ) {
				return;
			}
			var keys = Object.keys( stored );
			for ( var i = 0; i < keys.length; i++ ) {
				if ( VALID_STATES.indexOf( stored[ keys[ i ] ] ) !== -1 ) {
					setState( keys[ i ], stored[ keys[ i ] ] );
				}
			}
		} catch ( e ) {}
	}

	/**
	 * Get the connector slug from an element inside a card.
	 */
	function getConnector( el ) {
		var card = el.closest( '.connector-card' );
		return card ? card.dataset.connector : null;
	}

	// ---------------------------------------------------------------
	// Bottom bar — manual state switching
	// ---------------------------------------------------------------
	var controlsBar = document.querySelector( '.state-controls' );
	if ( controlsBar ) {
		controlsBar.addEventListener( 'click', function( e ) {
			var btn = e.target.closest( '.state-controls__btn' );
			if ( ! btn ) {
				return;
			}
			setState( btn.dataset.connector, btn.dataset.state );
			saveStates();
		} );
	}

	// ---------------------------------------------------------------
	// Card buttons — simulate install flow
	// ---------------------------------------------------------------
	var frame = document.querySelector( '.wp-connectors-frame' );
	if ( frame ) {
		frame.addEventListener( 'click', function( e ) {
			var btn = e.target.closest( 'button' );
			if ( ! btn ) {
				return;
			}

			var connector = getConnector( btn );
			if ( ! connector ) {
				return;
			}

			// Install → Installing (1.5s) → Setup
			if ( btn.classList.contains( 'action-install' ) ) {
				setState( connector, 'installing' );
				saveStates();
				setTimeout( function() {
					setState( connector, 'setup' );
					saveStates();
				}, 1500 );
				return;
			}

			// Activate → Setup (skip to key entry)
			if ( btn.classList.contains( 'action-activate' ) ) {
				setState( connector, 'setup' );
				saveStates();
				return;
			}

			// Connect → Setup
			if ( btn.classList.contains( 'action-connect' ) ) {
				setState( connector, 'setup' );
				saveStates();
				return;
			}

			// Save → Connected
			if ( btn.classList.contains( 'action-save' ) ) {
				setState( connector, 'connected' );
				saveStates();
				return;
			}

			// Edit → Edit state (expand edit body)
			if ( btn.classList.contains( 'action-edit' ) ) {
				setState( connector, 'edit' );
				saveStates();
				return;
			}

			// Cancel — context-dependent
			if ( btn.classList.contains( 'action-cancel' ) ) {
				var card = btn.closest( '.connector-card' );
				if ( card && card.dataset.state === 'edit' ) {
					// Cancel from edit → back to connected
					setState( connector, 'connected' );
				} else {
					// Cancel from setup → back to install
					setState( connector, 'install' );
				}
				saveStates();
				return;
			}

			// Remove and replace → back to setup (fresh key entry)
			if ( btn.classList.contains( 'action-remove' ) ) {
				setState( connector, 'setup' );
				saveStates();
				return;
			}
		} );
	}

	// Restore on load.
	loadStates();
} )();
