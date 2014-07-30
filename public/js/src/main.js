require('./key-trapper');

var request = require('superagent'),
	model = require('./model'),
	domWhisperer = require('./dom-whisperer'),
	mouseTrapper = require('./mouse-trapper'),
	ambassador = require('./ambassador');
	
domWhisperer(canvas);
mouseTrapper(canvas);
ambassador(canvas);

request.get('fake/db', function(res) {
	var db = JSON.parse(res.text);
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