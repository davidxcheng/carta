require('es6-collections');

module.exports = function() {
	var nodes = new Map(),
		activeNodes = [];

	var findNode = function(id) {
		var index = nodes.forEach(function(node) {
			if (node.id == id)
				return node;
		});
	};

	var setActiveNode = function(e) {
		activeNodes.length = 0;
		activeNodes.push(nodes.get(e.detail.nodeId));

		console.dir(activeNodes);
	};

	var _ = {
		on: function(name, cb) {
			document.addEventListener(name, cb)
		},
		publish: function(name, details) {
			document.dispatchEvent(new CustomEvent(name, {
				bubbles: true,
				detail: details
			}));
		}
	}

	return {
		init: function(db) {
			db.nodes.forEach(function(node) {
				nodes.set(node.id, node);
			});

			_.on("ui-set-active-node", setActiveNode);
		}
	};
}();