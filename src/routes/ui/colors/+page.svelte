<script lang="ts">
	const colors = [
		'background',
		'surface',
		'',
		'primary',
		'secondary',
		'',
		'accent',
		'',
		'blue',
		'green',
		'yellow',
		'red',
		'',
		'blue-surface',
		'green-surface',
		'yellow-surface',
		'red-surface'
	];

	const rows = colors
		.join('|')
		.split('||')
		.map((group) => group.split('|'));
</script>

<div class="mr-8 space-y-16">
	{#each rows as row}
		<div class="grid grid-cols-5 gap-8">
			{#each row as color}
				<div class="">
					<div
						class="border px-2 py-1"
						style="background-color: var(--color-{color}); color: var(--color-{color}-foreground); border-color: var(--color-{color}-foreground);"
					>
						<div>
							<div>{color}</div>
							<div>The quick brown fox jumps over the lazy dog.</div>
							<div style="color: var(--color-{color}-foreground-muted);">
								The quick brown fox jumps over the lazy dog.
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
