var koa = require('koa'),
	serve = require('koa-static');

koa().use(serve(__dirname + '/public')).listen(8989);