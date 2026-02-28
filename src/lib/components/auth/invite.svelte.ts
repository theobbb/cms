import { page } from '$app/state';
import { use_pocketbase } from '$lib/pocketbase';
import type { RecordModel } from 'pocketbase';
import { use_toaster } from '../toaster/toaster-context.svelte';

export class Invite {
	pocketbase = use_pocketbase();
	toaster = use_toaster();

	type: 'user' | 'passkey' = $state('user');

	user_id = $derived(page.data.user?.id);

	invite: RecordModel | null = $state(null);
	invite_url = $derived(
		this.invite
			? `${page.url.origin}/auth?${this.type == 'user' ? 'register' : 'pair'}=${this.invite?.id}`
			: ''
	);
	loaded = $state(false);

	QR: string | null = $state(null);

	constructor() {
		this.fetch_invite();
	}

	fetch_invite = async () => {
		if (!this.user_id) return;

		this.invite = await this.get_existing_invite();
		if (!this.invite) this.invite = await this.create_invite();

		this.generate_QR();
		this.loaded = true;
	};

	get_existing_invite = async () => {
		try {
			const invite = await this.pocketbase
				.collection(this.invite_collection)
				.getFirstListItem(`user = "${this.user_id}"`);
			return invite;
		} catch (err) {
			return null;
		}
	};

	create_invite = async () => {
		try {
			const invite = await this.pocketbase.collection(invite_collection).create({ user: user_id });
			return invite;
		} catch (err) {
			return null;
		}
	};

	generate_QR = async () => {
		if (!invite) return;
		const url = `${page.url.origin}/auth?pair=${invite.id}`;
		console.log(url);
		try {
			QR = await QRCode.toString(url, { type: 'svg' });
		} catch (err) {}
	};
}
