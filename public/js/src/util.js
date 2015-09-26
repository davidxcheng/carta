module.exports = function(nodeOrNodeList) {

    function sub(eventName, cb) {
        
        if (this instanceof Node) {
            this.addEventListener(eventName, cb);
        }
        else if (this instanceof NodeList) {
            for (var i = 0; i < this.length; i++) {
                this[i].addEventListener(eventName, cb);
            };
        }
    }

    function pub(eventName, details) {

        if (this instanceof Node) {
            this.dispatchEvent(new CustomEvent(eventName, {
                bubbles: true,
                detail: details
            }));
        }
        else if (this instanceof NodeList) {
            for (var i = 0; i < this.length; i++) {
                this.dispatchEvent(new CustomEvent(eventName, {
                    bubbles: true,
                    detail: details
                }));
            };
        }
    }

    return { 
        on: sub.bind(nodeOrNodeList),
        emit: pub.bind(nodeOrNodeList)
    };
};