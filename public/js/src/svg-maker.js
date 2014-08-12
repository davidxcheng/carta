/**
* The SVG Maker is responsible for creating svg representations of
* entities in the model.
**/

var svgNameSpace = "http://www.w3.org/2000/svg",
	nodeEvents = require("./node-events");

var defaults = { 
	node: { 
		width: 120,
		height: 60
	}
};

var createSvgRepresentationOfNode = function (node) {
	var frag 		= document.createDocumentFragment(),
		group 		= document.createElementNS(svgNameSpace, "g"),
		rect 		= document.createElementNS(svgNameSpace, "rect"),
		text		= document.createElementNS(svgNameSpace, "text"),
		socketTop	= document.createElementNS(svgNameSpace, "rect"),
		socketRight	= document.createElementNS(svgNameSpace, "rect"),
		socketBottom	= document.createElementNS(svgNameSpace, "rect"),
		socketLeft	= document.createElementNS(svgNameSpace, "rect");

	var sockets = [socketTop, socketRight, socketBottom, socketLeft];

	rect.classList.add("node");
	rect.setAttribute("width", defaults.node.width.toString());
	rect.setAttribute("height", defaults.node.height.toString());
	rect.setAttribute("rx", "3");
	rect.setAttribute("ry", "3");

	text.classList.add("node-text");
	text.setAttribute("x", (defaults.node.width / 2).toString());
	text.setAttribute("y", "34");
	text.setAttribute("text-anchor", "middle");
	text.textContent = node.text;

	sockets.forEach(function(socket) {
		socket.classList.add("socket");
		socket.setAttribute("width", 6);
		socket.setAttribute("height", 6);	
	});
	
	socketTop.setAttribute("x", (defaults.node.width / 2) - 3);
	socketTop.setAttribute("y", -3);

	socketRight.setAttribute("x", defaults.node.width - 3);
	socketRight.setAttribute("y", (defaults.node.height / 2) - 3);

	socketBottom.setAttribute("x", (defaults.node.width/2) - 3);
	socketBottom.setAttribute("y", defaults.node.height - 3);

	socketLeft.setAttribute("x", -3);
	socketLeft.setAttribute("y", (defaults.node.height / 2) - 3);

	group.appendChild(rect);
	group.appendChild(text);
	group.appendChild(socketTop);
	group.appendChild(socketRight);
	group.appendChild(socketBottom);
	group.appendChild(socketLeft);

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