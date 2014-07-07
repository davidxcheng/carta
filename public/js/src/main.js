var carta = require('./carta'),
	request = require('superagent'),
	db = {};

request.get('fake/db.json', function(res) {
	db = JSON.parse(res.text);

	var child = carta.createSvgNode(db.nodes[0]);

	db.nodes.forEach(function(n) {
		canvas.appendChild(carta.createSvgNode(n));
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
			console.dir(res);
		})
});