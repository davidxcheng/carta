/**
* The DOM Whisperer is responsible for talking to the DOM when things
* changes. It listens for events emitted by other modules such as the Mouse 
* Trapper and the Model.
**/

require('es6-collections');

var svgMaker = require("./svg-maker"),
	$ = require('./util'),
	xy = require('./xy'),
	uuid = require('uuid'),
	view = null,
	nodes = new Map();
	activeNodes = [],
	input = txt;

var addNode = function(e) {
	var node = e.detail.node;

	view.appendChild(svgMaker.createSvgNode(node));
	nodes.set(node.id, view.lastChild);

	if (e.type == "x-node-created") {
		setActiveNode(view.lastChild);
	}
};

var createNode = function(e) {
	if (this == e.target) {
		var node = {
			id: uuid.v4(),
			text: "",
			position: e.detail.position
		};

		// Make the point where the user clicked the center of the node.
		var defaultSize = svgMaker.getDefaultNodeSize();
		node.position.x = node.position.x - (defaultSize.width / 2);
		node.position.y = node.position.y - (defaultSize.heigth / 2);

		$(view).emit("ui-create-node", {
			node: node
		});
	}
};

/**
* Sends a 'command' to the Model. The removing of DOM nodes is triggered by
* the 'x-node-deleted' event.
**/
var deletePressed = function() {
	activeNodes.forEach(function(node) {
		$(view).emit("ui-delete-node", {
			nodeId: node.dataset.nodeId
		});
	});
	activeNodes.length = 0;
};

var deleteNode = function(e) {
	// TODO: clear all refs to node.
	var node = nodes.get(e.detail.nodeId);
	node.parentNode.removeChild(node);
	nodes.delete(node.id);
};

var cancelSelections = function() {
	// TODO: clear event listeners from current active node.
	activeNodes.forEach(function(n) {
		n.classList.remove("active");		
	});

	activeNodes.length = 0;
};

var editNode = function(e) {
	var node = nodes.get(e.detail.nodeId);
	txt.classList.remove("hide");
	txt.setAttribute("transform", "translate(" + xy(node).x + ", " + xy(node).y + ")");
	txt.setAttribute("top", xy(node).y);
	console.dir(xy(node));
};

var setActiveNode = function(node) {
	cancelSelections();
	activeNodes.push(node);
	node.classList.add("active");
}

var selectNode = function(e) {
	setActiveNode(e.detail.node);
};

var expandSelection = function(e) {
	var node = e.detail.node;
	activeNodes.push(node);
	node.classList.add("active");
};

module.exports = function(el) {
	view = el;
	$(el).on("x-node-added", addNode);
	$(el).on("x-node-created", addNode);
	$(el).on("x-node-deleted", deleteNode);
	$(el).on("mouse-create-node", createNode);
	$(el).on("mouse-select-node", selectNode);
	$(el).on("mouse-select-nodes", expandSelection);
	$(el).on("mouse-cancel-selections", cancelSelections);
	$(el).on("mouse-edit-node", editNode);
	$(el).on("key-down-delete", deletePressed)
};