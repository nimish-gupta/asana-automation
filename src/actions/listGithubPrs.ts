import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { endOfDay, parseISO, startOfDay, sub } from 'date-fns';
import { ParsedArgs } from 'minimist';
import Ora from 'ora';
import Table from 'cli-table3';
import chalk from 'chalk';

import getToken, { TokenType } from '../getToken';
import { error } from '../log';

const parseArgv = (
	argv: ParsedArgs
): RestEndpointMethodTypes['pulls']['list']['parameters'] => {
	if (!argv.owner || !argv.repo) {
		throw new Error('Please provide both owner and repo as arguments.');
	}

	return {
		owner: argv.owner,
		repo: argv.repo,
		state: argv.state || 'all',
		sort: 'created',
		direction: 'desc',
		per_page: 20,
	};
};

const dateRange = (lastNumberOfDays: number) => {
	const endDate = endOfDay(new Date());
	const startDate = startOfDay(sub(endDate, { days: lastNumberOfDays }));

	return { endDate, startDate };
};

const greaterThan = (sourceDate: Date, targetDate: Date) =>
	sourceDate.getTime() >= targetDate.getTime();

const lesserThan = (sourceDate: Date, targetDate: Date) =>
	sourceDate.getTime() <= targetDate.getTime();

const displayPrs = (
	pulls: RestEndpointMethodTypes['pulls']['list']['response']['data']
) => {
	const table = new Table({
		head: [chalk.gray('title'), chalk.gray('url'), chalk.gray('status')],
	});

	pulls.forEach((pull) =>
		table.push([
			chalk.bold(pull.title),
			chalk.underline.blue(pull.url),
			pull.state,
		])
	);

	if (table.length === 0) {
		error('There are no pull requests for this owner and repo.');
	} else {
		console.log(table.toString());
	}
};

const listGithubPrs = async (argv: ParsedArgs) => {
	const spinner = Ora({ text: 'Fetching pull requests' });
	spinner.start();

	try {
		const githubToken = await getToken({
			type: TokenType.GITHUB_TOKEN,
			label: 'github',
		});
		const lastNumberOfDays = Number(argv.lastNumberOfDays || '7');

		const params = parseArgv(argv);

		const octokit = new Octokit({
			auth: githubToken,
		});

		const { data: pulls } = await octokit.pulls.list(params);

		const { startDate, endDate } = dateRange(lastNumberOfDays);

		const filteredPulls = pulls.filter(
			({ created_at: createdAt }) =>
				greaterThan(parseISO(createdAt), startDate) &&
				lesserThan(parseISO(createdAt), endDate)
		);

		spinner.stop();
		displayPrs(filteredPulls);
	} catch (error) {
		spinner.stop();
		throw error;
	}
};

export default listGithubPrs;
