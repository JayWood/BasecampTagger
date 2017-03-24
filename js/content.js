/* globals chrome */
window.jwBCTagManager = {};
( function( window, $, app ) {

	app.config = {};
	app.page = 'single'; // default to single

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
		app.determinePage();
		$( 'li.todo' ).each( app.updateElement );
	};

	app.determinePage = function() {
		if ( $( 'section.perma.has_tools').length ) {
			app.page = 'single';
		} else {
			app.page = 'archive';
		}

	};

	app.buildHTML = function ( obj ) {

		var classes = 'pill comments';
		if ( 'single' === app.page ) {
			// If we're on a single page, chances are the HTML/styles are different
			classes = 'pill';
		}

		return $('<span class="'+ classes +' jw-bc-tag" style="background: ' + obj.pillColor + '; color: '+ obj.textColor +'">' + obj.tagLabel + '</span>' );
	};

	app.updateElement = function( index, e ) {
		var curEl = $( e );
		var anchorTag = curEl.find( '.content a' );
		if ( 'single' === app.page ) {
			anchorTag = curEl.find( 'span.content_for_perma' );
		}

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
				var contentItem = curEl.find( '.content' );
				var htmlOutput = app.buildHTML( obj );

				contentItem.after( htmlOutput );
			}
		}
	};

	$( app.init );

})( window, jQuery, window.jwBCTagManager );