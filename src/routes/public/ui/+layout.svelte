<script lang="ts">
	import type { LayoutProps } from './$types';

	const { children }: LayoutProps = $props();
</script>

<header>
	<a class="" href="/public/ui/buttons">Buttons</a>
</header>
{@render children()}
