<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import { confirm } from '$lib/logic/confirm.svelte';
	import { use_pocketbase } from '$lib/pocketbase';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import DropdownMenu from '$lib/ui/components/pop/dropdown-menu/dropdown-menu.svelte';

	const { year } = $props();
	const props_id = $props.id();

	const pocketbase = use_pocketbase();
	const toaster = use_toaster();

	const pop = new Pop();

	async function delete_year() {
		const confirmed = await confirm(`Supprimer ${year.id} ?`);
		if (!confirmed) return;

		try {
			const id = year.id;
			pocketbase.collection('years').delete(id);
			toaster.push('success', `${id} suprimé.`);
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

	<DropdownMenu
		options={[
			{
				type: 'button',
				action: delete_year,
				label: 'Supprimer',
				icon: 'icon-[ri--delete-bin-line]'
			}
		]}
		{pop}
		anchor="--dropdown-year-{props_id}"
		top="bottom"
		right="right"
	/>
</div>
<!-- 
{#if pop.open}
	<Anchor anchor="dropdown-year-{props_id}" {pop}>
		<div>ss</div>
	</Anchor>
{/if} -->
