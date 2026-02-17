<script lang="ts">
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();

	const links = [
		{ name: 'Members', param: '' },
		{ name: 'Invites', param: 'invites' }
	];
</script>

<div class="flex divide-x">
	<Nav {links} base_path="users" />

	{@render children()}
</div>
