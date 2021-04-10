const Asana = require('asana');

const { debug, error: logError } = require('./log');

async function main({ taskIds, githubPRLink, asanaToken }) {
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
			logError(error.value.errors);
		}
	}
}

module.exports = main;
