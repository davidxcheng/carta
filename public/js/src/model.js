require('es6-collections');
var $ = require('./util.js');

module.exports = function() {
	var nodes = new Map(),
		view = null;

	var createNode = function(e) {
		var node = e.detail.node;
		nodes.set(node.id, node);
		$(view).emit("x-node-created", {
			node: node	
		});
	};

	var removeNode = function(e) {
		nodes.delete(e.detail.nodeId);
		$(view).emit("x-node-deleted", {
			nodeId: e.detail.nodeId
		});
	};

	var updateNodePosition = function(e) {
		var node = nodes.get(e.detail.nodeId);
		node.position = e.detail.position;
		
		$(view).emit("x-node-updated", {
			nodeId: node.id,
			patch: [
				{
					op: "replace",
					path: "/position",
					value: node.position
				}
			]
		});
	}

	return {
		init: function(db, el) {
			view = el;

			db.nodes.forEach(function(node) {
				nodes.set(node.id, node);
				$(el).emit("x-node-added", {
					node: node
				});
			});

			$(view).on("ui-create-node", createNode);
			$(view).on("ui-delete-node", removeNode);
			$(view).on("ui-node-dragged", updateNodePosition);
		}
	};
}();