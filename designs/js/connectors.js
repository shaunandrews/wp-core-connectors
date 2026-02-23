/**
 * Connectors — State Toggle Controls
 *
 * Powers the bottom bar that lets you flip each connector card
 * through its visual states (install, installing, activate, etc.)
 * for design review purposes. Persists selections to localStorage.
 */
( function() {
	var STORAGE_KEY = 'connectors-states';
	var VALID_STATES = [ 'install', 'installing', 'activate', 'connect', 'setup', 'connected', 'edit' ];

	/**
	 * Set a connector card to a given state and update the
	 * corresponding control button's active class.
	 */
	function setState( connector, state ) {
		// Update the card.
		var card = document.querySelector( '.connector-card[data-connector="' + connector + '"]' );
		if ( card ) {
			card.dataset.state = state;
		}

		// Update the buttons — deactivate all for this connector, activate the match.
		var buttons = document.querySelectorAll( '.state-controls__btn[data-connector="' + connector + '"]' );
		for ( var i = 0; i < buttons.length; i++ ) {
			buttons[ i ].classList.toggle( 'is-active', buttons[ i ].dataset.state === state );
		}
	}

	/**
	 * Read every card's current state and write the map to localStorage.
	 */
	function saveStates() {
		var states = {};
		var cards = document.querySelectorAll( '.connector-card' );
		for ( var i = 0; i < cards.length; i++ ) {
			states[ cards[ i ].dataset.connector ] = cards[ i ].dataset.state;
		}
		try {
			localStorage.setItem( STORAGE_KEY, JSON.stringify( states ) );
		} catch ( e ) {
			// Storage full or unavailable — silently fail.
		}
	}

	/**
	 * On load, restore any previously saved states from localStorage.
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
		} catch ( e ) {
			// Bad JSON or missing — leave defaults.
		}
	}

	// Delegated click handler on the controls bar.
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

	// Restore saved states on page load.
	loadStates();
} )();
