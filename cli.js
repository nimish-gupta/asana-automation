#!/usr/bin/env node

const markAsanaTaskCompleted = require('./src/markAsanaTaskCompleted');
const getAsanaTaskFromGithubPr = require('./src/getAsanaTaskFromGithubPr');
const promptTaskIdsAndGithubPR = require('./src/promptTaskIdsAndGithubPR');
const getTaskIdsForAsana = require('./src/getTaskIdsForAsana');
const checkCredentialsPathExist = require('./src/checkCredentialsPathExist');
const getAsanaToken = require('./src/getAsanaToken');

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
		taskIds = await getTaskIdsForAsana({ asanaToken, onlyMy: argv.onlyMe });
		if (!taskIds || taskIds.length === 0) {
			process.exit();
		}
	}
	await markAsanaTaskCompleted({ taskIds, githubPRLink, asanaToken });
}

cli();
