<script lang="ts">
	import Button from '../button.svelte';
	import Input from './input.svelte';

	let {
		id,
		name,
		value = new Date(),
		label = 'date',
		required
	}: { id: string; name: string; value?: Date; label?: string; required?: boolean } = $props();

	$inspect(value);
	// Internal State
	let showCalendar = $state(false);
	let containerRef = $state<HTMLDivElement | null>(null);

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

		const parsed = Date.parse(inputValue);
		if (!isNaN(parsed)) {
			const newDate = new Date(parsed);
			value = newDate;
			viewDate = new Date(newDate); // Sync calendar view to typed date
		}
	}

	function selectDate(day: number) {
		const newDate = new Date(year, month, day);
		value = newDate;
		inputValue = newDate.toLocaleDateString();
		showCalendar = false;
	}

	function changeMonth(step: number) {
		viewDate = new Date(year, month + step, 1);
	}

	function isSelected(day: number) {
		return day === value.getDate() && month === value.getMonth() && year === value.getFullYear();
	}

	function handleOutsideClick(event: MouseEvent) {
		if (showCalendar && containerRef && !containerRef.contains(event.target as Node)) {
			showCalendar = false;
			// Re-sync input text to the last valid date on blur
			inputValue = value.toLocaleDateString();
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<div bind:this={containerRef} class="relative inline-block">
	<Input
		{id}
		{name}
		value={inputValue}
		oninput={handleInput}
		onfocus={() => (showCalendar = true)}
		placeholder="JJ/MM/YYYY"
		{label}
	/>

	{#if showCalendar}
		<div class="bg-background-2 absolute z-50 mt-2 w-68 border p-4">
			<div class="mb-4 flex justify-between">
				<div>
					<Button onclick={() => changeMonth(-1)} icon="icon-[ri--arrow-left-s-line]" />
				</div>
				<div class="flex">
					{months[month]}
					{year}
				</div>
				<div>
					<Button onclick={() => changeMonth(1)} icon="icon-[ri--arrow-right-s-line]"></Button>
				</div>
			</div>

			<div class="grid grid-cols-7 gap-1">
				{#each daysOfWeek as day}
					<div class="text-white/60- py-1 text-center text-sm uppercase">{day[0]}</div>
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
							'flex w-full items-center justify-center text-base/8 ',
							isSelected(day)
								? ' text-white- ring-white/50- ring-2'
								: 'text-white/40-  hover:bg-white/10- hover:text-white/70-',
							isToday(day) && 'text-active'
						]}
					>
						{day}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
