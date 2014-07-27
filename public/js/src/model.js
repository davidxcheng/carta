require('es6-collections');
var $ = require('./util.js');

module.exports = function() {
	var nodes = new Map(),
		activeNodes = [];

	var setActiveNode = function(e) {
		activeNodes.length = 0;
		activeNodes.push(nodes.get(e.detail.nodeId));
	};

	return {
		init: function(db, el) {
			db.nodes.forEach(function(node) {
				nodes.set(node.id, node);
				$(el).publish("x-node-added", {
					node: node
				});
			});

			$(el).on("ui-set-active-node", setActiveNode);
		}
	};
}();