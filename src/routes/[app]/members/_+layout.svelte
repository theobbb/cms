<script lang="ts">
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Members', param: '' },
		{ name: 'Invites', param: 'invites' }
	];
</script>

{@render children()}
