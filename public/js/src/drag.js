module.exports = function(el) {
	var xy = require("./xy"),
		elCoords = {
			x: 0,
			y: 0
		},
		dragCoords = {
			x: 0,
			y: 0
		};

	el.addEventListener("mousedown", function(e) {
		elCoords = xy(el);
		dragCoords.x = e.clientX;
		dragCoords.y = e.clientY;

		el.addEventListener("mousemove", move);
	});

	el.addEventListener("mouseup", function(e) {
		el.removeEventListener("mousemove", move);
		el.dispatchEvent(new CustomEvent("ui-drag-ended", {
			bubbles: true,
			detail: {
				position: xy(el)
			}
		}));
	});

	var move = function(e) {
		var sideways = e.clientX - dragCoords.x,
			vert = e.clientY - dragCoords.y;
		
		elCoords.x += sideways;
		elCoords.y += vert;

		el.setAttribute("transform", "translate(" 
			+ elCoords.x + ", " 
			+ elCoords.y + ")");

		dragCoords.x = e.clientX;
		dragCoords.y = e.clientY;
	};
};