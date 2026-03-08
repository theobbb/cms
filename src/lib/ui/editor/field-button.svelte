<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Button from '../components/button.svelte';

	const props: ComponentProps<typeof Button> = $props();
</script>

<Button {...props} size="lg" class="w-full" />
