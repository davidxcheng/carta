var $ = require('./util'),
	xy = require('./xy'),
	view = null,
	valueBeforeEdit = null;

var assumeThePosition = function(e) {
	valueBeforeEdit = e.detail.currentValue;
	txt.value = e.detail.currentValue;

	var position = e.detail.position;
	txt.style.left = (position.x + 2) + "px";
	txt.style.top = (position.y + 17) + "px";

	txt.classList.remove("hide");
	txt.focus();
};

var keydown = function(e) {
	if (!targetNode)
		return;

	if(e.keyCode == 13) { // return
		$(view).emit("ui-node-text-changed", { 
			nodeId: targetNode.dataset.nodeId,
			newValue: txt.value 
		});
		
		// hide input
		txt.classList.add("hide");
	}
	else if(e.keyCode == 27) { // esc

	}

	e.stopPropagation();
};

module.exports = {
	init: function(el) {
		view = el;
		$(view).on("ui-edit-mode", assumeThePosition),
		$(txt).on("keydown", keydown)
	}
};