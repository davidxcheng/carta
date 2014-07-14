var koa = require('koa'),
	route = require('koa-route'),
	serve = require('koa-static'),
	app = koa();

app.use(serve(__dirname + '/public'));
app.use(route.patch('/nodes/:id', function *patchNode(id) {
	console.log(id);
	// get db
	// get node from db
	// apply patch
	this.body = "OK";
}));
app.listen(8999);

console.log('listening on port 8999..');