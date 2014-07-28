var svgMaker = require("./svg-maker"),
	$ = require('./util'),
	xy = require('./xy'),
	uuid = require('uuid'),
	view = null,
	activeNodes = [];

function addNode(e) {
	view.appendChild(svgMaker.createSvgNode(e.detail.node));

	if (e.type == "x-node-created") {
		setActiveNode(view.lastChild);
	}
}

function createNode(e) {
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
}

function setActiveNode(node) {
	// TODO: clear event listeners from current active node.
	activeNodes.forEach(function(n) {
		n.classList.remove("active");		
	});

	activeNodes.length = 0;

	activeNodes.push(node);
	node.classList.add("active");
}

module.exports = function(el) {
	view = el;
	$(el).on("x-node-added", addNode);
	$(el).on("x-node-created", addNode);
	$(el).on("dblclick", createNode);
};