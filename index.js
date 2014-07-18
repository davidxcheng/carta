var koa = require('koa'),
	serve = require('koa-static'),
	config = require('./config.js'),
	router = require('./srv/router'),
	app = koa();

app.use(serve(__dirname + '/public'));
router(app);
app.listen(config.port);

console.log('listening on port %s..', config.port);