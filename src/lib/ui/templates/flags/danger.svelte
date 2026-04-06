<script lang="ts">
	import Flag from './flag.svelte';

	const props = $props();
</script>

<Flag {...props} color="red" icon="icon-[ri--error-warning-line]" />
