module.exports = function(el) {
	function sub(name, cb) {
		this.addEventListener(name, cb);
	}

	function pub(name, details) {
		this.dispatchEvent(new CustomEvent(name, {
			bubbles: true,
			detail: details
		}));
	}

	return { 
		on: sub.bind(el),
		emit: pub.bind(el)
	};
};