const { CREDENTIALS_TOKEN } = require('./constants');
const { debug } = require('./log');
const fetchAndSaveToken = require('./fetchAndSaveToken');
const getToken = require('./getToken');

const getAsanaToken = async () => {
	let asanaToken = getToken(CREDENTIALS_TOKEN);

	if (asanaToken) {
		debug('Credential token found');
	} else {
		debug('Credentials Token not found');
		asanaToken = await fetchAndSaveToken(CREDENTIALS_TOKEN, 'asana');
	}

	if (!asanaToken) {
		throw new Error("Couldn't found the asana token");
	}
	debug('Found the token', asanaToken);
	return asanaToken;
};

module.exports = getAsanaToken;
