const fs = require('fs');
const path = require('path');

const { debug } = require('./log');
const { CREDENTIALS_PATH } = require('./constants');

const checkCredentialsPathExist = () => {
	debug('checking credentials path exist');

	const fileExists = fs.existsSync(CREDENTIALS_PATH);

	if (fileExists) {
		debug('Credentials path exist');
	} else {
		debug('creating the default path');
		const dirPath = path.dirname(CREDENTIALS_PATH);
		fs.mkdirSync(dirPath, { recursive: true });
		debug('Successfully created the path', dirPath);
		fs.writeFileSync(CREDENTIALS_PATH, '');
		debug('Successfully created file');
	}
};

export default checkCredentialsPathExist;
