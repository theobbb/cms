<script module>
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { use_cvx } from '$lib/utils/tailwind';
	import Tooltip from './pop/tooltip.svelte';

	export type ButtonVariant = 'default' | 'action' | 'danger' | 'ghost' | 'discrete' | 'none';
	type Size = 'sm' | 'md' | 'lg';

	type BaseProps = {
		variant?: ButtonVariant;
		size?: Size;
		icon?: string;
		tooltip?: string;
		loading?: boolean;
		disabled?: boolean;
		children?: Snippet;
	};

	type ButtonProps = BaseProps & HTMLButtonAttributes & { href?: never };
	type LinkProps = BaseProps & HTMLAnchorAttributes & { href: string };

	export type Props = ButtonProps | LinkProps;

	const cvx = use_cvx(
		'peer inline-flex cursor-pointer items-center justify-center border transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-50 loading:cursor-wait loading:opacity-50',
		{
			variant: {
				default: 'bg-secondary hover:not-disabled:bg-foreground/15',
				action:
					'text-primary-foreground disabled:bg-text/20 bg-primary border-black not-hover:border-black/90 hover:not-disabled:bg-black dark:hover:not-disabled:bg-white',
				danger:
					'bg-red-surface/80 text-red-surface-foreground border-red-surface hover:not-disabled:border-red-800 hover:not-disabled:bg-red-600/60',
				discrete: 'hover:not-disabled:bg-foreground/10',
				ghost: 'hover:not-disabled:bg-foreground/15 not-hover:border-transparent',
				none: 'border-0'
			},
			size: {
				sm: 'min-w-16 gap-1 px-1.5 text-sm',
				md: 'min-w-24 gap-1.5 px-2 py-0.5 text-sm tracking-wide',
				lg: 'min-w-32 gap-2 px-4 py-1.5',
				icon_sm: 'p-0.5 text-sm',
				icon_md: 'p-1 text-base',
				icon_lg: 'p-1.5 text-lg'
			}
		}
	);
</script>

<script lang="ts">
	const {
		variant = 'default',
		size = 'md',
		type = 'button' as 'button' | 'submit' | 'reset',
		icon,
		disabled = false,
		loading = false,
		tooltip,
		children,
		...props
	}: Props = $props();

	const props_id = $props.id();

	const cx = $derived([
		cvx({ variant, size: icon && !children ? `icon_${size}` : size }),
		props.class
	]);

	const style = $derived(
		[props.style, tooltip ? `anchor-name: --anchor-${props_id};` : '']
			.filter((s) => Boolean(s))
			.join(' ')
	);

	const shared_props = $derived({ class: cx, style });
</script>

{#if props.href}
	<a
		{...props as HTMLAnchorAttributes}
		{...shared_props}
		href={props.href}
		aria-disabled={disabled}
		tabindex={disabled ? -1 : undefined}
		onclick={disabled ? (e) => e.preventDefault() : props.onclick}
		rel={props.target === '_blank' ? (props.rel ?? 'noopener noreferrer') : props.rel}
	>
		{@render content()}
	</a>
{:else}
	<button
		{...props as HTMLButtonAttributes}
		{...shared_props}
		type={type as 'button' | 'submit' | 'reset'}
		{disabled}
		aria-busy={loading}
	>
		{@render content()}
	</button>
{/if}
{#if tooltip}
	<Tooltip anchor="--anchor-{props_id}" left="center" bottom="top" class="my-1.5 -translate-x-1/2">
		{tooltip}
	</Tooltip>
{/if}

{#snippet content()}
	{#if icon}
		<span aria-hidden="true" class={icon}></span>
	{/if}
	{@render children?.()}
{/snippet}
