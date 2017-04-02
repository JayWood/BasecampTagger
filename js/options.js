/* global chrome */
window.jwBasecampTagger = {};
( function( window, $, app ) {

	/**
	 * The default storage object structure.
	 * @type {{jwBCTagManager: {}, jwBCTagManagerLastTime: number}}
	 */
	const defaultStorageObj = { jwBCTagManager: {}, jwBCTagManagerLastTime: 0 };

	// Constructor
	app.init = function() {
		app.cache();
		app.bindEvents();
		app.restoreOptions();
	};


	app.restoreOptions = function() {
		chrome.storage.sync.get( defaultStorageObj, app.buildOptionsTable );
	};

	/**
	 * Builds the options table
	 * @param {object} dataSet
	 * @returns {boolean}
	 */
	app.buildOptionsTable = function( dataSet ) {
		if ( ! dataSet.jwBCTagManager ) {
			return false;
		}

		var jsonData = JSON.stringify( dataSet.jwBCTagManager );
		$( 'textarea.settings' ).val( jsonData );

		for ( var key in dataSet.jwBCTagManager ) {
			if ( ! dataSet.jwBCTagManager.hasOwnProperty( key ) ) {
				continue;
			}

			var item = dataSet.jwBCTagManager[ key ];
			var $settingsField = $( 'tr.settingsFields:first' ).clone();

			for ( var prop in item ) {
				if ( ! item.hasOwnProperty( prop ) ){
					continue;
				}

				var fieldItem = $settingsField.find( '.' + prop );
				if ( ! fieldItem.length ) {
					continue;
				}

				fieldItem.val( item[ prop ] );
			}
			$( 'tbody' ).append( $settingsField );
		}

		var fieldSet = $( 'tr.settingsFields:first' );
		if ( $( 'tr.settingsFields' ).length > 1 ) {
			fieldSet.remove();
		}

		app.cache();
	};

	// Cache all the things
	app.cache = function() {
		app.$c = {
			btns: {
				submit: $( '#submit' ),
				newTag: $( '#addNew' ),
				remove: $( '.remove' ),
				import: $( '#import' )
			},
			status: $( '.status' )
			// fooSelector: $( '.foo' ),
		};
	};

	// Combine all events
	app.bindEvents = function(){
		app.$c.btns.submit.on( 'click', app.submitForm );
		app.$c.btns.newTag.on( 'click', app.newTag );
		app.$c.btns.import.on( 'click', app.runImport );
		$( 'body' ).on( 'click', '.remove', app.remove );
	};

	/**
	 * Runs the data import.
	 * @param evt
	 */
	app.runImport = function( evt ) {
		evt.preventDefault();

		try {
			var $importField = $( 'textarea.settings' ).val();

			$( 'textarea.settings, #import' ).prop( 'disabled', true );

			var dataSet = {
				jwBCTagManager: JSON.parse( $importField ),
				jwBCTagManagerLastTime: new Date().getTime()
			};

			chrome.storage.sync.set( dataSet, function() {
				location.reload();
			});
		} catch( e ) {
			if ( window.console ) {
				window.console.log( e );
			}
		}
	};

	app.remove = function( e ) {
		e.preventDefault();

		if ( 1 === $( '.settingsFields' ).length ) {
			return;
		}

		$( this ).closest( 'tr' ).remove();
		app.reindexRows();
	};

	app.newTag = function( e ) {
		e.preventDefault();

		var settingsClone = $( '.settingsFields:first' ).clone();
		settingsClone.find( 'input' ).val( '' );

		$( '.tagSettings tbody' ).append( settingsClone );

		app.reindexRows();
	};

	app.submitForm = function( e ) {
		e.preventDefault();
		var formObj = $( 'body' ).find( 'form' ).serializeControls();
		var date = new Date();

		// The data to be saved, with an additional timestamp.
		var dataSet = {
			jwBCTagManagerLastTime: date.getTime()
		};

		if ( formObj.hasOwnProperty( 'jwBCTagManager' ) ) {
			dataSet['jwBCTagManager'] = formObj.jwBCTagManager;
		}

		$( 'textarea.settings' ).val( JSON.stringify( dataSet.jwBCTagManager ) );

		chrome.storage.sync.set( dataSet, function() {
			app.$c.status.fadeIn( 200 ).text( 'Options Saved' );

			setTimeout( function() {
				app.$c.status.fadeOut( 200 );
			}, 4000 );
		} );

		chrome.storage.local.set( dataSet );
	};

	app.log = function( thing ) {
		if ( window.console ) {
			window.console.log( thing );
		}
	};


	/**
	 * Re-indexes rows for array processing
	 * @since 1.0.7
	 */
	app.reindexRows = function() {
		var $rows = $( 'form' ).find( 'tbody tr' );
		if ( ! $rows ) {
			return false;
		}

		$rows.each( function( index ) {
			$( this ).find( 'input' ).each( function(){
				var $name = $( this ).attr( 'name' );
				$name = $name.replace( /\[([0-9]+)\]/, '['+ index +']' );

				$( this ).attr( 'name', $name );
			} );
		} );
	};

	// Engage
	$( app.init );

})( window, jQuery, window.jwBasecampTagger );