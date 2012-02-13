# jQuery Character Count Plugin #

A jQuery plugin for counting in character limits in text form elements.

* configurable maximum length
* configurable user feedback (by position or custom callback)


## Live Demonstration ##

Click [here](http://craigmccoy.github.com/jquery-charcount/) to view a live demo.


## Quick Documentation ##

```javascript
$(*selector*).charcount(*options*);
```

**options:** A set of key/value pairs that configure settings for the plugin.  All options are optional.

* **maxLength:** (type: <a href="http://docs.jquery.com/Types#Integer" target="_blank">Integer</a>, default: 250) Number of characters to limit the field to.
* **position:** (type: <a href="http://docs.jquery.com/Types#String" target="_blank">String</a>, default: "before") Where to position the plugin feedback.  Available options are "before", "after", and "none".
* **preventOverage:** (type: <a href="http://docs.jquery.com/Types#Boolean" target="_blank">Boolean</a>, default: true) If true, characters exceeding the set *maxLength* will be trimmed.
* **classPrefix:** (type: <a href="http://docs.jquery.com/Types#String" target="_blank">String</a>, default: "charcount") This string is prefixed to all classes used by the plugin.


## Events ##

**update:** Trigger after every update to the character count.  The current character length and remaining character length (*maxLength* - current character length) are passed as additional arguments.

**charcount:** Triggering this event will cause the plugin to update itself.


## Usage Example ##

```javascript
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
```
