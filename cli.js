#!/usr/bin/env node

const markAsanaTaskCompleted = require('./src/markAsanaTaskCompleted');
const getAsanaTaskFromGithubPr = require('./src/getAsanaTaskFromGithubPr');
const promptTaskIdsAndGithubPR = require('./src/promptTaskIdsAndGithubPR');

const argv = require('minimist')(process.argv.slice(2));

async function cli() {
	let taskIds, githubPRLink;
	if (argv.githubPR) {
		({ taskIds, githubPRLink } = await getAsanaTaskFromGithubPr(argv.githubPR));
	} else {
		({ taskIds, githubPRLink } = await promptTaskIdsAndGithubPR());
	}
	if (taskIds.length === 0) {
		console.log(taskIds, 'found zero token');
	}
	await markAsanaTaskCompleted({ taskIds, githubPRLink });
}

cli();
