<script lang="ts">
	import Button from '$lib/ui/components/button.svelte';
	import type { CanvasManager } from './canvas-manager.svelte';
	import ImageComponent from '$lib/components/media/image.svelte';
	import AudioWaveform from '$lib/ui/components/audio-waveform.svelte';
	import { file_is_audio } from '$lib/utils/files';
	import type { RecordModel } from 'pocketbase';

	const { canvas }: { canvas: CanvasManager } = $props();
	const collection = $derived(canvas.collection);

	const absolute = $derived(canvas.absolute);
</script>

<div class="relative flex flex-col items-center" bind:this={canvas.canvas_ref}>
	{#each canvas.sorted_items as item, i (item.id)}
		{#if item.file}
			{@const is_hov = canvas.hovered_item?.id === item.id}
			{@const is_sel = canvas.selected_item?.id === item.id}
			{@const is_other_sel = canvas.selected_item !== null && !is_sel}

			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="canvas-item-wrapper relative border-2 transition-[border-color] duration-75"
				class:absolute!={absolute}
				class:pointer-events-none={is_other_sel}
				class:cursor-default={!is_sel}
				class:cursor-grab={is_sel && !canvas.dragging_item && !canvas.rotating_item}
				class:cursor-grabbing={!!canvas.dragging_item && is_sel}
				style:border-color={is_sel
					? 'rgb(59 130 246)'
					: is_hov
						? 'rgba(148,163,184,0.5)'
						: 'transparent'}
				style:transform="translate({item.left || 0}%, {item.top || 0}%) rotate({item.rotate ||
					0}deg)"
				style:width="{item.width || 50}%"
				style:margin-top="{item.margin_top || 0}%"
				style:margin-bottom="{item.margin_bottom || 0}%"
				style:z-index={item.z_index + 50 || 0}
				data-id={item.id}
				onpointerdown={(e) => canvas.on_item_pointerdown(e, item)}
				onpointermove={canvas.on_item_pointermove}
				onpointerup={(e) => canvas.on_item_pointerup(e, item)}
				onpointercancel={(e) => canvas.on_item_pointerup(e, item)}
				onmouseenter={() => (canvas.hovered_item = item)}
				onmouseleave={() => (canvas.hovered_item = null)}
				oncontextmenu={(e) => canvas.open_context_menu(e, item)}
			>
				<div style:aspect-ratio={item.aspect_ratio} style:width="100%" class="relative">
					{#if is_sel}
						<!-- Margin top handle -->
						{#if !absolute}
							{@render margin_handle(item, 'top')}
							{@render margin_handle(item, 'bottom')}
						{/if}
						<!-- Inline toolbar -->
						<div
							class="absolute -top-10 left-0 z-50 flex cursor-auto gap-0.5 rounded-md bg-background/95 px-1 py-1 shadow-xl ring-1 ring-white/10 backdrop-blur-sm"
							onpointerdown={(e) => e.stopPropagation()}
						>
							<Button
								onclick={() => canvas.move_layer(item, -1)}
								disabled={i === 0}
								tooltip="Monter"
								icon="icon-[ri--arrow-up-line]"
							/>
							<Button
								tooltip="Descendre"
								icon="icon-[ri--arrow-down-line]"
								onclick={() => canvas.move_layer(item, 1)}
								disabled={i === canvas.sorted_items.length - 1}
							/>
							<div class="bg-surface-300 mx-0.5 w-px self-stretch"></div>
							<Button
								tooltip="Éditer"
								icon="icon-[ri--pencil-fill]"
								onclick={() => canvas.editor.open({ method: 'update', record: item })}
							/>
							<Button
								tooltip="Supprimer"
								icon="icon-[ri--delete-bin-line]"
								onclick={() => canvas.confirm_delete(item.id)}
							/>
						</div>

						<!-- Resize handle (bottom-right) -->
						<button
							class="absolute -right-2 -bottom-2 z-50 size-3.5 cursor-nwse-resize rounded-full bg-blue-500 shadow-md transition-all hover:scale-125 hover:bg-blue-400"
							onpointerdown={(e) => canvas.start_resize(e, item)}
							onpointermove={canvas.on_resize}
							onpointerup={canvas.stop_resize}
							onpointercancel={canvas.stop_resize}
							title="Redimensionner"
						></button>

						{@render corner_tick('-top-0.5 -left-0.5 border-t-2 border-l-2')}
						{@render corner_tick('-top-0.5 -right-0.5 border-t-2 border-r-2')}
						{@render corner_tick('-bottom-0.5 -left-0.5 border-b-2 border-l-2')}
						{@render corner_tick('-bottom-0.5 -right-0.5 border-b-2 border-r-2')}

						{@render rotate_handle(item, '-top-6 -left-6')}
						{@render rotate_handle(item, '-top-6 -right-6')}
						{@render rotate_handle(item, '-bottom-6 -left-6')}
						{@render rotate_handle(item, '-right-6 -bottom-6')}
					{/if}

					{#if file_is_audio(item.file) && item.audio_meta}
						<AudioWaveform meta={item.audio_meta} />
					{:else}
						<ImageComponent
							record_id={item.id}
							filename={item.file}
							collection={collection.name}
							size="600x0"
							class="pointer-events-none transition-opacity duration-100 select-none {is_other_sel
								? 'opacity-40'
								: ''}"
						/>
					{/if}
				</div>
			</div>
		{/if}
	{/each}
</div>
<!-- ── REUSABLE UI SNIPPETS ─────────────────────────────────────────────── -->
{#snippet margin_handle(item: RecordModel, pos: 'top' | 'bottom')}
	<button
		class="absolute left-1/2 z-50 h-4 w-14 -translate-x-1/2 cursor-ns-resize rounded-full bg-blue-500 shadow-md transition-all hover:scale-110 hover:bg-blue-400 active:bg-blue-300 {pos ===
		'top'
			? '-top-3'
			: '-bottom-3'}"
		onpointerdown={(e) =>
			pos === 'top' ? canvas.start_margin_top(e, item) : canvas.start_margin_bottom(e, item)}
		onpointermove={canvas.on_margin}
		onpointerup={canvas.stop_margin}
		onpointercancel={canvas.stop_margin}
		title={pos === 'top' ? 'Marge haute' : 'Marge basse'}
	></button>
{/snippet}

{#snippet corner_tick(classes: string)}
	<span class="pointer-events-none absolute block size-2.5 border-blue-400 {classes}"></span>
{/snippet}

{#snippet rotate_handle(item: RecordModel, classes: string)}
	<button
		class="absolute z-50 flex size-5 cursor-crosshair items-center justify-center rounded-full bg-transparent hover:bg-blue-400/20 {classes}"
		onpointerdown={(e) => canvas.start_rotate(e, item)}
		onpointermove={canvas.on_rotate}
		onpointerup={canvas.stop_rotate}
		onpointercancel={canvas.stop_rotate}
		title="Faire pivoter (Shift = 15°)"
	>
		<span
			class="pointer-events-none block size-2 rounded-full border-2 border-blue-400 bg-white/90 shadow-sm"
		></span>
	</button>
{/snippet}
