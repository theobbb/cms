import { build_schema_sections, find_current_link } from '$config/utils';
import { get_list } from '$lib/logic/data/get-list';

export async function load(event) {
	const {
		locals: { app },
		params
	} = event;
	//console.log(app.schema);
	const schema_sections = build_schema_sections(app.schema, params.schema);
	const current_blocks = find_current_link(app.schema, params.schema)?.children || [];

	for (const block of current_blocks) {
		if (block.type == 'link') continue;
		const { collection } = block;
		if (!collection.name) continue;
		const data = await get_list(event, collection.name, { query: block.query });

		block.collection.data = data;
	}

	return { app, schema_sections };
}
