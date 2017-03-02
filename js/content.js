window.jwBCTagManager = {};
( function( window, $, app ) {

	app.config = {};

	// Cache all the things
	app.cache = function() {
		chrome.storage.sync.get( { jwBCTagManager: [] }, function( data ) {
			app.config = data.jwBCTagManager;
		});
	};

	// Constructor
	app.init = function() {
		app.cache();

		$( document ).ready( app.bindEvents );
	};

	app.bindEvents = function () {
		$( 'ul.todos li.todo' ).each( app.updateElement );
	};

	app.buildHTML = function ( obj ) {
		return $('<span class="pill comments jw-bc-tag" style="background: ' + obj.pillColor + '; color: '+ obj.textColor +'">' + obj.tagLabel + '</span>' );
	};

	app.updateElement = function( index, e ) {
		var curEl = $( e );
		var anchorTag = curEl.find( '.content a' );

		for ( var key in app.config ) {
			var anchorText = anchorTag.text();

			if ( !  app.config.hasOwnProperty( key ) ) {
				continue;
			}

			var obj = app.config[ key ];

			var replaced = false;
			anchorTag.text( anchorText.replace( obj.tag, function( e ) {
				replaced = true;

				return '';
			} ) );

			if ( replaced ) {
				curEl.find( '.content' ).after( app.buildHTML( obj ) );
				// curEl.find( 'div' ).not( '.nubbin, .spacer' ).append( app.buildHTML( obj ) );
			}
		}
	};

	$( app.init );

})( window, jQuery, window.jwBCTagManager );