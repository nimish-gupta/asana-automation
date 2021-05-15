import enquirer from 'enquirer';
import ParseGithubUrl from 'parse-github-url';
import { Octokit } from '@octokit/rest';
import getUrls from 'get-urls';

import fetchAndSaveToken from './fetchAndSaveToken';
import getToken from './getToken';
import { debug, error } from './log';
import { getTaskIdsFromUrls } from './utils/asana';

const GITHUB_TOKEN = 'GITHUB_PERSONAL_TOKEN';
const ASANA_DOMAIN = 'app.asana.com';

const parseGithubUrl = (
	prLink: string
): { owner: string; name: string; filePath: number } => {
	const parsedUrl = ParseGithubUrl(prLink);
	debug('Successfully parsed the github url');

	if (!parsedUrl) {
		throw new Error(
			'Github url could not be parsed. Please check the github url.'
		);
	}
	if (!(parsedUrl.owner && parsedUrl.name && parsedUrl.filepath)) {
		throw new Error(
			'Github url could not be parsed. Please check the github url.'
		);
	}

	return {
		owner: parsedUrl.owner,
		name: parsedUrl.name,
		filePath: Number(parsedUrl.filepath),
	};
};

async function main(githubPR?: string) {
	let githubToken = getToken(GITHUB_TOKEN);

	if (!githubToken) {
		debug('Github Token not found');
		githubToken = await fetchAndSaveToken(GITHUB_TOKEN, 'github');
	}

	if (!githubToken) {
		throw new Error("Couldn't found the github token");
	}

	const octokit = new Octokit({
		auth: githubToken,
	});

	const { prLink } = !githubPR
		? await enquirer.prompt<{ prLink: string }>({
				type: 'input',
				name: 'prLink',
				message: 'Please enter the PR link:',
		  })
		: { prLink: githubPR };
	debug('Successfully got the pr link', prLink);

	const parsedUrl = parseGithubUrl(prLink);
	debug('Successfully parsed the github url');

	if (!parsedUrl) {
		throw new Error(
			'Github url could not be parsed. Please check the github url.'
		);
	}

	const {
		url,
		data: { body: prBody },
	} = await octokit.pulls.get({
		owner: parsedUrl.owner,
		repo: parsedUrl.name,
		pull_number: parsedUrl.filePath,
	});
	debug('Successfully fetched the pull request', url);

	const urls = Array.from(getUrls(prBody || ''));
	debug('Successfully fetched the urls from pull request', urls);

	const asanaLinks = urls.filter((url) => url.includes(ASANA_DOMAIN));
	if (asanaLinks.length === 0) {
		return { taskIds: [], githubPRLink: prLink };
	}
	debug('Successfully filtered asana links', asanaLinks);

	const asanaTaskIds = getTaskIdsFromUrls(asanaLinks);
	debug('Successfully fetched the task ids', asanaTaskIds);

	return { taskIds: asanaTaskIds, githubPRLink: prLink };
}

export default main;
