/**
* The SVG Maker is responsible for creating svg representations of
* entities in the model.
**/

var svgNameSpace = "http://www.w3.org/2000/svg",
	drag = require("./drag"),
	nodeEvents = require("./nodeEvents");

var defaults = { 
	node: { 
		width: 120,
		heigth: 60
	}
};

var createSvgRepresentationOfNode = function (node) {
	var frag 	= document.createDocumentFragment(),
		group 	= document.createElementNS(svgNameSpace, "g"),
		rect 	= document.createElementNS(svgNameSpace, "rect"),
		text	= document.createElementNS(svgNameSpace, "text");

	rect.classList.add("node");
	rect.setAttribute("width", defaults.node.width.toString());
	rect.setAttribute("height", defaults.node.heigth.toString());
	rect.setAttribute("rx", "3");
	rect.setAttribute("ry", "3");

	text.classList.add("node-text");
	text.setAttribute("x", (defaults.node.width / 2).toString());
	text.setAttribute("y", "34");
	text.setAttribute("text-anchor", "middle");

	text.textContent = node.text;

	group.appendChild(rect);
	group.appendChild(text);

	group.setAttribute("data-node-id", node.id);
	group.setAttribute("transform", "translate(" + node.position.x + ", " + node.position.y + ")");

	// Setup events for the node
	nodeEvents.init(group, node.id);

	frag.appendChild(group);

	return frag;
}

var getDefaultNodeSize = function() {
	return defaults.node;
};

module.exports = {
	createSvgNode: createSvgRepresentationOfNode,
	getDefaultNodeSize: getDefaultNodeSize
};