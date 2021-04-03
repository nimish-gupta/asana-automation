const path = require('path');
const homedir = require('os').homedir();

const CREDENTIALS_FILE = 'credentials';

module.exports = {
	CREDENTIALS_FILE,
	CREDENTIALS_PATH: path.join(homedir, '.asana-task', CREDENTIALS_FILE),
	CREDENTIALS_TOKEN: 'ASANA_PERSONAL_TOKEN',
	KEY_SEPARATOR: '=',
};
