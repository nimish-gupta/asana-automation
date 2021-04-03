function log(...params) {
	if (process.env.DEBUG) {
		console.log(...params);
	}
}

module.exports = log;
