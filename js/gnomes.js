(function() {

// utility functions
	var _merge = function(orig_obj, new_obj, overwrite_bool){

		// boolean to test if it's ok to overwrite existing
		// values with new values
		if(typeof orig_obj === 'object' && typeof new_obj === 'object'){

			if(typeof overwrite_bool === 'undefined' || overwrite_bool){

				for(var item in new_obj){

					orig_obj[item] = new_obj[item];
				}
			} else {

				for(var item in new_obj){

					if(!orig_obj.hasOwnProperty(item)){

						orig_obj[item] = new_obj[item];
					}
				}
			}
		}

		return orig_obj;
	};

 // String.trim() is native on most clients,
 // except for ie < 9, so here's a helper until
 // a day comes when I can stop pandering to IE
	var _trim_string = function(str){

		if(typeof str.trim === 'function'){

			return str.trim();
		}

		return str.replace(/^\s+|\s+$/g,'')
	};

// ajax functions
	var _create_xmlhttp = function(param_obj){

		var ajx = {};

		if (window.XMLHttpRequest) {

		    ajx = new XMLHttpRequest();
		} else if (window.ActiveXObject) {

		    ajx = new ActiveXObject("Microsoft.XMLHTTP");
		}

		ajx = _set_xmlhttp(ajx, param_obj);

		return ajx.data === null ? ajx.ajax : ajx.ajax.send(ajx.data);
	};

	var _set_xmlhttp = function(request_obj, settings_obj){

		var defaults = {
			method: 'post',
			header: 'application/x-www-form-urlencoded',
			url: '/',
			data: null,
			onLoading: function(){},	// state 1
			onLoaded: function(){},		// state 2
			onInteract: function(){},	// state 3
			onComplete: function(){},	// state 4
			onError: function(){}
		};


		defaults = _merge(defaults, settings_obj);

		request_obj.open(defaults.method, defaults.url, true);
		request_obj.setRequestHeader('Content-Type', defaults.header);

		request_obj.onReadyStateChange = function(){

			if(request_obj.readyState === 1 ){// loading

				defaults.onLoading();
			};

			if(request_obj.readyState === 2 ){// loaded

				defaults.onLoaded();
			};

			if(request_obj.readyState === 3 ){// interact

				defaults.onInteract();
			};

			if(request_obj.readyState === 4 ){// complete

				if(request_obj.status === 200){

					defaults.onComplete(request_obj.responseText);
				} else {

					defaults.onError(request_obj.responseText, request_obj.status);
				}
			};
		};

		return {ajax: request_obj, data: defaults.data};
	};

// browser data obj
	var _browser = {

		is_ie : function(){

			// ie check lifted... er... I mean "borrowed" from jQuery's source
			var ie_regx = /(msie) ([\w.]+)/;
			var result = ie_regx.exec(navigator.userAgent.toLowerCase());

			return result !== null && result.length > 0;
		},

		is_ie6 : function(){

			// support for maxHeight not until ie7
			return (_browser.is_ie() && typeof document.body.style.maxHeight === 'undefined');
		},

		is_ie7 : function(){

			// webstorage not supported until IE 8
			return (_browser.is_ie() && typeof window.localStorage !== 'object');
		},

		is_ie8 : function(){

			// webstorage not supported in IE until 8
			// geolocation not supported in IE until 9
			return (_browser.is_ie() && typeof window.localStorage === 'object' &&
					 typeof navigator.geolocation !== 'object');
		},

		is_ie9 : function(){

			// geolocation supported as of IE 9
			// web workers not supported until IE 10
			return (_browser.is_ie() && typeof navigator.geolocation === 'object' &&
					 typeof window.Worker !== 'function');
		},

		is_ie10 : function(){

			// this is really just theoretical for now,
			// until I get access to a windows 8 computer...
			return (_browser.is_ie() && typeof window.Worker === 'function');
		},

		is_ff : function(){

			// technically not just firefox, but other mozilla browsers
			return  typeof window.mozIndexedDB === 'object';
		},

		is_webkit : function(){

			// safari/chromium/chrome
			return typeof window.webkitURL === 'object';
		}
	};

// browser functions
	var _check_browser = function(browser_str){

		if(typeof browser_str === 'string'){

			return _browser['is_' + browser_str]();
		}
		else
		{

			// if no browser is specified, just return
			// the browser object so the dev can do
			// whatever they want with it
			return _browser;
		}
	};

// DOM elements
// querySelector/querySelectorAll not valid in IE < 8
// this will suffice for basic selectors, but would be
// a good idea to add a few niceties - like context.
	var _elements = null;
	var _get_elements = function(str){

		var _id_regex = /^#[a-zA-Z0-9_-]+$/;
		_match = str.match(_id_regex) ? document.querySelector(str) : document.querySelectorAll(str);
		return _match;
	};

// define the gnomes object (finally)
	var gnomes = function(selector_str) {
		
		if(typeof selector_str === 'string'){
		
			var _matches = _get_elements(selector_str);

			var temp_array = [];

			if(_matches.length != undefined){
				for(var i = 0; i < _matches.length; i += 1){

					temp_array.push(_matches[i]);
				}
			} else {

				temp_array.push(_matches);
			}

			return _merge(temp_array, gnomes.prototype);
		}
		return gnomes.do;
	};

// apply methods - and double them up
// in the 'do' object for alternate access
	gnomes.do = gnomes.prototype = {

		ajax: function(settings_obj) {
			
			return _create_xmlhttp(settings_obj);
		},

		merge: function(orig_obj, new_obj, overwrite_bool) {

			return _merge(orig_obj, new_obj, overwrite_bool);
		},

		browser: function(type_str){

			return _check_browser(type_str);
		},

		each: function(obj, fn){

			if(typeof obj === 'object' && obj.length){

				for(var i = 0; i < obj.length; i += 1){

					fn.call(this, i, obj[i]);
				};
			} else if (typeof obj === 'object'){

				for(var item in obj){

					fn(item, obj[item]);
				};
			} else if (typeof obj === 'function' && this.length){

				for(var i = 0; i < this.length; i += 1){

					obj.call(this, i, this[i]);
				};
			} else if (typeof obj === 'function' && typeof this === 'object'){

				obj(this);
			}
		},

		trim: function(str){

			return _trim_string(str);			
		},

		el: function(idx){

			return (typeof idx === 'number') ? this[idx] : this[0];
		}
	};

	window._g = gnomes;
})();