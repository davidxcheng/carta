var route = require('koa-route'),
	parse = require('co-body'),
	HttpStatus = require('http-status-codes'),
	config = require('../config.js'),
	dal = require('../srv/dal')(config.connectionString);

module.exports = function(srv) {
	// Register routes

	// GET /fake/db
	srv.use(route.get('/fake/db', function* () {
		this.body = dal.all();
	}));

	// POST /nodes
	srv.use(route.post('/nodes', function* () {
		var node = yield parse(this);
		console.dir(node);
		dal.addNode(node);
		this.body = "OK";
	}));

	// PATCH /nodes/{id}
	srv.use(route.patch('/nodes/:id', function* () {
		var patch = yield parse(this);
		dal.patchNode(id, patch);
		this.body = "OK";
	}));

	// DELETE /nodes/{id}
	srv.use(route.del('/nodes/:id', function* (id) {
		dal.removeNode(id);
		this.body = "OK";
		this.response.statusCode = HttpStatus.Accepted;
	}));
};