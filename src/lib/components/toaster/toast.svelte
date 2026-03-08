<script module>
	import Button from '$lib/ui/components/button.svelte';
	import { icons } from '$lib/ui/icons';
	import type { Toast, ToastType } from './toaster-context.svelte';

	export const toast_style: Record<ToastType, { cx?: string; icon: string }> = {
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

<script lang="ts">
	const { toast, onclose }: { toast: Toast; onclose?: () => void } = $props();
</script>

<div class=" bg-bg/50 backdrop-blur-md">
	<div
		class={[
			'flex items-center justify-between gap-1.5 border px-2 py-1.5 pr-2',
			toast_style[toast.type].cx
		]}
	>
		<div class={['border-r pr-2 text-lg', toast_style[toast.type].icon]}></div>
		<div class="w-full">
			{toast.title}
		</div>

		<Button icon={icons.close} variant="ghost" onclick={() => onclose?.()} />
	</div>
</div>
