var xy = require('./xy'),
	$ = require('./util'),
	targetElement = null,
	elCoords = null,
	mouseCoords = null,
	_dragging = false;

var draggable = function(el) {
	targetElement = el;

	$(el).on("mousedown", function(e) {
		// Capture initial position of element and mouse pointer.
		elCoords = xy(el);
		mouseCoords = xy(e);

		el.classList.add("grabbed");
		
		//$(el).on("mousemove", moveElement);
	});

	$(el).on("mouseup", function(e) {
		// Remove event listener
		//el.removeEventListener("mousemove", moveElement);

		if (_dragging) {
			$(el).emit("ui-node-dragged", {
				nodeId: el.dataset.nodeId,
				position: xy(el)
			});

			_dragging = false;
		}

		el.classList.remove("grabbed");
	});	
};

var moveElement = function(e) {
	_dragging = true;

	var delta = {
		x: e.clientX - mouseCoords.x, 
		y: e.clientY - mouseCoords.y
	};
	
	$(canvas).emit("mouse-dragging", { 
		delta: delta
	});

	mouseCoords = xy(e);
};

module.exports = draggable;