import { getContext, setContext } from 'svelte';
import { use_pocketbase } from '$lib/pocketbase';
import { page } from '$app/state';
import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';

const COLLECTION = 'splash_versions';
const MEDIA_COLLECTION = 'splash_files';

export const FILE_TYPES = ['image', 'video', 'font', 'other'] as const;
export type MediaType = (typeof FILE_TYPES)[number];

// A persisted file loaded from PocketBase
export interface PersistedFile {
	kind: 'persisted';
	id: string;
	name: string;
	type: MediaType;
	url: string; // real PocketBase URL
}

// A file staged locally, not yet uploaded
export interface PendingFile {
	kind: 'pending';
	name: string;
	type: MediaType;
	file: File;
	blob_url: string; // temporary object URL for preview
}

export type MediaFile = PersistedFile | PendingFile;

export class SplashEditor {
	private pocketbase = use_pocketbase();
	private toaster = use_toaster();

	// — State —
	html = $state('');
	css = $state('');
	media_files: MediaFile[] = $state([]);
	active_tab = $state<'html' | 'css'>('html');
	preview_open = $state(false);
	save_status = $state<'' | 'saving' | 'saved' | 'error'>('');
	loading = $state(true);

	// Track which persisted files the user has removed, so we delete them on save
	private deleted_ids = new Set<string>();
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

	get has_pending() {
		return this.media_files.some((f) => f.kind === 'pending') || this.deleted_ids.size > 0;
	}

	// For the preview: pending files use their blob URL, persisted use real URL
	get output() {
		return this.build_output(this.html, this.css, this.media_files);
	}

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
			console.error('Failed to load splash page', e);
		} finally {
			this.loading = false;
		}
	}

	async load_media() {
		const result = await this.pocketbase.collection(MEDIA_COLLECTION).getList(1, 200);
		this.media_files = result.items.map(
			(item): PersistedFile => ({
				kind: 'persisted',
				id: item.id,
				name: item.file as string,
				type: item.type as MediaType,
				url: this.pocketbase.files.getURL(item, item.file)
			})
		);
	}

	// — Stage files locally (no network call) —
	stage_files(files: FileList | File[]) {
		for (const file of Array.from(files)) {
			const pending: PendingFile = {
				kind: 'pending',
				name: file.name,
				type: this.detect_type(file),
				file,
				blob_url: URL.createObjectURL(file)
			};
			this.media_files = [...this.media_files, pending];
		}
	}

	// — Remove a file (deferred for persisted, immediate for pending) —
	remove_file(file: MediaFile) {
		if (file.kind === 'persisted') {
			// Mark for deletion on save — don't touch PocketBase yet
			this.deleted_ids.add(file.id);
		} else {
			// Revoke the object URL to free memory
			URL.revokeObjectURL(file.blob_url);
		}
		this.media_files = this.media_files.filter((f) => f !== file);
	}

	// — Save: flush all staged changes to PocketBase —
	async save() {
		this.save_status = 'saving';
		try {
			// 1. Delete removed persisted files
			await Promise.all(
				[...this.deleted_ids].map((id) => this.pocketbase.collection(MEDIA_COLLECTION).delete(id))
			);
			this.deleted_ids.clear();

			// 2. Upload pending files
			for (const f of this.media_files) {
				if (f.kind !== 'pending') continue;
				const form = new FormData();
				form.append('file', f.file);
				form.append('type', f.type);
				await this.pocketbase.collection(MEDIA_COLLECTION).create(form);
				URL.revokeObjectURL(f.blob_url);
			}

			// 3. Reload media so all files are now PersistedFile with real URLs
			await this.load_media();

			// 4. Save the HTML/CSS/output record (output is now built with real URLs)
			const body = {
				html: this.html,
				css: this.css,
				output: this.output,
				year: page.params.year
			};

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

	// — Token helper —
	copy_token(name: string) {
		navigator.clipboard.writeText(`@media/${name}`);
		this.toaster.push('info', 'url copié');
	}

	// — Output / Preview —
	// Pending files resolve to their blob URL so the preview works before saving
	private build_output(html: string, css: string, files: MediaFile[]) {
		let resolved = html;
		for (const f of files) {
			const url = f.kind === 'persisted' ? f.url : f.blob_url;
			resolved = resolved.replaceAll(`@media/${f.name}`, url);
		}

		const scoped = this.scope_css(css);
		if (resolved.includes('<html')) {
			return resolved.replace('</head>', `<style>${scoped}</style>\n</head>`);
		}

		return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${scoped}</style>
  </head>
  <body>${resolved}</body>
</html>`;
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

// — Context helpers —
const KEY = Symbol('SPLASH_EDITOR');

export function init_editor(): SplashEditor {
	const instance = new SplashEditor();
	setContext(KEY, instance);
	return instance;
}

export function use_editor(): SplashEditor {
	return getContext<SplashEditor>(KEY);
}
