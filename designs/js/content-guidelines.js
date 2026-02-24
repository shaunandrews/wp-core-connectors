/**
 * Content Guidelines — Accordion
 *
 * Clicking a card header toggles the body open/closed.
 * Only one card open at a time.
 */
( function() {

	var frame = document.querySelector( '.wp-guidelines-frame' );
	if ( ! frame ) {
		return;
	}

	var cards = frame.querySelectorAll( '.guideline-card' );

	frame.addEventListener( 'click', function( e ) {
		var header = e.target.closest( '.guideline-card__header' );
		if ( ! header ) {
			return;
		}

		var card = header.closest( '.guideline-card' );
		if ( ! card ) {
			return;
		}

		var wasOpen = card.classList.contains( 'is-open' );

		// Close all cards
		for ( var i = 0; i < cards.length; i++ ) {
			cards[ i ].classList.remove( 'is-open' );
		}

		// Toggle the clicked card (if it was closed, open it)
		if ( ! wasOpen ) {
			card.classList.add( 'is-open' );
		}
	} );

	// History screen toggle
	var btnViewHistory = document.getElementById( 'btn-view-history' );
	var btnHistoryBack = document.getElementById( 'btn-history-back' );

	if ( btnViewHistory ) {
		btnViewHistory.addEventListener( 'click', function() {
			frame.classList.add( 'is-history' );
		} );
	}

	if ( btnHistoryBack ) {
		btnHistoryBack.addEventListener( 'click', function() {
			frame.classList.remove( 'is-history' );
		} );
	}
} )();
