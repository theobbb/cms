<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
	import Button from '$lib/ui/button.svelte';
	import type { RecordModel } from 'pocketbase';
	import Guide from './guide.svelte';

	const { data } = $props();

	const { draft_map } = $derived(data);

	$inspect(draft_map);
</script>

<Guide />

<Button href="/public/{page.params.year}/projets/draft">Nouveau projet</Button>
<div class="relative">
	<div class="bg-background sticky top-0 flex items-center justify-between border-b py-3">
		<div class="text-xl">Finissant-e-s {page.params.year}</div>

		<div>
			<span class="text-muted mr-1">Pas encore dans la liste?</span>

			<a class="text-indigo-600" href="/public/{page.params.year}/finissant-e-s/draft">
				Inscription →
			</a>
		</div>
	</div>

	<div class="mt-8">
		{#each data.students as student}
			<div class="flex items-center justify-between">
				<a href="/public/{page.params.year}/finissant-e-s/draft?id={student.id}">
					{student.last_name},
					{student.first_name}
				</a>
				{#if draft_map[student.id]}
					<Box color="green">
						<div class="px-2 py-0.5 text-sm">En attente d'approbation</div>
					</Box>
				{/if}
			</div>
		{/each}
	</div>
</div>
