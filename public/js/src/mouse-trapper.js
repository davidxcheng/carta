var $ = require('./util');

module.exports = function(el) {
	$(el).on("click", function(e) {
		// Check if a node was clicked
		if (e.target.parentNode.dataset.nodeId) {
			if (e.shiftKey)
				$(el).emit("mouse-select-nodes", {
					node: e.target.parentNode
				});
			else
				$(el).emit("mouse-select-node", {
					node: e.target.parentNode 
				});
		}

		if (e.target.id === "canvas")
			$(el).emit("mouse-cancel-selections");
	});
};