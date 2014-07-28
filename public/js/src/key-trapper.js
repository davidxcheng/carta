var $ = require('./util');

module.exports = (function(b){
	$(b).on("keydown", function(e) {
		switch(e.keyCode) {
			case 46: // delete
				$(canvas).emit("key-down-delete");
				break;
		}
	});
})(body);