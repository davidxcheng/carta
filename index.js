var koa = require('koa'),
	route = require('koa-route'),
	serve = require('koa-static'),
	parse = require('co-body'),
	dal = require('./srv/dal')('srv/db.json'),
	app = koa();

app.use(serve(__dirname + '/public'));
app.use(route.get('/fake/db', function* () {
	// return entire db
	this.body = dal.all();
}));
app.use(route.patch('/nodes/:id', function* (id) {
	var patch = yield parse(this);
	dal.patchNode(id, patch);
	this.body = "OK";
}));
app.listen(8999);

console.log('listening on port 8999..');