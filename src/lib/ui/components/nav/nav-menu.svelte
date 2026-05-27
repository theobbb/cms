<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import DropdownMenu from '../pop/dropdown-menu/dropdown-menu.svelte';

	const user = $derived(page.data.user);

	const pop = new Pop();

	const is_settings = $derived(page.url.pathname?.startsWith('/settings'));

	let url_before_settings = $state('');
	afterNavigate(({ from }) => {
		if (!from?.url.pathname?.startsWith('/settings')) url_before_settings = from?.url.href || '/';
	});
</script>

{#if is_settings}
	<a class="mx-2 mt-4 mb-10 flex items-center gap-1 px-0.5" href={url_before_settings || '/'}>
		<div class="icon-[ri--arrow-left-line] shrink-0"></div>
		Retour
	</a>
{:else}
	<div class="mb-6">
		<Button
			onclick={pop.show}
			class="m-1.5 flex cursor-pointer items-center gap-1.5 p-1 hover:underline"
			style="anchor-name: --pop-menu;"
			icon="icon-[ri--menu-line]"
			variant="ghost"
		/>

		<DropdownMenu
			options={[
				{
					type: 'link',
					href: '/settings/profile',
					label: 'Paramètres',
					icon: 'icon-[ri--settings-line]'
				},
				{
					type: 'link',
					href: '/settings/members',
					label: 'Membres',
					icon: 'icon-[ri--group-line]'
				},
				{ type: 'divider' },
				{
					type: 'link',
					href: '/settings/profile',
					label: user?.name,
					icon: 'icon-[ri--user-line]'
				},
				{ type: 'snippet', snippet: log_out }
			]}
			{pop}
			anchor="--pop-menu"
			top="bottom"
			left="left"
			class="mt-0.5"
		/>
	</div>
{/if}
{#snippet log_out()}
	<form class="contents" method="POST" action="/{page.params.app}/auth/signout">
		<Button
			icon="icon-[ri--logout-box-line]"
			type="submit"
			variant="ghost"
			class={['mx-1 justify-start text-red-surface-foreground hover:bg-secondary']}
		>
			Déconnexion
		</Button>
	</form>
{/snippet}
