const enquirer = require('enquirer');

const log = require('./log');

const promptTaskIdsAndGithubPR = async () => {
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
	log('Successfully got the github pr link from the user', githubPRLink);
	return { githubPRLink, taskId };
};

module.exports = promptTaskIdsAndGithubPR;
