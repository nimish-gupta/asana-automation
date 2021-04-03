const fs = require('fs');

const { CREDENTIALS_PATH, KEY_SEPARATOR } = require('./constants');
const log = require('./log');

const getToken = (token) => {
	log('Reading contents of the credentials file');
	const credentialsFileContents = fs.readFileSync(CREDENTIALS_PATH).toString();
	log('Successfully read the contents of the file');

	log('Checking token exists in the file');

	const lines = credentialsFileContents.split('\n');
	const credentialLine = lines.find((line) => line.includes(token));
	if (!credentialLine) {
		return false;
	}
	return credentialLine.replace(token, '').replace(KEY_SEPARATOR, '');
};

module.exports = getToken;
