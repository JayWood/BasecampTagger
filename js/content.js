/* globals chrome */
window.jwBCTagManager = {};
( function( window, $, app ) {

	app.config = {};
	app.page = 'single'; // default to single

	/**
	 * Config from chrome.storage.local
	 * @type {{}}
	 */
	app.localConfig = {};

	/**
	 * Config from chrome.storage.sync
	 * @type {{}}
	 */
	app.syncConfig = {};

	/**
	 * The default storage object structure.
	 * @type {{jwBCTagManager: {}, jwBCTagManagerLastTime: number}}
	 */
	const defaultStorageObj = { jwBCTagManager: {}, jwBCTagManagerLastTime: 0 };

	// Cache all the things
	app.cache = function() {
		// Cache stuffs
	};


	/**
	 * Stores data in the global value
	 * @param data
	 */
	app.getLocalConfig = function( data ) {
		app.localConfig = data;

		chrome.storage.sync.get( defaultStorageObj, app.getSyncConfig );

		window.console.log( 'Loaded local config' );
	};

	/**
	 * Stores data in the global value
	 * @param data
	 */
	app.getSyncConfig = function( data ) {
		app.syncConfig = data;

		window.console.log( 'Loaded sync config' );

		app.determineConfig();
	};

	/**
	 * Determines which config to use.
	 *
	 * @returns {boolean}
	 */
	app.determineConfig = function() {

		window.console.log( 'Loaded ALL configs' );
		window.console.log( app );

		if ( app.syncConfig.jwBCTagManager && 0 === Object.keys( app.syncConfig.jwBCTagManager ).length ) {
			return app.setConfig( app.localConfig );
		}

		var curTime    = new Date().getTime();
		var remoteTime = ( 0 === app.syncConfig.jwBCTagManagerLastTime ) ? curTime : app.syncConfig.jwBCTagManagerLastTime;
		var localTime  = ( 0 === app.localConfig.jwBCTagManagerLastTime ) ? curTime : app.localConfig.jwBCTagManagerLastTime;

		if ( remoteTime > localTime ) {
			// Set the config, update the local config value.
			app.localConfig = app.syncConfig;

			chrome.storage.local.set( app.syncConfig );
		}

		app.setConfig( app.localConfig );

		$( document ).ready( app.bindEvents );
	};

	/**
	 * Sets the app configuration for users.
	 *
	 * @param {object} data
	 * @return {boolean} Rather or not config was successfully loaded.
	 */
	app.setConfig = function( data ) {
		if ( data.jwBCTagManager && 0 < Object.keys( data.jwBCTagManager ).length ) {
			app.config = data.jwBCTagManager;
			return true;
		} else {
			app.config = {};
		}

		return false;
	};

	// Constructor
	app.init = function() {
		chrome.storage.local.get( defaultStorageObj, app.getLocalConfig );
	};

	/**
	 * Event binder, duh!
	 */
	app.bindEvents = function () {
		app.cache();

		/**
		 * Sets the page we're on, needed for determining selectors
		 */
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