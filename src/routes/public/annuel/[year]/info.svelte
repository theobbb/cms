<script lang="ts">
	const { children } = $props();
</script>

<div class="mb-2 pt-2 text-sm text-muted">
	{@render children()}
</div>
