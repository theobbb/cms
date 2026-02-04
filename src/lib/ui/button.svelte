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

	const variant_cx = {
		none: 'border-0',
		discrete: 'hover:bg-text/10',
		ghost: 'hover:bg-text/15',
		base: 'bg-text/10 hover:bg-text/15',
		action: 'bg-text text-bg hover:bg-text/80 disabled:bg-text/20 disabled:text-text/40',
		danger: 'bg-red-600/50 hover:bg-red-600/70'
	};

	const size_cx = {
		sm: '',
		md: 'px-2 py-0.5 min-w-24',
		lg: 'px-4 py-1.5 min-w-32'
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
		disabled && 'pointer-events-none cursor-default',
		icon ? 'p-1.5 text-lg' : size_cx[size],
		icon,
		variant != 'ghost' && 'border',
		variant_cx[variant],
		props.class,
		'transition- duration-100'
	]}
>
	{@render children?.()}
	{#if tooltip}
		<Tooltip>
			{tooltip}
		</Tooltip>
	{/if}
</svelte:element>
