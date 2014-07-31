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