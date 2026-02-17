class Pop {
	elements: Record<string, HTMLElement> = $state({});
}

export function use_pop(): Pop {
	const pop = new Pop();

	return pop;
}
