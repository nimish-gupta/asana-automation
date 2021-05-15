import Asana from 'asana';

const URL_SEPARATOR = '/';

const isLinkForFullScreen = (asanaLinkParts: string[]) =>
	asanaLinkParts[0] === 'f';

export const getTaskIdsFromUrls = (asanaLinks: string[]) => {
	const asanaTaskIds = asanaLinks.map((link) => {
		const linkParts = link.split(URL_SEPARATOR).reverse();
		return linkParts[isLinkForFullScreen(linkParts) ? 1 : 0];
	});

	return asanaTaskIds;
};

export const getAsanaClient = (asanaToken: string) => {
	const asanaClient = Asana.Client.create().useAccessToken(asanaToken);
	return asanaClient;
};
