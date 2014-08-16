var $ = require("./util");

var init = function(nodeElement, nodeId) {

	$(nodeElement).on("mousedown", function(e) {
		$(nodeElement).emit("node/selected", {
			nodeId: nodeId,
			shiftKey: e.shiftKey
		})
	});

	$(nodeElement).on("dblclick", function(e) {
		$(nodeElement).emit("node/begin-edit", {
			nodeId: nodeId
		});
	});

	var sockets = nodeElement.querySelectorAll(".socket");

	for(var i = 0; i < sockets.length; i++) {
		$(sockets[i]).on("click", function(e) {
			console.dir(e)
		});
	}
};

module.exports = {
	init: init
};