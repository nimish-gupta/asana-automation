import enquirer from 'enquirer';
import fs from 'fs';

import { debug } from './log';
import { CREDENTIALS_PATH } from './constants';

const fetchAndSaveToken = async (token: string, label: string) => {
	debug('Asking for the personal token from the user');
	const userResponse = await enquirer.prompt<Record<string, string>>({
		type: 'input',
		name: token,
		message: `Please enter the personal token of your ${label} account`,
	});

	debug('Got the personal token from the user', userResponse);
	fs.appendFileSync(CREDENTIALS_PATH, `${token}=${userResponse[token]}\n`);
	debug('Successfully written the token to the file');
	return userResponse[token];
};

export default fetchAndSaveToken;
