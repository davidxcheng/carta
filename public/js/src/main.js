var request = require('superagent'),
	db = {};

request.get('fake/db.json', function(data) {
	db = data;
});