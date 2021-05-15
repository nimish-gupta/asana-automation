import enquirer from 'enquirer';
import fs from 'fs';

import { debug } from './log';
import { CREDENTIALS_PATH } from './constants';
import { TokenType } from './getToken';

const fetchAndSaveToken = async ({
	type,
	label,
}: {
	type: TokenType;
	label: string;
}) => {
	debug('Asking for the personal token from the user');

	const userResponse = await enquirer.prompt<Record<string, string>>({
		type: 'input',
		name: type,
		message: `Please enter the personal token of your ${label} account`,
	});

	debug('Got the personal token from the user', userResponse);

	fs.appendFileSync(CREDENTIALS_PATH, `${type}=${userResponse[type]}\n`);

	debug('Successfully written the token to the file');

	return userResponse[type];
};

export default fetchAndSaveToken;
