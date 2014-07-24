var svgMaker = require('./svg-maker'),
	request = require('superagent'),
	xy = require('./xy'),
	core = require('./core'),
	uuid = require('uuid'),
	db = {};

var currentNode = null;

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
	}
});

canvas.addEventListener("click", function(e) {
	console.clear();
	if (e.target.parentNode.dataset.nodeId) {
		// TODO: clear event listeners from current node.
		console.dir(currentNode);
		if (currentNode) {
			currentNode.classList.remove("active");
		}
		currentNode = e.target.parentNode;
		currentNode.classList.add("active");
	}
});