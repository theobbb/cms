<script module>
	export type Social = {
		name: string;
		url: string;
	};
</script>

<script lang="ts">
	import { dev } from '$app/environment';
	import { use_toaster } from '$lib/components/toaster/toaster-context.svelte';
	import Button from '$lib/ui/components/button.svelte';
	import Input from '$lib/ui/components/form/fields/input.svelte';
	import Label from '$lib/ui/components/form/label.svelte';
	import ListItem from '$lib/ui/components/list-item.svelte';
	import DialogDescription from '$lib/ui/components/pop/dialog/dialog-description.svelte';
	import DialogHeader from '$lib/ui/components/pop/dialog/dialog-header.svelte';
	import DialogTitle from '$lib/ui/components/pop/dialog/dialog-title.svelte';
	import Dialog from '$lib/ui/components/pop/dialog/dialog.svelte';
	import { Pop } from '$lib/ui/components/pop/pop-context.svelte';
	import SortableList from '$lib/ui/components/sortable-list.svelte';
	import Info from '../../info.svelte';

	let { socials = $bindable() }: { socials: Social[] } = $props();

	const toaster = use_toaster();

	const pop = new Pop();

	let name: string = $state('');
	const url_value = dev ? 'https://icon-sets.iconify.design/?query=poop' : '';

	const suggestions = [
		'Courriel',
		'Site web',
		'Linktree',
		'Portfolio',
		'Instagram',
		'LinkedIn',
		'Behance',
		'Dribble',
		'Youtube',
		'GitHub'
	];

	async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form_data = new FormData(event.currentTarget, event.submitter);
		const name = String(form_data.get('name'));
		const url = String(form_data.get('url'));
		if (!name || !url) return toaster.push('error');
		socials.push({ name, url });

		pop.close();
		toaster.push('success', 'Lien ajouté');
	}

	function on_remove_item(item: Social) {
		socials = socials.filter((i) => i != item);
	}
</script>

<Info>
	<div>Optionnel — Tu peux ajouter des liens vers tes ressources externes personnelles.</div>
	<div>Tu pourras les modifier / supprimer dans le futur sur cette page.</div>
	<br />
	<div>Pour l’instant, il est impossible de modifier un lien déjà créé.</div>
	<div>Pour ce faire, supprime-le et crée-le à nouveau.</div>
</Info>
<div class="">
	<div class="bg-surface text-surface-foreground">
		<Label id="liens externes" label="liens externes" />

		<SortableList
			items={socials}
			multiple={socials.length > 1}
			on_reorder={(new_items) => (socials = new_items)}
		>
			{#snippet children(item)}
				<ListItem on_remove={() => on_remove_item(item)}>
					<div class=" leading-5">
						<div>{item.name}</div>
						<div class="text-muted">{item.url}</div>
					</div>
				</ListItem>
			{/snippet}
		</SortableList>
		<div>
			<Button size="lg" class="w-full" onclick={pop.show}>Ajouter un lien</Button>
		</div>
	</div>
</div>
<form class="space-y-2x" {onsubmit}>
	<Dialog {pop} size="md">
		<DialogHeader>
			<DialogTitle>Nouveau lien</DialogTitle>
			<DialogDescription>Vers tes ressources externes personnelles.</DialogDescription>
		</DialogHeader>

		<div class="-mb-3">
			<div class="text-sm text-muted">Suggestions :</div>
			<div class="flex flex-wrap gap-1.5 pt-2x text-sm whitespace-nowrap">
				{#each suggestions as suggestion}
					<button
						type="button"
						class="cursor-pointer rounded-full bg-secondary px-2 py-px"
						onclick={() => (name = suggestion)}
					>
						{suggestion}
					</button>
				{/each}
			</div>
		</div>
		<Input label="nom du lien" name="name" required bind:value={name} autofocus />
		<Input label="url" name="url" required type="url" value={url_value} />
		<div class="flex justify-end gap-1.5">
			<Button variant="ghost" type="reset" onclick={pop.close} size="lg">Annuler</Button>
			<Button variant="action" type="submit" size="lg" formaction="">Ajouter</Button>
		</div>
	</Dialog>
</form>
