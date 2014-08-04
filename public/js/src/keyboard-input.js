var $ = require('./util'),
	xy = require('./xy'),
	view = null,
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
	if (!targetNode)
		return;

	if(e.keyCode == 13) { // return
		// update model
		$(view).emit("ui-node-text-changed", { 
			nodeId: targetNode.dataset.nodeId,
			newValue: txt.value 
		});
		// update ui
		targetNode.lastChild.textContent = txt.value;
		// hide input
		txt.classList.add("hide");

		targetNode = null;
	}
};

module.exports = {
	init: function(el) {
		view = el;
		$(view).on("ui-edit-mode", assumeThePosition),
		$(txt).on("keydown", keydown)
	}
};