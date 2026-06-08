import { use_pocketbase } from '../pocketbase';
export async function create_session({ name, role }: { name: string; role: number }) {
	if (!name || !role) return;
	const pocketbase = use_pocketbase();
	const identity = Math.random().toString(36).slice(-12);
	const temp_password = Math.random().toString(36).slice(-12);

	const new_user = await pocketbase.collection('users').create({
		name,
		role
	});

	const session = await pocketbase.collection('sessions').create({
		user: new_user.id,
		identity,
		password: temp_password,
		passwordConfirm: temp_password
	});

	return session;
}
