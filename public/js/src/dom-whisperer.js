var svgMaker = require("./svg-maker"),
	$ = require('./util.js');

function addNode(e) {
	console.log("node added!");
	console.dir(e);
}

module.exports = function(el) {
	$(el).on("x-node-added", addNode);
};