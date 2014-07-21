var svgNameSpace = "http://www.w3.org/2000/svg",
	drag = require("./drag");

function createSvgRepresentationOfNode(node) {
	var frag 	= document.createDocumentFragment(),
		group 	= document.createElementNS(svgNameSpace, "g"),
		rect 	= document.createElementNS(svgNameSpace, "rect"),
		text	= document.createElementNS(svgNameSpace, "text");

	rect.classList.add("node");
	rect.setAttribute("width", "120");
	rect.setAttribute("height", "60");
	rect.setAttribute("rx", "3");
	rect.setAttribute("ry", "3");

	text.classList.add("node-text");
	text.setAttribute("x", "12");
	text.setAttribute("y", "34");
	text.textContent = node.text;

	group.appendChild(rect);
	group.appendChild(text);

	group.setAttribute("data-node-id", node.id);
	group.setAttribute("transform", "translate(" + node.position.x + ", " + node.position.y + ")");

	// Make element draggable
	drag(group);

	frag.appendChild(group);

	return frag;
}

module.exports = {
	createSvgNode: createSvgRepresentationOfNode
};