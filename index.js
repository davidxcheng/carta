var koa = require('koa'),
	serve = require('koa-static');

koa().use(serve(__dirname + '/public')).listen(8999);
console.log('listening on port 8989..');