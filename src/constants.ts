import path from 'path';
import os from 'os';

const homeDir = os.homedir();

export const CREDENTIALS_FILE = 'credentials';

export const CREDENTIALS_PATH = path.join(
	homeDir,
	'.asana-task',
	CREDENTIALS_FILE
);

export const KEY_SEPARATOR = '=';
