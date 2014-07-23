module.exports = function(filename) {
	var fs = require('fs'),
		jsonpatch = require('json-patch'),
		db = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));

	function save() {
		fs.writeFileSync(filename, JSON.stringify(db));
	}

	return {
		all: function() {
			return db;
		},
		addNode: function(node) {
			db.nodes.push(node);
			save();
		},
		patchNode: function(id, patch) {
			var i = db.nodes.findIndex(function(node) {
				return node.id == id;
			});

			if (i == -1)
				throw "Could not find node with id '" + id + "'."

			jsonpatch.apply(db.nodes[i], patch);

			save();
		}
	};
};