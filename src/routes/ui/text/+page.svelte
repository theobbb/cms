<script lang="ts">
	const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
</script>

<div class="mr-8 grid grid-cols-5 gap-y-4">
	{#each sizes as size}
		<div>
			{size}
		</div>
		<div class="col-span-4">
			<div style="font-size: var(--text-{size}); line-height: var(--text-{size}--line-height);">
				The quick brown fox jumps over the lazy dog.
			</div>
		</div>
	{/each}
	<div class="col-span-full mt-16"></div>
	{#each sizes as size, i}
		{#if i < 5}
			<div>
				{size}
			</div>
			<div class="col-span-4 text-balance">
				<div style="font-size: var(--text-{size}); line-height: var(--text-{size}--line-height);">
					<div style="max-width: {i * 5 + 20}rem; margin-bottom: 2em;">
						Value among into eat marriage scene. Foot century few then only stage operation. Late
						would better miss reduce. Method me office company term growth rock. Peace end
						individual speak walk partner walk. Teach medical everybody her require. Set join poor
						sing who. Western doctor sometimes fire. Firm couple table though hot. Police type
						president get.
					</div>
				</div>
			</div>
		{/if}
	{/each}
</div>
