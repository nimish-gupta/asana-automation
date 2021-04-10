function debug(...params) {
	if (process.env.DEBUG) {
		const logData = params.join(' ');
		console.log(`[debug]: ${logData}`);
	}
}

function info(...params) {
	const logData = params.join(' ');
	console.log(`[info]: ${logData}`);
}

function error(...params) {
	const logData = params.join(' ');
	console.error(`[error]: ${logData}`);
}

module.exports = {
	debug,
	info,
	error,
};
