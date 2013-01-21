GNOMES
======
A set of utility functions intended to help save some time.

Why?
----
Because sometimes you don't want to import an entire library just for a 
handful of functions. Sometimes you just want to see the world bur... 
oops... nevermind.

Usage
-----
For now, the global object is called either by passing a selector, such as:
	
	_g('.className').each(function(index, item){

		console.log(index + ' : ' + item);
	});

Note that currently allowed selectors is limited to only class names (prefixed with a '.'),
ids (prefixed with a '#'), or tag names (no prefix necessary). I'm currently weighing my options
as to how to make the selector engine more robust.

Anyway, one can also access the methods directly via Gnome's *do* property:
	
	var ajx = _g.do.ajax(params_iteral_obj);
	ajx.send(data_string);

To avoid sending the request manually via *.send()*, you can add a data
property to the prams sent to the params argument.

	_g.do.ajax(params_literal_obj);

The internal ajax object essentially checks if the data param is set.
If it is, the request will fire automatically and immediately.

If the data property is not set, then the ajax object will be returned,
so that it can be called upon later and sent when desired.

Where's the Unit Tests?
-----------------------
That's next on my list - not just here, but on my other projects as well.
(only so much time in a day)