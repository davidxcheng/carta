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
	selectedSocket = null,
	evolvingRelationship = null;
	_targetSocket = null;

var addNode = function(e) {
	var node = e.detail.node;

	view.appendChild(svgMaker.createSvgNode(node));
	nodes.set(node.id, view.lastChild);

	if (e.type == "x-node-created") {
		// Go straight into edit mode when creating a new node
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

var arrowPressed = function(e) {
	moveSelectedNodes(e, true);
}

var cancelSelections = function() {
	// TODO: clear event listeners from current active node.
	selectedNodes.forEach(function(n) {
		n.classList.remove("active");		
	});

	selectedNodes.length = 0;
};

var editNodeTitle = function(e) {
	var node = nodes.get(e.detail.nodeId),
		textBox = node.querySelector(".node-title");

	$(view).emit("ui-edit-mode", {
		nodeId: e.detail.nodeId,
		position: xy(node),
		currentValue: textBox.innerText
	});

	textBox.innerText = "";
};

var updateNodeTitle = function(e) {
	nodes.get(e.detail.nodeId)
		.querySelector(".node-title")
		.innerText = e.detail.newValue;
};

var editNodeCancelled = function(e) {
	nodes.get(e.detail.nodeId)
		.querySelector(".node-title")
		.innerText = e.detail.valueBeforeEdit;
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

var selectSocket = function(e) {
	selectedSocket = e.detail.socket;
	selectedSocket.classList.add("active");
};

var socketMouseUp = function(e) {
console.dir(e);	
	if (!selectedSocket)
		return;


	if (e.detail.socket === selectedSocket)
		deselectSocket();

	console.log("yay!");
};

var socketMouseOver = function(e) {
	if (evolvingRelationship) {
		if (_targetSocket)
			_targetSocket.classList.remove("target");

		_targetSocket = e.detail.socket;
		_targetSocket.classList.add("target");
	}
};

var socketMouseOut = function(e) {
	if (evolvingRelationship) {
		_targetSocket.classList.remove("target");
		_targetSocket = null;
	}
}

var deselectSocket = function() {
	selectedSocket.classList.remove("active");
	selectedSocket = null;
};

var expandSelection = function(node) {
	selectedNodes.push(node);
	node.classList.add("active");
};

var mouseDrag = function(e) {
	if (nothingIsSelected()){
		// begin/expand selection
		return;
	}
	
	if (selectedSocket) {
		var to = e.detail.delta;

		if (!evolvingRelationship) {
			// User initiated creation of new relationship
			view.appendChild(svgMaker.createSvgRelationship(e.detail.mousePosition, to));
			evolvingRelationship = view.lastChild.querySelector(".line");
			evolvingRelationship.classList.add("pending");
		}
		else {
			updateEvolvingingRelationship(to);
		}
	}
	else {
		moveSelectedNodes(e, false);		
	}
}

var mouseOverNode = function(e) {
	if (evolvingRelationship) {
		var node = nodes.get(e.detail.nodeId);
		node.classList.add("active");
	}
};

var mouseOutNode = function(e) {
	if (evolvingRelationship) {
		var node = nodes.get(e.detail.nodeId);
		node.classList.remove("active");
	}
};

var moveSelectedNodes = function(e, emitEvent) {
	var delta = e.detail.delta;

	selectedNodes.forEach(function(node) {
		var nodePosition = xy(node);

		node.setAttribute("transform", "translate(" 
			+ (nodePosition.x += delta.x) + ", " 
			+ (nodePosition.y += delta.y) + ")");

		if (emitEvent) {
			$(view).emit("view/node-moved", {
				nodeId: node.dataset.nodeId,
				position: xy(node)
			});
		}
	});
}

var updateEvolvingingRelationship = function(delta) {
	var pathSegments = evolvingRelationship.animatedPathSegList;
		bezier = pathSegments.getItem(1);

	bezier.x = bezier.x + delta.x;
	bezier.y = bezier.y + delta.y;

	//console.dir(bezier)
	//evolvingRelationship.setAttribute("d", cubicBezier.join(" "));
};

var dragEnded = function(e) {
	selectedNodes.forEach(function(node) {
		$(view).emit("view/node-moved", {
			nodeId: node.dataset.nodeId,
			position: xy(node)
		});
	});

	if (evolvingRelationship) {
		console.dir(e.detail.position);
		console.dir(e.detail.targetEl);
	}

	if (selectedSocket) {
		selectedSocket.classList.remove("active");
		selectedSocket = null;

		if (_targetSocket)
			console.log("create rel!");
		else {
			var elLine = view.lastChild.querySelector(".line");
			elLine.parentNode.removeChild(elLine);
			evolvingRelationship = null;
		}
	}
};

function nothingIsSelected() {
	return selectedNodes.length == 0 && selectedSocket == null;
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
	$(el).on("keyboard-input/submit", updateNodeTitle);
	$(el).on("keyboard-input/cancelled", editNodeCancelled);
	$(el).on("keyboard-command/delete", deletePressed);
	$(el).on("keyboard-command/up", arrowPressed);
	$(el).on("keyboard-command/right", arrowPressed);
	$(el).on("keyboard-command/down", arrowPressed);
	$(el).on("keyboard-command/left", arrowPressed);
	$(el).on("node/selected", selectNode);
	$(el).on("node/mouse-over", mouseOverNode);
	$(el).on("node/mouse-out", mouseOutNode);
	$(el).on("node/socket-selected", selectSocket);
	$(el).on("node/socket-mouseup", socketMouseUp);
	$(el).on("node/socket-mouseover", socketMouseOver);
	$(el).on("node/socket-mouseout", socketMouseOut);
	$(el).on("node/begin-edit", editNodeTitle);
};