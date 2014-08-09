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
		switch(e.keyCode) {
			case 46:
				$(view).emit("keyboard-command/delete");
				break;
		}
	});

	$(document).on("keyup", function(e) {
		switch(e.keyCode) {
			case 16:
				$(view).emit("keyboard-command/shift-released");
				break;
		}
	});
};

module.exports = {
	init: init
};