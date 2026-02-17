<script lang="ts">
	const { data, children } = $props();
</script>

<div class="flex divide-x">
	{@render children()}
</div>
