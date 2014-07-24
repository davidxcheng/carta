var svgMaker = require('./svg-maker'),
	request = require('superagent'),
	xy = require('./xy'),
	core = require('./core'),
	uuid = require('uuid'),
	db = {};

var activeNode = null;

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
		// TODO: clear event listeners from active node.
		if (activeNode) {
			activeNode.classList.remove("active");
		}
		activeNode = e.target.parentNode;
		activeNode.classList.add("active");
	}
});

document.getElementsByTagName("body")[0]
	.addEventListener("keydown", function(e) {

		switch (e.keyCode) {
			case 46: //delete
				if (activeNode) {
					request
						.del('nodes/' + activeNode.dataset.nodeId)
						.end(function(err, res) {
							if (err) 
								return;

							// TODO: clear all refs to active node.
							// 		 and update db
							activeNode.parentNode.removeChild(activeNode);
						});
				}
				break;
		}
	});