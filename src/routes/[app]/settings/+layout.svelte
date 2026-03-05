<script lang="ts">
	import Nav from '$lib/components/nav.svelte';

	const { children } = $props();
</script>

<Nav
	links={[
		{ name: 'Profil', slug: 'profile' },
		{ name: 'Backups', slug: 'backups' },
		{ name: 'Logs', slug: 'logs' }
	]}
	base_path="/settings"
/>

{@render children()}
