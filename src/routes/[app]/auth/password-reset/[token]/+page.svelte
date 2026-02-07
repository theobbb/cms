<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/form/input.svelte';
</script>

<div class="-ml-nav">
	<div class="mx-auto my-24 flex max-w-2xs flex-col items-center gap-4">
		<div class="w-full text-left">Choisis ton mot de passe wesh</div>
		<form method="POST" action="?/reset" class="w-full space-y-3">
			<div>
				<Input
					value={page.url.searchParams.get('email')}
					class="w-full"
					name="email"
					type="email"
					label="Email"
				/>
			</div>
			<div>
				<Input id="password" class="w-full" name="password" type="password" label="Password" />
			</div>
			<div><Button size="lg" class="w-full" type="submit">Continuer</Button></div>
		</form>
	</div>
</div>
