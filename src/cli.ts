#!/usr/bin/env node

import markAsanaTaskCompleted from './markAsanaTaskCompleted';
import getAsanaTaskFromGithubPr from './getAsanaTaskFromGithubPr';
import promptTaskIdsAndGithubPR from './promptTaskIdsAndGithubPR';
import getTaskIdsForAsana from './getTaskIdsForAsana';
import checkCredentialsPathExist from './checkCredentialsPathExist';
import getAsanaToken from './getAsanaToken';

import { info } from './log';

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
