<script lang="ts">
	import { page } from '$app/state';

	let name_or_email = $state('theo');
	let mode: 'login' | 'register' = $state('register');
	let loading = $state(false);
	let error = $state('');

	// Check if browser supports native JSON methods
	let has_native_support = $state(true);
	$effect(() => {
		has_native_support = !!globalThis.PublicKeyCredential?.parseCreationOptionsFromJSON;
	});

	async function handleRegister() {
		if (!has_native_support) {
			error = 'Your browser does not support passkeys';
			return;
		}

		loading = true;
		error = '';

		try {
			// Get registration options from server (already in JSON format)
			const res = await fetch(`/${page.params.app}/auth/api/registration/request`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name_or_email })
			});

			if (!res.ok) throw new Error('User not found');
			const { options, userId } = await res.json();

			// Native browser parsing - no library needed!
			const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(options);

			// Create credential
			const credential = await navigator.credentials.create({ publicKey });

			if (!credential) throw new Error('Failed to create credential');

			// Native JSON serialization - no library needed!
			const credentialJSON = credential.toJSON();

			// Send to server
			const verifyRes = await fetch(`/${page.params.app}/auth/api/registration/verify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id: userId,
					credential: credentialJSON
				})
			});

			if (!verifyRes.ok) throw new Error('Registration failed');

			alert('Passkey registered! You can now log in.');
			mode = 'login';
		} catch (err: any) {
			error = err.message || 'Registration failed';
		} finally {
			loading = false;
		}
	}
</script>

{#if !has_native_support}
	<p class="error">Your browser doesn't support passkeys. Please use a modern browser.</p>
{:else}
	<div class="auth-container">
		<h2>{mode === 'login' ? 'Sign In' : 'Register Passkey'}</h2>

		<input
			type="text"
			placeholder="Username or email"
			bind:value={name_or_email}
			disabled={loading}
		/>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<button onclick={handleRegister} disabled={loading || !name_or_email}>
			{loading ? 'Registering...' : 'Register passkey'}
		</button>
		<button onclick={() => (mode = 'login')} disabled={loading}> Back to login </button>
	</div>
{/if}
