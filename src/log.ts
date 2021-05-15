export function debug(...params: unknown[]) {
	if (process.env.DEBUG) {
		const logData = params.join(' ');
		console.log(`[debug] ${logData}`);
	}
}

export function info(...params: unknown[]) {
	console.log(...params);
}

export function error(...params: unknown[]) {
	const logData = params.join(' ');
	console.error(`[error] ${logData}`);
}
