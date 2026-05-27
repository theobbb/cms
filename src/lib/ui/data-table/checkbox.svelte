<script lang="ts">
	const { checked, ontoggle }: { checked: boolean; ontoggle: () => void } = $props();

	function onclick(ev: MouseEvent) {
		ev.stopPropagation();
		ontoggle();
	}
</script>

<button {onclick} class={['flex pl-3x text-2xl ', checked ? '' : '']} aria-label="toggle check">
	<span class={[checked ? 'icon-[ri--checkbox-line]' : 'icon-[ri--checkbox-blank-line] text-muted']}
	></span>
</button>
