const fs = require('fs');
const path = require('path');
const Asana = require('asana');

const { CREDENTIALS_PATH, CREDENTIALS_TOKEN } = require('./constants');
const getToken = require('./getToken');
const fetchAndSaveToken = require('./fetchAndSaveToken');
const { debug, error } = require('./log');

async function main({ taskIds, githubPRLink }) {
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

	const asanaClient = Asana.Client.create().useAccessToken(asanaToken);

	for (const taskId of taskIds) {
		try {
			debug('Commenting on the task', taskId);
			await asanaClient.tasks.addComment(taskId, {
				text: `Successfully completed this task by PR - ${githubPRLink}.`,
			});
			debug('Successfully commented on the task');
			await asanaClient.tasks.update(taskId, { completed: true });
		} catch (error) {
			error(error.value.errors);
		}
	}
}

module.exports = main;
