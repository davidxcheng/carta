require('es6-collections');

var svgMaker = require("./svg-maker"),
	$ = require('./util'),
	xy = require('./xy'),
	uuid = require('uuid'),
	view = null,
	nodes = new Map();
	activeNodes = [];

var addNode = function(e) {
	view.appendChild(svgMaker.createSvgNode(e.detail.node));
	nodes.set(e.detail.node.id, view.lastChild);

	if (e.type == "x-node-created") {
		setActiveNode(view.lastChild);
	}
};

var createNode = function(e) {
	// TODO: Move to mouse-trapper
	// if user double clicks canvas
	if (this == e.target) {
		var origo = xy(e);

		var node = {
			id: uuid.v4(),
			text: "",
			position: origo
		}

		$(view).emit("ui-create-node", {
			node: node
		});
	}
};

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

var setActiveNode = function(e) {
	var node = e.detail.node;
	// TODO: clear event listeners from current active node.
	activeNodes.forEach(function(n) {
		n.classList.remove("active");		
	});

	activeNodes.length = 0;

	activeNodes.push(node);
	node.classList.add("active");
};

var addActiveNode = function(e) {
	var node = e.detail.node;
	activeNodes.push(node);
	node.classList.add("active");
};

module.exports = function(el) {
	view = el;
	$(el).on("x-node-added", addNode);
	$(el).on("x-node-created", addNode);
	$(el).on("x-node-deleted", deleteNode);
	$(el).on("dblclick", createNode);
	$(el).on("key-down-delete", deletePressed)
	$(el).on("mouse-select-node", setActiveNode);
	$(el).on("mouse-select-nodes", addActiveNode);
};