/**
 * Connectors — Install Flow Simulation
 *
 * Clicking card buttons simulates the install flow:
 * Install → Installing (1.5s) → Setup → (Save) → Saving (1s) → Connected
 * Connected → (Edit) → Edit → (Cancel) → Connected
 * Setup → (Cancel) → Needs Setup → (Set up) → Setup
 *
 * Error toggle (bottom-left): when active, Install and Save
 * simulate failures with inline error messages.
 */
( function() {

	var errorMode = false;

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

	function getCard( connector ) {
		return document.querySelector( '.connector-card[data-connector="' + connector + '"]' );
	}

	function clearErrors( card ) {
		var errors = card.querySelectorAll( '.field-error, .connector-card__error' );
		for ( var i = 0; i < errors.length; i++ ) {
			errors[ i ].classList.remove( 'is-visible' );
		}
	}

	// Error toggle
	var toggle = document.getElementById( 'error-toggle' );
	if ( toggle ) {
		toggle.addEventListener( 'click', function() {
			errorMode = ! errorMode;
			toggle.classList.toggle( 'is-active', errorMode );

			// Clear all visible errors when toggling off
			if ( ! errorMode ) {
				var allErrors = document.querySelectorAll( '.field-error.is-visible, .connector-card__error.is-visible' );
				for ( var i = 0; i < allErrors.length; i++ ) {
					allErrors[ i ].classList.remove( 'is-visible' );
				}
			}
		} );
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

		var card = getCard( connector );

		// Install → Installing (1.5s) → Setup (or error)
		if ( btn.classList.contains( 'action-install' ) ) {
			clearErrors( card );
			setState( connector, 'installing' );
			setTimeout( function() {
				if ( errorMode ) {
					setState( connector, 'install' );
					var err = card.querySelector( '.connector-card__error' );
					if ( err ) {
						err.classList.add( 'is-visible' );
					}
				} else {
					setState( connector, 'setup' );
				}
			}, 1500 );
			return;
		}

		// Activate → Setup
		if ( btn.classList.contains( 'action-activate' ) ) {
			clearErrors( card );
			setState( connector, 'setup' );
			return;
		}

		// Connect → Setup
		if ( btn.classList.contains( 'action-connect' ) ) {
			clearErrors( card );
			setState( connector, 'setup' );
			return;
		}

		// Set up → Setup
		if ( btn.classList.contains( 'action-setup' ) ) {
			clearErrors( card );
			setState( connector, 'setup' );
			return;
		}

		// Save → Saving (1s) → Connected (or error)
		if ( btn.classList.contains( 'action-save' ) ) {
			clearErrors( card );
			btn.classList.add( 'is-saving' );
			btn.textContent = 'Saving\u2026';
			setTimeout( function() {
				btn.classList.remove( 'is-saving' );
				btn.textContent = 'Save';
				if ( errorMode ) {
					var err = card.querySelector( '.field-error' );
					if ( err ) {
						err.classList.add( 'is-visible' );
					}
				} else {
					setState( connector, 'connected' );
				}
			}, 1000 );
			return;
		}

		// Edit → Edit state
		if ( btn.classList.contains( 'action-edit' ) ) {
			setState( connector, 'edit' );
			return;
		}

		// Cancel — context-dependent
		if ( btn.classList.contains( 'action-cancel' ) ) {
			clearErrors( card );
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
