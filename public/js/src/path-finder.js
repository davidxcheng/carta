function dIsForDescription(fromSocket, to) {

    var d = [
        // m = MoveTo relative to group
        "m", 0, 0,
    ];

    var assumedStartingPointOfPath = _getConnectionPoint(fromSocket),
        delta = {
            x: to.x - assumedStartingPointOfPath.x,
            y: to.y - assumedStartingPointOfPath.y
        };

    var socketDirection = _getSocketDirection(fromSocket);

    if (/up|down/.test(socketDirection)) {
        d.push("v" + delta.y);
        d.push("h" + delta.x);
    }
    else {
        d.push("h" + delta.x);
        d.push("v" + delta.y);
    }


    return d.join(" ");
}

function _getConnectionPoint(socket) {

    var nodeTransform = socket.parentNode.getAttribute("transform"),
        nodeTransformValues = nodeTransform.match(/\d+, \d+/)[0].split(", "),
        nodeOffset = {
            x: +nodeTransformValues[0],
            y: +nodeTransformValues[1]
        };

    var socketOffset = {
        x: parseInt(socket.getAttribute("x"), 10),
        y: parseInt(socket.getAttribute("y"), 10)
    };

    var socketDirection = _getSocketDirection(socket),
        pixelPushX = socketDirection.match(/left/) ? 1 : 3;
        pixelPushY = socketDirection.match(/up/) ? 1 : 3;

    var startPosition = {
        x: nodeOffset.x + socketOffset.x + pixelPushX,
        y: nodeOffset.y + socketOffset.y + pixelPushY
    };

    console.dir(nodeOffset);
    console.dir(startPosition)

    return startPosition;
}

function _getSocketDirection(socket) {
    return socket.getAttribute("data-socket-direction");
}

module.exports = {
    pathDescriptionGenerator: dIsForDescription,
    getPointOfConnection: _getConnectionPoint,
};