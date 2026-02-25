<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import { marked } from 'marked';
	import { tick } from 'svelte';
	import Dialog from '../pop/dialog.svelte';

	let {
		value = $bindable(''),
		placeholder = '',
		id,
		name,
		label = '',
		required = false,
		rows = 6
	}: {
		value?: string;
		placeholder?: string;
		id: string;
		name: string;
		label?: string;
		required?: boolean;
		rows?: number;
	} = $props();

	type ViewState = 'input' | 'output';
	let view: ViewState = $state('input');
	let textarea: HTMLTextAreaElement | null = $state(null);

	let fullscreen = $state(false);
	// --- History State ---
	type HistorySnapshot = {
		text: string;
		start: number;
		end: number;
	};

	let history: HistorySnapshot[] = $state([]);
	let history_index = $state(-1);
	let debounce_timer: ReturnType<typeof setTimeout>;

	marked.use({ gfm: true, breaks: true });

	// --- History Logic ---

	function save_snapshot() {
		if (!textarea) return;

		const snapshot: HistorySnapshot = {
			text: value || '',
			start: textarea.selectionStart,
			end: textarea.selectionEnd
		};

		// If we are in the middle of the stack (after undoing), cut off the future
		if (history_index < history.length - 1) {
			history = history.slice(0, history_index + 1);
		}

		// Don't save duplicates (e.g., rapid double clicks)
		const current = history[history_index];
		if (current && current.text === snapshot.text) return;

		history.push(snapshot);
		history_index++;
	}

	async function restore_snapshot(index: number) {
		const snapshot = history[index];
		if (!snapshot) return;

		// Update value
		value = snapshot.text;

		// Update cursor
		await tick();
		if (textarea) {
			textarea.focus();
			textarea.setSelectionRange(snapshot.start, snapshot.end);
		}
	}

	function undo() {
		if (history_index > 0) {
			// If we are at the "tip" of editing (not saved yet), save current state first
			// so we can Redo back to it, then step back.
			const current_text = value || '';
			if (history[history_index] && history[history_index].text !== current_text) {
				save_snapshot();
				history_index--; // Correct the index increment caused by save
			}

			history_index--;
			restore_snapshot(history_index);
		}
	}

	function redo() {
		if (history_index < history.length - 1) {
			history_index++;
			restore_snapshot(history_index);
		}
	}

	// --- Text Manipulation ---

	// Helper to track typing changes
	function on_input() {
		clearTimeout(debounce_timer);
		debounce_timer = setTimeout(() => {
			save_snapshot();
		}, 500); // Save after 500ms of inactivity
	}

	async function update_text(
		new_text: string,
		new_selection_start: number,
		new_selection_end: number
	) {
		// 1. Save history BEFORE programmatic change
		save_snapshot();

		// 2. Apply change
		value = new_text;
		await tick();
		if (textarea) {
			textarea.focus();
			textarea.setSelectionRange(new_selection_start, new_selection_end);

			// 3. Save history AFTER programmatic change (so this new state is the "current" tip)
			save_snapshot();
		}
	}

	// Wrapper to ensure we have valid textarea ref before logic
	async function wrap_selection(before: string, after: string = '', default_text: string = '') {
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = value || '';
		const selected_text = text.substring(start, end);
		const insert_text = selected_text || default_text;

		const replacement = before + insert_text + after;
		const new_text = text.substring(0, start) + replacement + text.substring(end);

		let new_cursor_start = start + before.length;
		let new_cursor_end =
			new_cursor_start + (selected_text ? insert_text.length : default_text.length);

		await update_text(new_text, new_cursor_start, new_cursor_end);
	}

	async function insert_at_line_start(prefix: string) {
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = value || '';

		const before_cursor = text.substring(0, start);
		const line_start_index = before_cursor.lastIndexOf('\n') + 1;
		const after_cursor = text.substring(end);
		const next_newline = after_cursor.indexOf('\n');
		const line_end_index = next_newline === -1 ? text.length : end + next_newline;

		const selected_chunk = text.substring(line_start_index, line_end_index);
		const lines = selected_chunk.split('\n');
		const esc_prefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(`^(\\s*)${esc_prefix}\\s?`);
		const all_have_prefix = lines.every((line) => regex.test(line));

		const new_lines = lines.map((line) => {
			return all_have_prefix ? line.replace(regex, '$1') : prefix + ' ' + line;
		});

		const new_chunk = new_lines.join('\n');
		const new_text =
			text.substring(0, line_start_index) + new_chunk + text.substring(line_end_index);
		const length_diff = new_chunk.length - selected_chunk.length;

		await update_text(
			new_text,
			start === line_start_index ? start : start + length_diff,
			end + length_diff
		);
	}

	// --- Actions & Keys ---

	const actions = {
		heading: () => insert_at_line_start('#'),
		bold: () => wrap_selection('**', '**', 'bold text'),
		italic: () => wrap_selection('*', '*', 'italic text'),
		quote: () => insert_at_line_start('>'),
		code: () => {
			if (!textarea) return;
			const text = value.substring(textarea.selectionStart, textarea.selectionEnd);
			text.includes('\n')
				? wrap_selection('```\n', '\n```', 'code block')
				: wrap_selection('`', '`', 'code');
		},
		link: async () => {
			if (!textarea) return;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const text = value;
			const selectedText = text.substring(start, end) || 'link text';
			const replacement = `[${selectedText}](url)`;
			const new_text = text.substring(0, start) + replacement + text.substring(end);
			const url_start = start + selectedText.length + 3;

			await update_text(new_text, url_start, url_start + 3);
		},
		unordered_list: () => insert_at_line_start('-'),
		numbered_list: () => insert_at_line_start('1.'),
		task_list: () => insert_at_line_start('- [ ]')
	};

	function handle_keydown(e: KeyboardEvent) {
		const is_ctrl = e.ctrlKey || e.metaKey;

		// Undo / Redo
		if (is_ctrl && e.key.toLowerCase() === 'z') {
			e.preventDefault(); // Stop browser undo
			if (e.shiftKey) {
				redo();
			} else {
				undo();
			}
			return;
		}

		// Also support Ctrl+Y for Redo (Windows standard)
		if (is_ctrl && e.key.toLowerCase() === 'y') {
			e.preventDefault();
			redo();
			return;
		}

		// Formatting Shortcuts
		if (is_ctrl && !e.shiftKey && !e.altKey) {
			switch (e.key.toLowerCase()) {
				case 'b':
					e.preventDefault();
					actions.bold();
					break;
				case 'i':
					e.preventDefault();
					actions.italic();
					break;
				case 'k':
					e.preventDefault();
					actions.link();
					break;
			}
		}
	}

	// Initial snapshot on mount (or first focus)
	$effect(() => {
		if (history.length === 0 && value) {
			history.push({ text: value, start: 0, end: 0 });
			history_index = 0;
		}
	});

	const md_controls = [
		[
			{ name: 'Heading', action: actions.heading, icon: 'icon-[ri--heading]' },
			{ name: 'Bold', action: actions.bold, icon: 'icon-[ri--bold]' },
			{ name: 'Italic', action: actions.italic, icon: 'icon-[ri--italic]' }
		],
		[
			{ name: 'Quote', action: actions.quote, icon: 'icon-[ri--double-quotes-l]' },
			{ name: 'Code', action: actions.code, icon: 'icon-[ri--code-fill]' },
			{ name: 'Link', action: actions.link, icon: 'icon-[ri--link]' }
		],
		[
			{ name: 'Unordered List', action: actions.unordered_list, icon: 'icon-[ri--list-unordered]' },
			{ name: 'Numbered List', action: actions.numbered_list, icon: 'icon-[ri--list-ordered]' },
			{ name: 'Task List', action: actions.task_list, icon: 'icon-[ri--checkbox-line]' }
		]
	];

	const views = [
		{ mode: 'input' as const, icon: 'icon-[ri--edit-fill]' },
		{ mode: 'output' as const, icon: 'icon-[ri--eye-line]' }
	];

	let html_output = $derived(marked.parse(value || '') as string);
