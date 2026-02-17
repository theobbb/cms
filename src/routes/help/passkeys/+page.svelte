<script>
	const appName = 'annuel';
	const currentDomain = '';
</script>

<div class="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-12 text-center">
			<div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/70">
				<div class="icon-[ri--key-line] text-3xl text-white"></div>
			</div>
			<h1 class="mb-2 text-4xl font-bold text-gray-900">Passkey Authentication</h1>
			<p class="text-xl text-gray-600">Secure alternative to passwords</p>
		</div>

		<!-- What are Passkeys? -->
		<div class="rounded-xl- shadow-lg- mb-6 bg-white p-8">
			<h2 class="mb-4 text-2xl font-bold text-gray-900">What are Passkeys?</h2>
			<p class="mb-4 text-gray-700">
				Passkeys are a modern, secure way to sign in without passwords. They use your device's
				built-in security (fingerprint, face recognition, or PIN) to verify it's really you.
			</p>
			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<div class="flex flex-col items-center rounded-lg bg-green-50 p-4 text-center">
					<div class="mb-2 icon-[ri--shield-check-line] text-4xl text-green-600"></div>

					<h3 class="mb-1 font-semibold text-gray-900">More Secure</h3>
					<p class="text-sm text-gray-600">Phishing-resistant and unique per site</p>
				</div>
				<div class="flex flex-col items-center rounded-lg bg-blue-50 p-4 text-center">
					<svg
						class="mb-2 h-12 w-12 text-blue-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					<h3 class="mb-1 font-semibold text-gray-900">Faster Login</h3>
					<p class="text-sm text-gray-600">No passwords to remember or type</p>
				</div>
				<div class="flex flex-col items-center rounded-lg bg-purple-50 p-4 text-center">
					<svg
						class="mb-2 h-12 w-12 text-purple-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
					<h3 class="mb-1 font-semibold text-gray-900">Device-Based</h3>
					<p class="text-sm text-gray-600">Uses your phone or computer's security</p>
				</div>
			</div>
		</div>

		<!-- How to Invite Users -->
		<div class="mb-6 rounded-xl bg-white p-8 shadow-lg">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white"
				>
					1
				</div>
				<h2 class="text-2xl font-bold text-gray-900">How to Invite Users</h2>
			</div>

			<div class="space-y-6">
				<div class="flex">
					<div
						class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600"
					>
						a
					</div>
					<div class="ml-4">
						<h3 class="mb-2 text-lg font-semibold text-gray-900">Create User Account</h3>
						<p class="mb-3 text-gray-700">
							As an admin, navigate to the Users section and create a new user account. Set their
							email address and basic information.
						</p>
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<code class="text-sm text-gray-800"
								>Users → Add New User → Enter email and details</code
							>
						</div>
					</div>
				</div>

				<div class="flex">
					<div
						class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600"
					>
						b
					</div>
					<div class="ml-4">
						<h3 class="mb-2 text-lg font-semibold text-gray-900">Generate Registration Link</h3>
						<p class="mb-3 text-gray-700">
							Copy the unique registration link that's generated for the new user. This link
							contains their user ID for passkey setup.
						</p>
						<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
							<p class="font-mono text-sm break-all text-blue-900">
								https://{currentDomain}/auth?register=abc123xyz
							</p>
						</div>
					</div>
				</div>

				<div class="flex">
					<div
						class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600"
					>
						c
					</div>
					<div class="ml-4">
						<h3 class="mb-2 text-lg font-semibold text-gray-900">Send to User</h3>
						<p class="mb-3 text-gray-700">
							Share the registration link with the user via email or secure messaging. They'll click
							it to set up their passkey.
						</p>
						<div class="rounded-lg border border-green-200 bg-green-50 p-4">
							<p class="text-sm text-green-900">
								💡 <strong>Tip:</strong> The link is single-use for initial setup. Once they register
								their passkey, they can sign in normally.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- How to Connect from Another Device -->
		<div class="mb-6 rounded-xl bg-white p-8 shadow-lg">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white"
				>
					2
				</div>
				<h2 class="text-2xl font-bold text-gray-900">Connect from Another Device</h2>
			</div>

			<p class="mb-6 text-gray-700">
				Once you've registered a passkey on one device, you have several options to access the app
				from other devices:
			</p>

			<div class="space-y-6">
				<!-- Option 1: Same Device Passkey -->
				<div class="rounded-lg border-2 border-indigo-200 p-6">
					<div class="mb-3 flex items-start">
						<div
							class="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100"
						>
							<svg
								class="h-6 w-6 text-indigo-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-bold text-gray-900">
								Option 1: Use Device's Own Passkey
							</h3>
							<p class="mb-2 text-sm font-medium text-indigo-600">
								Recommended for maximum security
							</p>
						</div>
					</div>
					<ol class="ml-16 list-inside list-decimal space-y-2 text-gray-700">
						<li>
							Visit <span class="rounded bg-gray-100 px-2 py-1 font-mono text-sm"
								>https://{currentDomain}</span
							> on your new device
						</li>
						<li>Request a new registration link from an admin</li>
						<li>Click the link and register a passkey on this device</li>
						<li>Each device will have its own passkey for maximum security</li>
					</ol>
					<div class="mt-4 ml-16 rounded-lg border border-green-200 bg-green-50 p-3">
						<p class="text-sm text-green-800">
							<strong>✓ Most Secure:</strong> Each device has its own unique passkey
						</p>
					</div>
				</div>

				<!-- Option 2: Cross-Device Passkey -->
				<div class="rounded-lg border-2 border-blue-200 p-6">
					<div class="mb-3 flex items-start">
						<div
							class="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100"
						>
							<svg
								class="h-6 w-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-bold text-gray-900">
								Option 2: Use Phone to Sign In on Computer
							</h3>
							<p class="mb-2 text-sm font-medium text-blue-600">Convenient for trusted devices</p>
						</div>
					</div>
					<ol class="ml-16 list-inside list-decimal space-y-2 text-gray-700">
						<li>
							Visit <span class="rounded bg-gray-100 px-2 py-1 font-mono text-sm"
								>https://{currentDomain}</span
							> on your computer
						</li>
						<li>Click "Sign in with Passkey"</li>
						<li>Choose "Use a phone, tablet, or security key"</li>
						<li>Scan the QR code with your phone</li>
						<li>Approve the sign-in on your phone using biometrics</li>
					</ol>
					<div class="mt-4 ml-16 rounded-lg border border-blue-200 bg-blue-50 p-3">
						<p class="text-sm text-blue-800">
							<strong>✓ Convenient:</strong> Use your phone's passkey to sign in on other devices
						</p>
					</div>
				</div>

				<!-- Option 3: Synced Passkeys -->
				<div class="rounded-lg border-2 border-purple-200 p-6">
					<div class="mb-3 flex items-start">
						<div
							class="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100"
						>
							<svg
								class="h-6 w-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-bold text-gray-900">
								Option 3: Synced Passkeys (Apple/Google)
							</h3>
							<p class="mb-2 text-sm font-medium text-purple-600">
								Automatic if using iCloud Keychain or Google Password Manager
							</p>
						</div>
					</div>
					<div class="ml-16 space-y-3">
						<p class="text-gray-700">
							If you registered a passkey on an iPhone/Mac or Android device with sync enabled, your
							passkey automatically syncs to other devices signed into the same account:
						</p>
						<ul class="list-inside list-disc space-y-1 text-gray-700">
							<li>
								<strong>Apple:</strong> Passkeys sync via iCloud Keychain across iPhone, iPad, and Mac
							</li>
							<li>
								<strong>Google:</strong> Passkeys sync via Google Password Manager across Android and
								Chrome
							</li>
						</ul>
						<div class="rounded-lg border border-purple-200 bg-purple-50 p-3">
							<p class="text-sm text-purple-800">
								<strong>✓ Seamless:</strong> Sign in on any of your synced devices without additional
								setup
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Common Questions -->
		<div class="mb-6 rounded-xl bg-white p-8 shadow-lg">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Common Questions</h2>

			<div class="space-y-6">
				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100"
					>
						<span class="font-semibold text-gray-900">What happens if I lose my device?</span>
						<span class="text-gray-500 transition group-open:rotate-180">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</span>
					</summary>
					<div class="px-4 pt-4 pb-2 text-gray-700">
						If you lose your device, contact an admin to generate a new registration link. You can
						then register a passkey on a new device. If your passkeys were synced to iCloud or
						Google, they'll be available on your other devices automatically.
					</div>
				</details>

				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100"
					>
						<span class="font-semibold text-gray-900"
							>Can I have multiple passkeys for one app?</span
						>
						<span class="text-gray-500 transition group-open:rotate-180">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</span>
					</summary>
					<div class="px-4 pt-4 pb-2 text-gray-700">
						Yes! You can register multiple passkeys for the same app—one for your phone, one for
						your laptop, etc. Each registration link will add a new passkey to your account. When
						signing in, you can choose which passkey to use.
					</div>
				</details>

				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100"
					>
						<span class="font-semibold text-gray-900">Is this more secure than passwords?</span>
						<span class="text-gray-500 transition group-open:rotate-180">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</span>
					</summary>
					<div class="px-4 pt-4 pb-2 text-gray-700">
						Yes! Passkeys are resistant to phishing, can't be guessed or stolen in data breaches,
						and require physical access to your device plus biometric verification. They're built on
						industry-standard cryptography and are considered the most secure authentication method
						available.
					</div>
				</details>

				<details class="group">
					<summary
						class="flex cursor-pointer list-none items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100"
					>
						<span class="font-semibold text-gray-900"
							>Which browsers and devices support passkeys?</span
						>
						<span class="text-gray-500 transition group-open:rotate-180">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</span>
					</summary>
					<div class="px-4 pt-4 pb-2 text-gray-700">
						Passkeys work on modern browsers including Chrome, Safari, Edge, and Firefox on iOS 16+,
						macOS 13+, Android 9+, and Windows 10+. Most devices from the last few years support
						passkeys.
					</div>
				</details>
			</div>
		</div>

		<!-- Quick Reference -->
		<div class="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
			<h2 class="mb-4 text-2xl font-bold">Quick Reference</h2>
			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<h3 class="mb-2 flex items-center font-semibold">
						<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
							/>
						</svg>
						For Admins
					</h3>
					<ul class="space-y-1 text-indigo-100">
						<li>• Create user account</li>
						<li>• Generate registration link</li>
						<li>• Send link securely to user</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-2 flex items-center font-semibold">
						<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						For Users
					</h3>
					<ul class="space-y-1 text-indigo-100">
						<li>• Click registration link</li>
						<li>• Set up passkey with biometrics</li>
						<li>• Sign in on other devices as needed</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Back Button -->
		<div class="mt-8 text-center">
			<a
				href="/"
				class="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-800"
			>
				<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Dashboard
			</a>
		</div>
	</div>
</div>
