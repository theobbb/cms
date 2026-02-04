<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Label from '$lib/ui/form/label.svelte';
	import Textarea from '$lib/ui/form/textarea.svelte';
	import { marked } from 'marked';
	import Tooltip from '../tooltip.svelte';

	let {
		value = '',
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

	type Views = 'input' | 'output';
	let view: Views = $state('input');

	let textarea: HTMLTextAreaElement | null = $state(null);
	let input_value: string = $state(value);

	marked.setOptions({
		gfm: true, // Enable GFM features (tables, task lists, etc.)
		breaks: true // Treat single line breaks as <br> (more user-friendly)
	});

	function wrap_selection(before: string, after: string = '', placeholder: string = '') {
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;
		const selected_text = text.substring(start, end);

		const new_text = selected_text || placeholder;
		const replacement = before + new_text + after;

		textarea.value = text.substring(0, start) + replacement + text.substring(end);

		// Set cursor position
		if (selected_text) {
			textarea.selectionStart = start;
			textarea.selectionEnd = start + replacement.length;
		} else {
			const cursorPos = start + before.length + placeholder.length;
			textarea.selectionStart = cursorPos;
			textarea.selectionEnd = start + before.length;
		}

		textarea.focus();
	}

	function insert_at_line_start(prefix: string) {
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;

		// Find line boundaries
		const before_cursor = text.substring(0, start);
		const line_start = before_cursor.lastIndexOf('\n') + 1;
		const after_cursor = text.substring(end);
		const line_end = after_cursor.indexOf('\n');
		const actual_line_end = line_end === -1 ? text.length : end + line_end;

		const selected_lines = text.substring(line_start, actual_line_end);
		const lines = selected_lines.split('\n');

		// Toggle or add prefix
		const all_have_prefix = lines.every((line) => line.trimStart().startsWith(prefix));

		const new_lines = lines.map((line) => {
			if (all_have_prefix) {
				// Remove prefix
				return line.replace(
					new RegExp(`^(\\s*)${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s?`),
					'$1'
				);
			} else {
				// Add prefix
				const indent = line.match(/^\s*/)?.[0] || '';
				return indent + prefix + ' ' + line.trimStart();
			}
		});

		const new_text =
			text.substring(0, line_start) + new_lines.join('\n') + text.substring(actual_line_end);
		textarea.value = new_text;

		const offset = new_lines.join('\n').length - selected_lines.length;
		textarea.selectionStart = start + (start === line_start ? 0 : Math.min(offset, 0));
		textarea.selectionEnd = end + offset;
		textarea.focus();
	}

	const actions = {
		heading: () => insert_at_line_start('#'),
		bold: () => wrap_selection('**', '**', 'bold text'),
		italic: () => wrap_selection('*', '*', 'italic text'),
		quote: () => insert_at_line_start('>'),
		code: () => {
			if (!textarea) return;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const selected_text = textarea.value.substring(start, end);

			if (selected_text.includes('\n')) {
				// Multi-line: use code block
				wrap_selection('```\n', '\n```', 'code');
			} else {
				// Single line: use inline code
				wrap_selection('`', '`', 'code');
			}
		},
		link: () => {
			if (!textarea) return;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const text = textarea.value;
			const selectedText = text.substring(start, end);

			const link_text = selectedText || 'link text';
			const replacement = `[${link_text}](url)`;

			textarea.value = text.substring(0, start) + replacement + text.substring(end);

			// Select the URL part
			const url_start = start + link_text.length + 3;
			textarea.selectionStart = url_start;
			textarea.selectionEnd = url_start + 3;
			textarea.focus();
		},
		unordered_list: () => insert_at_line_start('-'),
		numbered_list: () => {
			if (!textarea) return;

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const text = textarea.value;

			const before_cursor = text.substring(0, start);
			const line_start = before_cursor.lastIndexOf('\n') + 1;
			const after_cursor = text.substring(end);
			const line_end = after_cursor.indexOf('\n');
			const actual_line_end = line_end === -1 ? text.length : end + line_end;

			const selected_lines = text.substring(line_start, actual_line_end);
			const lines = selected_lines.split('\n');

			const new_lines = lines.map((line, i) => {
				const indent = line.match(/^\s*/)?.[0] || '';
				return indent + `${i + 1}. ` + line.trimStart();
			});

			const new_text =
				text.substring(0, line_start) + new_lines.join('\n') + text.substring(actual_line_end);
			textarea.value = new_text;
			textarea.focus();
		},
		task_list: () => insert_at_line_start('- [ ]'),
		mention: () => wrap_selection('@', '', 'username'),
		reference: () => wrap_selection('#', '', 'issue')
	};

	const md_controls: [name: string, action: () => void, icon: string][][] = [
		[
			['Heading', actions.heading, 'icon-[ri--heading]'],
			['Bold', actions.bold, 'icon-[ri--bold]'],
			['Italic', actions.italic, 'icon-[ri--italic]']
		],
		[
			['Quote', actions.quote, 'icon-[ri--double-quotes-l]'],
			['Code', actions.code, 'icon-[ri--code-fill]'],
			['Link', actions.link, 'icon-[ri--link]']
		],
		[
			['Unordered List', actions.unordered_list, 'icon-[ri--list-unordered]'],
			['Numbered List', actions.numbered_list, 'icon-[ri--list-ordered]']
		],
		[
			['Mention', actions.mention, 'icon-[ri--heading]'],
			['Reference', actions.reference, 'icon-[ri--heading]']
		]
	];

	const views = [
		{ name: 'input', onclick: () => (view = 'input') },
		{ name: 'output', onclick: () => (view = 'output') }
	];
</script>

<div>
	<Label {label} {id} {required} />

	<header class="flex items-center justify-between gap-4 border py-1.5 pr-1.5 pl-2.5">
		<div class="flex items-center gap-1">
			{#each views as { name, onclick }}
				<button
					type="button"
					class={[
						'cursor-pointer border-b-2 px-3 capitalize',
						view == name
							? 'border-white/50! bg-white/15'
							: 'border-transparent! hover:border-white/30! hover:bg-white/10'
					]}
					{onclick}>{name}</button
				>
			{/each}
		</div>

		<div class={[view == 'output' && 'invisible']}>
			<div class="-mr-2.5 flex divide-x divide-white/10">
				{#each md_controls as control_group}
					<div class="flex items-center px-3 text-lg">
						{#each control_group as [name, action, icon]}
							<Button {icon} variant="ghost" type="button" onclick={action}></Button>
							<!-- <Tooltip>
								{name}
							</Tooltip> -->
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</header>

	<div class="relative">
		<div class={[view == 'output' && 'hidden']}>
			<Textarea
				bind:ref={textarea}
				bind:value={input_value}
				class="w-full border-t-0"
				{id}
				{placeholder}
				{name}
				{rows}
			></Textarea>
		</div>

		<div class={[view == 'input' && 'hidden']}>
			<div class="bg-background border border-t-0 px-2.5 py-1.5">
				<div class="markdown">
					{@html marked(input_value || '')}
				</div>
			</div>
		</div>
	</div>
</div>
