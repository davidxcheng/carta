var svgMaker = require('./svg-maker'),
	request = require('superagent'),
	xy = require('./xy'),
	core = require('./core'),
	uuid = require('uuid'),
	db = {};

	console.dir(uuid);

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
		})
});

canvas.addEventListener("dblclick", function(e) {
	// Create a new node if user double clicks canvas
	if (this == e.target) {
		var origo = xy(e);

		canvas.appendChild(svgMaker.createSvgNode({
			id: uuid.v4(),
			text: "",
			position: origo
		}));
	}
});