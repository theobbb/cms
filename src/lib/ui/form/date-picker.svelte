<script lang="ts">
	import { floating } from '$lib/utils/floating';
	import Button from '../button.svelte';
	import Floating from '../pop/floating.svelte';
	import { use_pop } from '../pop/pop-test.svelte';
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

<div class="group relative flex w-full">
	<div class="flex w-full" style="anchor-name: --main-anchor;">
		<Input {id} {name} value={inputValue} oninput={handleInput} placeholder="JJ/MM/YYYY" {label} />
	</div>

	<div
		class={['fixed z-50 m-2 hidden group-focus-within:block focus:block', TEST_POP && 'block!']}
		style="position-anchor: --main-anchor; top: anchor(bottom); left: anchor(left); position-try-fallbacks: flip-block;"
	>
		<div class="w-64- border bg-surface p-3 text-sm text-surface-foreground">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<Button
						onclick={() => changeMonth(-1)}
						variant="ghost"
						icon="icon-[ri--arrow-left-s-line]"
					/>
				</div>
				<div class="flex text-sm">
					{months[month]}
					{year}
				</div>
				<div>
					<Button
						onclick={() => changeMonth(1)}
						variant="ghost"
						icon="icon-[ri--arrow-right-s-line]"
					></Button>
				</div>
			</div>

			<div class="grid grid-cols-7 gap-1">
				{#each daysOfWeek as day}
					<div class="py-1 text-center text-xs uppercase">{day[0]}</div>
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
							'w-full- flex size-7 items-center justify-center  ',
							isSelected(day)
								? ' text-white- bg-active ring-2 '
								: 'text-white/40-  hover:text-white/70- hover:bg-active-hover',
							isToday(day) && 'ring-2'
						]}
					>
						{day}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
