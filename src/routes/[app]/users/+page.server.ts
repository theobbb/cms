import type { Collection } from '$config/types';
import { get_list } from '$lib/server/get-list';

type UsersRecord = {
	id: string;
	email: string;
	verified: boolean;
	name: string;
	avatar: string;
	created: string;
};

export async function load(event) {
	const collection: Collection<UsersRecord> = {
		title: 'Membres',
		name: 'users',
		fields: [
			{
				key: 'name',
				title: 'name',
				type: 'string'
			},
			{
				key: 'email',
				title: 'email',
				type: 'email'
			},
			{
				key: 'verified',
				title: 'verified',
				type: 'bool'
			},
			{
				key: 'avatar',
				title: 'avatar',
				type: 'file'
			},
			{
				key: 'created',
				title: 'created',
				type: 'string'
			}
		]
	};

	collection.data = await get_list(event, 'users');

	const schema_sections = [[collection]];
	return { schema_sections };
}
