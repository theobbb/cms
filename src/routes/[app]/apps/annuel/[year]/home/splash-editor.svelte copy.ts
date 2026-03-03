import { getContext, setContext } from 'svelte';

import { use_pocketbase } from '$lib/pocketbase';
import { page } from '$app/state';

const COLLECTION = 'splash_versions';
const MEDIA_COLLECTION = 'splash_files';

export const FILE_TYPES = ['image', 'video', 'font', 'other'];

export type MediaType = (typeof FILE_TYPES)[keyof typeof FILE_TYPES];

export interface MediaFile {
	id: string;
	name: string;
	type: MediaType;
	url: string;
}

export class SplashEditor {
	private pocketbase = use_pocketbase();

	// — State —
	html = $state('');
	css = $state('');
	media_files: MediaFile[] = $state([]);
	active_tab = $state<'html' | 'css'>('html');
	preview_open = $state(false);
	save_status = $state<'' | 'saving' | 'saved' | 'error'>('');
	uploading = $state(false);
	loading = $state(true);

	private record_id: string | null = null;

	// — Derived —
	get images() {
		return this.media_files.filter((f) => f.type === 'image');
	}
	get videos() {
		return this.media_files.filter((f) => f.type === 'video');
	}
	get fonts() {
		return this.media_files.filter((f) => f.type === 'font');
	}

	get output() {
		return this.build_output(this.html, this.css, this.media_files);
	}

	// get preview_html() {
	// 	return this.build_preview(this.html, this.css, this.media_files);
	// }

	// — Constructor —
	constructor() {
		$effect(() => {
			this.load();
		});
	}

	// — Init —
	async load() {
		this.loading = true;
		try {
			const result = await this.pocketbase.collection(COLLECTION).getList(1, 1);

			if (result.items.length) {
				const record = result.items[0];
				this.record_id = record.id;
				this.html = record.html ?? '';
				this.css = record.css ?? '';
			}

			await this.load_media();
		} catch (e) {
			console.error('Failed to load landing page', e);
		} finally {
			this.loading = false;
		}
	}

	async load_media() {
		const result = await this.pocketbase.collection(MEDIA_COLLECTION).getList(1, 200);

		this.media_files = result.items.map((item) => ({
			id: item.id,
			name: item.file as string,
			type: item.type as MediaType,
			url: this.pocketbase.files.getURL(item, item.file)
		}));
	}

	// — Save —
	async save() {
		this.save_status = 'saving';
		try {
			const body = { html: this.html, css: this.css, output: this.output, year: page.params.year };

			if (this.record_id) {
				await this.pocketbase.collection(COLLECTION).update(this.record_id, body);
			} else {
				const record = await this.pocketbase.collection(COLLECTION).create(body);
				this.record_id = record.id;
			}

			this.save_status = 'saved';
		} catch (e) {
			console.error('Failed to save', e);
			this.save_status = 'error';
		} finally {
			setTimeout(() => (this.save_status = ''), 3000);
		}
	}

	// — Media upload —
	async upload_files(files: FileList | File[]) {
		this.uploading = true;
		try {
			for (const file of Array.from(files)) {
				const form = new FormData();
				form.append('file', file);
				form.append('name', file.name);
				form.append('type', this.detect_type(file));
				await this.pocketbase.collection(MEDIA_COLLECTION).create(form);
			}
			await this.load_media();
		} catch (e) {
			console.error('Upload failed', e);
		} finally {
			this.uploading = false;
		}
	}

	// — Media delete —
	async delete_media(id: string) {
		await this.pocketbase.collection(MEDIA_COLLECTION).delete(id);
		this.media_files = this.media_files.filter((f) => f.id !== id);
	}

	// — Token helper —
	copy_token(name: string) {
		navigator.clipboard.writeText(`@media/${name}`);
	}

	// — Output / Preview —
	private build_output(html: string, css: string, files: MediaFile[]) {
		// Resolve @media/filename tokens to real URLs
		let resolved = html;
		for (const f of files) {
			resolved = resolved.replaceAll(`@media/${f.name}`, f.url);
		}

		// If the user wrote a full document, inject the scoped CSS into <head>
		// Otherwise wrap everything in a minimal document shell
		const scoped = this.scope_css(css);
		if (resolved.includes('<html')) {
			return resolved.replace('</head>', `<style>${scoped}</style>\n</head>`);
		}

		return `
    <style>${scoped}</style>
    <main>${resolved}</main>`;
	}

	private scope_css(css: string) {
		return css.replace(/([^{}]+)\{/g, (match, selector) => {
			const trimmed = selector.trim();
			if (!trimmed || trimmed.startsWith('@')) return match;
			const scoped = trimmed
				.split(',')
				.map((s) => `.annuel-custom ${s.trim()}`)
				.join(', ');
			return `${scoped} {`;
		});
	}

	// — Helpers —
	private detect_type(file: File): MediaType {
		if (file.type.startsWith('image/')) return 'image';
		if (file.type.startsWith('video/')) return 'video';
		if (file.type.includes('font') || /\.(woff2?|ttf|otf)$/i.test(file.name)) return 'font';
		return 'other';
	}

	handle_tab(e: KeyboardEvent) {
		if (e.key !== 'Tab') return;
		e.preventDefault();
		const ta = e.target as HTMLTextAreaElement;
		const s = ta.selectionStart;
		const val = ta.value;
		ta.value = val.slice(0, s) + '  ' + val.slice(ta.selectionEnd);
		ta.selectionStart = ta.selectionEnd = s + 2;
		if (this.active_tab === 'html') this.html = ta.value;
		else this.css = ta.value;
	}
}

const SPLASH_EDITOR_KEY = Symbol('SPLASH_EDITOR_KEY');

export function init_editor(): SplashEditor {
	const instance = new SplashEditor();
	setContext(SPLASH_EDITOR_KEY, instance);
	return instance;
}

export function use_editor(): SplashEditor {
	return getContext<SplashEditor>(SPLASH_EDITOR_KEY);
}
