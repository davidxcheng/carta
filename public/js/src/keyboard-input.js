var $ = require('./util'),
	xy = require('./xy'),
	targetNode = null;

var assumeThePosition = function(e) {
	targetNode = e.detail.node;
	position = xy(targetNode);

	txt.value = targetNode.lastChild.textContent;
	txt.style.left = (position.x + 2) + "px";
	txt.style.top = (position.y + 17) + "px";

	txt.classList.remove("hide");
	txt.focus();
};

var keydown = function(e) {
	console.dir(e);
	console.dir(targetNode);
	if(e.keyCode == 13) { // return
		// update model
		$(view).emit("ui-node-text-changed", { 
			nodeId: targetNode.id,
			newValue: txt.value 
		});
		// update ui
		targetNode.lastChild.textContent = txt.value;
		// hide input
		txt.classList.add("hide");
	}
};

module.exports = {
	init: function(view) {
		$(view).on("ui-edit-mode", assumeThePosition),
		$(txt).on("keydown", keydown)
	}
};