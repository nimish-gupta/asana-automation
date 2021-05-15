import { CREDENTIALS_TOKEN } from './constants';
import { debug } from './log';
import fetchAndSaveToken from './fetchAndSaveToken';
import getToken from './getToken';

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

export default getAsanaToken;
