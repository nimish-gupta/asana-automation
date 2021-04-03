const enquirer = require('enquirer');
const fs = require('fs');

const log = require('./log');
const { CREDENTIALS_PATH } = require('./constants');

const fetchAndSaveToken = async (token, label) => {
	log('Asking for the personal token from the user');
	const userResponse = await enquirer.prompt({
		type: 'input',
		name: token,
		message: `Please enter the personal token of your ${label} account`,
	});

	log('Got the personal token from the user', userResponse);
	fs.appendFileSync(CREDENTIALS_PATH, `${token}=${userResponse[token]}\n`);
	log('Successfully written the token to the file');
	return userResponse[token];
};

module.exports = fetchAndSaveToken;
