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

	$(nodeElement.querySelector(".node")).on("mouseover", function(e) {
		$(nodeElement).emit("node/mouse-over", {
			nodeId: nodeId
		})
	});

	var sockets = nodeElement.querySelectorAll(".socket");

	for(var i = 0; i < sockets.length; i++) {
		$(sockets[i]).on("mousedown", function(e) {
			$(nodeElement).emit("node/socket-selected", {
				socket: e.target
			});
		});

		$(sockets[i]).on("mouseup", function(e) {
			$(nodeElement).emit("node/socket-deselected", {
				socket: e.target
			});
		});
	}
};

module.exports = {
	init: init
};