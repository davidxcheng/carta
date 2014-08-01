/**
* The Key Trapper. Not sure what is good for. I just liked the idea of
* having seperate modules listening for input and emit more domain specific
* events.
**/

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