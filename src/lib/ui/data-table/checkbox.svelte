<script lang="ts">
	const { checked, ontoggle }: { checked: boolean; ontoggle: () => void } = $props();

	function onclick(ev: MouseEvent) {
		ev.stopPropagation();
		ontoggle();
	}
</script>

<button
	{onclick}
	class={['text-foreground-muted flex pl-md text-2xl', checked ? '' : 'text-2']}
	aria-label="toggle check"
>
	<span class={[checked ? 'icon-[ri--checkbox-line]' : 'icon-[ri--checkbox-blank-line]']}></span>
</button>
