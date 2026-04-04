<script lang="ts">
	import { page } from '$app/state';
	import Box from '$lib/components/box.svelte';
</script>

<Box color="blue" class="space-y-3 p-5 pt-3.5">
	<div class="flex items-center gap-1.5 border-b pb-3">
		<div class="icon-[ri--information-line]"></div>
		Fonctionnement du système
	</div>
	<div class="grid grid-cols-5 gap-4 text-balance">
		<div class="col-span-2">
			<div class="mb-1">Brouillon</div>
			<div class="text-muted text-xs leading-tight">
				Éditez votre profil & vos projets. <br /> Vos modifications sont sauvegardées en tant que brouillon
				public.
			</div>
		</div>
		<div class="flex justify-center">
			<div class="mt-1 icon-[ri--arrow-right-long-line]"></div>
		</div>
		<div class="col-span-2">
			<div class="mb-1">Validation</div>
			<div class="text-muted text-xs leading-tight">
				Le comité web de <span class="whitespace-nowrap">l'Annuel {page.params.year}</span> révisera le
				brouillon soumis avant de le publier.
			</div>
		</div>
	</div>
</Box>
