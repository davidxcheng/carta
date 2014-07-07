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

canvas.addEventListener("ui-drag-ended", function(e) {
	console.dir(e);
});