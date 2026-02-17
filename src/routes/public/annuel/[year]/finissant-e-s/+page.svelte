<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/button.svelte';

	const { data } = $props();
</script>

<div>Info</div>
<Button>S'enregistrer</Button>

<div>
	{#each data.students as student}
		<div>
			<a href="/public/{page.params.year}/finissant-e-s/{student.id}">
				{student.last_name},
				{student.first_name}
			</a>
		</div>
	{/each}
</div>
