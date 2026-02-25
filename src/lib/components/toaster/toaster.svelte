<script lang="ts">
	import { icons } from '$lib/ui/icons';
	import Button from '$lib/ui/button.svelte';
	import { use_toaster, type ToastType } from '$lib/components/toaster/toaster-context.svelte';

	const toaster = use_toaster();

	const toast_style: Record<ToastType, { cx?: string; icon: string }> = {
		loading: {
			cx: 'bg-secondary text-secondary-foreground',
			icon: icons.spinner
		},
		info: {
			cx: 'bg-blue-surface text-blue-surface-foreground',
			icon: icons.info
		},
		success: {
			cx: 'bg-green-surface text-green-surface-foreground',
			icon: icons.success
		},
		warning: {
			cx: 'bg-yellow-surface text-yellow-surface-foreground',
			icon: icons.warning
		},
		error: {
			cx: 'bg-red-surface text-red-surface-foreground',
			icon: icons.error
		}
	};
</script>

<div class={['pointer-events-none fixed bottom-0 left-0 z-1000 flex items-center justify-center']}>
	<div class="m-gap min-w-xs text-sm font-medium">
		<div class="pointer-events-auto space-y-1.5 overflow-auto">
			{#each toaster.toasts as { type, title, body, id }, i (id + type)}
				<div class=" bg-bg/50 backdrop-blur-md">
					<div
						class={[
							'flex items-center justify-between gap-1.5 border px-2 py-1.5 pr-2',
							toast_style[type].cx
						]}
					>
						<div class={['border-r pr-2 text-lg', toast_style[type].icon]}></div>
						<div class="w-full">
							{title}
						</div>

						<Button icon={icons.close} variant="ghost" onclick={() => toaster.delete(id)} />
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
