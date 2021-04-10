const enquirer = require('enquirer');
const fs = require('fs');

const { debug } = require('./log');
const { CREDENTIALS_PATH } = require('./constants');

const fetchAndSaveToken = async (token, label) => {
	debug('Asking for the personal token from the user');
	const userResponse = await enquirer.prompt({
		type: 'input',
		name: token,
		message: `Please enter the personal token of your ${label} account`,
	});

	debug('Got the personal token from the user', userResponse);
	fs.appendFileSync(CREDENTIALS_PATH, `${token}=${userResponse[token]}\n`);
	debug('Successfully written the token to the file');
	return userResponse[token];
};

module.exports = fetchAndSaveToken;
