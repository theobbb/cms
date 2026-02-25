<script module>
	type Variant = 'default' | 'action' | 'danger' | 'ghost' | 'discrete' | 'none';
	type Size = 'sm' | 'md' | 'lg';

	const cvx = use_cvx(
		'group/tooltip inline-flex cursor-pointer items-center justify-center border font-medium transition-colors disabled:cursor-not-allowed loading:cursor-wait loading:opacity-50',
		{
			variant: {
				default:
					'border-foreground/50 bg-black/10 hover:not-disabled:border-black hover:not-disabled:bg-black/15 disabled:opacity-40',
				action:
					'hover:bg-text/80 disabled:bg-text/20 text-background border-black bg-black/80 not-hover:border-black/90 hover:bg-black disabled:opacity-50',
				danger:
					'border-red-800/50 bg-red-600/50 hover:border-red-800 hover:bg-red-600/60 disabled:opacity-50',
				discrete: 'hover:bg-foreground/10 disabled:opacity-50',
				ghost:
					'hover:border-foreground/50 hover:bg-foreground/15 border-transparent disabled:opacity-50',

				none: 'border-0 disabled:opacity-50'
			},
			size: {
				sm: 'min-w-16 px-1.5 text-sm',
				md: 'min-w-24 px-2 py-0.5 text-[0.9rem]',
				lg: 'min-w-32 px-4 py-1.5 text-[0.95rem]',
				icon_sm: 'p-0.5 text-sm',
				icon_md: 'p-1 text-base',
				icon_lg: 'p-1.5 text-lg'
			}
		}
	);

	export type BaseProps = HTMLButtonAttributes & {
		variant?: Variant;
		size?: Size;
		icon?: string;
		tooltip?: string;
		loading?: boolean;
		children?: Snippet;
	};
	type ButtonProps = BaseProps & HTMLButtonAttributes & { href?: never };
	type LinkProps = BaseProps & HTMLAnchorAttributes & { href: string };

	export type Props = ButtonProps | LinkProps;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import Tooltip from './tooltip.svelte';
	import { use_cvx } from '$lib/utils/tailwind';

	const {
		variant = 'default',
		size = 'md',
		type = 'button',
		icon,
		href,
		disabled = false,
		loading = false,
		tooltip,
		children,
		...props
	}: Props = $props();

	const bipolar_props = $derived(href ? { href, 'aria-disabled':  } : { type });
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	role={href ? 'link' : undefined}
	aria-busy={loading}
	{...props}
	{disabled}
	{...bipolar_props}
	class={[cvx({ variant, size: icon ? 'icon_' + size : size }), props.class]}
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

{#if href}
	<a
		{href}
		aria-disabled={disabled}
		rel={href && props.target === '_blank' ? (props.rel ?? 'noopener noreferrer') : props.rel}
	>
		{@render content()}
	</a>
{:else}{/if}

{#snippet content()}
	{@render children?.()}
	{#if tooltip}
		<Tooltip>
			{tooltip}
		</Tooltip>
	{/if}
{/snippet}

<!-- {#if href}
	<a
		{...props}
		class={[cvx({ variant, size }), props.class]}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
	>
		{@render children?.()}
	</a>
{:else}
	<button {...props} class={[cvx({ variant, size }), props.class]} {type} {disabled}>
		{#if icon}
			<div class={[icon]}></div>
		{/if}
		{@render children?.()}
		{#if tooltip}
			<Tooltip>
				{tooltip}
			</Tooltip>
		{/if}
	</button>
{/if} -->
