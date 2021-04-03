#!/usr/bin/env node

const markAsanaTaskCompleted = require('./src/markAsanaTaskCompleted');
const getAsanaTaskFromGithubPr = require('./src/getAsanaTaskFromGithubPr');
const promptTaskIdsAndGithubPR = require('./src/promptTaskIdsAndGithubPR');

const argv = require('minimist')(process.argv.slice(2));

async function cli() {
	if (argv.githubPR) {
		await getAsanaTaskFromGithubPr(argv.githubPR);
	} else {
		const { taskId, githubPRLink } = await promptTaskIdsAndGithubPR();
		await markAsanaTaskCompleted({ taskIds: [taskId], githubPRLink });
	}
}

cli();
