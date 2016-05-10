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

    if (socketDirection === "up") {
        d.push("v" + delta.y);

        if (delta.x < 0)
            d.push("a 5,5 0 0, 0 -5,-5");
        else
            d.push("a 5,5 0 0, 1 5,-5");

        d.push("h" + delta.x);
    }

    if (socketDirection === "right") {
        d.push("h" + delta.x);
        
        if (delta.y < 0)
            d.push("a 5,5 0 0, 0 5,-5");
        else
            d.push("a 5,5 0 0, 1 5,5");

        d.push("v" + delta.y);
    }

    if (socketDirection === "down") {
        d.push("v" + delta.y);
        
        if (delta.x < 0)
            d.push("a 5,5 0 0, 1 -5,5");
        else
            d.push("a 5,5 0 0, 0 5,5");

        d.push("h" + delta.x);
    }

    if (socketDirection === "left") {
        d.push("h" + delta.x);
        
        if (delta.y < 0)
            d.push("a 5,5 0 0, 1 -5,-5");
        else
            d.push("a 5,5 0 0, 0 -5,5");

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

    return startPosition;
}

function _getSocketDirection(socket) {
    return socket.getAttribute("data-socket-direction");
}

module.exports = {
    pathDescriptionGenerator: dIsForDescription,
    getPointOfConnection: _getConnectionPoint,
};