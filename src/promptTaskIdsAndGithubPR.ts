import enquirer from 'enquirer';

import { debug } from './log';
import { getTaskIdsFromUrls } from './utils/asana';

const URL_SEPARATOR = ',';

const promptTaskIdsAndGithubPR = async () => {
	const { taskUrlsString, githubPRLink } = await enquirer.prompt<{
		taskUrlsString: string;
		githubPRLink: string;
	}>([
		{
			type: 'input',
			name: 'taskUrlsString',
			message: `Enter the urls (${URL_SEPARATOR} separated) for the asana task`,
		},
		{
			type: 'input',
			name: 'githubPRLink',
			message: 'Enter the PR link completing the task',
		},
	]);

	const asanaLinks = taskUrlsString
		.split(URL_SEPARATOR)
		.map((url) => url.trim());

	const taskIds = getTaskIdsFromUrls(asanaLinks);

	debug('Successfully got the taskIds from the user', taskIds);
	debug('Successfully got the github pr link from the user', githubPRLink);
	return { githubPRLink, taskIds };
};

export default promptTaskIdsAndGithubPR;
