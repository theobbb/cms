<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import Anchor from '$lib/ui/components/pop/anchor.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import Popover from '$lib/ui/components/pop/popover.svelte';
	import Box from '$lib/components/box.svelte';
	import DropdownMenuItem from '$lib/ui/components/pop/dropdown-menu/dropdown-menu-item.svelte';
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	const { year } = $props();
	const props_id = $props.id();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const pop = new Pop();

	let submitted = $state(false);

	async function delete_year() {
		const confirmed = await confirm('Voulez-vous vraiment supprimer cette année ?');
		if (!confirmed) return;

		try {
			const id = year.id;
			pocketbase.collection('years').delete(id);
			toaster.push('success', 'Année suprimée');
			await invalidateAll();

			if (id == page.params.year) {
				goto(`/${page.data.years[0]?.id}/years`);
			}
		} catch (err) {
			toaster.push('error');
		}
	}
</script>

<div>
	<Button
		onclick={pop.toggle}
		variant="none"
		icon="icon-[ri--more-fill]"
		style="anchor-name: --dropdown-year-{props_id}"
	/>

	<Popover {pop}>
		<Anchor anchor="--dropdown-year-{props_id}" top="bottom" right="right">
			<Box color="surface">
				<div class="my-1">
					<div></div>
					<DropdownMenuItem item={{ type: 'divider' }} />
					<DropdownMenuItem
						item={{
							type: 'button',
							label: 'Supprimer',
							icon: 'icon-[ri--delete-bin-line]',
							action: delete_year
						}}
					/>
				</div>
			</Box>
		</Anchor>
	</Popover>
</div>
<!-- 
{#if pop.open}
	<Anchor anchor="dropdown-year-{props_id}" {pop}>
		<div>ss</div>
	</Anchor>
{/if} -->
