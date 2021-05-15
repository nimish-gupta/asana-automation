import fs from 'fs';

import { CREDENTIALS_PATH, KEY_SEPARATOR } from './constants';
import { debug } from './log';

const getToken = (token: string) => {
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

export default getToken;