</script>

{@render content(false)}

{#snippet content(local_fullscreen: boolean)}
	<div class="bg-surface text-surface-foreground ring-accent relative w-full focus-within:ring-2">
		<Label {label} {id} {required} icon="icon-[ri--text-block]" />

		<div class="absolute top-0 right-1.5 flex h-8 items-center">
			<Button href="/help/markdown" variant="ghost" size="sm" icon="icon-[ri--information-line]" />
		</div>
		<header
			class="bg-background flex h-8 items-center justify-between gap-4 border border-b py-1.5 pr-1.5 pl-2.5"
		>
			<div class="bg-surface flex w-fit items-center gap-1 p-1">
				{#each views as { mode, icon }}
					<button
						onclick={() => (view = mode)}
						type="button"
						class={[
							'flex cursor-pointer items-center justify-center p-0.5',
							view === mode ? 'bg-background ring ring-black/15' : 'not-hover:text-foreground/50'
						]}
						aria-label="Switch to {mode} view"
					>
						<div class={[icon]}></div>
					</button>
				{/each}
			</div>

			<div class="flex justify-end">
				{#if view === 'input' && local_fullscreen}
					<div
						class="mr-2 flex items-center divide-x divide-white/10 overflow-x-auto border-r pr-2"
					>
						{#each md_controls as group}
							<div class="flex items-center px-2">
								{#each group as control}
									<Button
										icon={control.icon}
										variant="ghost"
										onclick={control.action}
										class="p-1"
										title={control.name}
									/>
								{/each}
							</div>
						{/each}
					</div>
				{/if}
				<Button
					onclick={() => (fullscreen = !fullscreen)}
					icon={fullscreen ? 'icon-[ri--fullscreen-exit-line]' : 'icon-[ri--fullscreen-line]'}
					variant="ghost"
				/>
			</div>
		</header>

		<div class={['relative z-50']}>
			<div class:hidden={view === 'output'}>
				<div onkeydown={handle_keydown} role="presentation" class="*:ring-0!">
					<Textarea
						bind:ref={textarea}
						bind:value
						oninput={on_input}
						class="w-full rounded-t-none border-t-0"
						{id}
						{placeholder}
						{name}
						{rows}
					/>
				</div>
			</div>

			<div class:hidden={view === 'input'}>
				<div class="min-h-44 w-full border border-t-0 px-3 py-2">
					{#if !value}
						<p class="italic">Nothing to preview</p>
					{:else}
						<div class="markdown prose prose-invert max-w-none">
							{@html html_output}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#if fullscreen}
	<Dialog onclose={() => (fullscreen = false)} size="3xl">
		<div class="-mx-gap -my-gap-y max-w-3xl">{@render content(true)}</div>
	</Dialog>
{/if}
