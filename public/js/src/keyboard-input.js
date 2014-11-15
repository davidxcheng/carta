var $ = require('./util'),
	xy = require('./xy');

function KeyboardInput(el, inputSelector) {

	var ui = el,
		inputEl = document.querySelector(inputSelector),
		valueBeforeEdit = null,
		nodeId = null;

	this._assumeThePosition = function(e) {
		nodeId = e.detail.nodeId;
		valueBeforeEdit = e.detail.currentValue;
		inputEl.value = e.detail.currentValue;

		var position = e.detail.position;
		inputEl.style.left = (position.x + 2) + "px";
		inputEl.style.top = (position.y + 18) + "px";

		inputEl.classList.remove("hide");
		inputEl.focus();		
	};

	this._keydown = function(e) {
		if (!nodeId)
			return;

		if(e.keyCode == 13) { // return
			$(ui).emit("keyboard-input/submit", { 
				nodeId: nodeId,
				newValue: inputEl.value 
			});
			
			inputEl.classList.add("hide");
			nodeId = null;
		}
		else if(e.keyCode == 27) { // esc
			$(ui).emit("keyboard-input/cancelled", {
				nodeId: nodeId,
				valueBeforeEdit: valueBeforeEdit
			});

			nodeId = null;
			inputEl.classList.add("hide");
		}

		e.stopPropagation();
	};

	this._blur = function(e) {
		inputEl.classList.add("hide");
	};

	$(ui).on("ui-edit-mode", this._assumeThePosition),
	$(inputEl).on("keydown", this._keydown),
	$(inputEl).on("blur", this._blur)
}


module.exports = KeyboardInput;