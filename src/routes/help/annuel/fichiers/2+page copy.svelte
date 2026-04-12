<script lang="ts">
	import Info from '$lib/ui/templates/flags/info.svelte';

	const examples = [
		{ label: 'Centré (Par défaut)', value: [2, 2] },
		{ label: 'Pleine largeur (Immersif)', value: [1, 4] },
		{ label: 'Petit & Aligné à gauche', value: [1, 1] },
		{ label: 'Large & Aligné à droite', value: [2, 3] }
	];
</script>

<header class="mb-12 border-b pb-2">
	<h1 class="text-3xl tracking-tight">Guide : Grille de mise en page</h1>
</header>

<main class="space-y-16">
	<section>
		<p class="mb-6">Tes fichiers sont présentés dans une grille de 4 colonnes :</p>

		<div class="mb-4 grid grid-cols-4 gap-3">
			{#each { length: 4 } as col, i}
				<div class="border-2 p-4 text-center text-sm">
					Col {i + 1}
				</div>
			{/each}
		</div>

		<Info>
			Réglage par défaut : Start 2 / Span 2. <br />L'image ignore la colonne 1 et 4 pour rester au
			centre.
		</Info>
	</section>

	<section>
		<h2 class="mb-6 border-b pb-2 text-2xl">Examples</h2>

		<div class="space-y-8">
			{#each examples as { label, value }}
				<p class="mb-2">{label}</p>
				<div class="grid grid-cols-4 gap-2 border-2 p-2">
					<div
						class="bg-accent p-2 py-8 text-center text-white"
						style="grid-column: {value[0]} / span {value[1]};"
					>
						<div class="block text-sm">
							<span class="whitespace-nowrap">Start: {value[0]}</span> |
							<span class="whitespace-nowrap"> Span: {value[1]}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</main>
