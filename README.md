jQuery Character Count Plugin
=============================
A jQuery plugin for counting in character limits in text form elements.

* configurable maximum length
* configurable user feedback (by position or custom callback)

Live Demonstration
------------------
Click [here](http://craigmccoy.github.com/jquery-charcount/demo.html) to view a live demo.

Quick Documentation
-------------------
	$(_selector_).charcount(_options_);

*options:* A set of key/value pairs that configure settings for the plugin.  All options are optional.
> *maxLength:* (type: [Integer](http://docs.jquery.com/Types#Integer), default: 250) Number of characters to limit the field to.
> *position:* (type: [String](http://docs.jquery.com/Types#String), default: "before") Where to position the plugin feedback.  Available options are "before", "after", and "none".
> *preventOverage:* (type: [Boolean](http://docs.jquery.com/Types#Boolean), default: true) If true, characters exceeding the set _maxLength_ will be trimmed.
> *classPrefix:* (type: [String](http://docs.jquery.com/Types#String), default: "charcount") This string is prefixed to all classes used by the plugin.

Events
------
*charcount:* Trigger after every update to the character count.  The current character length and remaining character length (_maxLength_ - current charater length) are passed as additional arguments. 

Usage Example
-------------
	$('#text').charcount({
		maxLength: 50,
		position: 'after'
	});
	
	//using event to provide feedback
	$('#text').charcount({
		position: 'none'
	}).bind('charcount', function(evt, length, remaining)) { 
		console.log('length: ' + length, 'remaining: ' + remaining);
	});
