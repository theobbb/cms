// scripts/create_session.ts
import { create_session } from '../src/lib/logic/sessions.ts';

const [, , name, role] = process.argv;

if (!name || !role) {
	console.error('Usage: npx tsx scripts/create_session.ts <name> <role>');
	process.exit(1);
}

const result = await create_session({ name, role: Number(role) });
console.log('Session created:', result);
