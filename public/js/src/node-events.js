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

	$(nodeElement.querySelectorAll(".node, .node-html-host, .node-title")).on("mouseover", function(e) {
		$(nodeElement).emit("node/mouse-over", {
			nodeId: nodeId
		})
	});

	$(nodeElement.querySelector(".node")).on("mouseout", function(e) {
		$(nodeElement).emit("node/mouse-out", {
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
			$(nodeElement).emit("node/socket-mouseup", {
				socket: e.target
			});
		});

		$(sockets[i]).on("mouseenter", function(e) {
			$(nodeElement).emit("node/socket-mouseover", {
				socket: e.target
			});
		});

		$(sockets[i]).on("mouseleave", function(e) {
			$(nodeElement).emit("node/socket-mouseout", {
				socket: e.target
			});
		});
	}
};

module.exports = {
	init: init
};