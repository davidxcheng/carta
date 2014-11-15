
var request = require('superagent'),
	model = require('./model'),
	domWhisperer = require('./dom-whisperer'),
	mouseTrapper = require('./mouse-trapper'),
	ambassador = require('./ambassador'),
	KeyboardInput = require('./keyboard-input');
	
var ui = document.querySelector('[data-carta]');

domWhisperer(ui);
mouseTrapper(ui);
ambassador(ui);
KeyboardInput(ui, '[data-input-box]')
require('./keyboard-shortcuts').init(ui);

request.get('fake/db', function(res) {
	var db = JSON.parse(res.text);
	model.init(db, ui);
});