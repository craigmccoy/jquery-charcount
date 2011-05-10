(function($) {
	
	var MAXLENGTH_MIN = 1;
	
	var POSITION_BEFORE = 'before';
	var POSITION_AFTER = 'after';
	var POSITION_NONE = 'none';
	
	/**
	 * Returns filtered options map from a user supplied map
	 * @param options
	 * @return Object
	 */
	var filterSettings_ = function(options) {
		if(!$.isPlainObject(options)) { //must be an object
			return {};
		}
		
		$.each(options, function(key, value) {
			if(key == 'maxLength') { //allows only integers greater than zero
				options.maxLength = parseInt(value);
				if(isNaN(options.maxLength)) {
					delete options.maxLength;
				} else if(options.maxLength < MAXLENGTH_MIN) {
					options.maxLength = MAXLENGTH_MIN;
				} else if(options.maxLength > $.charcount.config.max) {
					options.maxLength = $.charcount.config.max;
				}
			} else if(key == 'position') { //allows only the defined positions (before, after, none)
				options.position = $.trim(value.toString().toLowerCase());
				if($.inArray(options.position, [POSITION_BEFORE, POSITION_AFTER, POSITION_NONE]) < 0) {
					delete options.position;
				}
			} else if(key == 'preventOverage') { //boolean value of whatever is provided
				options.preventOverage = Boolean(value);
			} else if(key == 'classPrefix') { //any string, lower case, no leading/trailing whitespace
				options.classPrefix = $.trim(value.toString().toLowerCase());	
			} else { //removes unused data provided
				delete options[key];
			}
		});
		
		return options;
	};
	
	/**
	 * Custom selector to choose which form field types can use this plugin
	 * @param obj
	 * @return Boolean
	 */
	$.expr[':'].charcountable = function(obj) {
		return $(obj).is('textarea,input[type="text"],input[type="password"],input[type="email"],input[type="url"],input[type="search"]');
	};
	
	/**
	 * Convenience function for setting/getting of the 'maxlength' attribute
	 * @return jQuery|int
	 */
	$.fn.maxlength = function(/*value*/) {
		var element = $(this);
		if(arguments.length > 0) {
			var value = parseInt(arguments[0]);
			if(!isNaN(value)) {
				element.attr('maxlength', value);
			}
			return element;
		} else {
			var maxlength = parseInt(element.attr('maxlength'));
			return (maxlength < MAXLENGTH_MIN || maxlength > $.charcount.config.max || isNaN(maxlength)) ? undefined : maxlength;		
		}
	};
	
	/**
	 * Configuration and default settings
	 */
	$.charcount = {
		util: {
			//returns pluralized form of a string based on a count
			pluralize: function(count, singular/*, plural*/) {
				var plural = (arguments.length > 2) ? arguments[2] : singular + 's'; 
				return (count == 1) ? singular : plural;
			}
		},
		config: {
			//maximum allowed value for $.fn.maxlength and maxLength setting
			max: 4000
		},
		defaults: {
			//maximum length of string length of value of element (TODO: word count support?)
			maxLength: 250, 
			//where to position the count display element (before, after or none)
			position: POSITION_BEFORE,
			//should the element still not display characters if over the set maxlength
			preventOverage: true,
			//prefix for used css classes
			classPrefix: 'charcount'
		}
	};
	
	/**
	 * Initializes the plugin using the options (if any) provided by the user
	 * @param options (optional)
	 * @return jQuery
	 */
	$.fn.charcount = function(/*options*/) {
		var options = arguments.length > 0 ? filterSettings_(arguments[0]) : {};
		var globalSettings = $.extend({}, $.charcount.defaults, options);
		
		return this.each(function(index) {
			var element = $(this);
					
			if(element.is(':charcountable')) {
				//settings from element attributes
				var elementSettings = { maxLength: element.maxlength() };
				if(elementSettings.maxLength == undefined) {
					delete elementSettings.maxLength;
				}
				
				var settings = $.extend({}, globalSettings, filterSettings_(elementSettings));
				
				element.removeAttr('maxlength');
				if(settings.preventOverage) { //in HTML5, 'maxlength' attribute is allowed on textareas
					element.maxlength(settings.maxLength);
				}
				
				if(settings.position != POSITION_NONE) {
					element.wrap('<span />').addClass(settings.classPrefix);
					var countDisplay = $('<span />').addClass(settings.classPrefix + '-display');					
					if(settings.position == POSITION_BEFORE) {
						countDisplay.insertBefore(element).addClass(settings.classPrefix + '-position-' + POSITION_BEFORE);
					} else if(settings.position == POSITION_AFTER) {
						countDisplay.insertAfter(element).addClass(settings.classPrefix + '-position-' + POSITION_AFTER);
					}
				}			
				
				element.bind('keyup keypress charcount', function(evt) {
					var length = $(evt.target).val().length;
					var remaining = settings.maxLength - length;
					
					if(settings.preventOverage && remaining < 1) {
						evt.preventDefault();						
						element.val(element.val().substr(0, settings.maxLength)); //trims text for elements that do not natively limit input 
					}
					
					if(evt.type == 'keyup' || evt.type == 'charcount') {
						element.trigger('update', [length, remaining]);
						if(settings.position != POSITION_NONE) {				
							var display = element.parent().find('.' + settings.classPrefix + '-display').removeClass(settings.classPrefix + '-overage');
							if(remaining < 0) {
								display.addClass(settings.classPrefix + '-overage');
							}	
							display.text(remaining >= 0 ? remaining + ' ' + $.charcount.util.pluralize(remaining, 'character') + ' remaining' : Math.abs(remaining) + ' too many characters');
						} 
					}
				}).trigger('charcount');
			}
		});
	};
	
})(jQuery);