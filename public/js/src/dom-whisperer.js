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
	selectedNodes = [],
	input = txt;

var addNode = function(e) {
	var node = e.detail.node;

	view.appendChild(svgMaker.createSvgNode(node));
	nodes.set(node.id, view.lastChild);

	if (e.type == "x-node-created") {
		setActiveNode(view.lastChild);
		$(view).emit("ui-edit-mode", {
			nodeId: node.id,
			position: node.position,
			currentValue: ""
		});
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
		node.position.y = node.position.y - (defaultSize.height / 2);

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
	selectedNodes.forEach(function(node) {
		$(view).emit("ui-delete-node", {
			nodeId: node.dataset.nodeId
		});
	});
	selectedNodes.length = 0;
};

var deleteNode = function(e) {
	// TODO: clear all refs to node.
	var node = nodes.get(e.detail.nodeId);
	node.parentNode.removeChild(node);
	nodes.delete(node.id);
};

var cancelSelections = function() {
	// TODO: clear event listeners from current active node.
	selectedNodes.forEach(function(n) {
		n.classList.remove("active");		
	});

	selectedNodes.length = 0;
};

var editNode = function(e) {
	var node = nodes.get(e.detail.nodeId);

	$(view).emit("ui-edit-mode", {
		nodeId: e.detail.nodeId,
		position: xy(node),
		currentValue: node.lastChild.textContent
	});

	node.lastChild.textContent = "";
};

var updateNodeText = function(e) {
	nodes.get(e.detail.nodeId)
		.querySelectorAll("text")[0]
		.textContent = e.detail.newValue;
};

var editNodeCancelled = function(e) {
	nodes.get(e.detail.nodeId).lastChild.textContent = e.detail.valueBeforeEdit;
};

var setActiveNode = function(node) {
	cancelSelections();
	selectedNodes.push(node);
	node.classList.add("active");
}

var selectNode = function(e) {
	var node = nodes.get(e.detail.nodeId);

	if (e.detail.shiftKey)
		expandSelection(node);
	else
		setActiveNode(node);
};

var expandSelection = function(node) {
	selectedNodes.push(node);
	node.classList.add("active");
};

var mouseDrag = function(e) {
	if (nothingIsSelected()){
		// begin/expand selection
		console.log("nada");		
	}
	else
		moveSelectedNodes(e);
}

var moveSelectedNodes = function(e) {
	var delta = e.detail.delta;

	selectedNodes.forEach(function(node) {
		var nodePosition = xy(node);

		node.setAttribute("transform", "translate(" 
			+ (nodePosition.x += delta.x) + ", " 
			+ (nodePosition.y += delta.y) + ")");
	});
}

var dragEnded = function() {
	selectedNodes.forEach(function(node) {
		$(view).emit("view/node-moved", {
			nodeId: node.dataset.nodeId,
			position: xy(node)
		});
	});
};

function nothingIsSelected() {
	return selectedNodes.length == 0;
}

module.exports = function(el) {
	view = el;
	$(el).on("x-node-added", addNode);
	$(el).on("x-node-created", addNode);
	$(el).on("x-node-deleted", deleteNode);
	$(el).on("mouse-create-node", createNode);
	$(el).on("mouse-cancel-selections", cancelSelections);
	$(el).on("mouse/drag", mouseDrag);
	$(el).on("mouse/drag-end", dragEnded);
	$(el).on("keyboard-input/submit", updateNodeText);
	$(el).on("keyboard-input/cancelled", editNodeCancelled);
	$(el).on("keyboard-command/delete", deletePressed);
	$(el).on("node/selected", selectNode);
	$(el).on("node/begin-edit", editNode);
};