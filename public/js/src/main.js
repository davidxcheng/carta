var svgMaker = require('./svg-maker'),
	request = require('superagent'),
	xy = require('./xy'),
	uuid = require('uuid'),
	model = require('./model'),
	domWhisperer = require('./dom-whisperer'),
	ambassador = require('./ambassador'),
	db = {};

var activeNodes = [];

domWhisperer(canvas);
ambassador(canvas);

request.get('fake/db', function(res) {
	db = JSON.parse(res.text);
	model.init(db, canvas);
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
		var node = {
			id: uuid.v4(),
			text: "",
			position: xy(e)
		}

		db.nodes.push(node);
	}
});

body.addEventListener("keydown", function(e) {
	switch (e.keyCode) {
		case 46: //delete
			console.dir(e);
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
