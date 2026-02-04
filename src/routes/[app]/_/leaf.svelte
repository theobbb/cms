<script lang="ts">
	import type { Branch, Leaf } from '$config/types';
	import LayoutSection from '$lib/ui/layouts/layout-section.svelte';
	import Link from './link.svelte';

	const { leaf }: { leaf: Leaf } = $props();
</script>

<Link link={leaf} />
