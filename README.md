# asana-automation

This repo helps me in automating some of the asana tasks via cli.

## Automations

- Automatically close the asana task via github PR from cli.
- Automatically read the description from PR and close the asana tasks if asana links are present in the description

## Access token

We need two access tokens for this app.

- Asana Access Token
- Github Access Token

For getting asana access token, checkout [this](https://developers.asana.com/docs/authentication-quick-start) doc. For getting github access token, checkout [this](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) link.

## Installation

- via npm

```
npm install -g asana-task
```

- via yarn

```
yarn global add asana-task
```
