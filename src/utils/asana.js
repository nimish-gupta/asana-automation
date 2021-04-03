const URL_SEPARATOR = '/';

const isLinkForFullScreen = (asanaLinkParts) => asanaLinkParts[0] === 'f';

const getTaskIdsFromUrls = (asanaLinks) => {
	const asanaTaskIds = asanaLinks.map((link) => {
		const linkParts = link.split(URL_SEPARATOR).reverse();
		return linkParts[isLinkForFullScreen(linkParts) ? 1 : 0];
	});

	return asanaTaskIds;
};

module.exports = {
	getTaskIdsFromUrls,
};
