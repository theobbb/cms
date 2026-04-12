<script lang="ts">
	import Info from '$lib/ui/templates/flags/info.svelte';

	// J'ai renommé les variables pour que ce soit plus clair dans le code,
	// mais on ne les affiche plus littéralement à l'utilisateur.
	const examples = [
		{
			label: 'Centré (Par défaut)',
			start: 2,
			span: 2,
			desc: "L'équilibre parfait pour la majorité des images. Laisse respirer la mise en page."
		},
		{
			label: 'Pleine largeur (Immersif)',
			start: 1,
			span: 4,
			desc: "Idéal pour une pièce maîtresse, une vidéo ou un grand plan d'ensemble."
		},
		{
			label: 'Format détail (Aligné à gauche)',
			start: 1,
			span: 1,
			desc: 'Parfait pour les maquettes mobiles, les croquis ou les itérations de logos.'
		},
		{
			label: 'Asymétrique (Aligné à droite)',
			start: 2,
			span: 3,
			desc: 'Crée un dynamisme visuel pour briser la monotonie du défilement.'
		}
	];
</script>

<header class="mb-12 border-b pb-2">
	<h1 class="text-3xl tracking-tight">Guide : Mise en page des projets</h1>
</header>

<main class="space-y-16">
	<section class="space-y-6">
		<h2 class="text-2xl">Pourquoi personnaliser sa mise en page ?</h2>
		<p class="text-surface-700">
			Tous tes fichiers n'ont pas la même importance, ni le même format. Notre système de grille
			t'offre une flexibilité éditoriale pour raconter l'histoire de ton projet de la meilleure
			façon possible :
		</p>
		<ul class="text-surface-700 list-disc space-y-2 pl-5">
			<li>
				<strong>Hiérarchie :</strong> Mets tes pièces maîtresses en grand et regroupe tes recherches en
				plus petit.
			</li>
			<li>
				<strong>Rythme :</strong> Alterne les tailles et les alignements pour créer une composition dynamique
				et surprendre le visiteur.
			</li>
			<li>
				<strong>Proportions :</strong> Évite qu'une capture d'écran de téléphone prenne tout l'écran en
				réduisant sa largeur.
			</li>
		</ul>
	</section>

	<section class="space-y-6">
		<h2 class="text-2xl">Comment ça marche ?</h2>
		<p class="text-surface-700 mb-6">
			La page de ton projet est divisée en <strong>4 colonnes invisibles</strong>. Au survol de tes
			images dans l'éditeur, utilise les contrôles semi-transparents pour ajuster chaque bloc :
		</p>

		<div class="mb-6 grid grid-cols-2 gap-8">
			<div class="bg-surface-50 rounded-md border p-4">
				<div class="mb-2 flex items-center gap-4">
					<div class="flex gap-1 rounded bg-black p-1 text-white">
						<span class="icon-[ri--arrow-left-line]"></span>
						<span class="icon-[ri--arrow-right-line]"></span>
					</div>
					<strong class="text-lg">Les Flèches</strong>
				</div>
				<p class="text-surface-600 text-sm">
					Déplacent ton image vers la gauche ou vers la droite sur la grille.
				</p>
			</div>

			<div class="bg-surface-50 rounded-md border p-4">
				<div class="mb-2 flex items-center gap-4">
					<div class="flex gap-1 rounded bg-black p-1 text-white">
						<span class="icon-[ri--subtract-line]"></span>
						<span class="icon-[ri--add-line]"></span>
					</div>
					<strong class="text-lg">Moins / Plus</strong>
				</div>
				<p class="text-surface-600 text-sm">
					Réduisent ou augmentent la largeur de ton image (de 1 à 4 colonnes max).
				</p>
			</div>
		</div>

		<Info>
			<div>
				<strong>L'ordre d'affichage (haut en bas)</strong> se gère simplement en glissant-déposant tes
				fichiers dans la liste d'upload juste au-dessus !
			</div>
		</Info>
	</section>

	<section>
		<h2 class="mb-8 border-b pb-2 text-2xl">Exemples d'utilisation</h2>

		<div class="space-y-12">
			{#each examples as { label, start, span, desc }}
				<div>
					<h3 class="mb-1 text-lg font-medium">{label}</h3>
					<p class="text-surface-600 mb-4 text-sm">{desc}</p>

					<div
						class="border-surface-200 bg-surface-50/50 relative grid grid-cols-4 gap-4 rounded-lg border p-4"
					>
						<div
							class="flex min-h-[120px] items-center justify-center rounded-md bg-accent text-white shadow-sm transition-all duration-300"
							style="grid-column: {start} / span {span};"
						>
							<span class="text-sm font-medium">{span} {span > 1 ? 'colonnes' : 'colonne'}</span>
						</div>

						<div class="pointer-events-none absolute inset-0 grid grid-cols-4 gap-4 p-4">
							{#each { length: 4 } as _, i}
								<div class="border-surface-200/50 h-full border-x border-dashed"></div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</main>
