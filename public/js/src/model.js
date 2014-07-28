require('es6-collections');
var $ = require('./util.js');

module.exports = function() {
	var nodes = new Map(),
		view = null,
		activeNodes = [];

	var createNode = function(e) {
		console.dir(e);
		var node = e.detail.node;
		nodes.set(node.id, node);
		$(view).emit("x-node-created", {
			node: node	
		});
	};

	var setActiveNode = function(e) {
		activeNodes.length = 0;
		activeNodes.push(nodes.get(e.detail.nodeId));
	};

	return {
		init: function(db, el) {
			view = el;

			db.nodes.forEach(function(node) {
				nodes.set(node.id, node);
				$(el).emit("x-node-added", {
					node: node
				});
			});

			$(view).on("ui-set-active-node", setActiveNode);
			$(view).on("ui-create-node", createNode);
		}
	};
}();