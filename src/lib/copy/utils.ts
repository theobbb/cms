// src/lib/copy/interpolate.ts
export function txt(str: string, params: Record<string, string>) {
	return Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, v), str);
}
