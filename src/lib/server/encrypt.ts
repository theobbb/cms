import { HASH_SECRET } from '$env/static/private';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function get_key(): Buffer {
	const secret = HASH_SECRET;

	if (!secret) {
		throw new Error('ID_SECRET is not defined');
	}

	return createHash('sha256').update(secret).digest();
}

const IV = Buffer.alloc(16, 0); // deterministic

export function encode(id: string): string {
	const cipher = createCipheriv(ALGORITHM, get_key(), IV);

	return Buffer.concat([cipher.update(id, 'utf8'), cipher.final()]).toString('base64url');
}

export function decode(encoded: string): string {
	const decipher = createDecipheriv(ALGORITHM, get_key(), IV);

	return Buffer.concat([
		decipher.update(Buffer.from(encoded, 'base64url')),
		decipher.final()
	]).toString('utf8');
}
