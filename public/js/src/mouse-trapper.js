/**
* The Mouse Trapper listens to mouse events from the canvas and tries to figure out the users
* intent and emits more specific events that other modules acts on.
*/

var $ = require('./util'),
	xy = require('./xy'),
	view = null,
	mouseIsDown = false,
	dragging = false,
	lastMousePosition = null;

var mouseDown = function(e) {
	console.dir(e)
	mouseIsDown = true;
	lastMousePosition = xy(e);

	if (targetIsCanvas(e)) {
		$(view).emit("mouse-cancel-selections");		
	}
};

var mouseMove = function(e) {
	if (mouseIsDown || e.altKey) {
		dragging = true;

		// If user shift-drags (without mousedown)
		if (!lastMousePosition)
			lastMousePosition = xy(e);

		var delta = {
			x: e.clientX - lastMousePosition.x, 
			y: e.clientY - lastMousePosition.y
		};

		$(view).emit("mouse/drag", {
			delta: delta
		});

		lastMousePosition = xy(e);
	}
};

var mouseUp = function(e) {
	mouseIsDown = false;
	lastMousePosition = null;

	if (dragging) {
		$(view).emit("mouse/drag-end", {});
		dragging = false;
	}
};

var doubleClick = function(e) {
	if (targetIsCanvas(e)) {
		$(view).emit("mouse-create-node", {
			position: xy(e)
		});
	}
};

function targetIsCanvas(e) {
	return e.target.id === "canvas";
}

module.exports = function(el) {
	view = el;

	$(el).on("mousedown", mouseDown);
	$(el).on("mouseup", mouseUp);
	$(el).on("dblclick", doubleClick);
	$(el).on("mousemove", mouseMove);
	$(el).on("keyboard-command/alt-released", function() { if (dragging) mouseUp(); } );
};