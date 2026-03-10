<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import Anchor from '$lib/ui/components/pop/anchor.svelte';
	import DropdownMenuItem from '$lib/ui/components/pop/dropdown-menu/dropdown-menu-item.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import Popover from '$lib/ui/components/pop/popover.svelte';
	import { icons } from '$lib/ui/icons';

	const user = $derived(page.data.user);

	const pop = new Pop();
</script>

<div>
	<button
		onclick={pop.show}
		class="flex cursor-pointer items-center gap-1 hover:underline"
		style="anchor-name: --pop-user;"
	>
		<span class="icon-[ri--user-line]"></span>
		{user?.name}
	</button>

	<Popover {pop}>
		<Anchor anchor="--pop-user" top="bottom" right="right" class="mt-2">
			<Box color="surface">
				<div class="my-1 flex flex-col">
					<DropdownMenuItem
						item={{ type: 'link', href: '/settings/profile', label: 'Profil', icon: icons.user }}
					/>

					<DropdownMenuItem item={{ type: 'divider' }} />
					<form class="contents" method="POST" action="/{page.params.app}/auth/signout">
						<Button
							icon="icon-[ri--logout-box-line]"
							type="submit"
							class={['hover:bg-secondary mx-1 justify-start text-red-600']}>Déconnexion</Button
						>
					</form>
				</div>
			</Box>
		</Anchor>
	</Popover>
</div>
