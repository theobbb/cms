<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { get_pop_context } from '../components/pop/pop-context.svelte';
	import ConfirmCancel from './confirm-cancel.svelte';

	const props: ComponentProps<typeof ConfirmCancel> = $props();

	const pop = get_pop_context();
</script>

<ConfirmCancel {...props} onclose={pop.close} />
