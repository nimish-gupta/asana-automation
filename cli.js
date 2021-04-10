#!/usr/bin/env node

const markAsanaTaskCompleted = require('./src/markAsanaTaskCompleted');
const getAsanaTaskFromGithubPr = require('./src/getAsanaTaskFromGithubPr');
const promptTaskIdsAndGithubPR = require('./src/promptTaskIdsAndGithubPR');
const getAsanaTasksFromTaskIds = require('./src/getAsanaTasksFromTaskIds');
const checkCredentialsPathExist = require('./src/checkCredentialsPathExist');
const { info } = require('./src/log');

const argv = require('minimist')(process.argv.slice(2));

async function cli() {
	let taskIds, githubPRLink;
	checkCredentialsPathExist();
	const asanaToken = await getAsanaToken();
	if (argv.githubPR) {
		({ taskIds, githubPRLink } = await getAsanaTaskFromGithubPr(argv.githubPR));
	} else {
		({ taskIds, githubPRLink } = await promptTaskIdsAndGithubPR());
	}
	if (taskIds.length === 0) {
		info(
			`Could not found any task associated with the github pr link - ${githubPRLink}`
		);
		taskIds = await getAsanaTasksFromTaskIds();
		if (taskIds.length === 0) {
			process.exit();
		}
	} else {
		await markAsanaTaskCompleted({ taskIds, githubPRLink });
	}
}

cli();
