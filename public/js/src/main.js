var svgMaker = require('./svg-maker'),
	request = require('superagent'),
	xy = require('./xy'),
	core = require('./core'),
	uuid = require('uuid'),
	db = {};

var activeNodes = [];

request.get('fake/db', function(res) {
	db = JSON.parse(res.text);

	db.nodes.forEach(function(n) {
		canvas.appendChild(svgMaker.createSvgNode(n));
	});
});

canvas.addEventListener("ui-drag-end", function(e) {
	request
		.patch("nodes/" + e.detail.nodeId)
		.send([
			{
				op: "replace",
				path: "/position",
				value: e.detail.position
			}
		])
		.end(function(err, res) {
			//console.dir(res);
		});
});

canvas.addEventListener("dblclick", function(e) {
	// Create a new node if user double clicks canvas
	if (this == e.target) {
		var origo = xy(e);

		var node = {
			id: uuid.v4(),
			text: "",
			position: origo
		}

		db.nodes.push(node);
		request
			.post("nodes/")
			.send(node)
			.end(function(err, res){});
		canvas.appendChild(svgMaker.createSvgNode(node));
		setActiveNode(canvas.lastChild);
	}
});

canvas.addEventListener("click", function(e) {
	console.clear();
	console.dir(e);

	// Check if a node was clicked
	if (e.target.parentNode.dataset.nodeId) {
		if (e.shiftKey)
			addActiveNode(e.target.parentNode);
		else
			setActiveNode(e.target.parentNode);
	}
});

body.addEventListener("keydown", function(e) {
	switch (e.keyCode) {
		case 46: //delete
			activeNodes.forEach(function(node) {
				request
					.del("nodes/" + node.dataset.nodeId)
					.end(function(err, res) {
						if (err) 
							throw "Error when deleting node with id " + node.dataset.nodeId;

						// TODO: clear all refs to active node.
						var index = db.nodes.indexOf(node.dataset.nodeId);

						db.nodes.splice(index, 1);
						node.parentNode.removeChild(node);
					});
			});
			activeNodes.length = 0;
			break;
	}
});

function setActiveNode(node) {
	// TODO: clear event listeners from current active node.
	activeNodes.forEach(function(n) {
		n.classList.remove("active");		
	});

	activeNodes.length = 0;

	activeNodes.push(node);
	node.classList.add("active");
}

function addActiveNode(node) {
	activeNodes.push(node);
	node.classList.add("active");
}