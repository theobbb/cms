<script lang="ts">
	import { type Snippet } from 'svelte';
	import { set_pop_context, type Pop } from '../primitives/pop/pop-context.svelte';

	let {
		pop,
		size = 'md',
		onclose: outer_onclose,
		header,
		children
	}: {
		pop: Pop;
		size?: Size;
		onclose?: () => void;
		header?: Snippet;
		children: Snippet;
	} = $props();

	set_pop_context(pop);

	type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

	const sizes = {
		sm: 'w-sm',
		md: 'w-md',
		lg: 'w-lg',
		xl: 'w-xl',
		'2xl': 'w-2xl',
		'3xl': 'w-3xl'
	};

	function open(el: HTMLDialogElement) {
		el.showModal();
	}

	function onclose() {
		pop.close();
		if (outer_onclose) outer_onclose();
	}
</script>

{#if pop.open}
	<dialog use:open closedby="any" class={['m-auto shadow-none!', sizes[size]]} {onclose}>
		<div class="bg-background divide-y-gap-y px-gap py-gap-y">
			{#if header}
				<div class="text-lg">{@render header()}</div>
			{/if}
			<div class="">{@render children()}</div>
		</div>
	</dialog>
{/if}

<style>
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.3);
		/* backdrop-filter: brightness(0.5); */
		/* backdrop-filter: blur(5px); */
	}
</style>
