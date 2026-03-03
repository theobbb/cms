<script lang="ts">
	import TemplateBox from './template-box.svelte';

	const props = $props();
</script>

<TemplateBox {...props} color="yellow" icon="icon-[ri--error-warning-line]" />
