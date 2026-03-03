<script lang="ts">
	import TemplateBox from './template-box.svelte';

	const props = $props();
</script>

<TemplateBox {...props} color="blue" icon="icon-[ri--information-line]" />
