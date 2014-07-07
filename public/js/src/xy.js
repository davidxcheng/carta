/** 
* Returns the x and y values from a css translate function.
* @example
* // returns { x: 10, y: 90 }
* // when el.getAttribute("transform") yields "translate(10, 90)" 
*/
module.exports = function getTranslateValues(el) {
	var str = el.getAttribute("transform");

	if (str.length < 14 || str.slice(0, 10) != "translate(")
		return { x: 0, y: 0 };

	var values = str.slice(10, -1).split(" ");

	return {
		x: parseInt(values[0]),
		y: parseInt(values[1])
	};
}