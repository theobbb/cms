// utils.ts

// 1. A tiny utility to join strings and filter out falsy values (null, undefined, false)
const cx = (...args: unknown[]) => args.flat().filter(Boolean).join(' ');

// 2. Type definition for the variants object
type Variants = Record<string, Record<string, string>>;

export function use_cvx<V extends Variants>(base: string, variants: V) {
	// Returns a function that accepts:
	// - A prop for each variant key (e.g., intent?: 'primary' | 'secondary')
	// - An optional `class` prop for overrides
	return (props: { [K in keyof V]?: keyof V[K] | boolean } & { class?: string } = {} as any) => {
		// Iterate over the keys in your config (e.g., 'intent', 'size')
		const variantClasses = Object.keys(variants).map((key) => {
			// Get the value passed in props (e.g., 'primary')
			const selection = props[key as keyof V];

			// If a selection was made, look up the class string.
			// String(selection) ensures boolean `true` maps to a "true" key if needed.
			return selection ? variants[key][String(selection)] : null;
		});

		// Merge: Base + Selected Variants + Custom Class
		return cx(base, variantClasses, props.class);
	};
}
