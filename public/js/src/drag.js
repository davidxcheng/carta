module.exports = function(el) {
	var elCoords = {
			x: 0,
			y: 0
		},
		dragCoords = {
			x: 0,
			y: 0
		};

	el.addEventListener("mousedown", function(e) {
		elCoords = getTranslateValues(el.getAttribute("transform"));
		dragCoords.x = e.clientX;
		dragCoords.y = e.clientY;

		el.addEventListener("mousemove", moveTarget);
	});

	el.addEventListener("mouseup", function(e) {
		el.removeEventListener("mousemove", moveTarget);
	});

	var moveTarget = function(e) {
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

/** 
* Returns the x and y values from a css translate function.
* @example
* // returns { x: 10, y: 90 }
* getTranslateValues("translate(10, 90)") 
*/
function getTranslateValues(str) {
	var values = str.slice(10, -1).split(" ");

	return {
		x: parseInt(values[0]),
		y: parseInt(values[1])
	};
}