<script lang="ts">
	import Button from '../../button.svelte';
	import Anchor from '../../pop/anchor.svelte';
	import Input from './input.svelte';

	let {
		id,
		name,
		value = new Date(),
		label = 'date',
		required
	}: { id: string; name: string; value?: Date; label?: string; required?: boolean } = $props();

	const TEST_POP = false;
	// Internal State
	// REMOVED: showCalendar, containerRef (handled by CSS now)

	// viewDate controls what month the calendar shows
	let viewDate = $state(new Date(value));

	// inputValue tracks the raw text the user types
	let inputValue = $state(value.toLocaleDateString());

	// Constants
	const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

	const months = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre'
	];

	// Derived Calendar Logic
	let month = $derived(viewDate.getMonth());
	let year = $derived(viewDate.getFullYear());
	let daysInMonth = $derived(new Date(year, month + 1, 0).getDate());
	let firstDayOfMonth = $derived(new Date(year, month, 1).getDay());
	let calendarDays = $derived(Array.from({ length: daysInMonth }, (_, i) => i + 1));
	let paddingDays = $derived(Array.from({ length: firstDayOfMonth }));

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	function isToday(day: number) {
		return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
	}

	// --- Handlers ---

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;

		// FIX: Replace hyphens with slashes to force Local Time parsing
		// '2023-10-25' (UTC) becomes '2023/10/25' (Local)
		const normalizedInput = inputValue.replace(/-/g, '/');

		const parsed = Date.parse(normalizedInput);

		if (!isNaN(parsed)) {
			const newDate = new Date(parsed);
			value = newDate;
			viewDate = new Date(newDate);
		}
	}

	function selectDate(day: number) {
		const newDate = new Date(year, month, day);
		value = newDate;
		inputValue = newDate.toLocaleDateString();
		// REMOVED: showCalendar = false;
		// Focus naturally moves or stays; to close explicitly you might need
		// to blur the active element (document.activeElement.blur()),
		// but often keeping it open for verification is fine.
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
	}

	function changeMonth(step: number) {
		viewDate = new Date(year, month + step, 1);
	}

	function isSelected(day: number) {
		return day === value.getDate() && month === value.getMonth() && year === value.getFullYear();
	}
</script>

<div class="group relative">
	<div style="anchor-name: --anchor-{id};">
		<Input
			{id}
			{name}
			value={inputValue}
			oninput={handleInput}
			placeholder="JJ/MM/YYYY"
			{label}
			class="w-full!"
		/>
	</div>

	<div class={['not-group-focus-within:hidden focus:block', TEST_POP && 'block!']}>
		<Anchor anchor="--anchor-{id}" class="my-2" left="left" top="bottom">
			<div class=" cursor-default border bg-surface p-5 font-mono text-xs text-surface-foreground">
				<div class="mb-4 flex items-center justify-between">
					<div>
						<Button
							onclick={() => changeMonth(-1)}
							variant="ghost"
							icon="icon-[ri--arrow-left-s-line]"
							tooltip="Mois précédent"
						/>
					</div>
					<div class="flex">
						{months[month]}
						{year}
					</div>
					<div>
						<Button
							onclick={() => changeMonth(1)}
							variant="ghost"
							icon="icon-[ri--arrow-right-s-line]"
							tooltip="Mois suivant"
						/>
					</div>
				</div>

				<div class="grid grid-cols-7 gap-1.5">
					{#each daysOfWeek as day}
						<div class="py-1 text-center text-[0.75rem] text-muted uppercase">{day[0]}</div>
					{/each}
					<div class="col-span-full border-b"></div>

					{#each paddingDays as _}
						<div></div>
					{/each}

					{#each calendarDays as day}
						<button
							type="button"
							onclick={() => selectDate(day)}
							class={[
								'flex size-7 cursor-pointer items-center justify-center',
								isSelected(day)
									? 'bg-active ring-2'
									: 'text-white/40-  hover:text-white/70- hover:bg-hover',
								isToday(day) && 'rounded-full bg-active'
							]}
						>
							{day}
						</button>
					{/each}
				</div>
			</div>
		</Anchor>
	</div>
</div>
