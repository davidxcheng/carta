require('es6-collections');

var svgMaker = require("./svg-maker"),
	$ = require('./util'),
	uuid = require('uuid'),
	view = null,
	nodes = new Map();
	activeNodes = [];

var addNode = function(e) {
	var node = e.detail.node;

	// Center the node
	var defaultSize = svgMaker.getDefaultNodeSize();
	node.position.x = node.position.x - (defaultSize.width / 2);
	node.position.y = node.position.y - (defaultSize.heigth / 2);

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

var cancelSelections = function() {
	// TODO: clear event listeners from current active node.
	activeNodes.forEach(function(n) {
		n.classList.remove("active");		
	});

	activeNodes.length = 0;
};

var editNode = function(e) {
	console.log("edit %s", e.detail.nodeId);
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