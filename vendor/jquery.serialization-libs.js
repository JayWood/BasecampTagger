

(function($,undefined){
	'$:nomunge'; // Used by YUI compressor.
	/*!
	 * jQuery serializeObject - v0.2 - 1/20/2010
	 * http://benalman.com/projects/jquery-misc-plugins/
	 *
	 * Copyright (c) 2010 "Cowboy" Ben Alman
	 * Dual licensed under the MIT and GPL licenses.
	 * http://benalman.com/about/license/
	 */

	// Whereas .serializeArray() serializes a form into an array, .serializeObject()
	// serializes a form into an (arguably more useful) object.
	$.fn.serializeObject = function(){
		var obj = {};

		$.each( this.serializeArray(), function(i,o){
			var n = o.name,
			    v = o.value;

			obj[n] = obj[n] === undefined ? v
				: $.isArray( obj[n] ) ? obj[n].concat( v )
				         : [ obj[n], v ];
		});

		return obj;
	};


	// Got this beauty from http://stackoverflow.com/questions/11127227/jquery-serialize-input-with-arrays
	$.fn.serializeControls = function() {
		var data = {};

		function buildInputObject(arr, val) {
			if (arr.length < 1)
				return val;
			var objkey = arr[0];
			if (objkey.slice(-1) == "]") {
				objkey = objkey.slice(0,-1);
			}
			var result = {};
			if (arr.length == 1){
				result[objkey] = val;
			} else {
				arr.shift();
				var nestedVal = buildInputObject(arr,val);
				result[objkey] = nestedVal;
			}
			return result;
		}

		$.each(this.serializeArray(), function() {
			var val = this.value;
			var c = this.name.split("[");
			var a = buildInputObject(c, val);
			$.extend(true, data, a);
		});

		return data;
	}

})(jQuery);
