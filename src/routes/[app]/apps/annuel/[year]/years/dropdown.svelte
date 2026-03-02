<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Anchor from '$lib/ui/pop/anchor.svelte';
	import DropdownMenu from '$lib/ui/pop/dropdown-menu.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';

	const { year } = $props();
	const props_id = $props.id();

	const pop = new Pop();
</script>

<Button
	onclick={pop.toggle}
	variant="none"
	icon="icon-[ri--more-fill]"
	style="anchor-name: --dropdown-year-{props_id}"
/>

{#if pop.open}
	<Anchor anchor="dropdown-year-{props_id}" {pop}>
		<div>ss</div>
	</Anchor>
{/if}
