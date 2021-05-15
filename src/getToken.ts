import fs from 'fs';

import { CREDENTIALS_PATH, KEY_SEPARATOR } from './constants';
import fetchAndSaveToken from './fetchAndSaveToken';
import { debug } from './log';

export enum TokenType {
	GITHUB_TOKEN = 'GITHUB_PERSONAL_TOKEN',
	ASANA_TOKEN = 'ASANA_PERSONAL_TOKEN',
}

const fetchTokenFromFile = (token: TokenType) => {
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

interface GetToken {
	type: TokenType;
	label: string;
}

const getToken = async ({ type, label }: GetToken) => {
	let token = fetchTokenFromFile(type);

	if (!token) {
		debug('Github Token not found');
		token = await fetchAndSaveToken({ type, label });
	}

	if (!token) {
		throw new Error("Couldn't found the github token");
	}

	return token;
};

export default getToken;
