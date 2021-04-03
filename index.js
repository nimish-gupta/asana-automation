const fs = require('fs');
const path = require('path');
const enquirer = require('enquirer');
const Asana = require('asana');

const CREDENTIALS_FILE = 'credentials';
const CREDENTIALS_PATH = path.join('~', '.asana', CREDENTIALS_FILE);
const CREDENTIALS_TOKEN = 'ASANA_PERSONAL_TOKEN';
const KEY_SEPARATOR = '=';

function log(...params) {
	if (process.env.DEBUG) {
		console.log(...params);
	}
}

async function main() {
	log('checking credentials path exist');

	const fileExists = fs.existsSync(CREDENTIALS_PATH);

	if (fileExists) {
		log('Credentials path exist');
	} else {
		log('creating the default path');
		const dirPath = path.dirname(CREDENTIALS_PATH);
		fs.mkdirSync(dirPath, { recursive: true });
		log('Successfully created the path', dirPath);
		fs.writeFileSync(CREDENTIALS_PATH, '');
		log('Successfully created file');
	}

	const getAsanaToken = () => {
		log('Reading contents of the credentials file');
		const credentialsFileContents = fs
			.readFileSync(CREDENTIALS_PATH)
			.toString();
		log('Successfully read the contents of the file');

		log('Checking token exists in the file');

		const lines = credentialsFileContents.split('\n');
		const credentialLine = lines.find((line) =>
			line.includes(CREDENTIALS_TOKEN)
		);
		if (!credentialLine) {
			return false;
		}
		return credentialLine
			.replace(CREDENTIALS_TOKEN, '')
			.replace(KEY_SEPARATOR, '');
	};

	let asanaToken = getAsanaToken();

	if (asanaToken) {
		log('Credential token found');
	} else {
		log('Credentials Token not found');
		log('Asking for the personal token from the user');
		const userResponse = await enquirer.prompt({
			type: 'input',
			name: CREDENTIALS_TOKEN,
			message: 'Please enter the personal token of your asana account',
		});
		log('Got the personal token from the user', userResponse);
		fs.writeFileSync(
			CREDENTIALS_PATH,
			`${CREDENTIALS_TOKEN}=${userResponse[CREDENTIALS_TOKEN]}`
		);
		log('Successfully written the token to the file');
	}

	asanaToken = getAsanaToken();
	if (!asanaToken) {
		throw new Error("Couldn't found the asana token");
	}
	log('Found the token', asanaToken);

	const asanaClient = Asana.Client.create().useAccessToken(asanaToken);

	const { taskId, githubPRLink } = await enquirer.prompt([
		{
			type: 'input',
			name: 'taskId',
			message: 'Enter the taskId for the asana task',
		},
		{
			type: 'input',
			name: 'githubPRLink',
			message: 'Enter the PR link completing the task',
		},
	]);

	log('Successfully got the taskId from the user', taskId);

	try {
		log('Commenting on the task');
		await asanaClient.tasks.addComment(taskId, {
			text: `Successfully completed this task by PR - ${githubPRLink}.`,
		});
		log('Successfully commented on the task');
		await asanaClient.tasks.update(taskId, { completed: true });
	} catch (error) {
		console.log(error.value.errors);
	}
}

export default main;
