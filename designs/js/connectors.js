/**
 * Connectors — Install Flow Simulation
 *
 * Clicking card buttons simulates the install flow:
 * Install → Installing (1.5s) → Setup → (Save) → Connected
 * Connected → (Edit) → Edit → (Cancel) → Connected
 * Setup → (Cancel) → Needs Setup → (Set up) → Setup
 */
( function() {

	function setState( connector, state ) {
		var card = document.querySelector( '.connector-card[data-connector="' + connector + '"]' );
		if ( card ) {
			card.dataset.state = state;
		}
	}

	function getConnector( el ) {
		var card = el.closest( '.connector-card' );
		return card ? card.dataset.connector : null;
	}

	var frame = document.querySelector( '.wp-connectors-frame' );
	if ( ! frame ) {
		return;
	}

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
			setTimeout( function() {
				setState( connector, 'setup' );
			}, 1500 );
			return;
		}

		// Activate → Setup
		if ( btn.classList.contains( 'action-activate' ) ) {
			setState( connector, 'setup' );
			return;
		}

		// Connect → Setup
		if ( btn.classList.contains( 'action-connect' ) ) {
			setState( connector, 'setup' );
			return;
		}

		// Set up → Setup
		if ( btn.classList.contains( 'action-setup' ) ) {
			setState( connector, 'setup' );
			return;
		}

		// Save → Connected
		if ( btn.classList.contains( 'action-save' ) ) {
			setState( connector, 'connected' );
			return;
		}

		// Edit → Edit state
		if ( btn.classList.contains( 'action-edit' ) ) {
			setState( connector, 'edit' );
			return;
		}

		// Cancel — context-dependent
		if ( btn.classList.contains( 'action-cancel' ) ) {
			var card = btn.closest( '.connector-card' );
			if ( card && card.dataset.state === 'edit' ) {
				setState( connector, 'connected' );
			} else {
				setState( connector, 'needs-setup' );
			}
			return;
		}

		// Remove and replace → Setup
		if ( btn.classList.contains( 'action-remove' ) ) {
			setState( connector, 'setup' );
			return;
		}
	} );
} )();
