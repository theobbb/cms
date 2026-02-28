<script lang="ts">
	import { type Snippet } from 'svelte';
	import { set_pop_context, type Pop } from './pop-context.svelte';

	let {
		pop,
		size = 'md',
		onclose: outer_onclose,
		children
	}: { pop: Pop; size?: Size; onclose?: () => void; children: Snippet } = $props();

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

<dialog use:open closedby="any" class={['m-auto', sizes[size]]} {onclose}>
	<div class="bg-background px-gap py-gap-y">
		{@render children()}
	</div>
</dialog>

<style>
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.3);
		/* backdrop-filter: brightness(0.5); */
		/* backdrop-filter: blur(5px); */
	}
</style>
