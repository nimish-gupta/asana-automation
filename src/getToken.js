const fs = require('fs');

const { CREDENTIALS_PATH, KEY_SEPARATOR } = require('./constants');
const { debug } = require('./log');

const getToken = (token) => {
	debug('Reading contents of the credentials file');
	const credentialsFileContents = fs.readFileSync(CREDENTIALS_PATH).toString();
	debug('Successfully read the contents of the file');

	debug('Checking token exists in the file');

	const lines = credentialsFileContents.split('\n');
	const credentialLine = lines.find((line) => line.includes(token));
	if (!credentialLine) {
		return false;
	}
	return credentialLine.replace(token, '').replace(KEY_SEPARATOR, '');
};

module.exports = getToken;
