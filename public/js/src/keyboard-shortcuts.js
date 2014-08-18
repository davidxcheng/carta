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
			case 37:
				$(view).emit("keyboard-command/left", {
					delta:  {
						x: -4,
						y: 0
					}}
				);
				break;
			case 38:
				$(view).emit("keyboard-command/up", {
					delta:  {
						x: 0,
						y: -4
					}
				});
				break;
			case 39:
				$(view).emit("keyboard-command/right", {
					delta:  {
						x: 4,
						y: 0
					}
				});
				break;
			case 40:
				$(view).emit("keyboard-command/down", {
					delta:  {
						x: 0,
						y: 4
					}
				});
				break;
		}
	});

	$(document).on("keyup", function(e) {
		switch(e.keyCode) {
			case 18:
				$(view).emit("keyboard-command/alt-released");
				break;
		}
	});
};

module.exports = {
	init: init
};