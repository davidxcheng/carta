/**
* The SVG Maker is responsible for creating svg representations of
* entities in the model.
**/

var svgNameSpace = "http://www.w3.org/2000/svg",
	nodeEvents = require("./node-events"),
	pathFinder = require("./path-finder");

var defaults = { 
	node: { 
		width: 120,
		height: 60
	},
	socket: {
		width: 6,
		height: 6
	},
};

var createSvgRepresentationOfNode = function(node) {
	var frag 		= document.createDocumentFragment(),
		group 		= document.createElementNS(svgNameSpace, "g"),
		rect 		= document.createElementNS(svgNameSpace, "rect"),
		htmlHost	= document.createElementNS(svgNameSpace, "foreignObject"),
		textBox = document.createElement("div"),
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

	// Insert at
	htmlHost.classList.add("node-html-host");
	htmlHost.setAttribute("x", 0);
	htmlHost.setAttribute("y", 0);
	htmlHost.setAttribute("width", defaults.node.width);
	htmlHost.setAttribute("height", defaults.node.height);
	textBox.classList.add("node-title");
	textBox.innerText = node.text;
	htmlHost.appendChild(textBox);

	sockets.forEach(function(socket) {
		socket.classList.add("socket");
		socket.setAttribute("width", defaults.socket.width);
		socket.setAttribute("height", defaults.socket.width);	
	});
	
	socketTop.setAttribute("x", (defaults.node.width / 2) - (defaults.socket.width / 2));
	socketTop.setAttribute("y", -(defaults.socket.height / 2));
	// Chromium does not support dataset on Element, only on HtmlElement
	socketTop.setAttribute("data-socket-direction", "up");

	socketRight.setAttribute("x", defaults.node.width - (defaults.socket.width / 2));
	socketRight.setAttribute("y", (defaults.node.height / 2) - (defaults.socket.height / 2));
	socketRight.setAttribute("data-socket-direction", "right");

	socketBottom.setAttribute("x", (defaults.node.width / 2) - (defaults.socket.width / 2));
	socketBottom.setAttribute("y", defaults.node.height - (defaults.socket.height / 2));
	socketBottom.setAttribute("data-socket-direction", "down");

	socketLeft.setAttribute("x", -(defaults.socket.width / 2));
	socketLeft.setAttribute("y", (defaults.node.height / 2) - (defaults.socket.height / 2));
	socketLeft.setAttribute("data-socket-direction", "left");

	group.appendChild(rect);
	group.appendChild(htmlHost);
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
};

var createSvgRepresentationOfRelationship = function(from) {
	var frag	= document.createDocumentFragment(),
		group 	= document.createElementNS(svgNameSpace, "g"),
		path	= document.createElementNS(svgNameSpace, "path");
		
	group.setAttribute("transform", "translate(" + from.x + ", " + from.y + ")");

	path.classList.add("line", "evolving");

	var d = [
		// m = MoveTo relative to group
		"m", 0, 0,
	];

	path.setAttribute("d", d.join(" "));

	group.appendChild(path);
	frag.appendChild(group);
	return frag;	
};

var getDefaultNodeSize = function() {
	return defaults.node;
};

module.exports = {
	createSvgNode: createSvgRepresentationOfNode,
	createSvgRelationship: createSvgRepresentationOfRelationship,
	getDefaultNodeSize: getDefaultNodeSize
};