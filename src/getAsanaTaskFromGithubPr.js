const enquirer = require('enquirer');
const ParseGithubUrl = require('parse-github-url');
const { Octokit } = require('@octokit/rest');
const getUrls = require('get-urls');

const fetchAndSaveToken = require('./fetchAndSaveToken');
const getToken = require('./getToken');
const log = require('./log');

const GITHUB_TOKEN = 'GITHUB_PERSONAL_TOKEN';
const ASANA_DOMAIN = 'app.asana.com';
const URL_SEPARATOR = '/';

const isLinkForFullScreen = (asanaLinkParts) => asanaLinkParts[0] === 'f';

async function main(githubPR) {
	let githubToken = getToken(GITHUB_TOKEN);

	if (!githubToken) {
		log('Github Token not found');
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
	log('Successfully got the pr link', prLink);

	const parsedUrl = ParseGithubUrl(prLink);
	log('Successfully parsed the github url', parsedUrl);

	const pullRequest = await octokit.pulls.get({
		owner: parsedUrl.owner,
		repo: parsedUrl.name,
		pull_number: parsedUrl.filepath,
	});
	log('Successfully fetched the pull request', pullRequest.url);

	const urls = Array.from(getUrls(pullRequest.data.body));
	log('Successfully fetched the urls from pull request', urls);

	const asanaLinks = urls.filter((url) => url.includes(ASANA_DOMAIN));
	if (asanaLinks.length === 0) {
		return 'No asana link found in the PR';
	}
	log('Successfully filtered asana links', asanaLinks);

	const asanaTaskIds = asanaLinks.map((link) => {
		const linkParts = link.split(URL_SEPARATOR).reverse();
		return linkParts[isLinkForFullScreen(linkParts) ? 1 : 0];
	});
	log('Successfully fetched the task ids', asanaTaskIds);
}

module.exports = main;
