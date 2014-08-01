var xy = require("./xy");

module.exports = function(el) {
	var elCoords = { x: 0, y: 0 }, 
		dragCoords = { x: 0, y: 0 },
		_dragging = false;

	el.addEventListener("mousedown", function(e) {
		elCoords = xy(el);
		dragCoords = xy(e);

		el.classList.add("grabbed");
		el.addEventListener("mousemove", move);
	});

	el.addEventListener("mouseup", function(e) {
		el.removeEventListener("mousemove", move);

		if (_dragging) {
			el.dispatchEvent(new CustomEvent("ui-node-dragged", {
				bubbles: true,
				detail: {
					nodeId: el.dataset.nodeId,
					position: xy(el)
				}
			}));

			_dragging = false;
		}

		el.classList.remove("grabbed");
	});

	var move = function(e) {
		_dragging = true;

		var deltaX = e.clientX - dragCoords.x, 
			deltaY = e.clientY - dragCoords.y;
		
		elCoords.x += deltaX;
		elCoords.y += deltaY;

		el.setAttribute("transform", "translate(" 
			+ elCoords.x + ", " 
			+ elCoords.y + ")");

		dragCoords = xy(e);
	};
};