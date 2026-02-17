<script module>
	type Variant = 'base' | 'action' | 'danger' | 'ghost' | 'discrete' | 'none';
	type Size = 'sm' | 'md' | 'lg';

	export type ButtonProps = HTMLButtonAttributes & {
		variant?: Variant;
		size?: Size;
		type?: 'button' | 'submit' | 'reset';
		icon?: string;
		href?: string;
		disabled?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Tooltip from './tooltip.svelte';

	const {
		variant = 'base',
		size = 'md',
		type = 'button',
		icon,
		href = '',
		disabled = false,
		tooltip,
		children,
		...props
	}: ButtonProps & {
		tooltip?: string;
	} = $props();

	const bg_variant_cx = {
		base: 'bg-black/10 not-hover:border-foreground/50 hover:bg-black/15 disabled:opacity-50',
		action:
			'bg-black/80 border-black not-hover:border-black/90  hover:bg-black disabled:opacity-50 text-primary-foreground hover:bg-text/80 disabled:bg-text/20',
		danger:
			'border-red-800/50 hover:border-red-800 bg-red-600/50 hover:bg-red-600/60 disabled:opacity-50',
		discrete: 'hover:bg-foreground/10 disabled:opacity-50',
		ghost:
			'border-transparent hover:border-foreground/50 hover:bg-foreground/15 disabled:opacity-50',

		none: 'border-0 disabled:opacity-50'
	};

	const size_cx = {
		sm: 'px-1 min-w-16',
		md: 'px-2 py-0.5 min-w-24',
		lg: 'px-4 py-1.5 min-w-32'
	};
	const icon_size_cx = {
		sm: 'p-0.5 text-sm',
		md: 'p-1 text-lg',
		lg: 'p-1.5 text-2xl'
	};
	const bipolar_props = href ? { href } : { type };
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{...props}
	{disabled}
	{...bipolar_props}
	class={[
		'group/tooltip inline-flex cursor-default items-center justify-center font-medium',
		disabled ? 'pointer-events-none cursor-default' : 'cursor-pointer',
		icon ? icon_size_cx[size] : size_cx[size],

		'border',
		bg_variant_cx[variant],
		props.class
	]}
>
	{#if icon}
		<div class={[icon]}></div>
	{/if}
	{@render children?.()}
	{#if tooltip}
		<Tooltip>
			{tooltip}
		</Tooltip>
	{/if}
</svelte:element>
