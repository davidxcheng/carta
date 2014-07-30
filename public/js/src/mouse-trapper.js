var $ = require('./util'),
	xy = require('./xy'),
	view = null;

var singleClick = function(e) {
	// Check if a node was clicked
	if (e.target.parentNode.dataset.nodeId) {
		if (e.shiftKey) {
			$(view).emit("mouse-select-nodes", {
				node: e.target.parentNode
			});
		}
		else {
			$(view).emit("mouse-select-node", {
				node: e.target.parentNode
			});
		}
	}

	if (e.target.id === "canvas") {
		$(view).emit("mouse-cancel-selections");		
	}
};

var doubleClick = function(e) {
	if (e.target.id === "canvas") {
		$(view).emit("mouse-create-node", {
			position: xy(e)
		});
	}
};

module.exports = function(el) {
	view = el;

	$(el).on("click", singleClick);
	$(el).on("dblclick", doubleClick);
};