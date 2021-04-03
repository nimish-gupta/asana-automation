const fs = require('fs');
const path = require('path');
const Asana = require('asana');

const { CREDENTIALS_PATH, CREDENTIALS_TOKEN } = require('./constants');
const getToken = require('./getToken');
const fetchAndSaveToken = require('./fetchAndSaveToken');
const log = require('./log');

async function main({ taskIds, githubPRLink }) {
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

	let asanaToken = getToken(CREDENTIALS_TOKEN);

	if (asanaToken) {
		log('Credential token found');
	} else {
		log('Credentials Token not found');
		asanaToken = await fetchAndSaveToken(CREDENTIALS_TOKEN, 'asana');
	}

	if (!asanaToken) {
		throw new Error("Couldn't found the asana token");
	}
	log('Found the token', asanaToken);

	const asanaClient = Asana.Client.create().useAccessToken(asanaToken);

	for (const taskId of taskIds) {
		try {
			log('Commenting on the task', taskId);
			await asanaClient.tasks.addComment(taskId, {
				text: `Successfully completed this task by PR - ${githubPRLink}.`,
			});
			log('Successfully commented on the task');
			await asanaClient.tasks.update(taskId, { completed: true });
		} catch (error) {
			console.log(error.value.errors);
		}
	}
}

module.exports = main;
