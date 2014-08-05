/**
* The Keyboard Shortcuts. Not sure what is good for. I just liked the idea of
* having seperate modules listening for keystrokes and emit more domain specific
* events.
**/

var $ = require('./util'),
	view = null;

var init = function(el) {
	view = el;

	$(document).on("keydown", function(e) {
		console.clear();

		switch(e.keyCode) {
			case 46:
				console.dir(e)
				$(view).emit("key-down-delete");
				break;
		}
	});
};

module.exports = {
	init: init
};