function Node(init) {
	this.text = init.text || "New Node";
	this.position = init.position;
}

function Position(x, y) {
	this.x = x;
	this.y = y;
}

module.exports = {
	Node: Node,
	Position: Position
};