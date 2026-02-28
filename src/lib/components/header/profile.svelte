<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/button.svelte';
	import Anchor from '$lib/ui/pop/anchor.svelte';
	import DropdownMenu from '$lib/ui/pop/dropdown-menu.svelte';
	import { Pop } from '$lib/ui/pop/pop-context.svelte';

	const { user } = $derived(page.data);

	const pop = new Pop();
</script>

<div>
	<button onclick={pop.toggle} style="anchor-name: --dropdown-profile;">
		<div class="flex items-center gap-1">
			<span class="icon-[ri--user-line]"></span>
			{user?.name}
		</div>
	</button>

	{#if pop.open}
		<Anchor
			anchor="--dropdown-profile;"
			top="bottom"
			left="self-start"
			position_try="flip-inline"
			class="my-2"
		>
			<Box color="surface">
				<div class="flex flex-col">
					<Button href="/settings/profile">Profil</Button>
					<Button href="/settings/profile">Log out</Button>
				</div>
			</Box>
		</Anchor>
	{/if}
</div>
