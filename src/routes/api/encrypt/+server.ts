import { text } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { decode, encode } from '$lib/server/encrypt.js';

export async function GET({ url }) {
	const value = url.searchParams.get('value');
	if (!value) return error(500, 'invalid value');

	return text(decode(value));
}

export async function POST({ request }) {
	const body = await request.json();
	if (typeof body != 'string') return error(500, 'invalid string');

	return text(encode(body));
}
