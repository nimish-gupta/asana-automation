#!/usr/bin/env node

const markAsanaTaskCompleted = require('./src/markAsanaTaskCompleted');
const getAsanaTaskFromGithubPr = require('./src/getAsanaTaskFromGithubPr');

const argv = require('minimist')(process.argv.slice(2));

if (argv.githubPR) {
	getAsanaTaskFromGithubPr(argv.githubPR);
} else {
	markAsanaTaskCompleted();
}
