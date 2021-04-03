const enquirer = require('enquirer');

const fetchAndSaveToken = require('./fetchAndSaveToken');
const getToken = require('./getToken');
const log = require('./log');

const GITHUB_TOKEN = 'GITHUB_PERSONAL_TOKEN';

async function main(githubPR) {
	let githubToken = getToken(GITHUB_TOKEN);

	if (!githubToken) {
		log('Github Token not found');
		githubToken = await fetchAndSaveToken(GITHUB_TOKEN, 'github');
	}

	if (!githubToken) {
		throw new Error("Couldn't found the github token");
	}

	const { prLink } =
		githubPR === true
			? await enquirer.prompt({
					type: 'input',
					name: 'prLink',
					message: 'Please enter the PR link:',
			  })
			: { prLink: githubPR };
	log('Successfully got the pr link', prLink);
}

module.exports = main;
