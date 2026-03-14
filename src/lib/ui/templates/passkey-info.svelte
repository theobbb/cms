<script>
	import Tooltip from '../components/pop/tooltip.svelte';

	const props_id = $props.id();
</script>

<div class="inline">
	<a
		href="/help/passkeys"
		target="_blank"
		class="peer text-indigo-600"
		style="anchor-name: --anchor-passkey-info-{props_id};"
	>
		passkey
		<sup class="-ml-0.5 translate-y-0.5">?</sup>
	</a>
	<Tooltip
		anchor="--anchor-passkey-info-{props_id}"
		left="center"
		bottom="top"
		class="my-1.5 -translate-x-1/2"
	>
		En savoir plus
	</Tooltip>
</div>
