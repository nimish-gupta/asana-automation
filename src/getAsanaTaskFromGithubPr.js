const enquirer = require('enquirer');
const ParseGithubUrl = require('parse-github-url');
const { Octokit } = require('@octokit/rest');
const getUrls = require('get-urls');

const fetchAndSaveToken = require('./fetchAndSaveToken');
const getToken = require('./getToken');
const { debug } = require('./log');
const { getTaskIdsFromUrls } = require('./utils/asana');

const GITHUB_TOKEN = 'GITHUB_PERSONAL_TOKEN';
const ASANA_DOMAIN = 'app.asana.com';

async function main(githubPR) {
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

	const { prLink } =
		githubPR === true
			? await enquirer.prompt({
					type: 'input',
					name: 'prLink',
					message: 'Please enter the PR link:',
			  })
			: { prLink: githubPR };
	debug('Successfully got the pr link', prLink);

	const parsedUrl = ParseGithubUrl(prLink);
	debug('Successfully parsed the github url');

	const pullRequest = await octokit.pulls.get({
		owner: parsedUrl.owner,
		repo: parsedUrl.name,
		pull_number: parsedUrl.filepath,
	});
	debug('Successfully fetched the pull request', pullRequest.url);

	const urls = Array.from(getUrls(pullRequest.data.body));
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

module.exports = main;
