import enquirer from 'enquirer';
import Asana from 'asana';

import { getAsanaClient } from './utils/asana';
import { debug } from './log';

const getAsanaTasks = async ({
	projectId,
	client,
	userId,
	workspaceId,
}: {
	projectId: string;
	client: Asana.Client;
	userId?: number;
	workspaceId: string;
}) => {
	const tasks = [];
	let offset = undefined;
	do {
		let response: Asana.resources.ResourceList<Asana.resources.Tasks.Type> = await client.tasks.findAll(
			{
				completed_since: 'now',
				offset,
				opt_fields: 'projects.gid, gid, name',
				...(userId
					? { assignee: userId, workspace: workspaceId }
					: { project: projectId }),
			}
		);
		tasks.push(...response.data);
		debug(`successfully fetched ${tasks.length} tasks`);
		offset = response._response.next_page
			? response._response.next_page.offset
			: undefined;
	} while (offset);

	if (userId) {
		return tasks.filter((task) =>
			task.projects.find(
				({ gid: taskProjectId }) => projectId === taskProjectId
			)
		);
	}

	return tasks;
};

const selectPrompt = async ({
	name,
	asanaCollection,
	type = 'select',
	multiple = false,
}: {
	name: string;
	asanaCollection: Asana.resources.Resource[];
	type?: string;
	multiple?: boolean;
}) => {
	const { [name]: selectedName } = await enquirer.prompt<
		Record<string, string>
	>({
		type,
		name,
		multiple,
		required: true,
		message: `Please select the ${name} from which you want to select the tasks`,
		choices: asanaCollection.map((obj) => obj.name),
	} as any);
	const selectedNames = Array.isArray(selectedName)
		? selectedName
		: [selectedName];

	const foundObjects = asanaCollection.filter((obj) =>
		selectedNames.includes(obj.name)
	);

	if (foundObjects.length !== selectedNames.length) {
		throw new Error(
			`${name} not found all the results for the selected ${name}`
		);
	}

	debug(`Successfully selected the ${name}`);
	return foundObjects;
};

const getTaskIdsForAsana = async ({
	asanaToken,
	onlyMy = false,
}: {
	onlyMy: boolean;
	asanaToken: string;
}) => {
	const asanaClient = getAsanaClient(asanaToken);
	const { workspaces } = await asanaClient.users.me();
	debug('Successfully fetched the workspaces');
	const [workspace] = await selectPrompt({
		name: 'workspace',
		asanaCollection: workspaces,
	});

	const { data: projects } = await asanaClient.projects.findByWorkspace(
		workspace.gid
	);
	debug('Successfully fetched the projects');

	const [project] = await selectPrompt({
		name: 'project',
		asanaCollection: projects,
	});

	const { gid: userId } = onlyMy
		? await asanaClient.users.me()
		: { gid: undefined };

	const tasks = await getAsanaTasks({
		projectId: project.gid,
		client: asanaClient,
		userId: userId ? Number(userId) : undefined,
		workspaceId: workspace.gid,
	});

	const selectedTasks = await selectPrompt({
		name: 'task',
		asanaCollection: tasks,
		type: 'autocomplete',
		multiple: true,
	});

	return selectedTasks.map((task) => task.gid);
};

export default getTaskIdsForAsana;
