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
};

module.exports = {
	init: init
};