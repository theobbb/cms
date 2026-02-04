import type { Branch, Leaf, Schema, TreeItem } from '$config/types';

// export function process_schema(schema: Schema, parent_path = ''): TreeItem[] {
// 	return schema.map((item) => {
// 		if (item.type != 'link') return item;

// 		item.path = parent_path ? `${parent_path}/${item.param}` : item.param;

// 		if (item.children) {
// 			item.children = process_schema(item.children, item.path);
// 		}

// 		return item;
// 	});
// }

export function process_collections<T extends Record<string, any>>(json_collections: any[]): T {
	// 1. Iterate over the array of collection objects
	// 2. Map the 'name' property to the key of the new object
	return Object.fromEntries(
		json_collections.map((col) => [
			col.name,
			{
				...col,
				// We ensure 'name' is present in the value as well
				name: col.name
			}
		])
	) as T;
}

export function build_schema_sections(schema: Schema, path: string): TreeItem[][] {
	const segments = path ? path.split('/').filter(Boolean) : [];
	const sections: TreeItem[][] = [schema];
	let current_level = schema;

	for (const segment of segments) {
		// Find the item in the current level that matches the URL segment
		const match = current_level.find((item) => item.param === segment);

		// If we found a branch, drill down into its children
		if (match && is_branch(match)) {
			current_level = match.children;
			sections.push(current_level);
		}
		// If it's a leaf or not found, we stop drilling
		else {
			break;
		}
	}

	return sections;
}

export function find_current_link(schema: Block[], route: string): BlockLink | null {
	for (const block of schema) {
		if (block.type != 'link') continue;
		// Check if this block is the one
		if (block.path === route) return block;

		// If it has children, search them recursively
		if (block.children) {
			const found = find_current_link(block.children, route);
			if (found) return found;
		}
	}
	return null;
}

export function resolve_query_params(
	filter: string,
	params: Record<string, string | undefined>
): string {
	// Matches $param.something and replaces it with params['something']
	return filter.replace(/\$param\.(\w+)/g, (_, key) => {
		const value = params[key];
		if (!value) {
			console.warn(`Query variable $param.${key} was not found in URL params.`);
			return "''"; // Fallback to empty string to prevent PocketBase syntax errors
		}
		return `'${value.replace(/'/g, "\\'")}'`; // Escape single quotes for safety
	});
}

export function is_leaf(item: TreeItem): item is Leaf {
	return 'collection' in item;
}

export function is_branch(item: TreeItem): item is Branch {
	return 'children' in item;
}

// export function is_dynamic(block: Block): block is BlockDynamicLink {
// 	return block.type === 'dynamic_link';
// }
