#!/usr/bin/env node

import minimist from 'minimist';

import markAsanaTaskCompleted from './markAsanaTaskCompleted';
import getAsanaTaskFromGithubPr from './getAsanaTaskFromGithubPr';
import promptTaskIdsAndGithubPR from './promptTaskIdsAndGithubPR';
import getTaskIdsForAsana from './getTaskIdsForAsana';
import checkCredentialsPathExist from './checkCredentialsPathExist';

import { error, info } from './log';
import listGithubPrs from './actions/listGithubPrs';
import getToken, { TokenType } from './getToken';

const argv = minimist(process.argv.slice(2));

const performAsanaGithubAutomation = async () => {
	let taskIds, githubPRLink;

	const asanaToken = await getToken({
		type: TokenType.ASANA_TOKEN,
		label: 'asana',
	});

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
};

async function cli() {
	try {
		checkCredentialsPathExist();

		if (argv.githubListPrs) {
			await listGithubPrs(argv);
		} else {
			await performAsanaGithubAutomation();
		}
	} catch (err) {
		error(err.message);
		process.exit(0);
	}
}

cli();
