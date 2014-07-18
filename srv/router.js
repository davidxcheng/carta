var route = require('koa-route'),
	parse = require('co-body'),
	config = require('../config.js'),
	dal = require('../srv/dal')(config.connectionString);

module.exports = function(srv) {
	// Register routes

	// GET /fake/db
	srv.use(route.get('/fake/db', function* () {
		this.body = dal.all();
	}));

	// PATCH /nodes/{id}
	srv.use(route.patch('/nodes/:id', function* (id) {
		var patch = yield parse(this);
		dal.patchNode(id, patch);
		this.body = "OK";
	}));

};