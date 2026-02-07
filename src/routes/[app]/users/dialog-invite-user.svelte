<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
	import Dialog from '$lib/ui/pop/dialog.svelte';

	const { onclose } = $props();

	let emails: { value: string }[] = $state([{ value: '' }]);
</script>

<Dialog {onclose}>
	<div><div>Invite user</div></div>

	<div>
		<div>
			<div>
				{#each emails as email}
					<Input name="email" type="email" required bind:value={email.value} />
				{/each}
			</div>
			<Button onclick={() => emails.push({ value: '' })}>+ Ajouter une invitation</Button>
		</div>
		<Button variant="action">Ajouter users</Button>
	</div>
</Dialog>
