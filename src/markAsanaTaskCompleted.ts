import { getAsanaClient } from './utils/asana';
import { debug, error as logError } from './log';

async function main({
	taskIds,
	githubPRLink,
	asanaToken,
}: {
	taskIds: string[];
	githubPRLink: string;
	asanaToken: string;
}) {
	const asanaClient = getAsanaClient(asanaToken);

	for (const taskId of taskIds) {
		try {
			debug('Commenting on the task', taskId);
			await asanaClient.tasks.addComment(taskId, {
				text: `Successfully completed this task by PR - ${githubPRLink}.`,
			});
			debug('Successfully commented on the task');
			const task = await asanaClient.tasks.findById(taskId);
			await asanaClient.tasks.update(taskId, {
				completed: true,
				name: task.name,
			});
		} catch (error) {
			logError(error.value.errors);
		}
	}
}

export default main;
