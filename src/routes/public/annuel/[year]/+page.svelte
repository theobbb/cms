<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="text-center">
	<div class="mb-1 text-3xl">Bienvenue !</div>
	<div>
		dans le système de gestion de contenu <br /> de l’Annuel de design {page.params.year}.
	</div>
</div>

<div class="mt-24 text-muted">
	<div>TODO :</div>
	<div>Explication du fonctionnement brouillon → validation</div>
	<div>Mise en garde accès public</div>
</div>
<!-- <Info>Cet espace est destiné aux finissant-es de l’école de design de l’UQAM.</Info>

<div class="flex items-center gap-1.5">
	<div class="icon-[ri--information-line]"></div>
	Fonctionnement du système
</div>
<div class="grid grid-cols-5 gap-4 text-balance">
	<div class="col-span-2">
		<div class="mb-1">Brouillon</div>
		<div class="text-sm/4.5 text-muted">
			Éditez votre profil & vos projets. <br /> Vos modifications sont sauvegardées en tant que brouillon
			public.
		</div>
	</div>
	<div class="flex justify-center">
		<div class="mt-1 icon-[ri--arrow-right-long-line]"></div>
	</div>
	<div class="col-span-2">
		<div class="mb-1">Validation</div>
		<div class="text-sm/4.5 text-muted">
			Le comité web de <span class="whitespace-nowrap">l'Annuel {page.params.year}</span> révisera le
			brouillon soumis avant de le publier.
		</div>
	</div>
</div> -->
