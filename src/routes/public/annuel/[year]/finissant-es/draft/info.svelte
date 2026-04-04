<script lang="ts">
	const steps = [
		[
			`Modifie tes infos`,
			`Ajoute ou modifie votre description et vos liens sociaux. Vos changements sont sauvegardés comme brouillon.`
		]
	];
</script>

<div class="my-8 bg-black/5 px-4 py-3">
	<div>
		<h2 class="mb-4 flex items-center gap-2 text-lg">
			<div class="icon-[ri--information-line]"></div>
			Fonctionnement
		</h2>

		<div class="space-y-4 text-sm text-gray-700">
			<div class="flex gap-3">
				<div
					class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
				>
					1
				</div>
				<div>
					<p class="font-medium text-gray-900">Modifiez votre profil</p>
					<p class="mt-1">
						Ajoutez ou modifiez votre description et vos liens sociaux. Vos changements sont
						sauvegardés comme brouillon.
					</p>
				</div>
			</div>

			<div class="flex gap-3">
				<div
					class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
				>
					2
				</div>
				<div>
					<p class="font-medium text-gray-900">Publiez votre brouillon</p>
					<p class="mt-1">
						Cliquez sur « Publier » pour soumettre vos modifications. Elles seront en attente de
						validation.
					</p>
				</div>
			</div>

			<div class="flex gap-3">
				<div
					class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
				>
					3
				</div>
				<div>
					<p class="font-medium text-gray-900">Validation</p>
					<p class="mt-1">
						Un administrateur examinera et approuvera vos changements avant qu'ils n'apparaissent
						publiquement.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
